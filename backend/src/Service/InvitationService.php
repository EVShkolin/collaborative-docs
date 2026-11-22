<?php

namespace App\Service;

use App\DTO\Invitation\InvitationRequestDto;
use App\DTO\Invitation\InvitationResponseDto;
use App\Entity\Document;
use App\Entity\DocumentParticipant;
use App\Entity\Invitation;
use App\Entity\User;
use App\Enum\InvitationStatus;
use App\Enum\ParticipantRole;
use App\Exception\ObjectNotFoundException;
use App\Mapper\InvitationMapper;
use App\Repository\InvitationRepository;
use App\Security\UserContext;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\Uid\Uuid;

readonly class InvitationService
{
    public function __construct(
        private EntityManagerInterface $em,
        private InvitationRepository $invitationRepository,
        private InvitationMapper $mapper,
        private ParticipantService $participantService,
        private UserContext $userContext,
        private LoggerInterface $log,
    ) {}

    /**
     * @return InvitationResponseDto[]
     */
    public function findAll(): array
    {
        $this->log->debug("IN InvitationService findAll for user {$this->userContext->getUserId()}");

        $invitations = $this->invitationRepository->findPendingForUser($this->userContext->getUserId());

        return array_map(fn(Invitation $invitation) => $this->mapper->toDto($invitation), $invitations);
    }

    public function save(InvitationRequestDto $dto): InvitationResponseDto
    {
        $this->log->debug("IN InvitationService save for document $dto->documentId");

        $invitedBy = $this->userContext->getUser();
        $document = $this->em->find(Document::class, $dto->documentId)
            ?? throw new ObjectNotFoundException('Document', $dto->documentId);

        if (!$document->getOwner()->getId()->equals($invitedBy->getId())) {
            throw new AccessDeniedHttpException('Only the document owner can invite participants');
        }

        if ($dto->role === ParticipantRole::OWNER) {
            throw new ConflictHttpException('Document cannot have second owner');
        }

        $invitedUser = $this->em->getRepository(User::class)->findOneBy(['email' => $dto->invitedUserEmail])
            ?? throw new ObjectNotFoundException('User', $dto->invitedUserEmail);

        $existingParticipant = $this->em->getRepository(DocumentParticipant::class)->findOneBy([
            'document' => $document,
            'user' => $invitedUser,
        ]);

        if ($existingParticipant) {
            throw new ConflictHttpException('User is already a participant.');
        }

        if ($this->invitationRepository->findPendingForDocumentAndUser($document, $invitedUser)) {
            throw new ConflictHttpException('Invitation is already pending.');
        }

        $invitation = $this->mapper->toEntity($dto, $invitedBy, $invitedUser, $document);

        $this->em->persist($invitation);
        $this->em->flush();

        return $this->mapper->toDto($invitation);
    }

    public function accept(Uuid $id): InvitationResponseDto
    {
        $this->log->debug("IN InvitationService accept $id");

        $invitation = $this->findPendingForCurrentUser($id);

        $this->em->wrapInTransaction(function () use ($invitation): void {
            $this->participantService->add(
                $invitation->getDocument()->getId(),
                $invitation->getInvitedUser()->getEmail(),
                $invitation->getRole(),
            );

            $invitation->setStatus(InvitationStatus::ACCEPTED);
            $invitation->setRespondedAt(new \DateTimeImmutable());
            $this->em->flush();
        });

        return $this->mapper->toDto($invitation);
    }

    public function decline(Uuid $id): InvitationResponseDto
    {
        $this->log->debug("IN InvitationService decline $id");

        $invitation = $this->findPendingForCurrentUser($id);

        $invitation->setStatus(InvitationStatus::DECLINED);
        $invitation->setRespondedAt(new \DateTimeImmutable());
        $this->em->flush();

        return $this->mapper->toDto($invitation);
    }

    private function findPendingForCurrentUser(Uuid $id): Invitation
    {
        $invitation = $this->em->find(Invitation::class, $id)
            ?? throw new ObjectNotFoundException('Invitation', $id->toString());

        if (!$invitation->getInvitedUser()->getId()->equals($this->userContext->getUserId())) {
            throw new AccessDeniedHttpException('Only the invited user can respond to this invitation');
        }

        if ($invitation->getStatus() !== InvitationStatus::PENDING) {
            throw new ConflictHttpException('Invitation has already been processed');
        }

        return $invitation;
    }
}

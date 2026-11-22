<?php

namespace App\Service;

use App\DTO\Participant\ParticipantResponseDto;
use App\Entity\Document;
use App\Entity\DocumentParticipant;
use App\Entity\User;
use App\Enum\ParticipantRole;
use App\Exception\ObjectNotFoundException;
use App\Mapper\ParticipantMapper;
use App\Message\Event\ParticipantAddedEvent;
use App\Message\Event\ParticipantDeletedEvent;
use App\Message\Event\RoleChangedEvent;
use App\Security\UserContext;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\Messenger\Bridge\Amqp\Transport\AmqpStamp;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Uid\Uuid;

readonly class ParticipantService
{
    public function __construct(
        private EntityManagerInterface $em,
        private MessageBusInterface $messageBus,
        private ParticipantMapper $mapper,
        private UserContext $userContext,
        private LoggerInterface $log
    ) {}

    /**
     * @return ParticipantResponseDto[]
     */
    public function findAllByDocument(Uuid $documentId): array
    {
        $participants = $this->em->getRepository(DocumentParticipant::class)->findBy(
            ['document' => $documentId]
        );

        return array_map(fn($p) => $this->mapper->toDto($p), $participants);
    }

    public function add(Uuid $documentId, string $email, ParticipantRole $role): ParticipantResponseDto
    {
        $this->log->debug("Adding user $email to doc $documentId");

        if ($role === ParticipantRole::OWNER) {
            throw new ConflictHttpException('Document cannot have second owner');
        }

        $document = $this->em->find(Document::class, $documentId)
            ?? throw new ObjectNotFoundException('Document', $documentId->toString());

        $user = $this->em->getRepository(User::class)->findOneBy(['email' => $email])
            ?? throw new ObjectNotFoundException('User', $email);

        if ($document->getOwner()->getId()->equals($user->getId())) {
            throw new ConflictHttpException('User is already the owner of this document.');
        }

        $existing = $this->em->getRepository(DocumentParticipant::class)->findOneBy([
            'document' => $document,
            'user' => $user
        ]);

        if ($existing) {
            throw new ConflictHttpException('User is already a participant.');
        }

        $participant = new DocumentParticipant($user, $document, $role);

        $this->em->persist($participant);
        $this->em->flush();

        $participantDto = $this->mapper->toDto($participant);

        $this->messageBus->dispatch(
            new ParticipantAddedEvent($documentId->toString(), $participantDto),
            [new AmqpStamp('participant.added')]
        );

        return $participantDto;
    }

    public function changeRole(Uuid $documentId, Uuid $participantId, ParticipantRole $role): void {
        $this->log->debug("Changing role $role->value for [$participantId]");

        if ($role === ParticipantRole::OWNER) throw new ConflictHttpException('Document cannot have second owner');

        $participant = $this->em->find(DocumentParticipant::class, $participantId)
            ?? throw new ObjectNotFoundException('Participant', $participantId->toString());
        $document = $this->em->find(Document::class, $documentId)
            ?? throw new ObjectNotFoundException('Document', $documentId->toString());

        if (!$document->getOwner()->getId()->equals($this->userContext->getUserId())) {
            throw new AccessDeniedHttpException('Only owners of this document can change roles');
        }

        $participant->setRole($role);
        $this->em->flush();

        $this->messageBus->dispatch(
            new RoleChangedEvent($documentId, $participantId, $role),
            [new AmqpStamp('participant.role.changed')]
        );
    }

    public function remove(Uuid $documentId, Uuid $participantId): void
    {
        $this->log->debug("Removing user $participantId from doc $documentId");

        $participant = $this->em->find(DocumentParticipant::class, $participantId)
            ?? throw new ObjectNotFoundException('Participant', $participantId);

        $this->em->remove($participant);
        $this->em->flush();

        $this->messageBus->dispatch(
            new ParticipantDeletedEvent($documentId, $participantId),
            [new AmqpStamp('participant.deleted')]
        );
    }
}

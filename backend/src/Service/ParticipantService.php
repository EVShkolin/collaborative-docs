<?php

namespace App\Service;

use App\DTO\Participant\ParticipantRequestDto;
use App\DTO\Participant\ParticipantResponseDto;
use App\Entity\Document;
use App\Entity\DocumentParticipant;
use App\Entity\User;
use App\Exception\ObjectNotFoundException;
use App\Mapper\ParticipantMapper;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\Uid\Uuid;

readonly class ParticipantService
{
    public function __construct(
        private EntityManagerInterface $em,
        private ParticipantMapper $mapper,
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

    public function addParticipant(Uuid $documentId, ParticipantRequestDto $dto): ParticipantResponseDto
    {
        $this->log->debug("Adding user $dto->email to doc $documentId");

        $document = $this->em->find(Document::class, $documentId)
            ?? throw new ObjectNotFoundException('Document', $documentId->toString());

        $user = $this->em->getRepository(User::class)->findOneBy(['email' => $dto->email])
            ?? throw new ObjectNotFoundException('User', $dto->email);

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

        $participant = new DocumentParticipant($user, $document);

        $this->em->persist($participant);
        $this->em->flush();

        return $this->mapper->toDto($participant);
    }

    public function removeParticipant(Uuid $documentId, Uuid $participantId): void
    {
        $this->log->debug("Removing user $participantId from doc $documentId");

        $participant = $this->em->find(DocumentParticipant::class, $participantId);
        if ($participant === null || !$participant->getId()->equals($documentId)) {
            throw new ObjectNotFoundException('Participant', $participantId->toString());
        }

        $this->em->remove($participant);
        $this->em->flush();
    }
}

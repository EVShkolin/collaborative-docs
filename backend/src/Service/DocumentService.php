<?php

namespace App\Service;

use App\DTO\Document\DocumentAccessDto;
use App\DTO\Document\DocumentRequestDto;
use App\DTO\Document\DocumentResponseDto;
use App\DTO\Document\DocumentWithParticipantDto;
use App\Entity\Document;
use App\Entity\DocumentParticipant;
use App\Enum\ParticipantRole;
use App\Exception\ObjectNotFoundException;
use App\Mapper\DocumentMapper;
use App\Repository\DocumentRepository;
use App\Security\UserContext;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Psr\Log\LoggerInterface;

use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Uid\Uuid;

readonly class DocumentService
{
    public function __construct(
        private DocumentRepository     $documentRepository,
        private EntityManagerInterface $em,
        private UserContext            $userContext,
        private JWTEncoderInterface    $jwtEncoder,
        private DocumentMapper         $mapper,
        private LoggerInterface        $log
    ) {}

    /**
     * @return DocumentResponseDto[]
     */
    public function findAll(): array
    {
        $this->log->debug("IN DocumentService findAll for user {$this->userContext->getUserId()}");

        $pairs = $this->documentRepository->findAvailableForUserWithParticipant($this->userContext->getUserId());

        return array_map(
            fn(array $pair) => $this->mapper->toDtoWithParticipant($pair[0], $pair[1]),
            $pairs
        );
    }

    public function findById(Uuid $id): DocumentWithParticipantDto
    {
        $this->log->debug("IN DocumentService findById $id");
        $document = $this->em->find(Document::class, $id)
            ?? throw new ObjectNotFoundException('Document', $id);
        $participant = $this->em->getRepository(DocumentParticipant::class)->findOneBy([
            'document' => $document,
            'user' => $this->userContext->getUser()
        ]) ?? throw new AccessDeniedException("You are not authorized to access this document");

        return $this->mapper->toDtoWithParticipant($document, $participant);
    }

    public function accessDocument(Uuid $id): DocumentAccessDto
    {
        $this->log->debug("IN DocumentService generateWsToken for document $id");

        $document = $this->em->find(Document::class, $id)
            ?? throw new ObjectNotFoundException('Document', $id);

        $participant = $this->em->getRepository(DocumentParticipant::class)->findOneBy([
            'document' => $document,
            'user' => $this->userContext->getUser()
        ]) ?? throw new AccessDeniedException("You are not authorized to access this document");

        $participant->access();
        $this->em->flush();

        $wsToken = $this->jwtEncoder->encode([
            'documentId' => $document->getId()->toString(),
            'userId' => $this->userContext->getUserId(),
            'participantId' => $participant->getId(),
            'username' => $this->userContext->getUser()->getName(),
            'role' => $participant->getRole(),
            'exp' => time() + 60,
        ]);

        return new DocumentAccessDto($wsToken, $participant->getId(), $participant->getRole());
    }

    public function save(DocumentRequestDto $dto): DocumentWithParticipantDto
    {
        $this->log->debug("IN DocumentService save $dto->title");

        $user = $this->userContext->getUser();
        $document = $this->mapper->toEntity($dto, $user);

        return $this->em->wrapInTransaction(function () use ($document, $user) {
            $this->em->persist($document);
            $participant = new DocumentParticipant($user, $document, role: ParticipantRole::OWNER);
            $this->em->persist($participant);
            $this->em->flush();

            return $this->mapper->toDtoWithParticipant($document, $participant);
        });
    }

    public function update(Uuid $id, DocumentRequestDto $dto): DocumentWithParticipantDto
    {
        $this->log->debug("IN DocumentService update $id");

        $document = $this->em->find(Document::class, $id)
            ?? throw new ObjectNotFoundException('Document', $id);
        $participant = $this->em->getRepository(DocumentParticipant::class)->findOneBy([
            'document' => $document,
            'user' => $this->userContext->getUser()
        ]) ?? throw new AccessDeniedException("You are not authorized to access this document");

        if ($document->getOwner()->getId() !== $this->userContext->getUserId())
            throw new AccessDeniedException("You are not authorized to edit this document");

        $document->setTitle($dto->title);
        $this->em->flush();

        return $this->mapper->toDtoWithParticipant($document, $participant);
    }

    public function delete(Uuid $id): void
    {
        $this->log->debug("IN DocumentService delete $id");

        $document = $this->em->find(Document::class, $id)
            ?? throw new ObjectNotFoundException('Document', $id);

        if (!$document->getOwner()->getId()->equals($this->userContext->getUserId())) {
            throw new AccessDeniedException('Only the owner can delete documents');
        }

        $this->em->remove($document);
        $this->em->flush();
    }

}

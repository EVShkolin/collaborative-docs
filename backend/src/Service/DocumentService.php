<?php

namespace App\Service;

use App\DTO\Document\DocumentAccessDto;
use App\DTO\Document\DocumentRequestDto;
use App\DTO\Document\DocumentResponseDto;
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
        private ParticipantService     $participantService,
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

        $documents = $this->documentRepository->findAvailableForUser($this->userContext->getUserId());
        return array_map(fn(Document $doc) => $this->mapper->toDto($doc), $documents);
    }

    public function findById(Uuid $id): DocumentResponseDto
    {
        $this->log->debug("IN DocumentService findById $id");
        $document = $this->em->find(Document::class, $id)
            ?? throw new ObjectNotFoundException('Document', $id);
        // TODO: check visibility of the document
        return $this->mapper->toDto($document);
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

        $wsToken =  $this->jwtEncoder->encode([
            'documentId' => $document->getId()->toString(),
            'userId' => $this->userContext->getUserId(),
            'participantId' => $participant->getId(),
            'username' => $this->userContext->getUser()->getName(),
            'role' => $participant->getRole(),
            'exp' => time() + 60,
        ]);

        return new DocumentAccessDto($wsToken, $participant->getId(), $participant->getRole());
    }

    public function save(DocumentRequestDto $dto): DocumentResponseDto
    {
        $this->log->debug("IN DocumentService save $dto->title");

        $user = $this->userContext->getUser();
        $document = $this->mapper->toEntity($dto, $user);

        return $this->em->wrapInTransaction(function () use ($document, $user) {
            $this->em->persist($document);
            $this->em->persist(new DocumentParticipant($user, $document, role: ParticipantRole::OWNER));
            $this->em->flush();

            return $this->mapper->toDto($document);
        });
    }

    public function update(Uuid $id, DocumentRequestDto $dto): DocumentResponseDto
    {
        $this->log->debug("IN DocumentService update $id");

        $document = $this->em->find(Document::class, $id)
            ?? throw new ObjectNotFoundException('Document', $id);
        if ($document->getOwner()->getId() !== $this->userContext->getUserId())
            throw new AccessDeniedException("You are not authorized to edit this document");

        $document->setTitle($dto->title);
        $this->em->flush();

        return $this->mapper->toDto($document);
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

<?php

namespace App\Service;

use App\DTO\Document\DocumentRequestDto;
use App\DTO\Document\DocumentResponseDto;
use App\Entity\Document;
use App\Entity\User;
use App\Exception\ObjectNotFoundException;
use App\Mapper\DocumentMapper;
use App\Repository\DocumentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\Uid\Uuid;

readonly class DocumentService
{
    private Uuid $tmpUserId;

    public function __construct(
        private DocumentRepository $documentRepository,
        private EntityManagerInterface $em,
        private DocumentMapper $mapper,
        private LoggerInterface $log
    )
    {
        // TODO get id from security context
        $this->tmpUserId = new Uuid('01a17472-729a-706c-ac38-7eece462fe47');
    }

    /**
     * @return DocumentResponseDto[]
     */
    public function findAll(): array
    {
        $this->log->debug("IN DocumentService findAll for user $this->tmpUserId");

        $documents = $this->documentRepository->findAvailableForUser($this->tmpUserId);
        $this->log->debug("IN DocumentService found all docs");
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

    public function save(DocumentRequestDto $dto): DocumentResponseDto
    {
        $this->log->debug("IN DocumentService save $dto->title");

        // TODO: use id from security context
        $user = $this->em->getReference(User::class, $this->tmpUserId);
        $document = $this->mapper->toEntity($dto, $user);

        $this->em->persist($document);
        $this->em->flush();

        return $this->mapper->toDto($document);
    }

    public function update(Uuid $id, DocumentRequestDto $dto): DocumentResponseDto
    {
        $this->log->debug("IN DocumentService update $id");

        $document = $this->em->find(Document::class, $id)
            ?? throw new ObjectNotFoundException('Document', $id);
        $document->setTitle($dto->title);
        $this->em->flush();

        return $this->mapper->toDto($document);
    }

    public function delete(Uuid $id): void
    {
        $this->log->debug("IN DocumentService delete $id");

        $document = $this->em->find(Document::class, $id)
            ?? throw new ObjectNotFoundException('Document', $id);

        // TODO: use id from security context
        if (!$document->getOwner()->getId()->equals($this->tmpUserId)) {
            throw new AccessDeniedException('Only the owner can delete documents');
        }

        $this->em->remove($document);
        $this->em->flush();
    }

}

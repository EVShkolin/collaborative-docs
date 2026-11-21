<?php

namespace App\Service;

use App\DTO\Comment\CommentRequestDto;
use App\DTO\Comment\CommentResponseDto;
use App\Entity\Comment;
use App\Entity\Document;
use App\Entity\DocumentParticipant;
use App\Enum\ParticipantRole;
use App\Exception\ObjectNotFoundException;
use App\Mapper\CommentMapper;
use App\Message\Event\CommentCreatedEvent;
use App\Message\Event\CommentDeletedEvent;
use App\Security\UserContext;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\Messenger\Bridge\Amqp\Transport\AmqpStamp;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Uid\Uuid;

readonly class CommentService
{
    public function __construct(
        private CommentMapper          $mapper,
        private UserContext            $userContext,
        private EntityManagerInterface $em,
        private MessageBusInterface    $messageBus,
        private LoggerInterface        $log
    ) {}

    /**
     * @return CommentResponseDto[]
     */
    public function findAllByDocument(Uuid $documentId): array
    {
        $this->log->debug("IN CommentService->findAllByDocument $documentId");

        $participant = $this->em->getRepository(DocumentParticipant::class)->findOneBy([
            'user' => $this->userContext->getUserId(),
            'document' => $documentId
        ]) ?? throw new ObjectNotFoundException('Document', $documentId);

        $comments = $this->em->getRepository(Comment::class)->findBy(['document' => $documentId]);

        return array_map(fn(Comment $c) => $this->mapper->toDto($c), $comments);
    }

    public function save(Uuid $documentId, CommentRequestDto $dto): CommentResponseDto
    {
        $this->log->debug("IN CommentService save new comment in document [$documentId]");

        $document = $this->em->find(Document::class, $documentId)
            ?? throw new ObjectNotFoundException('Document', $documentId);
        $user = $this->userContext->getUser();
        $participant = $this->em->getRepository(DocumentParticipant::class)->findOneBy([
            'user' => $this->userContext->getUserId(),
            'document' => $documentId
        ]) ?? throw new ObjectNotFoundException('Document', $documentId);

        if ($participant->getRole() === ParticipantRole::VIEWER)
            throw new AccessDeniedException('You cannot add comments in this document');

        $comment = $this->mapper->toEntity($dto, $document, $user);
        $this->em->persist($comment);
        $this->em->flush();

        $this->messageBus->dispatch(
            new CommentCreatedEvent($documentId, $comment->getId()),
            [new AmqpStamp('comment.created')]
        );

        return $this->mapper->toDto($comment);
    }

    public function update(Uuid $commentId, CommentRequestDto $dto): CommentResponseDto
    {
        $this->log->debug("IN CommentService update comment [$commentId]");

        $comment = $this->em->find(Comment::class, $commentId)
            ?? throw new ObjectNotFoundException('Comment', $commentId);
        if ($comment->getCreator()->getId() !== $this->userContext->getUserId())
            throw new AccessDeniedException('Only creator can update their comments');

        $comment->setContent($dto->content);
        $this->em->flush();

        return $this->mapper->toDto($comment);
    }

    public function delete(Uuid $commentId): void
    {
        $this->log->debug("IN CommentService delete [$commentId]");

        $comment = $this->em->find(Comment::class, $commentId)
            ?? throw new ObjectNotFoundException('Comment', $commentId);

        if ($comment->getCreator()->getId() !== $this->userContext->getUserId()
            && $comment->getDocument()->getOwner()->getId() !== $this->userContext->getUserId())
            throw new AccessDeniedException('Only creator or document owner can delete comments');

        $event = new CommentDeletedEvent($comment->getDocument()->getId(), $commentId);

        $this->em->remove($comment);
        $this->em->flush();

        $this->messageBus->dispatch(
            $event,
            [new AmqpStamp('comment.deleted')]
        );
    }
}

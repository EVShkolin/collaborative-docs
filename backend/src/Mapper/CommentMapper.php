<?php

namespace App\Mapper;

use App\DTO\Comment\CommentRequestDto;
use App\DTO\Comment\CommentResponseDto;
use App\Entity\Comment;
use App\Entity\Document;
use App\Entity\User;

readonly class CommentMapper
{
    public function __construct(
        private UserMapper $userMapper,
    ) {}

    public function toDto(Comment $comment): CommentResponseDto
    {
        return new CommentResponseDto(
            $comment->getId(),
            $comment->getContent(),
            $comment->getDocument()->getId(),
            $this->userMapper->toDto($comment->getCreator()),
            $comment->getCreatedAt(),
            $comment->getUpdatedAt()
        );
    }

    public function toEntity(CommentRequestDto $dto, Document $document, User $user): Comment
    {
        return new Comment(
            $dto->content,
            $document,
            $user
        );
    }
}

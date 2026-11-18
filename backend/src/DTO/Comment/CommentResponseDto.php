<?php

namespace App\DTO\Comment;

use App\DTO\User\UserResponseDto;

readonly class CommentResponseDto
{
    public function __construct(
        public string $id,
        public string $content,
        public string $documentId,
        public UserResponseDto $creator,
        public \DateTimeImmutable $createdAt,
        public \DateTimeImmutable $updatedAt,
    ) {}
}

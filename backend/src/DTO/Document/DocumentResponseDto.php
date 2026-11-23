<?php

namespace App\DTO\Document;

use App\DTO\User\UserResponseDto;
use Symfony\Component\Uid\Uuid;

readonly class DocumentResponseDto
{
    public function __construct(
        public Uuid               $id,
        public string             $title,
        public UserResponseDto    $owner,
        public \DateTimeImmutable $createdAt
    ) {}
}

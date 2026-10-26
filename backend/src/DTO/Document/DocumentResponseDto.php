<?php

namespace App\DTO\Document;

use App\DTO\User\UserResponseDto;

readonly class DocumentResponseDto
{
    public function __construct(
        public string             $id,
        public string             $title,
        public UserResponseDto    $owner,
        public \DateTimeImmutable $createdAt
    ) {}
}

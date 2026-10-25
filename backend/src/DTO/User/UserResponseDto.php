<?php

namespace App\DTO\User;

use DateTimeImmutable;

readonly class UserResponseDto
{
    public function __construct(
        public string            $id,
        public string            $name,
        public string            $email,
        public ?string           $avatarUrl,
        public DateTimeImmutable $createdAt,
    ) {}
}

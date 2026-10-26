<?php

namespace App\DTO\Participant;

use App\DTO\User\UserResponseDto;

readonly class ParticipantResponseDto
{
    public function __construct(
        public string $id,
        public UserResponseDto $user,
        public string $role,
        public \DateTimeImmutable $joinedAt
    ) {}
}

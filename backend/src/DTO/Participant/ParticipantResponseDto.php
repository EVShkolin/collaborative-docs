<?php

namespace App\DTO\Participant;

use App\DTO\User\UserResponseDto;
use App\Enum\ParticipantRole;

readonly class ParticipantResponseDto
{
    public function __construct(
        public string $id,
        public UserResponseDto $user,
        public ParticipantRole $role,
        public \DateTimeImmutable $joinedAt
    ) {}
}

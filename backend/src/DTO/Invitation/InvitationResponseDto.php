<?php

namespace App\DTO\Invitation;

use App\DTO\Document\DocumentResponseDto;
use App\DTO\User\UserResponseDto;
use App\Enum\ParticipantRole;
use Symfony\Component\Uid\Uuid;

readonly class InvitationResponseDto
{
    public function __construct(
        public Uuid $id,
        public Uuid $invitedUserId,
        public UserResponseDto $invitedBy,
        public ParticipantRole $role,
        public DocumentResponseDto $document,
        public \DateTimeImmutable $invitedAt,
    ) {}
}

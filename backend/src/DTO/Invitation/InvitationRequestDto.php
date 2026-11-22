<?php

namespace App\DTO\Invitation;

use App\Enum\ParticipantRole;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

readonly class InvitationRequestDto
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Email]
        public string $invitedUserEmail,

        #[Assert\NotNull]
        public Uuid $documentId,

        public ParticipantRole $role,
    ) {}
}

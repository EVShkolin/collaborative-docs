<?php

namespace App\DTO\Document;

use App\Enum\ParticipantRole;
use Symfony\Component\Uid\Uuid;

readonly class DocumentAccessDto
{
    public function __construct(
        public string $token,
        public Uuid $participantId,
        public ParticipantRole $role
    ) {}
}

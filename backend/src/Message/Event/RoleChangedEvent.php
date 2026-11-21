<?php

namespace App\Message\Event;

use App\Enum\ParticipantRole;
use Symfony\Component\Uid\Uuid;

readonly class RoleChangedEvent
{
    public function __construct(
        public Uuid $documentId,
        public Uuid $participantId,
        public ParticipantRole $role,
    ) {}
}

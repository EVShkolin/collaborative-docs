<?php

namespace App\Message\Event;

readonly class ParticipantDeletedEvent
{
    public function __construct(
        public string $documentId,
        public string $participantId,
    ) {}
}

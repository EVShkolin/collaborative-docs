<?php

namespace App\Message\Event;

use App\DTO\Participant\ParticipantResponseDto;

readonly class ParticipantAddedEvent
{
    public function __construct(
        public string $documentId,
        public ParticipantResponseDto $participant,
    ) {}
}

<?php

namespace App\DTO\Participant;

readonly class ParticipantRequestDto
{
    public function __construct(
        public string $email,
    ) {}
}

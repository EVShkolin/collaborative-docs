<?php

namespace App\DTO\Document;

use App\Enum\ParticipantRole;

readonly class DocumentAccessDto
{
    public function __construct(
        public string $token,
        public ParticipantRole $role
    ) {}
}

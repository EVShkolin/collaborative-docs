<?php

namespace App\DTO\Document;

use App\DTO\User\UserResponseDto;
use Symfony\Component\Uid\Uuid;

readonly class DocumentWithParticipantDto
{
    public function __construct(
        public Uuid               $id,
        public string             $title,
        public Uuid               $participantId,
        public UserResponseDto    $owner,
        public \DateTimeImmutable $lastAccessedAt
    ) {}
}

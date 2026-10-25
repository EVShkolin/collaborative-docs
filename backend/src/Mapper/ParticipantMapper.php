<?php

namespace App\Mapper;

use App\DTO\Participant\ParticipantResponseDto;
use App\Entity\DocumentParticipant;

readonly class ParticipantMapper
{
    public function __construct(
        private UserMapper $userMapper
    ) {}

    public function toDto(DocumentParticipant $participant): ParticipantResponseDto
    {
        return new ParticipantResponseDto(
            $participant->getId(),
            $this->userMapper->toDto($participant->getUser()),
            $participant->getRole()->value,
            $participant->getJoinedAt()
        );
    }

}

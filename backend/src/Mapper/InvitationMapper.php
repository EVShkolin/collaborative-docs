<?php

namespace App\Mapper;

use App\DTO\Invitation\InvitationRequestDto;
use App\DTO\Invitation\InvitationResponseDto;
use App\Entity\Document;
use App\Entity\Invitation;
use App\Entity\User;

readonly class InvitationMapper
{
    public function __construct(
        private UserMapper $userMapper,
        private DocumentMapper $documentMapper,
    ) {}

    public function toDto(Invitation $invitation): InvitationResponseDto
    {
        return new InvitationResponseDto(
            $invitation->getId(),
            $invitation->getInvitedUser()->getId(),
            $this->userMapper->toDto($invitation->getInvitedBy()),
            $invitation->getRole(),
            $this->documentMapper->toDto($invitation->getDocument()),
            $invitation->getInvitedAt(),
        );
    }

    public function toEntity(
        InvitationRequestDto $dto,
        User $invitedBy,
        User $invitedUser,
        Document $document,
    ): Invitation {
        return new Invitation($invitedUser, $invitedBy, $document, $dto->role);
    }
}

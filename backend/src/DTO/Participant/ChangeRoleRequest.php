<?php

namespace App\DTO\Participant;

use App\Enum\ParticipantRole;

readonly class ChangeRoleRequest
{
    public function __construct(
        public ParticipantRole $role,
    ) {}
}

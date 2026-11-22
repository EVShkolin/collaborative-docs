<?php

namespace App\DTO\Invitation;

use App\Enum\InvitationAction;

readonly class InvitationActionRequestDto
{
    public function __construct(
        public InvitationAction $action,
    ) {}
}

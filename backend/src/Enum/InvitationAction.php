<?php

namespace App\Enum;

enum InvitationAction: string
{
    case ACCEPT = 'accept';
    case DECLINE = 'decline';
}

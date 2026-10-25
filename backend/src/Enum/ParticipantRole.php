<?php

namespace App\Enum;

enum ParticipantRole: string
{
    case VIEWER = 'viewer';
    case COMMENTER = 'commenter';
    case EDITOR = 'editor';
}

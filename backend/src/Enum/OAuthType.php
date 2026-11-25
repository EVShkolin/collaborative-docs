<?php

namespace App\Enum;

enum OAuthType: string
{
    case GOOGLE = 'google';
    case GITHUB = 'github';
}

<?php

namespace App\DTO\User;

use Symfony\Component\Validator\Constraints as Assert;

class UserUpdateDto
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Length(min: 4, max: 30)]
        public string $name,
    ) {}
}

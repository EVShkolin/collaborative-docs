<?php

namespace App\DTO\User;

use App\Entity\User;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;

#[UniqueEntity(fields: ['email'], message: 'The email {{ value }} already exists.', entityClass: User::class)]
readonly class UserCreateDto
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Length(min: 4, max: 30)]
        public string $name,

        #[Assert\NotBlank]
        #[Assert\Email]
        public string $email,

        #[Assert\NotBlank]
        #[Assert\Length(min: 5, max: 30)]
        public string $password
    ) {}
}

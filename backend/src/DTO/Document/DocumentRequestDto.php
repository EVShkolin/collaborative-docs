<?php

namespace App\DTO\Document;

use Symfony\Component\Validator\Constraints as Assert;

readonly class DocumentRequestDto
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Length(min: 1, max: 255)]
        public string $title
    ) {}
}

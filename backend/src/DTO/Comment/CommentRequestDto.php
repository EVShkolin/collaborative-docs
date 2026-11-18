<?php

namespace App\DTO\Comment;

use Symfony\Component\Validator\Constraints as Assert;

readonly class CommentRequestDto
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Length(min: 1, max: 1000)]
        public string $content
    ) {}
}

<?php

namespace App\DTO\Error;

use OpenApi\Attributes as OA;

readonly class ValidationErrorDto
{
    public function __construct(
        #[OA\Property(example: 422)]
        public int   $code,

        #[OA\Property(
            type: 'object',
            example: ['email' => 'The email "email1@mail.com" already exists.'],
            additionalProperties: new OA\AdditionalProperties(type: 'string')
        )]
        public array $errors
    ) {}
}

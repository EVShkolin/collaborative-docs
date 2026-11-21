<?php

namespace App\Message\Event;

readonly class CommentCreatedEvent
{
    public function __construct(
        public string $documentId,
        public string $commentId,
    ) {}
}

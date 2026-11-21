<?php

namespace App\Message\Event;

readonly class CommentDeletedEvent
{
    public function __construct(
        public string $documentId,
        public string $commentId,
    ) {}
}

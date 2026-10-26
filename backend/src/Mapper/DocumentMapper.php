<?php

namespace App\Mapper;

use App\DTO\Document\DocumentRequestDto;
use App\DTO\Document\DocumentResponseDto;
use App\Entity\Document;
use App\Entity\User;

readonly class DocumentMapper
{
    public function __construct(
        private UserMapper $userMapper,
    ) {}

    public function toDto(Document $doc): DocumentResponseDto
    {
        return new DocumentResponseDto(
            $doc->getId(),
            $doc->getTitle(),
            $this->userMapper->toDto($doc->getOwner()),
            $doc->getCreatedAt()
        );
    }

    public function toEntity(DocumentRequestDto $dto, User $user): Document
    {
        return new Document($dto->title, $user);
    }
}

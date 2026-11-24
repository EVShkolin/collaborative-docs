<?php

namespace App\Mapper;

use App\DTO\User\UserCreateDto;
use App\DTO\User\UserResponseDto;
use App\Entity\User;

class UserMapper
{
    public function toDto(User $user): UserResponseDto {
        return new UserResponseDto(
            $user->getId()->toString(),
            $user->getName(),
            $user->getEmail(),
            $this->buildAvatarUrl($user),
            $user->getCreatedAt()
        );
    }

    public function toEntity(UserCreateDto $user): User {
        return new User(
            $user->name,
            $user->email
        );
    }

    private function buildAvatarUrl(User $user): ?string
    {
        if ($user->getAvatar() === null) {
            return null;
        }
        return sprintf('/api/v1/users/%s/avatar?v=%s', $user->getId()->toString(), $user->getAvatar()->getUploadedAt()->format('Y-m-d H:i:s'));
    }
}

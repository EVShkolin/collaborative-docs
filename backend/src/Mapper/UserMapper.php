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
            $user->getAvatarUrl(),
            $user->getCreatedAt()
        );
    }

    public function toEntity(UserCreateDto $user): User {
        return new User(
            $user->name,
            $user->email
        );
    }
}

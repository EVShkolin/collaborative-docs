<?php

namespace App\Service;

use App\DTO\User\UserCreateDto;
use App\DTO\User\UserResponseDto;
use App\DTO\User\UserUpdateDto;
use App\Entity\Avatar;
use App\Entity\User;
use App\Exception\ObjectNotFoundException;
use App\Mapper\UserMapper;
use App\Security\UserContext;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Uid\Uuid;

readonly class UserService
{

    public function __construct(
        private EntityManagerInterface      $em,
        private UserMapper                  $mapper,
        private UserContext                 $userContext,
        private UserPasswordHasherInterface $passwordHasher,
        private LoggerInterface             $log,
    ) {}

    public function findMe(): UserResponseDto
    {
        $this->log->debug("IN UserService findMe");
        $user = $this->userContext->getUser();
        return $this->mapper->toDto($user);
    }

    public function findById(Uuid $id): UserResponseDto
    {
        $this->log->debug("IN UserService findById $id");
        $user = $this->em->find(User::class, $id) ?? throw new ObjectNotFoundException("User", $id->toString());
        return $this->mapper->toDto($user);
    }

    public function save(UserCreateDto $userDto): UserResponseDto
    {
        $this->log->debug("IN UserService save $userDto->email");

        $user = $this->mapper->toEntity($userDto);
        $user->setPasswordHash($this->passwordHasher->hashPassword($user, $userDto->password));

        $this->em->persist($user);
        $this->em->flush();

        $this->log->info("Saved new user $userDto->email");
        return $this->mapper->toDto($user);
    }

    public function update(UserUpdateDto $dto, ?UploadedFile $avatarImage): UserResponseDto
    {
        $user = $this->userContext->getUser();
        $this->log->debug("IN UserService update user {$user->getId()}");

        $user->setName($dto->name);

        if ($avatarImage !== null) {
            $avatar = $user->getAvatar();
            if ($avatar === null) {
                $avatar = new Avatar($user);
                $user->setAvatar($avatar);
            }

            $avatar->setName($avatarImage->getClientOriginalName());
            $avatar->setData($avatarImage->getContent());
            $avatar->setType($avatarImage->getMimeType() ?? 'application/octet-stream');
            $avatar->setSize($avatarImage->getSize() ?? 0);
            $avatar->setUploadedAt(new \DateTimeImmutable());
        }

        $this->em->flush();

        $this->log->info("Updated user {$user->getId()}");
        return $this->mapper->toDto($user);
    }

    public function getAvatar(Uuid $userId): Avatar
    {
        $this->log->debug("IN UserService getAvatar $userId");

        return $this->em->getRepository(Avatar::class)->findOneBy([
            'user' => $this->em->getReference(User::class, $userId),
        ]) ?? throw new ObjectNotFoundException('Avatar', $userId->toString());
    }

    public function delete(Uuid $id): void
    {
        $this->log->debug("IN UserService delete $id");

        $user = $this->em->getReference(User::class, $id);
        $this->em->remove($user);
        $this->em->flush();

        $this->log->info("Deleted user $id");
    }

}

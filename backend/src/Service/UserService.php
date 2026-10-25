<?php

namespace App\Service;

use App\DTO\User\UserCreateDto;
use App\DTO\User\UserResponseDto;
use App\Entity\User;
use App\Exception\ObjectNotFoundException;
use App\Mapper\UserMapper;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Uid\Uuid;

readonly class UserService
{

    public function __construct(
        private EntityManagerInterface      $em,
        private UserMapper                  $mapper,
        private UserPasswordHasherInterface $passwordHasher,
        private LoggerInterface             $log,
    ) {}

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

    public function delete(Uuid $id): void
    {
        $this->log->debug("IN UserService delete $id");

        $user = $this->em->getReference(User::class, $id);
        $this->em->remove($user);
        $this->em->flush();

        $this->log->info("Deleted user $id");
    }

}

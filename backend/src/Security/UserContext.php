<?php

namespace App\Security;

use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\Uid\Uuid;

readonly class UserContext
{
    public function __construct(private Security $security) {}

    /**
     * @returns User
     */
    public function getUser(): User
    {
        $user = $this->security->getUser();
        if (!$user instanceof User) {
            throw new AccessDeniedException();
        }

        return $user;
    }

    public function getUserId(): Uuid
    {
        return $this->getUser()->getId();
    }
}

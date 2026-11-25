<?php

namespace App\Repository;

use App\Entity\User;
use App\Enum\OAuthType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function findByEmail(string $email): ?User
    {
        return $this->findOneBy(['email' => $email]);
    }

    public function findByOAuthConnection(OAuthType $provider, string $providerUserId): ?User
    {
        return $this->createQueryBuilder('u')
            ->join('u.oAuthConnections', 'c')
            ->where('c.provider = :provider')
            ->andWhere('c.providerUserId = :providerUserId')
            ->setParameter('provider', $provider)
            ->setParameter('providerUserId', $providerUserId)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }
}

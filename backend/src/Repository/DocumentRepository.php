<?php

namespace App\Repository;

use App\Entity\Document;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<Document>
 */
class DocumentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Document::class);
    }

    /**
     * @return Document[]
     */
    public function findAvailableForUser(Uuid $userId): array
    {
        return $this->createQueryBuilder('d')
            ->leftJoin('d.participants', 'p')
            ->where('d.owner = :userId')
            ->orWhere('p.user = :userId')
            ->setParameter('userId', $userId->toString())
            ->getQuery()
            ->getResult();
    }
}

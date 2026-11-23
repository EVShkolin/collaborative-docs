<?php

namespace App\Repository;

use App\Entity\Document;
use App\Entity\DocumentParticipant;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Psr\Log\LoggerInterface;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<Document>
 */
class DocumentRepository extends ServiceEntityRepository
{

    private LoggerInterface $log;

    public function __construct(ManagerRegistry $registry, LoggerInterface $log)
    {
        parent::__construct($registry, Document::class);
        $this->log = $log;
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

    /**
     * @return array<int, array{0: Document, 1: DocumentParticipant}>
     */
    public function findAvailableForUserWithParticipant(Uuid $userId): array
    {
        $documents = $this->createQueryBuilder('d')
            ->addSelect('p')
            ->join('d.participants', 'p')
            ->where('p.user = :userId')
            ->setParameter('userId', $userId->toString())
            ->getQuery()
            ->getResult();

        $result = [];
        foreach ($documents as $document) {
            $participant = $document->getParticipants()->first();
            $result[] = [$document, $participant];
        }

        return $result;
    }
}

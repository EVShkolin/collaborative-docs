<?php

namespace App\Repository;

use App\Entity\Document;
use App\Entity\Invitation;
use App\Entity\User;
use App\Enum\InvitationStatus;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<Invitation>
 */
class InvitationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Invitation::class);
    }

    /**
     * @return Invitation[]
     */
    public function findPendingForUser(Uuid $userId): array
    {
        return $this->createQueryBuilder('i')
            ->where('i.invitedUser = :userId')
            ->andWhere('i.status = :status')
            ->setParameter('userId', $userId->toString())
            ->setParameter('status', InvitationStatus::PENDING->value)
            ->orderBy('i.invitedAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findPendingForDocumentAndUser(Document $document, User $user): ?Invitation
    {
        return $this->createQueryBuilder('i')
            ->where('i.document = :document')
            ->andWhere('i.invitedUser = :user')
            ->andWhere('i.status = :status')
            ->setParameter('document', $document)
            ->setParameter('user', $user)
            ->setParameter('status', InvitationStatus::PENDING->value)
            ->getQuery()
            ->getOneOrNullResult();
    }
}

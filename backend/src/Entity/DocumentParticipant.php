<?php

namespace App\Entity;


use App\Enum\ParticipantRole;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity]
#[ORM\Table(name: 'document_participants')]
#[ORM\UniqueConstraint(name: 'unique_doc_user', columns: ['user_id', 'document_id'])]
class DocumentParticipant
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    private Uuid $id;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'user_id', nullable: false)]
    private User $user;

    #[ORM\ManyToOne(targetEntity: Document::class)]
    #[ORM\JoinColumn(name: 'document_id', nullable: false)]
    private Document $document;

    #[ORM\Column(enumType: ParticipantRole::class)]
    private ParticipantRole $role;

    #[ORM\Column(type: 'datetimetz_immutable')]
    private \DateTimeImmutable $joinedAt;

    public function __construct(User $user, Document $document, ParticipantRole $role = ParticipantRole::VIEWER) {
        $this->id = Uuid::v7();
        $this->user = $user;
        $this->document = $document;
        $this->role = $role;
        $this->joinedAt = new \DateTimeImmutable();
    }

    public function getId(): Uuid
    {
        return $this->id;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): void
    {
        $this->user = $user;
    }

    public function getDocument(): Document
    {
        return $this->document;
    }

    public function setDocument(Document $document): void
    {
        $this->document = $document;
    }

    public function getRole(): ParticipantRole
    {
        return $this->role;
    }

    public function setRole(ParticipantRole $role): void
    {
        $this->role = $role;
    }

    public function getJoinedAt(): \DateTimeImmutable
    {
        return $this->joinedAt;
    }

    public function setJoinedAt(\DateTimeImmutable $joinedAt): void
    {
        $this->joinedAt = $joinedAt;
    }

}

<?php

namespace App\Entity;

use App\Enum\InvitationStatus;
use App\Enum\ParticipantRole;
use App\Repository\InvitationRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: InvitationRepository::class)]
#[ORM\Table(name: 'invitations')]
#[ORM\Index(name: 'idx_invitations_invited_user_status', columns: ['invited_user_id', 'status'])]
class Invitation
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    private Uuid $id;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'invited_user_id', nullable: false)]
    private User $invitedUser;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'invited_by_id', nullable: false)]
    private User $invitedBy;

    #[ORM\ManyToOne(targetEntity: Document::class)]
    #[ORM\JoinColumn(name: 'document_id', nullable: false, onDelete: 'CASCADE')]
    private Document $document;

    #[ORM\Column(enumType: ParticipantRole::class)]
    private ParticipantRole $role;

    #[ORM\Column(enumType: InvitationStatus::class)]
    private InvitationStatus $status;

    #[ORM\Column(type: 'datetimetz_immutable')]
    private \DateTimeImmutable $invitedAt;

    #[ORM\Column(type: 'datetimetz_immutable', nullable: true)]
    private ?\DateTimeImmutable $respondedAt = null;

    public function __construct(User $invitedUser, User $invitedBy, Document $document, ParticipantRole $role)
    {
        $this->id = Uuid::v7();
        $this->invitedUser = $invitedUser;
        $this->invitedBy = $invitedBy;
        $this->document = $document;
        $this->role = $role;
        $this->status = InvitationStatus::PENDING;
        $this->invitedAt = new \DateTimeImmutable();
    }

    public function getId(): Uuid
    {
        return $this->id;
    }

    public function getInvitedUser(): User
    {
        return $this->invitedUser;
    }

    public function setInvitedUser(User $invitedUser): void
    {
        $this->invitedUser = $invitedUser;
    }

    public function getInvitedBy(): User
    {
        return $this->invitedBy;
    }

    public function setInvitedBy(User $invitedBy): void
    {
        $this->invitedBy = $invitedBy;
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

    public function getStatus(): InvitationStatus
    {
        return $this->status;
    }

    public function setStatus(InvitationStatus $status): void
    {
        $this->status = $status;
    }

    public function getInvitedAt(): \DateTimeImmutable
    {
        return $this->invitedAt;
    }

    public function setInvitedAt(\DateTimeImmutable $invitedAt): void
    {
        $this->invitedAt = $invitedAt;
    }

    public function getRespondedAt(): ?\DateTimeImmutable
    {
        return $this->respondedAt;
    }

    public function setRespondedAt(?\DateTimeImmutable $respondedAt): void
    {
        $this->respondedAt = $respondedAt;
    }
}

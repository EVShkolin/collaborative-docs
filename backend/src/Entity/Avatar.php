<?php

namespace App\Entity;

use App\Repository\Type\StringBlobType;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity]
#[ORM\Table(name: 'avatars')]
class Avatar
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    private Uuid $id;

    #[ORM\OneToOne(targetEntity: User::class, inversedBy: 'avatar')]
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', unique: true, nullable: false, onDelete: 'CASCADE')]
    private User $user;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column(type: StringBlobType::NAME)]
    private string $data;

    #[ORM\Column(length: 100)]
    private string $type;

    #[ORM\Column]
    private int $size;

    #[ORM\Column(type: 'datetimetz_immutable')]
    private \DateTimeImmutable $uploadedAt;

    public function __construct(User $user)
    {
        $this->id = Uuid::v7();
        $this->user = $user;
        $this->uploadedAt = new \DateTimeImmutable();
    }

    public function getId(): Uuid { return $this->id; }
    public function getUser(): User { return $this->user; }
    public function setUser(User $user): void { $this->user = $user; }

    public function getName(): string { return $this->name; }
    public function setName(string $name): void { $this->name = $name; }

    public function getData(): string { return $this->data; }
    public function setData(string $data): void { $this->data = $data; }

    public function getType(): string { return $this->type; }
    public function setType(string $type): void { $this->type = $type; }

    public function getSize(): int { return $this->size; }
    public function setSize(int $size): void { $this->size = $size; }

    public function getUploadedAt(): \DateTimeImmutable { return $this->uploadedAt; }
    public function setUploadedAt(\DateTimeImmutable $uploadedAt): void { $this->uploadedAt = $uploadedAt; }
}

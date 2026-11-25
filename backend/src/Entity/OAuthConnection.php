<?php

namespace App\Entity;

use App\Enum\OAuthType;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity]
#[ORM\Table(name: 'oauth_connections')]
#[ORM\UniqueConstraint(name: 'uniq_provider_user', columns: ['provider', 'provider_user_id'])]
class OAuthConnection
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    private Uuid $id;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'oauthConnections')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private User $user;

    #[ORM\Column(length: 32)]
    private OAuthType $provider;

    #[ORM\Column(length: 255)]
    private string $providerUserId;

    #[ORM\Column(type: 'datetimetz_immutable')]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(type: 'datetimetz_immutable', nullable: true)]
    private ?\DateTimeImmutable $lastUsedAt = null;

    public function __construct(User $user, OAuthType $provider, string $providerUserId)
    {
        $this->id = Uuid::v7();
        $this->user = $user;
        $this->provider = $provider;
        $this->providerUserId = $providerUserId;
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): Uuid
    {
        return $this->id;
    }

    public function setId(Uuid $id): void
    {
        $this->id = $id;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): void
    {
        $this->user = $user;
    }

    public function getProvider(): OAuthType
    {
        return $this->provider;
    }

    public function setProvider(OAuthType $provider): void
    {
        $this->provider = $provider;
    }

    public function getProviderUserId(): string
    {
        return $this->providerUserId;
    }

    public function setProviderUserId(string $providerUserId): void
    {
        $this->providerUserId = $providerUserId;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): void
    {
        $this->createdAt = $createdAt;
    }

    public function getLastUsedAt(): ?\DateTimeImmutable
    {
        return $this->lastUsedAt;
    }

    public function setLastUsedAt(?\DateTimeImmutable $lastUsedAt): void
    {
        $this->lastUsedAt = $lastUsedAt;
    }
}

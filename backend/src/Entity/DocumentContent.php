<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'document_content')]
class DocumentContent
{
    #[ORM\Id]
    #[ORM\OneToOne(targetEntity: Document::class)]
    #[ORM\JoinColumn(name: 'document_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private Document $document;

    #[ORM\Column(type: Types::BLOB, nullable: true)]
    private mixed $data;

    #[ORM\Column(type: 'datetimetz_immutable', nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    public function __construct(Document $document) {
        $this->document = $document;
    }

}

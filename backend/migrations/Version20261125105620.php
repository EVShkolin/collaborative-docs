<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261125105620 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE avatars (id UUID NOT NULL, name VARCHAR(255) NOT NULL, data BYTEA NOT NULL, type VARCHAR(100) NOT NULL, size INT NOT NULL, uploaded_at TIMESTAMP(0) WITH TIME ZONE NOT NULL, user_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_B0C98520A76ED395 ON avatars (user_id)');
        $this->addSql('CREATE TABLE comments (id UUID NOT NULL, content VARCHAR(1000) NOT NULL, created_at TIMESTAMP(0) WITH TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITH TIME ZONE DEFAULT NULL, deleted_at TIMESTAMP(0) WITH TIME ZONE DEFAULT NULL, document_id UUID NOT NULL, creator_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_5F9E962AC33F7837 ON comments (document_id)');
        $this->addSql('CREATE INDEX IDX_5F9E962A61220EA6 ON comments (creator_id)');
        $this->addSql('CREATE TABLE document_content (data BYTEA DEFAULT NULL, updated_at TIMESTAMP(0) WITH TIME ZONE DEFAULT NULL, document_id UUID NOT NULL, PRIMARY KEY (document_id))');
        $this->addSql('CREATE TABLE document_participants (id UUID NOT NULL, role VARCHAR(255) NOT NULL, joined_at TIMESTAMP(0) WITH TIME ZONE NOT NULL, last_accessed_at TIMESTAMP(0) WITH TIME ZONE NOT NULL, user_id UUID NOT NULL, document_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE UNIQUE INDEX unique_doc_user ON document_participants (user_id, document_id)');
        $this->addSql('CREATE INDEX IDX_DC8C51E3A76ED395 ON document_participants (user_id)');
        $this->addSql('CREATE INDEX IDX_DC8C51E3C33F7837 ON document_participants (document_id)');
        $this->addSql('CREATE TABLE documents (id UUID NOT NULL, title VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITH TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITH TIME ZONE DEFAULT NULL, owner_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_A2B072887E3C61F9 ON documents (owner_id)');
        $this->addSql('CREATE TABLE invitations (id UUID NOT NULL, role VARCHAR(255) NOT NULL, status VARCHAR(255) NOT NULL, invited_at TIMESTAMP(0) WITH TIME ZONE NOT NULL, responded_at TIMESTAMP(0) WITH TIME ZONE DEFAULT NULL, invited_user_id UUID NOT NULL, invited_by_id UUID NOT NULL, document_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX idx_invitations_invited_user_status ON invitations (invited_user_id, status)');
        $this->addSql('CREATE INDEX IDX_232710AEC58DAD6E ON invitations (invited_user_id)');
        $this->addSql('CREATE INDEX IDX_232710AEA7B4A7E3 ON invitations (invited_by_id)');
        $this->addSql('CREATE INDEX IDX_232710AEC33F7837 ON invitations (document_id)');
        $this->addSql('CREATE TABLE oauth_connections (id UUID NOT NULL, provider VARCHAR(32) NOT NULL, provider_user_id VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITH TIME ZONE NOT NULL, last_used_at TIMESTAMP(0) WITH TIME ZONE DEFAULT NULL, user_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE UNIQUE INDEX uniq_provider_user ON oauth_connections (provider, provider_user_id)');
        $this->addSql('CREATE INDEX IDX_E3D750BEA76ED395 ON oauth_connections (user_id)');
        $this->addSql('CREATE TABLE users (id UUID NOT NULL, name VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL, password_hash VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITH TIME ZONE NOT NULL, deleted_at TIMESTAMP(0) WITH TIME ZONE DEFAULT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1483A5E9E7927C74 ON users (email)');
        $this->addSql('ALTER TABLE avatars ADD CONSTRAINT FK_B0C98520A76ED395 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE comments ADD CONSTRAINT FK_5F9E962AC33F7837 FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE comments ADD CONSTRAINT FK_5F9E962A61220EA6 FOREIGN KEY (creator_id) REFERENCES users (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE document_content ADD CONSTRAINT FK_5AAA9675C33F7837 FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE document_participants ADD CONSTRAINT FK_DC8C51E3A76ED395 FOREIGN KEY (user_id) REFERENCES users (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE document_participants ADD CONSTRAINT FK_DC8C51E3C33F7837 FOREIGN KEY (document_id) REFERENCES documents (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE documents ADD CONSTRAINT FK_A2B072887E3C61F9 FOREIGN KEY (owner_id) REFERENCES users (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE invitations ADD CONSTRAINT FK_232710AEC58DAD6E FOREIGN KEY (invited_user_id) REFERENCES users (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE invitations ADD CONSTRAINT FK_232710AEA7B4A7E3 FOREIGN KEY (invited_by_id) REFERENCES users (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE invitations ADD CONSTRAINT FK_232710AEC33F7837 FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE NOT DEFERRABLE');
        $this->addSql('ALTER TABLE oauth_connections ADD CONSTRAINT FK_E3D750BEA76ED395 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE NOT DEFERRABLE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE avatars DROP CONSTRAINT FK_B0C98520A76ED395');
        $this->addSql('ALTER TABLE comments DROP CONSTRAINT FK_5F9E962AC33F7837');
        $this->addSql('ALTER TABLE comments DROP CONSTRAINT FK_5F9E962A61220EA6');
        $this->addSql('ALTER TABLE document_content DROP CONSTRAINT FK_5AAA9675C33F7837');
        $this->addSql('ALTER TABLE document_participants DROP CONSTRAINT FK_DC8C51E3A76ED395');
        $this->addSql('ALTER TABLE document_participants DROP CONSTRAINT FK_DC8C51E3C33F7837');
        $this->addSql('ALTER TABLE documents DROP CONSTRAINT FK_A2B072887E3C61F9');
        $this->addSql('ALTER TABLE invitations DROP CONSTRAINT FK_232710AEC58DAD6E');
        $this->addSql('ALTER TABLE invitations DROP CONSTRAINT FK_232710AEA7B4A7E3');
        $this->addSql('ALTER TABLE invitations DROP CONSTRAINT FK_232710AEC33F7837');
        $this->addSql('ALTER TABLE oauth_connections DROP CONSTRAINT FK_E3D750BEA76ED395');
        $this->addSql('DROP TABLE avatars');
        $this->addSql('DROP TABLE comments');
        $this->addSql('DROP TABLE document_content');
        $this->addSql('DROP TABLE document_participants');
        $this->addSql('DROP TABLE documents');
        $this->addSql('DROP TABLE invitations');
        $this->addSql('DROP TABLE oauth_connections');
        $this->addSql('DROP TABLE users');
    }
}

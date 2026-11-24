<?php

namespace App\Repository\Type;

use Doctrine\DBAL\ParameterType;
use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\Type;

class StringBlobType extends Type
{
    public const NAME = 'string_blob';

    public function getSQLDeclaration(array $column, AbstractPlatform $platform): string
    {
        return $platform->getBlobTypeDeclarationSQL($column);
    }

    public function convertToPHPValue($value, AbstractPlatform $platform): ?string
    {
        if ($value === null) return null;
        return is_resource($value) ? stream_get_contents($value) : (string) $value;
    }

    public function convertToDatabaseValue($value, AbstractPlatform $platform): ?string
    {
        return $value;
    }

    public function getName(): string
    {
        return self::NAME;
    }

    public function getBindingType(): ParameterType
    {
        return ParameterType::LARGE_OBJECT;
    }
}

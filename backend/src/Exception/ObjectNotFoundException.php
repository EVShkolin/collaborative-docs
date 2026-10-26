<?php

namespace App\Exception;

class ObjectNotFoundException extends \RuntimeException
{
    public function __construct(string $objectName, string|int $id) {
        parent::__construct("$objectName with id [$id] not found");
    }
}

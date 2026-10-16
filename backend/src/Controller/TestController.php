<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class TestController
{
    #[Route('/api/test')]
    public function foo(): JsonResponse
    {
        return new JsonResponse(['foo' => 'bar']);
    }


}

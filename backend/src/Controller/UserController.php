<?php

namespace App\Controller;

use App\DTO\Error\ValidationErrorDto;
use App\DTO\User\UserCreateDto;
use App\DTO\User\UserResponseDto;
use App\Service\UserService;
use Nelmio\ApiDocBundle\Attribute\Model;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Requirement\Requirement;
use Symfony\Component\Uid\Uuid;
use OpenApi\Attributes as OA;

#[Route('/api/v1/users', requirements: ['id' => Requirement::UUID])]
#[OA\Tag(name: 'Users')]
class UserController extends AbstractController
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    #[Route('/me', name: 'v1_users_find_me', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Получить информацию о текущем пользователе',
        content: new OA\JsonContent(ref: new Model(type: UserResponseDto::class))
    )]
    public function findMe(): JsonResponse
    {
        $user = $this->userService->findMe();
        return $this->json($user);
    }

    #[Route('/{id}', name: 'v1_users_find_by_id', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Получить информацию о пользователе',
        content: new OA\JsonContent(ref: new Model(type: UserResponseDto::class))
    )]
    public function findById(Uuid $id): JsonResponse
    {
        $user = $this->userService->findById($id);
        return $this->json($user);
    }

    #[Route('', name: 'v1_users_save', methods: ['POST'])]
    #[OA\Post(responses: [
        new OA\Response(
            response: 201,
            description: 'Пользователь успешно зарегистрирован (создан)',
            content: new OA\JsonContent(ref: new Model(type: UserResponseDto::class))),
        new OA\Response(
            response: 422,
            description: 'Ошибка валидации при регистрации',
            content: new OA\JsonContent(ref: new Model(type: ValidationErrorDto::class))
        )
    ])]
    public function save(#[MapRequestPayload] UserCreateDto $userDto): JsonResponse
    {
        $user = $this->userService->save($userDto);
        return $this->json($user, Response::HTTP_CREATED);
    }
}

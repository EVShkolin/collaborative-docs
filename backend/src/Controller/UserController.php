<?php

namespace App\Controller;

use App\DTO\Error\ValidationErrorDto;
use App\DTO\User\UserCreateDto;
use App\DTO\User\UserResponseDto;
use App\DTO\User\UserUpdateDto;
use App\Service\UserService;
use Nelmio\ApiDocBundle\Attribute\Model;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Requirement\Requirement;
use Symfony\Component\Uid\Uuid;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpKernel\Attribute\MapUploadedFile;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints as Assert;

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

    #[Route('/me', name: 'v1_users_update', methods: ['PUT'])]
    #[OA\Put(
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(
                    properties: [
                        new OA\Property(property: 'name', type: 'string', maxLength: 30, minLength: 4),
                        new OA\Property(property: 'avatarImage', type: 'string', format: 'binary'),
                    ],
                    type: 'object'
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'OK',
                content: new OA\JsonContent(ref: new Model(type: UserResponseDto::class))
            ),
        ]
    )]
    public function update(
        #[MapRequestPayload] UserUpdateDto $dto,
        #[MapUploadedFile([
            new Assert\Image(
                maxSize: '2M',
                mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
            )
        ])]
        ?UploadedFile $avatarImage = null
    ): JsonResponse
    {
        $user = $this->userService->update($dto, $avatarImage);
        return $this->json($user);
    }

    #[Route('/{id}/avatar', name: 'v1_users_get_avatar', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Бинарное содержимое аватара',
        content: [
            new OA\MediaType(mediaType: 'image/jpeg', schema: new OA\Schema(type: 'string', format: 'binary')),
            new OA\MediaType(mediaType: 'image/png', schema: new OA\Schema(type: 'string', format: 'binary')),
            new OA\MediaType(mediaType: 'image/webp', schema: new OA\Schema(type: 'string', format: 'binary')),
        ]
    )]
    public function getAvatar(Uuid $id): StreamedResponse
    {
        $avatar = $this->userService->getAvatar($id);

        $response = new StreamedResponse(function () use ($avatar): void {
            echo $avatar->getData();
        });

        $response->headers->set('Content-Type', $avatar->getType());
        $response->headers->set('Content-Length', (string)$avatar->getSize());
        $response->headers->set('Cache-Control', 'public, max-age=86400');
        $response->setLastModified($avatar->getUploadedAt());

        return $response;
    }
}

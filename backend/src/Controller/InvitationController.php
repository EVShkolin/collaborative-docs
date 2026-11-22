<?php

namespace App\Controller;

use App\DTO\Invitation\InvitationActionRequestDto;
use App\DTO\Invitation\InvitationRequestDto;
use App\DTO\Invitation\InvitationResponseDto;
use App\Enum\InvitationAction;
use App\Service\InvitationService;
use Nelmio\ApiDocBundle\Attribute\Model;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Requirement\Requirement;
use Symfony\Component\Uid\Uuid;
use OpenApi\Attributes as OA;

#[Route(
    path: '/api/v1/invitations',
    requirements: ['id' => Requirement::UUID]
)]
#[OA\Tag(name: 'Invitations')]
class InvitationController extends AbstractController
{
    public function __construct(
        private readonly InvitationService $invitationService
    ) {}

    #[Route('', name: 'v1_invitations_find_all', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Список ожидающих приглашений пользователя',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(type: InvitationResponseDto::class))
        )
    )]
    public function findAll(): JsonResponse
    {
        return $this->json($this->invitationService->findAll());
    }

    #[Route('', name: 'v1_invitations_save', methods: ['POST'])]
    #[OA\Response(
        response: 201,
        description: 'Приглашение создано',
        content: new OA\JsonContent(ref: new Model(type: InvitationResponseDto::class))
    )]
    public function save(#[MapRequestPayload] InvitationRequestDto $dto): JsonResponse
    {
        return $this->json($this->invitationService->save($dto), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'v1_invitations_update', methods: ['PATCH'])]
    #[OA\Response(
        response: 200,
        description: 'Приглашение обработано',
        content: new OA\JsonContent(ref: new Model(type: InvitationResponseDto::class))
    )]
    public function update(Uuid $id, #[MapRequestPayload] InvitationActionRequestDto $dto): JsonResponse
    {
        $invitation = match ($dto->action) {
            InvitationAction::ACCEPT => $this->invitationService->accept($id),
            InvitationAction::DECLINE => $this->invitationService->decline($id),
        };

        return $this->json($invitation);
    }
}

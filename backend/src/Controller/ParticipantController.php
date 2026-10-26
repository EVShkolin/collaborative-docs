<?php

namespace App\Controller;

use App\DTO\Participant\ParticipantRequestDto;
use App\DTO\Participant\ParticipantResponseDto;
use App\Service\ParticipantService;
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
    path: '/api/v1/documents/{documentId}/participants',
    requirements: ['documentId' => Requirement::UUID]
)]
#[OA\Tag(name: 'Document participants')]
class ParticipantController extends AbstractController
{
    public function __construct(
        private readonly ParticipantService $participantService
    ) {}

    #[Route('', name: 'v1_participants_find_all_by_document', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Список участников документа',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(type: ParticipantResponseDto::class))
        )
    )]
    public function findAllByDocument(Uuid $documentId): JsonResponse
    {
        $participants = $this->participantService->findAllByDocument($documentId);
        return $this->json($participants);
    }

    #[Route('', name: 'v1_participants_add', methods: ['POST'])]
    #[OA\Response(
        response: 201,
        description: 'Участник успешно добавлен',
        content: new OA\JsonContent(ref: new Model(type: ParticipantResponseDto::class))
    )]
    public function addParticipant(
        Uuid $documentId,
        #[MapRequestPayload] ParticipantRequestDto $dto
    ): JsonResponse {
        $participant = $this->participantService->addParticipant($documentId, $dto);
        return $this->json($participant, Response::HTTP_CREATED);
    }

    #[Route('/{participantId}', name: 'v1_participants_delete', requirements: ['participantId' => Requirement::UUID], methods: ['DELETE'])]
    #[OA\Response(
        response: 204,
        description: 'Участник успешно удален из документа'
    )]
    public function removeParticipant(Uuid $documentId, Uuid $participantId): Response
    {
        $this->participantService->removeParticipant($documentId, $participantId);
        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}

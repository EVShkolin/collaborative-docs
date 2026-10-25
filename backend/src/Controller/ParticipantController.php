<?php

namespace App\Controller;

use App\DTO\Participant\ParticipantRequestDto;
use App\Service\ParticipantService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Requirement\Requirement;
use Symfony\Component\Uid\Uuid;

#[Route(
    path: '/api/v1/documents/{documentId}/participants',
    requirements: ['documentId' => Requirement::UUID]
)]
class ParticipantController extends AbstractController
{
    public function __construct(
        private readonly ParticipantService $participantService
    ) {}

    #[Route('', name: 'v1_participants_find_all_by_document', methods: ['GET'])]
    public function findAllByDocument(Uuid $documentId): JsonResponse
    {
        $participants = $this->participantService->findAllByDocument($documentId);
        return $this->json($participants);
    }

    #[Route('', name: 'v1_participants_add', methods: ['POST'])]
    public function addParticipant(
        Uuid $documentId,
        #[MapRequestPayload] ParticipantRequestDto $dto
    ): JsonResponse {
        $participant = $this->participantService->addParticipant($documentId, $dto);
        return $this->json($participant, Response::HTTP_CREATED);
    }

    #[Route('/{userId}', name: 'v1_participants_delete', requirements: ['userId' => Requirement::UUID], methods: ['DELETE'])]
    public function removeParticipant(Uuid $documentId, Uuid $userId): Response
    {
        // TODO: Проверить права
        $this->participantService->removeParticipant($documentId, $userId);
        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}

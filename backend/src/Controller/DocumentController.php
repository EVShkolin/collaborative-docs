<?php

namespace App\Controller;

use App\DTO\Document\DocumentAccessDto;
use App\DTO\Document\DocumentRequestDto;
use App\DTO\Document\DocumentResponseDto;
use App\Entity\Document;
use App\Security\Voter\DocumentVoter;
use App\Service\DocumentService;
use Nelmio\ApiDocBundle\Attribute\Model;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Requirement\Requirement;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Uid\Uuid;
use OpenApi\Attributes as OA;

#[Route('api/v1/documents', requirements: ['id' => Requirement::UUID])]
#[OA\Tag(name: 'Documents')]
class DocumentController extends AbstractController
{
    public function __construct(
        private readonly DocumentService $documentService
    ) {}

    #[Route('', name: 'v1_documents_find_all', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Список всех доступных пользователю документов',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(type: DocumentResponseDto::class))
        )
    )]
    public function findAll(): JsonResponse
    {
        return $this->json($this->documentService->findAll());
    }

    #[Route('/{id}', name: 'v1_documents_find_by_id', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Получить документ по ID',
        content: new OA\JsonContent(ref: new Model(type: DocumentResponseDto::class))
    )]
    public function findById(Uuid $id): JsonResponse
    {
        return $this->json($this->documentService->findById($id));
    }

    #[Route('/{id}/access', name: 'v1_access_document', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Получить доступ к документу: токен для websocket-подключения и роль',
        content: new OA\JsonContent(ref: new Model(type: DocumentAccessDto::class))
    )]
    public function accessDocument(Uuid $id): JsonResponse
    {
        return $this->json($this->documentService->accessDocument($id));
    }

    #[Route('', name: 'v1_documents_save', methods: ['POST'])]
    #[OA\Response(
        response: 201,
        description: 'Документ успешно создан',
        content: new OA\JsonContent(ref: new Model(type: DocumentResponseDto::class))
    )]
    public function save(#[MapRequestPayload] DocumentRequestDto $docDto): JsonResponse
    {
        return $this->json($this->documentService->save($docDto), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'v1_documents_update', methods: ['PUT'])]
    #[OA\Response(
        response: 200,
        description: 'Документ успешно обновлен',
        content: new OA\JsonContent(ref: new Model(type: DocumentResponseDto::class))
    )]
    public function update(Uuid $id, #[MapRequestPayload] DocumentRequestDto $docDto): JsonResponse
    {
        return $this->json($this->documentService->update($id, $docDto));
    }

    #[Route('/{id}', name: 'v1_documents_delete', methods: ['DELETE'])]
    #[OA\Response(
        response: 204,
        description: 'Документ успешно удален'
    )]
    public function delete(Uuid $id): Response
    {
        $this->documentService->delete($id);
        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}

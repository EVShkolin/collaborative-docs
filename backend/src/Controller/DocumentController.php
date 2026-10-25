<?php

namespace App\Controller;

use App\DTO\Document\DocumentRequestDto;
use App\Service\DocumentService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Requirement\Requirement;
use Symfony\Component\Uid\Uuid;

#[Route('api/v1/documents', requirements: ['id' => Requirement::UUID])]
class DocumentController extends AbstractController
{
    public function __construct(
        private readonly DocumentService $documentService
    ) {}

    #[Route('', name: 'v1_documents_find_all', methods: ['GET'])]
    public function findAll(): JsonResponse
    {
        return $this->json($this->documentService->findAll());
    }

    #[Route('/{id}', name: 'v1_documents_find_by_id', methods: ['GET'])]
    public function findById(Uuid $id): JsonResponse
    {
        return $this->json($this->documentService->findById($id));
    }

    #[Route('', name: 'v1_documents_save', methods: ['POST'])]
    public function save(#[MapRequestPayload] DocumentRequestDto $docDto): JsonResponse
    {
        return $this->json($this->documentService->save($docDto), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'v1_documents_update', methods: ['PUT'])]
    public function update(Uuid $id, #[MapRequestPayload] DocumentRequestDto $docDto): JsonResponse
    {
        return $this->json($this->documentService->update($id, $docDto));
    }

    #[Route('/{id}', name: 'v1_documents_delete', methods: ['DELETE'])]
    public function delete(Uuid $id): Response
    {
        $this->documentService->delete($id);
        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}

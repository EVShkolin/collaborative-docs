<?php

namespace App\Controller;

use App\DTO\Comment\CommentRequestDto;
use App\DTO\Comment\CommentResponseDto;
use App\Service\CommentService;
use Nelmio\ApiDocBundle\Attribute\Model;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Requirement\Requirement;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;
use Symfony\Component\Uid\Uuid;

#[Route(
    'api/v1/documents/{documentId}/comments',
    requirements: ['documentId' => Requirement::UUID, 'id' => Requirement::UUID]
)]
#[OA\Tag('Comments')]
class CommentController extends AbstractController
{
    public function __construct(
        private readonly CommentService $commentService
    ) {}

    #[Route('', name: 'v1_comments_find_all_by_document', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Список комментариев документа',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(type: CommentResponseDto::class))
        )
    )]
    public function findAllByDocument(Uuid $documentId): JsonResponse
    {
        return $this->json($this->commentService->findAllByDocument($documentId));
    }

    #[Route('', name: 'v1_comments_save', methods: ['POST'])]
    #[OA\Response(
        response: 201,
        description: 'Комментарий создан',
        content: new OA\JsonContent(ref: new Model(type: CommentResponseDto::class))
    )]
    public function save(Uuid $documentId, #[MapRequestPayload] CommentRequestDto $comment): JsonResponse
    {
        return $this->json($this->commentService->save($documentId, $comment), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'v1_comments_update', methods: ['PUT'])]
    #[OA\Response(
        response: 200,
        description: 'Комментарий обновлен',
        content: new OA\JsonContent(ref: new Model(type: CommentResponseDto::class))
    )]
    public function update(Uuid $id, #[MapRequestPayload] CommentRequestDto $comment): JsonResponse
    {
        return $this->json($this->commentService->update($id, $comment));
    }

    #[Route('/{id}', name: 'v1_comments_delete', methods: ['DELETE'])]
    #[OA\Response(response: 204, description: 'Комментарий удалён')]
    public function delete(Uuid $id): Response
    {
        $this->commentService->delete($id);
        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}

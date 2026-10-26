<?php

namespace App\EventListener;

use App\Exception\ObjectNotFoundException;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Validator\Exception\ValidationFailedException;

#[AsEventListener(event: 'kernel.exception', priority: 10)]
final class GlobalExceptionHandler
{

    public function __construct(private readonly LoggerInterface $logger) {}

    public function __invoke(ExceptionEvent $event): void
    {
        $ex = $event->getThrowable();

        $response = match (true) {
            $ex instanceof UnprocessableEntityHttpException => $this->handleValidationException($ex),
            $ex instanceof ObjectNotFoundException => $this->getResponse($ex->getMessage(), Response::HTTP_NOT_FOUND),
            $ex instanceof HttpExceptionInterface => $this->getResponse($ex->getMessage(), $ex->getStatusCode()),
            $ex instanceof AccessDeniedException || $ex instanceof AccessDeniedHttpException => $this->getResponse($ex->getMessage(), Response::HTTP_FORBIDDEN),
            $ex instanceof AuthenticationException || $ex instanceof UnauthorizedHttpException => $this->getResponse($ex->getMessage(), Response::HTTP_UNAUTHORIZED),
            default => $this->getResponse('Something went wrong', Response::HTTP_INTERNAL_SERVER_ERROR),
        };

        $this->logger->error($ex->getMessage());

        $event->setResponse($response);
    }

    private function getResponse(string $message, int $code): JsonResponse
    {
        return new JsonResponse([
            'code' => $code,
            'message' => $message,
        ], $code);
    }

    private function handleValidationException(UnprocessableEntityHttpException $exception): JsonResponse
    {
        $previous = $exception->getPrevious();
        $errors = [];
        if ($previous instanceof ValidationFailedException) {
            $errors = $this->formatViolations($previous);
        }

        return new JsonResponse([
            'code' => $exception->getStatusCode(),
            'errors' => $errors,
        ], $exception->getStatusCode());
    }

    private function formatViolations(ValidationFailedException $exception): array
    {
        $violations = [];
        foreach ($exception->getViolations() as $violation) {
            $violations[$violation->getPropertyPath()] = $violation->getMessage();
        }
        return $violations;
    }
}

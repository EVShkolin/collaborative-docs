<?php

namespace App\Controller;

use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/v1/auth')]
class OAuthController
{
    #[Route('/google/connect', name: 'v1_auth_google_connect', methods: ['GET'])]
    public function redirectToGoogleConnect(ClientRegistry $clientRegistry): RedirectResponse
    {
        return $clientRegistry->getClient('google')->redirect(['email', 'profile']);
    }

    #[Route('/google/check', name: 'v1_auth_google_check', methods: ['GET'])]
    public function connectGoogleCheck(): never
    {
        throw new \LogicException('This route is handled by OAuthGoogleAuthenticator.');
    }

    #[Route('/github/connect', name: 'v1_auth_github_connect', methods: ['GET'])]
    public function redirectToGithubConnect(ClientRegistry $clientRegistry): RedirectResponse
    {
        return $clientRegistry->getClient('github')->redirect(['read:user', 'user:email']);
    }

    #[Route('/github/check', name: 'v1_auth_github_check', methods: ['GET'])]
    public function connectGithubCheck(): never
    {
        throw new \LogicException('This route is handled by OAuthGithubAuthenticator.');
    }
}

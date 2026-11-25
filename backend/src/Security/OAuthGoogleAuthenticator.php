<?php

namespace App\Security;

use App\Entity\OAuthConnection;
use App\Entity\User;
use App\Enum\OAuthType;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use KnpU\OAuth2ClientBundle\Security\Authenticator\OAuth2Authenticator;
use League\OAuth2\Client\Provider\GoogleUser;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

class OAuthGoogleAuthenticator extends OAuth2Authenticator
{
    public function __construct(
        private readonly ClientRegistry           $clientRegistry,
        private readonly EntityManagerInterface   $em,
        private readonly UserRepository           $userRepository,
        private readonly JWTTokenManagerInterface $jwtManager,

        #[Autowire(env: 'FRONTEND_URL')]
        private readonly string                   $frontendUrl
    ) {}

    public function start(Request $request, ?AuthenticationException $authException = null): Response
    {
        return new RedirectResponse('/login');
    }

    public function supports(Request $request): ?bool
    {
        return $request->attributes->get('_route') === 'v1_auth_google_check';
    }

    public function authenticate(Request $request): Passport
    {
        $client = $this->clientRegistry->getClient('google');
        $accessToken = $this->fetchAccessToken($client);

        /** @var GoogleUser $googleUser */
        $googleUser = $client->fetchUserFromToken($accessToken);

        $user = $this->findOrCreateUser($googleUser);

        return new SelfValidatingPassport(
            new UserBadge($user->getUserIdentifier(), fn() => $user)
        );
    }

    private function findOrCreateUser(GoogleUser $googleUser): User
    {
        $providerUserId = $googleUser->getId();
        $email = $googleUser->getEmail();
        $name = $googleUser->getName();

        $existing = $this->userRepository->findByOAuthConnection(OAuthType::GOOGLE, $providerUserId);
        if ($existing !== null) {
            return $existing;
        }

        $user = $this->userRepository->findByEmail($email);
        $isNewUser = $user === null;

        if ($isNewUser) {
            $user = new User($name, $email);;
        }

        $connection = new OAuthConnection($user, OAuthType::GOOGLE, $providerUserId);
        $connection->setLastUsedAt(new \DateTimeImmutable());
        $user->getOAuthConnections()->add($connection);

        $this->em->wrapInTransaction(function () use ($user, $connection, $isNewUser) {
            if ($isNewUser) {
                $this->em->persist($user);
            }
            $this->em->persist($connection);
        });

        return $user;
    }

    public function onAuthenticationSuccess(
        Request        $request,
        TokenInterface $token,
        string         $firewallName
    ): ?Response
    {
         $jwt = $this->jwtManager->create($token->getUser());

        return new RedirectResponse(sprintf(
            '%s/auth/callback?token=%s',
            $this->frontendUrl,
            urlencode($jwt)
        ));
    }

    public function onAuthenticationFailure(
        Request                 $request,
        AuthenticationException $exception
    ): ?Response
    {
        return new RedirectResponse($this->frontendUrl . '/auth/callback?error=oauth_failed');
    }

    public function supportsRememberMe(): bool
    {
        return false;
    }
}

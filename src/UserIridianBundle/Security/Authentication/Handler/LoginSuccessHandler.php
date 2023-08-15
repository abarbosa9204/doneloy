<?php
/**
 * Created by PhpStorm.
 * User: Iridian 1
 * Date: 2/03/2016
 * Time: 4:31 PM
 */

namespace UserIridianBundle\Security\Authentication\Handler;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Router;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\SecurityContext;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

class LoginSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    protected
        $router,
        $security;

        public function __construct(Router $router, AuthorizationCheckerInterface $security)
    {
        $this->router = $router;
        $this->security = $security;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token)
    {
        // URL for redirect the user to where they were before the login process begun if you want.
        $referer_url = $request->headers->get('referer');

        // Default target for unknown roles. Everyone else go there.
        /*
        $url = 'homepage';
        if($this->security->isGranted('ROLE_ADMIN')) {
            $url = 'easyadmin';
        }
        elseif($this->security->isGranted('ROLE_EMPRESA')) {
            $url = 'encuesta';
        }
        */
        if(strpos($referer_url,'/login') !== false)
            $referer_url = $this->router->generate('easyadmin');
        if(strpos($referer_url,'/registro-login-inicial') !== false)
            $referer_url = $this->router->generate('historial');
        else if(strpos($referer_url,'/registro-login') !== false)
            $referer_url = $this->router->generate('datos-factura');

        $response = new RedirectResponse($referer_url);
        return $response;
    }
}
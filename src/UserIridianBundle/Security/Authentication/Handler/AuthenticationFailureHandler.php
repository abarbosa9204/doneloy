<?php
/**
 * Created by PhpStorm.
 * User: Iridian 1
 * Date: 14/06/2016
 * Time: 11:46 AM
 */

namespace UserIridianBundle\Security\Authentication\Handler;

use Symfony\Component\Security\Http\Logout\LogoutSuccessHandlerInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
/**
 * Description of AuthenticationFailureHandler
 *
 * @author Carlos Mendoza <inhack20@tecnocreaciones.com>
 */
class AuthenticationFailureHandler  implements AuthenticationFailureHandlerInterface
{

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception) {
        $referer = $request->headers->get('referer');
        $request->getSession()->getFlashBag()->add('error', $exception->getMessage());
        $serializer = $this->get('serializer');
        $resultado= array("ok"=>false,"error_msg"=>"");
        $json = $serializer->serialize($resultado,'json');
        return new Response($json);
    }
}
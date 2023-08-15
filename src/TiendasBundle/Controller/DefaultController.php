<?php

namespace TiendasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class DefaultController extends Controller
{
    /**
     * @Route("/tiendas", name="tiendas")
     */
    public function indexAction()
    {
        return $this->render('TiendasBundle:Default:index.html.twig');
    }
}

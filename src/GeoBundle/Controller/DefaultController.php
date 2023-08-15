<?php

namespace GeoBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class DefaultController extends Controller
{
    /**
     * @Route("/geo")
     */
    public function indexAction()
    {
        return $this->render('GeoBundle:Default:index.html.twig');
    }
}

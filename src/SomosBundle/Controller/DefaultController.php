<?php

namespace SomosBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class DefaultController extends Controller
{
    /**
     * @Route("/somos", name="somos")
     */
    public function indexAction()
    {
        return $this->render('SomosBundle:Default:index.html.twig');
    }
    /**
     * @Route("/historia", name="historia")
     */
    public function historiaAction()
    {
        return $this->render('SomosBundle:Default:historia.html.twig');
    }
    /**
     * @Route("/cultura", name="cultura")
     */
    public function culturaAction()
    {
        return $this->render('SomosBundle:Default:cultura.html.twig');
    }
}

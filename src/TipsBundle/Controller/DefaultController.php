<?php

namespace TipsBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class DefaultController extends Controller
{
    /**
     * @Route("/tips", name="tips")
     */
    public function indexAction()
    {
        return $this->render('TipsBundle:Default:index.html.twig');
    }
    /**
     * @Route("/tip", name="tip")
     */
    public function tipAction()
    {
        return $this->render('TipsBundle:Default:tip.html.twig');
    }
}

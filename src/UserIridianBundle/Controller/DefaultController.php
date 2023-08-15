<?php

namespace UserIridianBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use UserIridianBundle\Form\Type\UsuarioType;

class DefaultController extends Controller
{
    /**
     * @Route("/useriridian")
     */
    public function indexAction()
    {
        return $this->render('UserIridianBundle:Default:index.html.twig');
    }

    /**
     * @Route("/historial", name="historial")
     */
    public function historialAction()
    {
        $historial = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')
            ->findBy(
                array(
                    'comprador'=>$this->getUser()
                ),
                array(
                    'id'=>'desc'
                )
            );
        $historial = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')
            ->createQueryBuilder('f')
            ->select('d.para as para','en.fechaDeEnvio as fechaDeEnvio','en.direccion as direccion','c.precio as precio','e.nombre as estado','f.camino','f.entrgado','f.recibido')
            ->leftJoin('f.compra','c')
            ->leftJoin('c.estado','e')
            ->leftJoin('f.envio','en')
            ->leftJoin('f.dedicatoria','d')
            ->leftJoin('f.comprador','co')
            ->where('c.id is not null')
            ->andWhere('e.id is not null')
            ->andWhere('en.id is not null')
            ->andWhere('d.id is not null')
            ->andWhere('co.id = '.$this->getUser()->getId())
            ->orderBy('f.id','desc')
            ->getQuery()
            ->getResult();
        return $this->render('UserIridianBundle:Default:historial.html.twig', array('historial'=>$historial));
    }

    /**
     * @Route("/mis-datos", name="mis_datos")
     */
    public function perfilAction(Request $request){
        $user = $this->getUser();
        $form = $this->createForm(UsuarioType::class, $user);
        $form->handleRequest($request);
        $gracias = false;
        if ($form->isValid()) {
            $gracias = true;
            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();
            return $this->render('@FOSUser/Profile/edit.html.twig', array( "form" => $form->createView(), 'gracias'=> $gracias));
        }
        return $this->render('@FOSUser/Profile/edit.html.twig', array( "form" => $form->createView(), 'gracias'=> $gracias));
    }

    /**
     * @Route("/facturacion", name="facturacion")
     */
    public function facturacionAction()
    {
        return $this->render('UserIridianBundle:Default:facturacion.html.twig');
    }
}

<?php

namespace ContactoBundle\Controller;

use AppBundle\Entity\Contact;
use AppBundle\Entity\ContactList;
use AppBundle\Entity\Recomendacion;
use AppBundle\Form\Type\ContactType;
use AppBundle\Form\Type\RecomendacionType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/contacto", name="contacto")
     */
    public function contactoAction(Request $request)
    {
        $contacto = new ContactList();
        $lc = $this->get('translator')->getLocale();
        $form = $this->createForm(ContactType::class, $contacto, array('locale' => $request->getLocale()));

        $form->handleRequest($request);
        if ($form->isValid()) {
            $qi = $this->get('qi');
            $data = $form->getData();
            $em = $this->getDoctrine()->getManager();
            $em->persist($contacto);
            $em->flush();
            //ENVIAR MENSAJE
            $sender  = $qi->getSettingDB('sender');
            $receptor_interno  = $qi->getSettingDB('receptor_contacto');
            $receptores = array();
            array_push($receptores,$qi->getSettingDB('receptor_contacto'),$contacto->getEmail());
            $subject  = $qi->getTextoDB('asunto_contacto');
            //$this->SendMail($subject, $sender, $receptor_interno, array("contacto" => $contacto), "AppBundle::contact_email.html.twig");


            $headers = 'From: Rosas Don Eloy <contacto@rosasdoneloy.com>' . "\r\n";
            $headers .= 'To: <internet@rosasdoneloy.com>' . "\r\n";
            //$headers .= "CC: internet@rosasdoneloy.com". "\r\n";

            $headers .= 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";
            $mensaje = $this->renderView(
                'AppBundle::contact_email.html.twig',
                array("contacto" => $contacto)
            );

           // mail($sender, $subject, $mensaje, $headers);

            $qi->SendMailHtml($subject,$sender,$contacto->getEmail(),$mensaje);
            //return $this->render('AppBundle::contact_email.html.twig', array("contacto" => $contacto));
            return $this->redirectToRoute('gracias');
        }
        $data  = $this->getDoctrine()->getRepository('AppBundle:Contact')->findBy(["llave" => "contact_info"]);
        return $this->render('ContactoBundle:Default:contacto.html.twig', array("form" => $form->createView()));
    }

    /**
     * @Route("/recomendar/{id}/{nombre}", name="recomendar")
     */
    public function recomendacionAction(Request $request,$id)
    {
        $gracias = false;

        $path = $this->container->getParameter('app.path.productos');
        $producto = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto')->find($id);
        $imagenes = array();
        array_push($imagenes,$path.'/'.$producto->getImagen());
        $contacto = new Recomendacion();
        $form = $this->createForm(RecomendacionType::class, $contacto, array('locale' => $request->getLocale()));

        $form->handleRequest($request);
        if ($form->isValid()) {
            $gracias = true;
            $qi = $this->get('qi');
            $em = $this->getDoctrine()->getManager();
            $em->persist($contacto);
            $em->flush();
            $sender  = $qi->getSettingDB('sender');
            $subject  = $qi->getTextoDB('recomendacion_asunto');
            $this->SendMail($subject, $sender, $contacto->getReceptorCorreo(), array("contacto" => $contacto,"producto"=>$producto,'imagenes'=>$imagenes), "AppBundle::recomendacion_email.html.twig");
            //return $this->render('AppBundle::recomendacion_email.html.twig', array("contacto" => $contacto,"producto"=>$producto,'imagenes'=>$imagenes));
            //return $this->redirectToRoute('gracias');
            $contacto = new Recomendacion();
            $form = $this->createForm(RecomendacionType::class, $contacto, array('locale' => $request->getLocale()));
        }
        return $this->render('ContactoBundle:Default:recomendacion.html.twig', array("form" => $form->createView(),"producto"=>$producto,'imagenes'=>$imagenes,"gracias"=>$gracias));
    }

    /**
     * @Route("/recomendar+post/{id}/{nombre}", name="recomendar_post")
     */
    public function recomendacionpostAction(Request $request,$id)
    {
        $gracias = false;

        $path = $this->container->getParameter('app.path.blogs');
        $producto = $this->getDoctrine()->getRepository('BlogiridianBundle:Post')->find($id);

        $imagenes = array();
        array_push($imagenes,$path.'/'.$producto->getImage());
        $contacto = new Recomendacion();
        $form = $this->createForm(RecomendacionType::class, $contacto, array('locale' => $request->getLocale()));

        $form->handleRequest($request);
        if ($form->isValid()) {
            $gracias = true;
            $qi = $this->get('qi');
            $em = $this->getDoctrine()->getManager();
            $em->persist($contacto);
            $em->flush();
            $sender  = $qi->getSettingDB('sender');
            $subject  = $qi->getTextoDB('recomendacion_asunto');
            $this->SendMail($subject, $sender, $contacto->getReceptorCorreo(), array("contacto" => $contacto,"producto"=>$producto,'imagenes'=>$imagenes), "AppBundle::recomendacion_blog_email.html.twig");
            //return $this->render('AppBundle::recomendacion_blog_email.html.twig', array("contacto" => $contacto,"producto"=>$producto,'imagenes'=>$imagenes));
            //return $this->redirectToRoute('gracias');
            $contacto = new Recomendacion();
            $form = $this->createForm(RecomendacionType::class, $contacto, array('locale' => $request->getLocale()));
        }
        return $this->render('ContactoBundle:Default:recomendacion.html.twig', array("form" => $form->createView(),"producto"=>$producto,'imagenes'=>$imagenes,"gracias"=>$gracias));
    }

    public function SendMail($subject, $from, $to, $custom, $template){
        $message = \Swift_Message::newInstance()
            ->setSubject($subject)
            ->setFrom($from)
            ->setTo($to)
            ->setBody(
                $this->renderView(
                    $template,
                    $custom
                ),
                'text/html'
            );
        $this->get('mailer')->send($message);
    }


    /**
     * @Route("/message", name="message")
     */
    public function messageAction()
    {
        return $this->render('ContactoBundle:Default:message.html.twig');
    }

    /**
     * @Route("/new-call", name="mew_call")
     */
    public function newCallAction(Request $request)
    {
        $name = $request->request->get('name',null);
        $phone = $request->request->get('phone',null);
        if(!$name || !$phone){
            return $this->redirectToRoute('homepage');
        }
        $qi = $this->get('qi');
        $mensaje = $this->renderView(
            'AppBundle::contact_call_email.html.twig',
            [
                'name' => $name,
                'phone' => $phone
            ]
        );
        $sender  = $qi->getSettingDB('sender');
        $qi->SendMailHtml('Nueva solicitud de llamada',$sender,'internet@rosasdoneloy.com',$mensaje);
        return $this->redirectToRoute('gracias');
    }
}

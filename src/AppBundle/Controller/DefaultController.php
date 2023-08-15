<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Newsletter;
use AppBundle\Entity\Profile;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Entity\Article;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use AppBundle\Service\QI;
use Symfony\Component\PropertyAccess\PropertyAccess;




class DefaultController extends Controller
{

    /**
     * @Route("/homeold", name="homepageold")
     */
    public function indexAction(Request $request)
    {
        $QI = $this->get('qi');
        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', [
            'base_dir' => realpath($this->container->getParameter('kernel.root_dir').'/..'),
        ]);
    }

    /**
     * @Route("/test", name="test")
     */
    public function testAction(Request $request)
    {
        return $this->render('default/index.html.twig', [
            'base_dir' => realpath($this->container->getParameter('kernel.root_dir').'/..'),
        ]);
    }

    /**
     * @Route("/modalimage/{id}/{name}", name="modalimage")
     */
    public function modalImageAction(Request $request,$id,$name)
    {
        // replace this example code with whatever you need
        return $this->render('default/modalimage.html.twig', array('id'=>$id,'name'=>$name,'ruta'=>$this->container->getParameter('app.path.images')));
    }

    /**
     * @Route("/ruta_imagen/{id}", name="ruta_imagen")
     */
    public function rutaImagenAction(Request $request,$id)
    {
        $em = $this->getDoctrine()->getManager();
        $imagen = $em->find('AppBundle:Imagen', $id);

        return $response = new Response($this->container->getParameter('app.path.images').'/'.$imagen->getImage());
    }

    public function seoAction(Request $request, $url, $homepage)
    {
        $em = $this->getDoctrine()->getManager();
        $url_abs = $url;
        $url = str_replace($homepage,'',$url);
        $seo = $em->getRepository('AppBundle:Seo')->findOneByUrl($url);
        if($seo == null)
            $seo = $em->getRepository('AppBundle:Seo')->findOneById(1);
        $accessor = PropertyAccess::createPropertyAccessor();
        $locale = $request->getLocale();
        return $this->render('seo/seo.html.twig',
            array(
                'seo' => $seo,
                'titulo'=>$accessor->getValue($seo, 'titulo_'.$locale),
                'descripcion'=>$accessor->getValue($seo, 'descripcion_'.$locale),
                'imagen'=>$seo->getImagen(),
                'homepage'=>str_replace(array("app.php/","app_dev.php/"),array("",""),$homepage),
                'url'=>$url_abs
            )
        );
    }

    /**
     * @Route("/newsletter/{email}", name="newsletter")
     */
    public function newsletterAction(Request $request,$email)
    {
        $em = $this->getDoctrine()->getManager();
        //$email = $request->request->get('email');
        $newsletter = $this->getDoctrine()
            ->getRepository('AppBundle:Newsletter')
            ->findOneBy(array('email'=>$email));
        if($newsletter == null){
            $newsletter = new Newsletter();
            $newsletter->setEmail($email);
            $newsletter->setActivo(true);
            $em->persist($newsletter);
            $em->flush();

            $data = array('success'=>1);
            /*
            $sender  = $this->getDoctrine()->getRepository('AppBundle:Settings')->findBy(array('llave'=>"sender_mail"));
            $datos_envio  = $this->getDoctrine()->getRepository('AppBundle:Mailing')->findBy(["llave" => "news"]);
            $lc = $this->get('translator')->getLocale();
            $this->SendMail($datos_envio[0]->getAsunto()->getLocalName($lc), $sender[0]->getValor(), $email, array("data" => $datos_envio[0]), "AppBundle::gracias_news.html.twig");
            */
        }
        else
            $data = array('success'=>0);
        return new JsonResponse($data);
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
     * @Route("/ordenar", name="ordenar")
     */
    public function ordenarAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $id = $request->request->get('id');
        $objetos = $request->request->get('objeto');
        $imgs = $this->getDoctrine()
            ->getRepository('AppBundle:Imagengaleria')
            ->findBy(array('galeria'=>$id));
        $data = array('success'=>1);
        array_push($data,$objetos);
        foreach($imgs as $img){
            $orden = $objetos[$img->getId()];
            $img->setOrden($orden);
            $em->persist($img);
        }
        $em->flush();

        return new JsonResponse($data);
    }

    /**
     * @Route("/gracias", name="gracias")
     */
    public function graciasAction(Request $request)
    {
        return $this->render('AppBundle::gracias.html.twig');
    }
    /**
     * @Route("/internaT", name="internaT")
     */
    public function internaTaller(Request $request)
    {
        return $this->render('AppBundle::internataller.html.twig');
    }

}

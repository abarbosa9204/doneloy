<?php

namespace BlogiridianBundle\Controller;

use BlogiridianBundle\Entity\Comentario;
use BlogiridianBundle\Form\Type\ComentarioType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/blog", name="the_blog")
     */
    public function indexAction(Request $request)
    {
        $qi = $this->get('qi');
        $term = $request->get('q');
        $year = $request->get('year');
        $month = $request->get('month');
        $repo_post = $this->getDoctrine()->getRepository('BlogiridianBundle:Post');
        if($term)
            $ultimos = $qi->getResultadosBlog($term,null,$year,$month,null);
        else
            $ultimos = $qi->getResultadosBlog(null,null,$year,$month,null);
        $todos = $repo_post->findBy(array('visible'=>true),array('fecha'=>'desc'));

        return $this->render('BlogiridianBundle:Default:index.html.twig',array('ultimos'=>$ultimos,'todos'=>$todos));
    }

    /**
     * @Route("/blog/categoria/{id}/{name}", name="blog_categoria")
     */
    public function categoriaAction(Request $request,$id,$name)
    {
        $qi = $this->get('qi');
        $term = $request->get('q');
        $year = $request->get('year');
        $month = $request->get('month');
        $repo_post = $this->getDoctrine()->getRepository('BlogiridianBundle:Post');
        if($term)
            $ultimos = $qi->getResultadosBlog($term,null,$year,$month,$id);
        else
            $ultimos = $qi->getResultadosBlog(null,null,$year,$month,$id);
        $todos = $repo_post->findBy(array('visible'=>true),array('fecha'=>'desc'));

        return $this->render('BlogiridianBundle:Default:index.html.twig',array('ultimos'=>$ultimos,'todos'=>$todos));
    }

    /**
     * @Route("/post/{id}/{name}", name="post")
     */
    public function postAction($id,Request $request)
    {
        $qi = $this->get('qi');
        $repo_post = $this->getDoctrine()->getRepository('BlogiridianBundle:Post');
        $repo_gal = $this->getDoctrine()->getRepository('BlogiridianBundle:GaleriaPost');
        $repo_comm = $this->getDoctrine()->getRepository('BlogiridianBundle:Comentario');
        $post = $repo_post->findOneBy(array('visible'=>true,'id'=>$id),array('fecha'=>'desc'),2);
        $gals = $repo_gal->findBy(array('post'=>$id,'visible'=>true),array('orden'=>'asc'));
        $imagenes = array();
        array_push($imagenes,$post->getImage());
        foreach ($gals as $gal){
            array_push($imagenes,$gal->getImagen());
        }

        $comentario = new Comentario();
        $comentario->setPost($post);
        $form = $this->createForm(ComentarioType::class, $comentario);
        $form->handleRequest($request);
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($comentario);
            $em->flush();
            return $this->redirectToRoute('post',array('id'=>$id,'name'=>$qi->slugify($post->getTituloEs())));
        }
        $comentarios = $repo_comm->findBy(array('post'=>$post->getId(),'visible'=>true));

        return $this->render('BlogiridianBundle:Default:the_blog.html.twig',array('post'=>$post,'imagenes'=>$imagenes,'comentarios'=>$comentarios,'form'=>$form->createView()));
    }

    /**
     * @Route("prensa", name="prensa")
     */
    public function prensaAction()
    {
        return $this->render('BlogiridianBundle:Default:prensa.html.twig');
    }

    /*

    foreach (array() as $post){
            $nombre = $post->getImage();
            $dir = $this->get('kernel')->getRootDir().'/../html/uploads/blogs/';
            $ruta = "http://www.rosasdoneloy.com/sites/default/files/styles/imagen-listado-categoria/public/".$nombre;
            $url=@getimagesize($ruta);
            if(!is_array($url))
            {
                // The image doesn't exist
            }
            else
            {
                file_put_contents($dir.$nombre, fopen($ruta, 'r'));
            }

        }

     *
     */
}

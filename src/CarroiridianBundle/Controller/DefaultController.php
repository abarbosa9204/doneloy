<?php

namespace CarroiridianBundle\Controller;

use Threaded;
use AppBundle\Entity\User;
use CarroiridianBundle\Entity\Calificacion;
use CarroiridianBundle\Entity\Dedicatoria;
use CarroiridianBundle\Entity\Abasto;
use CarroiridianBundle\Entity\Envio;
use CarroiridianBundle\Entity\Bono;
use CarroiridianBundle\Entity\Factura;
use CarroiridianBundle\Entity\Inventario;
use CarroiridianBundle\Entity\Wish;
use CarroiridianBundle\Form\Type\BonoType;
use CarroiridianBundle\Form\Type\DedicatoriaType;
use CarroiridianBundle\Form\Type\AbastoType;
use CarroiridianBundle\Form\Type\EnvioType;
use CarroiridianBundle\Form\Type\FacturaType;
use Doctrine\ORM\EntityManager;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Validator\Constraints\DateTime;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;

class DefaultController extends Controller
{


    /**
     * @Route("/carrito-de-compras", name="carrito")
     */
    public function indexAction(Request $request)
    {
        $session = new Session();
        $carrito = $session->get('carrito', array());
        $bonos = $session->get('bonos', array());
        $descuento = $session->get('descuento', array());
        if (count($carrito) == 0) {
            return $this->redirectToRoute('productos');
        }
        if ($request->get("discount") && count($descuento) == 0) {
            $bono = $this->getDoctrine()->getRepository('CarroiridianBundle:Bono')->findBy(array('codigo' => $request->get("discount"), "reclama" => 0));
            if (count($bono) > 0) {
                $session->set('descuento', array("id" => $bono[0]->getId(), "codigo" => $bono[0]->getCodigo(), "de" => $bono[0]->getDe(), "valor" => $bono[0]->getValorbono()->getValor()));
            }
        }
        $descuento = $session->get('descuento', array());
        /*
        $securityContext = $this->container->get('security.authorization_checker');
        if (!$securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            return $this->redirectToRoute('registro_login');
        }

        $user = $this->getUser();
        $direcciones = $user->getDirecciones();
        $envio = new Envio();
        if($request->isMethod('GET')) {
            $departamento = $this->getDoctrine()->getRepository('CarroiridianBundle:Departamento')->find(2);
            $envio->setUser($user);
            $envio->setDepartamento($departamento);
        }
        $form = $this->createForm(EnvioType::class, $envio);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $envio = $form->getData();
            $em = $this->getDoctrine()->getManager();
            $em->persist($envio);
            $em->flush();

            $session = new Session();
            $session->set('direccion_id', $envio->getId());

            return $this->redirectToRoute('pagar_payu');
        }
        */
        return $this->render('CarroiridianBundle:Default:index.html.twig');
    }
    /**
     * @Route("/the_store", name="home")
     */
    public function homeAction()
    {
        return $this->render('CarroiridianBundle:Default:home.html.twig');
    }
    /**
     * @Route("/datos-factura", name="datos-factura")
     */
    public function datosFacturaAction(Request $request)
    {
        $session = new Session();
        $dedicatoria = $session->get('dedicatoria', null);
        $factura_ses = $session->get('factura', null);
        $securityContext = $this->container->get('security.authorization_checker');
        $userLogged = false;
        if ($factura_ses) {
            $factura = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->find($factura_ses->getId());
        } else {
            $factura = new Factura();
            /** @var $user User */
            $user = $this->getUser();
            if ($user) {
                $factura->setNombre($user->getNombre());
                $factura->setApellidos($user->getApellidos());
                $factura->setEmail($user->getEmail());
                if ($user->getRangoedad()) {
                    $factura->setRangoedad($user->getRangoedad());
                    $userLogged = true;
                }
            }

            if ($securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                $factura_ant = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->findOneBy(array('comprador' => $user), array('id' => 'desc'));
                if ($factura_ant) {
                    $factura->setDireccion($factura_ant->getDireccion());
                    $factura->setTipodocumento($factura_ant->getTipodocumento());
                    $factura->setDocumento($factura_ant->getDocumento());
                    $factura->setPais($factura_ant->getPais());
                    $factura->setDepartamento($factura_ant->getDepartamento());
                    $factura->setCiudad($factura_ant->getCiudad());
                    $factura->setCelular($factura_ant->getCelular());
                    $paisEn = $factura_ant->getPaisEn();
                    if (!$paisEn) {
                        $paisEn = $this->getDoctrine()->getRepository('GeoBundle:PaisFacturacion')->find(38);
                    }
                    $factura->setPaisEn($paisEn);
                }
            }
        }
        $form = $this->createForm(FacturaType::class, $factura, array('locale' => $request->getLocale()));
        if ($user) {
            $form->get("terms")->setData(true);
        }
        $form->handleRequest($request);
        if ($form->isValid()) {
            if ($dedicatoria)
                $factura->setDedicatoria($dedicatoria);
            if ($securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                $user = $this->getUser();
                $factura->setComprador($user);
            }

            $em = $this->getDoctrine()->getManager();
            $em->persist($factura);
            $em->flush();
            $session->set('factura', $factura);
            return $this->redirectToRoute('datos-envio');
        }
        return $this->render('CarroiridianBundle:Default:datos_factura.html.twig', array('form' => $form->createView(), 'userLogged' => $userLogged));
    }
    /**
     * @Route("/datos-envio", name="datos-envio")
     */
    public function datosEnvioAction(Request $request)
    {
        $micro = microtime(true);
        $ci = $this->get('ci');
        if (!$ci->getConEnvio()) {
            return $this->redirectToRoute('resumen_compra');
        }
        $session = $request->getSession();
        $ciudad_id = $session->get('ciudad', 0);
        $ciudad = $this->getDoctrine()->getRepository('CarroiridianBundle:Ciudad')->find($ciudad_id);

        $user = $this->getUser();
        /* @var $em EntityManager */
        $em = $this->getDoctrine()->getManager();
        date_default_timezone_set('America/Bogota');
        $hora = date('G');
        $dia = date('m-d-Y');
        $dia = new \DateTime();
        $ini = $dia->format('m-d-Y');
        $start = '+0d';
        if ($hora > 13) {
            $dia->modify('+1 day');
            $ini = $dia->format('m-d-Y');
            $start = '+1d';
            //dump($dia->format('m-d-Y'));
            //die();
        }


        $prohibidos = $this->getDoctrine()->getRepository('AppBundle:Nohabil')->findAll();

        $carrito = $session->get('carrito', array());
        $tiene_envio = false;

        foreach ($carrito as $id => $talla) {
            foreach ($talla as $id_talla => $grupo) {
                foreach ($grupo['productos'] as $pos => $grupo_prods) {
                    $envio = $grupo_prods['producto']->getConEnvio();
                    if ($envio)
                        $tiene_envio = true;
                }
            }
        }
        if (!$tiene_envio && 0)
            return $this->redirectToRoute('resumen_compra');


        $factura = $session->get('factura', null);
        $envio = $session->get('envio', null);
        if (count($carrito) == 0) {
            return $this->redirectToRoute('productos');
        }
        if ($factura == null)
            return $this->redirectToRoute('datos-factura');
        else {
            $factura = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->find($factura->getId());
        }
        if ($envio)
            $envio = $this->getDoctrine()->getRepository('CarroiridianBundle:Envio')->find($envio->getId());
        else
            $envio = new Envio();

        if ($user)
            $envios = $em->createQueryBuilder()
                ->select('f.id', 'e.nombre as nombre', 'e.apellidos as apellidos', 'ci.id as ciudad', 'e.direccion as direccion', 'e.oficina as oficina', 'e.telefono as telefono', 'e.adicionales as adicionales')
                ->from('CarroiridianBundle:Factura', 'f')
                ->leftJoin('f.envio', 'e')
                ->leftJoin('e.ciudad', 'ci')
                ->leftJoin('f.comprador', 'u')
                ->where('u.id = ' . $user->getId())
                ->andWhere('e.id is not null')
                ->groupBy('e.direccion')
                ->getQuery()
                ->useQueryCache(true)
                ->useResultCache(true)
                ->getArrayResult();
        else {
            $envios = array();
        }
        $fechaPlan = $ci->getPlanFecha();
        if ($fechaPlan) {
            $fechaPlan = \DateTime::createFromFormat('Y-m-d', $fechaPlan)->format('m-d-Y');
            $envio->setFechaDeEnvio($fechaPlan);
        } else {
            $fechaPlan = '';
        }
        $envio->setCiudad($ciudad);
        $form = $this->createForm(EnvioType::class, $envio, array('locale' => $request->getLocale()));
        $form->handleRequest($request);
        if ($form->isValid()) {

            $em->persist($envio);
            $em->flush();
            $factura->setEnvio($envio);
            $em->merge($factura);
            $em->flush();
            $session->set('factura', $factura);
            $session->set('envio', $envio);

            $micro2 = microtime(true);
            $micro1 = $micro2 - $micro;

            $cont_admin_info = array(
                "ObjType"   =>  2,
                "IDDB"      =>  10000101,
                "Token"     =>  "EB18D5439C45212BEBA999DD150B4744"
            );
            $AdminInfo = array("AdminInfo" => $cont_admin_info);


            $gen = array("Field" => "U_RDE_Genero", "Value" => "E");
            $month = array("Field" => "U_RDE_Mes", "Value" => "12");
            $day = array("Field" => "U_RDE_Dia", "Value" => "24");
            $edv = array("Field" => "U_RDE_EstiloVida", "Value" => "HOG");
            $prc = array("Field" => "U_RDE_PrefCompra", "Value" => "CR");
            $tbo = array("Field" => "U_RDE_TipBole", "Value" => "M/C");
            $mop = array("Field" => "U_RDE_MotPlanRec", "Value" => "TODOS");
            $ran = array("Field" => "U_RDE_Edad", "Value" => $factura->getRangoedad()->getId());
            $bp_info = array(
                "CardCode"      =>  "CT" . $factura->getDocumento(),
                "CardName"      =>  strtoupper($factura->getFullName()),
                "CardType"      =>  "C",
                "GroupCode"     =>  "102",
                "FederalTaxID"  =>  $factura->getDocumento(),
                //"Address"       =>  "102",
                "Cellular"      =>  $factura->getCelular(),
                "Email"         =>  $factura->getEmail(),
                "UserField"     =>  array(
                    "RowFieldSN" => array($gen, $month, $day, $edv, $prc, $tbo, $mop, $ran)
                )

            );
            $BusinessPartners = array("BusinessPartners" => $bp_info);

            $tipo = "Casa";

            if ($factura->getEnvio()->getOficina())
                $tipo = "Oficina";
            $ad_info = array(
                "AddressName"   =>  $tipo,
                "Street"        =>  $factura->getDireccion(),
                "City"          =>  $factura->getEnvio()->getCiudad()->getNombre(),
                "Country"       =>  "CO",
                "State"         =>  "Colombia",
                "AddressType"   =>  "S",
                "Block"         =>  "1234567"
            );
            $Addresses = array("Addresses" => array(
                "RowSN" => $ad_info
            ));

            $micro3 = microtime(true) - $micro2;
            // $client = new \nusoap_client('http://45.163.28.59:13027/SIC.asmx?WSDL', true);
            $full_array = array_merge($AdminInfo, $BusinessPartners, $Addresses);
            // $this->saveSincroData($full_array);
            // $response = $client->call('SincroSN', $full_array);
            $micro2 = microtime(true) - $micro2;
            // error_log("m1: $micro1, m2: $micro3, m3: $micro2\n",3,'log_jimmy.log');
            // error_log(json_encode(['body' => $client->request,'SAP_Sincro'=>$response]).PHP_EOL,3,'log_jimmy.log');
            /*
            $body = $client->request;

            return $this->render('HomeBundle:Default:soap.html.twig',array('response'=>$response,'body'=>$body,'full_array'=>$full_array));
            */

            return $this->redirectToRoute('resumen_compra');
        }


        return $this->render('CarroiridianBundle:Default:datos_envio.html.twig', array(
            'carrito' => $carrito, 'form' => $form->createView(), 'factura' => $factura, 'prohibidos' => $prohibidos, 'start' => $start, 'dia' => $ini,
            'envios' => $envios, 'fechaPlan' => $fechaPlan
        ));
    }

    private function saveSincroData($data)
    {
        $path = __DIR__ . '/../../../html/sincros.json';
        if (!file_exists($path)) {
            file_put_contents($path, '[]');
        }
        $json = file_get_contents($path);
        $arr = json_decode($json, true);
        array_push($arr, $data);
        $json = json_encode($arr);
        var_dump($json);
        exit();
        file_put_contents(__DIR__ . '/dan.json', $json);
        // error_log("json: $json, arr: $arr \n",3,'log_dan.log');
        file_put_contents($path, $json);
    }

    /**
     * @Route("/resumen-compra", name="resumen_compra")
     */

    public function resumenCompraAction(Request $request)
    {

        $session = $request->getSession();
        $factura = $session->get('factura');
        $carrito = $session->get('carrito', array());

        $envio = $session->get('envio', null);
        $ci = $this->get('ci');
        if ($factura == null)
            return $this->redirect($this->generateUrl('carrito'));
        if ($ci->getConDedicatoria() && !$factura->getDedicatoria()) {
            return $this->redirect($this->generateUrl('dedicatoria'));
        }
        if ($ci->getConEnvio() && !$envio) {
            return $this->redirect($this->generateUrl('datos-envio'));
        }
        return $this->render('CarroiridianBundle:Default:resumen_compra_envio.html.twig', array());
    }

    /**
     * @Route("/dedicatoria", name="dedicatoria")
     */
    public function dedicatoriaAction(Request $request)
    {
        $ci = $this->get('ci');
        if (!$ci->getConDedicatoria()) {
            return $this->redirectToRoute('registro_login');
        }
        $session = new Session();
        $carrito = $session->get('carrito', array());
        $tiene_dedi = false;

        foreach ($carrito as $id => $talla) {
            foreach ($talla as $id_talla => $grupo) {
                foreach ($grupo['productos'] as $pos => $grupo_prods) {
                    $dedi = $grupo_prods['producto']->getDedicatoria();
                    if ($dedi)
                        $tiene_dedi = true;
                }
            }
        }
        if (!$tiene_dedi && 0)
            return $this->redirectToRoute('registro_login');


        $inspiraciones = $this->getDoctrine()->getRepository('CarroiridianBundle:Inspiracion')->findBy(array('visible' => true), array("orden" => "asc"));
        $tipos = $this->getDoctrine()->getRepository('CarroiridianBundle:TipoInspiracion')->findBy(array('visible' => true), array("orden" => "asc"));


        $dedicatoria = $session->get('dedicatoria', null);
        if ($dedicatoria == null)
            $dedicatoria = new Dedicatoria();
        else
            $dedicatoria = $this->getDoctrine()->getRepository('CarroiridianBundle:Dedicatoria')->find($dedicatoria->getId());
        $form = $this->createForm(DedicatoriaType::class, $dedicatoria);
        $form->handleRequest($request);
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($dedicatoria);
            $em->flush();
            $session->set('dedicatoria', $dedicatoria);
            return $this->redirectToRoute('registro_login');
        }

        return $this->render('CarroiridianBundle:Default:dedicatoria.html.twig', array('inspiraciones' => $inspiraciones, 'tipos' => $tipos, 'form' => $form->createView()));
    }

    /**
     * @Route("/direccion", name="direccion")
     */
    public function direccionAction(Request $request)
    {
        return $this->redirectToRoute('homepage');
        $securityContext = $this->container->get('security.authorization_checker');
        if (!$securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            $url = $this->generateUrl('homepage');
            $response = new RedirectResponse($url);
            return $response;
        }
        $user = $this->getUser();
        $direcciones = $user->getDirecciones();
        $envio = new Envio();
        if ($request->isMethod('GET')) {
            $departamento = $this->getDoctrine()->getRepository('CarroiridianBundle:Departamento')->find(2);
            $envio->setUser($user);
            $envio->setDepartamento($departamento);
        }
        $form = $this->createForm(EnvioType::class, $envio);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $envio = $form->getData();
            $em = $this->getDoctrine()->getManager();
            $em->persist($envio);
            $em->flush();

            $session = new Session();
            $session->set('direccion_id', $envio->getId());

            return $this->redirectToRoute('pagar_payu');
        }
        return $this->render('CarroiridianBundle:Default:direccion.html.twig', array('form' => $form->createView(), 'direcciones' => $direcciones));
    }

    /**
     * @Route("/direccion-sesion/{id}", name="direccion_sesion")
     */
    public function direccionSesionAction(Request $request, $id)
    {
        $envio = $this->getDoctrine()->getRepository('CarroiridianBundle:Envio')->find($id);
        $session = new Session();
        $session->set('direccion_id', $envio->getId());
        return $this->redirectToRoute('pagar_payu');
    }
    /**
     * @Route("/mensaje", name="mensaje")
     */
    public function mensajeAction()
    {
        return $this->render('CarroiridianBundle:Default:mensaje.html.twig');
    }


    /**
     * @Route("/productos", name="productos")
     * @Cache(maxage="3600", public=true, smaxage="3600")
     */
    public function productosAction(Request $request)
    {
        return $this->render('CarroiridianBundle:Default:productos.html.twig', array('productos' => array()));
    }
    /**
     * @Route("/pret", name="pret")
     * @Cache(maxage="20", public=true)
     */
    public function pretAction()
    {
        return $this->render('CarroiridianBundle:Default:productos.html.twig', array('productos' => array()));
    }

    /**
     * @Route("/boutique", name="boutique")
     * @Cache(maxage="20", public=true)
     */
    public function boutiqueAction()
    {
        return $this->render('CarroiridianBundle:Default:productos.html.twig');
    }

    /**
     * @Route("/corporativo", name="corporativo")
     * @Cache(maxage="20", public=true)
     */
    public function corporativoAction()
    {
        return $this->render('CarroiridianBundle:Default:productos.html.twig', ['corporativo' => 1]);
    }

    /**
     * @Route("/taller-flores", name="taller-flores")
     */
    public function tallerFloresAction()
    {
        $path = $this->container->getParameter('app.path.productos');
        $em = $this->getDoctrine()->getManager();
        $qb = $em->createQueryBuilder('p')
            ->select('p')
            ->from('CarroiridianBundle:Producto', 'p')
            ->where('p.taller = 1')
            ->andWhere('p.corporativo = 0')
            ->andWhere('p.visible = 1')
            ->orderBy('p.orden', 'ASC');
        $talleres = $qb->getQuery()->getResult();
        return $this->render('CarroiridianBundle:Default:taller_flores.html.twig', array('talleres' => $talleres));
    }
    /**
     * @Route("/taller-corporativo", name="taller-corporativo")
     */
    public function tallerCorporativoAction()
    {
        $path = $this->container->getParameter('app.path.productos');
        $em = $this->getDoctrine()->getManager();
        $qb = $em->createQueryBuilder('p')
            ->select('p')
            ->from('CarroiridianBundle:Producto', 'p')
            ->where('p.taller = 1')
            ->andWhere('p.corporativo = 1')
            ->andWhere('p.visible = 1')
            ->orderBy('p.orden', 'ASC');
        $talleres = $qb->getQuery()->getResult();
        return $this->render('CarroiridianBundle:Default:taller_flores.html.twig', array('talleres' => $talleres));
    }
    /**
     * @Route("/taller-flores/{id}/{slug}", name="taller-flores-interna")
     */
    public function tallerFloresInternAction($id, $slug)
    {
        $taller = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto')->find($id);
        return $this->render('CarroiridianBundle:Default:taller_flores_intern.html.twig', array('id' => $id, 'slug' => $slug, 'taller' => $taller));
    }
    /**
     * @Route("/plan-abasto", name="plan-abasto")
     */
    public function planAbastoAction()
    {
        return $this->render('CarroiridianBundle:Default:plan_abasto.html.twig', array('corporativo' => false));
    }
    /**
     * @Route("/plan-abasto-corporativo", name="plan-abasto-corporativo")
     */
    public function planAbastoCorpAction()
    {
        return $this->render('CarroiridianBundle:Default:plan_abasto.html.twig', array('corporativo' => true));
    }

    /**
     * @Route("/plan-abasto/{id}/{name}", name="intern-abasto")
     */
    public function show(Request $request, $id, $name)
    {
        date_default_timezone_set('America/Bogota');
        $ci = $this->get('ci');
        $plan = $ci->getPlan($id);
        $config = $ci->getConfigPlan($id);
        $config = $config[0];
        $path = $this->container->getParameter('app.path.productos');
        $hora = date('G');
        $last = new \DateTime();
        $last->add(new \DateInterval('P6M'));
        $limitDate = $last->format('Y-m-d');
        $start = '+7d';
        $task = new Abasto();
        $form = $this->createForm(AbastoType::class, $task, [
            'locale' => $request->getLocale(),
            'duraciones' => $config->getDuraciones(),
            'qi' => $this->get('qi')
        ]);

        // error_log(serialize($config).PHP_EOL,3,'log_jimmy.log');

        return $this->render('CarroiridianBundle:Default:single_plan.html.twig', array(
            'form' => $form->createView(), 'start' => $start, 'plan' => $plan,
            'config' => $config, 'path' => $path, 'limitDate' => $limitDate
        ));
    }

    /**
     * @Route("/hacer-florero", name="hacer-florero")
     */
    public function hacerFloreroAction()
    {
        return $this->render('CarroiridianBundle:Default:hacer_florero.html.twig', array('productos' => array()));
    }

    /**
     * @Route("/productos_por_categoria/{categoria}/{nombre}/{boutique}",defaults={"categoria": "1","nombre":"cajas","boutique":0}, name="productos_por_categoria")
     * @Cache(maxage="20", public=true)
     */
    public function productosCategoriaAction($categoria, $nombre, $boutique)
    {
        return $this->render('CarroiridianBundle:Default:productos.html.twig', array('categoria' => $categoria, 'cat_boutique' => $boutique));
    }

    /**
     * @Route("/productos_por_precio/{limit1}/{limit2}",defaults={"limit1": 0,"limit2": 0}, name="productos_por_precio")
     * @Cache(maxage="20", public=true)
     */
    public function productosPrecioAction($limit1, $limit2)
    {
        if ($limit2 < $limit1 && $limit2 > 0) {
            $limit1 = 0;
            $limit2 = 300000;
        }
        return $this->render('CarroiridianBundle:Default:productos.html.twig', array('limit1' => $limit1, 'limit2' => $limit2));
    }

    /**
     * @Route("/productos_mas_vendidos", name="productos_mas_vendidos")
     * @Cache(maxage="20", public=true)
     */
    public function productosMasVendidosAction()
    {
        return $this->render('CarroiridianBundle:Default:productos.html.twig', array('masVendidos' => 1));
    }

    /**
     * @Route("/productos_por_color/{color}/{nombre}", name="productos_por_color")
     * @Cache(maxage="20", public=true)
     */
    public function productosColorAction($color)
    {
        return $this->render('CarroiridianBundle:Default:productos.html.twig', array('color' => $color));
    }

    /**
     * @Route("/productos_por_ocasion/{ocasion}/{nombre}", name="productos_por_ocasion")
     * @Cache(maxage="20", public=true)
     */
    public function productosOcasionAction($ocasion)
    {
        return $this->render('CarroiridianBundle:Default:productos.html.twig', array());
    }

    /**
     * @Route("/productos_por_genero/{genero}", name="productos_por_genero")
     * @Cache(maxage="20", public=true)
     */
    public function productosGenAction($genero)
    {
        return $this->render('CarroiridianBundle:Default:productos.html.twig', array('genero' => $genero));
    }

    /**
     * @Route("/productos_por_gen_cat/{genero}/{categoria}", name="productos_por_gen_cat")
     * @Cache(maxage="20", public=true)
     */
    public function productosCatGenAction($genero, $categoria)
    {
        return $this->render('CarroiridianBundle:Default:productos.html.twig', array('genero' => $genero));
    }


    public function generateRandomString($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    /**
     * @Route("/cambio_ciudad/{ciudad_id}", name="cambio_ciudad")
     */
    public function cambioCiudadAction(Request $request, $ciudad_id)
    {
        $session = new Session();
        $ciudad_old = $session->get('ciudad');
        $session->set('ciudad', $ciudad_id);
        //die($ciudad_id);
        $referer = $request->headers->get('referer');
        if ($ciudad_old == $ciudad_id)
            $url = $referer;
        else {
            $session->set('carrito', array());
            if (strpos($referer, 'product') !== false)
                $url = $referer;
            else
                $url = $this->generateUrl('productos');
        }
        if (!$session->get('alamacenes') || $ciudad_old != $ciudad_id) {
            $this->setAlmacenes($ciudad_id);
        }

        return new JsonResponse(array("url" => $url));
    }

    public function setAlmacenes($ciudad_id)
    {
        $session = new Session();
        $ci = $this->get('ci');
        $almacenes = $ci->getAlmacenesCiudad($ciudad_id);
        $session->set('almacenes', $almacenes);
        // error_log(json_encode($almacenes).PHP_EOL,3,'log_jimmy.log');
    }

    /**
     * @Route("/product/{id}/{nombre}", name="product")
     * @Cache(maxage="20", public=true)
     */
    public function productAction(Request $request, $id)
    {

        $path = $this->container->getParameter('app.path.productos');
        $producto = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto')->find($id);
        $imagenes = array();
        array_push($imagenes, $path . '/' . $producto->getImagen());
        foreach ($producto->getGalerias() as $galeria) {
            array_push($imagenes, $path . '/' . $galeria->getImagen());
        }
        $session = new Session();
        $wish_list = $session->get('wish', array());
        $ciudad = $session->get('ciudad', 0);
        $ciudad = $request->get('ciudad', $ciudad);

        if ($producto->getCategoria()->getId() == 5) {
            if (count($producto->getInventarios()) == 0) {
                $talla = $this->getDoctrine()->getRepository('CarroiridianBundle:Talla')->find(1);
                $inventario = new Inventario();
                $inventario->setPreciobase($producto->getPrecio());
                $inventario->setPrecio($producto->getPrecio());
                $inventario->setCantidad(10);
                $inventario->setTalla($talla);
                $inventario->setProducto($producto);
                $em = $this->getDoctrine()->getManager();
                $em->persist($inventario);
                $em->flush();
            }
        }
        $ci = $this->get('ci');
        $almacenes = $session->get('almacenes', array());
        if (empty($almacenes)) {
            $almacenes = $ci->getAlmacenesCiudad($ciudad);
        }
        $stock = $ci->getStockProducts([['sap' => $producto->getSap()]], $almacenes);
        $always = ($stock >= 999);
        $colorPath = $this->container->getParameter('app.path.imagesgal');
        return $this->render('CarroiridianBundle:Default:producto.html.twig', array('producto' => $producto, 'imagenes' => $imagenes, "in_wish" => isset($wish_list[$id]), "ciudad" => $ciudad, 'colorPath' => $colorPath, 'always' => $always));
    }

    /**
     * @Route("/gift", name="gift")
     */
    public function giftAction(Request $request)
    {
        $bono = new Bono();

        $form = $this->createForm(BonoType::class, $bono);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $bono = $form->getData();
            $bono->setCodigo($this->generateRandomString());
            $em = $this->getDoctrine()->getManager();
            $em->persist($bono);
            $em->flush();

            $session = new Session();
            $bonos = $session->get('bonos', array());
            //$bono = new Bono();
            $bono_s = array('id' => $bono->getId(), 'de' => $bono->getDe(), 'para' => $bono->getPara(), 'valor' => $bono->getValorbono()->getValor(), 'mensaje' => $bono->getMensaje());
            array_push($bonos, $bono_s);
            $session->set('bonos', $bonos);

            return $this->redirectToRoute('carrito');
        }
        return $this->render('HomeBundle:Default:gift.html.twig', array('form' => $form->createView()));
    }

    /**
     * @Route("/buscador-productos", name="busca_productos")
     */
    public function buscadorAction(Request $request)
    {
        $ci = $this->get('ci');
        $productos = $ci->getProductos(null, null, $request->query->get('search'));
        return $this->render('CarroiridianBundle:Default:productos.html.twig', array('productos' => $productos, "search" => $request->query->get('search')));
    }

    /**
     * @Route("/limpiar-carrito", name="limpiar_carrito")
     */
    public function limpiarCarritoAction(Request $request)
    {
        $session = new Session();
        $session->set('carrito', array());
        $session->set('rosa', false);
        $session->set('dedicatoria', null);
        $session->set('envio', null);
        $session->set('factura', null);

        return new RedirectResponse($this->generateUrl('productos'));
    }

    /**
     * @Route("/sin-registro", name="sin_registro")
     */
    public function sinRegistroAction(Request $request)
    {
        $session = new Session();
        $session->set('sin_registro', true);
        return new RedirectResponse($this->generateUrl('datos-factura'));
    }

    /**
     * @Route("/wishlist", name="wishlist")
     */
    public function wishlistAction()
    {
        $session = new Session();
        $user = $this->getUser();
        $ci = $this->get("ci");
        if ($user) {
            $whish = $this->getDoctrine()->getRepository("CarroiridianBundle:Wish")->findBy(array("user" => $user));
            $productos = array();
            foreach ($whish as $prod) {
                $productos[$prod->getProducto()->getId()] = $ci->getProductoById($prod->getProducto()->getId());
            }
        } else {
            $productos = $session->get('wish', array());
        }

        return $this->render('CarroiridianBundle:Default:productos.html.twig', array('productos' => $productos));
    }

    /**
     * @Route("/add-wish/{id}", name="add_wish")
     */
    public function wishAction($id, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $user = $this->getUser();
        $ci = $this->get('ci');
        $producto = $this->getDoctrine()->getRepository("CarroiridianBundle:Producto")->find($id);
        $session = new Session();
        $productos = array();
        if ($user) {
            $anterior = $this->getDoctrine()->getRepository("CarroiridianBundle:Wish")->findOneBy(array("user" => $user, "producto" => $producto));
            if (!$anterior) {
                $nuevo = new Wish();
                $nuevo->setUser($user);
                $nuevo->setProducto($producto);
                $em->persist($nuevo);
                $em->flush();
            } else {
                $em->remove($anterior);
                $em->flush();
            }
            $whish = $this->getDoctrine()->getRepository("CarroiridianBundle:Wish")->findBy(array("user" => $user));
            $productos = array();
            foreach ($whish as $prod) {
                $productos[$prod->getProducto()->getId()] = $ci->getProductoById($prod->getProducto()->getId());
            }

            $session->set("wish", $productos);
        } else {
            $productos = $session->get('wish', array());
            if (isset($productos[$id]) || array_key_exists($id, $productos)) {
                unset($productos[$id]);
            } else if ($producto != null) {
                $productos[$id] = $producto;
            }
            $session->set("wish", $productos);
        }


        if (count($productos) > 0)
            return $this->redirectToRoute('wishlist');
        else {
            $referer = $request->headers->get('referer');
            return new RedirectResponse($referer);
        }
    }

    /**
     * @Route("/plan-price/{cat_id}/{size_id}/{dur_id}/{entregas}", name="plan-price")
     */
    public function planPrice($cat_id, $size_id, $dur_id, $entregas)
    {
        $session = new Session();
        $carrito = $session->get('carrito', array());
        return new JsonResponse($carrito);
        $em = $this->getDoctrine()->getManager();
        $duracion = $em->getRepository('CarroiridianBundle:Duracion')->find($dur_id);
        $dias = $duracion->getDias();
        $entregasMes = 1;
        if ($dias <= 30) {
            $entregasMes = floor(30 / $dias);
        }
        $meses = $entregas / $entregasMes;
        $qb = $em->createQueryBuilder()
            ->from('CarroiridianBundle:PrecioPlan', 'p')
            ->select('p')
            ->innerJoin('p.tamano', 't', \Doctrine\ORM\Query\Expr\Join::WITH, 't.id = ' . $size_id)
            ->innerJoin('p.plan', 'pr')
            ->innerJoin('pr.categoria', 'c', \Doctrine\ORM\Query\Expr\Join::WITH, 'c.id = ' . $cat_id)
            ->setMaxResults(1);
        $q = $qb->getQuery();
        $precioPlan = $q->getOneOrNullResult();
        $precioMes = $precioPlan->{'getPrecio' . $entregasMes}();
        $precioTotal = $precioMes * $meses;
        return new JsonResponse(['p_id' => $precioPlan->getPlan()->getId(), 'total' => $precioTotal]);
    }
}

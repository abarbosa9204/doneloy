<?php

namespace ApiBundle\Controller;

use AppBundle\AppBundle;
use AppBundle\Entity\Settings;
use AppBundle\Entity\Tarjeta;
use AppBundle\Entity\User;
use CarroiridianBundle\Entity\Compra;
use CarroiridianBundle\Entity\Compraitem;
use CarroiridianBundle\Entity\Dedicatoria;
use CarroiridianBundle\Entity\Envio;
use CarroiridianBundle\Entity\Factura;
use CarroiridianBundle\Entity\Inventario;
use CarroiridianBundle\Entity\InventarioAlmacen;
use CarroiridianBundle\Entity\Producto;
use CarroiridianBundle\Entity\Talla;
use Doctrine\Common\Persistence\ObjectManager;
use JMS\Serializer\SerializerBuilder;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller
{

    /**
     * Retorna todos los productos visibles
     * @Route("/api/tallacoloresproducto/{ciudad}/{productoid}")
     * @Method({"GET"})
     */
    public function tallacoloresproductoAction($ciudad,$productoId)
    {
        $serializer = $this->get('serializer');
        $ci= $this->get("ci");
        $productos =$ci->getTallasColoresProductoByCiudad($productoId, $ciudad);
        $json = $serializer->serialize($productos,'json');
        return new Response($json);
    }

    /**
     * Retorna todos los productos visibles
     * @Route("/api/colores")
     * @Method({"GET"})
     */
    public function coloresAction()
    {
        $serializer = $this->get('serializer');
        $ci= $this->get("ci");
        $productos =$ci->getColores();
        $json = $serializer->serialize($productos,'json');
        return new Response($json);
    }

    /**
     * Retorna todos los productos visibles
     * @Route("/api/tallasproducto/{productoId}")
     * @Method({"GET"})
     */
    public function tallasproductoAction($productoId)
    {
        $serializer = $this->get('serializer');
        $ci= $this->get("ci");
        $productos =$ci->getTallasProducto($productoId);
        $json = $serializer->serialize($productos,'json');
        return new Response($json);
    }

    /**
     * Retorna todos los productos visibles
     * @Route("/api/productoinfo/{ciudad}/{productoId}")
     * @Method({"GET"})
     */
    public function productoinfoAction($ciudad,$productoId)
    {
        $serializer = $this->get('serializer');
        $ci= $this->get("ci");
        $tallas =$ci->getTallasProducto($productoId);
        $colores =$ci->getTallasColoresProductoByCiudad($productoId, $ciudad);
        $ret=array("tallas"=>$tallas,"colores"=>$colores);
        $json = $serializer->serialize($ret,'json');
        return new Response($json);
    }

    /**
     * retorna modifica un usuario
     * @Route("/api/registro-actualizar")
     * @Method({"POST"})
     */
    public function registroActualizarAction(Request $request)
    {
        $serializer = $this->get('serializer');
        $nombre=$request->get('nombre');
        $apellidos=$request->get('apellidos');
        $telefono=$request->get('telefono');
        $email=$request->get('email');
        $edad=$request->get('edad');
        $username=$request->get('username');
        $plainPassword=$request->get('plainPassword');
        /** @var $user User */
        $user=$this->getDoctrine()->getRepository("AppBundle:User")->findOneBy(array("username"=>$username));

        $resultado= array("ok"=>false,"error_msg"=>"");
        if($user){
            $user->setNombre($nombre);
            $user->setApellidos($apellidos);
            $user->setTelefono($telefono);
            $user->setUsername($username);
            $user->setPlainPassword($plainPassword);
            $rango=$this->getDoctrine()->getRepository("AppBundle:RangoEdad")->find($edad);
            $user->setRangoedad($rango);

            $em=$this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();
            $user = $this->getDoctrine()
                ->getRepository('AppBundle:User')
                ->createQueryBuilder('p')
                ->select('p.id','p.nombre','p.apellidos','p.telefono','p.email','p.username')
                ->where('p.username = :username')
                ->setParameter('username', $username)
                ->getQuery()
                ->useQueryCache(true)
                ->useResultCache(true)
                ->getSingleResult();

            $resultado= array("ok"=>true,"error_msg"=>"","usuario"=>$user);
        }else{
            $resultado= array("ok"=>false,"error_msg"=>"Usuario no existe");

        }

        $json = $serializer->serialize($resultado,'json');
        return new Response($json);
    }


    /**
     * retorna los terminios y condiciones
     * @Route("/api/registro")
     * @Method({"POST"})
     */
    public function registroAction(Request $request)
    {
        $serializer = $this->get('serializer');
        $nombre=$request->get('nombre');
        $apellidos=$request->get('apellidos');
        $telefono=$request->get('telefono');
        $email=$request->get('email');
        $edad=$request->get('edad');
        $username=$request->get('username');
        $plainPassword=$request->get('plainPassword');

        $user=$this->getDoctrine()->getRepository("AppBundle:User")->findBy(array("username"=>$username));
        $resultado= array("ok"=>false,"error_msg"=>"");
        if($user){
            $resultado= array("ok"=>false,"error_msg"=>"Username no disponible");
        }else{
            $user = new User();
            $user->setNombre($nombre);
            $user->setApellidos($apellidos);
            $user->setTelefono($telefono);
            $user->setEmail($email);
            $user->setUsername($username);
            $user->setPlainPassword($plainPassword);
            $rango=$this->getDoctrine()->getRepository("AppBundle:RangoEdad")->find($edad);
            $user->setRangoedad($rango);
            $user->setEnabled(true);

            $em=$this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();
            $resultado= array("ok"=>true,"error_msg"=>"","usuario"=>$user);
        }

        $json = $serializer->serialize($resultado,'json');
        return new Response($json);
    }

    /**
     * retorna un usuario dado el username
     * @Route("/api/user/{username}")
     * @Method({"GET"})
     */
    public function usuarioAction($username)
    {
        $serializer = $this->get('serializer');
        /** @var $user User */


        $user = $this->getDoctrine()
            ->getRepository('AppBundle:User')
            ->createQueryBuilder('p')
            ->select('p.id','p.nombre','p.apellidos','p.telefono','p.email','p.username','r.id as edad')
            ->leftJoin('p.rangoedad','r')
            ->where('p.username = :username')
            ->setParameter('username', $username)
            ->getQuery()
            ->useQueryCache(true)
            ->useResultCache(true)
            ->getSingleResult();

        $json = $serializer->serialize($user,'json');
        return new Response($json);
    }

    /**
     * Retorna todas los rangos de edad
     * @Route("/api/rangosedad")
     * @Method({"GET"})
     */
    public function rangosAction()
    {
        $serializer = $this->get('serializer');


        $rangos = $this->getDoctrine()->getRepository("AppBundle:RangoEdad")->findAll();


        $json = $serializer->serialize($rangos,'json');
        return new Response($json);
    }

    /**
     * Retorna todas los rangos de edad
     * @Route("/api/rosaveloz")
     * @Method({"GET"})
     */
    public function rosavelozAction()
    {
        $serializer = $this->get('serializer');
        $qi= $this->get("qi");
        $precio=$qi->getSettingDB("precio_rosa_veloz");
        $habilitado = $qi->getSettingDB("rosa_veloz");
        $descripcion = $qi->getTextoDB("rosa_veloz");
        $resultado= array("ok"=>true,"precio"=>$precio,"habilitado"=>$habilitado,"descripcion"=>$descripcion);

        $json = $serializer->serialize($resultado,'json');
        return new Response($json);
    }

    /**
     * retorna los terminios y condiciones
     * @Route("/api/terminos")
     * @Method({"GET"})
     */
    public function terminosAction()
    {

        return new JsonResponse(array('terminos'=>$this->get("qi")->getTextoBigDB("terminos")));
    }

    /**
     * @Route("/api")
     */
    public function indexAction()
    {
        return new JsonResponse(array('data'=>1));
    }

    /**
     * Elimina un tarjeta
     * @Route("/api/eliminar-tarjeta/{idtarjeta}")
     * @Method({"GET"})
     */
    public function eliminarTarjetaAction($idtarjeta)
    {
        $serializer = $this->get('serializer');
        $resultado= array("ok"=>true,"error_msg"=>"");
        try{
            $tarjeta= $this->getDoctrine()->getRepository("AppBundle:Tarjeta")->find($idtarjeta);
            if($tarjeta){

                $em = $this->getDoctrine()->getManager();
                $em->remove($tarjeta);
                $em->flush();
            }else{
                $resultado= array("ok"=>false,"error_msg"=>"Tarjeta no existe");
            }
        }catch(\Exception $e){
            $resultado= array("ok"=>false,"error_msg"=>$e->getMessage());
        }

        $json = $serializer->serialize($resultado,'json');
        return new Response($json);
    }


    /**
     * Adicionar un tarjeta a un usuario dado
     * @Route("/api/secure/agregar-tarjeta")
     * @Method({"POST"})
     */
    public function agregarTarjetaAction(Request $request)
    {

        $numeroTarjeta=$request->get('numeroTarjeta');
        $fecha=$request->get('fecha');
        $cvv=$request->get('cvv');
        $numDoc=$request->get('numDoc');
        $tipoDoc=$request->get('tipoDoc');
        $titular=$request->get('titular');
        $usuarioId=$request->get('usuarioId');
        $tipoTarjeta=$request->get('tipoTarjeta');

        $serializer = $this->get('serializer');
        $resultado= array("ok"=>true,"error_msg"=>"");

        try{
            $user= $this->getDoctrine()->getRepository("AppBundle:User")->find($usuarioId);
            if($user) {
                $nueva = new Tarjeta();
                $nueva->setFecha(str_replace("-","/", $fecha));
                $nueva->setCvv($cvv);
                $nueva->setNumDoc($numDoc);
                $nueva->setNumeroTarjeta(substr($numeroTarjeta,-4));
                $nueva->setUltimos( substr($numeroTarjeta,-4));
                $nueva->setTipoDoc($tipoDoc);
                $nueva->setTipoTarjeta($tipoTarjeta);
                $nueva->setTitular($titular);
                $nueva->setUsuario($user);




                $datos_payu = $this->getDoctrine()->getRepository('PagosPayuBundle:DatosPayu')->find(1);
                $apiKey = $datos_payu->getApiKey();
                $apiLogin= $datos_payu->getApiLogin();
                $merchant = $datos_payu->getMerchantId();
                $account = $datos_payu->getAccountId();

                $apiLogin="pRRXKOl8ikMmt9u";
                $apiKey="4Vj8eK4rloUd272L48hsrarnUA";
                $account="512321";
                $merchant = "508029";
                $url = 'https://api.payulatam.com/payments-api/4.0/service.cgi';
                if($datos_payu->getTest() || true){
                    $url = 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi';
                }
                $fields = array(
                    'language' => "es",
                    'command' => "CREATE_TOKEN",
                    'merchant' => [
                        "apiLogin" => $apiLogin,//"tI7P45k3FawXHpG",
                        "apiKey" =>$apiKey//"23115978"
                    ],
                    'creditCardToken' => [
                        "payerId" => str_pad($user->getId(),20,"0",STR_PAD_LEFT),
                        "name" => $nueva->getTitular(),
                        "identificationNumber" => $nueva->getNumDoc(),
                        "paymentMethod" => $nueva->getTipoTarjeta(),
                        "number" => $numeroTarjeta,
                        "expirationDate" => $nueva->getFecha()
                    ]
                );

                $data_string = json_encode($fields);
                $ch = curl_init($url);
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
                curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                        'Content-Type: application/json',
                        'Content-Length: ' . strlen($data_string))
                );
                curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; MSIE 9.0; WIndows NT 9.0; en-US)');
                //curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                //curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

                $result = curl_exec($ch);
                curl_close($ch);
                $serializer = SerializerBuilder::create()->build();
                $xml = new \SimpleXMLElement($result);
                if($xml->error){
                    $resultado= array("ok"=>false,"error_msg"=>$xml->error->__toString());

                }else {
                    $nueva->setCode($xml->code->__toString());
                    $nueva->setCreditCardTokenId($xml->creditCardToken->creditCardTokenId->__toString());

                    $em = $this->getDoctrine()->getManager();
                    $em->persist($nueva);
                    $em->flush();
                    $nueva->setusuario(null);
                    $resultado= array("ok"=>true,"error_msg"=>"","tarjeta"=>$nueva);
                }


            }else{
                $resultado= array("ok"=>false,"error_msg"=>"Usuario no existe");
            }

        }catch (\Exception $e){
            $resultado= array("ok"=>false,"error_msg"=>$e->getMessage());
        }

        $json = $serializer->serialize($resultado,'json');
        return new Response($json);
    }

    /**
     * Retorna todas las tarjetas de un usuario
     * @Route("/api/listar-tarjetas/{usuario}")
     * @Method({"GET"})
     */
    public function listarTarjetasAction($usuario)
    {
        $serializer = $this->get('serializer');


        $tarjetas = $this->getDoctrine()
            ->getRepository('AppBundle:Tarjeta')
            ->createQueryBuilder('t')
            ->select('t.id','t.ultimos')
            ->leftJoin('t.usuario','u')
            ->where('u.id = :usuario')
            ->setParameter("usuario",$usuario)
            ->getQuery()
            ->useQueryCache(true)
            ->useResultCache(true)
            ->getArrayResult();


        $json = $serializer->serialize($tarjetas,'json');
        return new Response($json);
    }

    /**
     * adiciona un producto
     * @Route("/api/producto/{sap}/{sku}/{nombreEs}/{nombreEn}/{precio}/{codigoIva}/{porcentajeIva}/{categoria_id}/{preciobase}")
     * @Method({"POST"})
     */
    public function productoAction($sap,$sku,$nombreEs,$nombreEn,$precio,$codigoIva,$porcentajeIva,$categoria_id,$preciobase)
    {
        $nuevo = false;
        $producto = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto')->findOneBy(array('sku'=>$sku));
        $categoria = $this->getDoctrine()->getRepository('CarroiridianBundle:Categoria')->find($categoria_id);
        if(!$categoria){
            return new JsonResponse(array('status'=>2,'mensaje'=>'Categoria inexistente'));
        }
        if(!$producto){
            $producto = new Producto();
            $nuevo = true;
        }
        $producto->setSap($sap);
        $producto->setSku($sku);
        $producto->setNombreEs($nombreEs);
        $producto->setNombreEn($nombreEn);
        $producto->setPrecio($precio);
        $producto->setCodigoIva($codigoIva);
        $producto->setPorcentajeIva($porcentajeIva);
        $producto->setCategoria($categoria);
        $producto->setPreciobase($preciobase);

        $em = $this->getDoctrine()->getManager();
        try {
            $em->persist($producto);
            $em->flush();
        } catch(\Doctrine\ORM\ORMException $e){
            return new JsonResponse(array('status'=>0,'mensaje'=>$e->getMessage()));
        }catch(\Exception $e){
            return new JsonResponse(array('status'=>0,'mensaje'=>$e->getMessage()));
        }
        return new JsonResponse(array('status'=>1,'nuevo'=>$nuevo,'mensaje'=>'Guardado exitosamente'));
    }


    /**
     * retorna un producto dado un SKU
     * @Route("/api/producto/{sku}")
     * @Method({"GET"})
     */
    public function productoGetAction($sku)
    {
        $serializer = $this->get('serializer');
        $producto = $this->getDoctrine()
            ->getRepository('CarroiridianBundle:Producto')
            ->createQueryBuilder('p')
            ->select('p.sap','p.sku','p.nombreEs','p.nombreEn','p.precio','p.destacado','p.descripcionEs','p.descripcionEn',
                'p.minUnidades','p.codigoIva','p.porcentajeIva','c.id as categoria_id','p.imagen')
            ->leftJoin('p.categoria','c')
            ->where('p.sku = :sku')
            ->setParameter('sku', $sku)
            ->getQuery()
            ->useQueryCache(true)
            ->useResultCache(true)
            ->getSingleResult();

        $json = $serializer->serialize($producto,'json');
        return new Response($json);
    }

    /**
     * Retorna todos los productos visibles
     * @Route("/api/productos/{ciudad}")
     * @Method({"GET"})
     */
    public function productosAction($ciudad)
    {
        $serializer = $this->get('serializer');


        $productos = $this->getDoctrine()
        ->getRepository('CarroiridianBundle:Producto')->findBy(array("visible"=>1),array("orden"=>"asc"));
        $ci= $this->get("ci");
        $productos =$ci->getProductosByCiudad(null, null, null , null, null,0 , false, false,$ciudad);
        $json = $serializer->serialize($productos,'json');
        return new Response($json);
    }

    /**
     * retorna el precio de producto dado su talla
     * @Route("/api/precio-producto/{id}/{tallaId}")
     * @Method({"GET"})
     */
    public function precioProductoAction($id,$tallaId)
    {
        $serializer = $this->get('serializer');
        $producto = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto')->findOneBy(array('id'=>$id));
        $talla = $this->getDoctrine()->getRepository('CarroiridianBundle:Talla')->findOneBy(array('id'=>$tallaId));
        $precio=$producto->getPrecio();
        $inventario = $this->getDoctrine()->getRepository('CarroiridianBundle:Inventario')->findOneBy(array('producto'=>$producto,'talla'=>$talla));
        $resultado= array("ok"=>false,"precio"=>$precio);
        if($inventario){
            $precio= $inventario->getPrecio();
            $resultado= array("ok"=>true,"precio"=>$precio);
        }
        $json = $serializer->serialize($resultado,'json');
        return new Response($json);
    }

    /**
     * Retorna valores de una factura anterior
     * @Route("/api/factura-anterior/{usuario}")
     * @Method({"GET"})
     */
    public function facturaAntAction($usuario)
    {
        $serializer = $this->get('serializer');
        $factura=new Factura();
        $resultado=array("existe"=>false,"factura"=>$factura);

        //die(dump($usuario));
        $user=$this->getDoctrine()->getRepository('AppBundle:User')->find($usuario);

        if($user) {
            $factura_ant = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->findOneBy(array('comprador' => $user), array('id' => 'desc'));

            if ($factura_ant) {
                $factura_ant->setCompra(null);
                $factura_ant->setComprador(null);
                $resultado = array("existe" => true, "factura" => $factura_ant);

            }
        }

        $json = $serializer->serialize($resultado,'json');
        return new Response($json);
    }

    /**
     * Retorna todos las crear factura
     * @Route("/api/secure/crear-factura")
     * @Method({"POST"})
     */
    public function crearFacturaAction(Request $request)
    {
        $serializer = $this->get('serializer');

        $nombre=$request->get('nombre');
        $apellidos=$request->get('apellidos');
        $direccion=$request->get('direccion');
        $tipodocumentoId=$request->get('tipodocumentoId');
        $documento=$request->get('documento');
        $rangoedadId=$request->get('rangoedadId');
        $pais=$request->get('pais');
        $departamentoId=$request->get('departamentoId');
        $ciudadId=$request->get('ciudadId');
        $email=$request->get('email');
        $celular=$request->get('celular');
        $dedicatoriaId=$request->get('dedicatoriaId');
        $userId=$request->get('userId');
        //$envioId=$request->get('envioId');

        $factura = new Factura();
        $factura->setNombre($nombre);
        $factura->setApellidos($apellidos);
        $factura->setDireccion($direccion);
        $tipodocumento=$this->getDoctrine()->getRepository('CarroiridianBundle:TipoDocumento')->find($tipodocumentoId);
        $factura->setTipodocumento($tipodocumento);
        $factura->setDocumento($documento);
        $rangoedad=$this->getDoctrine()->getRepository('AppBundle:RangoEdad')->find($rangoedadId);
        $factura->setRangoedad($rangoedad);
        $factura->setPais($pais);
        $departamento=$this->getDoctrine()->getRepository('CarroiridianBundle:Departamento')->find($departamentoId);
        $factura->setDepartamento($departamento);
        $ciudad=$this->getDoctrine()->getRepository('CarroiridianBundle:Ciudad')->find($ciudadId);
        $factura->setCiudad($ciudad);
        $factura->setEmail($email);
        $factura->setCelular($celular);

        /** @var $user User */
        $user =  $this->getDoctrine()->getRepository('AppBundle:User')->find($userId);
        if($user){
            $factura->setNombre($user->getNombre());
            $factura->setApellidos($user->getApellidos());
            $factura->setEmail($user->getEmail());
            $factura->setComprador($user);
            if($user->getRangoedad())
                $factura->setRangoedad($user->getRangoedad());
        }

        /*$factura_ant = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->findOneBy(array('comprador'=>$user),array('id'=>'desc'));
        if($factura_ant){
            $factura->setDireccion($factura_ant->getDireccion());
            $factura->setTipodocumento($factura_ant->getTipodocumento());
            $factura->setDocumento($factura_ant->getDocumento());
            $factura->setPais($factura_ant->getPais());
            $factura->setDepartamento($factura_ant->getDepartamento());
            $factura->setCiudad($factura_ant->getCiudad());
            $factura->setCelular($factura_ant->getCelular());
        }
        */
        $dedicatoria =  $this->getDoctrine()->getRepository('CarroiridianBundle:Dedicatoria')->find($dedicatoriaId);
        if($dedicatoria)
            $factura->setDedicatoria($dedicatoria);
        //$envio =  $this->getDoctrine()->getRepository('CarroiridianBundle:Envio')->find($envioId);
        /*if($envio)
            $factura->setEnvio($envio);
        */
        $securityContext = $this->container->get('security.authorization_checker');


        $em=$this->getDoctrine()->getManager();
        $em->persist($factura);
        $em->flush();

        $factura->setComprador(null);
        $resultado = array("ok"=>true,"error_msg"=>"","data"=>$factura);
        $json = $serializer->serialize($resultado,'json');
        return new Response($json);
    }

    /**
     * Retorna todos las inspiraciones visibles
     * @Route("/api/inspiraciones")
     * @Method({"GET"})
     */
    public function inspiracionesAction()
    {
        $serializer = $this->get('serializer');
        $inspiraciones = $this->getDoctrine()
            ->getRepository('CarroiridianBundle:Inspiracion')->findBy(array("visible"=>1),array("orden"=>"asc"));
        $json = $serializer->serialize($inspiraciones,'json');
        return new Response($json);
    }

    /**
     * Retorna todos las ciudades p
     * @Route("/api/ciudades")
     * @Method({"GET"})
     */
    public function ciudadesAction()
    {
        $serializer = $this->get('serializer');
        $ciudades = $this->getDoctrine()
            ->getRepository('CarroiridianBundle:Ciudad')->findBy(array("visible"=>1),array("nombre"=>"asc"));
        $json = $serializer->serialize($ciudades,'json');
        return new Response($json);
    }

    /**
     * Retorna todos las ciudades p
     * @Route("/api/ciudades-departamento/{deptoId}")
     * @Method({"GET"})
     */
    public function ciudadesDeptoAction(Request $request,$deptoId)
    {
        $serializer = $this->get('serializer');
        $depto = $this->getDoctrine()->getRepository("CarroiridianBundle:Departamento")->find($deptoId);
        $ciudades = $this->getDoctrine()
            ->getRepository('CarroiridianBundle:Ciudad')->findBy(array("visible"=>1,"departamento"=>$depto),array("nombre"=>"asc"));
        $json = $serializer->serialize($ciudades,'json');
        return new Response($json);
    }

    /**
     * Retorna todos las ciudades para envio
     * @Route("/api/ciudades-envio")
     * @Method({"GET"})
     */
    public function ciudadesEnviosAction()
    {
        $serializer = $this->get('serializer');
        $ciudades = $this->getDoctrine()
            ->getRepository('CarroiridianBundle:Ciudad')->findBy(array("visible"=>1,'envio'=>1),array("nombre"=>"asc"));
        $json = $serializer->serialize($ciudades,'json');
        return new Response($json);
    }


    /**
     * Retorna todos los metodos de envio visibles
     * @Route("/api/envios/{user}")
     * @Method({"GET"})
     */
    public function enviosAction($user)
    {
        $serializer = $this->get('serializer');

        $envios= $this->getDoctrine()
            ->getRepository('CarroiridianBundle:Envio')
            ->createQueryBuilder("e")
            ->select('e.nombre','e.apellidos','e.telefono','e.direccion','e.oficina','e.adicionales','ci.id as ciudad','d.id as departamento')
            ->from('CarroiridianBundle:Factura','f')
            ->leftJoin('f.envio','ef')
            ->leftJoin('e.ciudad','ci')
            ->leftJoin('ci.departamento','d')
            ->leftJoin('f.comprador','u')
            ->where('u.id = '.$user.' and ef.id = e.id ')
            ->andWhere('e.id is not null')
            ->groupBy('e.direccion')
            ->getQuery()
            ->useQueryCache(true)
            ->useResultCache(true)
            ->getArrayResult();

        $json = $serializer->serialize($envios,'json');
        return new Response($json);
    }



    /*
    public function addEnvioAction($nombre,$apellido,$telefono,$fecha,$ciudad,$direccion,$adicionales)
    {
        $serializer = $this->get('serializer');
        $envio=new Envio();
        $envio->setNombre($nombre);
        $envio->setApellidos($apellido);
        $envio->setTelefono($telefono);
        $envio->setFechaDeEnvio($fecha);
        $envio->setCiudad($ciudad);
        $envio->setDireccion($direccion);
        $envio->setAdicionales($adicionales);

        $em=$this->getDoctrine()->getManager();
        $em->persist($envio);
        $em->flush();

        $json = $serializer->serialize($envio,'json');
        return new Response($json);
    }
    */

    /**
     * pagar un envio
     * @Route("/api/secure/agregar-envio")
     * @Method({"POST"})
     */
    public function crearEnvioAction(Request $request)
    {

        $nombre=$request->get('nombre');
        $apellido=$request->get('apellido');
        $telefono=$request->get('telefono');
        $ciudadId=$request->get('ciudad');
        $fecha=$request->get('fecha');
        $direccion=$request->get('direccion');
        $adicionales=$request->get('adicionales');
        $oficina=$request->get('oficina');
        $facturaId=$request->get('facturaId');

        $serializer = $this->get('serializer');
        $envio=new Envio();
        $envio->setNombre($nombre);
        $envio->setApellidos($apellido);
        $envio->setTelefono($telefono);
        $envio->setFechaDeEnvio($fecha);
        $ciudad=$this->getDoctrine()->getRepository('CarroiridianBundle:Ciudad')->find($ciudadId);
        $envio->setCiudad($ciudad);
        $envio->setDireccion($direccion);
        $envio->setAdicionales($adicionales);
        $envio->setOficina($oficina);

        $em=$this->getDoctrine()->getManager();
        $em->persist($envio);
        $em->flush();

        $factura=$this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->find($facturaId);
        $factura->setEnvio($envio);
        $em->merge($factura);
        $em->flush();


        /*sap crear usuario*/

        $cont_admin_info = array(
            "ObjType"   =>  2,
            "IDDB"      =>  10000103,//10000101,
            "Token"     =>  "EB18D5439C45212BEBA999DD150B4744"
        );
        $AdminInfo = array("AdminInfo"=>$cont_admin_info);


        $gen = array("Field" => "U_RDE_Genero","Value" => "E");
        $month = array("Field" => "U_RDE_Mes","Value" => "12");
        $day = array("Field" => "U_RDE_Dia","Value" => "24");
        $edv = array("Field" => "U_RDE_EstiloVida","Value" => "HOG");
        $prc = array("Field" => "U_RDE_PrefCompra","Value" => "CR");
        $tbo = array("Field" => "U_RDE_TipBole","Value" => "M/C");
        $mop = array("Field" => "U_RDE_MotPlanRec","Value" => "TODOS");
        $ran = array("Field" => "U_RDE_Edad","Value" => $factura->getRangoedad()->getId());
        $bp_info = array(
            "CardCode"      =>  "C".$factura->getDocumento(),
            "CardName"      =>  strtoupper($factura->getFullName()),
            "CardType"      =>  "C",
            "GroupCode"     =>  "102",
            "FederalTaxID"  =>  $factura->getDocumento(),
            //"Address"       =>  "102",
            "Cellular"      =>  $factura->getCelular(),
            "Email"         =>  $factura->getEmail()

        ,
            "UserField"     =>  array(
                "RowFieldSN" => array($gen,$month,$day,$edv,$prc,$tbo,$mop,$ran)
            )

        );
        $BusinessPartners = array("BusinessPartners"=>$bp_info);

        $tipo = "Casa";

        if($factura->getEnvio()->getOficina())
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
        $Addresses = array("Addresses"=>array(
            "RowSN" => $ad_info
        ));

        $client = new \nusoap_client('http://200.74.149.243:13027/SIC.asmx?WSDL', true);
        $full_array = array_merge($AdminInfo,$BusinessPartners,$Addresses);
        $response = $client->call('SincroSN', $full_array);
        /*
         dump($response);
        dump($client->request);
        die();
        */


        $resultado = array("ok"=>true,"error_msg"=>"","data"=>$envio,"response"=>$response);
        $json = $serializer->serialize($resultado,'json');
        return new Response($json);
    }

    /**
     * pagar una factura
     * @Route("/api/secure/pagar")
     * @Method({"POST"})
     */
    public function pagarAction(Request $request)
    {

        $facturaId=$request->get('facturaId');
        $carrito=$request->get('carrito');
        $tarjetaId=$request->get('tarjetaId');
        $rosa=$request->get('rosa');
        $installments=$request->get('installments');

        $serializer = $this->get('serializer');
        $em = $this->getDoctrine()->getManager();
        $tarjeta= $this->getDoctrine()->getRepository("AppBundle:Tarjeta")->find($tarjetaId);
        $resultado = array("ok"=>false,"error_msg"=>"");
        if($tarjeta){
            $factura= $this->getDoctrine()->getRepository("CarroiridianBundle:Factura")->find($facturaId);
            if($factura){
                $estado = $this->getDoctrine()->getRepository('CarroiridianBundle:EstadoCarrito')->findOneBy(array('ref'=>'INICIADA_EN_APP'));
                $total = 0;
                $datos_payu = $this->getDoctrine()->getRepository('PagosPayuBundle:DatosPayu')->find(1);
                $ci = $this->get('ci');

                $compra = new Compra();
                $compra->setEstado($estado);
                $compra->setPrueba($datos_payu->getTest());
                $repo_t = $this->getDoctrine()->getRepository('CarroiridianBundle:Talla');
                //$compra->setDireccion($direccion);
                $em->persist($compra);
                $em->flush();






                $factura->setCompra($compra);
                $envio=$factura->getEnvio();
                $fecha_envio = date('Ymd',strtotime($factura->getEnvio()->getFechaDeEnvio()));
                //die(dump($envio));
                $adicionales = 'vacio';
                if($factura->getEnvio()->getAdicionales() != null){
                    $adicionales = $factura->getEnvio()->getAdicionales();
                }


                $cont_admin_info = array(
                    "ObjType"   =>  17,
                    "IDDB"      =>  10000103,//10000101,
                    "Token"     =>  "EB18D5439C45212BEBA999DD150B4744"
                );
                $AdminInfo = array("AdminInfo"=>$cont_admin_info);

                $doc_info = array(
                    "DocType"      =>  "I",
                    "Requester"      =>  "",
                    "Series"      =>  "OV-Inter",
                    "RequriedDate"      =>  date('Ymd'),
                    "ContactPersonCode"      =>  "",
                    "RequesterEmail"      =>  "",
                    "CardCode"     =>  "C".$factura->getDocumento(),
                    "DocDate"  =>  date('Ymd'),
                    "TaxDate"       =>  date('Ymd'),
                    "DocDueDate"        =>  date('Ymd'),
                    "Comments"        =>  "Prueba de pedido",
                    "JournalMemo"        =>  "",
                    "SalesPersonCode"      =>  "59",
                    "UserField"     =>  array(
                        "RowField" => array(
                            0 => array(
                                "Field" => "U_RDE_HoraVenta",
                                "Value" => "1530"
                            ),
                            1 => array(
                                "Field" => "U_RDE_CanVenta",
                                "Value" => "Pag_Web/Mail"
                            ),
                            3 => array(
                                "Field" => "U_RDE_NomDest",
                                "Value" => $factura->getDedicatoria()->getPara()
                            ),
                            4 => array(
                                "Field" => "U_RDE_DirEntrega",
                                "Value" => $factura->getEnvio()->getDireccion()
                            ),
                            5 => array(
                                "Field" => "U_RDE_Ciudad",
                                "Value" => $factura->getEnvio()->getCiudad()->getNombre()
                            ),
                            6 => array(
                                "Field" => "U_RDE_Tel",
                                "Value" => substr($factura->getEnvio()->getTelefono(), 0, 14)
                            ),
                            7 => array(
                                "Field" => "U_RDE_FecEnvio",
                                "Value" => $fecha_envio
                            ),
                            8 => array(
                                "Field" => "U_RDE_Observ",
                                "Value" => substr($adicionales, 0, 253)
                            ),
                            9 => array(
                                "Field" => "U_RDE_TarAdj",
                                "Value" => "ADJ"
                            ),
                            10 => array(
                                "Field" => "U_RDE_Fima",
                                "Value" => "FIRMA"
                            ),
                            11 => array(
                                "Field" => "U_RDE_MenTarj",
                                "Value" => $factura->getDedicatoria()->getMensaje()
                            ),
                            12 => array(
                                "Field" => "U_RDE_MotCompra",
                                "Value" => "Amor_Amistad"
                            )
                        )
                    )
                );
                $Documents = array("Documents"=>$doc_info);

                $doc_line_info = array();
                $qi = $this->get('qi');
                $host = $qi->getSettingDB("host");




                $total = 0;
                $iva = 0;
                $descripcion_text = '';
                $descripcion = '<p style="color: #4A7689;font-family: Helvetica">Tu compra ha sido aprobada</p><br><h2 style="color: #4A7689;font-family: Helvetica">Carrito de compras</h2><table style="width: 100%;max-width: 600px; border: 1px;text-align: center;font-family: Helvetica;border-collapse: collapse;">
                        <tr style="background-color: #eeeef4;color: #4A7689;">
                            <th style="text-transform: uppercase;padding: 5px;">Imagen</th>
                            <th style="text-transform: uppercase;padding: 5px;">Nombre</th>
                            <th style="text-transform: uppercase;padding: 5px;">Subtotal</th>
                            <th style="text-transform: uppercase;padding: 5px;">Cantidad</th>
                            <th style="text-transform: uppercase;padding: 5px;">Total</th>
                        </tr>';

                foreach (json_decode($carrito) as $item){
                    $prod = $item->productoId;
                    $color = $this->getDoctrine()->getRepository("CarroiridianBundle:Color")->find($item->colorId);

                    $tallaid= $item->tallaId;
                    $cantidad = $item->cantidad;
                    $producto = $this->getDoctrine()->getRepository("CarroiridianBundle:Producto")->find($prod);
                    $talla=$this->getDoctrine()->getRepository("CarroiridianBundle:Talla")->find($tallaid);

                    $resp_arr = $this->addProd($producto, $talla, $compra, $em, $total, $descripcion, $descripcion_text,$cantidad,true,$host,$color->getHexa());
                    $descripcion = $resp_arr[0];
                    $descripcion_text = $resp_arr[1];
                    $total = $resp_arr[2];
                    $compra = $resp_arr[3];
                    $iva += $producto->getIva();
                    array_push($doc_line_info,$resp_arr[4]);
                    if($color->getSku()){
                        array_push($doc_line_info, $this->addProdColor($color->getSku(),$talla,$color->getPrecio()));
                    }
                }

                if($rosa){
                    $qi = $this->get('qi');
                    $precio = $qi->getSettingDB('precio_rosa_veloz');
                    $resp_arr = $this->addEnvio('Rosa Veloz', $precio, $compra, $em, $total, $descripcion, $descripcion_text,1,$host);
                    $descripcion = $resp_arr[0];
                    $descripcion_text = $resp_arr[1];
                    $total = $resp_arr[2];
                    $compra = $resp_arr[3];
                    $iva += $precio - ($precio / 1.16) ;
                }
                if($envio){
                    $precio = $envio->getCiudad()->getCosto();
                    $resp_arr = $this->addEnvio($envio->getCiudad()->getNombre(), $precio, $compra, $em, $total, $descripcion, $descripcion_text,1,$host);
                    $descripcion = $resp_arr[0];
                    $descripcion_text = $resp_arr[1];
                    $total = $resp_arr[2];
                    $compra = $resp_arr[3];
                    $iva += $precio - ($precio / 1.16);
                }
                $doc_line_info = array("Row"=>$doc_line_info);
                $Document_Lines = array("Document_Lines"=>$doc_line_info);

                $full_array = array_merge($AdminInfo,$Documents,$Document_Lines);
                $factura->setRequest($full_array);

                $iva = $iva ;

                $siniva = $total - $iva;
                $descripcion .= '<tr style="    border: 1px solid #647687;color: #647687; background-color: #eeeef4;margin: 10px 0;">
                            <td colspan="3"></td>
                            <td>SUB TOTAL</td>
                            <td style="border: 1px solid #647687;padding: 5px 0;">$'.number_format($siniva,2).'</td>
                        </tr>';
                $descripcion .= '<tr style="    border: 1px solid #647687;color: #647687; background-color: #eeeef4;">
                            <td colspan="3"></td>
                            <td>IVA</td>
                            <td style="border: 1px solid #647687;padding: 5px 0;">$'.number_format($iva,2).'</td>
                        </tr>';
                $descripcion .= '<tr style="    border: 1px solid #647687;color: #647687; background-color: #647687;">
                            <td colspan="3"></td>
                            <td style="color: #ffffff;">TOTAL</td>
                            <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;">$'.number_format($total,2).'</td>
                        </tr>';


                $descripcion .= '</table>';

                $descripcion .= $this->tablaEnvio($envio);
                $descripcion .= $this->tablamensaje($factura);



                $compra->setDescripcion($descripcion);
                $costo_envio = $factura->getEnvio()->getCiudad()->getCosto();
                //$total = $total + $factura->getEnvio()->getCiudad()->getCosto();
                $compra->setPrecio($total);
                $em->persist($compra);
                $em->flush();

                $em->persist($factura);
                $em->flush();
                $descripcion_text .= 'Costo envio, $' . number_format($costo_envio) . ' |';
                $descripcion_text .= 'TOTAL: $'.number_format($total);
                $descripcion_text = substr($descripcion_text,0,255);

                //pagar con el api

                $tax = round($total*0.19/1.19,2);
                $taxReturnBase = round($total/1.19,2);
                $referenceCode = 'Test_DE_'.$compra->getId();
                $total = number_format($total,2, '.', '');
                //echo $datos_payu->getApiKey().'~'.$datos_payu->getMerchantId().'~'.$referenceCode.'~'.$total.'~'.$session->get('moneda','COP');

                $payu = $this->getDoctrine()->getRepository('PagosPayuBundle:DatosPayu')->find(1);

                $apiLogin=$payu->getApiLogin();
                $apiKey=$payu->getApiKey();
                $account=$payu->getAccountId();
                $merchant = $payu->getMerchantId();

                //pruebas
                $apiLogin="pRRXKOl8ikMmt9u";
                $apiKey="4Vj8eK4rloUd272L48hsrarnUA";
                $account="512321";
                $merchant = "508029";


                $url = 'https://api.payulatam.com/payments-api/4.0/service.cgi';
                $sign = md5($apiKey . "~" . $merchant . "~" . $referenceCode . "~" . $total . "~" . $payu->getCurrency());
                $url = 'https://api.payulatam.com/payments-api/4.0/service.cgi';
                if($payu->getTest() || true){
                    $url = 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi';
                }
                /* @var $user User */
                $user=$factura->getcomprador();
                $fields = array(
                    'language' => "es",
                    'command' => "SUBMIT_TRANSACTION",
                    'merchant' => [
                        "apiLogin" => $apiLogin,//"tI7P45k3FawXHpG",
                        "apiKey" => $apiKey//"23115978"
                        //"apiLogin" => $payu->getApiLogin(),
                        //"apiKey" => $payu->getApiKey()
                    ],
                    'transaction' => [
                        "order" => [
                            "accountId" => $account,
                            "referenceCode" => $referenceCode,
                            "description" => $descripcion_text,
                            "language" => "es",
                            "signature" => $sign,
                            "notifyUrl" => "http://rosasdoneloy.com//confirmation",
                            "additionalValues" => [
                                "TX_VALUE" => [
                                    "value" => $total,
                                    "currency" => $payu->getCurrency()
                                ]
                            ],
                            "buyer"=> [
                                "merchantBuyerId" => (string)$user->getId(),
                                "fullName" => "APPROVED",// $user->getNombre() . " " . $user->getApellidos(),
                                "emailAddress" => $user->getEmail(),
                                "contactPhone" => $user->getTelefono(),
                                "dniNumber" => $factura->getDocumento(),
                                "shippingAddress" => [
                                    "street1" => ($factura->getDireccion() == null ? "" : $factura->getDireccion()),
                                    "street2" => "",
                                    "city" => "Bogota",
                                    "state" => "Bogota DC",
                                    "country" => "CO",
                                    "postalCode" => "000000",
                                    "phone" => $user->getTelefono()
                                ]
                            ],
                            "shippingAddress" => [
                                "street1" => ($factura->getDireccion() == null ? "" : $factura->getDireccion()),
                                "street2" => "",
                                "city" => "Bogota",
                                "state" => "Bogota DC",
                                "country" => "CO",
                                "postalCode" => "000000",
                                "phone" => $user->getTelefono()
                            ]
                        ],
                        "payer" => [
                            "merchantPayerId" => (string)$tarjeta->getId(),
                            "fullName" => $tarjeta->getTitular(),
                            "emailAddress" => $user->getEmail(),
                            "contactPhone" => $factura->getCelular(),
                            "dniNumber" => $tarjeta->getNumDoc(),
                            "billingAddress" => [
                                "street1" => $factura->getDireccion(),
                                "street2" => $factura->getDireccion(),
                                "city" => $envio->getCiudad()->getNombre(),
                                "state" => $envio->getCiudad()->getDepartamento()->getNombre(),
                                "country" => "CO",
                                "postalCode" => "11001",
                                "phone" => $factura->getCelular()
                            ]
                        ],
                        "creditCardTokenId" => $tarjeta->getCreditCardTokenId(),
                        "extraParameters" => [
                            "INSTALLMENTS_NUMBER" => $installments
                        ],
                        "type" => "AUTHORIZATION_AND_CAPTURE",
                        "paymentMethod" => $tarjeta->getTipoTarjeta(),
                        "paymentCountry" => "CO",
                        "deviceSessionId" => uniqid(),
                        "ipAddress" => "127.0.0.1",
                        "cookie" => uniqid(),
                        "userAgent" => "Mozilla/5.0 (Windows NT 5.1; rv:18.0) Gecko/20100101 Firefox/18.0"
                    ],
                    "test" => $payu->getTest()
                );



                $data_string = json_encode($fields);

                $ch = curl_init($url);
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
                curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                        'Content-Type: application/json',
                        'Content-Length: ' . strlen($data_string))
                );
                curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; MSIE 9.0; WIndows NT 9.0; en-US)');
                //curl_setopt($ch, CURLOPT_SSLVERSION,1);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
                //curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);

                $result = curl_exec($ch);
                //die();
                if (FALSE === $result)
                    throw new \Exception(curl_error($ch), curl_errno($ch));

                curl_close($ch);

                $xml = new \SimpleXMLElement($result);
                if($xml->error){
                    $resultado= array("ok"=>false,"error_msg"=>'1'.$xml->error->__toString());
                    $erechazado= $this->getDoctrine()->getRepository('CarroiridianBundle:EstadoCarrito')->findOneBy(array('ref'=>'RECHZADA'));
                    $compra->setEstado($erechazado);
                    $em->persist($compra);
                    $em->flush();
                }else {
                    $eaceptado= $this->getDoctrine()->getRepository('CarroiridianBundle:EstadoCarrito')->findOneBy(array('ref'=>'APROBADA'));
                    $compra->setEstado($eaceptado);
                    $em->persist($compra);
                    $em->flush();
                    $resultado= array("ok"=>true,"error_msg"=>"","compra"=>$compra);
                }


            }else{
                $resultado = array("ok"=>false,"error_msg"=>"No existe la factura");
            }


        }else{
            $resultado = array("ok"=>false,"error_msg"=>"No existe la tarjeta");

        }



        $json = $serializer->serialize($resultado,'json');
        return new Response($json);
    }

    /**
     * @Route("/api/historial/{usuario}", name="historiala")
     */
    public function historialAction($usuario)
    {
        $user=$this->getDoctrine()->getRepository('AppBundle:User')->find($usuario);

        $historial = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')
            ->createQueryBuilder('f')
            ->select('f.id as factura','c.id','c.createdAt as fecha','c.descripcion','c.precio')
            ->leftJoin('f.compra','c')
            ->leftJoin('c.estado','e')
            ->leftJoin('f.envio','en')
            ->leftJoin('f.dedicatoria','d')
            ->leftJoin('f.comprador','co')
            ->where('c.id is not null')
            ->andWhere('e.id is not null')
            ->andWhere('en.id is not null')
            ->andWhere('d.id is not null')
            ->andWhere('co.id = '.$user->getId())
            ->orderBy('f.id','desc')
            ->getQuery()
            ->getResult();

        $serializer = $this->get('serializer');
        $resultado = array("ok"=>true,"error_msg"=>"","data"=>$historial);
        $json = $serializer->serialize($resultado,'json');
        return new Response($json);
    }


    private function tablaMensaje(Factura $factura){
        $dedicatoria = $factura->getDedicatoria();
        $descripcion = '';
        $descripcion .= '</br><h2 style="color: #4A7689;font-family: Helvetica">Dedicatoria</h2>';
        $descripcion .= '<table style="width: 100%;max-width: 600px; border: 1px;text-align: center;font-family: Helvetica;border-collapse: collapse;">
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td>De:</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.$dedicatoria->getDe().'</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Para:</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.$dedicatoria->getPara().'</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Mensaje:</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.nl2br($dedicatoria->getMensaje()).'</td>
                            </tr>
                        </table>';
        return $descripcion;

    }


    private function tablaEnvio(Envio $envio){
        $descripcion = '';
        $descripcion .= '</br><h2 style="color: #4A7689;font-family: Helvetica">Datos de envio</h2>';
        $descripcion .= '<table style="width: 100%;max-width: 600px; border: 1px;text-align: center;font-family: Helvetica;border-collapse: collapse;">
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td>Nombre:</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.$envio->getNombre().'</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Apellido:</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.$envio->getApellidos().'</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Ciudad:</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.$envio->getCiudad()->getNombre().'</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Dirección:</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.$envio->getDireccion().'</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">¿Es oficina?</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.$envio->getOficina().'</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Teléfono:</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.$envio->getTelefono().'</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Fecha de entrega:</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.$envio->getFechaDeEnvio().'</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Datos adicionales:</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.nl2br($envio->getAdicionales()).'</td>
                            </tr>
                        </table>';
        return $descripcion;

    }


    private function addProdColor($sku,Talla $talla,$color_precio){
        //$session = new Session();
        $escala_moneda = 1;
        $fila =
            array(
                "ItemCode"   =>  $sku,
                "Quantity"        =>  $talla->getCantidad(),
                "Dimension"          =>  "",
                "LineVendor"          =>  "",
                "WhsCode"       =>  "Sb-PRI",
                "Price"         =>  $color_precio / $escala_moneda
            )
        ;
        return $fila;
    }

    private function addProd(Producto $producto, Talla $talla, Compra $compra, ObjectManager $em, $total, $descripcion, $descripcion_text,$cantidad,$borde, $host, $color)
    {

        $qi = $this->get('qi');
        //$session = new Session();
        //$escala_moneda = $session->get('escala_moneda',1);
        $escala_moneda=1;
        $producto_db = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto')->find($producto->getId());
        $inventario = $this->getDoctrine()->getRepository('CarroiridianBundle:Inventario')->findOneBy(array('producto'=>$producto->getId(),'talla'=>$talla->getId()));
        if(!$inventario)
            $precio_base = $producto_db->getPrecioiva();

        else{
            $precio_base = $inventario->getPreciobase();
        }
        $compraitem = new Compraitem();
        $compraitem->setCantidad($cantidad);
        $compraitem->setProducto($producto_db);
        $compraitem->setTalla($talla);
        $compraitem->setCompra($compra);
        $em->persist($compraitem);
        $em->flush();
        $precio_uso = $producto->getPrecio();
        /*
        if($producto->getPreciobase())
            $precio_uso = $producto->getPreciobase();
        */
        $subtotal = $cantidad * $producto->getPrecio() / $escala_moneda;
        $total += $subtotal;
        $cad_color = ' ';
        if($color != '')
            $cad_color = '<br><p style="margin: 0 0 10px;">'.$qi->getTextoDB('rosas').' '.$color.'</p>';
        $bt = '';
        if($borde)
            $bt = 'border-top: 10px solid white;';
        $descripcion .= '<tr style="background-color: #eeeef4;margin: 10px 0;'.$bt.'">';
        $descripcion .= '<td style="border:0;padding: 5px;"><img src="'.$host.'/media/cache/producto_carrito/uploads/productos/'.$producto->getImagen().'" style="vertical-align: middle;"display: inline-block; width="104" height="104" /></td>';
        $descripcion .= '<td style="border:0;padding: 5px;"><h3 style="font-size: 16px;color: #4A7689;">'.$producto.' '.$producto->getId().'</h3><p style="margin: 0 0 10px;">'.$talla.'</p>'.$cad_color.'</td>';
        $descripcion .= '<td style="border:0;padding: 5px;"><h4 style="font-size: 17px;color: #592836;">$'.number_format($producto->getPrecio() / $escala_moneda,2).'</h4></td>';
        $descripcion .= '<td style="border:0;padding: 5px;"><h3 style="font-size: 16px;color: #4A7689;">'.$cantidad.'</h3></td>';
        $descripcion .= '<td style="border:0;padding: 5px;"><h4 style="font-size: 17px;color: #592836;">$'.number_format($subtotal,2).'</h4></td>';
        $descripcion .= '</tr>';

        $descripcion_text .= '|'.$producto.' - ';
        $descripcion_text .= $talla.' - ';
        $descripcion_text .= '$'.number_format($precio_uso / $escala_moneda,2).' - ';
        $descripcion_text .= 'X'.$cantidad.' - ';
        $descripcion_text .= '$'.number_format($subtotal,2).' | ';

        $fila =
            array(
                "ItemCode"   =>  $producto->getSku(),
                "Quantity"        =>  $cantidad,
                "Dimension"          =>  "",
                "LineVendor"          =>  "",
                "WhsCode"       =>  "Sb-PRI",
                "Price"         =>  $precio_base / $escala_moneda * $cantidad
            )

        ;

        return array($descripcion,$descripcion_text,$total,$compra,$fila);
    }

    private function addEnvio($nombre, $precio, Compra $compra,ObjectManager $em, $total, $descripcion, $descripcion_text,$cantidad, $host)
    {

        $qi = $this->get('qi');
        $escala_moneda = 1;
        $subtotal = $precio / $escala_moneda;
        $total += $subtotal;
        $descripcion .= '<tr style="background-color: #eeeef4;margin: 10px 0;border-top: 10px solid white;">';
        $descripcion .= '<td style="border:0;padding: 5px;"><img src="'.$host.$qi->getImagen('ico_moto_veloz').'" style="vertical-align: middle;"display: inline-block; width="104"  /></td>';
        $descripcion .= '<td style="border:0;padding: 5px;"><h3 style="font-size: 16px;color: #4A7689;">'.$nombre.'</p></td>';
        $descripcion .= '<td style="border:0;padding: 5px;"><h4 style="font-size: 17px;color: #592836;">$'.number_format($precio / $escala_moneda,2).'</h4></td>';
        $descripcion .= '<td style="border:0;padding: 5px;"><h3 style="font-size: 16px;color: #4A7689;">'.$cantidad.'</h3></td>';
        $descripcion .= '<td style="border:0;padding: 5px;"><h4 style="font-size: 17px;color: #592836;">$'.number_format($subtotal,2).'</h4></td>';
        $descripcion .= '</tr>';

        $descripcion_text .= '| Envio - ';
        $descripcion_text .= $nombre.' - ';
        $descripcion_text .= '$'.number_format($precio,2).' - ';
        $descripcion_text .= 'X'.$cantidad.' - ';
        $descripcion_text .= '$'.number_format($subtotal,2).' | ';
        return array($descripcion,$descripcion_text,$total,$compra);
    }

    /**
     * adiciona un mensaje
     * @Route("/api/secure/agregar-dedicatoria")
     * @Method({"POST"})
     */
    public function addComentarioAction(Request $request)
    {

        $de=$request->get('de');
        $para=$request->get('para');
        $mensaje=$request->get('mensaje');

        $serializer = $this->get('serializer');
        $dedicatoria=new Dedicatoria();
        $dedicatoria->setDe($de);
        $dedicatoria->setMensaje($mensaje);
        $dedicatoria->setPara($para);
        $em=$this->getDoctrine()->getManager();
        $em->persist($dedicatoria);
        $em->flush();

        $resultado = array("ok"=>true,"error_msg"=>"","data"=>$dedicatoria);
        $json = $serializer->serialize($resultado,'json');
        return new Response($json);
    }

    /**
     * Retorna todos los productos de tipo complemento
     * @Route("/api/complementos")
     * @Method({"GET"})
     */
    public function complementosAction()
    {

        return $this->productoCategoriaAction(5);
    }

    /**
     * Retorna todos los colores relacionados visibles
     * @Route("/api/colores-relacionados/{productoId}")
     * @Method({"GET"})
     */
    public function coloresRelacionadosAction($productoId)
    {
        $serializer = $this->get('serializer');



        $producto= $this->getDoctrine()->getRepository("CarroiridianBundle:Producto")->find($id);
        //die(dump($producto->getColoresRelacionados()));
        $productos= $producto->getColores();


        $json = $serializer->serialize($productos,'json');
        return new Response($json);
    }

    /**
     * retorna todos los productos visibles de una categoria
     * @Route("/api/producto-categoria/{catId}")
     * @Method({"GET"})
     */
    public function productoCategoriaAction($catId)
    {
        $serializer = $this->get('serializer');


        $productos = $this->getDoctrine()
            ->getRepository('CarroiridianBundle:Producto')
            ->createQueryBuilder('p')
            ->select('p.id','p.sap','p.sku','p.nombreEs','p.nombreEn','p.precio','p.codigoIva','p.porcentajeIva','c.id as categoria_id','p.imagen')
            ->leftJoin('p.categoria','c')
            ->where('c.id = :categoria and p.visible = 1')
            ->setParameter('categoria', $catId)
            ->getQuery()
            ->useQueryCache(true)
            ->useResultCache(true)
            ->getArrayResult();

        $json = $serializer->serialize($productos,'json');
        return new Response($json);
    }

    /**
     * retorna todas las categorias visibles
     * @Route("/api/categorias")
     * @Method({"GET"})
     */
    public function categoriasAction()
    {
        $serializer = $this->get('serializer');
        $categorias = $this->getDoctrine()
            ->getRepository('CarroiridianBundle:Categoria')
            ->createQueryBuilder('c')
            ->select('c.id,c.nombreEs')
            ->where('c.visible = 1 ')
            ->andWhere('c.app = 1')
            ->getQuery()
            ->useQueryCache(true)
            ->useResultCache(true)
            ->getArrayResult();

        $json = $serializer->serialize($categorias,'json');
        return new Response($json);
    }

    /**
     * retorna todas los tipos de documento visibles
     * @Route("/api/tiposdocumento")
     * @Method({"GET"})
     */
    public function tiposdocumentoAction()
    {
        $serializer = $this->get('serializer');
        $tipos = $this->getDoctrine()
            ->getRepository('CarroiridianBundle:TipoDocumento')->findAll();

        $json = $serializer->serialize($tipos,'json');
        return new Response($json);
    }

    /**
     * retorna todas los departamentos visibles
     * @Route("/api/departamentos")
     * @Method({"GET"})
     */
    public function departamentosAction()
    {
        $serializer = $this->get('serializer');
        $departamentos = $this->getDoctrine()
            ->getRepository('CarroiridianBundle:Departamento')
            ->createQueryBuilder('c')
            ->select('c.id,c.nombre')
            ->getQuery()
            ->useQueryCache(true)
            ->useResultCache(true)
            ->getArrayResult();

        $json = $serializer->serialize($departamentos,'json');
        return new Response($json);
    }

    /**
     * @Route("/api/presentaciones")
     * @Method({"GET"})
     */
    public function presentacionesAction()
    {
        $serializer = $this->get('serializer');
        $presentaciones = $this->getDoctrine()
            ->getRepository('CarroiridianBundle:Talla')
            ->createQueryBuilder('c')
            ->select('c.id,c.nombreEs')
            ->getQuery()
            ->useQueryCache(true)
            ->useResultCache(true)
            ->getArrayResult();

        $json = $serializer->serialize($presentaciones,'json');
        return new Response($json);
    }

    /**
     * @Route("/api/prohibidos")
     * @Method({"GET"})
     */
    public function prohibidosAction()
    {
        $serializer = $this->get('serializer');
        $prohibidos = $this->getDoctrine()
            ->getRepository('AppBundle:Nohabil')->findAll();

        $json = $serializer->serialize($prohibidos,'json');
        return new Response($json);
    }

    /**
     * @Route("/api/precio/{sku}/{presentacion_id}/{precio}/{preciobase}")
     * @Method({"POST"})
     */
    public function precioAction($sku,$presentacion_id,$precio,$preciobase)
    {
        $defTimeZone = date_default_timezone_get();
        date_default_timezone_set('America/Bogota');
        $dateLog = date('Y-m-d H:i:s');
        date_default_timezone_set($defTimeZone);

        $vars = implode(',', func_get_args());
        error_log("[$dateLog] - Update price vars: $vars\n",3,'price-update.log');

        $talla_id = $presentacion_id;
        $producto = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto')->findOneBy(array('sku'=>$sku));
        $talla = $this->getDoctrine()->getRepository('CarroiridianBundle:Talla')->find($talla_id);
        if(!$producto){
            return new JsonResponse(array('status'=>2,'mensaje'=>'Producto inexistente'));
        }
        if(!$talla){
            return new JsonResponse(array('status'=>3,'mensaje'=>'Talla inexistente'));
        }
        $inventario = $this->getDoctrine()->getRepository('CarroiridianBundle:Inventario')
            ->findOneBy(array('producto'=>$producto,"talla"=>$talla));
        if($inventario == null){
            $inventario = new Inventario();
        }
        $inventario->setCantidad(10);
        $inventario->setPrecio($precio);
        $inventario->setPreciobase($preciobase);
        $inventario->setTalla($talla);
        $inventario->setProducto($producto);

        //price-update.log

        $em = $this->getDoctrine()->getManager();
        try {
            $em->persist($inventario);
            $em->flush();
            error_log("[$dateLog] - Success update\n",3,'price-update.log');
        } catch(\Doctrine\ORM\ORMException $e){
            error_log("[$dateLog] - Update error: {$e->getMessage()}\n",3,'price-update.log');
            return new JsonResponse(array('status'=>0,'mensaje'=>$e->getMessage()));
        }catch(\Exception $e){
            error_log("[$dateLog] - Update error: {$e->getMessage()}\n",3,'price-update.log');
            return new JsonResponse(array('status'=>0,'mensaje'=>$e->getMessage()));
        }
        return new JsonResponse(array('status'=>1,'mensaje'=>'Guardado exitosamente'));
    }


    /**
     * @Route("/api/almacenes")
     * @Method({"GET"})
     */
    public function almacenesAction()
    {
        $serializer = $this->get('serializer');
        $presentaciones = $this->getDoctrine()
            ->getRepository('CarroiridianBundle:Almacen')
            ->createQueryBuilder('c')
            ->select('c.id,c.nombre')
            ->getQuery()
            ->useQueryCache(true)
            ->useResultCache(true)
            ->getArrayResult();

        $json = $serializer->serialize($presentaciones,'json');
        return new Response($json);
    }




    /**
     * @Route("/api/inventario/{sku}/{presentacion_id}/{almacen_id}/{color_id}/{cantidad}")
     * @Method({"POST"})
     */
    public function inventarioAction($sku,$presentacion_id,$almacen_id,$color_id,$cantidad)
    {
        $talla_id = $presentacion_id;
        $producto = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto')->findOneBy(array('sku'=>$sku));
        $talla = $this->getDoctrine()->getRepository('CarroiridianBundle:Talla')->find($talla_id);
        $almacen = $this->getDoctrine()->getRepository('CarroiridianBundle:Almacen')->find($almacen_id);
        $color = $this->getDoctrine()->getRepository('CarroiridianBundle:Color')->find($color_id);
        if(!$producto){
            return new JsonResponse(array('status'=>2,'mensaje'=>'Producto inexistente'));
        }
        if(!$talla){
            return new JsonResponse(array('status'=>3,'mensaje'=>'Talla inexistente'));
        }
        if(!$almacen){
            return new JsonResponse(array('status'=>4,'mensaje'=>'Almacen inexistente'));
        }
        if(!is_numeric($cantidad)){
            return new JsonResponse(array('status'=>6,'mensaje'=>'Cantidad inválida'));
        }
        $inventario = $this->getDoctrine()->getRepository('CarroiridianBundle:InventarioAlmacen')
            ->findOneBy(array('producto'=>$producto->getId(),"talla"=>$talla,"almacen"=>$almacen,"color"=>$color));
        if($inventario == null){
            $inventario = new InventarioAlmacen();
        }
        $inventario->setCantidad($cantidad);
        $inventario->setTalla($talla);
        $inventario->setProducto($producto);
        $inventario->setAlmacen($almacen);
        $inventario->setColor($color);
        $em = $this->getDoctrine()->getManager();
        try {
            $em->persist($inventario);
            $em->flush();
        } catch(\Doctrine\ORM\ORMException $e){
            return new JsonResponse(array('status'=>0,'mensaje'=>$e->getMessage()));
        }catch(\Exception $e){
            return new JsonResponse(array('status'=>0,'mensaje'=>$e->getMessage()));
        }
        return new JsonResponse(array('status'=>1,'mensaje'=>'Guardado exitosamente'));
    }

    /**
     * @Route("/api/trm/{valor}")
     * @Method({"POST"})
     */
    public function trmAction($valor)
    {
        if(is_float(floatval($valor))){
            /** @var $trm Settings */
            $trm = $this->getDoctrine()->getRepository('AppBundle:Settings')->findOneBy(array('llave'=>'trm'));
            $trm->setValor($valor);
            $em = $this->getDoctrine()->getManager();
            $em->persist($trm);
            $em->flush();
            return new JsonResponse(array('status'=>1,'mensaje'=>'Trm guardada exitosamente'));
        }else{
            return new JsonResponse(array('status'=>0,'mensaje'=>'Trm no guardada'));
        }
    }

    /**
     * @Route("/api/estado/{id}/{estado}")
     * @Method({"POST"})
     */
    public function estadoAction($id,$estado)
    {
        $estado = intval($estado);
        if($estado == 1 ||  $estado == 2 && $estado == 3){
            /** @var $trm Settings */
            $factura = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->findOneBy(array('idsap'=>$id));
            if($factura){
                if($estado == 1)
                    $factura->setRecibido(new \DateTime());
                elseif($estado == 2)
                    $factura->setCamino(new \DateTime());
                else
                    $factura->setEntrgado(new \DateTime());
                $em = $this->getDoctrine()->getManager();
                $em->persist($factura);
                $em->flush();
                return new JsonResponse(array('status'=>1,'mensaje'=>'Estado guardado exitosamente'));
            }else{
                return new JsonResponse(array('status'=>0,'mensaje'=>'Id de factura SAP inválido'));
            }
        }else{
            return new JsonResponse(array('status'=>0,'mensaje'=>'Estado invalido. Valorres válidos: 1,2 o 3'));
        }
    }

}

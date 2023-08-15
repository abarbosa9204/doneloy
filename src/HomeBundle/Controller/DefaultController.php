<?php

namespace HomeBundle\Controller;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Query\ResultSetMapping;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use HomeBundle\Form\Type\EncuestaType;
use HomeBundle\Form\Type\AdicionalType;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     * @Cache(maxage="20", public=true)
     */
    public function indexAction()
    {
        // $baseUrl = $request->getSchemeAndHttpHost();
        // echo $baseUrl;die;
        $ciudades = $this->getDoctrine()->getRepository('GeoBundle:CiudadSede')->findBy(array('visible'=>true),array('orden'=>'asc'));
        $response =  $this->render('HomeBundle:Default:index.html.twig',array('ciudades'=>$ciudades));
        ///$response->headers->addCacheControlDirective('X-Cache', 'HIT');
        return $response;
    }

    /**
     * @Route("/modulos", name="modulos")
     */
    public function modulosAction()
    {
        return $this->render('HomeBundle:Default:modulos.html.twig');
    }

    /**
     * @Route("/terminos", name="terminos")
     */
    public function terminosAction()
    {
        return $this->render('HomeBundle:Default:terminos.html.twig');
    }


    /**
     * @Route("/soap", name="soap")
     */
    public function soapTestAction()
    {
        $client = new \nusoap_client('http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL', true);
        $response = $client->call('CapitalCity', array('sCountryISOCode'=>'COL'));
        return $this->render('HomeBundle:Default:soap.html.twig',array('response'=>$response));
    }


    /**
     * @Route("/soap-sic", name="soapsic")
     */
    public function soapSicTestAction()
    {

        $cont_admin_info = array(
            "ObjType"   =>  2,
            "IDDB"      =>  10000101,
            "Token"     =>  "EB18D5439C45212BEBA999DD150B4744"
        );
        $AdminInfo = array("AdminInfo"=>$cont_admin_info);

        $bp_info = array(
            "CardCode"      =>  "CT200",
            "CardName"      =>  "PRUEBAS 1",
            "CardType"      =>  "C",
            "GroupCode"     =>  "102",
            "FederalTaxID"  =>  "200",
            "Address"       =>  "Calle 57 N 23-33",
            "Phone1"        =>  "1234567",
            "Cellular"      =>  "1234567",
            "Email"         =>  "Prueba@gmail.com",
            "UserField"     =>  array(
                "RowFieldSN" => array(
                    "Field" => "U_RDE_Genero",
                    "Value" => "E"
                )
            )
        );
        $BusinessPartners = array("BusinessPartners"=>$bp_info);

        $ad_info = array(
            "AddressName"   =>  "Casa",
            "Street"        =>  "Calle 33 N 24 - 35",
            "City"          =>  "Bogota",
            "Country"       =>  "CO",
            "State"         =>  "Colombia",
            "AddressType"   =>  "S",
            "Block"         =>  "1234567"
        );
        $Addresses = array("Addresses"=>$ad_info);

        $client = new \nusoap_client('http://200.74.149.243:13027/SIC.asmx?WSDL', true);
        $full_array = array_merge($AdminInfo,$BusinessPartners,$Addresses);
        $client->setDebugLevel(9);
        $response = $client->call('SincroSN', $full_array);
        //$body = $client->getHTTPBody();
        $body = $client->request;
        return $this->render('HomeBundle:Default:soap.html.twig',array('response'=>$response,'body'=>$body,'full_array'=>$full_array));
    }

    /**
     * @Route("/soap-ov", name="soapsic")
     */
    public function soapOVTestAction()
    {

        $cont_admin_info = array(
            "ObjType"   =>  17,
            "IDDB"      =>  10000101,
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
            "CardCode"     =>  "C100",
            "DocDate"  =>  date('Ymd'),
            "TaxDate"       =>  date('Ymd'),
            "DocDueDate"        =>  date('Ymd'),
            "Comments"        =>  "Prueba de pedido",
            "JournalMemo"        =>  "",
            "SalesPersonCode"      =>  "-1",
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
                        "Value" => "Para"
                    ),
                    4 => array(
                        "Field" => "U_RDE_DirEntrega",
                        "Value" => "Dirección"
                    ),
                    5 => array(
                        "Field" => "U_RDE_Ciudad",
                        "Value" => "Bogotá"
                    ),
                    6 => array(
                        "Field" => "U_RDE_Tel",
                        "Value" => "0"
                    ),
                    7 => array(
                        "Field" => "U_RDE_FecEnvio",
                        "Value" => date('Ymd')
                    ),
                    8 => array(
                        "Field" => "U_RDE_Observ",
                        "Value" => "Observación"
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
                        "Value" => "Mensaje de Tarjeta"
                    )
                )
            )
        );
        $Documents = array("Documents"=>$doc_info);

        $fila =
            array(
                "ItemCode"   =>  "KFLVJAAP",
                "Quantity"        =>  "1",
                "Dimension"          =>  "",
                "LineVendor"          =>  "",
                "WhsCode"       =>  "Sd-PRI",
                "Price"         =>  "400000",
            )
        ;

        $doc_line_info = array("Row"=>array($fila));
        $Document_Lines = array("Document_Lines"=>$doc_line_info);

        $client = new \nusoap_client('http://200.74.149.243:13027/SIC.asmx?WSDL', true);
        $full_array = array_merge($AdminInfo,$Documents,$Document_Lines);
        $client->setDebugLevel(9);
        $response = $client->call('Document_marketing', $full_array);
        if (strpos($response['Document_marketingResult'], 'success') !== false) {
            $temp = explode(explode(" ",$response['Document_marketingResult'])[1]);
            $idsap = $temp[0];
            $docsap = $temp[1];
        }

        $error = $client->getError();
        $body = $client->request;
        return $this->render('HomeBundle:Default:soap.html.twig',array('response'=>$response,'body'=>$body,'full_array'=>$full_array,'error'=>$error));
    }

    /**
     * @Route("/no_enviados", name="no_enviados")
     */
    public function noEnviadosAction()
    {

        /** @var $em EntityManager */
        $em = $this->getDoctrine()->getManager();
        $qb = $em->createQueryBuilder()->from('CarroiridianBundle:Factura','f')
            ->select('f.id as id','f.nombre as nombre', 'f.documento as documento', 'c.id as compra_id')
            ->leftJoin('f.compra','c')
            ->leftJoin('c.estado','e')
            ->where('e.id = 2')
            ->andWhere('f.reportada = 0')
            ->andWhere('c.prueba = 0');
        $facturas = $qb->getQuery()->getResult();

        return $this->render('HomeBundle:Default:facturas.html.twig',array('facturas'=>$facturas));
    }

    /**
     * @Route("/inventarios", name="inventarios")
     */
    public function inventariosAction()
    {
        $productos = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto')->findBy(array('visible'=>true));

        return $this->render('HomeBundle:Default:productos.html.twig',array('productos'=>$productos));
    }

    /**
     * @Route("/inventario_detalle/{sku}", name="inventario_detalle")
     */
    public function inventarioDetalleAction(Request $request,$sku)
    {
        $producto = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto')->findOneBy(array('sku'=>$sku));
        $inventarios = $this->getDoctrine()->getRepository('CarroiridianBundle:InventarioAlmacen')->findBy(array('producto'=>$producto));

        return $this->render('HomeBundle:Default:inventario.html.twig',array('producto'=>$producto,'inventarios'=>$inventarios));
    }

    public function reporteNativoGen($cols,$cadena){
        $rsm = new ResultSetMapping();
        foreach ($cols as $col){
            $rsm->addScalarResult($col, $col, 'string');
        }
        $reporte = $this->getDoctrine()->getManager()->createNativeQuery($cadena, $rsm)->getArrayResult();
        return $reporte;
    }




}

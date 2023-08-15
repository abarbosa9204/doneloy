<?php

namespace PagosPayuBundle\Controller;

use CarroiridianBundle\Entity\Color;
use CarroiridianBundle\Entity\Compra;
use CarroiridianBundle\Entity\Compraitem;
use CarroiridianBundle\Entity\Entrada;
use CarroiridianBundle\Entity\Envio;
use CarroiridianBundle\Entity\Factura;
use CarroiridianBundle\Entity\PagoLogger;
use CarroiridianBundle\Entity\Producto;
use CarroiridianBundle\Entity\Talla;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Query\ResultSetMapping;
use Ivory\CKEditorBundle\Exception\Exception;
use Metadata\Tests\Driver\Fixture\C\SubDir\C;
use PagosPayuBundle\Entity\RepuestaPago;
use PhpParser\Node\Scalar\MagicConst\Method;
use Proxies\__CG__\CarroiridianBundle\Entity\Inventario;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Debug\Exception\ContextErrorException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Hip\MandrillBundle\Message;
use Hip\MandrillBundle\Dispatcher;
use Symfony\Component\Validator\Constraints\DateTime;

class DefaultController extends Controller
{
    /**
     * @Route("/pagar-payu",name="pagar_payu")
     */
    public function indexAction(Request $request)
    {        
        date_default_timezone_set('America/Bogota');
        $session = $request->getSession();
        $factura = $session->get('factura');
        if($factura == null)
            return $this->redirect($this->generateUrl('carrito'));
        $factura = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->find($factura->getId());
        $carrito = $session->get('carrito', array());
        $envio = $session->get('envio', null);
        $rosa = $session->get('rosa', null);

        $estado = $this->getDoctrine()->getRepository('CarroiridianBundle:EstadoCarrito')->findOneBy(array('ref'=>'INICIADA_EN_WEB'));
        $datos_payu = $this->getDoctrine()->getRepository('PagosPayuBundle:DatosPayu')->find(1);
        $ci = $this->get('ci');

        $compra = new Compra();
        $compra->setEstado($estado);
        $compra->setPrueba($datos_payu->getTest());
        $em = $this->getDoctrine()->getManager();
        $repo_p = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto');
        $repo_t = $this->getDoctrine()->getRepository('CarroiridianBundle:Talla');
        $repo_b = $this->getDoctrine()->getRepository('CarroiridianBundle:Bono');
        $em->persist($compra);
        $em->flush();
        $factura->setCompra($compra);
        $fecha_envio = '';
        $adicionales = 'vacio';
        $telefono = '';
        $direccion = '';
        $ciudadN = '';
        if($envio){
            $fecha_envio = date('Ymd',strtotime($factura->getEnvio()->getFechaDeEnvio()));
            if($factura->getEnvio()->getAdicionales() != null){
                $adicionales = $factura->getEnvio()->getAdicionales();
            }
            $telefono = $factura->getEnvio()->getTelefono();
            $telefono = preg_replace("/[^0-9,.]/", "", $telefono );
            $factura->getEnvio()->getDireccion();
            $ciudadN = $factura->getEnvio()->getCiudad()->getNombre();
        }
        //die(dump($envio));

        $para = '';
        $msg = '';
        if($factura->getDedicatoria()){
            $para = $factura->getDedicatoria()->getPara();
            $msg = $factura->getDedicatoria()->getMensaje();
        }


        $cont_admin_info = array(
            "ObjType"   =>  17,
            "IDDB"      =>  10000101,
            "Token"     =>  "EB18D5439C45212BEBA999DD150B4744"
        );
        $AdminInfo = array("AdminInfo"=>$cont_admin_info);

        $doc_info = array(
            "DocType"      =>  "I",
            "Requester"      =>  "",
            "Series"      =>  "OV-Inte",
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
                        "Value" => date('Hi')
                    ),
                    1 => array(
                        "Field" => "U_RDE_CanVenta",
                        "Value" => "Pag_Web/Mail"
                    ),
                    3 => array(
                        "Field" => "U_RDE_NomDest",
                        "Value" => $para
                    ),
                    4 => array(
                        "Field" => "U_RDE_DirEntrega",
                        "Value" => $direccion
                    ),
                    5 => array(
                        "Field" => "U_RDE_Ciudad",
                        "Value" => $ciudadN
                    ),
                    6 => array(
                        "Field" => "U_RDE_Tel",
                        "Value" => substr($telefono, 0, 14)
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
                        "Value" => $msg
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

        $host = $request->getHost();



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

        foreach ($carrito as $id=>$tallas){
            foreach ($tallas as $id_talla=>$item){
                if($item['cantidad'] > 0){
                    $color = $item['color'];
                    $color_sku = $item['color_sku'];
                    $tallerPlan = in_array($color_sku, ['es_taller','es_plan']);
                    $color_precio = $item['color_precio'];
                    $precioPlan = $color_sku == 'es_plan'?$color_precio:0;
                    $producto = $item['productos'][0];
                    //$producto = $repo_p->find($id);
                    $talla = $repo_t->find($id_talla);
                    $talla_unica = $repo_t->find(1);
                    $solos = 0;
                    foreach ($item['productos'] as $key=>$grupo_prod){
                        $grupo_compplementos = $grupo_prod['complementos'];
                        if(count($grupo_compplementos) == 0){
                            $solos++;
                        }else{
                            $cantidad = 1;
                            $prod = $grupo_prod['producto'];
                            //$prod = $repo_p->find($prod->getId());

                            $resp_arr = $this->addProd($prod, $talla, $compra, $em, $total, $descripcion, $descripcion_text,$cantidad,true,$request,$color,$tallerPlan,$precioPlan);
                            $descripcion = $resp_arr[0];
                            $descripcion_text = $resp_arr[1];
                            $total = $resp_arr[2];
                            $compra = $resp_arr[3];
                            $iva += $prod->getIva();
                            array_push($doc_line_info,$resp_arr[4]);
                            if($color_sku && !$tallerPlan){
                                array_push($doc_line_info, $this->addProdColor($color_sku,$talla,$color_precio));
                            }
                            foreach ($grupo_compplementos as $complemento){
                                $cantidad = $complemento['cantidad'];
                                $prod = $complemento['producto'];
                                //$prod = $repo_p->find($prod->getId());

                                $resp_arr = $this->addProd($prod, $talla_unica, $compra, $em, $total, $descripcion, $descripcion_text,$cantidad,false,$request,null);
                                $descripcion = $resp_arr[0];
                                $descripcion_text = $resp_arr[1];
                                $total = $resp_arr[2];
                                $compra = $resp_arr[3];
                                $iva += $prod->getIva();
                                array_push($doc_line_info,$resp_arr[4]);
                            }
                        }
                    }
                    /////////TODO
                    if($solos > 0){
                        $prod = $grupo_prod['producto'];
                        //$prod = $repo_p->find($prod->getId());
                        $cant = $solos;
                        $resp_arr = $this->addProd($prod, $talla, $compra, $em, $total, $descripcion, $descripcion_text,$solos,true,$request,$color,$tallerPlan,$precioPlan);
                        $descripcion = $resp_arr[0];
                        $descripcion_text = $resp_arr[1];
                        $total = $resp_arr[2];
                        $compra = $resp_arr[3];
                        $iva += $prod->getIva() * $solos;
                        array_push($doc_line_info,$resp_arr[4]);
                        if($color_sku && $color_sku != 'f_plan' && !$tallerPlan){
                            array_push($doc_line_info, $this->addProdColor($color_sku,$talla,$color_precio));
                        }
                    }
                }
            }
        }
        if($rosa){
            $qi = $this->get('qi');
            $precio = $qi->getSettingDB('precio_rosa_veloz');
            $resp_arr = $this->addEnvio('Rosa Veloz', $precio, $compra, $em, $total, $descripcion, $descripcion_text,1,$request);
            $descripcion = $resp_arr[0];
            $descripcion_text = $resp_arr[1];
            $total = $resp_arr[2];
            $compra = $resp_arr[3];
            $iva += $precio - ($precio / 1.16) ;
        }
        if($envio){
            if(0){$envio = new Envio();}
            $precio = $envio->getCiudad()->getCosto();
            $resp_arr = $this->addEnvio($envio->getCiudad()->getNombre(), $precio, $compra, $em, $total, $descripcion, $descripcion_text,1,$request);
            $descripcion = $resp_arr[0];
            $descripcion_text = $resp_arr[1];
            $total = $resp_arr[2];
            $compra = $resp_arr[3];
            $iva += $precio - ($precio / 1.16);
        }
        $doc_line_info = array("Row"=>$doc_line_info);
        $Document_Lines = array("Document_Lines"=>$doc_line_info);

        $client = new \nusoap_client('http://45.163.28.59:13027/SIC.asmx?WSDL', true);
        $full_array = array_merge($AdminInfo,$Documents,$Document_Lines);
        $factura->setRequest($full_array);

        
        $response = $client->call('Document_marketing', $full_array);
        if (strpos($response['Document_marketingResult'], 'success') !== false) {
            $temp = explode(";",explode(" ",$response['Document_marketingResult'])[1]);
            $idsap = $temp[0];
            $docsap = $temp[1];
            $factura->setIdsap($idsap);
            $factura->setDocsap($docsap);
        }
        $body = $client->request;
        // error_log(json_encode(['SAP_Doc_Mark'=>['b'=>$body,'r'=>$response]]).PHP_EOL,3,'log_jimmy.log');
        $body = '';
        $response = '';


        $session = new Session();
        $escala_moneda = $session->get('escala_moneda',1);
        $iva = $iva / $escala_moneda;

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
        
        if($envio){
            $descripcion .= $this->tablaEnvio($envio);
        }
        $descripcion .= $this->tablamensaje($factura);


        if($session->get('sap_down', false)){
            $descripcion .= '<span style="display:none;">1<span>';
        }else{
            $descripcion .= '<span style="display:none;">0<span>';
        }

        $compra->setDescripcion($descripcion);
        $costo_envio = 0;
        if($envio){
            $costo_envio = $factura->getEnvio()->getCiudad()->getCosto();
        }
        //$total = $total + $factura->getEnvio()->getCiudad()->getCosto();
        $compra->setPrecio($total);
        $em->persist($compra);
        $em->flush();

        $em->persist($factura);
        $em->flush();

        $descripcion_text .= 'Costo envio, $' . number_format($costo_envio) . ' |';
        $descripcion_text .= 'TOTAL: $'.number_format($total);
        $descripcion_text = substr($descripcion_text,0,255);
        $tax = round($total*0.19/1.19,2);
        $taxReturnBase = round($total/1.19,2);
        $referenceCode = 'Test_DE_'.$compra->getId();
        $total = number_format($total,2, '.', '');
        //echo $datos_payu->getApiKey().'~'.$datos_payu->getMerchantId().'~'.$referenceCode.'~'.$total.'~'.$session->get('moneda','COP');
        $firma = md5($datos_payu->getApiKey().'~'.$datos_payu->getMerchantId().'~'.$referenceCode.'~'.$total.'~'.$session->get('moneda','COP'));
        //$responseUrl = $this->generateUrl('pagar_payu_respuesta',null,UrlGeneratorInterface::ABSOLUTE_URL);
        //$confirmationUrl = $this->generateUrl('pagar_payu_confirmacion',array(),UrlGeneratorInterface::ABSOLUTE_URL);


        /**/
        $session->set('carrito', array());
        $session->set('bonos', array());
        $session->set('descuento', array());
        $session->set('dedicatoria', null);
        $session->set('envio', null);
        $session->set('factura', null);
        /**/

        return $this->render('PagosPayuBundle:Default:index.html.twig',array(
            'compra'=>$compra,
            'tax'=>$tax,
            'taxReturnBase'=>$taxReturnBase,
            'firma'=>$firma,
            'referenceCode'=>$referenceCode,
            'descripcion_text'=>'Compra Rosas Don Eloy',
            'descripcion'=>$descripcion,
            'datos_payu'=>$datos_payu,
            'factura'=>$factura,
            'response'=>$response,
            'body'=>$body,
            'full_array'=>$full_array
        ));
    }

    private function tablaMensaje(Factura $factura){
        $dedicatoria = $factura->getDedicatoria();
        if(!$dedicatoria){
            return '';
        }
        $descripcion = '';
        $descripcion .= '</br><h2 style="color: #4A7689;font-family: Helvetica">Dedicatoria</h2>';
        $descripcion .= '<table style="width: 100%;max-width: 600px; border: 1px;text-align: center;font-family: Helvetica;border-collapse: collapse;">
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td>De</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.$dedicatoria->getDe().'</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Para</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.$dedicatoria->getPara().'</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Mensaje</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.nl2br($dedicatoria->getMensaje()).'</td>
                            </tr>
                        </table>';
        return $descripcion;

    }

    private function tablaEnvio(Envio $envio){
        if(!$envio){
            return '';
        }
        $descripcion = '';
        $descripcion .= '</br><h2 style="color: #4A7689;font-family: Helvetica">Datos de envio</h2>';
        $descripcion .= '<table style="width: 100%;max-width: 600px; border: 1px;text-align: center;font-family: Helvetica;border-collapse: collapse;">
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td>Nombre</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.$envio->getNombre().'</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Apellido</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.$envio->getApellidos().'</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Ciudad</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.$envio->getCiudad()->getNombre().'</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Dirección</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.$envio->getDireccion().'</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">¿Es oficina?</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.$envio->getOficina().'</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Teléfono</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.$envio->getTelefono().'</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Fecha de entrega</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.$envio->getFechaDeEnvio().'</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Datos adicionales</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">'.nl2br($envio->getAdicionales()).'</td>
                            </tr>
                        </table>';
        return $descripcion;

    }

    private function addEnvio($nombre, $precio, Compra $compra,ObjectManager $em, $total, $descripcion, $descripcion_text,$cantidad, Request $request)
    {
        $host = 'http://'.$request->headers->get('host');

        $qi = $this->get('qi');
        $session = new Session();
        $escala_moneda = $session->get('escala_moneda',1);
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

    private function addProdColor($sku,Talla $talla,$color_precio){
        $session = new Session();
        $escala_moneda = $session->get('escala_moneda',1);
        $fila =
            array(
                "ItemCode"   =>  $sku,
                "Quantity"        =>  $talla->getCantidad(),
                "Dimension"          =>  "",
                "LineVendor"          =>  "",
                "WhsCode"       =>  "Cn-PRI",
                "Price"         =>  $color_precio / $escala_moneda
            )
        ;
        return $fila;
    }

    private function addProd(Producto $producto, Talla $talla, Compra $compra, ObjectManager $em, $total, $descripcion, $descripcion_text,$cantidad,$borde, Request $request, $color,$tallerPlan,$precioPlan = 0)
    {
        $qi = $this->get('qi');
        $session = new Session();
        $escala_moneda = $session->get('escala_moneda',1);
        $host = 'http://'.$request->headers->get('host');
        $doctrine = $this->getDoctrine();

        //Obetener producto
        $producto_db = $doctrine->getRepository('CarroiridianBundle:Producto')->find($producto->getId());
        
        //Obtener inventario por talla
        $inventario = $doctrine->getRepository('CarroiridianBundle:Inventario')->findOneBy(array('producto'=>$producto->getId(),'talla'=>$talla->getId()));

        if(!$inventario){
            $precio_base = $producto_db->getPrecioiva();
        }else{
            $precio_base = $inventario->getPreciobase();
        }

        ///No tocar
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
        if($precioPlan == 0){
            $subtotalProducto = $precio_uso / $escala_moneda;
            $subtotal = $cantidad * $precio_uso / $escala_moneda;
        }else{
            $subtotal = $precioPlan / $escala_moneda;
            $subtotalProducto = $subtotal;
        }
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
            $descripcion .= '<td style="border:0;padding: 5px;"><h4 style="font-size: 17px;color: #592836;">$'.number_format($subtotalProducto,2).'</h4></td>';
            $descripcion .= '<td style="border:0;padding: 5px;"><h3 style="font-size: 16px;color: #4A7689;">'.$cantidad.'</h3></td>';
            $descripcion .= '<td style="border:0;padding: 5px;"><h4 style="font-size: 17px;color: #592836;">$'.number_format($subtotal,2).'</h4></td>';
        $descripcion .= '</tr>';

        $descripcion_text .= '|'.$producto.' - ';
        $descripcion_text .= $talla.' - ';
        $descripcion_text .= '$'.number_format($subtotalProducto,2).' - ';
        $descripcion_text .= 'X'.$cantidad.' - ';
        $descripcion_text .= '$'.number_format($subtotal,2).' | ';

        if($precioPlan == 0){
            $precioSap = $precio_base / $escala_moneda * $cantidad;
        }else{
            $precioSap = ($precioPlan / (1 + ($producto->getPorcentajeIva() / 100))) / $escala_moneda;
        }

        $fila =
            array(
                "ItemCode"   =>  $producto->getSku(),
                "Quantity"        =>  $cantidad,
                "Dimension"          =>  "",
                "LineVendor"          =>  "",
                "WhsCode"       =>  "Cn-PRI",
                "Price"         =>  $precioSap
            )

        ;

        return array($descripcion,$descripcion_text,$total,$compra,$fila);
    }

    /**
     * @Route("/pagar-payu/testws_fecha/{id}",name="pagar_payu_testws_fecha")
     */
    public function testWsFechaAction(Request $request,$id)
    {
        $factura = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->find($id);
        echo $factura->getEnvio()->getFechaDeEnvio();
        $fecha = date('jS F, Y', strtotime($factura->getEnvio()->getFechaDeEnvio()));
        echo $fecha;
        //echo date('Ymd', strtotime($factura->getEnvio()->getFechaDeEnvio()));
        die();
    }


    /**
     * @Route("/pagar-payu/testws/{id}",name="pagar_payu_testws")
     */
    public function testWsAction(Request $request,$id)
    {
        $factura = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->find($id);
        $client = new \nusoap_client('http://45.163.28.59:13027/SIC.asmx?WSDL', true);
        $full_array = $factura->getRequest();
        $mensaje = $full_array['Documents']['UserField']['RowField'][11]['Value'];
        $mensaje = str_replace("\r\n",'',$mensaje);
        $full_array['Documents']['UserField']['RowField'][11]['Value'] = $mensaje;
        $factura->setRequest($full_array);
        $response = $client->call('Document_marketing', $full_array);
        dump($response);
        // if (strpos($response['Document_marketingResult'], 'success') !== false) {
        //     $temp = explode(";",explode(" ",$response['Document_marketingResult'])[1]);
        //     $idsap = $temp[0];
        //     $docsap = $temp[1];
        //     $factura->setIdsap($idsap);
        //     $factura->setDocsap($docsap);
        //     $factura->setReportada(true);
        // }
        $body = $client->request;

        $em = $this->getDoctrine()->getManager();

        $em->persist($factura);
        $em->flush();

        $error = $client->getError();
        return $this->render('HomeBundle:Default:soap.html.twig',array('response'=>$response,'body'=>$body,'full_array'=>$full_array,'error'=>$error));
    }

    /**
     * @Route("/pagar-payu/testws_socio/{id}",name="pagar_payu_testws_socio")
     */
    public function testWsSocioAction(Request $request,$id)
    {
        try{
            $factura = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->find($id);
        }catch (ContextErrorException $e){
            /** @var  $em EntityManager*/
            $em = $this->getDoctrine()->getManager();

            $factura = $em->createQueryBuilder()->from('CarroiridianBundle:Factura','f')
                ->select('f.documento','c.id as compra_id','d.para','d.mensaje','e.direccion','e.telefono','ci.nombre','e.fechaDeEnvio as fecha','e.adicionales')
                ->leftJoin('f.compra','c')
                ->leftJoin('f.dedicatoria','d')
                ->leftJoin('f.envio','e')
                ->leftJoin('e.ciudad','ci')
                ->where('f.id = '.$id)
                ->getQuery()
                ->getSingleResult();
            $telefono = $factura['telefono'];
            $telefono = preg_replace("/[^0-9,.]/", "", $telefono );
            dump($factura);
            dump(min(strlen($telefono),14));
            dump(strlen(trim($telefono)));
            dump((trim($telefono)));

            $cont_admin_info = array(
                "ObjType"   =>  17,
                "IDDB"      =>  10000101,
                "Token"     =>  "EB18D5439C45212BEBA999DD150B4744"
            );
            $AdminInfo = array("AdminInfo"=>$cont_admin_info);

            $doc_info = array(
                "DocType"      =>  "I",
                "Requester"      =>  "",
                "Series"      =>  "OV-Inte",
                "RequriedDate"      =>  date('Ymd'),
                "ContactPersonCode"      =>  "",
                "RequesterEmail"      =>  "",
                "CardCode"     =>  "C".$factura['documento'],
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
                            "Value" => $factura['para']
                        ),
                        4 => array(
                            "Field" => "U_RDE_DirEntrega",
                            "Value" => $factura{'direccion'}
                        ),
                        5 => array(
                            "Field" => "U_RDE_Ciudad",
                            "Value" => $factura{'nombre'}
                        ),
                        6 => array(
                            "Field" => "U_RDE_Tel",
                            "Value" => substr($telefono, 0, min(strlen($telefono),14))
                        ),
                        7 => array(
                            "Field" => "U_RDE_FecEnvio",
                            "Value" => $factura['fecha']
                        ),
                        8 => array(
                            "Field" => "U_RDE_Observ",
                            "Value" => substr($factura['adicionales'], 0, 253)
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
                            "Value" => $factura['mensaje']
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

            $items = $this->getDoctrine()->getRepository('CarroiridianBundle:Compraitem')->findBy(array('compra'=>$factura['compra_id']));
            foreach ($items as $item){
                $producto_db = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto')->find($item->getProducto()->getId());
                $inventario = $this->getDoctrine()->getRepository('CarroiridianBundle:Inventario')->findOneBy(array('producto'=>$item->getProducto()->getId(),'talla'=>$item->getTalla()->getId()));
                if(!$inventario)
                    $precio_base = $producto_db->getPrecioiva();

                else{
                    $precio_base = $inventario->getPreciobase();
                }
                $fila =
                    array(
                        "ItemCode"   =>  $item->getProducto()->getSku(),
                        "Quantity"        =>  $item->getCantidad(),
                        "Dimension"          =>  "",
                        "LineVendor"          =>  "",
                        "WhsCode"       =>  "Sb-PRI",
                        "Price"         =>  $precio_base / 1 * $item->getCantidad()
                    )
                ;
                array_push($doc_line_info,$fila);
            }
            $doc_line_info = array("Row"=>$doc_line_info);
            $Document_Lines = array("Document_Lines"=>$doc_line_info);

            //$client = new \nusoap_client('http://45.163.28.59:13027/SIC.asmx?WSDL', true);
            $full_array = array_merge($AdminInfo,$Documents,$Document_Lines);
            $query = "update factura set request = '".serialize($full_array)."' where id = ".$id;
            $db = $em->getConnection();

            //---------------- QUERY REDES -----------------------------
            $stmt = $db->prepare($query);
            $params = array();
            $stmt->execute($params);
            dump($full_array);
            //die();
            //$factura->setRequest($full_array);
        }

        $ennvio = $factura->getEnvio();

        $cont_admin_info = array(
            "ObjType"   =>  2,
            "IDDB"      =>  10000101,
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
            "CardCode"      =>  "CC".$factura->getDocumento(),
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

        $client = new \nusoap_client('http://45.163.28.59:13027/SIC.asmx?WSDL', true);
        $full_array = array_merge($AdminInfo,$BusinessPartners,$Addresses);
        $response = $client->call('SincroSN', $full_array);
        $body = $client->request;
        $error = $client->getError();
        return $this->render('HomeBundle:Default:soap.html.twig',array('response'=>$response,'body'=>$body,'full_array'=>$full_array,'error'=>$error));
    }

    private function reporteNativoGen($cols,$cadena){
        $rsm = new ResultSetMapping();
        foreach ($cols as $col){
            $rsm->addScalarResult($col, $col, 'string');
        }
        $reporte = $this->getDoctrine()->getManager()->createNativeQuery($cadena, $rsm)->getArrayResult();
        return $reporte;
    }



    /**
     * @Route("/cron",name="cron")
     */
    public function cronAction(Request $request)
    {
        $facturas  = $this->getDoctrine()
            ->getManager()
            ->createQueryBuilder()
            ->from('CarroiridianBundle:Factura','f')
            ->select('f')
            ->leftJoin('f.compra','c')
            ->leftJoin('c.estado','e')
            ->where('e.id = 2')
            ->andWhere('f.reportada = 0')
            ->andWhere('f.request is not null')
            ->andWhere('f.id > 670')
            ->getQuery()
            ->getResult();

        return $this->render('HomeBundle:Default:cron.html.twig',array('facturas'=>$facturas));
    }

    /**
     * @Route("/pagar-payu/respuesta",name="pagar_payu_respuesta")
     */
    public function respuestaAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $full_url = serialize($request->query->all());
        $logger = new PagoLogger();
        $logger->setRespuesta($full_url);
        $em->persist($logger);

        $datos_payu = $this->getDoctrine()->getRepository('PagosPayuBundle:DatosPayu')->find(1);
        $ApiKey = $datos_payu->getApiKey();
        $merchant_id = $datos_payu->getMerchantId();
        $referenceCode = $request->query->get('referenceCode');
        $TX_VALUE = $request->query->get('TX_VALUE');
        $New_value = number_format($TX_VALUE, 1, '.', '');
        $currency = $request->query->get('currency');
        $transactionState = $request->query->get('transactionState');

        $firma_cadena = "$ApiKey~$merchant_id~$referenceCode~$New_value~$currency~$transactionState";
        $firmacreada = md5($firma_cadena);
        $firma = $request->query->get('signature');

        $reference_pol = $request->query->get('reference_pol');
        $cus = $request->query->get('cus');
        $description = $request->query->get('description');
        $pseBank = $request->query->get('pseBank');
        $lapPaymentMethod = $request->query->get('lapPaymentMethod');
        $transactionId = $request->query->get('transactionId');
        $processingDate = $request->query->get('processingDate');
        $TX_ADMINISTRATIVE_FEE = $request->query->get('TX_ADMINISTRATIVE_FEE');

        $arr_ref = explode('_',$referenceCode);
        $id_compra = end($arr_ref);
        $compra = $this->getDoctrine()->getRepository('CarroiridianBundle:Compra')->find($id_compra);
        $respuesta = new RepuestaPago();
        $respuesta->setReferenceCode($referenceCode);
        $respuesta->setTXVALUE($TX_VALUE);
        $respuesta->setTransactionState($transactionState);
        $respuesta->setSignature($firma);
        $respuesta->setReferencePol($reference_pol);
        $respuesta->setCus($cus);
        $respuesta->setPseBank($pseBank);
        $respuesta->setLapPaymentMethod($lapPaymentMethod);
        $respuesta->setTransactionId($transactionId);
        $respuesta->setProcessingDate($processingDate);
        $respuesta->setTXADMINISTRATIVEFEE($TX_ADMINISTRATIVE_FEE);
        $respuesta->setDescription($description);
        $respuesta->setCompra($compra);
        $respuesta->setTipo('RESPUESTA');
        $em->persist($respuesta);
        $em->flush();



        if (strtoupper($firma) == strtoupper($firmacreada) || 1) {

            if ($transactionState == 4 ) {
                $estadoTx = "APROBADA";
            }

            else if ($transactionState == 6 ) {
                $estadoTx = "RECHAZADA";
            }

            else if ($transactionState == 7 ) {
                $estadoTx = "PENDIENTE";
            }

            else if ($transactionState == 104 ) {
                $estadoTx = "ERROR";
            }

            else {
                $estadoTx=$_REQUEST['mensaje'];
            }

            // $estado = $this->getDoctrine()->getRepository('CarroiridianBundle:EstadoCarrito')->findOneBy(array('ref'=>$estadoTx));
            // $compra->setEstado($estado);
            // $em->flush();

            return $this->render('PagosPayuBundle:Default:respuesta.html.twig',array(
                'estadoTx'=>$estadoTx,'transactionId'=>$transactionId,'reference_pol'=>$reference_pol,'referenceCode'=>$referenceCode,
                'pseBank'=>$pseBank,'cus'=>$cus,'TX_VALUE'=>$TX_VALUE,
                'currency'=>$currency,'lapPaymentMethod'=>$lapPaymentMethod));
        }else{
            return $this->render('HomeBundle:Default:index.html.twig');
        }
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

    public function SendMailHtml($subject, $from, $to, $html){
        // $to = $from;
        $subject = $subject;

        $headers = 'From: Rosas Don Eloy <'.$from.'>' . "\r\n";
        $headers .= 'To: <'.$to.'>' . "\r\n";

        $headers .= 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";

        mail($to, $subject, html_entity_decode($html), $headers);

    }
    /**
     * @Route("/pruebafactura",name="pruebafactura")
     */
    public function pruebaAction(Request $request)
    {

        $compra = $this->getDoctrine()->getRepository('CarroiridianBundle:Compra')->find(85);
        $factura  = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->findOneBy(array('compra'=>$compra->getId()));
        $qi = $this->get('qi');
        $asunto = $qi->getTextoDB('asunto_compra_aprobada');
        $sender = $qi->getSettingDB('sender');
        //$this->SendMailHtml($asunto, $sender, $sender, $compra->getDescripcion());
        /*
        $message = \Swift_Message::newInstance()
            ->setSubject($asunto)
            ->setFrom('reservas@andrescarnederes.com')
            ->setTo($sender)
            ->setBody(
                $this->renderView(
                    'CarroiridianBundle:Default:email.html.twig',
                    array('name' => 'name')
                )
            );
        echo $this->get('mailer')->send($message);
        */

        $to = 'mauricio@iridian.co';
        $subject = 'Mensaje de prueba';

        $headers = 'From: Mauricio <'.$to.'>' . "\r\n";
        $headers .= 'To: Mauricio <'.$to.'>' . "\r\n";

        $headers .= 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";

        mail($to, $subject, html_entity_decode($compra->getDescripcion()), $headers);
        /*
        $to = 'mauricio@iridian.co';
        $subject = 'Mensaje de prueba';

        $headers = 'From: Mauricio <'.$to.'>' . '\r\n';
        $headers .= 'To: Mauricio <'.$to.'>' . '\r\n';

        $headers .= 'MIME-Version: 1.0' . '\r\n';
        $headers .= 'Content-Type: text/html; charset=UTF-8' . '\r\n';

        mail(
            $to,
            $subject,
            $this->renderView(
                'CarroiridianBundle:Default:email.html.twig',
                array('compra' => $compra)
            ),
            $headers);
        */
        /*
        $dispatcher = $this->get('hip_mandrill.dispatcher');
        $message = new Message();
        $message
            ->setFromEmail('reservas@andrescarnederes.com')
            ->setFromName('Prueba iridian')
            ->addTo('mauricio@iridian.co')
            ->setSubject('Asunto')
            ->setHtml('<html><body><h1>Some Content</h1></body></html>');
        $result = $dispatcher->send($message);
        var_dump($result);
        exit();
        */

        return $this->render('CarroiridianBundle:Default:prueba.html.twig',array('factura'=>$factura));

        //return new Response('<pre>' . print_r($result, true) . '</pre>');

    }


    /**
     * @Route("/pagar-payu/confirmacion",name="pagar_payu_confirmacion", methods={"POST"})
     */
    public function confirmacionAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $full_url = serialize($request->request->all());
        $logger = new PagoLogger();
        $logger->setRespuesta($full_url);
        $em->persist($logger);


        $datos_payu = $this->getDoctrine()->getRepository('PagosPayuBundle:DatosPayu')->find(1);
        $ApiKey = $datos_payu->getApiKey();
        $merchant_id = $datos_payu->getMerchantId();

        $reference_sale = $request->request->get('reference_sale');
        $value = $request->request->get('value');
        $new_value = number_format($value, 1, '.', '');
        $currency = $request->request->get('currency');
        $state_pol = $request->request->get('state_pol');
        $firma_cadena = "$ApiKey~$merchant_id~$reference_sale~$new_value~$currency~$state_pol";

        $firmacreada = md5($firma_cadena);
        $firma = $request->request->get('sign');
        $reference_pol = $request->query->get('reference_pol');
        $cus = $request->request->get('cus');
        $description = $request->query->get('description');
        $pseBank = $request->request->get('pse_bank');
        $lapPaymentMethod = $request->query->get('payment_method_name');
        $transactionId = $request->request->get('transaction_id');
        $processingDate = $request->request->get('transaction_date');
        $TX_ADMINISTRATIVE_FEE = $request->request->get('administrative_fee');
        $risk = $request->request->get('risk');

        $confirma_compra  = $this->getDoctrine()->getRepository('AppBundle:Mailing')->findBy(["llave" => "confirma_compra"]);
        $entrega_bono  = $this->getDoctrine()->getRepository('AppBundle:Mailing')->findBy(["llave" => "entrega_bono"]);
        $confirma_compra_bono  = $this->getDoctrine()->getRepository('AppBundle:Mailing')->findBy(["llave" => "confirma_compra_bono"]);


        $arr_ref = explode('_',$reference_sale);
        $id_compra = end($arr_ref);
        $compra = $this->getDoctrine()->getRepository('CarroiridianBundle:Compra')->find($id_compra);
        $respuesta = new RepuestaPago();
        $respuesta->setReferenceCode($reference_sale);
        $respuesta->setTXVALUE($value);
        $respuesta->setTransactionState($state_pol);
        $respuesta->setSignature($firma);
        $respuesta->setReferencePol($reference_pol);
        $respuesta->setCus($cus);
        $respuesta->setPseBank($pseBank);
        $respuesta->setLapPaymentMethod($lapPaymentMethod);
        $respuesta->setTransactionId($transactionId);
        $respuesta->setProcessingDate($processingDate);
        $respuesta->setTXADMINISTRATIVEFEE($TX_ADMINISTRATIVE_FEE);
        $respuesta->setDescription($description);
        $respuesta->setCompra($compra);
        $respuesta->setRisk($risk);
        $respuesta->setTipo('CONFIRMACION');
        $em->persist($respuesta);
        $em->flush();
        $mens = ' ';
        if($state_pol == 4 || $datos_payu->getTest()){
            $factura  = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->findOneBy(array('compra'=>$compra->getId()));
            $compraitems = $compra->getCompraitems();
            $to = $factura->getEmail();
            $name = $factura->getFullName();
            $qi = $this->get('qi');
            $asunto = $qi->getTextoDB('asunto_compra_aprobada');
            $sender = $qi->getSettingDB('sender');
            $this->SendMailHtml($asunto, $sender, $to, $compra->getDescripcion());

            //$to = $from;
            $subject = $asunto;
            //$subject = 'Prueba aprobada';

            $headers = 'From: Rosas Don Eloy <contacto@rosasdoneloy.com>' . "\r\n";
            $headers .= 'To: <internet@rosasdoneloy.com>' . "\r\n";
            //$headers .= "CC: internet@rosasdoneloy.com". "\r\n";

            $headers .= 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";

            $descriptionToSend = $compra->getDescripcion();

            if(substr($descriptionToSend, -7, 1) == '1'){
                $descriptionToSend = '<h2 style="color: #4A7689;font-family: Helvetica">Alerta SAP</h2><p style="color: #4A7689;font-family: Helvetica">Esta compra se realizó sin poder revisar el inventario en SAP.</p><br>'.$descriptionToSend;
            }

            mail('internet@rosasdoneloy.com', $subject, html_entity_decode($descriptionToSend), $headers);

            //$this->SendMailHtml($asunto, $sender, $to, $compra->getDescripcion());
        }

        $em->flush();

        if (strtoupper($firma) == strtoupper($firmacreada) || 1) {
            if ($state_pol == 4 ) {
                $estadoTx = "APROBADA";
            }

            else if ($state_pol == 6 ) {
                $estadoTx = "RECHZADA";
            }

            else if ($state_pol == 5 ) {
                $estadoTx = "EXPIRADA";
            }
            else {
                $estadoTx = "PENDIENTE";
            }
            $estado = $this->getDoctrine()->getRepository('CarroiridianBundle:EstadoCarrito')->findOneBy(array('ref'=>$estadoTx));
            $compra->setEstado($estado);
            $em->flush();

            return new Response($mens.' Hello PAYU', Response::HTTP_OK);
        }else{
            return new Response('Hello PAYU', Response::HTTP_INTERNAL_SERVER_ERROR);
        }

    }
    /**
     * @Route("/test-send-mail",name="test_smail")
     */
    public function tsmAction()
    {
        $subject = $asunto;
        //$subject = 'Prueba aprobada';

        $headers = 'From: Rosas Don Eloy <contacto@rosasdoneloy.com>' . "\r\n";
        $headers .= 'To: <j.acero@orekaconsultores.com>' . "\r\n";
        //$headers .= "CC: internet@rosasdoneloy.com". "\r\n";

        $headers .= 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";

        mail($to, $subject, 'Texto de prueba', $headers);
        return new JsonResponse(['message' => 1]);
    }
}

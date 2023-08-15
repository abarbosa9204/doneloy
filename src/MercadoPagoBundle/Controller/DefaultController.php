<?php

namespace MercadoPagoBundle\Controller;

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
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Hip\MandrillBundle\Message;
use Hip\MandrillBundle\Dispatcher;
use Symfony\Component\Validator\Constraints\DateTime;
use MercadoPagoBundle\Entity\DatosMercadoPago;
use MercadoPago\SDK;
use MercadoPago\Preference;
use MercadoPago\Item;
use MercadoPago\Payer;
use MercadoPago\Payment;
use MercadoPago\MerchantOrder;
use Symfony\Component\Intl\Data\Bundle\Reader\JsonBundleReader;

class DefaultController extends Controller
{
    /**
     * Mercado Pago Data
     *
     * @var MercadoPagoBundle\Entity\DatosMercadoPago
     */

    // private $access_token = 'TEST-1678029048874133-092911-fefd4d611734292630e8d8650d5aa373-52130685';
    // private $public_key = 'TEST-205c2632-d94a-45f4-a521-e7776874340e';
    private $access_token = 'APP_USR-1547867846118039-061015-2037bfb4cb0a3cb8e38e2c4ddffab9b7-118570928';
    private $public_key = 'APP_USR-5436d972-376d-43a0-82e7-aad9da56f685';

    private $mpData;

    /**
     * @Route("/pagar-mp",name="pagar_mp")
     */
    public function indexAction(Request $request)
    {
        date_default_timezone_set('America/Bogota');
        $session = $request->getSession();
        $factura = $session->get('factura');
        if ($factura == null)
            return $this->redirect($this->generateUrl('carrito'));
        $factura = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->find($factura->getId());
        $carrito = $session->get('carrito', array());
        $envio = $session->get('envio', null);
        $rosa = $session->get('rosa', null);

        $estado = $this->getDoctrine()->getRepository('CarroiridianBundle:EstadoCarrito')->findOneBy(array('ref' => 'INICIADA_EN_WEB'));
        $datos_mp = $this->getMercadoData();
        $this->setMercadoPago();

        $ci = $this->get('ci');

        $compra = new Compra();
        $compra->setEstado($estado);
        $compra->setPrueba($datos_mp->getSandbox());
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
        if ($envio) {
            $fecha_envio = date('Ymd', strtotime($factura->getEnvio()->getFechaDeEnvio()));
            if ($factura->getEnvio()->getAdicionales() != null) {
                $adicionales = $factura->getEnvio()->getAdicionales();
            }
            $telefono = $factura->getEnvio()->getTelefono();
            $telefono = preg_replace("/[^0-9,.]/", "", $telefono);
            $factura->getEnvio()->getDireccion();
            $ciudadN = $factura->getEnvio()->getCiudad()->getNombre();
        }
        //die(dump($envio));

        $para = '';
        $msg = '';
        if ($factura->getDedicatoria()) {
            $para = $factura->getDedicatoria()->getPara();
            $msg = $factura->getDedicatoria()->getMensaje();
        }


        $cont_admin_info = array(
            "ObjType"   =>  17,
            "IDDB"      =>  10000102,
            "Token"     =>  "EB18D5439C45212BEBA999DD150B4744"
        );
        $AdminInfo = array("AdminInfo" => $cont_admin_info);

        $doc_info = array(
            "DocType"      =>  "I",
            "Requester"      =>  "",
            "Series"      =>  "OV-Inte",
            "RequriedDate"      =>  date('Ymd'),
            "ContactPersonCode"      =>  "",
            "RequesterEmail"      =>  "",
            "CardCode"     =>  "C" . $factura->getDocumento(),
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

        $Documents = array("Documents" => $doc_info);

        $doc_line_info = array();

        $host = 'https://' . $request->headers->get('host');



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

        foreach ($carrito as $id => $tallas) {
            foreach ($tallas as $id_talla => $item) {
                if ($item['cantidad'] > 0) {
                    $color = $item['color'];
                    $color_sku = $item['color_sku'];
                    $tallerPlan = in_array($color_sku, ['es_taller', 'es_plan']);
                    $color_precio = $item['color_precio'];
                    $precioPlan = $color_sku == 'es_plan' ? $color_precio : 0;
                    $producto = $item['productos'][0];
                    //$producto = $repo_p->find($id);
                    $talla = $repo_t->find($id_talla);
                    $talla_unica = $repo_t->find(1);
                    $solos = 0;
                    foreach ($item['productos'] as $key => $grupo_prod) {
                        $grupo_compplementos = $grupo_prod['complementos'];
                        if (count($grupo_compplementos) == 0) {
                            $solos++;
                        } else {
                            $cantidad = 1;
                            $prod = $grupo_prod['producto'];
                            //$prod = $repo_p->find($prod->getId());

                            $resp_arr = $this->addProd($prod, $talla, $compra, $em, $total, $descripcion, $descripcion_text, $cantidad, true, $request, $color, $tallerPlan, $precioPlan);
                            $descripcion = $resp_arr[0];
                            $descripcion_text = $resp_arr[1];
                            $total = $resp_arr[2];
                            $compra = $resp_arr[3];
                            $iva += $prod->getIva();
                            array_push($doc_line_info, $resp_arr[4]);
                            if ($color_sku && !$tallerPlan) {
                                array_push($doc_line_info, $this->addProdColor($color_sku, $talla, $color_precio));
                            }
                            foreach ($grupo_compplementos as $complemento) {
                                $cantidad = $complemento['cantidad'];
                                $prod = $complemento['producto'];
                                //$prod = $repo_p->find($prod->getId());

                                $resp_arr = $this->addProd($prod, $talla_unica, $compra, $em, $total, $descripcion, $descripcion_text, $cantidad, false, $request, null);
                                $descripcion = $resp_arr[0];
                                $descripcion_text = $resp_arr[1];
                                $total = $resp_arr[2];
                                $compra = $resp_arr[3];
                                $iva += $prod->getIva();
                                array_push($doc_line_info, $resp_arr[4]);
                            }
                        }
                    }
                    /////////TODO
                    if ($solos > 0) {
                        $prod = $grupo_prod['producto'];
                        //$prod = $repo_p->find($prod->getId());
                        $cant = $solos;
                        $resp_arr = $this->addProd($prod, $talla, $compra, $em, $total, $descripcion, $descripcion_text, $solos, true, $request, $color, $tallerPlan, $precioPlan);
                        $descripcion = $resp_arr[0];
                        $descripcion_text = $resp_arr[1];
                        $total = $resp_arr[2];
                        $compra = $resp_arr[3];
                        $iva += $prod->getIva() * $solos;
                        array_push($doc_line_info, $resp_arr[4]);
                        if ($color_sku && $color_sku != 'f_plan' && !$tallerPlan) {
                            array_push($doc_line_info, $this->addProdColor($color_sku, $talla, $color_precio));
                        }
                    }
                }
            }
        }
        if ($rosa) {
            $qi = $this->get('qi');
            $precio = $qi->getSettingDB('precio_rosa_veloz');
            $resp_arr = $this->addEnvio('Rosa Veloz', $precio, $compra, $em, $total, $descripcion, $descripcion_text, 1, $request);
            $descripcion = $resp_arr[0];
            $descripcion_text = $resp_arr[1];
            $total = $resp_arr[2];
            $compra = $resp_arr[3];
            $iva += $precio - ($precio / 1.16);
        }
        if ($envio) {
            if (0) {
                $envio = new Envio();
            }
            $precio = $envio->getCiudad()->getCosto();
            $resp_arr = $this->addEnvio($envio->getCiudad()->getNombre(), $precio, $compra, $em, $total, $descripcion, $descripcion_text, 1, $request);
            $descripcion = $resp_arr[0];
            $descripcion_text = $resp_arr[1];
            $total = $resp_arr[2];
            $compra = $resp_arr[3];
            $iva += $precio - ($precio / 1.16);
        }
        $doc_line_info = array("Row" => $doc_line_info);
        $Document_Lines = array("Document_Lines" => $doc_line_info);

        // $client = new \nusoap_client('http://45.163.28.59:13027/SIC.asmx?WSDL', true);
        // $full_array = array_merge($AdminInfo,$Documents,$Document_Lines);
        $factura->setRequest($full_array);


        // $response = $client->call('Document_marketing', $full_array);
        // if (strpos($response['Document_marketingResult'], 'success') !== false) {
        //     $temp = explode(";",explode(" ",$response['Document_marketingResult'])[1]);
        //     $idsap = $temp[0];
        //     $docsap = $temp[1];
        //     $factura->setIdsap($idsap);
        //     $factura->setDocsap($docsap);
        // }
        $body = $client->request;
        // error_log(json_encode(['SAP_Doc_Mark'=>['b'=>$body,'r'=>$response]]).PHP_EOL,3,'log_jimmy.log');
        $body = '';
        $response = '';


        $session = new Session();
        $escala_moneda = $session->get('escala_moneda', 1);
        $iva = $iva / $escala_moneda;

        $siniva = $total - $iva;
        $descripcion .= '<tr style="    border: 1px solid #647687;color: #647687; background-color: #eeeef4;margin: 10px 0;">
                            <td colspan="3"></td>
                            <td>SUB TOTAL</td>
                            <td style="border: 1px solid #647687;padding: 5px 0;">$' . number_format($siniva, 2) . '</td>
                        </tr>';
        $descripcion .= '<tr style="    border: 1px solid #647687;color: #647687; background-color: #eeeef4;">
                            <td colspan="3"></td>
                            <td>IVA</td>
                            <td style="border: 1px solid #647687;padding: 5px 0;">$' . number_format($iva, 2) . '</td>
                        </tr>';
        $descripcion .= '<tr style="    border: 1px solid #647687;color: #647687; background-color: #647687;">
                            <td colspan="3"></td>
                            <td style="color: #ffffff;">TOTAL</td>
                            <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;">$' . number_format($total, 2) . '</td>
                        </tr>';


        $descripcion .= '</table>';

        if ($envio) {
            $descripcion .= $this->tablaEnvio($envio);
        }
        $descripcion .= $this->tablamensaje($factura);



        $compra->setDescripcion($descripcion);
        $costo_envio = 0;
        if ($envio) {
            $costo_envio = $factura->getEnvio()->getCiudad()->getCosto();
        }
        //$total = $total + $factura->getEnvio()->getCiudad()->getCosto();
        $compra->setPrecio($total);
        $em->persist($compra);
        $em->flush();

        $em->persist($factura);
        $em->flush();

        $descripcion_text .= 'Costo envio, $' . number_format($costo_envio) . ' |';
        $descripcion_text .= 'TOTAL: $' . number_format($total);
        $descripcion_text = substr($descripcion_text, 0, 255);
        $tax = round($total * 0.19 / 1.19, 2);
        $taxReturnBase = round($total / 1.19, 2);
        $referenceCode = 'Test_DE_' . $compra->getId();
        // $total = number_format($total,2, '.', '');
        $descripcion_text = 'Compra en Rosas don Eloy';
        /**/
        $session->set('carrito', array());
        $session->set('bonos', array());
        $session->set('descuento', array());
        $session->set('dedicatoria', null);
        $session->set('envio', null);
        $session->set('factura', null);
        /**/

        $preference = $this->createPreference($factura, $compra, $total, $descripcion_text, $host);

        $link = $datos_mp->getSandbox() ? $preference->sandbox_init_point : $preference->init_point;
        // error_log($link.'  '.serialize($preference).PHP_EOL,3,'log_jimmy.log');

        return $this->render('MercadoPagoBundle:Default:index.html.twig', array(
            'link' => $link,
        ));
    }

    /**
     * @Route("/ver-carrito", name="v-cart")
     */
    public function viewCartAction()
    {
        $session = new Session();
        $carrito = $session->get('carrito', []);
        var_dump($carrito);
        exit();
    }

    private function tablaMensaje(Factura $factura)
    {
        $dedicatoria = $factura->getDedicatoria();
        if (!$dedicatoria) {
            return '';
        }
        $descripcion = '';
        $descripcion .= '</br><h2 style="color: #4A7689;font-family: Helvetica">Dedicatoria</h2>';
        $descripcion .= '<table style="width: 100%;max-width: 600px; border: 1px;text-align: center;font-family: Helvetica;border-collapse: collapse;">
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td>De</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">' . $dedicatoria->getDe() . '</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Para</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">' . $dedicatoria->getPara() . '</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Mensaje</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">' . nl2br($dedicatoria->getMensaje()) . '</td>
                            </tr>
                        </table>';
        return $descripcion;
    }

    private function tablaEnvio(Envio $envio)
    {
        if (!$envio) {
            return '';
        }
        $descripcion = '';
        $descripcion .= '</br><h2 style="color: #4A7689;font-family: Helvetica">Datos de envio</h2>';
        $descripcion .= '<table style="width: 100%;max-width: 600px; border: 1px;text-align: center;font-family: Helvetica;border-collapse: collapse;">
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td>Nombre</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">' . $envio->getNombre() . '</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Apellido</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">' . $envio->getApellidos() . '</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Ciudad</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">' . $envio->getCiudad()->getNombre() . '</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Dirección</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">' . $envio->getDireccion() . '</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">¿Es oficina?</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">' . $envio->getOficina() . '</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Teléfono</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">' . $envio->getTelefono() . '</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Fecha de entrega</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">' . $envio->getFechaDeEnvio() . '</td>
                            </tr>
                            <tr style="border: 1px solid #647687;color: #ffffff; background-color: #647687;">
                                <td style="border-top: 1px solid #ffffff;">Datos adicionales</td>
                                <td style="background-color: #ffffff;border: 1px solid #647687;padding: 5px 0;color: #647687;">' . nl2br($envio->getAdicionales()) . '</td>
                            </tr>
                        </table>';
        return $descripcion;
    }

    private function addEnvio($nombre, $precio, Compra $compra, ObjectManager $em, $total, $descripcion, $descripcion_text, $cantidad, Request $request)
    {
        $host = 'http://' . $request->headers->get('host');

        $qi = $this->get('qi');
        $session = new Session();
        $escala_moneda = $session->get('escala_moneda', 1);
        $subtotal = $precio / $escala_moneda;
        $total += $subtotal;
        $descripcion .= '<tr style="background-color: #eeeef4;margin: 10px 0;border-top: 10px solid white;">';
        $descripcion .= '<td style="border:0;padding: 5px;"><img src="' . $host . $qi->getImagen('ico_moto_veloz') . '" style="vertical-align: middle;"display: inline-block; width="104"  /></td>';
        $descripcion .= '<td style="border:0;padding: 5px;"><h3 style="font-size: 16px;color: #4A7689;">' . $nombre . '</p></td>';
        $descripcion .= '<td style="border:0;padding: 5px;"><h4 style="font-size: 17px;color: #592836;">$' . number_format($precio / $escala_moneda, 2) . '</h4></td>';
        $descripcion .= '<td style="border:0;padding: 5px;"><h3 style="font-size: 16px;color: #4A7689;">' . $cantidad . '</h3></td>';
        $descripcion .= '<td style="border:0;padding: 5px;"><h4 style="font-size: 17px;color: #592836;">$' . number_format($subtotal, 2) . '</h4></td>';
        $descripcion .= '</tr>';

        $descripcion_text .= '| Envio - ';
        $descripcion_text .= $nombre . ' - ';
        $descripcion_text .= '$' . number_format($precio, 2) . ' - ';
        $descripcion_text .= 'X' . $cantidad . ' - ';
        $descripcion_text .= '$' . number_format($subtotal, 2) . ' | ';
        return array($descripcion, $descripcion_text, $total, $compra);
    }

    private function addProdColor($sku, Talla $talla, $color_precio)
    {
        $session = new Session();
        $escala_moneda = $session->get('escala_moneda', 1);
        $fila =
            array(
                "ItemCode"   =>  $sku,
                "Quantity"        =>  $talla->getCantidad(),
                "Dimension"          =>  "",
                "LineVendor"          =>  "",
                "WhsCode"       =>  "Cn-PRI",
                "Price"         =>  $color_precio / $escala_moneda
            );
        return $fila;
    }

    private function addProd(Producto $producto, Talla $talla, Compra $compra, ObjectManager $em, $total, $descripcion, $descripcion_text, $cantidad, $borde, Request $request, $color, $tallerPlan, $precioPlan = 0)
    {
        $qi = $this->get('qi');
        $session = new Session();
        $escala_moneda = $session->get('escala_moneda', 1);
        $host = 'http://' . $request->headers->get('host');
        $doctrine = $this->getDoctrine();

        //Obetener producto
        $producto_db = $doctrine->getRepository('CarroiridianBundle:Producto')->find($producto->getId());

        //Obtener inventario por talla
        $inventario = $doctrine->getRepository('CarroiridianBundle:Inventario')->findOneBy(array('producto' => $producto->getId(), 'talla' => $talla->getId()));

        if (!$inventario) {
            $precio_base = $producto_db->getPrecioiva();
        } else {
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
        if ($precioPlan == 0) {
            $subtotalProducto = $precio_uso / $escala_moneda;
            $subtotal = $cantidad * $precio_uso / $escala_moneda;
        } else {
            $subtotal = $precioPlan / $escala_moneda;
            $subtotalProducto = $subtotal;
        }
        $total += $subtotal;
        $cad_color = ' ';
        if ($color != '')
            $cad_color = '<br><p style="margin: 0 0 10px;">' . $qi->getTextoDB('rosas') . ' ' . $color . '</p>';
        $bt = '';
        if ($borde)
            $bt = 'border-top: 10px solid white;';
        $descripcion .= '<tr style="background-color: #eeeef4;margin: 10px 0;' . $bt . '">';
        $descripcion .= '<td style="border:0;padding: 5px;"><img src="' . $host . '/media/cache/producto_carrito/uploads/productos/' . $producto->getImagen() . '" style="vertical-align: middle;"display: inline-block; width="104" height="104" /></td>';
        $descripcion .= '<td style="border:0;padding: 5px;"><h3 style="font-size: 16px;color: #4A7689;">' . $producto . ' ' . $producto->getId() . '</h3><p style="margin: 0 0 10px;">' . $talla . '</p>' . $cad_color . '</td>';
        $descripcion .= '<td style="border:0;padding: 5px;"><h4 style="font-size: 17px;color: #592836;">$' . number_format($subtotalProducto, 2) . '</h4></td>';
        $descripcion .= '<td style="border:0;padding: 5px;"><h3 style="font-size: 16px;color: #4A7689;">' . $cantidad . '</h3></td>';
        $descripcion .= '<td style="border:0;padding: 5px;"><h4 style="font-size: 17px;color: #592836;">$' . number_format($subtotal, 2) . '</h4></td>';
        $descripcion .= '</tr>';

        $descripcion_text .= '|' . $producto . ' - ';
        $descripcion_text .= $talla . ' - ';
        $descripcion_text .= '$' . number_format($subtotalProducto, 2) . ' - ';
        $descripcion_text .= 'X' . $cantidad . ' - ';
        $descripcion_text .= '$' . number_format($subtotal, 2) . ' | ';

        if ($precioPlan == 0) {
            $precioSap = $precio_base / $escala_moneda * $cantidad;
        } else {
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
            );

        return array($descripcion, $descripcion_text, $total, $compra, $fila);
    }

    private function reporteNativoGen($cols, $cadena)
    {
        $rsm = new ResultSetMapping();
        foreach ($cols as $col) {
            $rsm->addScalarResult($col, $col, 'string');
        }
        $reporte = $this->getDoctrine()->getManager()->createNativeQuery($cadena, $rsm)->getArrayResult();
        return $reporte;
    }
    private function reporteNativoGenT($cols, $types, $cadena)
    {
        $rsm = new ResultSetMapping();
        foreach ($cols as $key => $col) {
            $rsm->addScalarResult($col, $col, $types[$key]);
        }
        $reporte = $this->getDoctrine()->getManager()->createNativeQuery($cadena, $rsm)->getArrayResult();
        return $reporte;
    }

    /**
     * @Route("/pagar-mp/respuesta",name="pagar_mp_respuesta")
     */
    public function respuestaAction(Request $request)
    {
        if ($request->query->get('collection_id', null)) {
            $em = $this->getDoctrine()->getManager();
            $full_url = serialize($request->query->all());
            $logger = new PagoLogger();
            $logger->setRespuesta($full_url);
            $em->persist($logger);

            // $datos_mp = new DatosMercadoPago();
            $datos_mp = $this->getMercadoData();
            $this->setMercadoPago();

            $collection_id = $request->get('collection_id', '');
            $collection_status = $request->get('collection_status', '');
            $preference_id = $request->get('preference_id', '');
            $external_reference = $request->get('external_reference', '');
            $payment_type = $request->get('payment_type', '');
            $merchant_order_id = $request->get('merchant_order_id', '');
            $extRefArr = explode(';', $external_reference);
            $codeArr = explode('_', $extRefArr[0]);
            $preference = Preference::find_by_id($preference_id);
            $desc = $preference->items[0]->description;
            $code = end($codeArr);

            $compra = $this->getDoctrine()->getRepository('CarroiridianBundle:Compra')->find($code);

            $respuesta = new RepuestaPago();
            $respuesta->setReferenceCode($extRefArr[0]);
            $respuesta->setTXVALUE('');
            $respuesta->setTransactionState($collection_status);
            $respuesta->setSignature('');
            $respuesta->setReferencePol($preference_id);
            $respuesta->setCus('');
            $respuesta->setPseBank('');
            $respuesta->setLapPaymentMethod($payment_type);
            $respuesta->setTransactionId($merchant_order_id);
            $respuesta->setProcessingDate(date('Y-m-d H:i:s'));
            $respuesta->setTXADMINISTRATIVEFEE('');
            $respuesta->setDescription($desc);
            $respuesta->setCompra($compra);
            $respuesta->setTipo('RESPUESTA');
            $em->persist($respuesta);
            $em->flush();

            switch ($collection_status) {
                case "pending":
                    $estadoTx = "PENDIENTE";
                    break;
                case "approved":
                    $estadoTx = "APROBADA";
                    break;
                case "in_process":
                    $estadoTx = "PENDIENTE";
                    break;
                case "rejected":
                    $estadoTx = "RECHAZADA";
                    break;
                default:
                    $estadoTx = "ERROR";
                    break;
            }

            $estado = $this->getDoctrine()->getRepository('CarroiridianBundle:EstadoCarrito')->findOneBy(array('ref' => $estadoTx));
            // $compra->setEstado($estado);
            // $em->flush();

            return $this->render('MercadoPagoBundle:Default:respuesta.html.twig', array(
                'estadoTx' => $estadoTx, 'transactionId' => $merchant_order_id, 'reference_pol' => $preference_id, 'referenceCode' => $extRefArr[0], 'desc' => $desc, 'lapPaymentMethod' => $lapPaymentMethod
            ));
        } else {
            return $this->render('HomeBundle:Default:index.html.twig');
        }
    }

    public function SendMail($subject, $from, $to, $custom, $template)
    {
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

    public function SendMailHtml($subject, $from, $to, $html)
    {
        //$to = 'j.acero@orekaconsultores.com';
        $subject = $subject;

        $headers = 'From: Rosas Don Eloy <' . $from . '>' . "\r\n";
        $headers .= 'To: <' . $to . '>' . "\r\n";

        $headers .= 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";

        return mail($to, $subject, html_entity_decode($html), $headers);
    }

    /**
     * @Route("/pagar-mp/notification",name="pagar_mp_notification")
     */
    public function notificationAction(Request $request)
    {
        if (isset($_COOKIE['email_pago'])) {
            $code = $_COOKIE['email_pago'];
            $compra = $this->getDoctrine()->getRepository('CarroiridianBundle:Compra')->find($code);
            $factura  = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->findOneBy(array('compra' => $compra->getId()));
            $compraitems = $compra->getCompraitems();
            $to = $factura->getEmail();
            $name = $factura->getFullName();
            $qi = $this->get('qi');
            $asunto = $qi->getTextoDB('asunto_compra_aprobada');
            $sender = $qi->getSettingDB('sender');
            $r = $this->SendMailHtml($asunto, $sender, $to, $compra->getDescripcion());
            return new JsonResponse(['ok' => $r, 'to' => $to, 'sender' => $sender]);
        }
        $reqData = $request->query->all();
        if (!isset($reqData["id"]) || !ctype_digit($reqData["id"])) {
            return new Response('Request Error', Response::HTTP_BAD_REQUEST);
        } else {
            $em = $this->getDoctrine()->getManager();
            $full_url = serialize($reqData);
            $logger = new PagoLogger();
            $logger->setRespuesta($full_url);
            $em->persist($logger);

            $datos_mp = $this->getMercadoData();
            $this->setMercadoPago();

            $merchant_order = null;

            switch ($reqData["topic"]) {
                case "payment":
                    error_log("\nPayment request " . date('YmdHis') . ": ", 3, 'log_jimmy.log');
                    $payment = Payment::find_by_id($reqData["id"]);
                    // Get the payment and the corresponding merchant_order reported by the IPN.
                    $merchant_order = MerchantOrder::find_by_id($payment->order->id);
                    break;
                case "merchant_order":
                    error_log("\nMerchant order request " . date('YmdHis') . ": ", 3, 'log_jimmy.log');
                    $merchant_order = MerchantOrder::find_by_id($reqData["id"]);
                    break;
            }
            if ($merchant_order) {
                error_log("\nMerchant order: " . json_encode($merchant_order->toArray(), JSON_PRETTY_PRINT) . PHP_EOL, 3, 'log_jimmy.log');
                if ($payment) {
                    error_log("\nPayment: " . $payment->order->id . " " . json_encode($payment->toArray(), JSON_PRETTY_PRINT) . PHP_EOL, 3, 'log_jimmy.log');
                }
            } elseif ($payment) {
                error_log("\nPayment: " . $payment->order->id . " " . json_encode($payment->toArray(), JSON_PRETTY_PRINT) . PHP_EOL, 3, 'log_jimmy.log');
            }

            $cPayments = count($merchant_order->payments);

            $preference_id = $merchant_order->preference_id;
            $external_reference = $merchant_order->external_reference;
            $merchant_order_id = $merchant_order->id;
            $extRefArr = explode(';', $external_reference);
            $codeArr = explode('_', $extRefArr[0]);
            $preference = Preference::find_by_id($preference_id);
            $desc = $preference->items[0]->description;
            $code = end($codeArr);

            $compra = $this->getDoctrine()->getRepository('CarroiridianBundle:Compra')->find($code);

            if ($cPayments) {
                $lastPayment = end($merchant_order->payments);
                if (!isset($payment)) {
                    $payment = Payment::find_by_id($lastPayment->id);
                }

                $collection_status = $lastPayment->status;
                $payment_type = $payment->payment_type_id;

                $respuestas = $compra->getRespuestasPago();
                $confirmada = false;
                if ($respuestas) {
                    foreach ($respuestas as $respuesta) {
                        if ($respuesta->getTipo() == 'CONFIRMACION' && $respuesta->getTransactionState() == 'approved') {
                            $confirmada = true;
                            break;
                        }
                    }
                }

                $respuesta = new RepuestaPago();
                $respuesta->setReferenceCode($extRefArr[0]);
                $respuesta->setTXVALUE('' . $compra->getPrecio());
                $respuesta->setTransactionState($collection_status);
                $respuesta->setSignature('');
                $respuesta->setReferencePol($preference_id);
                $respuesta->setCus('');
                $respuesta->setPseBank('');
                $respuesta->setLapPaymentMethod($payment_type);
                $respuesta->setTransactionId($merchant_order_id);
                $respuesta->setProcessingDate(date('Y-m-d H:i:s'));
                $respuesta->setTXADMINISTRATIVEFEE('');
                $respuesta->setDescription($desc);
                $respuesta->setCompra($compra);
                $respuesta->setTipo('CONFIRMACION');
                $em->persist($respuesta);
                $em->flush();


                switch ($lastPayment->status) {
                    case 'approved':
                        $estadoTx = "APROBADA";
                        break;
                    case 'rejected':
                        $estadoTx = "RECHZADA";
                        break;
                    case 'cancelled':
                        $estadoTx = "RECHZADA";
                        break;
                    case 'refunded':
                        $estadoTx = "RECHZADA";
                        break;
                }




                if (($lastPayment->status == 'approved' && !$confirmada) || $datos_mp->getSandbox()) {
                    $factura  = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->findOneBy(array('compra' => $compra->getId()));
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

                    mail($to, $subject, html_entity_decode($compra->getDescripcion()), $headers);
                }
            } else {
                $estadoTx = "PENDIENTE";
            }
            $estado = $this->getDoctrine()->getRepository('CarroiridianBundle:EstadoCarrito')->findOneBy(array('ref' => $estadoTx));
            $compra->setEstado($estado);
            $em->flush();

            return new Response('Mercado Pago Ok', Response::HTTP_OK);
        }
    }

    /**
     * @Route("/pago-mp", name="pago_mp")
     */
    public function testRoute()
    {
        $this->setMercadoPago();
        // SDK::setAccessToken("ENV_ACCESS_TOKEN");

        $body = array(
            "json_data" => array(
                "site_id" => "MCO"
            )
        );

        $result = SDK::post('/users/test_user', $body);

        return new JsonResponse($result);
    }

    /**
     * Set Mercado Pago data
     *
     * @return void
     */
    private function setMercadoPago()
    {
        $mpData = $this->getMercadoData();

        SDK::configure([
            'CLIENT_ID' => $mpData->getClientID(),
            'CLIENT_SECRET' => $mpData->getClientSecret(),
            'sandbox_mode' => $mpData->getSandbox()
        ]);
    }

    /**
     * get Mercado Pago Data
     *
     * @return MercadoPagoBundle\Entity\DatosMercadoPago
     */
    private function getMercadoData()
    {
        if (!$this->mpData) {
            $this->mpData = $this->getDoctrine()->getRepository('MercadoPagoBundle:DatosMercadoPago')->find(1);
        }
        return $this->mpData;
    }

    private function createPreference($factura, $compra, $total, $desc, $host)
    {
        $code = $compra->getId();
        $mpData = $this->getMercadoData();
        $session = new Session();
        $escala_moneda = $session->get('escala_moneda', 1);
        $total = $total * $escala_moneda;
        // $mpData = new DatosMercadoPago();

        $preference = new Preference();
        $codeStr = (string)$code;
        # Create an item object
        $item = new Item();
        $item->title = "Orden Rosas Don Eloy " . (string)$codeStr;
        $item->quantity = 1;
        $item->currency_id = 'COP'; //$mpData->getCurrency();
        $item->unit_price = intval(round($total));
        $item->description = $desc;

        # Create a payer object
        $docType = '';
        switch ($factura->getTipodocumento()->getId()) {
            case 1:
                $docType = 'CC';
                break;
            case 3:
                $docType = 'NIT';
                break;
            case 6:
                $docType = 'CE';
                break;
            default:
                $docType = 'Otro';
                break;
        }
        $payer = new Payer();
        $payer->email = $factura->getEmail();
        $payer->name = $factura->getNombre();
        $payer->surname = $factura->getApellidos();
        $payer->identification = [
            "type" => $docType,
            "number" => $factura->getDocumento()
        ];

        # Setting preference properties
        $preference->items = array($item);
        $preference->payer = $payer;
        $preference->payment_methods = ["excluded_payment_types" => [['id' => 'ticket']]];
        $url = $host . $this->generateUrl('pagar_mp_respuesta');
        $preference->back_urls = [
            'success' => $url,
            'pending' => $url,
            'failure' => $url
        ];

        if ($factura->getPais() == 'Colombia' && $compra->getPrecio() <= 500000) {
            $preference->binary_mode = true;
        }

        $preference->auto_return = "all";
        $preference->external_reference = 'MP_RDE_' . $codeStr . ';';
        $preference->notification_url = $host . $this->generateUrl('pagar_mp_notification');
        //$preference->sponsor_id = $mpData->getSponsorID();
        $preference->processing_modes = [
            "gateway"
        ];
        # Save and posting preference
        $resp = $preference->save();
        if (!$resp) {
            var_dump($preference->Error());
            exit();
        } else {
            error_log("\nPreference: " . json_encode($preference->toArray(), JSON_PRETTY_PRINT) . PHP_EOL, 3, 'log_jimmy.log');
        }
        // var_dump($preference);
        // var_dump($resp);exit();

        return $preference;
    }

    /**
     * @Route("/g-p/{id}",name="get-payments")
     */
    public function getPayments($id)
    {
        //  Initiate curl
        $ch = curl_init();
        // Will return the response, if false it print the response
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        // Set the url
        curl_setopt($ch, CURLOPT_URL, 'https://api.mercadopago.com/v1/payments/search?access_token=APP_USR-1547867846118039-061015-2037bfb4cb0a3cb8e38e2c4ddffab9b7-118570928&external_reference=MP_RDE_' . $id . ';');
        // Execute
        $result = curl_exec($ch);
        // Closing
        curl_close($ch);
        $data = json_decode($result);
        return new JsonResponse($data);
    }

    /**
     * @Route("/mp-logs/{dateFrom}/{dateEnd}",defaults={"dateEnd": "none"},name="mp-show-logs")
     */
    public function payLogs($dateFrom, $dateEnd)
    {
        $dateEndCondition = $dateEnd == 'none' ? "" : " AND processingDate < '$dateEnd'";
        $query = "SELECT r.referenceCode as external_reference, r.processingDate as date, concat(f.nombre,concat(' ',f.apellidos)) as nombre, f.celular as telefono, tdoc.nombre_es as tipo_de_documento, f.documento, r.reference_pol as preference_id, r.transactionId as merchant_order_id, r.transactionState as state, r.lapPaymentMethod as payment_type, r.tipo as log_type, r.TX_VALUE as value FROM repuesta_pago as r INNER JOIN factura f ON(f.compra_id = r.compra_id) INNER JOIN tipo_documento tdoc ON(tdoc.id = f.tipodocumento_id) WHERE processingDate > '$dateFrom' $dateEndCondition";
        $result = $this->reporteNativoGen(['external_reference', 'date', 'nombre', 'telefono', 'tipo_de_documento', 'documento', 'preference_id', 'merchant_order_id', 'state', 'payment_type', 'log_type', 'value'], $query);
        return new JsonResponse($result);
    }

    /**
     * @Route("/g-pref/{id}",name="get-preference")
     */
    public function getPreference($id)
    {
        $datos_mp = $this->getMercadoData();
        $this->setMercadoPago();
        $pref = Preference::find_by_id($id);
        $data = $pref->toArray();
        return new JsonResponse($data);
    }

    /**
     * @Route("/get-shops/{dateFrom}/{dateEnd}/{excel}",defaults={"dateEnd": "none","excel": "0"},name="get-shops")
     */
    public function getShops($dateFrom, $dateEnd, $excel)
    {
        $dateCond = $dateEnd == 'none' ? " > '$dateFrom'" : " BETWEEN '$dateFrom' AND '$dateEnd'";
        $query = "SELECT compra.id as compra_id, factura.id as factura_id, concat(factura.nombre,concat(' ',factura.apellidos)) as nombre, factura.email as email, compra.precio as precio, estado_carrito.nombre as estado, compra.created_at as fecha FROM `compra` INNER JOIN factura on(factura.compra_id = compra.id) INNER JOIN estado_carrito on(estado_carrito.id = compra.eatadocarrito_id) WHERE compra.created_at $dateCond ORDER by compra.created_at asc";
        $result = $this->reporteNativoGenT(['compra_id', 'factura_id', 'nombre', 'email', 'precio', 'estado', 'fecha'], ['integer', 'integer', 'string', 'string', 'float', 'string', 'string'], $query);
        if ($excel == 1) {
            $dateEnd = $dateEnd == 'none' ? '' : $dateEnd;
            return $this->toCsv($result, ['compra_id', 'factura_id', 'nombre', 'email', 'precio', 'estado', 'fecha'], "Compras $dateFrom - $dateEnd");
        } else {
            return new JsonResponse($result);
        }
    }

    private function toCsv($data, $headings, $filename)
    {
        $newTab  = "\t";
        $newLine  = "\n";

        $fputcsv  =  count($headings) ? '"' . implode('"' . $newTab . '"', $headings) . '"' . $newLine : '';

        // Loop over the * to export
        if (!empty($data)) {
            foreach ($data as $row) {
                $fputcsv .= '"' . implode('"' . $newTab . '"', $row) . '"' . $newLine;
            }
        }

        //Convert CSV to UTF-16
        $encoded_csv = mb_convert_encoding($fputcsv, 'UTF-16LE', 'UTF-8');
        // var_dump($encoded_csv);exit;

        $response = new Response();
        $response->headers->set('Set-Cookie', 'fileDownload=true; path=/');
        $response->headers->set('Pragma', 'public');
        $response->headers->set('Expires', '0');
        $response->headers->set('Cache-Control', 'must-revalidate, post-check=0, pre-check=0');
        // $response->headers->set('Cache-Control', 'private');
        $response->headers->set('Content-type', 'application/octet-stream');
        $response->headers->set('Content-Disposition', 'attachment; filename="' . basename($filename) . '".csv;');
        $response->headers->set('Content-Transfer-Encoding', 'binary');
        $response->headers->set('Content-length', strlen($encoded_csv));
        $response->sendHeaders();

        $response->setContent(chr(255) . chr(254) . $encoded_csv);
        return $response;
    }

    /**
     * @Route("/pagar-mp/confirmacion",name="pagar_mp_confirmacion")
     */
    public function confirmacionAction(Request $request)
    {
        $reqData = $request->query->all();
        if (isset($reqData)) {
            $collection_id          =   '';
            $collection_status      =   '';
            $payment_id             =   '';
            $status                 =   '';
            $external_reference     =   '';
            $payment_type           =   '';
            $merchant_order_id      =   '';
            $preference_id          =   '';
            $site_id                =   '';
            $processing_mode        =   '';
            $merchant_account_id    =   '';

            foreach ($reqData as $key => $rs) {
                switch ($key) {
                    case 'collection_id':
                        $collection_id          = $rs;
                        break;
                    case 'collection_status':
                        $collection_status      = $rs;
                        break;
                    case 'payment_id':
                        $payment_id             = $rs;
                        break;
                    case 'status':
                        $status                 = $rs;
                        break;
                    case 'external_reference':
                        $external_reference     = $rs;
                        break;
                    case 'payment_type':
                        $payment_type           = $rs;
                        break;
                    case 'merchant_order_id':
                        $merchant_order_id      = $rs;
                        break;
                    case 'preference_id':
                        $preference_id          = $rs;
                        break;
                    case 'site_id':
                        $site_id                = $rs;
                        break;
                    case 'processing_mode':
                        $processing_mode        = $rs;
                        break;
                    case 'merchant_account_id':
                        $merchant_account_id    = $rs;
                        break;
                }
            }
            $code = end(explode('_', $external_reference));
            $compra = $this->getDoctrine()->getRepository('CarroiridianBundle:Compra')->find($code);
            $factura  = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->findOneBy(array('compra' => $compra->getId()));

            $em = $this->getDoctrine()->getManager();
            $full_url = serialize($reqData);
            $logger = new PagoLogger();
            $logger->setRespuesta($full_url);
            $em->persist($logger);

            $datos_mp = $this->getMercadoData();

            $mp  = $this->getDoctrine()->getRepository('MercadoPagoBundle:DatosMercadoPago')->findOneBy(array('id' => 1));

            $this->setMercadoPago();

            $merchant_order = null;

            $respuestas = $compra->getRespuestasPago();
            $confirmada = false;
            if ($respuestas) {
                foreach ($respuestas as $respuesta) {
                    print_r($respuesta->getTipo());
                    if ($respuesta->getTipo() == 'CONFIRMACION' && $respuesta->getTransactionState() == 'approved') {
                        $confirmada = true;
                        break;
                    }
                }
            }

            $respuesta = new RepuestaPago();
            $respuesta->setReferenceCode($external_reference);
            $respuesta->setTXVALUE('' . $compra->getPrecio());
            $respuesta->setTransactionState($status);
            $respuesta->setSignature('');
            $respuesta->setReferencePol($preference_id);
            $respuesta->setCus('');
            $respuesta->setPseBank('');
            $respuesta->setLapPaymentMethod($payment_type);
            $respuesta->setTransactionId($merchant_order_id);
            $respuesta->setProcessingDate(date('Y-m-d H:i:s'));
            $respuesta->setTXADMINISTRATIVEFEE('');
            $respuesta->setDescription('Compra Rosas Don Eloy');
            $respuesta->setCompra($compra);
            $respuesta->setTipo(($status == 'approved' ? 'CONFIRMACION' : 'RESPUESTA'));
            $em->persist($respuesta);
            $em->flush();
            $mens = ' ';
            switch ($status) {
                case 'approved':
                    $estadoTx = "APROBADA";
                    $estado_email = 'Tu compra ha sido aprobada';
                    break;
                case 'rejected':
                    $estadoTx = "RECHZADA";
                    $estado_email = 'Tu compra ha sido rechazada';
                    break;
                case 'pending':
                    $estadoTx = "PENDIENTE";
                    $estado_email = 'Tu compra se encuentra pendiente';
                    break;
                case 'cancelled':
                    $estadoTx = "RECHZADA";
                    $estado_email = 'Tu compra ha sido rechazada';
                    break;
                case 'refunded':
                    $estadoTx = "RECHZADA";
                    $estado_email = 'Tu compra ha sido rechazada';
                    break;
                default:
                    $estadoTx = "RECHZADA";
                    $estado_email = 'Tu compra ha sido rechazada';
                    break;
            }
            /** @var  $em EntityManager*/
            $em = $this->getDoctrine()->getManager();
            $compra = $this->getDoctrine()->getRepository('CarroiridianBundle:Compra')->find($code);

            $statusCompra = strpos($compra->getDescripcion(), 'Tu compra se encuentra pendiente');
            if ($statusCompra === false) {
                $html = str_replace('Tu compra ha sido aprobada', $estado_email, $compra->getDescripcion());
            } else {
                $html = str_replace('Tu compra se encuentra pendiente', $estado_email, $compra->getDescripcion());
            }
            $query = "update compra set descripcion = '" . $html . "' where id = " . $code;
            $db = $em->getConnection();
            $stmt = $db->prepare($query);
            $params = array();
            $stmt->execute($params);

            if ($status == 'approved' || $status == 'pending') {
                $factura  = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->findOneBy(array('compra' => $compra->getId()));
                $compraitems = $compra->getCompraitems();
                $to = $factura->getEmail();
                $name = $factura->getFullName();
                $qi = $this->get('qi');
                $asunto = 'asunto_compra_' . ($status == 'approved' ? 'aprobada' : 'pendiente') . ' (' . $compra->getId() . ')';
                $sender = $qi->getSettingDB('sender');
                $validateSend2 = $this->SendMailHtml($asunto, $sender, $to, $compra->getDescripcion());
                $this->logEmailSend($compra->getId(), $to, $validateSend2);
                $subject = $asunto;
                $headers = 'From: Rosas Don Eloy <contacto@rosasdoneloy.com>' . "\r\n";
                $headers .= 'To: <internet@rosasdoneloy.com>' . "\r\n";
                //$headers .= 'Bcc: abarbosa@outlook.es' . "\r\n";
                $headers .= 'MIME-Version: 1.0' . "\r\n";
                $headers .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";
                $descriptionToSend = $compra->getDescripcion();
                if (substr($descriptionToSend, -7, 1) == '1') {
                    $descriptionToSend = '<h2 style="color: #4A7689;font-family: Helvetica">Alerta SAP</h2><p style="color: #4A7689;font-family: Helvetica">Esta compra se realizó sin poder revisar el inventario en SAP.</p><br>' . $descriptionToSend;
                }
                $validateSend = mail('internet@rosasdoneloy.com', $subject, html_entity_decode($descriptionToSend), $headers);
                $this->logEmailSend($compra->getId(), $to, $validateSend);

                $em->flush();
                $estado = $this->getDoctrine()->getRepository('CarroiridianBundle:EstadoCarrito')->findOneBy(array('ref' => $estadoTx));
                $compra->setEstado($estado);
                $em->flush();
                return $this->render('HomeBundle:Default:index.html.twig');
            } else {
                $factura  = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->findOneBy(array('compra' => $compra->getId()));
                $compraitems = $compra->getCompraitems();
                $to = $factura->getEmail();
                $name = $factura->getFullName();
                $qi = $this->get('qi');
                $asunto = 'asunto_compra_rechazada (' . $compra->getId() . ')';
                $sender = $qi->getSettingDB('sender');
                $validateSend2 = $this->SendMailHtml($asunto, $sender, $to, $compra->getDescripcion());
                $this->logEmailSend($compra->getId(), $to, $validateSend2);
                $subject = $asunto;
                $headers = 'From: Rosas Don Eloy <contacto@rosasdoneloy.com>' . "\r\n";
                $headers .= 'To: <internet@rosasdoneloy.com>' . "\r\n";
                //$headers .= 'Bcc: abarbosa@outlook.es' . "\r\n";
                $headers .= 'MIME-Version: 1.0' . "\r\n";
                $headers .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";
                $descriptionToSend = $compra->getDescripcion();
                if (substr($descriptionToSend, -7, 1) == '1') {
                    $descriptionToSend = '<h2 style="color: #4A7689;font-family: Helvetica">Alerta SAP</h2><p style="color: #4A7689;font-family: Helvetica">Esta compra se realizó sin poder revisar el inventario en SAP.</p><br>' . $descriptionToSend;
                }
                $validateSend = mail('internet@rosasdoneloy.com', $subject, html_entity_decode($descriptionToSend), $headers);
                $this->logEmailSend($compra->getId(), $to, $validateSend);

                $em->flush();
                $estado = $this->getDoctrine()->getRepository('CarroiridianBundle:EstadoCarrito')->findOneBy(array('ref' => $estadoTx));
                $compra->setEstado($estado);
                $em->flush();
                return $this->render('PagosPayuBundle:Default:respuesta.html.twig', array(
                    'estadoTx' => $estadoTx, 'transactionId' => $merchant_order_id, 'reference_pol' => $preference_id, 'referenceCode' => $external_reference,
                    'pseBank' => '', 'cus' => '', 'TX_VALUE' => $compra->getPrecio(),
                    'currency' => 'COP', 'lapPaymentMethod' => ''
                ));
            }
        } else {
            return new Response('Request Error', Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * @Route("/pagar-mp/updateconfirmacion",name="pagar_mp_updateconfirmacion")
     */
    public function updateconfirmacionAction(Request $request)
    {
        $query = "SELECT factura, compra_id, fecha_creacion, hour_dif, estado, referenceCode  FROM vw_update_mp limit 1";
        $result = $this->reporteNativoGen(['factura', 'compra_id', 'fecha_creacion', 'hour_dif', 'estado', 'referenceCode'], $query);
        foreach ($result as $key => $rs) {
            //if($rs['compra_id']=='52768'){
            $id = 'Test_DE_' . $rs['compra_id'];
            $fcreacion = $rs['hour_dif'];
            $idStatus = $rs['estado'];
            $reference_code = $rs['referenceCode'];
            //}
        }

        /*$id = 'Test_DE_' . '53035';
        $fcreacion = 2;
        $idStatus = 1;
        $reference_code = null;*/

        //$id = 'Test_DE_52738';
        $collection_id          =   '';
        $collection_status      =   '';
        $payment_id             =   '';
        $status                 =   '';
        $external_reference     =   '';
        $payment_type           =   '';
        $merchant_order_id      =   '';
        $preference_id          =   '';
        $site_id                =   '';
        $processing_mode        =   '';
        $merchant_account_id    =   '';

        $curl = curl_init();
        curl_setopt_array(
            $curl,
            array(
                CURLOPT_URL => "https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc&external_reference=" . $id,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 60,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "GET",
                CURLOPT_HTTPHEADER => array(
                    "accept: application/json",
                    "content-type: application/json",
                    "Authorization: Bearer " . $this->access_token
                ),
            )
        );
        $response = curl_exec($curl);
        if (empty(json_decode($response)->results[0])) {
            if ($fcreacion > 3) {
                $em = $this->getDoctrine()->getManager();
                $code = end(explode('_', $id));
                $compra = $this->getDoctrine()->getRepository('CarroiridianBundle:Compra')->find($code);
                $estado = $this->getDoctrine()->getRepository('CarroiridianBundle:EstadoCarrito')->findOneBy(array('ref' => 'EXPIRADA'));
                $compra->setEstado($estado);
                $em->flush();
            }
            return new jsonResponse([
                'status'    => 'warning',
                'msg'       => 'La referencia de compra ' . $id . ' no existe en Mercado Pago',
            ]);
        }
        $err = curl_error($curl);
        if ($err) {
            return new jsonResponse([
                'status'    => 'error',
                'msg'       => 'La solicitud de pago no fue procesada',
                'response'  =>  json_encode($err)
            ]);
        } else {
            if (isset(json_decode($response)->results[0])) {
                $mercado_pago = [];
                foreach (get_object_vars(json_decode($response)->results[0]) as $key => $value) {
                    switch ($key) {
                        case 'merchant_account_id':
                            $mercado_pago['merchant_account_id'] = $value;
                            break;
                        case 'external_reference':
                            $mercado_pago['external_reference'] = $value;
                            break;
                        case 'processing_mode':
                            $mercado_pago['processing_mode'] = $value;
                            break;
                        case 'id':
                            $mercado_pago['collection_id'] = $value;
                            $mercado_pago['payment_id'] = $value;
                            break;
                        case 'status':
                            $mercado_pago['status'] = $value;
                            $mercado_pago['collection_status'] = $value;
                            break;
                        case 'payment_type_id':
                            $mercado_pago['payment_type'] = $value;
                            break;
                        case 'order':
                            $mercado_pago['merchant_order_id'] = $value->id;
                            break;
                    }
                }
                $mercado_pago['site_id'] = 'MCO';
                $mercado_pago['preference_id'] = '';

                foreach ($mercado_pago as $key => $rs) {
                    switch ($key) {
                        case 'collection_id':
                            $collection_id          = $rs;
                            break;
                        case 'collection_status':
                            $collection_status      = $rs;
                            break;
                        case 'payment_id':
                            $payment_id             = $rs;
                            break;
                        case 'status':
                            $status                 = $rs;
                            break;
                        case 'external_reference':
                            $external_reference     = $rs;
                            break;
                        case 'payment_type':
                            $payment_type           = $rs;
                            break;
                        case 'merchant_order_id':
                            $merchant_order_id      = $rs;
                            break;
                        case 'preference_id':
                            $preference_id          = $rs;
                            break;
                        case 'site_id':
                            $site_id                = $rs;
                            break;
                        case 'processing_mode':
                            $processing_mode        = $rs;
                            break;
                        case 'merchant_account_id':
                            $merchant_account_id    = $rs;
                            break;
                    }
                }
                switch ($status) {
                    case 'approved':
                        $estadoTx = "APROBADA";
                        $estado_email = 'Tu compra ha sido aprobada';
                        break;
                    case 'rejected':
                        $estadoTx = "RECHZADA";
                        $estado_email = 'Tu compra ha sido rechazada';
                        break;
                    case 'pending':
                        $estadoTx = "PENDIENTE";
                        $estado_email = 'Tu compra se encuentra pendiente';
                        break;
                    case 'cancelled':
                        $estadoTx = "RECHZADA";
                        $estado_email = 'Tu compra ha sido rechazada';
                        break;
                    case 'refunded':
                        $estadoTx = "RECHZADA";
                        $estado_email = 'Tu compra ha sido rechazada';
                        break;
                    default:
                        $estadoTx = "RECHZADA";
                        $estado_email = 'Tu compra ha sido rechazada';
                        break;
                }
                $code = end(explode('_', $external_reference));
                if ($idStatus != 1) {
                    if ($reference_code !== null) {
                        /** @var  $em EntityManager*/
                        $em = $this->getDoctrine()->getManager();
                        $estado = $this->getDoctrine()->getRepository('CarroiridianBundle:EstadoCarrito')->findOneBy(array('ref' => $estadoTx));
                        $compra = $this->getDoctrine()->getRepository('CarroiridianBundle:Compra')->find($code);
                        $compra->setEstado($estado);
                        $em->flush();
                        if ($status == 'approved') {
                            $query = "update repuesta_pago set tipo='CONFIRMACION',transactionState = '" . $status . "' where compra_id = " . $code;
                        } else {
                            $query = "update repuesta_pago set transactionState = '" . $status . "' where compra_id = " . $code;
                        }
                        $db = $em->getConnection();
                        $stmt = $db->prepare($query);
                        $params = array();
                        $stmt->execute($params);
                        return new jsonResponse(json_encode([
                            'status'        => 'success',
                            'msg'           => 'Registro actualizado',
                            'id'            => $external_reference
                        ]));
                    }
                }

                /** @var  $em EntityManager*/
                $em = $this->getDoctrine()->getManager();
                $compra = $this->getDoctrine()->getRepository('CarroiridianBundle:Compra')->find($code);
                $statusCompra = strpos($compra->getDescripcion(), 'Tu compra se encuentra pendiente');
                if ($statusCompra === false) {
                    $html = str_replace('Tu compra ha sido aprobada', $estado_email, $compra->getDescripcion());
                } else {
                    $html = str_replace('Tu compra se encuentra pendiente', $estado_email, $compra->getDescripcion());
                }
                $query = "update compra set descripcion = '" . $html . "' where id = " . $code;
                $db = $em->getConnection();
                $stmt = $db->prepare($query);
                $params = array();
                $stmt->execute($params);

                $factura  = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->findOneBy(array('compra' => $compra->getId()));
                $em = $this->getDoctrine()->getManager();
                $full_url = serialize($mercado_pago);
                $logger = new PagoLogger();
                $logger->setRespuesta($full_url);
                $em->persist($logger);
                $datos_mp = $this->getMercadoData();
                $mp  = $this->getDoctrine()->getRepository('MercadoPagoBundle:DatosMercadoPago')->findOneBy(array('id' => 1));
                $this->setMercadoPago();
                $merchant_order = null;
                $respuestas = $compra->getRespuestasPago();
                $confirmada = false;
                if ($respuestas) {
                    foreach ($respuestas as $respuesta) {
                        if ($respuesta->getTipo() == 'CONFIRMACION' && $respuesta->getTransactionState() == 'approved') {
                            $confirmada = true;
                            break;
                        }
                    }
                }

                $query = "SELECT compra_id FROM repuesta_pago WHERE compra_id =" . $compra->getId() . " limit 1";
                $resultExists = $this->reporteNativoGen(['compra_id'], $query);

                if ($reference_code === null && !$resultExists) {
                    $respuesta = new RepuestaPago();
                    $respuesta->setReferenceCode($external_reference);
                    $respuesta->setTXVALUE('' . $compra->getPrecio());
                    $respuesta->setTransactionState($status);
                    $respuesta->setSignature('');
                    $respuesta->setReferencePol($preference_id);
                    $respuesta->setCus('');
                    $respuesta->setPseBank('');
                    $respuesta->setLapPaymentMethod($payment_type);
                    $respuesta->setTransactionId($merchant_order_id);
                    $respuesta->setProcessingDate(date('Y-m-d H:i:s'));
                    $respuesta->setTXADMINISTRATIVEFEE('');
                    $respuesta->setDescription('Compra Rosas Don Eloy');
                    $respuesta->setCompra($compra);
                    $respuesta->setTipo(($status == 'approved' ? 'CONFIRMACION' : 'RESPUESTA'));
                    $em->persist($respuesta);
                    $em->flush();
                    $mens = ' ';
                }
                if ($status == 'approved' || $status == 'pending') {
                    $factura  = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->findOneBy(array('compra' => $compra->getId()));
                    $compraitems = $compra->getCompraitems();
                    $to = $factura->getEmail();
                    $name = $factura->getFullName();
                    $qi = $this->get('qi');
                    $asunto = 'asunto_compra_' . ($status == 'approved' ? 'aprobada' : 'pendiente') . ' (' . $compra->getId() . ')';
                    $sender = $qi->getSettingDB('sender');
                    $validateSend2 = $this->SendMailHtml($asunto, $sender, $to, $compra->getDescripcion());

                    $subject = $asunto;
                    $headers = 'From: Rosas Don Eloy <contacto@rosasdoneloy.com>' . "\r\n";
                    $headers .= 'To: <internet@rosasdoneloy.com>' . "\r\n";
                    //$headers .= 'Bcc: abarbosa@outlook.es' . "\r\n";
                    $headers .= 'MIME-Version: 1.0' . "\r\n";
                    $headers .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";
                    $descriptionToSend = $compra->getDescripcion();
                    if (substr($descriptionToSend, -7, 1) == '1') {
                        $descriptionToSend = '<h2 style="color: #4A7689;font-family: Helvetica">Alerta SAP</h2><p style="color: #4A7689;font-family: Helvetica">Esta compra se realizó sin poder revisar el inventario en SAP.</p><br>' . $descriptionToSend;
                    }
                    $validateSend = mail('internet@rosasdoneloy.com', $subject, html_entity_decode($descriptionToSend), $headers);
                    $this->logEmailSend($compra->getId(), $to, $validateSend);

                    $em->flush();
                    $estado = $this->getDoctrine()->getRepository('CarroiridianBundle:EstadoCarrito')->findOneBy(array('ref' => $estadoTx));
                    $compra->setEstado($estado);
                    $em->flush();

                    return new jsonResponse(json_encode([
                        'status'        => 'success',
                        'msg'           => 'Compra aprobada',
                        'id'            => $external_reference
                    ]));
                } else {
                    $factura  = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->findOneBy(array('compra' => $compra->getId()));
                    $compraitems = $compra->getCompraitems();
                    $to = $factura->getEmail();
                    $name = $factura->getFullName();
                    $qi = $this->get('qi');
                    $asunto = 'asunto_compra_rechazada (' . $compra->getId() . ')';
                    $sender = $qi->getSettingDB('sender');
                    $validateSend2 = $this->SendMailHtml($asunto, $sender, $to, $compra->getDescripcion());
                    $this->logEmailSend($compra->getId(), $to, $validateSend2);
                    $subject = $asunto;
                    $headers = 'From: Rosas Don Eloy <contacto@rosasdoneloy.com>' . "\r\n";
                    $headers .= 'To: <internet@rosasdoneloy.com>' . "\r\n";
                    //$headers .= 'Bcc: abarbosa@outlook.es' . "\r\n";
                    $headers .= 'MIME-Version: 1.0' . "\r\n";
                    $headers .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";
                    $descriptionToSend = $compra->getDescripcion();
                    if (substr($descriptionToSend, -7, 1) == '1') {
                        $descriptionToSend = '<h2 style="color: #4A7689;font-family: Helvetica">Alerta SAP</h2><p style="color: #4A7689;font-family: Helvetica">Esta compra se realizó sin poder revisar el inventario en SAP.</p><br>' . $descriptionToSend;
                    }
                    $validateSend = mail('internet@rosasdoneloy.com', $subject, html_entity_decode($descriptionToSend), $headers);
                    $this->logEmailSend($compra->getId(), $to, $validateSend);
                    $em->flush();
                    $estado = $this->getDoctrine()->getRepository('CarroiridianBundle:EstadoCarrito')->findOneBy(array('ref' => $estadoTx));
                    $compra->setEstado($estado);
                    $em->flush();
                    return new jsonResponse(json_encode([
                        'status'        => 'warning',
                        'msg'           => 'Compra rechazada',
                        'id'            => $external_reference
                    ]));
                }
            }
        }
    }
    public function logEmailSend($compra_id, $to, $status)
    {
        /** @var  $em EntityManager*/
        $em = $this->getDoctrine()->getManager();
        if ($status) {
            try {
                $insert = "INSERT INTO log_email VALUES (default," . $compra_id . ",'" . $to . "','Email enviado','" . date("Y-m-d H:i:s") . "',null);";
                $statement = $em->getConnection()->prepare($insert);
                $statement->execute();
            } catch (\Throwable $th) {
                $insert = "INSERT INTO log_email VALUES (default," . $compra_id . ",'" . $to . "','" . $th->getMessage() . "','" . date("Y-m-d H:i:s") . "',null);";
                $statement = $em->getConnection()->prepare($insert);
                $statement->execute();
            }
        } else {
            try {
                $insert = "INSERT INTO log_email VALUES (default," . $compra_id . ",'" . $to . "','Email no enviado','" . date("Y-m-d H:i:s") . "',null);";
                $statement = $em->getConnection()->prepare($insert);
                $statement->execute();
            } catch (\Throwable $th) {
                $insert = "INSERT INTO log_email VALUES (default," . $compra_id . ",'" . $to . "','" . $th->getMessage() . "','" . date("Y-m-d H:i:s") . "',null);";
                $statement = $em->getConnection()->prepare($insert);
                $statement->execute();
            }
        }
        return true;
    }
}

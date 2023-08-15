<?php

namespace CarroiridianBundle\Controller;


use CarroiridianBundle\Entity\Compra;
use CarroiridianBundle\Entity\Compraitem;
use CarroiridianBundle\Entity\Entrada;
use CarroiridianBundle\Entity\Factura;
use CarroiridianBundle\Entity\PagoLogger;
use CarroiridianBundle\Entity\Producto;
use CarroiridianBundle\Entity\Talla;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\Query\ResultSetMapping;

use AppBundle\Entity\User;
use CarroiridianBundle\Entity\Calificacion;
use CarroiridianBundle\Entity\Envio;
use CarroiridianBundle\Entity\Bono;
use CarroiridianBundle\Entity\Color;
use CarroiridianBundle\Form\Type\BonoType;
use CarroiridianBundle\Form\Type\EnvioType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Encoder\JsonEncode;

date_default_timezone_set('America/Bogota');
class AjaxController extends Controller
{
    // private $access_token = 'TEST-1678029048874133-092911-fefd4d611734292630e8d8650d5aa373-52130685';
    // private $public_key = 'TEST-205c2632-d94a-45f4-a521-e7776874340e';
    private $access_token = 'APP_USR-1547867846118039-061015-2037bfb4cb0a3cb8e38e2c4ddffab9b7-118570928';
    private $public_key = 'APP_USR-5436d972-376d-43a0-82e7-aad9da56f685';
    private $cliente_id = 1547867846118039;

    /**
     * @Route("/mercado-pago-carrito", name="mercado_pago_carrito")
     */
    public function mercadoPagoAction(Request $request)
    {
        $session = $request->getSession();
        $id_compra = $session->get('id_compra');

        if (!empty($id_compra)) {
            $cols = ['factura', 'id_comprador', 'envio_id', 'compra_id', 'fecha_creacion', 'total_con_iva', 'iva', 'departamento_id', 'departamento', 'ciudad_id', 'ciudad', 'pais_id', 'pais', 'nombre', 'apellidos', 'direccion', 'documento', 'email', 'celular'];
            $data_invoice = $this->reporteNativoGen($cols, "SELECT factura, id_comprador, envio_id, compra_id, fecha_creacion, total_con_iva, iva, departamento_id, departamento, ciudad_id, ciudad, pais_id, pais, nombre, apellidos, direccion, documento, email, celular FROM vw_datos_mp WHERE compra_id=" . $session->get('id_compra') . " limit 1");
            if ($data_invoice) {
                foreach ($data_invoice as $key => $rs) {
                    $data_mp = $rs;
                }

                $response = $this->btnMercadoPago($data_mp);
                if ($response == 'success') {
                    $session->set('carrito', array());
                    $session->set('bonos', array());
                    $session->set('descuento', array());
                    $session->set('dedicatoria', null);
                    $session->set('envio', null);
                    $session->set('factura', null);
                }

                return new JsonResponse($this->btnMercadoPago($data_mp));
            } else {
                return new JsonResponse([
                    'status'    => 'error',
                    'msg'       => 'La solicitud de pago no fue procesada',
                    'idCompra'  =>  $id_compra
                ]);
            }
        } else {
            $factura = $session->get('factura');
            if ($factura == null)
                return $this->redirect($this->generateUrl('carrito'));
            $factura = $this->getDoctrine()->getRepository('CarroiridianBundle:Factura')->find($factura->getId());
            $carrito = $session->get('carrito', array());
            $envio = $session->get('envio', null);
            $rosa = $session->get('rosa', null);

            $estado = $this->getDoctrine()->getRepository('CarroiridianBundle:EstadoCarrito')->findOneBy(array('ref' => 'INICIADA_EN_WEB'));
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
                "IDDB"      =>  10000101,
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
            //$descripcion='';

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

            $client = new \nusoap_client('http://45.163.28.59:13027/SIC.asmx?WSDL', true);
            $full_array = array_merge($AdminInfo, $Documents, $Document_Lines);
            $factura->setRequest($full_array);


            $response = $client->call('Document_marketing', $full_array);
            if (strpos($response['Document_marketingResult'], 'success') !== false) {
                $temp = explode(";", explode(" ", $response['Document_marketingResult'])[1]);
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


            if ($session->get('sap_down', false)) {
                $descripcion .= '<span style="display:none;">1<span>';
            } else {
                $descripcion .= '<span style="display:none;">0<span>';
            }

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
            $session->set('id_compra', $compra->getId());
            $total = number_format($total, 2, '.', '');
            //echo $datos_payu->getApiKey().'~'.$datos_payu->getMerchantId().'~'.$referenceCode.'~'.$total.'~'.$session->get('moneda','COP');
            $firma = md5($datos_payu->getApiKey() . '~' . $datos_payu->getMerchantId() . '~' . $referenceCode . '~' . $total . '~' . $session->get('moneda', 'COP'));
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
            /**/
            $cols = ['factura', 'id_comprador', 'envio_id', 'compra_id', 'fecha_creacion', 'total_con_iva', 'iva', 'departamento_id', 'departamento', 'ciudad_id', 'ciudad', 'pais_id', 'pais', 'nombre', 'apellidos', 'direccion', 'documento', 'email', 'celular'];
            $data_invoice = $this->reporteNativoGen($cols, "SELECT factura, id_comprador, envio_id, compra_id, fecha_creacion, total_con_iva, iva, departamento_id, departamento, ciudad_id, ciudad, pais_id, pais, nombre, apellidos, direccion, documento, email, celular FROM vw_datos_mp WHERE compra_id=" . $compra->getId() . " limit 1");
            foreach ($data_invoice as $key => $rs) {
                $data_mp = $rs;
            }
            return new JsonResponse($this->btnMercadoPago($data_mp));
        }
    }

    public function btnMercadoPago($data_mp = [])
    {
        /**$data_mp arreglo */
        //$pago = '$952,999.51';
        $value = intVal(round(floatVal(str_replace(',', '', str_replace('$', '', $data_mp['total_con_iva'])))));
        $jsonReference = [
            "external_reference" => 'Test_DE_' . $data_mp['compra_id'],
            "items" => [[
                "id"            => $data_mp['compra_id'],
                "title"         => "Compra Rosas Don Eloy",
                "currency_id"   => "COP",
                "description"   => "Compra Rosas Don Eloy",
                "quantity"      => 1,
                "unit_price"    => $value //number_format($value,2,'.', ''),
            ]],
            "back_urls" => [
                "success" => "https://www.rosasdoneloy.com/pagar-mp/confirmacion",
                "failure" => "https://www.rosasdoneloy.com/",
                "pending" => "https://www.rosasdoneloy.com/"
            ],
            "payer"=> [[
                "email"=> $data_mp['email']
            ]],            
            "issuer_id"=> $this->cliente_id,            
            "auto_return"   => "approved",
            "binary_mode"   => false,
            "payment_methods" => [
                "excluded_payment_methods" => [
                    [
                        "id" => "efecty"
                    ]
                ]
            ],
            "taxes" => [
                [
                    "type" => "IVA",
                    "value" => 19
                ]
            ]
        ];

        $curl = curl_init();
        curl_setopt_array(
            $curl,
            array(
                CURLOPT_URL => "https://api.mercadopago.com/checkout/preferences",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 60,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => json_encode($jsonReference),
                CURLOPT_HTTPHEADER => array(
                    "accept: application/json",
                    "content-type: application/json",
                    "Authorization: Bearer " . $this->access_token
                ),
            )
        );
        $response = curl_exec($curl);
        $err = curl_error($curl);
        if ($err) {
            return [
                'status'    => 'error',
                'msg'       => 'La solicitud de pago no fue procesada',
                'response'  =>  $err
            ];
        } else {
            return [
                'status'        => 'success',
                'msg'           => 'Procesado correctamente',
                'response'      =>  json_decode($response),
                'public_key'    =>  $this->public_key
            ];
        }
    }

    public function reporteNativoGen($cols, $cadena)
    {
        $rsm = new ResultSetMapping();
        foreach ($cols as $col) {
            $rsm->addScalarResult($col, $col, 'string');
        }
        $reporte = $this->getDoctrine()->getManager()->createNativeQuery($cadena, $rsm)->getArrayResult();
        return $reporte;
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

    /**
     * @Route("/clean-carrito", name="clean_carrito")
     */
    public function cleanCarritoAction()
    {
        $session = new Session();
        $session->set('carrito', array());
        $session->set('rosa', false);

        return new JsonResponse(array("cantidad" => 0));
    }

    /**
     * @Route("/add-carrito/{id}/{cant}", name="add_carrito")
     */
    public function addCarritoAction($id, $cant)
    {
        $session = new Session();

        $carrito = $session->get('carrito', array());

        $repo = $this->getDoctrine()->getRepository('CarritoBundle:Producto');
        $producto = $repo->find($id);

        try {
            if (array_key_exists($producto->getId(), $carrito))
                $prod_carrito = $carrito[$producto->getId()]["cantidad"];
            else
                $prod_carrito = 0;
        } catch (Exception $e) {
            $prod_carrito = 0;
        }

        if (!is_numeric($prod_carrito))
            $prod_carrito = 0;
        $prod_carrito += $cant;
        if ($prod_carrito < 0)
            $prod_carrito = 0;
        $carrito[$producto->getId()] = array("cantidad" => $prod_carrito, "nombre" => $producto->getNombreEs(), "precio" => $producto->getPrecio());
        if ($prod_carrito < 1) {
            unset($carrito[$producto->getId()]);
        }


        $session->set('carrito', $carrito);

        return new JsonResponse(array("cantidad" => $prod_carrito));
    }

    /**
     * @Route("/add-plan/{id}/{size}/{dur_id}/{cant}/{flor_id}/{florero_id}/{date}", name="add_plan")
     */
    public function addPlanAction(Request $request, $id, $size, $dur_id, $cant, $flor_id, $florero_id, $date)
    {
        $session = new Session();

        $carrito = $session->get('carrito', array());
        $precioPlan = $this->getDoctrine()->getRepository('CarroiridianBundle:PrecioPlan')->findBy([
            'tamano' => $size,
            'plan'   => $id
        ]);
        $precioPlan = $precioPlan[0];

        $duracion = $this->getDoctrine()->getRepository('CarroiridianBundle:Duracion')->find($dur_id);
        $dias = $duracion->getDias();

        $entregasMes = floor(30 / $dias);

        switch ($cant) {
            case 1:
                $meses = 3;
                break;
            case 2:
                $meses = 6;
                break;
            case 3:
                $meses = 12;
                break;
        }

        // $meses = $cant / $entregasMes;
        $cant = $meses * $entregasMes;
        $precioMes = $precioPlan->{'getPrecio' . $entregasMes}();
        $precio = $precioMes * $meses;
        $now = new \DateTime();
        $mes = intval($now->format('m'));
        if ($month + $meses > 12) {
            $primerasEntregas = 12 - $month;
            $segundasEntregas = $meses - $primerasEntregas;
            $aumentoSegundasEntregas = 1.07;
            $precio = ($primerasEntregas * $entregasMes * $precioMes) + ($segundasEntregas * $entregasMes * $precioMes * $aumentoSegundasEntregas);
        }

        $descuento = 0;

        if ($cant >= $precioPlan->getEntregasDescuento1() && $cant < $precioPlan->getEntregasDescuento2()) {
            $descuento = $precioPlan->getDescuento1();
        } elseif ($cant >= $precioPlan->getEntregasDescuento2()) {
            $descuento = $precioPlan->getDescuento2();
        }

        $repo = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto');
        $producto = $repo->find($id);

        $entregasTxt = '';
        $qi = $this->get('qi');
        switch ($meses) {
            case 3:
                $entregasTxt = $qi->getTextoDB('plan_trimestral');
                break;
            case 3:
                $entregasTxt = $qi->getTextoDB('plan_semestral');
                break;
            case 12:
                $entregasTxt = $qi->getTextoDB('plan_anual');
                break;
        }

        $nombreEnCarrito = $producto->getCategoria()->gen('nombre', $request->getLocale()) . " - $entregasTxt - " . $duracion->gen('nombre', $request->getLocale());
        if ($flor_id != 'not') {
            $flores = [];
            foreach (explode(',', $flor_id) as $key => $florId) {
                $flor = $this->getDoctrine()->getRepository('CarroiridianBundle:Flor')->find($florId);
                $flores[] = $flor->gen('nombre', $request->getLocale());
            }
            $nombreEnCarrito .= " <br> " . implode(',', $flores);
        }
        $productoFlorero = false;
        if ($florero_id != 'not') {
            $florero = $this->getDoctrine()->getRepository('CarroiridianBundle:Florero')->find($florero_id);
            // $nombreEnCarrito .= " <br> ".$florero->gen('nombre',$request->getLocale());
            $productoFlorero = $florero->getProducto()->getId();
        }
        $nombreEnCarrito .= " <br>Primera entrega: $date";
        if ($descuento) {
            $precio = $precio * (1 - ($descuento / 100));
            $nombreEnCarrito .= " <br> <strong>Descuento: $descuento%</strong>";
        }

        $productos = [array("producto" => $producto, "complementos" => [])];
        $carrito[$producto->getId()][1] = array("cantidad" => 1, "productos" => $productos, "color" => $nombreEnCarrito, "color_sku" => 'es_plan', "color_precio" => $precio, "tamano" => $size, "duracion" => $dur_id, "flor" => $flor_id, "florero" => $florero_id, "fecha" => $date, 'descuento' => $descuento);

        $session->set('carrito', $carrito);

        if ($productoFlorero) {
            $this->addCarritoTallaAction($request, $productoFlorero, 1, null, null, 'f_plan');
        }

        // error_log(json_encode($carrito).PHP_EOL,3,'log_jimmy.log');

        return new JsonResponse(array("cantidad" => 1));
    }

    /**
     * @Route("add-taller/{id}/{date}", name="add_carrito_taller" )
     */
    public function addTallerAction(Request $request, $id, $date)
    {
        $session = new Session();

        $carrito = $session->get('carrito', array());

        $repo = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto');
        $producto = $repo->find($id);
        $nombreEnCarrito = $producto->gen('nombre', $request->getLocale()) . ' - ' . $date . '<br>' . $producto->getHoraTaller() . '<br>' . $producto->getDireccionTaller();
        $productos = [array("producto" => $producto, "complementos" => [])];
        $carrito[$producto->getId()][1] = array("cantidad" => 1, "productos" => $productos, "color" => $nombreEnCarrito, "color_sku" => 'es_taller', "color_precio" => $producto->getPrecio(), "fecha" => $date);

        $session->set('carrito', $carrito);

        // error_log(json_encode($carrito).PHP_EOL,3,'log_jimmy.log');

        return new JsonResponse(array("cantidad" => 1));
    }

    /**
     * @Route("/add-carrito-talla/{id}/{id_talla}/{complementos_ids}/{complementos_cant}/{id_color}", defaults={"complementos_ids" = null,"complementos_cant" = null,"id_color" = 0} , name="add_carrito_talla")
     */
    public function addCarritoTallaAction(Request $request, $id, $id_talla, $complementos_ids = null, $complementos_cant = null, $id_color = null)
    {
        $session = new Session();
        $carrito = $session->get('carrito', array());
        $repo = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto');
        $producto = $repo->find($id);
        $inventario = $this->getDoctrine()->getRepository('CarroiridianBundle:Inventario')->findOneBy(array('producto' => $id, 'talla' => $id_talla));
        if ($inventario) {
            $producto->setPrecio($inventario->getPrecio());
        }
        $cantidad = 0;
        $color_nombre = '';
        $color_sku = $id_color != 'f_plan' ? '' : 'f_plan';
        $color = $id_color != 'f_plan' ? $this->getDoctrine()->getRepository('CarroiridianBundle:Color')->find($id_color) : null;
        // error_log(json_encode($color).PHP_EOL,3,'log_jimmy.log');
        if ($color == null && $id_color != 'f_plan') {
            $color = $producto->getColor();
            if ($color == null) {
                $color = $this->getDoctrine()->getRepository('CarroiridianBundle:Color')->findOneBy(array('visible' => true));
            }
        }
        if ($color) {
            $color_nombre = $color->gen('nombre', $request->getLocale());
            $color_sku = $color->getSku();
        }
        $productos = array();
        try {
            if (array_key_exists($id, $carrito))
                if (array_key_exists($id_talla, $carrito[$id])) {
                    $cantidad = $carrito[$id][$id_talla]["cantidad"];
                    $productos = $carrito[$id][$id_talla]["productos"];
                }
        } catch (Exception $e) {
        }
        $cantidad += 1;


        $complementos = array();
        $complementos_cant = explode(",", $complementos_cant);
        $complementos_ids = explode(",", $complementos_ids);
        foreach ($complementos_ids as $i => $id_comp) {
            $producto_comp = $repo->find($id_comp);
            if ($producto_comp) {
                $complemento = array("cantidad" => $complementos_cant[$i], "producto" => $producto_comp);
                array_push($complementos, $complemento);
            }
        }
        $prod_cart = array("producto" => $producto, "complementos" => $complementos);
        array_push($productos, $prod_cart);
        $color_precio = $color ? $color->getPrecio() : $producto->getPrecio();
        $carrito[$id][$id_talla] = array("cantidad" => $cantidad, "productos" => $productos, "color" => $color_nombre, "color_sku" => $color_sku, "color_precio" => $color_precio);
        // error_log($color_sku.PHP_EOL,3,'log_jimmy.log');
        $session->set('carrito', $carrito);
        return new JsonResponse(array("cantidad" => $cantidad));
    }

    /**
     * @Route("/carrito-complementos/{id}/{id_talla}",name="carrito_complementos")
     */
    public function carritoComplementosAction($id, $id_talla)
    {
        $session = new Session();
        $carrito = $session->get('carrito', array());
        $cantidad = 0;
        $productos = array();
        try {
            if (array_key_exists($id, $carrito))
                if (array_key_exists($id_talla, $carrito[$id])) {
                    $cantidad = $carrito[$id][$id_talla]["cantidad"];
                    $productos = $carrito[$id][$id_talla]["productos"];
                }
        } catch (Exception $e) {
        }
        $serializer = $this->get('serializer');
        $prods = $serializer->serialize($productos, 'json');
        $respuesta = json_encode(array("cantidad" => $cantidad, "productos" => $productos));
        return new Response($prods);
    }

    /**
     * @Route("/check-complemento/{id}/{id_talla}/{complemento_id}",name="check_complemento")
     */
    public function checkComplementoAction($id, $id_talla, $complemento_id)
    {
        $session = new Session();
        $carrito = $session->get('carrito', array());
        $cantidad = 0;
        $productos = array();
        $existe = false;
        $complementos = array();
        $key = 0;
        $key_grupo = 0;
        $action = 'remove';
        try {
            if (array_key_exists($id, $carrito))
                if (array_key_exists($id_talla, $carrito[$id])) {
                    $cantidad = $carrito[$id][$id_talla]["cantidad"];
                    $productos = $carrito[$id][$id_talla]["productos"];
                    foreach ($productos as $pos_grupo => $grupo) {
                        $complementos = $grupo['complementos'];
                        foreach ($complementos as $pos => $comp_group) {
                            $complemento = $comp_group['producto'];
                            if ($complemento->getId() == $complemento_id) {
                                $existe = true;
                                $key = $pos;
                                $key_grupo = $pos_grupo;
                                unset($carrito[$id][$id_talla]["productos"][$pos_grupo]['complementos'][$pos]);
                                $action = 'add';
                            }
                        }
                    }
                }
        } catch (Exception $e) {
        }
        if (!$existe) {
            $repo = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto');
            $producto_comp = $repo->find($complemento_id);
            if ($producto_comp) {
                $complemento = array("cantidad" => 1, "producto" => $producto_comp);
                array_push($complementos, $complemento);
            }
            $carrito[$id][$id_talla]["productos"][$key_grupo]['complementos'] = $complementos;
        }
        $session->set('carrito', $carrito);
        $respuesta = json_encode(array("action" => $action));
        return new Response($respuesta);
    }

    /**
     * @Route("/remove-comp/{id}/{id_talla}/{key}/{key_comp}",name="remove_comp")
     */
    public function removeComplementoAction($id, $id_talla, $key, $keycomp)
    {
        $session = new Session();
        $carrito = $session->get('carrito', array());

        try {
            //unset($carrito[$id][$id_talla]["productos"][$key]['complementos'][$keycomp]);
            array_splice($carrito[$id][$id_talla]["productos"][$key]['complementos'], $keycomp, 1);
        } catch (Exception $e) {
            $respuesta = json_encode(array("status" => 0));
            return new Response($respuesta);
        }
        $session->set('carrito', $carrito);
        $respuesta = json_encode(array("status" => 1));
        return new Response($respuesta);
    }

    /**
     * @Route("/remove-combo/{id}/{id_talla}/{key}",name="remove_combo")
     */
    public function removeComboAction($id, $id_talla, $key)
    {
        $session = new Session();
        $carrito = $session->get('carrito', array());

        try {
            //unset($carrito[$id][$id_talla]["productos"][$key]['complementos'][$keycomp]);
            array_splice($carrito[$id][$id_talla]["productos"], $key, 1);
            $cantidad = $carrito[$id][$id_talla]["cantidad"];
            $cantidad--;
            $carrito[$id][$id_talla]["cantidad"] = $cantidad;
        } catch (Exception $e) {
            $respuesta = json_encode(array("status" => 0));
            return new Response($respuesta);
        }
        $session->set('carrito', $carrito);
        $respuesta = json_encode(array("status" => 1));
        return new Response($respuesta);
    }

    /**
     * @Route("/remove-solos/{id}/{id_talla}",name="remove_solos")
     */
    public function removeSolosAction($id, $id_talla)
    {
        $session = new Session();
        $carrito = $session->get('carrito', array());

        try {
            $cantidad = $carrito[$id][$id_talla]["cantidad"];
            $continuar = true;
            while ($continuar) {
                $continuar = false;
                $prods = $carrito[$id][$id_talla]["productos"];
                foreach ($prods as $key => $grupo_comp) {
                    $complementos = $grupo_comp['complementos'];
                    $cant = count($complementos);
                    if ($cant == 0) {
                        //array_splice($carrito[$id][$id_talla]["productos"],$key,1);
                        unset($carrito[$id][$id_talla]["productos"][$key]);
                        $cantidad--;
                        //$continuar = true;
                    }
                }
            }
        } catch (Exception $e) {
            $respuesta = json_encode(array("status" => 0));
            return new Response($respuesta);
        }
        $carrito[$id][$id_talla]["cantidad"] = $cantidad;
        $session->set('carrito', $carrito);
        $respuesta = json_encode(array("status" => 1));
        return new Response($respuesta);
    }

    /**
     * @Route("/add-carrito-talla-old/{id}/{cant}/{id_talla}/{complementos_ids}/{complementos_cant}", name="add_carrito_talla_old")
     */
    public function addCarritoTallaOldAction($id, $cant, $id_talla, $complementos_ids = null, $complementos_cant = null)
    {
        $session = new Session();
        $carrito = $session->get('carrito', array());
        $repo = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto');
        $producto = $repo->find($id);
        try {
            if (array_key_exists($producto->getId(), $carrito))
                if (array_key_exists($id_talla, $carrito[$producto->getId()]))
                    $cantidad = $carrito[$producto->getId()][$id_talla]["cantidad"];
                else
                    $cantidad = 0;
            else
                $cantidad = 0;
        } catch (Exception $e) {
            $cantidad = 0;
        }

        if (!is_numeric($cantidad))
            $cantidad = 0;
        $cantidad += $cant;
        if ($cantidad < 0)
            $cantidad = 0;
        $carrito[$producto->getId()][$id_talla] = array("cantidad" => $cantidad, "nombre" => $producto->getNombreEs(), "precio" => $producto->getPrecio());
        if ($cantidad < 1) {
            unset($carrito[$producto->getId()][$id_talla]);
        } else {
            $complementos = array();
            $complementos_cant = explode(",", $complementos_cant);
            $complementos_ids = explode(",", $complementos_ids);
            foreach ($complementos_ids as $i => $id) {
                $producto_comp = $repo->find($id);
                $complemento = array("cantidad" => $complementos_cant[$i], "producto" => $producto_comp);
                array_push($complementos, $complemento);
            }
            $carrito[$producto->getId()][$id_talla]["complementos"] = $complementos;
        }



        $session->set('carrito', $carrito);

        return new JsonResponse(array("cantidad" => $cantidad));
    }

    /**
     * @Route("/remove-carrito-bono/{id}", name="remove_carrito_bono")
     */
    public function removeCarritoBonoAction($id)
    {
        $session = new Session();

        $bonos = $session->get('bonos', array());
        if (array_key_exists($id, $bonos)) {
            unset($bonos[$id]);
        }
        $session->set('bonos', $bonos);

        return new JsonResponse(array("cantidad" => 0));
    }

    /**
     * @Route("/set-rosa/{valor}", name="set_rosa")
     */
    public function setRosaAction($valor)
    {
        $session = new Session();
        $rosa = false;
        if ($valor == 1)
            $rosa = true;
        $session->set('rosa', $rosa);

        return new JsonResponse(array("cantidad" => $rosa));
    }

    /**
     * @Route("/set-moneda/{valor}", name="set_moneda")
     */
    public function setMonedaAction($valor)
    {
        $qi = $this->get('qi');
        $session = new Session();
        $moneda = 'COP';
        if ($valor == 'COP' || $valor == 'USD')
            $session->set('moneda', $valor);
        $moneda = $session->get('moneda', 'COP');
        if ($moneda == 'COP')
            $session->set('escala_moneda', 1);
        else
            $session->set('escala_moneda', $qi->getSettingDB('trm'));
        return new JsonResponse(array("status" => 1));
    }


    /**
     * @Route("/set-carrito-talla/{id}/{cant}/{id_talla}", name="set_carrito_talla")
     */
    public function setCarritoTallaAction($id, $cant, $id_talla)
    {
        $session = new Session();

        $carrito = $session->get('carrito', array());
        $producto = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto')->find($id);
        $inventario = $this->getDoctrine()->getRepository('CarroiridianBundle:Inventario')->findOneBy(array('producto' => $id, 'talla' => $id_talla));
        if ($inventario) {
            $producto->setPrecio($inventario->getPrecio());
        }

        try {
            $solos = 0;
            $prods = $carrito[$id][$id_talla]["productos"];
            foreach ($prods as $key => $grupo_comp) {
                $complementos = $grupo_comp['complementos'];
                $cant_comp = count($complementos);
                if ($cant_comp == 0) {
                    $solos++;
                }
            }
            $cantidad = $carrito[$id][$id_talla]["cantidad"];
            $diff = $cant - $solos;
            //echo $cant.' '.$solos;
            if ($diff > 0) {
                for ($i = 0; $i < $diff; $i++) {
                    $prod_cart = array("producto" => $producto, "complementos" => array());
                    array_push($prods, $prod_cart);
                    $cantidad++;
                }
                $carrito[$id][$id_talla] = array("cantidad" => $cantidad, "productos" => $prods, "color_sku" => $carrito[$id][$id_talla]['color_sku']);
            } else {
                foreach ($prods as $key => $grupo_comp) {
                    $complementos = $grupo_comp['complementos'];
                    $cant = count($complementos);
                    if ($cant == 0 && $diff < 0) {
                        unset($carrito[$id][$id_talla]["productos"][$key]);
                        $cantidad--;
                        $diff++;
                    }
                }
            }
        } catch (Exception $e) {
            $respuesta = json_encode(array("status" => 0));
            return new Response($respuesta);
        }
        $respuesta = json_encode(array("status" => 1));
        $carrito[$id][$id_talla]["cantidad"] = $cantidad;
        $session->set('carrito', $carrito);

        return new Response($respuesta);
    }

    /**
     * @Route("/ciudades-dept/{id}", name="ciudadesByDept")
     */
    public function ciudadesByDeptAction($id = null)
    {
        $ciudades = $this->getDoctrine()->getRepository('CarroiridianBundle:Ciudad')->findBy(array('departamento' => $id, "visible" => true), array('nombre' => 'asc'));
        return $this->render('CarroiridianBundle:Default:ciudades.html.twig', array('ciudades' => $ciudades));
    }

    /**
     * @Route("/departamentos-pais/{id}", name="departamentosByPais")
     */
    public function departamentosByPais($id = null)
    {
        $departamentos = $this->getDoctrine()->getRepository('CarroiridianBundle:Departamento')->findBy(array('pais' => $id), array('nombre' => 'asc'));
        return $this->render('CarroiridianBundle:Default:departamentos.html.twig', array('departamentos' => $departamentos));
    }



    /**
     * @Route("/calificar/{valor}/{producto}", name="calificar")
     */
    public function calificartAction($valor, $producto)
    {
        $em = $this->getDoctrine()->getManager();
        $repo = $this->getDoctrine()->getRepository('CarroiridianBundle:Calificacion');
        $user_id = $this->getUser()->getId();
        $calificacion = $repo->findOneBy(array('producto' => $producto, 'user' => $user_id));
        if ($calificacion == null) {
            $calificacion = new Calificacion();
            $calificacion->setProducto($this->getDoctrine()->getRepository('CarroiridianBundle:Producto')->find($producto));
            $calificacion->setUser($this->getUser());
        }
        $calificacion->setCalificacion($valor);
        $em->persist($calificacion);
        $em->flush();
        return new Response(json_encode(array('mensaje' => 1)));
    }
}

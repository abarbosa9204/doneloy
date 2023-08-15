<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Imagen;
use AppBundle\Entity\User;
use CarroiridianBundle\Entity\Entrada;
use CarroiridianBundle\Entity\Inventario;
use JavierEguiluz\Bundle\EasyAdminBundle\Controller\AdminController as BaseAdminController;
use JavierEguiluz\Bundle\EasyAdminBundle\Event\EasyAdminEvents;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Doctrine\ORM\Query\ResultSetMapping;
use Ddeboer\DataImport\Reader\ExcelReader;
use Ddeboer\DataImport\Writer\ExcelWriter;
use Ddeboer\DataImport\Workflow;
use Ddeboer\DataImport\Reader;
use Ddeboer\DataImport\Writer;
use Ddeboer\DataImport\Filter;
use PHPExcel;
use PHPExcel_IOFactory;
use PHPExcel_Style_Border;
use PHPExcel_Style_Alignment;
use Symfony\Component\HttpFoundation\Response;

class AdminController extends BaseAdminController
{

    /**
     * @Route("/reporte-total-vendido", name="reporte_total_vendido")
     */
    public function reporteTotalAction(Request $request)
    {
        $reporte = $this->reporteNativo('SELECT SUM(c.precio) as precio, " " as fecha FROM factura f left join compra c on c.id = f.compra_id WHERE c.eatadocarrito_id = 2 and prueba = 0 order by c.created_at;');
        return $this->render('AppBundle::reporte.html.twig', array(
            'reporte' => $reporte,
            'titulo'=>'Total vendido'
        ));
    }

    /**
     * @Route("/reporte-completo", name="reporte_completo")
     */
    public function reporteCompletoAction(Request $request)
    {
        $reporte = $this->reporteNativo('SELECT c.precio, c.created_at as fecha FROM factura f left join compra c on c.id = f.compra_id WHERE c.eatadocarrito_id = 2 and prueba = 0 order by c.created_at;');
        return $this->render('AppBundle::reporte.html.twig', array(
            'reporte' => $reporte,
            'titulo'=>'Reporte completo'
        ));
    }

    /**
     * @Route("/reporte-diario", name="reporte_diario")
     */
    public function reporteDirarioAction(Request $request)
    {
        $start = $request->query->get('start');
        $end = $request->query->get('end');
        $rango = '';
        if(strlen($start) > 4 && strlen($end) > 4)
            $rango = 'and c.created_at BETWEEN "'.$start.' 00:00:00" AND "'.$end.' 23:59:59"';
        $reporte = $this->reporteNativo('SELECT SUM(c.precio) as precio, concat(YEAR(c.created_at),"-",MONTH(c.created_at),"-", DAY(c.created_at)) as fecha FROM factura f left join compra c on c.id = f.compra_id WHERE c.eatadocarrito_id = 2 and prueba = 0  '.$rango.' group by concat(YEAR(c.created_at),MONTH(c.created_at), DAY(c.created_at)) order by c.created_at');
        return $this->render('AppBundle::reporte.html.twig', array(
            'reporte' => $reporte,
            'titulo'=>'Reporte diario'
        ));
    }

    /**
     * @Route("/reporte-mensual", name="reporte_mensual")
     */
    public function reporteMensualAction(Request $request)
    {
        $start = $request->query->get('start');
        $end = $request->query->get('end');
        $rango = '';
        if(strlen($start) > 4 && strlen($end) > 4)
            $rango = 'and c.created_at BETWEEN "'.$start.' 00:00:00" AND "'.$end.' 23:59:59"';
        $reporte = $this->reporteNativo('SELECT SUM(c.precio) as precio, concat(YEAR(c.created_at),"-",MONTH(c.created_at)) as fecha FROM factura f left join compra c on c.id = f.compra_id WHERE c.eatadocarrito_id = 2 and prueba = 0  '.$rango.' group by concat(YEAR(c.created_at),MONTH(c.created_at)) order by c.created_at');
        return $this->render('AppBundle::reporte.html.twig', array(
            'reporte' => $reporte,
            'titulo'=>'Reporte mensual'
        ));
    }

    /**
 * @Route("/reporte-producto", name="reporte_producto")
 */
    public function reporteProductcAction(Request $request)
    {
        $start = $request->query->get('start');
        $end = $request->query->get('end');
        $rango = '';
        if(strlen($start) > 4 && strlen($end) > 4)
            $rango = 'and c.created_at BETWEEN "'.$start.' 00:00:00" AND "'.$end.' 23:59:59"';
        $cols = array('sku','nombre','cantidad');
        $reporte = $this->reporteNativoGen($cols,'select p.sku, p.nombre_es as nombre, count(p.id*ci.cantidad) as cantidad from producto p left join compraitem ci on ci.producto_id = p.id left join compra c on c.id = ci.compra_id WHERE c.eatadocarrito_id = 2 and prueba = 0 '.$rango.' group by p.id order by cantidad desc');
        return $this->render('AppBundle::reporte_producto.html.twig', array(
            'reporte' => $reporte,
            'titulo'=>'Reporte por producto',
            'cols'=>$cols
        ));
    }

    /**
     * @Route("/reporte-categoria", name="reporte_categoria")
     */
    public function reporteCategoriacAction(Request $request)
    {
        $start = $request->query->get('start');
        $end = $request->query->get('end');
        $rango = '';
        if(strlen($start) > 4 && strlen($end) > 4)
            $rango = 'and c.created_at BETWEEN "'.$start.' 00:00:00" AND "'.$end.' 23:59:59"';
        $cols = array('id','nombre','cantidad');
        $reporte = $this->reporteNativoGen($cols,'select ca.id, ca.nombre_es as nombre, count(ca.id*ci.cantidad) as cantidad from categoria ca left join producto p on p.categoria_id = ca.id left join compraitem ci on ci.producto_id = p.id left join compra c on c.id = ci.compra_id WHERE c.eatadocarrito_id = 2 and prueba = 0 '.$rango.' group by ca.id order by cantidad desc');
        return $this->render('AppBundle::reporte_producto.html.twig', array(
            'reporte' => $reporte,
            'titulo'=>'Reporte por categoría',
            'cols'=>$cols
        ));
    }

    /**
     * @Route("/reporte-dia", name="reporte_dia")
     */
    public function reporteDiaAction(Request $request)
    {
        $start = $request->query->get('start');
        $end = $request->query->get('end');
        $rango = '';
        if(strlen($start) > 4 && strlen($end) > 4)
            $rango = 'and c.created_at BETWEEN "'.$start.' 00:00:00" AND "'.$end.' 23:59:59"';
        $cols = array('dia','cantidad');
        $reporte = $this->reporteNativoGen($cols,'SELECT c.precio, c.created_at as fecha, if(weekday(c.created_at) = 0, \'Lunes\', 	if(weekday(c.created_at) = 1,\'Martes\', 		if(weekday(c.created_at) = 2,\'Miercoles\', 			if(weekday(c.created_at) = 3,\'Jueves\', 				if(weekday(c.created_at) = 4,\'Viernes\', 					if(weekday(c.created_at) = 5,\'Sabado\',\'Domingo\')                 )             ) 		)     ) ) as dia, weekday(c.created_at) as dia_num , count(f.id) as cantidad FROM factura f left join compra c on c.id = f.compra_id WHERE c.eatadocarrito_id = 2 and prueba = 0 '.$rango.' group by dia order by dia_num asc');
        return $this->render('AppBundle::reporte_producto.html.twig', array(
            'reporte' => $reporte,
            'titulo'=>'Reporte por día',
            'cols'=>$cols
        ));
    }

    /**
     * @Route("/reporte-estados", name="reporte_estado")
     */
    public function reporteEstadoAction(Request $request)
    {
        $start = $request->query->get('start');
        $end = $request->query->get('end');
        $rango = '';
        if(strlen($start) > 4 && strlen($end) > 4)
            $rango = 'and c.created_at BETWEEN "'.$start.' 00:00:00" AND "'.$end.' 23:59:59"';
        $cols = array('nombre','cantidad');
        $reporte = $this->reporteNativoGen($cols,'SELECT count(f.id) as cantidad, e.nombre as nombre from factura f 
          left join compra c on c.id = f.compra_id 
          left join estado_carrito e on c.eatadocarrito_id = e.id 
          where 
                c.prueba = 0 
            and e.id is not null 
            and e.id != 5 
            '.$rango.'
        group by c.eatadocarrito_id 
        order by f.id asc');
        return $this->render('AppBundle::reporte_producto.html.twig', array(
            'reporte' => $reporte,
            'titulo'=>'Reporte por estados',
            'cols'=>$cols
        ));
    }




    public function reporteNativo($cadena){
        $rsm = new ResultSetMapping();
        $rsm->addScalarResult('precio', 'precio', 'string');
        $rsm->addScalarResult('fecha', 'fecha', 'string');
        $reporte = $this->getDoctrine()->getManager()->createNativeQuery($cadena, $rsm)->getArrayResult();
        return $reporte;
    }

    public function reporteNativoGen($cols,$cadena){
        $rsm = new ResultSetMapping();
        foreach ($cols as $col){
            $rsm->addScalarResult($col, $col, 'string');
        }
        $reporte = $this->getDoctrine()->getManager()->createNativeQuery($cadena, $rsm)->getArrayResult();
        return $reporte;
    }


    /**
     * @Route("/inventarios_add/{producto_id}/{talla_id}/{cantidad}/{precio}", name="update_inventarios")
     */
    public function updateInventarioAction(Request $request,$producto_id,$talla_id,$cantidad,$precio)
    {
        $inventario = $this->getDoctrine()->getRepository('CarroiridianBundle:Inventario')
            ->findOneBy(array('producto'=>$producto_id,"talla"=>$talla_id));
        if($inventario == null){
            $inventario = new Inventario();
        }
        $valido_cant = true;
        $valido_precio = true;
        if(!is_int(intval($cantidad)))
            $valido_cant = false;
        if(!is_float(floatval($precio)))
            $valido_precio = false;
        if($valido_cant && $valido_precio){
            $producto = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto')->find($producto_id);
            if(!$producto)
                $data = array('status'=>2);
            else{
                $talla = $this->getDoctrine()->getRepository('CarroiridianBundle:Talla')->find($talla_id);
                if(!$talla)
                    $data = array('status'=>3);
                else{
                    $inventario->setCantidad($cantidad);
                    $inventario->setPrecio($precio);
                    $inventario->setProducto($producto);
                    $inventario->setTalla($talla);
                    $em = $this->getDoctrine()->getManager();
                    $em->persist($inventario);
                    $em->flush();
                    $data = array('status'=>1);
                }
            }
        }else{
            if(!$valido_cant && !$valido_precio){
                $data = array('status'=>4);
            }else if(!$valido_cant)
                $data = array('status'=>5);
            else
                $data = array('status'=>6);
        }
        return new JsonResponse($data);
    }

    /**
     * @Route("/inventarios_cantidad/{producto_id}/{talla_id}/{cantidad}", name="cantidad_inventarios")
     */
    public function cantidadInventarioAction(Request $request,$producto_id,$talla_id,$cantidad)
    {
        $inventario = $this->getDoctrine()->getRepository('CarroiridianBundle:Inventario')
            ->findOneBy(array('producto'=>$producto_id,"talla"=>$talla_id));
        if($inventario == null){
            $inventario = new Inventario();
        }
        $valido_cant = true;
        if(!is_numeric($cantidad))
            $valido_cant = false;
        if($valido_cant){
            $producto = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto')->find($producto_id);
            if(!$producto)
                $data = array('status'=>2);
            else{
                $talla = $this->getDoctrine()->getRepository('CarroiridianBundle:Talla')->find($talla_id);
                if(!$talla)
                    $data = array('status'=>3);
                else{
                    $inventario->setCantidad($cantidad);
                    $inventario->setProducto($producto);
                    $inventario->setTalla($talla);
                    $em = $this->getDoctrine()->getManager();
                    $em->persist($inventario);
                    $em->flush();
                    $data = array('status'=>1);
                }
            }
        }else{
            $data = array('status'=>4);
        }
        return new JsonResponse($data);
    }

    /**
     * @Route("/inventarios_precio/{producto_id}/{talla_id}/{precio}", name="precio_inventarios")
     */
    public function precioInventarioAction(Request $request,$producto_id,$talla_id,$precio)
    {
        $inventario = $this->getDoctrine()->getRepository('CarroiridianBundle:Inventario')
            ->findOneBy(array('producto'=>$producto_id,"talla"=>$talla_id));
        if($inventario == null){
            $inventario = new Inventario();
        }
        $valido_cant = true;
        if(!is_numeric($precio))
            $valido_cant = false;
        if($valido_cant){
            $producto = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto')->find($producto_id);
            if(!$producto)
                $data = array('status'=>2);
            else{
                $talla = $this->getDoctrine()->getRepository('CarroiridianBundle:Talla')->find($talla_id);
                if(!$talla)
                    $data = array('status'=>3);
                else{
                    $inventario->setPrecio($precio);
                    $inventario->setProducto($producto);
                    $inventario->setTalla($talla);
                    $em = $this->getDoctrine()->getManager();
                    $em->persist($inventario);
                    $em->flush();
                    $data = array('status'=>1);
                }
            }
        }else{
            $data = array('status'=>4);
        }
        return new JsonResponse($data);
    }

    /**
     * @Route("/inventarios", name="admin_inventarios")
     */
    public function inventarioAction(Request $request)
    {
        $qi = $this->get('qi');
        $page = $request->get('page',1);
        $quantity = $request->get('q',20);
        $query = $request->get('query','');
        $precio = $qi->getSettingDB('precio_inventario');
        $tallas = $this->getDoctrine()->getRepository('CarroiridianBundle:Talla')->findAll();
        $inventario = $this->matriz($quantity,$page,$query);
        $paginator = [
            'haveToPaginate' => false
        ];
        if($quantity){
            $numRows = $inventario[0]['total'];
            $from = (($page-1)*$quantity)+1;
            $to = $from;
            $lastPage = ceil($numRows/$quantity);
            if ($page+1 <= $lastPage) {
                $to = $from+($quantity-1);
                $paginator['hasNextPage'] = true;
                $paginator['nextPage'] = $page + 1;
            }else{
                $to = $numRows;
                $paginator['hasNextPage'] = false;
            }
            $paginator['hasPreviousPage'] = false;
            if($page > 1){
                $paginator['hasPreviousPage'] = true;
                $paginator['previousPage'] = $page - 1;
            }
            $paginator['haveToPaginate'] = true;
            $paginator['from'] = $from;
            $paginator['to'] = $to;
            $paginator['currentPage'] = $page;
            $paginator['total'] = $numRows;
            $paginator['lastPage'] = $lastPage;
        }
        return $this->render('AppBundle::inventarios.html.twig', array(
            'inventarios' => $inventario,
            'paginator' => $paginator,
            'tallas' => $tallas,
            'precio' => $precio == 1
        ));
    }


    public function matriz($quantity=0,$page=1,$query=''){
        $qi = $this->get('qi');
        $precio = $qi->getSettingDB('precio_inventario');
        $tallas = $this->getDoctrine()->getRepository('CarroiridianBundle:Talla')->findAll();
        $rsm = new ResultSetMapping();
        $rsm->addScalarResult('inventario_id', 'inventario_id', 'integer');
        $cad = '';
        $cad_in = '';
        $limit = '';
        if($quantity>0){
            $page = $page?$page:1;
            $from = ($page-1)*$quantity;
            $limit = "LIMIT $from,$quantity";
        }
        if(is_numeric($q) && $q != 0){
            $p = $p-1;
        }
        $nameFilter = '';
        if($query != ''){
            $nameFilter = " AND p.sku LIKE '%$query%' OR p.nombre_es LIKE '%$query%' ";
        }
        foreach ($tallas as $talla){
            $id = $talla->getId();
            $rsm->addScalarResult('cantidad_'.$id,'cantidad_'.$id, 'integer');
            if($precio)
                $rsm->addScalarResult('precio_'.$id, 'precio_'.$id, 'float');
            $cad .= ', SUM( cantidad_'.$id.' ) AS cantidad_'.$id;
            if($precio)
                $cad .= ', SUM( precio_'.$id.' ) AS precio_'.$id;
            $cad_in .= ', IF( talla_id ='.$id.', i.cantidad, 0 ) AS cantidad_'.$id;
            if($precio)
                $cad_in .= ', IF( talla_id ='.$id.', i.precio, 0 ) AS precio_'.$id;
        }

        $rsm->addScalarResult('total', 'total', 'integer');
        $rsm->addScalarResult('id', 'producto_id', 'integer');
        $rsm->addScalarResult('sku', 'sku', 'string');
        $rsm->addScalarResult('nombre_es', 'nombre', 'string');
        $rsm->addScalarResult('talla_id', 'talla_id', 'integer');
        $sql = 
        $inventarios = $this->getDoctrine()->getManager()->createNativeQuery('
        SELECT (select count(id) from producto as p WHERE 1 '.$nameFilter.') as total, p.id, p.sku, p.nombre_es, talla_id, inventario_id'.$cad.'
            FROM (
            SELECT p.id, p.sku, p.nombre_es, t.id AS talla_id, i.id AS inventario_id
            '.$cad_in.'
            FROM producto p
            LEFT JOIN inventario i ON p.id = i.producto_id
            LEFT JOIN talla t ON t.id = i.talla_id
            WHERE p.id IS NOT NULL '.$nameFilter.'
            ) AS p
            GROUP BY p.id '.$limit, $rsm)->getArrayResult();
        // if(array_key_exists('test_jimmy',$_COOKIE)){
        //     var_dump($inventarios);exit;
        // }
        return $inventarios;
    }

    /**
     * @Route("/inventarios-excel/{id}", name="excel_inventarios")
     */
    public function inventarioExcelAction(Request $request,$id)
    {
        $archivo = $this->getDoctrine()->getRepository('CarroiridianBundle:ArchivoInventario')->find($id);
        $em = $this->getDoctrine()->getManager();
        $qi = $this->get('qi');
        $precio = $qi->getSettingDB('precio_inventario');
        $archivo = $this->get('kernel')->getRootDir().'/../html/uploads/inventarios/'.$archivo->getArchivo();
        $file = new \SplFileObject($archivo);
        $reader = new ExcelReader($file);
        $tallas_ids = array();
        foreach ($reader as $fila=>$row){
            if($fila == 1){
                foreach ($row as $col){
                    if(is_numeric($col)){
                        array_push($tallas_ids,$col);
                    }
                }
            }
            if($fila > 2){
                $sku = $row[0];
                $producto = $this->getDoctrine()->getRepository('CarroiridianBundle:Producto')->findOneBy(array('sku'=>$sku));
                if($producto){
                    foreach ($tallas_ids as $i=>$talla_id){
                        $talla = $this->getDoctrine()->getRepository('CarroiridianBundle:Talla')->find($talla_id);
                        $inventario = $this->getDoctrine()->getRepository('CarroiridianBundle:Inventario')->findOneBy(array('producto'=>$producto->getId(),"talla"=>$talla_id));
                        if($precio == 1){
                            $cantidad = $row[($i*2) + 2];
                            $precio_inv = $row[($i*2) + 3];
                        }else{
                            $cantidad = $row[($i) + 2];
                            $precio_inv = $row[($i) + 3];
                        }
                        if(!$inventario){
                            $inventario = new Inventario();
                        }
                        $inventario->setCantidad($cantidad);
                        $inventario->setPrecio($precio_inv);
                        $inventario->setProducto($producto);
                        $inventario->setTalla($talla);
                        $em->persist($inventario);
                    }
                }
            }
        }
        $em->flush();

        return $this->render('AppBundle::importar.html.twig', array());
    }

    /**
     * @Route("/inventarios-excel-generador", name="excel_generador_inventarios")
     */
    public function inventarioExcelGeneradorAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $qi = $this->get('qi');
        $precio = $qi->getSettingDB('precio_inventario');
        $archivo = $this->get('kernel')->getRootDir().'/../html/uploads/inventarios/BasePreciosDonEloy.xlsx';
        $objPHPExcel = new PHPExcel;
        $objPHPExcel->getDefaultStyle()->getFont()->setName('Calibri');
        $objPHPExcel->getDefaultStyle()->getFont()->setSize(8);
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, "Excel2007");

        $objSheet = $objPHPExcel->getActiveSheet();
        $objSheet->setTitle('Listado de Precios');

        $tallas = $this->getDoctrine()->getRepository('CarroiridianBundle:Talla')->findAll();
        $tallas_tam = count($tallas);
        $objSheet->getStyle('A1:'.$this->getNameFromNumber($tallas_tam*2 + 1).'3')->getFont()->setBold(true)->setSize(12);
        $escala = 1;
        if($precio == 1)
            $escala = 2;
        foreach ($tallas as $i=>$talla){
            $ini = $this->getNameFromNumber($i*$escala+2);
            if($precio == 1){
                $fin = $this->getNameFromNumber($i*$escala+3);
                $objSheet->mergeCells($ini.'1:'.$fin.'1');
            }
            $objSheet->getCell($ini.'1')->setValue($talla->getNombreEs());
            $objSheet->getColumnDimension($ini)->setAutoSize(true);
        }
        foreach ($tallas as $i=>$talla){
            $ini = $this->getNameFromNumber($i*$escala+2);
            if($precio == 1) {
                $fin = $this->getNameFromNumber($i * $escala + 3);
                $objSheet->mergeCells($ini . '2:' . $fin . '2');
            }
            $objSheet->getCell($ini.'2')->setValue($talla->getId());
            $objSheet->getColumnDimension($ini)->setAutoSize(true);
        }

        $objSheet->getCell('A3')->setValue('SKU');
        $objSheet->getCell('B3')->setValue('PRODUCTO');

        foreach ($tallas as $i=>$talla){
            $ini = $this->getNameFromNumber($i*$escala+2);
            $fin = $this->getNameFromNumber($i*$escala+3);
            $objSheet->getCell($ini.'3')->setValue('CANTIDAD');
            if($precio == 1) {
                $objSheet->getCell($fin . '3')->setValue('PRECIO');
                $objSheet->getColumnDimension($fin)->setAutoSize(true);
            }
            $objSheet->getColumnDimension($ini)->setAutoSize(true);
        }
        foreach ($this->matriz() as $j=>$fila){
            $objSheet->getCell('A'.($j+4))->setValue($fila['sku']);
            $objSheet->getCell('B'.($j+4))->setValue($fila['nombre']);
            foreach ($tallas as $i=>$talla){
                $ini = $this->getNameFromNumber($i*$escala+2);
                $fin = $this->getNameFromNumber($i*$escala+3);
                $objSheet->getCell($ini.($j+4))->setValue($fila['cantidad_'.($i+1)]);
                if($precio == 1) {
                    $objSheet->getCell($fin . ($j + 4))->setValue($fila['precio_' . ($i + 1)]);
                    $objSheet->getColumnDimension($fin)->setAutoSize(true);
                }
                $objSheet->getColumnDimension($ini)->setAutoSize(true);
            }
        }

        $objSheet->getColumnDimension('A')->setAutoSize(true);
        $objSheet->getColumnDimension('B')->setAutoSize(true);

        $objWriter->save($archivo);

        $response = new Response();
        $filename = $archivo;

        $response->headers->set('Cache-Control', 'private');
        $response->headers->set('Content-type', mime_content_type($filename));
        $response->headers->set('Content-Disposition', 'attachment; filename="' . basename($filename) . '";');
        $response->headers->set('Content-length', filesize($filename));
        $response->sendHeaders();

        $response->setContent(file_get_contents($filename));
        return $response;
    }

    function getNameFromNumber($num) {
        $numeric = $num % 26;
        $letter = chr(65 + $numeric);
        $num2 = intval($num / 26);
        if ($num2 > 0) {
            return $this->getNameFromNumber($num2 - 1) . $letter;
        } else {
            return $letter;
        }
    }

    /**
     * @Route("/ordenargen/{tabla}/{campo}/{id}", name="ordenargen")
     */
    public function ordenargenAction(Request $request,$tabla,$campo,$id)
    {
        $em = $this->getDoctrine()->getManager();
        $objetos = $request->request->get('objeto');
        $imgs = $this->getDoctrine()
            ->getRepository($tabla)
            ->findBy(array($campo=>$id));
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
     * The method that is executed when the user performs a 'new' action on an entity.
     *
     * @return RedirectResponse|Response
     */
    protected function newEntradaAction()
    {
        $this->dispatch(EasyAdminEvents::PRE_NEW);

        $entity = new Entrada();
        $entity->setCantidad(0);

        $easyadmin = $this->request->attributes->get('easyadmin');
        $easyadmin['item'] = $entity;
        $this->request->attributes->set('easyadmin', $easyadmin);

        $fields = $this->entity['new']['fields'];

        $newForm = $this->executeDynamicMethod('create<EntityName>NewForm', array($entity, $fields));

        $newForm->handleRequest($this->request);
        if ($newForm->isValid()) {
            $this->dispatch(EasyAdminEvents::PRE_PERSIST, array('entity' => $entity));

            $this->executeDynamicMethod('prePersist<EntityName>Entity', array($entity));

            $this->em->persist($entity);
            $this->em->flush();

            $this->dispatch(EasyAdminEvents::POST_PERSIST, array('entity' => $entity));

            $refererUrl = $this->request->query->get('referer', '');

            $inventario = $entity->getInventario();
            if($inventario || 1){
                $cantidad_inv = $inventario->getCantidad();
                $cantidad_ent = $entity->getCantidad();
                $inventario->setCantidad($cantidad_inv + $cantidad_ent);
                $this->em->persist($inventario);
                $this->em->flush();
            }

            return !empty($refererUrl)
                ? $this->redirect(urldecode($refererUrl))
                : $this->redirect($this->generateUrl('easyadmin', array('action' => 'list', 'entity' => $this->entity['name'])));
        }

        $this->dispatch(EasyAdminEvents::POST_NEW, array(
            'entity_fields' => $fields,
            'form' => $newForm,
            'entity' => $entity,
        ));

        return $this->render($this->entity['templates']['new'], array(
            'form' => $newForm->createView(),
            'entity_fields' => $fields,
            'entity' => $entity,
        ));
    }

    /**
     * The method that is executed when the user performs a 'show' action on an entity.
     *
     * @return Response
     */
    protected function showGaleriaAction()
    {
        $this->dispatch(EasyAdminEvents::PRE_SHOW);

        $id = $this->request->query->get('id');
        $easyadmin = $this->request->attributes->get('easyadmin');
        $entity = $easyadmin['item'];

        $fields = $this->entity['show']['fields'];
        $deleteForm = $this->createDeleteForm($this->entity['name'], $id);

        $this->dispatch(EasyAdminEvents::POST_SHOW, array(
            'deleteForm' => $deleteForm,
            'fields' => $fields,
            'entity' => $entity,
        ));

        return $this->render('@EasyAdmin/default/show_galeria.html.twig', array(
            'entity' => $entity,
            'fields' => $fields,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * The method that is executed when the user performs a 'show' action on an entity.
     *
     * @return Response
     */
    protected function showProductoAction()
    {
        $this->dispatch(EasyAdminEvents::PRE_SHOW);

        $id = $this->request->query->get('id');
        $easyadmin = $this->request->attributes->get('easyadmin');
        $entity = $easyadmin['item'];

        $fields = $this->entity['show']['fields'];
        $deleteForm = $this->createDeleteForm($this->entity['name'], $id);

        $this->dispatch(EasyAdminEvents::POST_SHOW, array(
            'deleteForm' => $deleteForm,
            'fields' => $fields,
            'entity' => $entity,
        ));

        return $this->render('@EasyAdmin/default/show_gen.html.twig', array(
            'entity' => $entity,
            'fields' => $fields,
            'delete_form' => $deleteForm->createView(),
            'tabla_doctrine' => 'CarroiridianBundle:Galeriaproducto',
            'tabla' => 'Galeriaproducto',
            'campo' => 'producto',
            'ruta' => $this->container->getParameter('app.path.productos')
        ));
    }

    /**
     * The method that is executed when the user performs a 'show' action on an entity.
     *
     * @return Response
     */
    protected function showPostAction()
    {
        $this->dispatch(EasyAdminEvents::PRE_SHOW);

        $id = $this->request->query->get('id');
        $easyadmin = $this->request->attributes->get('easyadmin');
        $entity = $easyadmin['item'];

        $fields = $this->entity['show']['fields'];
        $deleteForm = $this->createDeleteForm($this->entity['name'], $id);

        $this->dispatch(EasyAdminEvents::POST_SHOW, array(
            'deleteForm' => $deleteForm,
            'fields' => $fields,
            'entity' => $entity,
        ));

        return $this->render('@EasyAdmin/default/show_gen.html.twig', array(
            'entity' => $entity,
            'fields' => $fields,
            'delete_form' => $deleteForm->createView(),
            'tabla_doctrine' => 'BlogiridianBundle:GaleriaPost',
            'tabla' => 'GaleriaPost',
            'campo' => 'post',
            'ruta' => $this->container->getParameter('app.path.blogs')
        ));
    }

    /**
     * The method that is executed when the user performs a 'new' action on an entity.
     *
     * @return RedirectResponse|Response
     */
    protected function newImagenAction()
    {
        $this->dispatch(EasyAdminEvents::PRE_NEW);

        $entity = new Imagen();

        $easyadmin = $this->request->attributes->get('easyadmin');
        $easyadmin['item'] = $entity;
        $this->request->attributes->set('easyadmin', $easyadmin);

        $fields = $this->entity['new']['fields'];

        $newForm = $this->executeDynamicMethod('create<EntityName>NewForm', array($entity, $fields));

        $newForm->handleRequest($this->request);
        if ($newForm->isValid()) {
            $this->dispatch(EasyAdminEvents::PRE_PERSIST, array('entity' => $entity));

            //$this->prePersistEntity($entity);

            $this->executeDynamicMethod('prePersist<EntityName>Entity', array($entity));

            $this->em->persist($entity);
            $this->em->flush();

            $this->dispatch(EasyAdminEvents::POST_PERSIST, array('entity' => $entity));

            $refererUrl = $this->request->query->get('referer', '');

            if($refererUrl == 'modal')
                return $this->redirect($this->generateUrl('modalimage', array('id'=>$entity->getId(),'name'=>$entity->getImage())));
            else
                return $this->redirect($this->generateUrl('easyadmin', array('action' => 'list', 'entity' => $this->entity['name'])));
        }

        $this->dispatch(EasyAdminEvents::POST_NEW, array(
            'entity_fields' => $fields,
            'form' => $newForm,
            'entity' => $entity,
        ));

        return $this->render($this->entity['templates']['new'], array(
            'form' => $newForm->createView(),
            'entity_fields' => $fields,
            'entity' => $entity,
        ));
    }

    /**
     * The method that is executed when the user performs a 'edit' action on an entity.
     *
     * @return RedirectResponse|Response
     */
    protected function editImagenAction()
    {
        $this->dispatch(EasyAdminEvents::PRE_EDIT);

        $id = $this->request->query->get('id');
        $easyadmin = $this->request->attributes->get('easyadmin');
        $entity = $easyadmin['item'];

        if ($this->request->isXmlHttpRequest() && $property = $this->request->query->get('property')) {
            $newValue = 'true' === strtolower($this->request->query->get('newValue'));
            $fieldsMetadata = $this->entity['list']['fields'];

            if (!isset($fieldsMetadata[$property]) || 'toggle' != $fieldsMetadata[$property]['dataType']) {
                throw new \Exception(sprintf('The type of the "%s" property is not "toggle".', $property));
            }

            $this->updateEntityProperty($entity, $property, $newValue);

            return new Response((string) $newValue);
        }

        $fields = $this->entity['edit']['fields'];

        $editForm = $this->executeDynamicMethod('create<EntityName>EditForm', array($entity, $fields));
        $deleteForm = $this->createDeleteForm($this->entity['name'], $id);

        $editForm->handleRequest($this->request);
        if ($editForm->isValid()) {
            $this->dispatch(EasyAdminEvents::PRE_UPDATE, array('entity' => $entity));

            $this->executeDynamicMethod('preUpdate<EntityName>Entity', array($entity));
            $this->em->flush();

            $this->dispatch(EasyAdminEvents::POST_UPDATE, array('entity' => $entity));

            $refererUrl = $this->request->query->get('referer', '');


            if($refererUrl == 'modal')
                return $this->redirect($this->generateUrl('modalimage', array('id'=>$entity->getId(),'name'=>$entity->getImage())));
            else
                return !empty($refererUrl)
                    ? $this->redirect(urldecode($refererUrl))
                    : $this->redirect($this->generateUrl('easyadmin', array('action' => 'list', 'entity' => $this->entity['name'])));
        }

        $this->dispatch(EasyAdminEvents::POST_EDIT);

        return $this->render($this->entity['templates']['edit'], array(
            'form' => $editForm->createView(),
            'entity_fields' => $fields,
            'entity' => $entity,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    protected function instantiateNewEntity()
    {
        if ($this->entity['name'] === 'YourUserEntityNameInEasyAdmin') {
            return $this->get('fos_user.user_manager')->createUser();
        }
        return parent::instantiateNewEntity();
    }

    public function createNewUsersEntity()
    {
        return $this->container->get('fos_user.user_manager')->createUser();
    }

    public function prePersistUsersEntity(User $user)
    {
        $user->setLastLogin(new \DateTime());
        $this->container->get('fos_user.user_manager')->updateUser($user, false);
    }

    public function preUpdateUsersEntity(User $user)
    {
        $user->setLastLogin(new \DateTime());
        $this->container->get('fos_user.user_manager')->updateUser($user, false);
    }

    public function executeDynamicMethod($methodNamePattern, array $arguments = array())
    {
        $methodName = str_replace('<EntityName>', $this->entity['name'], $methodNamePattern);
        if (!is_callable(array($this, $methodName))) {
            $methodName = str_replace('<EntityName>', '', $methodNamePattern);
        }

        return call_user_func_array(array($this, $methodName), $arguments);
    }


    public function updateEntityProperty($entity, $property, $value)
    {
        $entityConfig = $this->entity;

        // the method_exists() check is needed because Symfony 2.3 doesn't have isWritable() method
        if (method_exists($this->get('property_accessor'), 'isWritable') && !$this->get('property_accessor')->isWritable($entity, $property)) {
            throw new \Exception(sprintf('The "%s" property of the "%s" entity is not writable.', $property, $entityConfig['name']));
        }

        $this->dispatch(EasyAdminEvents::PRE_UPDATE, array('entity' => $entity, 'newValue' => $value));

        $this->get('property_accessor')->setValue($entity, $property, $value);

        $this->em->persist($entity);
        $this->em->flush();
        $this->dispatch(EasyAdminEvents::POST_UPDATE, array('entity' => $entity, 'newValue' => $value));

        $this->dispatch(EasyAdminEvents::POST_EDIT);
    }

    /**
     * @Route("/facturas", name="facturas")
     */
    public function facturasAction()
    {

        /** @var $em EntityManager */
        $em = $this->getDoctrine()->getManager();
        $qb = $em->createQueryBuilder()->from('CarroiridianBundle:Factura','f')
            ->select('f.id as id','f.nombre as nombre', 'f.documento as documento', 'c.id as compra_id','f.idsap as idsap','f.docsap as docsap')
            ->leftJoin('f.compra','c')
            ->leftJoin('c.estado','e')
            ->where('e.id = 2')
            ->andWhere('c.prueba = 0')
            ->orderBy('f.id','desc');
        $facturas = $qb->getQuery()->getResult();

        return $this->render('@EasyAdmin/default/facturas.html.twig',array('facturas'=>$facturas));
    }
}
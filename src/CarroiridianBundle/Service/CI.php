<?php
/**
 * Created by PhpStorm.
 * User: Iridian 1
 * Date: 1/02/2016
 * Time: 12:29 PM
 */

namespace CarroiridianBundle\Service;

use CarroiridianBundle\Entity\Inventario;
use CarroiridianBundle\Entity\Producto;
use CarroiridianBundle\Entity\Talla;
use Doctrine\ORM\EntityManager;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\DependencyInjection\ContainerInterface as Container;
use Doctrine\ORM\Query\ResultSetMapping;
use CarroiridianBundle\Service\ParallelCurl;
// use CarroiridianBundle\Service\ParallelCurlCustom;
use Symfony\Component\HttpFoundation\Session\Session;
use CarroiridianBundle\Entity\ConfiguracionPlan;
use CarroiridianBundle\Entity\Flor;
use CarroiridianBundle\Entity\Florero;
use CarroiridianBundle\Entity\Taller;
use CarroiridianBundle\Entity\PrecioPlan;
use CarroiridianBundle\Entity\RangoPrecio;
use CarroiridianBundle\Entity\Tamano;

class CI
{
    protected $em;
    protected $request_stack;
    protected $locale;
    protected $container;

    protected $textos		= null;
    protected $textosDB		= null;
    protected $textosBigDB	= null;

    protected $settings		= null;
    protected $imagenes = null;
    protected $productosId = null;
    protected $tallasId = null;


    public function __construct(EntityManager $em, RequestStack $request_stack, Container $container)
    {
        $this->em = $em;
        $this->request_stack = $request_stack;
        $this->container = $container;
        // $this->pCurl = $pCurl;
        //$this->locale = $request_stack->getCurrentRequest()->getLocale();
    }

    public function qs($clase)
    {
        return $this->em->getRepository('AppBundle:Texto')->findAll();
    }

    private function getResultsId($entidad){
        $qb = $this->em->createQueryBuilder()
            ->select('s')
            ->from($entidad, 's', 's.id')
            ->getQuery()
            ->useQueryCache(true)
            ->useResultCache(true)
            ->getArrayResult();
        return $qb;
    }

    private function getProductosId() {
        if ($this->productosId == null) {
            $this->productosId = $this->getResultsId('CarroiridianBundle:Producto');
        }
        return $this->productosId;
    }

    /**
     * @param $key
     * @return Producto
     */
    public function getProductoId($key) {
        $arrTextos = $this->getProductosId();

        if(isset($arrTextos[$key]))
            return $arrTextos[$key];
        else
            return $key;
    }

    private function getTallasId() {
        if ($this->tallasId == null) {
            $this->tallasId = $this->getResultsId('CarroiridianBundle:Talla');
        }
        return $this->tallasId;
    }

    /**
     * @param $key
     * @return Talla
     */
    public function getTallaId($key) {
        $arrTextos = $this->getTallasId();

        if(isset($arrTextos[$key]))
            return $arrTextos[$key];
        else
            return $key;
    }

    public function getProductoById($id){
        $locale = $this->request_stack->getCurrentRequest()->getLocale();
        $locale = ucfirst($locale);
        $path = $this->container->getParameter('app.path.productos');
        $qb = $this->em->createQueryBuilder();
        $qb
            ->select('p.id',
                'p.nombre'.$locale.' as nombre',
                'p.sku as sku',
                'p.precio as precio',
                'ca.id as categoria',
                'i.cantidad as cantidad',
                "concat('".$path."/',p.imagen) as imagen",
                "concat('".$path."/',p.imagenaux) as imagenaux",
                "GROUP_CONCAT(c.id ORDER by p.id SEPARATOR ' ') as colores",
                "GROUP_CONCAT(e.id ORDER by p.id SEPARATOR ' ') as estilos",
                'ca.nombre'.$locale.' as nombrecat'
            )
            ->from('CarroiridianBundle:Producto', 'p')
            ->leftJoin('p.inventarios', 'i')
            ->leftJoin('p.color','c')
            ->leftJoin('p.estilos','e')
            ->leftJoin('p.categoria','ca')
            ->leftJoin('p.generos','gen')
            ->andWhere('p.visible = 1')
            ->andWhere("p.id = " . $id)
            ->orderBy('p.orden', 'asc');
        $results = $qb->getQuery()->getSingleResult();
        return $results;
    }

    public function getProductosByCiudad($categoria_id = null, $genero_id = null, $search = "", $color_id = null, $ocasion_id = null, $taller = 0,$boutique = false,$pret = false,$ciudad=0,$limit1=0,$limit2=0,$masVendidos=false,$corporativo=false){
        set_time_limit(0);
        if(isset($_GET['jimmy'])){
            var_dump(func_get_args());
        }
        // error_log(json_encode(compact('categoria_id','genero_id','search','color_id','ocasion_id','taller','boutique','pret','ciudad')).PHP_EOL,3,'log_jimmy.log');
        $locale = $this->request_stack->getCurrentRequest()->getLocale();
        $locale = ucfirst($locale);
        $path = $this->container->getParameter('app.path.productos');

        $ses = new Session();
        $almacenes = $ses->get('almacenes',array());
        if(empty($almacenes)){
            $almacenes = $this->getAlmacenesCiudad($ciudad);
        }
        $em = $this->em;
        $qb = $em->createQueryBuilder();
        $qb->select('p.id','p.sap')
            ->from('CarroiridianBundle:Producto','p')
            ->innerJoin('p.categoria','ca',\Doctrine\ORM\Query\Expr\Join::WITH,'ca.abasto = 0')
            ->leftJoin('p.color','c')
            ->leftJoin('p.estilos','e')
            ->leftJoin('p.generos','gen')
            ->leftJoin('p.ocaciones','o')
            ->where('p.taller = :taller')
            ->andWhere('p.corporativo = :corporativo')
            ->andWhere('p.pret = :pret')
            ->andWhere('p.visible = 1')
            ->andWhere('p.padre is null');
        $boutiqueOr = false;
        if(is_numeric($categoria_id)){
            $qb->andWhere('p.categoria = '.$categoria_id);
            // if($categoria_id == 12){
            //     $pret = true;
            // }
        }
        if(is_numeric($color_id)) {
            $qb->andWhere('(c.id = ' . $color_id.' AND p.boutique = 1) OR (c.id = ' . $color_id.' AND p.boutique = 0)');
            $boutiqueOr = true;
        }
        if(is_numeric($genero_id)) {
            $qb->andWhere('gen.id = ' . $genero_id);
        }
        if(is_numeric($limit1) && is_numeric($limit2) && ($limit2 > $limit1 || ($limit2 == 0  && $limit1 > 0))){
            $qb->andWhere('p.precio > ' . $limit1);
            if($limit2 > 0){
                $qb->andWhere('p.precio <= ' . $limit2);
            }
        }
        if($search != ""){
            $qb->andWhere("p.nombre".$locale." LIKE '%" . $search . "%'");
        }
        if(is_numeric($ocasion_id)) {
            $qb->andWhere('(o.id = ' . $ocasion_id.' AND p.boutique = 1) OR (o.id = ' . $ocasion_id.' AND p.boutique = 0)');
            $boutiqueOr = true;
        }
        if($masVendidos){
            $pIds = $this->getProductosMasVendidos();
            if(empty($pIds)){
                return [];
            }
            $qb->andWhere("p.id IN($pIds)");
        }
        if($boutique && !is_numeric($categoria_id)){
            $qb->andWhere('p.categoria != 11');
        }
        if(!$boutiqueOr){
            $qb->andWhere('p.boutique = :boutique');
            $qb->setParameter('boutique',intval($boutique));
        }
        $qb->setParameter('taller',intval($taller))
            ->setParameter('corporativo',intval($corporativo))
            ->setParameter('pret',intval($pret));
        
            
        $productosPrimerFiltro = $qb->getQuery()->getResult();
        // error_log($qb->getQuery()->getSQL().PHP_EOL,3,'log_jimmy.log');
        // error_log(serialize($qb->getQuery()->getParameters()).PHP_EOL,3,'log_jimmy.log');
        // error_log(json_encode(compact('categoria_id','genero_id','search','color_id','ocasion_id','taller','boutique','pret','ciudad','limit1','limit2','masVendidos','corporativo')).PHP_EOL,3,'log_jimmy.log');
        // error_log(json_encode($productosPrimerFiltro).PHP_EOL,3,'log_jimmy.log');

        $micro = microtime(true);
        $productosConStock = [];
        $productosConStock = $this->getStockProducts($productosPrimerFiltro, $almacenes);
        if(empty($productosConStock) && $ses->get('sap_down', false)){
            $productosConStock = $productosPrimerFiltro;
        }
        $micro = microtime(true) - $micro;
        // if(array_key_exists('test_jimmy',$_COOKIE)){
        //     var_dump(func_get_args());
        //     var_dump($productosPrimerFiltro);
        //     var_dump($almacenes);
        //     var_dump($productosConStock);
        //     die();
        // }
        // error_log('Time: '.$micro.'s'.PHP_EOL,3,'log_jimmy.log');

        
        $ids = array();
        foreach ($productosConStock as $id){
            array_push($ids,$id['id']);
        }
        $ids = implode(",",$ids);

        // if($ses->get('sap_down', false)){
        //     $rsm = new ResultSetMapping();
        //     $rsm->addScalarResult('id', 'id', 'integer');
    
        //     $q = "select p.sku,p.nombre_es, a.producto_id, sum(cantidad) cantidad, p.id from inventario_almacen a
        //             left join ciudad_almacen ca on ca.almacen_id = a.almacen_id
        //             left join producto p on p.id = a.producto_id
        //             where ca.ciudad_id is not null
        //             and ca.ciudad_id = $ciudad
        //             and p.visible = 1
        //             and p.id is not null
        //             and p.id in($ids)
        //             group by (producto_id)
        //             having cantidad > 0";
        //     $productosSegundoFiltro = $this->em->createNativeQuery($q, $rsm)->getArrayResult();

        //     $ids = array();
        //     foreach ($productosSegundoFiltro as $id){
        //         array_push($ids,$id['id']);
        //     }
        //     $ids = implode(",",$ids);
        // }

        $qb = $this->em->createQueryBuilder();
        $qb
            ->select('p.id',
                'p.nombre'.$locale.' as nombre',
                'p.descripcion'.$locale.' as descripcion',
                'p.sku as sku',
                'p.precio as precio',
                'ca.id as categoria',
                'i.cantidad as cantidad',
                "concat('".$path."/',p.imagen) as imagen",
                "concat('".$path."/',p.imagenaux) as imagenaux",
                "GROUP_CONCAT(c.id ORDER by p.id SEPARATOR ' ') as colores",
                "GROUP_CONCAT(e.id ORDER by p.id SEPARATOR ' ') as estilos"
            )
            ->from('CarroiridianBundle:Producto', 'p')
            ->leftJoin('p.inventarios', 'i')
            ->leftJoin('p.color','c')
            ->leftJoin('p.estilos','e')
            ->leftJoin('p.categoria','ca')
            ->leftJoin('p.generos','gen')
            ->leftJoin('p.ocaciones','o')
            ->andWhere('p.visible = 1')
            ->andWhere('p.padre is null')
            ->andWhere('p.taller = '.$taller)
            ->andWhere('ca.abasto = 0')
            ->groupBy('p.id');
            
        if(is_numeric($limit1) && is_numeric($limit2) && $limit2 > $limit1){
            $qb->orderBy('p.precio', 'asc');
        }else{
            $qb->orderBy('p.orden', 'asc');
        }
        if($ids != "") {
            $qb->andWhere("p.id in ($ids)");
        }else{
            return [];
        }

        $q = $qb->getQuery();
        // $sql = $q->getSQL();
        // error_log($sql.PHP_EOL,3,'log_jimmy.log');
        $results = $q->getArrayResult();
        return $results;
    }

    public function getProductos($categoria_id = null, $genero_id = null, $search = "", $color_id = null, $ocasion_id = null, $taller = 0,$boutique = false,$pret = false,$limit1=0,$limit2=0,$masVendidos=false,$corporativo=0){
        $session = $this->request_stack->getCurrentRequest()->getSession();
        $ciudad = $session->get('ciudad', 0);
        return $this->getProductosByCiudad($categoria_id,$genero_id,$search,$color_id,$ocasion_id,$taller,$boutique,$pret,$ciudad,$limit1,$limit2,$masVendidos,$corporativo);
    }

    private function getProductosMasVendidos()
    {
        $date = new \DateTime();
        $now = $date->format('Y-m-d');
        $date->modify('-1 month');
        $last = $date->format('Y-m-d');

        $rsm = new ResultSetMapping();
        $rsm->addScalarResult('id', 'id', 'integer');

        $q = "select p.id id from compraitem ci inner join producto p on(p.id = ci.producto_id) inner join compra c on (c.id = ci.compra_id AND c.eatadocarrito_id = 2 AND c.created_at between '$last' AND '$now') group by p.id order by count(p.id) DESC";
        $results = $this->em->createNativeQuery($q, $rsm)->getArrayResult();

        return implode(',',array_column($results,'id'));
    }

    public function getProductosHijos($padre_id = null){
        $locale = $this->request_stack->getCurrentRequest()->getLocale();
        $locale = ucfirst($locale);
        $qb = $this->em->createQueryBuilder();
        $qb
            ->select('p.id',
                'p.nombre'.$locale.' as nombre',
                'p.precio as precio'
            )
            ->from('CarroiridianBundle:Producto', 'p')
            ->andWhere('p.visible = 1')
            ->andWhere('p.padre = '.$padre_id)
            ->groupBy('p.id')
            ->orderBy('p.orden', 'asc');



        $results = $qb->getQuery()->getArrayResult();
        return $results;
    }

    public function getResultadosProductos($term){
        $locale = $this->request_stack->getCurrentRequest()->getLocale();
        $locale = ucfirst($locale);
        $path = $this->container->getParameter('app.path.productos');
        $qb = $this->em->createQueryBuilder();
        $qb
            ->select('p.id','p.nombre'.$locale.' as nombre','p.sku as sku','p.precio as precio', 'ca.id as categoria',
                "concat('".$path."/',p.imagen) as imagen",
                "concat('".$path."/',p.imagenaux) as imagenaux",
                "GROUP_CONCAT(c.id ORDER by p.id SEPARATOR ' ') as colores",
                "GROUP_CONCAT(e.id ORDER by p.id SEPARATOR ' ') as estilos"
            )
            ->from('CarroiridianBundle:Producto', 'p')
            ->leftJoin('p.inventarios', 'i')
            ->leftJoin('p.color','c')
            ->leftJoin('p.estilos','e')
            ->leftJoin('p.categoria','ca')
            ->andWhere('p.visible = 1')
            ->groupBy('p.id')
            ->orderBy('p.orden', 'asc');

        if($term){
            $cad = '';
            $or = '';
            $searches= explode(' ', $term);
            foreach ($searches as $param) {
                $cad .= $or."p.nombreEs like '%".$param."%'";
                $or = ' or ';
                $cad .= $or."p.nombreEn like '%".$param."%'";
                $cad .= $or."p.tags like '%".$param."%'";
                $cad .= $or."ca.nombreEn like '%".$param."%'";
                $cad .= $or."ca.nombreEn like '%".$param."%'";
            }
            $qb->andWhere($cad);
        }

        $results = $qb->getQuery()->getArrayResult();
        return $results;
    }


    public function getProductosNuevos($limit){
        $locale = $this->request_stack->getCurrentRequest()->getLocale();
        $locale = ucfirst($locale);
        $path = $this->container->getParameter('app.path.productos');
        $qb = $this->em->createQueryBuilder();
        $qb
            ->select('p.id','p.nombre'.$locale.' as nombre','p.sku as sku','p.precio as precio', 'ca.id as categoria',
                "concat('".$path."/',p.imagen) as imagen",
                "concat('".$path."/',p.imagenaux) as imagenaux",
                "GROUP_CONCAT(c.id ORDER by p.id SEPARATOR ' ') as colores",
                "GROUP_CONCAT(e.id ORDER by p.id SEPARATOR ' ') as estilos"
            )
            ->from('CarroiridianBundle:Producto', 'p')
            ->leftJoin('p.inventarios', 'i')
            ->leftJoin('p.color','c')
            ->leftJoin('p.estilos','e')
            ->leftJoin('p.categoria','ca')
            ->andWhere('p.visible = 1')
            ->andWhere('p.nuevo = 1')
            ->setMaxResults($limit)
            ->groupBy('p.id')
            ->orderBy('p.orden', 'asc');

        $results = $qb->getQuery()->getArrayResult();
        return $results;
    }

    public function getProductosHome($limit){
        $locale = $this->request_stack->getCurrentRequest()->getLocale();
        $locale = ucfirst($locale);
        $path = $this->container->getParameter('app.path.productos');
        $qb = $this->em->createQueryBuilder();
        $qb
            ->select('p.id','p.nombre'.$locale.' as nombre',
                "concat('".$path."/',p.imagenhome) as imagenhome"
            )
            ->from('CarroiridianBundle:Producto', 'p')
            ->andWhere('p.visible = 1')
            ->andWhere('p.home = 1')
            ->andWhere('p.imagenhome is not null')
            ->setMaxResults($limit)
            ->orderBy('p.ordenhome', 'asc');

        $results = $qb->getQuery()->getArrayResult();
        return $results;
    }

    public function getProductosRecomendados($limit){




        $locale = $this->request_stack->getCurrentRequest()->getLocale();
        $locale = ucfirst($locale);
        $path = $this->container->getParameter('app.path.productos');
        $qb = $this->em->createQueryBuilder();
        $qb
            ->select('p.id','p.nombre'.$locale.' as nombre','p.sku as sku','p.precio as precio', 'ca.id as categoria',
                "concat('".$path."/',p.imagen) as imagen",
                "concat('".$path."/',p.imagenaux) as imagenaux",
                "GROUP_CONCAT(c.id ORDER by p.id SEPARATOR ' ') as colores",
                "GROUP_CONCAT(e.id ORDER by p.id SEPARATOR ' ') as estilos"
            )
            ->from('CarroiridianBundle:Producto', 'p')
            ->leftJoin('p.inventarios', 'i')
            ->leftJoin('p.color','c')
            ->leftJoin('p.estilos','e')
            ->leftJoin('p.categoria','ca')
            ->andWhere('p.visible = 1')
            ->andWhere('p.recomendado = 1')
            ->setMaxResults($limit)
            ->groupBy('p.id')
            ->orderBy('p.orden', 'asc');



        $results = $qb->getQuery()->getArrayResult();
        return $results;
    }


    public function getProductosRelacionados($id,$limit){
        $session = $this->request_stack->getCurrentRequest()->getSession();
        $ciudad = $session->get('ciudad', 0);
        $rsm = new ResultSetMapping();
        $rsm->addScalarResult('id', 'id', 'integer');

        $q = "select p.sku,p.nombre_es, a.producto_id, sum(cantidad) cantidad, p.id from inventario_almacen a
                left join ciudad_almacen ca on ca.almacen_id = a.almacen_id
                left join producto p on p.id = a.producto_id
                where ca.ciudad_id is not null
                and ca.ciudad_id = $ciudad
                and p.visible = 1
                and p.id is not null
                group by (producto_id)
                having cantidad > 0";
        $results = $this->em->createNativeQuery($q, $rsm)->getArrayResult();


        $ids = array();
        foreach ($results as $idm){
            array_push($ids,$idm['id']);
        }
        $ids = implode(",",$ids);


        $producto = $this->em->getRepository('CarroiridianBundle:Producto')->find($id);
        $locale = $this->request_stack->getCurrentRequest()->getLocale();
        $locale = ucfirst($locale);



        $path = $this->container->getParameter('app.path.productos');

        $qb = $this->em->createQueryBuilder();
        $qb
            ->select('p.id','p.nombre'.$locale.' as nombre','p.sku as sku','p.precio as precio', 'ca.id as categoria',
                "concat('".$path."/',p.imagen) as imagen",
                "concat('".$path."/',p.imagenaux) as imagenaux",
                "GROUP_CONCAT(c.id ORDER by p.id SEPARATOR ' ') as colores",
                "GROUP_CONCAT(e.id ORDER by p.id SEPARATOR ' ') as estilos"
            )
            ->from('CarroiridianBundle:Producto', 'p')
            ->leftJoin('p.inventarios', 'i')
            ->leftJoin('p.color','c')
            ->leftJoin('p.estilos','e')
            ->leftJoin('p.categoria','ca')
            ->andWhere('p.visible = 1')
            ->andWhere('p.id != '.$id)
            ->setMaxResults($limit)
            ->groupBy('p.id')
            ->orderBy('RAND(p.id)', 'asc');
        if($producto->getCategoria()){
            $qb
                ->andWhere('p.categoria = :id_categoria')
                ->setParameter('id_categoria',$producto->getCategoria()->getId());
        }
        if($ids != "")
            $qb->andWhere("p.id in ($ids)");


        $results = $qb->getQuery()->getArrayResult();
        return $results;
    }

    public function getProductosComplementos(){
        $locale = $this->request_stack->getCurrentRequest()->getLocale();
        $locale = ucfirst($locale);
        // if($this->request_stack->getCurrentRequest()->get('jimmy',null)){

        $qb = $this->em->createQueryBuilder();
        $qb
            ->select('p.id','p.sap','p.siempreDisponible')
            ->from('CarroiridianBundle:Producto', 'p')
            ->andWhere('p.visible = 1')
            ->andWhere('p.categoria = 5');
            
        $productosPrimerFiltro = $qb->getQuery()->getResult();
        
        
        $ses = new Session();
        $almacenes = $ses->get('almacenes',array());
        
        $productosConStock = [];
        $productosConStock = $this->getStockProducts($productosPrimerFiltro, $almacenes);
        if(empty($productosConStock) && $ses->get('sap_down', false)){
            $productosConStock = $productosPrimerFiltro;
        }
        $productoSiempre = array_filter($productosPrimerFiltro,function($p){
            return $p['siempreDisponible'];
        });
        $productosConStock = array_merge($productoSiempre, $productosConStock);

        if(empty($productosConStock)){
            return [];
        }
        
        $ids = array();
        foreach ($productosConStock as $id){
            array_push($ids,$id['id']);
        }
        $ids = implode(",",$ids);


        $path = $this->container->getParameter('app.path.productos');
        $qb = $this->em->createQueryBuilder();
        $qb
            ->select('p.id',
                'p.nombre'.$locale.' as nombre',
                'p.sku as sku',
                'p.precio as precio',
                'ca.id as categoria',
                'i.cantidad as cantidad',
                "concat('".$path."/',p.imagen) as imagen",
                "concat('".$path."/',p.imagenaux) as imagenaux",
                "GROUP_CONCAT(c.id ORDER by p.id SEPARATOR ' ') as colores",
                "GROUP_CONCAT(e.id ORDER by p.id SEPARATOR ' ') as estilos"
            )
            ->from('CarroiridianBundle:Producto', 'p')
            ->leftJoin('p.inventarios', 'i')
            ->leftJoin('p.colores','c')
            ->leftJoin('p.estilos','e')
            ->leftJoin('p.categoria','ca')
            ->leftJoin('p.generos','gen')
            ->leftJoin('p.ocaciones','o')
            ->andWhere('p.visible = 1')
            ->andWhere('p.categoria = 5')
            ->andWhere("p.id in ($ids)")
            ->groupBy('p.id')
            ->orderBy('p.orden', 'asc');

        $results = $qb->getQuery()->getArrayResult();
        return $results;

        // $path = $this->container->getParameter('app.path.productos');
        // $qb = $this->em->createQueryBuilder();
        // $qb
        //     ->select('p.id',
        //         'p.nombre'.$locale.' as nombre',
        //         'p.sku as sku',
        //         'p.precio as precio',
        //         'ca.id as categoria',
        //         'i.cantidad as cantidad',
        //         "concat('".$path."/',p.imagen) as imagen",
        //         "concat('".$path."/',p.imagenaux) as imagenaux",
        //         "GROUP_CONCAT(c.id ORDER by p.id SEPARATOR ' ') as colores",
        //         "GROUP_CONCAT(e.id ORDER by p.id SEPARATOR ' ') as estilos"
        //     )
        //     ->from('CarroiridianBundle:Producto', 'p')
        //     ->leftJoin('p.inventarios', 'i')
        //     ->leftJoin('p.colores','c')
        //     ->leftJoin('p.estilos','e')
        //     ->leftJoin('p.categoria','ca')
        //     ->leftJoin('p.generos','gen')
        //     ->leftJoin('p.ocaciones','o')
        //     ->andWhere('p.visible = 1')
        //     ->andWhere('p.categoria = 5')
        //     ->groupBy('p.id')
        //     ->orderBy('RAND(p.id)', 'asc');

        // $results = $qb->getQuery()->getArrayResult();
        
        // return $results;
    }

    public function getProductoCalificacion($producto,$user_id)
    {
        $em = $this->em;
        $repo = $em->getRepository('CarroiridianBundle:Calificacion');
        $calificacion = $repo->findOneBy(array('producto'=>$producto,'user'=>$user_id));
        if($calificacion == null){
            return 8;
        }else{
         return $calificacion->getCalificacion();
        }
    }

    public function getCategorias($principal = 1,$abasto = 0,$pret = 0){
        $locale = $this->request_stack->getCurrentRequest()->getLocale();
        $locale = ucfirst($locale);
        $path = $this->container->getParameter('app.path.productos');
        $qb = $this->em->createQueryBuilder();
        $qb
            ->select('p.id','p.nombre'.$locale.' as nombre',"concat('".$path."/',p.imagen) as imagen",'p.resumen'.$locale.' as resumen')
            ->from('CarroiridianBundle:Categoria', 'p')
            ->andWhere('p.visible = 1')
            ->andWhere('p.principal = '.$principal)
            ->andWhere('p.abasto = '.$abasto)
            ->andWhere('p.pret = '.$pret)
            ->orderBy('p.orden', 'asc');
        $results = $qb->getQuery()->getArrayResult();
        return $results;
    }

    public function getGeneros(){
        $locale = $this->request_stack->getCurrentRequest()->getLocale();
        $locale = ucfirst($locale);
        $qb = $this->em->createQueryBuilder();
        $qb
            ->select('p.id','p.nombre'.$locale.' as nombre', 'p.imagen')
            ->from('CarroiridianBundle:Genero', 'p')
            ->andWhere('p.visible = 1')
            ->orderBy('p.orden', 'asc');

        $results = $qb->getQuery()->getArrayResult();
        return $results;
    }

    public function getColores(){

        $locale = $this->request_stack->getCurrentRequest()->getLocale();
        $locale = ucfirst($locale);
        $path = $this->container->getParameter('app.path.imagesgal');
        $qb = $this->em->createQueryBuilder();
        $qb
        ->select('p.id','p.nombre'.$locale.' as nombre','p.hexa as hexa',"concat('".$path."/',p.imagen) as imagen")
        ->from('CarroiridianBundle:Color', 'p')
        ->andWhere('p.visible = 1')
        ->orderBy('p.orden', 'asc');
        $query = $qb->getQuery();
        $sql = $query->getSQL();
        $results = $query->getArrayResult();
        // error_log(PHP_EOL.$locale.' SQL: '.$sql.PHP_EOL.' JSON:'. json_encode($results,JSON_PRETTY_PRINT),3,'log_jimmy.log');
        return $results;
    }

    public function getOcasiones(){
        $locale = $this->request_stack->getCurrentRequest()->getLocale();
        $locale = ucfirst($locale);
        $path = $this->container->getParameter('app.path.imagesgal');
        $qb = $this->em->createQueryBuilder();
        $qb
            ->select('p.id','p.nombre'.$locale.' as nombre')
            ->from('CarroiridianBundle:Ocasion', 'p')
            ->andWhere('p.visible = 1')
            ->orderBy('p.orden', 'asc');

        $results = $qb->getQuery()->getArrayResult();
        return $results;
    }

    public function getEstilos(){
        $locale = $this->request_stack->getCurrentRequest()->getLocale();
        $locale = ucfirst($locale);
        $qb = $this->em->createQueryBuilder();
        $qb
            ->select('p.id','p.nombre'.$locale.' as nombre')
            ->from('CarroiridianBundle:Estilo', 'p')
            ->andWhere('p.visible = 1')
            ->orderBy('p.orden', 'asc');

        $results = $qb->getQuery()->getArrayResult();
        return $results;
    }

    public function getTallasProducto($id){

        $session = $this->request_stack->getCurrentRequest()->getSession();
        $ciudad = $session->get('ciudad', 0);
        $locale = $this->request_stack->getCurrentRequest()->getLocale();

        $rsm = new ResultSetMapping();
        $rsm->addScalarResult('id', 'id', 'integer');
        $rsm->addScalarResult('cantidad', 'cantidad', 'integer');
        $rsm->addScalarResult('nombre', 'nombre', 'string');
        $rsm->addScalarResult('precio', 'precio', 'string');
        $results = $this->em->createNativeQuery("
            SELECT t.id,t.cantidad, t.nombre_$locale nombre,ia.precio
            FROM inventario ia
            LEFT JOIN talla t ON t.id = ia.talla_id
            LEFT JOIN producto p ON p.id = ia.producto_id
            WHERE p.id = $id
            AND ia.cantidad >0
            GROUP BY t.id
        ", $rsm)->getArrayResult();

        return $results;
    }

    public function getTallasColoresProductoByCiudad($id,$ciudad,$always=false)
    {
        $locale = $this->request_stack->getCurrentRequest()->getLocale();
        $locale = ucfirst($locale);

        $results = array();
        //FROM web_iridian.inventario_almacen a
        // error_log(PHP_EOL.'Tallas ciudad: '.$ciudad,3,'log_jimmy.log');
        if($ciudad != 0){
            $ses = new Session();
            $almacenes = $ses->get('almacenes',array());
            if(empty($almacenes)){
                $almacenes = $this->getAlmacenesCiudad($ciudad);
            }
            
            $producto = $this->em->getRepository('CarroiridianBundle:Producto')->find($id);
            $colores = $producto->getColores();

            $coloresSKUs = [];
            foreach ($colores as $key => $color) {
                if($color->getVisible()){
                    $coloresSKUs[] = [
                        'id' => $color->getId(),
                        'sap' => $color->getSku(),
                        'stock'=>0
                    ];
                }
            }

            // $coloresSKUs = array_map(function($color){
            //     return [
            //         'id' => $color->getId(),
            //         'sap' => $color->getSku()
            //     ];
            // },$colores);
            $micro = microtime(true);
            if(!$always){
                $coloresConStock = $this->getStockColors($coloresSKUs, $almacenes);
                if(empty($coloresConStock) && $ses->get('sap_down', false)){
                    $coloresConStock = $coloresSKUs;
                    $cColores = count($coloresConStock);
                    for ($i=0; $i < $cColores; $i++) { 
                        $coloresConStock[$i]['stock'] = 999;
                    }
                }
            }else{
                $coloresConStock = $coloresSKUs;
                $cColores = count($coloresConStock);
                for ($i=0; $i < $cColores; $i++) { 
                    $coloresConStock[$i]['stock'] = 999;
                }
                // if(array_key_exists('test_jimmy',$_COOKIE)){
                //     var_dump($coloresConStock);
                //     die();
                // }
            }
            $micro = microtime(true) - $micro;
            // error_log('Time color:'.$micro.PHP_EOL,3,'log_jimmy.log');

            $query = "SELECT i.talla_id id, t.cantidad cantidad from inventario i left join talla t on t.id = i.talla_id where i.producto_id = $id AND precio > 0";

            // $query = "SELECT i.talla_id id,GROUP_CONCAT(a.color_id ORDER by a.color_id SEPARATOR ' ') as colores  FROM inventario i
            //     left join (
            //     SELECT $id as producto_id, a.color_id, sum(a.cantidad) as cantidad
                
            //     FROM inventario_almacen a 
            //     left join ciudad_almacen ca on ca.almacen_id = a.almacen_id
            //     where a.color_id is not null
            //     and a.color_id in(select pc.color_id from producto_color pc where pc.producto_id = $id)
            //     and ca.ciudad_id = $ciudad
            //     and ca.ciudad_id is not null
            //     group by concat(a.color_id,a.talla_id)
            //     ) a on a.producto_id = i.producto_id
            //     left join talla t on t.id = i.talla_id
            //      where i.producto_id = $id and precio > 0
            //      and a.cantidad > t.cantidad
            //      group by i.talla_id";
            // error_log(PHP_EOL.'SQL: '.$query,3,'log_jimmy.log');
            $rsm = new ResultSetMapping();
            $rsm->addScalarResult('id', 'id', 'integer');
            $rsm->addScalarResult('cantidad', 'cantidad', 'integer');
            // $rsm->addScalarResult('colores', 'colores', 'string');
            $tallas = $this->em->createNativeQuery($query, $rsm)->getArrayResult();
            $results = array_map(function($talla) use($coloresConStock){
                $colores = array_filter($coloresConStock,function($color) use($talla){
                    return $color['stock'] >= $talla['cantidad'];
                });
                $talla['colores'] = implode(' ',array_column($colores,'id'));
                return $talla;
            },$tallas);
            // if(array_key_exists('test_jimmy',$_COOKIE)){
            //     var_dump($results);
            //     var_dump(func_get_args());
            // }
            /*
            $qb = $this->em->createQueryBuilder();
            $qb
                ->select('t.id','t.nombre'.$locale.' as nombre',"GROUP_CONCAT(c.id ORDER by c.id SEPARATOR ' ') as colores")
                ->from('CarroiridianBundle:Producto', 'p','p.id')
                ->leftJoin('p.inventariosalmacen', 'i')
                ->leftJoin('i.talla','t')
                ->leftJoin('i.color','c')
                ->leftJoin('i.almacen','a')
                ->andWhere('p.id = :id')
                ->andWhere('a.id = :ciudad')
                ->andWhere('t.id is not null')
                ->andWhere('i.cantidad > 0')
                ->setParameter('id', $id)
                ->setParameter('ciudad', $ciudad)
                ->groupBy('t.id')
                ->orderBy('t.orden', 'asc');
            $results = $qb->getQuery()->getArrayResult();
            */
        }

        return $results;
    }

    public function getTallasColoresProducto($id,$always = false){
        //return array();
        $request = $this->request_stack->getCurrentRequest();
        // error_log(PHP_EOL.'Request: '.json_encode($request),3,'log_jimmy.log');
        $session = $this->request_stack->getCurrentRequest()->getSession();
        $ciudad = $session->get('ciudad', 0);
        return $this->getTallasColoresProductoByCiudad($id,$ciudad,$always);

    }

    public function getTallaUnicaProducto($id){

        $locale = $this->request_stack->getCurrentRequest()->getLocale();
        $locale = ucfirst($locale);
        $qb = $this->em->createQueryBuilder();
        $qb
            ->select('t.id','t.nombre'.$locale.' as nombre')
            ->from('CarroiridianBundle:Producto', 'p')
            ->leftJoin('p.inventarios', 'i')
            ->leftJoin('i.talla','t')
            ->andWhere('p.id = :id')
            ->andWhere('t.id is not null')
            ->andWhere('i.cantidad > 0')
            ->setParameter('id', $id)
            ->groupBy('t.id')
            ->orderBy('t.orden', 'asc');
        $results = $qb->getQuery()->getArrayResult();
        if(count($results) == 1)
        {
            foreach ($results as $result){
                if($result['id'] == 1)
                    return true;
            }

        }

        return false;
    }

    /**
     * @param $id id del producto
     * @param $id_talla id de la talla
     * @return \CarroiridianBundle\Entity\Inventario
     */
    public function getInventario($id,$id_talla){
        /*
        $qb = $this->em->getRepository('CarroiridianBundle:Inventario')
            ->findOneBy(array('producto'=>$id,'talla'=>$id_talla));
        */
        $inventario = new Inventario();
        $inventario->setCantidad(10);
        return $inventario;
    }

    /**
     * @return \GeoBundle\Entity\CiudadSede[]
     */
    public function getCiudades(){
        $ciudades = $this->em->getRepository('GeoBundle:CiudadSede')->findBy(array('visible'=>true),array('orden'=>'asc'));
        return $ciudades;
    }

    /**
     * @return \GeoBundle\Entity\CiudadSede[]
     */
    public function getCiudadesEnvio(){
        $ciudades = $this->em->getRepository('CarroiridianBundle:Ciudad')->findBy(array('visible'=>true,'envio'=>true),array('nombre'=>'asc'));
        return $ciudades;
    }

    /**
     *
     * @return \GeoBundle\Entity\Sede[]
     */
    public function getSedes(){
        $sedes = $this->em->getRepository('GeoBundle:Sede')->findBy(array('visible'=>true),array('orden'=>'asc'));
        return $sedes;
    }

    /**
     * @param $id id de la ciudad
     * @return \GeoBundle\Entity\Sede[]
     */
    public function getSedesCiudad($id){
        $sedes = $this->em->getRepository('GeoBundle:Sede')->findBy(array('visible'=>true,'ciudad'=>$id),array('orden'=>'asc'));
        return $sedes;
    }




    public function getById($tabla,$campo,$id){
        $out = $this->em->getRepository($tabla)->findBy(array($campo=>$id),array('orden'=>'asc'));
        return $out;
    }

    /**
     * @param integer $taller
     * @return \CarroiridianBundle\Entity\Taller
     */
    public function getTallerProximaFecha($tallerID)
    {
        $qb = $this->em->createQueryBuilder();
        date_default_timezone_set('America/Bogota');
        $now = new \DateTime();
        $qb->select('t')
            ->from('CarroiridianBundle:Taller', 't')
            ->where('t.fecha > :now')
            ->andWhere('t.taller = :taller')
            ->setParameter('now',$now->format('Y-m-d'))
            ->setParameter('taller',$tallerID)
            ->orderBy('t.fecha', 'asc')
            ->setMaxResults(1);
        $q = $qb->getQuery();
        $proximoTaller = $q->getOneOrNullResult();
        $fecha = null;
        if($proximoTaller){
            $fecha = $proximoTaller->__toString();
        }
        return $fecha;
    }
    
    /**
     * @param integer $taller
     * @return \CarroiridianBundle\Entity\Taller[]
     */
    public function getTallerProximasFechas($tallerID)
    {
        $qb = $this->em->createQueryBuilder();
        date_default_timezone_set('America/Bogota');
        $now = new \DateTime();
        $qb->select('t')
            ->from('CarroiridianBundle:Taller', 't')
            ->where('t.fecha > :now')
            ->andWhere('t.taller = :taller')
            ->setParameter('now',$now->format('Y-m-d'))
            ->setParameter('taller',$tallerID)
            ->orderBy('t.fecha', 'asc');
        $q = $qb->getQuery();
        $proximosTalleres = $q->getResult();
        return $proximosTalleres;
    }

    public function getPlan($id)
    {
        $plan = $this->em->getRepository('CarroiridianBundle:Categoria')->find($id);
        return $plan;
    }
    
    public function getConfigPlan($id)
    {
        $plan = $this->em->getRepository('CarroiridianBundle:ConfiguracionPlan')->findBy(['tipoPlan'=>$id]);
        return $plan;
    }

    public function getAlmacenesCiudad($ciudad_id)
    {
        $rsm = new ResultSetMapping();
        $rsm->addScalarResult('id', 'id', 'integer');
        $rsm->addScalarResult('nombre', 'nombre', 'string');

        $q = "SELECT a.nombre, a.id FROM almacen as a INNER join ciudad_almacen ca ON(ca.almacen_id = a.id AND ca.ciudad_id = $ciudad_id)";

        $results = $this->em->createNativeQuery($q, $rsm)->getArrayResult();
        return $results;
    }

    public function getTamanos($plan_id)
    {
        $qb = $this->em->createQueryBuilder();
        $results = $qb->from('CarroiridianBundle:PrecioPlan','p')
            ->select('p')
            ->innerJoin('p.tamano','t')
            ->innerJoin('p.plan','pr')
            ->innerJoin('pr.categoria','c',\Doctrine\ORM\Query\Expr\Join::WITH,'c.id = '.$plan_id)
            ->getQuery()
            // ->getSQL();
            ->getResult();
        // error_log($results.PHP_EOL,3,'log_jimmy.log');
        // $tamanos = $this->em->getRepository('CarroiridianBundle:Tamano')->findAll();
        return $results;
    }

    public function getNohabil($limitDate,$retString=false)
    {
        $qb = $this->em->createQueryBuilder();
        date_default_timezone_set('America/Bogota');
        $now = date('Y-m-d');
        $qb->select('n')
            ->from('AppBundle:Nohabil','n')
            ->where('n.dia > :now')
            ->andWhere('n.dia < :limit')
            ->setParameter('now',$now)
            ->setParameter('limit',$limitDate);
        
        $nohabiles = $qb->getQuery()->getArrayResult();
        if($retString){
            $dias = array_column($nohabiles,'dia');
            $dias = array_map(function($dia){
                return $dia->format('Y-m-d');
            },$dias);
            return json_encode($dias);
        }else{
            return $nohabiles;
        }
    }

    public function getFlores()
    {
        $flores = $this->em->getRepository('CarroiridianBundle:Flor')->findAll();
        return $flores;
    }

    public function getFloreros()
    {
        $floreros = $this->em->getRepository('CarroiridianBundle:Florero')->findAll();
        return $floreros;
    }

    public function getStockProducts($productos, $almacenes)
    {
        if(empty($productos) || empty($almacenes)){
            return [];
        }
        $almacenesArr = [];
        foreach ($almacenes as $key => $almacen) {
            $almacenesArr[] = $almacen['nombre'];
        }
        $almacenesStr = "'".implode("','",$almacenesArr)."'";
        
        $productosArr = [];
        $newProductos = [];
        foreach ($productos as $key => $producto) {
            if(!in_array($producto['sap'],$productosArr)){
                $newProductos[] = $producto;
                $productosArr[] = $producto['sap'];
            }
        }
        if(count($newProductos) > 20){
            $productosConStock1 = $this->getStockProducts(array_slice($newProductos,0,20), $almacenes);
            $productosConStock2 = $this->getStockProducts(array_slice($newProductos,20), $almacenes);
            return array_merge($productosConStock1,$productosConStock2);
        }
        $productosStr = "'".implode("','",$productosArr)."'";

        
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "13027",
            CURLOPT_URL => "http://45.163.28.59:13027/SIC.asmx",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $this->getSAPStockBody($productosStr,$almacenesStr,'STOCK_MASIVO'),
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/soap+xml;charset=UTF-8;action=\"http://SIC/GetInfo_SAP\"",
                "cache-control: no-cache"
            ),
        ));
        // comentado por error
        // $response = curl_exec($curl);
        $response = '';
        // $err = curl_error($curl);
        
        $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        // $httpcode = 200;
        $defTimeZone = date_default_timezone_get();
        date_default_timezone_set('America/Bogota');
        $dateLog = date('Y-m-d H:i:s');
        if ($httpcode !== 200) {
            $ses = new Session();
            $ses->set('sap_down', true);
            error_log("[$dateLog] - SAP failed Code Oreka: $httpcode\n",3,'log_sap.log');
            error_log("[$dateLog] - SAP failed Code Oreka: $httpcode\n datos enviados: $productosStr\n Almacenes: $almacenesStr\n erro:$err\n curl:$curl\n",3,'log_Oreka.log');
            // echo $this->getSAPStockBody($productosStr,$almacenesStr,'STOCK_MASIVO');
            // echo $response;
            // print_r($productosStr);
            // die(print_r($almacenesStr));
            return [];
        }else{
            error_log("[$dateLog] - SAP success\n",3,'log_sap.log');
            $ses = new Session();
            $ses->set('sap_down', false);
        }
        date_default_timezone_set($defTimeZone);

        $response = str_replace(['<soap:Body>','</soap:Body>'],['',''],$response);
        // die(print_r($response));
        $xml = new \SimpleXMLElement($response);
        $productosConStock = [];
        $simpleProductosConStock = [];
        if(isset($xml->GetInfo_SAPResponse->GetInfo_SAPResult)){
            foreach ($xml->GetInfo_SAPResponse->GetInfo_SAPResult->ItemCode->row as $key => $result) {
                $stock = intval($result->Stock);
                $stockStr = $result->Stock->__toString();
                $itemCode = $result->ItemCode->__toString();
                $almCode = $result->WhsCode->__toString();
                // error_log("$itemCode - $almCode: $stock $stockStr\n",3,'log_jimmy.log');
                if(intval($result->Stock)){
                    if(!in_array($itemCode,$simpleProductosConStock)){
                        $index = array_search($itemCode,$productosArr);
                        if(!array_key_exists('stock',$newProductos[$index])){
                            $newProductos[$index]['stock'] = 0;
                        }
                        $newProductos[$index]['stock'] = $newProductos[$index]['stock'] + $result->Stock;
                        array_push($productosConStock,$newProductos[$index]);
                        array_push($simpleProductosConStock,$itemCode);
                    }
                }
            }
            return $productosConStock;
        }else{
            return [];
        }
    }


    public function getStockColors($colores, $almacenes)
    {
        if(empty($colores) || empty($almacenes)){
            return [];
        }
        $almacenesArr = [];
        foreach ($almacenes as $key => $almacen) {
            $almacenesArr[] = $almacen['nombre'];
        }
        $almacenesStr = "'".implode("','",$almacenesArr)."'";
        
        $coloresArr = [];
        $newcolores = [];
        foreach ($colores as $key => $color) {
            if(!in_array($color['sap'],$coloresArr)){
                $newcolores[] = $color;
                $coloresArr[] = str_replace(',',"','",$color['sap']);
            }
        }
        $coloresStr = "'".implode("','",$coloresArr)."'";

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_PORT => "13027",
            CURLOPT_URL => "http://45.163.28.59:13027/SIC.asmx",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $this->getSAPStockBody($coloresStr,$almacenesStr,'STOCK_MASIVO'),
            CURLOPT_HTTPHEADER => array(
                "Content-Type: text/xml",
                "cache-control: no-cache"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        if ($httpcode !== 200) {
            $ses = new Session();
            $ses->set('sap_down', true);
            // die(print_r($coloresStr));
            return [];
        }else{
            $ses = new Session();
            $ses->set('sap_down', false);
        }

        $response = str_replace(['<soap:Body>','</soap:Body>'],['',''],$response);
        $xml = new \SimpleXMLElement($response);
        $productosConStock = [];

        if(isset($xml->GetInfo_SAPResponse->GetInfo_SAPResult)){
            foreach ($xml->GetInfo_SAPResponse->GetInfo_SAPResult->ItemCode->row as $key => $result) {
                $stock = intval($result->Stock);
                $itemCode = $result->ItemCode->__toString();
                $almCode = $result->WhsCode->__toString();
                $index = $this->searchColor($itemCode,$coloresArr);
                if($index > -1) {
                    $newcolores[$index]['stock'] += $newcolores[$index]['stock'] + $stock;
                }
            }
            $productosConStock = array_filter($newcolores, function($color){
                return ($color['stock'] > 0);
            });
            return $productosConStock;
        }else{
            return [];
        }
    }

    /**
     * Search sku in array with multiples skus color
     *
     * @param string $colorSku
     * @param array $colors
     * @return int
     */
    private function searchColor($colorSku,$colors){
        foreach ($colors as $key => $colorSkus) {
            $colorArray = explode(',',str_replace("','",',',$colorSkus));
            if(in_array($colorSku,$colorArray)){
                return $key;
            }
        }
        return -1;
    }

    private function getSAPStockBody($sku,$almacen,$type="STOCK"){
        return "<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:sic=\"http://SIC/\">\r\n<soap:Header/>\r\n<soap:Body>\r\n<sic:GetInfo_SAP>\r\n<sic:AdminInfo>\r\n<sic:IDDB>10000101</sic:IDDB>\r\n<sic:Token>EB18D5439C45212BEBA999DD150B4744</sic:Token>\r\n<sic:Query>$type</sic:Query>\r\n</sic:AdminInfo>\r\n<sic:Parametros>\r\n<sic:Parametro1>$sku</sic:Parametro1>\r\n<sic:Parametro2>$almacen</sic:Parametro2>\r\n<sic:Parametro3></sic:Parametro3>\r\n</sic:Parametros>\r\n</sic:GetInfo_SAP>\r\n</soap:Body>\r\n</soap:Envelope>";
    }

    public function getConEnvio()
    {
        $ses = new Session();
        $carrito = $ses->get('carrito', array());
        foreach ($carrito as $key => $padre) {
            foreach ($padre as $key => $producto) {
                if($producto['cantidad'] && $producto['color_sku'] != 'es_taller'){
                    return true;
                }
            }
        }
        return false;
    }

    public function getConDedicatoria()
    {
        $ses = new Session();
        $carrito = $ses->get('carrito', array());
        foreach ($carrito as $key => $padre) {
            foreach ($padre as $key => $producto) {
                if($producto['cantidad'] && !in_array($producto['color_sku'],['es_taller','es_plan','f_plan']) ){
                    return true;
                }
            }
        }
        return false;
    }

    public function getPlanFecha()
    {
        $ses = new Session();
        $carrito = $ses->get('carrito', array());
        foreach ($carrito as $key => $padre) {
            foreach ($padre as $key => $producto) {
                if($producto['cantidad'] && $producto['color_sku'] == 'es_plan' ){
                    return $producto['fecha'];
                }
            }
        }
        return null;
    }

    public function getPlanes($corporativo)
    {
        $locale = $this->request_stack->getCurrentRequest()->getLocale();
        $locale = ucfirst($locale);
        $path = $this->container->getParameter('app.path.productos');
        $qb = $this->em->createQueryBuilder();
        $qb->select('c.id','c.nombre'.$locale.' as nombre',"concat('".$path."/',c.imagen) as imagen",'c.resumen'.$locale.' as resumen')
            ->from("CarroiridianBundle:ConfiguracionPlan","con")
            ->innerJoin("con.tipoPlan","c")
            ->andWhere('c.visible = 1')
            ->andWhere('c.principal = 0')
            ->andWhere('c.abasto = 1')
            ->andWhere('c.pret = 0')
            ->andWhere('con.corporativo = '.intval($corporativo))
            ->orderBy('c.orden', 'asc');

        $results = $qb->getQuery()->getArrayResult();
        return $results;
    }
    public function getCategoriaById($id)
    {
        $locale = $this->request_stack->getCurrentRequest()->getLocale();
        $locale = ucfirst($locale);
        $path = $this->container->getParameter('app.path.productos');
        $qb = $this->em->createQueryBuilder();
        $qb
            ->select('p.id','p.nombre'.$locale.' as nombre',"concat('".$path."/',p.imagen) as imagen",'p.resumen'.$locale.' as resumen')
            ->from('CarroiridianBundle:Categoria', 'p')
            ->where('p.id = '.$id)
            ->orderBy('p.orden', 'asc');
        $results = $qb->getQuery()->getArrayResult();
        return $results[0];
    }
    
    public function getRangosPrecio()
    {
        return $this->em->getRepository("CarroiridianBundle:RangoPrecio")->findAll();

    }
}
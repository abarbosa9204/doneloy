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

    public function getProductosByCiudad($categoria_id = null, $genero_id = null, $search = "", $color_id = null, $ocasion_id = null, $taller = 0,$boutique = false,$pret = false,$ciudad=0){
        $locale = $this->request_stack->getCurrentRequest()->getLocale();
        $locale = ucfirst($locale);
        $path = $this->container->getParameter('app.path.productos');


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
        foreach ($results as $id){
            array_push($ids,$id['id']);
        }
        $ids = implode(",",$ids);

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
            ->groupBy('p.id')
            ->orderBy('p.orden', 'asc');

        if(is_numeric($categoria_id)) {
            $qb->andWhere('p.categoria = ' . $categoria_id);
        }
        if(is_numeric($color_id)) {
            $qb->andWhere('c.id = ' . $color_id);
        }
        if(is_numeric($genero_id)) {
            $qb->andWhere('gen.id = ' . $genero_id);
        }
        if($search != ""){
            $qb->andWhere("p.nombre".$locale." LIKE '%" . $search . "%'");
        }
        if(is_numeric($ocasion_id)) {
            $qb->andWhere('o.id = ' . $ocasion_id);
        }
        if($boutique){
            $qb->andWhere('p.boutique = 1');
        }else{
            $qb->andWhere('p.boutique = 0');
        }
        if($pret){
            $qb->andWhere('p.pret = 1');
        }else{
            $qb->andWhere('p.pret = 0');
        }
        if($ids != "")
            $qb->andWhere("p.id in ($ids)");

        $results = $qb->getQuery()->getArrayResult();
        return $results;
    }

    public function getProductos($categoria_id = null, $genero_id = null, $search = "", $color_id = null, $ocasion_id = null, $taller = 0,$boutique = false,$pret = false){
        $session = $this->request_stack->getCurrentRequest()->getSession();
        $ciudad = $session->get('ciudad', 0);
        return $this->getProductosByCiudad($categoria_id,$genero_id,$search,$color_id,$ocasion_id,$taller,$boutique,$pret,$ciudad);
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
            ->groupBy('p.id')
            ->orderBy('RAND(p.id)', 'asc');

        $results = $qb->getQuery()->getArrayResult();
        return $results;
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

        $results = $qb->getQuery()->getArrayResult();
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

    public function getTallasColoresProductoByCiudad($id,$ciudad)
    {
        $locale = $this->request_stack->getCurrentRequest()->getLocale();
        $locale = ucfirst($locale);

        $results = array();
        //FROM web_iridian.inventario_almacen a
        if($ciudad != 0){
            $query = "SELECT i.talla_id id,GROUP_CONCAT(a.color_id ORDER by a.color_id SEPARATOR ' ') as colores  FROM inventario i
                left join (
                SELECT $id as producto_id, a.color_id, sum(a.cantidad) as cantidad
                
                FROM inventario_almacen a 
                left join ciudad_almacen ca on ca.almacen_id = a.almacen_id
                where a.color_id is not null
                and a.color_id in(select pc.color_id from producto_color pc where pc.producto_id = $id)
                and ca.ciudad_id = $ciudad
                and ca.ciudad_id is not null
                group by concat(a.color_id,a.talla_id)
                ) a on a.producto_id = i.producto_id
                left join talla t on t.id = i.talla_id
                 where i.producto_id = $id and precio > 0
                 and a.cantidad > t.cantidad
                 group by i.talla_id";
            $rsm = new ResultSetMapping();
            $rsm->addScalarResult('id', 'id', 'integer');
            $rsm->addScalarResult('colores', 'colores', 'string');
            $results = $this->em->createNativeQuery($query, $rsm)->getArrayResult();
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

    public function getTallasColoresProducto($id){
        //return array();
        $session = $this->request_stack->getCurrentRequest()->getSession();
        $ciudad = $session->get('ciudad', 0);
        return $this->getTallasColoresProductoByCiudad($id,$ciudad);

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



}
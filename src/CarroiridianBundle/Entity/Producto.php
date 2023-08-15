<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping\JoinTable;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * Producto
 *
 * @ORM\Table(name="producto")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\ProductoRepository")
 * @Vich\Uploadable
 */
class Producto
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\OneToMany(targetEntity="CarroiridianBundle\Entity\Galeriaproducto", mappedBy="producto")
     */
    private $galerias;

    /**
     * @ORM\OneToMany(targetEntity="CarroiridianBundle\Entity\Inventario", mappedBy="producto")
     */
    private $inventarios;

    /**
     * @ORM\OneToMany(targetEntity="CarroiridianBundle\Entity\InventarioAlmacen", mappedBy="producto")
     */
    private $inventariosalmacen;

    /**
     * @var Genero[]
     * @ORM\ManyToMany(targetEntity="CarroiridianBundle\Entity\Genero")
     */
    protected $generos;

    /**
     * @var Color[]
     * @ORM\ManyToMany(targetEntity="CarroiridianBundle\Entity\Color")
     */
    protected $colores;

    /**
     * @var Ocasion[]
     * @ORM\ManyToMany(targetEntity="CarroiridianBundle\Entity\Ocasion")
     */
    protected $ocaciones;

    /**
     * @var Producto[]
     * @ORM\ManyToMany(targetEntity="CarroiridianBundle\Entity\Producto",fetch="EAGER")
     */
    protected $coloresRelacionados;

    /**
     * @var Producto[]
     * @ORM\ManyToMany(targetEntity="CarroiridianBundle\Entity\Producto")
     * @JoinTable(name="productos_relacionados")
     */
    protected $productosRelacionados;



    /**
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Producto")
     * @ORM\JoinColumn(name="padre_id", referencedColumnName="id")
     */
    private $padre;

    /**
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Categoria")
     * @ORM\JoinColumn(name="categoria_id", referencedColumnName="id")
     */
    private $categoria;

    /**
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Modelo")
     * @ORM\JoinColumn(name="modelo_id", referencedColumnName="id")
     */
    private $modelo;

    /**
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Color")
     * @ORM\JoinColumn(name="color_id", referencedColumnName="id")
     */
    private $color;

    /**
     * @var string
     *
     * @ORM\Column(name="sku", type="string", length=255)
     */
    private $sku;

    /**
     * @var string
     *
     * @ORM\Column(name="nombre_es", type="string", length=255)
     */
    private $nombreEs;

    /**
     * @var string
     *
     * @ORM\Column(name="nombre_en", type="string", length=255, nullable=true)
     */
    private $nombreEn;

    /**
     * @var string
     *
     * @ORM\Column(name="imagen", type="string", length=255, nullable=true)
     */
    private $imagen;

    /**
     * @Vich\UploadableField(mapping="productos", fileNameProperty="imagen")
     * @var File
     */
    private $imageFile;

    /**
     * @var string
     *
     * @ORM\Column(name="imagenaux", type="string", length=255, nullable=true)
     */
    private $imagenaux;

    /**
     * @Vich\UploadableField(mapping="productos", fileNameProperty="imagenaux")
     * @var File
     */
    private $imageauxFile;

    /**
     * @var string
     *
     * @ORM\Column(name="imagenhome", type="string", length=255, nullable=true)
     */
    private $imagenhome;

    /**
     * @Vich\UploadableField(mapping="productos", fileNameProperty="imagenhome")
     * @var File
     */
    private $imagenhomeFile;

    /**
     * @var float
     *
     * @ORM\Column(name="precio", type="float")
     */
    private $precio;

    /**
     * @var float
     *
     * @ORM\Column(name="preciobase", type="float", nullable=true)
     */
    private $preciobase;



    /**
     * @var \float
     *
     * @ORM\Column(name="precio_fecha", type="float", nullable=true)
     */
    private $precioFecha;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="fecha_ini", type="datetime", nullable=true)
     */
    private $fechaIni;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="fecha_fin", type="datetime", nullable=true)
     */
    private $fechaFin;

    /**
     * @var bool
     *
     * @ORM\Column(name="destacado", type="boolean", nullable=true)
     */
    private $destacado;

    /**
     * @var int
     *
     * @ORM\Column(name="unidades", type="integer", nullable=true)
     */
    private $unidades;

    /**
     * @var int
     *
     * @ORM\Column(name="min_unidades", type="integer", nullable=true)
     */
    private $minUnidades;

    /**
     * @var string
     *
     * @ORM\Column(name="descripcion_es", type="text", nullable=true)
     */
    private $descripcionEs;

    /**
     * @var string
     *
     * @ORM\Column(name="descripcion_en", type="text", nullable=true)
     */
    private $descripcionEn;

    /**
     * @var Estilo[]
     * @ORM\ManyToMany(targetEntity="CarroiridianBundle\Entity\Estilo")
     */
    protected $estilos;

    /**
     *
     * @var array
     * @ORM\Column(name="caracteristicas",type="array", nullable=true)
     */
    private $caracteristicas = array();

    /**
     * List of tags associated to the product.
     *
     * @var array
     * @ORM\Column(name="tags", type="array", nullable=true)
     */
    private $tags = array();


    /**
     * @var string
     *
     * @ORM\Column(name="alt", type="string", length=255, nullable=true)
     */
    private $alt;

    /**
     * @var boolean
     *
     * @ORM\Column(name="nuevo", type="boolean")
     */
    private $nuevo = false;

    /**
     * @var boolean
     *
     * @ORM\Column(name="home", type="boolean")
     */
    private $home = false;

    /**
     * @var boolean
     *
     * @ORM\Column(name="recomendado", type="boolean")
     */
    private $recomendado = false;

    /**
     * @var boolean
     *
     * @ORM\Column(name="recomendadoapp", type="boolean")
     */
    private $recomendadoapp = false;

    /**
     * @var integer
     *
     * @ORM\Column(name="orden", type="integer")
     */
    private $orden = 1;

    /**
     * @var integer
     *
     * @ORM\Column(name="ordenhome", type="integer")
     */
    private $ordenhome = 1;

    /**
     * @var boolean
     *
     * @ORM\Column(name="visible", type="boolean")
     */
    private $visible = false;

    /**
     * @var boolean
     *
     * @ORM\Column(name="pret", type="boolean")
     */
    private $pret = false;

    /**
     * @var string
     *
     * @ORM\Column(name="sap", type="string", length=255)
     */
    private $sap;

    /**
     * @var string
     *
     * @ORM\Column(name="codigo_iva", type="string", length=255)
     */
    private $codigoIva;

    /**
     * @var float
     *
     * @ORM\Column(name="porcentaje_iva", type="float", length=255)
     */
    private $porcentajeIva;

    /**
     * @var boolean
     *
     * @ORM\Column(name="taller", type="boolean")
     */
    private $taller = false;

    /**
     * @var boolean
     *
     * @ORM\Column(name="corporativo", type="boolean")
     */
    private $corporativo = false;

    /**
     * @var boolean
     *
     * @ORM\Column(name="con_envio", type="boolean")
     */
    private $conEnvio = false;

    /**
     * @var boolean
     *
     * @ORM\Column(name="siempre_disponible", type="boolean")
     */
    private $siempreDisponible = false;

    /**
     * @var boolean
     *
     * @ORM\Column(name="dedicatoria", type="boolean")
     */
    private $dedicatoria = false;

    /**
     * @var boolean
     *
     * @ORM\Column(name="boutique", type="boolean")
     */
    private $boutique = false;

    /**
     * @var string
     *
     * @ORM\Column(name="video_taller", type="string", nullable=true)
     */
    private $videoTaller;

    /**
     * @var string
     *
     * @ORM\Column(name="hora_taller", type="string", nullable=true)
     */
    private $horaTaller;

    /**
     * @var string
     *
     * @ORM\Column(name="direccion_taller", type="string", nullable=true)
     */
    private $direccionTaller;

    /**
     * @ORM\ManyToOne(targetEntity="GeoBundle\Entity\CiudadSede")
     * @ORM\JoinColumn(name="ciudad_taller", referencedColumnName="id")
     */
    private $ciudadTaller;
    
    /**
     * @var string
     *
     * @ORM\Column(name="temario_taller", type="string", length=255, nullable=true)
     */
    private $temarioTaller;

    /**
     * @Vich\UploadableField(mapping="productos", fileNameProperty="temarioTaller")
     * @var File
     */
    private $temarioTallerFile;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="update_at", type="datetime", nullable=true)
     */
    private $updateAt;


    public function __toString(){


        $color = '';
        $cat = '';
        if($this->color != null)
            $color = '| '.$this->getColor()->getNombreEs();
        if($this->categoria != null)
            $cat = $this->getCategoria()->getNombreEs().' | ';
        return $cat.$this->nombreEs.' '.$color;
    }

    public function gen($campo,$locale){
        $accessor = PropertyAccess::createPropertyAccessor();
        return $accessor->getValue($this,$campo.'_'.$locale);
    }


    public function __construct()
    {
        $this->estilos = new ArrayCollection();
        $this->galerias = new ArrayCollection();
        $this->generos = new ArrayCollection();
        $this->ocaciones = new ArrayCollection();
        $this->coloresRelacionados = new ArrayCollection();
        $this->productosRelacionados = new ArrayCollection();
    }

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set sku
     *
     * @param string $sku
     *
     * @return Producto
     */
    public function setSku($sku)
    {
        $this->sku = $sku;

        return $this;
    }

    /**
     * Get sku
     *
     * @return string
     */
    public function getSku()
    {
        return $this->sku;
    }

    /**
     * Set nombreEs
     *
     * @param string $nombreEs
     *
     * @return Producto
     */
    public function setNombreEs($nombreEs)
    {
        $this->nombreEs = $nombreEs;

        return $this;
    }

    /**
     * Get nombreEs
     *
     * @return string
     */
    public function getNombreEs()
    {
        return $this->nombreEs;
    }

    /**
     * Set nombreEn
     *
     * @param string $nombreEn
     *
     * @return Producto
     */
    public function setNombreEn($nombreEn)
    {
        $this->nombreEn = $nombreEn;

        return $this;
    }

    /**
     * Get nombreEn
     *
     * @return string
     */
    public function getNombreEn()
    {
        return $this->nombreEn;
    }

    /**
     * Set imagen
     *
     * @param string $imagen
     *
     * @return Producto
     */
    public function setImagen($imagen)
    {
        $this->imagen = $imagen;

        return $this;
    }

    /**
     * Get imagen
     *
     * @return string
     */
    public function getImagen()
    {
        return $this->imagen;
    }

    /**
     * Set precio
     *
     * @param float $precio
     *
     * @return Producto
     */
    public function setPrecio($precio)
    {
        $this->precio = $precio;

        return $this;
    }

    /**
     * Get precio
     *
     * @return float
     */
    public function getPrecio()
    {
        return $this->precio;
    }

    /**
     * Get precioiva
     *
     * @return float
     */
    public function getPrecioiva()
    {
        return $this->precio / (1 + $this->porcentajeIva/100);
    }
    /**
     * Get iva
     *
     * @return float
     */
    public function getIva()
    {
        return $this->precio - $this->getPrecioiva();
    }


    /**
     * Set fechaIni
     *
     * @param \DateTime $fechaIni
     *
     * @return Producto
     */
    public function setFechaIni($fechaIni)
    {
        $this->fechaIni = $fechaIni;

        return $this;
    }

    /**
     * Get fechaIni
     *
     * @return \DateTime
     */
    public function getFechaIni()
    {
        return $this->fechaIni;
    }

    /**
     * Set fechaFin
     *
     * @param \DateTime $fechaFin
     *
     * @return Producto
     */
    public function setFechaFin($fechaFin)
    {
        $this->fechaFin = $fechaFin;

        return $this;
    }

    /**
     * Get fechaFin
     *
     * @return \DateTime
     */
    public function getFechaFin()
    {
        return $this->fechaFin;
    }

    /**
     * Set destacado
     *
     * @param boolean $destacado
     *
     * @return Producto
     */
    public function setDestacado($destacado)
    {
        $this->destacado = $destacado;

        return $this;
    }

    /**
     * Get destacado
     *
     * @return bool
     */
    public function getDestacado()
    {
        return $this->destacado;
    }

    /**
     * Set unidades
     *
     * @param integer $unidades
     *
     * @return Producto
     */
    public function setUnidades($unidades)
    {
        $this->unidades = $unidades;

        return $this;
    }

    /**
     * Get unidades
     *
     * @return int
     */
    public function getUnidades()
    {
        return $this->unidades;
    }

    /**
     * Set minUnidades
     *
     * @param integer $minUnidades
     *
     * @return Producto
     */
    public function setMinUnidades($minUnidades)
    {
        $this->minUnidades = $minUnidades;

        return $this;
    }

    /**
     * Get minUnidades
     *
     * @return int
     */
    public function getMinUnidades()
    {
        return $this->minUnidades;
    }

    /**
     * Set descripcionEs
     *
     * @param string $descripcionEs
     *
     * @return Producto
     */
    public function setDescripcionEs($descripcionEs)
    {
        $this->descripcionEs = $descripcionEs;

        return $this;
    }

    /**
     * Get descripcionEs
     *
     * @return string
     */
    public function getDescripcionEs()
    {
        return $this->descripcionEs;
    }

    /**
     * Set descripcionEn
     *
     * @param string $descripcionEn
     *
     * @return Producto
     */
    public function setDescripcionEn($descripcionEn)
    {
        $this->descripcionEn = $descripcionEn;

        return $this;
    }

    /**
     * Get descripcionEn
     *
     * @return string
     */
    public function getDescripcionEn()
    {
        return $this->descripcionEn;
    }

    /**
     * Set precioFecha
     *
     * @param float $precioFecha
     *
     * @return Producto
     */
    public function setPrecioFecha($precioFecha)
    {
        $this->precioFecha = $precioFecha;

        return $this;
    }

    /**
     * Get precioFecha
     *
     * @return float
     */
    public function getPrecioFecha()
    {
        return $this->precioFecha;
    }

    /**
     * Add estilo
     *
     * @param \CarroiridianBundle\Entity\Estilo $estilo
     *
     * @return Producto
     */
    public function addEstilo(\CarroiridianBundle\Entity\Estilo $estilo)
    {
        $this->estilos[] = $estilo;

        return $this;
    }

    /**
     * Remove estilo
     *
     * @param \CarroiridianBundle\Entity\Estilo $estilo
     */
    public function removeEstilo(\CarroiridianBundle\Entity\Estilo $estilo)
    {
        $this->estilos->removeElement($estilo);
    }

    /**
     * Get estilos
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getEstilos()
    {
        return $this->estilos;
    }


    /**
     * Set alt
     *
     * @param string $alt
     *
     * @return Producto
     */
    public function setAlt($alt)
    {
        $this->alt = $alt;
    
        return $this;
    }

    /**
     * Get alt
     *
     * @return string
     */
    public function getAlt()
    {
        return $this->alt;
    }

    /**
     * Set orden
     *
     * @param integer $orden
     *
     * @return Producto
     */
    public function setOrden($orden)
    {
        $this->orden = $orden;
    
        return $this;
    }

    /**
     * Get orden
     *
     * @return integer
     */
    public function getOrden()
    {
        return $this->orden;
    }

    /**
     * Set visible
     *
     * @param boolean $visible
     *
     * @return Producto
     */
    public function setVisible($visible)
    {
        $this->visible = $visible;
    
        return $this;
    }

    /**
     * Get visible
     *
     * @return boolean
     */
    public function getVisible()
    {
        return $this->visible;
    }

    /**
     * Add galeria
     *
     * @param \CarroiridianBundle\Entity\Galeriaproducto $galeria
     *
     * @return Producto
     */
    public function addGaleria(\CarroiridianBundle\Entity\Galeriaproducto $galeria)
    {
        $this->galerias[] = $galeria;
    
        return $this;
    }

    /**
     * Remove galeria
     *
     * @param \CarroiridianBundle\Entity\Galeriaproducto $galeria
     */
    public function removeGaleria(\CarroiridianBundle\Entity\Galeriaproducto $galeria)
    {
        $this->galerias->removeElement($galeria);
    }

    /**
     * Get galerias
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getGalerias()
    {
        return $this->galerias;
    }

    /**
     * Set categoria
     *
     * @param \CarroiridianBundle\Entity\Categoria $categoria
     *
     * @return Producto
     */
    public function setCategoria(\CarroiridianBundle\Entity\Categoria $categoria = null)
    {
        $this->categoria = $categoria;
    
        return $this;
    }

    /**
     * Get categoria
     *
     * @return \CarroiridianBundle\Entity\Categoria
     */
    public function getCategoria()
    {
        return $this->categoria;
    }

    /**
     * @param File $image
     */
    public function setImageFile(File $image = null)
    {
        $this->imageFile = $image;
        $this->checkFile($image);
    }

    /**
     * @return File
     */
    public function getImageFile()
    {
        return $this->imageFile;
    }

    /**
     * Add inventario
     *
     * @param \CarroiridianBundle\Entity\Inventario $inventario
     *
     * @return Producto
     */
    public function addInventario(\CarroiridianBundle\Entity\Inventario $inventario)
    {
        $this->inventarios[] = $inventario;
    
        return $this;
    }

    /**
     * Remove inventario
     *
     * @param \CarroiridianBundle\Entity\Inventario $inventario
     */
    public function removeInventario(\CarroiridianBundle\Entity\Inventario $inventario)
    {
        $this->inventarios->removeElement($inventario);
    }

    /**
     * Get inventarios
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getInventarios()
    {
        return $this->inventarios;
    }

    /**
     * Set color
     *
     * @param \CarroiridianBundle\Entity\Color $color
     *
     * @return Producto
     */
    public function setColor(\CarroiridianBundle\Entity\Color $color = null)
    {
        $this->color = $color;
    
        return $this;
    }

    /**
     * Get color
     *
     * @return \CarroiridianBundle\Entity\Color
     */
    public function getColor()
    {
        return $this->color;
    }

    /**
     * Set caracteristicas
     *
     * @param array $caracteristicas
     *
     * @return Producto
     */
    public function setCaracteristicas($caracteristicas)
    {
        $this->caracteristicas = $caracteristicas;
    
        return $this;
    }

    /**
     * Get caracteristicas
     *
     * @return array
     */
    public function getCaracteristicas()
    {
        return $this->caracteristicas;
    }

    /**
     * Set tags
     *
     * @param array $tags
     *
     * @return Producto
     */
    public function setTags($tags)
    {
        $this->tags = $tags;
    
        return $this;
    }

    /**
     * Get tags
     *
     * @return array
     */
    public function getTags()
    {
        return $this->tags;
    }

    /**
     * Add colore
     *
     * @param \CarroiridianBundle\Entity\Color $colore
     *
     * @return Producto
     */
    public function addColore(\CarroiridianBundle\Entity\Color $colore)
    {
        $this->colores[] = $colore;
    
        return $this;
    }

    /**
     * Remove colore
     *
     * @param \CarroiridianBundle\Entity\Color $colore
     */
    public function removeColore(\CarroiridianBundle\Entity\Color $colore)
    {
        $this->colores->removeElement($colore);
    }

    /**
     * Get colores
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getColores()
    {
        return $this->colores;
    }

    /**
     * Set nuevo
     *
     * @param boolean $nuevo
     *
     * @return Producto
     */
    public function setNuevo($nuevo)
    {
        $this->nuevo = $nuevo;
    
        return $this;
    }

    /**
     * Get nuevo
     *
     * @return boolean
     */
    public function getNuevo()
    {
        return $this->nuevo;
    }

    /**
     * Add coloresRelacionado
     *
     * @param \CarroiridianBundle\Entity\Producto $coloresRelacionado
     *
     * @return Producto
     */
    public function addColoresRelacionado(\CarroiridianBundle\Entity\Producto $coloresRelacionado)
    {
        $this->coloresRelacionados[] = $coloresRelacionado;
    
        return $this;
    }

    /**
     * Remove coloresRelacionado
     *
     * @param \CarroiridianBundle\Entity\Producto $coloresRelacionado
     */
    public function removeColoresRelacionado(\CarroiridianBundle\Entity\Producto $coloresRelacionado)
    {
        $this->coloresRelacionados->removeElement($coloresRelacionado);
    }

    /**
     * Get coloresRelacionados
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getColoresRelacionados()
    {
        return $this->coloresRelacionados;
    }

    /**
     * Set imagenaux
     *
     * @param string $imagenaux
     *
     * @return Producto
     */
    public function setImagenaux($imagenaux)
    {
        $this->imagenaux = $imagenaux;
    
        return $this;
    }

    /**
     * Get imagenaux
     *
     * @return string
     */
    public function getImagenaux()
    {
        return $this->imagenaux;
    }

    /**
     * @param File $imageaux
     */
    public function setImageauxFile(File $imageaux = null)
    {
        $this->imageauxFile = $imageaux;
        
    }

    /**
     * @return File
     */
    public function getImageauxFile()
    {
        return $this->imageauxFile;
    }

    

    /**
     * Set modelo
     *
     * @param \CarroiridianBundle\Entity\Modelo $modelo
     *
     * @return Producto
     */
    public function setModelo(\CarroiridianBundle\Entity\Modelo $modelo = null)
    {
        $this->modelo = $modelo;

        return $this;
    }

    /**
     * Get modelo
     *
     * @return \CarroiridianBundle\Entity\Modelo
     */
    public function getModelo()
    {
        return $this->modelo;
    }



    /**
     * Add genero
     *
     * @param \CarroiridianBundle\Entity\Genero $genero
     *
     * @return Producto
     */
    public function addGenero(\CarroiridianBundle\Entity\Genero $genero)
    {
        $this->generos[] = $genero;

        return $this;
    }

    /**
     * Remove genero
     *
     * @param \CarroiridianBundle\Entity\Genero $genero
     */
    public function removeGenero(\CarroiridianBundle\Entity\Genero $genero)
    {
        $this->generos->removeElement($genero);
    }

    /**
     * Get generos
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getGeneros()
    {
        return $this->generos;
    }

    /**
     * Set imagenhome
     *
     * @param string $imagenhome
     *
     * @return Producto
     */
    public function setImagenhome($imagenhome)
    {
        $this->imagenhome = $imagenhome;

        return $this;
    }

    /**
     * Get imagenhome
     *
     * @return string
     */
    public function getImagenhome()
    {
        return $this->imagenhome;
    }

    /**
     * Set home
     *
     * @param boolean $home
     *
     * @return Producto
     */
    public function setHome($home)
    {
        $this->home = $home;

        return $this;
    }

    /**
     * Get home
     *
     * @return boolean
     */
    public function getHome()
    {
        return $this->home;
    }

    /**
     * @param File $imagenhome
     */
    public function setImagenhomeFile(File $imagenhome = null)
    {
        $this->imagenhomeFile = $imagenhome;
        $this->checkFile($imagenhome);
    }

    /**
     * @return File
     */
    public function getImagenhomeFile()
    {
        return $this->imagenhomeFile;
    }

    /**
     * Set ordenhome
     *
     * @param integer $ordenhome
     *
     * @return Producto
     */
    public function setOrdenhome($ordenhome)
    {
        $this->ordenhome = $ordenhome;

        return $this;
    }

    /**
     * Get ordenhome
     *
     * @return integer
     */
    public function getOrdenhome()
    {
        return $this->ordenhome;
    }

    /**
     * Set recomendado
     *
     * @param boolean $recomendado
     *
     * @return Producto
     */
    public function setRecomendado($recomendado)
    {
        $this->recomendado = $recomendado;

        return $this;
    }

    /**
     * Get recomendado
     *
     * @return boolean
     */
    public function getRecomendado()
    {
        return $this->recomendado;
    }

    /**
     * Add ocacione
     *
     * @param \CarroiridianBundle\Entity\Ocasion $ocacione
     *
     * @return Producto
     */
    public function addOcacione(\CarroiridianBundle\Entity\Ocasion $ocacione)
    {
        $this->ocaciones[] = $ocacione;

        return $this;
    }

    /**
     * Remove ocacione
     *
     * @param \CarroiridianBundle\Entity\Ocasion $ocacione
     */
    public function removeOcacione(\CarroiridianBundle\Entity\Ocasion $ocacione)
    {
        $this->ocaciones->removeElement($ocacione);
    }

    /**
     * Get ocaciones
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getOcaciones()
    {
        return $this->ocaciones;
    }

    /**
     * Set pret
     *
     * @param boolean $pret
     *
     * @return Producto
     */
    public function setPret($pret)
    {
        $this->pret = $pret;

        return $this;
    }

    /**
     * Get pret
     *
     * @return boolean
     */
    public function getPret()
    {
        return $this->pret;
    }

    /**
     * Add productosRelacionado
     *
     * @param \CarroiridianBundle\Entity\Producto $productosRelacionado
     *
     * @return Producto
     */
    public function addProductosRelacionado(\CarroiridianBundle\Entity\Producto $productosRelacionado)
    {
        $this->productosRelacionados[] = $productosRelacionado;

        return $this;
    }

    /**
     * Remove productosRelacionado
     *
     * @param \CarroiridianBundle\Entity\Producto $productosRelacionado
     */
    public function removeProductosRelacionado(\CarroiridianBundle\Entity\Producto $productosRelacionado)
    {
        $this->productosRelacionados->removeElement($productosRelacionado);
    }

    /**
     * Get productosRelacionados
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getProductosRelacionados()
    {
        return $this->productosRelacionados;
    }

    /**
     * Set sap
     *
     * @param string $sap
     *
     * @return Producto
     */
    public function setSap($sap)
    {
        $this->sap = $sap;

        return $this;
    }

    /**
     * Get sap
     *
     * @return string
     */
    public function getSap()
    {
        return $this->sap;
    }

    /**
     * Set codigoIva
     *
     * @param string $codigoIva
     *
     * @return Producto
     */
    public function setCodigoIva($codigoIva)
    {
        $this->codigoIva = $codigoIva;

        return $this;
    }

    /**
     * Get codigoIva
     *
     * @return string
     */
    public function getCodigoIva()
    {
        return $this->codigoIva;
    }

    /**
     * Set porcentajeIva
     *
     * @param float $porcentajeIva
     *
     * @return Producto
     */
    public function setPorcentajeIva($porcentajeIva)
    {
        $this->porcentajeIva = $porcentajeIva;

        return $this;
    }

    /**
     * Get porcentajeIva
     *
     * @return float
     */
    public function getPorcentajeIva()
    {
        return $this->porcentajeIva;
    }





    /**
     * Set taller
     *
     * @param boolean $taller
     *
     * @return Producto
     */
    public function setTaller($taller)
    {
        $this->taller = $taller;

        return $this;
    }

    /**
     * Get taller
     *
     * @return boolean
     */
    public function getTaller()
    {
        return $this->taller;
    }

    /**
     * Set corporativo
     *
     * @param boolean $corporativo
     *
     * @return Producto
     */
    public function setCorporativo($corporativo)
    {
        $this->corporativo = $corporativo;

        return $this;
    }

    /**
     * Get corporativo
     *
     * @return boolean
     */
    public function getCorporativo()
    {
        return $this->corporativo;
    }

    /**
     * Set conEnvio
     *
     * @param boolean $conEnvio
     *
     * @return Producto
     */
    public function setConEnvio($conEnvio)
    {
        $this->conEnvio = $conEnvio;

        return $this;
    }

    /**
     * Get conEnvio
     *
     * @return boolean
     */
    public function getConEnvio()
    {
        return $this->conEnvio;
    }

    /**
     * Set dedicatoria
     *
     * @param boolean $dedicatoria
     *
     * @return Producto
     */
    public function setDedicatoria($dedicatoria)
    {
        $this->dedicatoria = $dedicatoria;

        return $this;
    }

    /**
     * Get dedicatoria
     *
     * @return boolean
     */
    public function getDedicatoria()
    {
        return $this->dedicatoria;
    }



    /**
     * Get precioAnual
     *
     * @return float
     */
    public function getPrecioAnual()
    {
        return $this->precio_anual;
    }

    /**
     * Set padre
     *
     * @param \CarroiridianBundle\Entity\Producto $padre
     *
     * @return Producto
     */
    public function setPadre(\CarroiridianBundle\Entity\Producto $padre = null)
    {
        $this->padre = $padre;

        return $this;
    }

    /**
     * Get padre
     *
     * @return \CarroiridianBundle\Entity\Producto
     */
    public function getPadre()
    {
        return $this->padre;
    }

    /**
     * Set boutique
     *
     * @param boolean $boutique
     *
     * @return Producto
     */
    public function setBoutique($boutique)
    {
        $this->boutique = $boutique;

        return $this;
    }

    /**
     * Get boutique
     *
     * @return boolean
     */
    public function getBoutique()
    {
        return $this->boutique;
    }

    /**
     * Set preciobase
     *
     * @param float $preciobase
     *
     * @return Producto
     */
    public function setPreciobase($preciobase)
    {
        $this->preciobase = $preciobase;

        return $this;
    }

    /**
     * Get preciobase
     *
     * @return float
     */
    public function getPreciobase()
    {
        return $this->preciobase;
    }

    /**
     * Set recomendadoapp
     *
     * @param boolean $recomendadoapp
     *
     * @return Producto
     */
    public function setRecomendadoapp($recomendadoapp)
    {
        $this->recomendadoapp = $recomendadoapp;

        return $this;
    }

    /**
     * Get recomendadoapp
     *
     * @return boolean
     */
    public function getRecomendadoapp()
    {
        return $this->recomendadoapp;
    }

    /**
     * Add inventariosalmacen
     *
     * @param \CarroiridianBundle\Entity\InventarioAlmacen $inventariosalmacen
     *
     * @return Producto
     */
    public function addInventariosalmacen(\CarroiridianBundle\Entity\InventarioAlmacen $inventariosalmacen)
    {
        $this->inventariosalmacen[] = $inventariosalmacen;

        return $this;
    }

    /**
     * Remove inventariosalmacen
     *
     * @param \CarroiridianBundle\Entity\InventarioAlmacen $inventariosalmacen
     */
    public function removeInventariosalmacen(\CarroiridianBundle\Entity\InventarioAlmacen $inventariosalmacen)
    {
        $this->inventariosalmacen->removeElement($inventariosalmacen);
    }

    /**
     * Get inventariosalmacen
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getInventariosalmacen()
    {
        return $this->inventariosalmacen;
    }

    /**
     * Set video taller
     *
     * @param string $videoTaller
     * @return Producto
     */
    public function setVideoTaller($videoTaller)
    {
        $this->videoTaller = $videoTaller;

        return $this;
    }
    
    /**
     * Get video taller
     *
     * @return string
     */
    public function getVideoTaller()
    {
        return $this->videoTaller;
    }
    
    /**
     * Set hora taller
     *
     * @param string $horaTaller
     * @return Producto
     */
    public function setHoraTaller($horaTaller)
    {
        $this->horaTaller = $horaTaller;

        return $this;
    }
    
    /**
     * Get hora taller
     *
     * @return string
     */
    public function getHoraTaller()
    {
        return $this->horaTaller;
    }
    
    /**
     * Set direccion taller
     *
     * @param string $direccionTaller
     * @return Producto
     */
    public function setDireccionTaller($direccionTaller)
    {
        $this->direccionTaller = $direccionTaller;

        return $this;
    }
    
    /**
     * Get direccion taller
     *
     * @return string
     */
    public function getDireccionTaller()
    {
        return $this->direccionTaller;
    }
    
    /**
     * Set ciudad taller
     *
     * @param \GeoBundle\Entity\CiudadSede $ciudadTaller
     * @return Producto
     */
    public function setCiudadTaller(\GeoBundle\Entity\CiudadSede $ciudadTaller = null)
    {
        $this->ciudadTaller = $ciudadTaller;

        return $this;
    }

    /**
     * Get ciudad taller
     *
     * @return \GeoBundle\Entity\CiudadSede
     */
    public function getCiudadTaller()
    {
        return $this->ciudadTaller;
    }

    /**
     * Set temario taller
     *
     * @param string $temarioTaller
     * @return Producto
     */
    public function setTemarioTaller($temarioTaller)
    {
        $this->temarioTaller = $temarioTaller;

        return $this;
    }

    /**
     * Get temario taller
     *
     * @return string
     */
    public function getTemarioTaller()
    {
        return $this->temarioTaller;
    }

    /**
     * @param File $temario
     */
    public function setTemarioTallerFile(File $temario = null)
    {
        $this->temarioTallerFile = $temario;
        $this->checkFile($temario);
    }

    /**
     * @return File
     */
    public function getTemarioTallerFile()
    {
        return $this->temarioTallerFile;
    }

    /**
     * Set update
     * 
     * @param \DateTime $updateAt
     * @return Producto
     */
    public function setUpdateAt($updateAt)
    {
        $this->updateAt = $updateAt;
    }

    /**
     * Get update
     * 
     * @return \DateTime
     */
    public function getUpdateAt()
    {
        return $this->updateAt;
    }

    private function checkFile($file)
    {
        if($file){
            $this->updateAt = new \DateTime('now');
        }
    }

    /**
     * Set siempreDisponible
     *
     * @param boolean $siempreDisponible
     * @return void
     */
    public function setSiempreDisponible($siempreDisponible)
    {
        $this->siempreDisponible = $siempreDisponible;
    }

    /**
     * Get siempreDisponible
     *
     * @return boolean
     */
    public function getSiempreDisponible()
    {
        return $this->siempreDisponible;
    }
}

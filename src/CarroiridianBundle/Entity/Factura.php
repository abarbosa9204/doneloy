<?php

namespace CarroiridianBundle\Entity;

use AppBundle\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use GeoBundle\Entity\PaisFacturacion;

/**
 * Factura
 *
 * @ORM\Table(name="factura")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\FacturaRepository")
 */
class Factura
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
     * TipoDocumento de la factura
     *
     * @var TipoDocumento
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\TipoDocumento")
     * @ORM\JoinColumn(name="tipodocumento_id", referencedColumnName="id")
     * @Assert\NotBlank(message = "El tipo de documento no puede ser vacio")
     */
    protected $tipodocumento;

    /**
     * Dedicatoria de la factura
     *
     * @var Dedicatoria
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Dedicatoria",cascade={"persist"})
     * @ORM\JoinColumn(name="dedicatoria_id", referencedColumnName="id", nullable=true)
     */
    protected $dedicatoria;

    /**
     * Comprador de la factura
     *
     * @var User
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User")
     * @ORM\JoinColumn(name="comprador_id", referencedColumnName="id", nullable=true)
     */
    protected $comprador;

    /**
     * Dedicatoria de la factura
     *
     * @var Envio
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Envio")
     * @ORM\JoinColumn(name="envio_id", referencedColumnName="id", nullable=true)
     */
    protected $envio;


    /**
     * Compra de la factura
     *
     * @var Compra
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Compra")
     * @ORM\JoinColumn(name="compra_id", referencedColumnName="id", nullable=true)
     */
    protected $compra;

    /**
     * @var string
     *
     * @ORM\Column(name="nombre", type="string", length=255)
     * @Assert\NotBlank(message = "El nombre no puede ser vacio")
     */
    private $nombre;

    /**
     * @var string
     *
     * @ORM\Column(name="apellidos", type="string", length=255)
     * @Assert\NotBlank(message = "El apellido no puede ser vacio")
     */
    private $apellidos;

    /**
     * @var string
     *
     * @ORM\Column(name="direccion", type="string", length=255)
     * @Assert\NotBlank(message = "La dirección no puede ser vacia")
     */
    private $direccion;

    /**
     * @var string
     *
     * @ORM\Column(name="documento", type="string", length=255)
     * @Assert\NotBlank(message = "El número de documento no puede ser vacio")
     */
    private $documento;

    /**
     * @var string
     *
     * @ORM\Column(name="pais", type="string", length=255)
     * @Assert\NotBlank(message = "El país no puede ser vacio")
     */
    private $pais;

    /**
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Departamento")
     * @ORM\JoinColumn(name="departamento_id", referencedColumnName="id")
     * @Assert\NotBlank(message = "El departamento no puede ser vacio")
     */
    private $departamento;

    /**
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Ciudad")
     * @ORM\JoinColumn(name="ciudad_id", referencedColumnName="id")
     * @Assert\NotBlank(message = "La ciudad no puede ser vacia")
     */
    private $ciudad;

    // /**
    //  * @ORM\ManyToOne(targetEntity="GeoBundle\Entity\PaisFacturacion")
    //  * @ORM\JoinColumn(name="pais_id", referencedColumnName="id")
    //  */
    // private $paisEn;

    /**
     * @var string
     *
     * @ORM\Column(name="email", type="string", length=255)
     * @Assert\NotBlank(message = "El email no puede ser vacio")
     * @Assert\Email(
     *     message = "El email '{{ value }}' no es válido.",
     *     checkMX = true
     * )
     */
    private $email;

    /**
     * @var string
     *
     * @ORM\Column(name="celular", type="string", length=255)
     * @Assert\NotBlank(message = "El celular no puede ser vacio")
     * @Assert\Regex(
     *      pattern = "/^(?:\+?\(?(\d{1,3})\)?)?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)$/",
     *      message = "Tiene que ser un número de teléfono válido")
     */
    private $celular;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="recibido", type="datetime", nullable=true)
     */
    private $recibido;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="camino", type="datetime", nullable=true)
     */
    private $camino;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="entregado", type="datetime", nullable=true)
     */
    private $entrgado;

    /**
     * @var string
     *
     * @ORM\Column(name="idsap", type="string", length=255, nullable=true)
     */
    private $idsap;

    /**
     * @var string
     *
     * @ORM\Column(name="docsap", type="string", length=255, nullable=true)
     */
    private $docsap;

    /**
     * @var array
     *
     * @ORM\Column(name="request", type="array", nullable=true)
     */
    private $request;

    /**
     * @var boolean
     *
     * @ORM\Column(name="reportada", type="boolean")
     */
    private $reportada = false;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\RangoEdad")
     * @ORM\JoinColumn(name="rangoedad_id", referencedColumnName="id",nullable=true)
     * @Assert\NotBlank(message = "El rango de edad no puede ser vacio")
     */
    private $rangoedad;


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
     * Set nombre
     *
     * @param string $nombre
     *
     * @return Factura
     */
    public function setNombre($nombre)
    {
        $this->nombre = $nombre;

        return $this;
    }

    /**
     * Get nombre
     *
     * @return string
     */
    public function getNombre()
    {
        return $this->nombre;
    }

    /**
     * Set apellidos
     *
     * @param string $apellidos
     *
     * @return Factura
     */
    public function setApellidos($apellidos)
    {
        $this->apellidos = $apellidos;

        return $this;
    }

    /**
     * Get apellidos
     *
     * @return string
     */
    public function getApellidos()
    {
        return $this->apellidos;
    }

    /**
     * Set direccion
     *
     * @param string $direccion
     *
     * @return Factura
     */
    public function setDireccion($direccion)
    {
        $this->direccion = $direccion;

        return $this;
    }

    /**
     * Get direccion
     *
     * @return string
     */
    public function getDireccion()
    {
        return $this->direccion;
    }

    /**
     * Set documento
     *
     * @param string $documento
     *
     * @return Factura
     */
    public function setDocumento($documento)
    {
        $this->documento = $documento;

        return $this;
    }

    /**
     * Get documento
     *
     * @return string
     */
    public function getDocumento()
    {
        return $this->documento;
    }

    /**
     * Set pais
     *
     * @param string $pais
     *
     * @return Factura
     */
    public function setPais($pais)
    {
        $this->pais = $pais;

        return $this;
    }

    /**
     * Get pais
     *
     * @return string
     */
    public function getPais()
    {
        return $this->pais;
    }


    /**
     * Set email
     *
     * @param string $email
     *
     * @return Factura
     */
    public function setEmail($email)
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Get email
     *
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set celular
     *
     * @param string $celular
     *
     * @return Factura
     */
    public function setCelular($celular)
    {
        $this->celular = $celular;

        return $this;
    }

    /**
     * Get celular
     *
     * @return string
     */
    public function getCelular()
    {
        return $this->celular;
    }

    /**
     * Set tipodocumento
     *
     * @param \CarroiridianBundle\Entity\TipoDocumento $tipodocumento
     *
     * @return Factura
     */
    public function setTipodocumento(\CarroiridianBundle\Entity\TipoDocumento $tipodocumento = null)
    {
        $this->tipodocumento = $tipodocumento;

        return $this;
    }

    /**
     * Get tipodocumento
     *
     * @return \CarroiridianBundle\Entity\TipoDocumento
     */
    public function getTipodocumento()
    {
        return $this->tipodocumento;
    }

    /**
     * Set dedicatoria
     *
     * @param \CarroiridianBundle\Entity\Dedicatoria $dedicatoria
     *
     * @return Factura
     */
    public function setDedicatoria(\CarroiridianBundle\Entity\Dedicatoria $dedicatoria = null)
    {
        $this->dedicatoria = $dedicatoria;

        return $this;
    }

    /**
     * Get dedicatoria
     *
     * @return \CarroiridianBundle\Entity\Dedicatoria
     */
    public function getDedicatoria()
    {
        return $this->dedicatoria;
    }

    /**
     * Set comprador
     *
     * @param \AppBundle\Entity\User $comprador
     *
     * @return Factura
     */
    public function setComprador(\AppBundle\Entity\User $comprador = null)
    {
        $this->comprador = $comprador;

        return $this;
    }

    /**
     * Get comprador
     *
     * @return \AppBundle\Entity\User
     */
    public function getComprador()
    {
        return $this->comprador;
    }

    /**
     * Set envio
     *
     * @param \CarroiridianBundle\Entity\Envio $envio
     *
     * @return Factura
     */
    public function setEnvio(\CarroiridianBundle\Entity\Envio $envio = null)
    {
        $this->envio = $envio;

        return $this;
    }

    /**
     * Get envio
     *
     * @return \CarroiridianBundle\Entity\Envio
     */
    public function getEnvio()
    {
        return $this->envio;
    }

    /**
     * Set compra
     *
     * @param \CarroiridianBundle\Entity\Compra $compra
     *
     * @return Factura
     */
    public function setCompra(\CarroiridianBundle\Entity\Compra $compra = null)
    {
        $this->compra = $compra;

        return $this;
    }

    /**
     * Get compra
     *
     * @return \CarroiridianBundle\Entity\Compra
     */
    public function getCompra()
    {
        return $this->compra;
    }

    /**
     * Set departamento
     *
     * @param \CarroiridianBundle\Entity\Departamento $departamento
     *
     * @return Factura
     */
    public function setDepartamento(\CarroiridianBundle\Entity\Departamento $departamento = null)
    {
        $this->departamento = $departamento;

        return $this;
    }

    /**
     * Get departamento
     *
     * @return \CarroiridianBundle\Entity\Departamento
     */
    public function getDepartamento()
    {
        return $this->departamento;
    }

    /**
     * Set ciudad
     *
     * @param \CarroiridianBundle\Entity\Ciudad $ciudad
     *
     * @return Factura
     */
    public function setCiudad(\CarroiridianBundle\Entity\Ciudad $ciudad = null)
    {
        $this->ciudad = $ciudad;

        return $this;
    }

    /**
     * Get ciudad
     *
     * @return \CarroiridianBundle\Entity\Ciudad
     */
    public function getCiudad()
    {
        return $this->ciudad;
    }

    /**
     * Set pais entity
     *
     * @param \GeoBundle\Entity\PaisFacturacion $pais
     *
     * @return Factura
     */
    public function setPaisEn(\GeoBundle\Entity\PaisFacturacion $pais = null)
    {
        $this->paisEn = $pais;

        return $this;
    }

    /**
     * Get pais entity
     *
     * @return \GeoBundle\Entity\PaisFacturacion
     */
    public function getPaisEn()
    {
        return $this->paisEn;
    }

    /**
     * Get fullName
     *
     * @return string
     */
    public function getFullName()
    {
        return $this->nombre.' '.$this->apellidos;
    }

    /**
     * Get createtAt
     *
     * @return string
     */
    public function getCreatedAt()
    {
        return $this->compra->getCreatedAt();
    }

    /**
     * Get precio
     *
     * @return string
     */
    public function getPrecio()
    {
        if($this->getCompra())
            return '$'.number_format($this->getCompra()->getPrecio());
        return ' ';
    }

    /**
     * Get prueba
     *
     * @return boolean
     */
    public function getPrueba()
    {
        if($this->getCompra())
            return $this->getCompra()->getPrueba();
        return true;
    }

    /**
     * Get estado
     *
     * @return string
     */
    public function getEstado()
    {
        if($this->getCompra())
            if($this->getCompra()->getEstado())
                return $this->getCompra()->getEstado()->getNombre();
        return ' ';
    }


    /**
     * Get UsuarioCompleto
     *
     * @return string
     */
    public function getUsuarioCompleto()
    {
        //exit(dump($this->getRangoedad()->getId()));
        $nombre = $this->getNombre().' '.$this->getApellidos();
        $cad = '<ul class="">';
        $cad .= '<li><strong>Nombre: </strong>'.$nombre.'</li>';
        $cad .= '<li><strong>Email: </strong>'.$this->getEmail().'</li>';
        $cad .= '<li><strong>Telefono: </strong>'.$this->getCelular().'</li>';
        $cad .= '<li><strong>Documento: </strong>'.$this->getDocumento().'</li>';
        $cad .= '<li><strong>Tipo de documento: </strong>'.$this->getTipodocumento().'</li>';
        $cad .= '<li><strong>Dirección: </strong>'.$this->getDireccion().'</li>';
        $cad .= '<li><strong>Ciudad: </strong>'.explode('-',$this->getCiudad())[0].'</li>';
        $cad .= '<li><strong>País: </strong>'.$this->getPais().'</li>';
        $cad .= '<li><strong>Rango de Edad: </strong>'.$this->getRangoedad().'</li>';
        $cad .= '</ul>';
        return $cad;


        $nombre = $this->getNombre().' '.$this->getApellidos();
        $cad = '<table class="table table-bordered">';
        $cad .= '<tr><td><strong>Nombre: </strong></td><td>'.$nombre.'</td></tr>';
        $cad .= '<tr><td><strong>Email</strong></td><td>'.$this->getEmail().'</td></tr>';
        $cad .= '<tr><td><strong>Telefono</strong></td><td>'.$this->getCelular().'</td></tr>';
        $cad .= '<tr><td><strong>Cédula</strong></td><td>'.$this->getDocumento().'</td></tr>';
        $cad .= '<tr><td><strong>Dirección</strong></td><td>'.$this->getDireccion().'</td></tr>';
        $cad .= '<tr><td><strong>Rango de Edad</strong></td><td>'.$this->getRangoedad()->getNombre().'</td></tr>';
        $cad .= '</table>';
        return $cad;

    }

    /**
     * Get DireccionCompleta
     *
     * @return string
     */
    public function getDireccionCompleta()
    {
        $direccion = $this->getEnvio();
        if($direccion){
            $cad = '<ul class="">';
            $cad .= '<li><strong>Entrega: </strong>'.$direccion->getFechaDeEnvio().'</li>';
            if($direccion->getCiudad()){
                $cad .= '<li><strong>Deparatamento: </strong>'.$direccion->getCiudad()->getDepartamento().'</li>';
                $cad .= '<li><strong>Ciudad: </strong>'.$direccion->getCiudad().'</li>';
            }
            $cad .= '<li><strong>Dirección: </strong>'.$direccion->getDireccion().'</li>';
            $cad .= '<li><strong>Es oficina: </strong>'.$direccion->getOficina().'</li>';
            if($direccion->getAdicionales())
                $cad .= '<li><strong>Adicionales: </strong>'.$direccion->getAdicionales().'</li>';
            $cad .= '</ul>';
            return $cad;
        }
        return '';
        
        $direccion = $this->getEnvio();
        if($direccion){
            $cad = '<table class="table table-bordered">';
            $cad .= '<tr><td><strong>Deparatamento</strong></td><td>'.$direccion->getCiudad()->getDepartamento().'</td></tr>';
            $cad .= '<tr><td><strong>Ciudad</strong></td><td>'.$direccion->getCiudad().'</td></tr>';
            $cad .= '<tr><td><strong>Dirección</strong></td><td>'.$direccion->getDireccion().'</td></tr>';
            $cad .= '<tr><td><strong>Es oficina</strong></td><td>'.$direccion->getOficina().'</td></tr>';
            if($direccion->getAdicionales())
                $cad .= '<tr><td><strong>Adicionales</strong></td><td>'.$direccion->getAdicionales().'</td></tr>';
            $cad .= '</table>';
            return $cad;
        }
        return '';
    }

    /**
 * Get Productos
 *
 * @return string
 */
    public function getProductos()
    {
        if($this->getCompra()){
            $cad = '<ul class="">';
            foreach ($this->getCompra()->getCompraitems() as $item){
                $cad .= '<li><strong>'.$item->getProducto()->getNombreEs().'</strong> | '.$item->getTalla().' | '.$item->getCantidad().'</li>';
            }
            $cad .= '</ul>';
            return $cad;
        }
        return '';


        if($this->getCompra()){
            $cad = '<table class="table table-bordered np"><tr><td><strong>Nombre</strong></td><td><strong>Presentación</strong></td><td><strong>Cantidad</strong></td></tr>';
            foreach ($this->getCompra()->getCompraitems() as $item){
                $cad .= '<tr><td>'.$item->getProducto()->getNombreEs().'</td><td>'.$item->getTalla().'</td><td>'.$item->getCantidad().'</td></tr>';
            }
            $cad .= '</table>';
            return $cad;
        }
        return '';

    }

    /**
     * Get Descripcion
     *
     * @return string
     */
    public function getDescripcion()
    {
        $cad = '';
        if($this->getCompra()){
            $cad = '<a data-toggle="collapse" data-target="#desc_'.$this->getId().'">Ver <i class="fa fa-caret-down" aria-hidden="true"></i></a>';
            $cad .= '<div class="collapse" id="desc_'.$this->getId().'">';
            $cad .= $this->getCompra()->getDescripcion();
            $cad .= '</div>';
        }
        return $cad;

    }

    /**
     * Get UsuarioCompleto
     *
     * @return string
     */
    public function getDedi()
    {
        if($this->getDedicatoria()){
            $cad = '<a data-toggle="collapse" data-target="#dedi_'.$this->getId().'">Ver <i class="fa fa-caret-down" aria-hidden="true"></i></a>';
            $cad .= '<ul class="collapse" id="dedi_'.$this->getId().'">';
            $cad .= '<li><strong>De: </strong>'.$this->getDedicatoria()->getDe().'</li>';
            $cad .= '<li><strong>Para: </strong>'.$this->getDedicatoria()->getPara().'</li>';
            $cad .= '<li><strong>Mensaje: </strong>'.$this->getDedicatoria()->getMensaje().'</li>';
            $cad .= '</ul>';
            return $cad;
        }
        return '';


    }


    /**
     * Set recibido
     *
     * @param \DateTime $recibido
     *
     * @return Factura
     */
    public function setRecibido($recibido)
    {
        $this->recibido = $recibido;

        return $this;
    }

    /**
     * Get recibido
     *
     * @return \DateTime
     */
    public function getRecibido()
    {
        return $this->recibido;
    }

    /**
     * Set camino
     *
     * @param \DateTime $camino
     *
     * @return Factura
     */
    public function setCamino($camino)
    {
        $this->camino = $camino;

        return $this;
    }

    /**
     * Get camino
     *
     * @return \DateTime
     */
    public function getCamino()
    {
        return $this->camino;
    }

    /**
     * Set entrgado
     *
     * @param \DateTime $entrgado
     *
     * @return Factura
     */
    public function setEntrgado($entrgado)
    {
        $this->entrgado = $entrgado;

        return $this;
    }

    /**
     * Get entrgado
     *
     * @return \DateTime
     */
    public function getEntrgado()
    {
        return $this->entrgado;
    }

    /**
     * Set idsap
     *
     * @param string $idsap
     *
     * @return Factura
     */
    public function setIdsap($idsap)
    {
        $this->idsap = $idsap;

        return $this;
    }

    /**
     * Get idsap
     *
     * @return string
     */
    public function getIdsap()
    {
        return $this->idsap;
    }

    /**
     * Set docsap
     *
     * @param string $docsap
     *
     * @return Factura
     */
    public function setDocsap($docsap)
    {
        $this->docsap = $docsap;

        return $this;
    }

    /**
     * Get docsap
     *
     * @return string
     */
    public function getDocsap()
    {
        return $this->docsap;
    }

    /**
     * Set request
     *
     * @param array $request
     *
     * @return Factura
     */
    public function setRequest($request)
    {
        $this->request = $request;

        return $this;
    }

    /**
     * Get request
     *
     * @return array
     */
    public function getRequest()
    {
        return $this->request;
    }

    /**
     * Set reportada
     *
     * @param boolean $reportada
     *
     * @return Factura
     */
    public function setReportada($reportada)
    {
        $this->reportada = $reportada;

        return $this;
    }

    /**
     * Get reportada
     *
     * @return boolean
     */
    public function getReportada()
    {
        return $this->reportada;
    }

    /**
     * Set rangoedad
     *
     * @param \AppBundle\Entity\RangoEdad $rangoedad
     *
     * @return Factura
     */
    public function setRangoedad(\AppBundle\Entity\RangoEdad $rangoedad = null)
    {
        $this->rangoedad = $rangoedad;

        return $this;
    }

    /**
     * Get rangoedad
     *
     * @return \AppBundle\Entity\RangoEdad
     */
    public function getRangoedad()
    {
        return $this->rangoedad;
    }
}

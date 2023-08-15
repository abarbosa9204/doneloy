<?php

namespace CarroiridianBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use PagosPayuBundle\Entity\RepuestaPago;

/**
 * Compra
 *
 * @ORM\Table(name="compra")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\CompraRepository")
 */
class Compra
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
     * @var guid
     *
     * @ORM\Column(name="guid", type="guid")
     */
    private $guid;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime")
     */
    private $createdAt;


    /**
     * Items that have been purchased.
     *
     * @var Compraitem[]
     * @ORM\OneToMany(targetEntity="CarroiridianBundle\Entity\Compraitem", mappedBy="compra", cascade={"remove"})
     */
    protected $compraitems;

    /**
     * Items that have been purchased.
     *
     * @var Bonos[]
     * @ORM\OneToMany(targetEntity="CarroiridianBundle\Entity\Bono", mappedBy="valorbono", cascade={"remove"})
     */
    protected $bonos;

    /**
     * Items that have been purchased.
     *
     * @var Comprabono[]
     * @ORM\OneToMany(targetEntity="CarroiridianBundle\Entity\Comprabono", mappedBy="compra", cascade={"remove"})
     */
    protected $comprabonos;

    /**
     * @var float
     *
     * @ORM\Column(name="precio", type="float", nullable=true)
     */
    private $precio;

    /**
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\EstadoCarrito")
     * @ORM\JoinColumn(name="eatadocarrito_id", referencedColumnName="id")
     */
    protected $estado;

    /**
     * @var boolean
     *
     * @ORM\Column(name="prueba", type="boolean")
     */
    private $prueba;

    /**
     * @var string
     *
     * @ORM\Column(name="descripcion", type="text", nullable=true)
     */
    private $descripcion;

    /**
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Envio")
     * @ORM\JoinColumn(name="direccion_id", referencedColumnName="id")
     */
    protected $direccion;

    /**
     * Items that have been purchased.
     *
     * @var RepuestaPago[]
     * @ORM\OneToMany(targetEntity="PagosPayuBundle\Entity\RepuestaPago", mappedBy="compra", cascade={"remove"})
     */
    protected $RespuestasPago;



    public function __toString()
    {
        return $this->getId().' ';
    }

    /**
     * (Initialize some fields).
     */
    public function __construct()
    {
        $this->id = $this->generateId();
        $this->guid = $this->id;
        $this->compraitems = new ArrayCollection();
        $this->createdAt = new \DateTime();

    }

    /**
     * @param int $storeId
     *
     * @return string
     */
    public function generateId($storeId = 1)
    {
        return preg_replace('/[^0-9]/i', '', sprintf('%d%d%03d%s', $storeId, date('Y'), date('z'), microtime()));
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set guid
     *
     * @param guid $guid
     *
     * @return Compra
     */
    public function setGuid($guid)
    {
        $this->guid = $guid;
    
        return $this;
    }

    /**
     * Get guid
     *
     * @return guid
     */
    public function getGuid()
    {
        return $this->guid;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return Compra
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;
    
        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set comprador
     *
     * @param \AppBundle\Entity\User $comprador
     *
     * @return Compra
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
     * Add compraitem
     *
     * @param \CarroiridianBundle\Entity\Compraitem $compraitem
     *
     * @return Compra
     */
    public function addCompraitem(\CarroiridianBundle\Entity\Compraitem $compraitem)
    {
        $this->compraitems[] = $compraitem;
    
        return $this;
    }

    /**
     * Remove compraitem
     *
     * @param \CarroiridianBundle\Entity\Compraitem $compraitem
     */
    public function removeCompraitem(\CarroiridianBundle\Entity\Compraitem $compraitem)
    {
        $this->compraitems->removeElement($compraitem);
    }

    /**
     * Get compraitems
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getCompraitems()
    {
        return $this->compraitems;
    }

    /**
     * Set bonos
     *
     * @param \CarroiridianBundle\Entity\Bono $bono
     *
     * @return Compra
     */
    public function setBono(\CarroiridianBundle\Entity\Bono $bono = null)
    {
        $this->bono = $bono;

        return $this;
    }

    /**
     * Get bonos
     *
     * @return \CarroiridianBundle\Entity\Bono
     */
    public function getBonos()
    {
        return $this->bonos;
    }


    /**
     * Set prueba
     *
     * @param boolean $prueba
     *
     * @return Compra
     */
    public function setPrueba($prueba)
    {
        $this->prueba = $prueba;
    
        return $this;
    }

    /**
     * Get prueba
     *
     * @return boolean
     */
    public function getPrueba()
    {
        return $this->prueba;
    }

    /**
     * Set descripcion
     *
     * @param string $descripcion
     *
     * @return Compra
     */
    public function setDescripcion($descripcion)
    {
        $this->descripcion = $descripcion;
    
        return $this;
    }

    /**
     * Get descripcion
     *
     * @return string
     */
    public function getDescripcion()
    {
        return $this->descripcion;
    }

    /**
     * Set estado
     *
     * @param \CarroiridianBundle\Entity\EstadoCarrito $estado
     *
     * @return Compra
     */
    public function setEstado(\CarroiridianBundle\Entity\EstadoCarrito $estado = null)
    {
        $this->estado = $estado;
    
        return $this;
    }

    /**
     * Get estado
     *
     * @return \CarroiridianBundle\Entity\EstadoCarrito
     */
    public function getEstado()
    {
        return $this->estado;
    }

    /**
     * Set direccion
     *
     * @param \CarroiridianBundle\Entity\Envio $direccion
     *
     * @return Compra
     */
    public function setDireccion(\CarroiridianBundle\Entity\Envio $direccion = null)
    {
        $this->direccion = $direccion;
    
        return $this;
    }

    /**
     * Get direccion
     *
     * @return \CarroiridianBundle\Entity\Envio
     */
    public function getDireccion()
    {
        return $this->direccion;
    }

    /**
     * Set precio
     *
     * @param float $precio
     *
     * @return Compra
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
     * Get Usuario
     *
     * @return string
     */
    public function getUsuario()
    {
        $user = $this->getDireccion()->getUser();
        if($user)
            return $user->getNombre().' '.$user->getApellidos();
        return '';
    }

    /**
     * Get Email
     *
     * @return string
     */
    public function getEmail()
    {
        $user = $this->getDireccion()->getUser();
        return $user->getEmail();
    }

    /**
     * Get Telefono
     *
     * @return string
     */
    public function getTelefono()
    {
        $user = $this->getDireccion()->getUser();
        return $user->getTelefono();
    }

    /**
     * Get UsuarioCompleto
     *
     * @return string
     */
    public function getUsuarioCompleto()
    {
        $user = $this->getComprador();
        if($user){
            $nombre = $user->getNombre().' '.$user->getApellidos();
            $cad = '<table class="table table-bordered">';
            $cad .= '<tr><td><strong>Nombre</strong></td><td>'.$nombre.'</td></tr>';
            $cad .= '<tr><td><strong>Email</strong></td><td>'.$user->getEmail().'</td></tr>';
            $cad .= '<tr><td><strong>Telefono</strong></td><td>'.$user->getTelefono().'</td></tr>';
            $cad .= '</table>';
            return $cad;
        }
        return '';

    }

    /**
     * Get DireccionCompleta
     *
     * @return string
     */
    public function getDireccionCompleta()
    {
        $direccion = $this->getDireccion();
        if($direccion){
            $cad = '<table class="table table-bordered">';
            $cad .= '<tr><td><strong>Deparatamento</strong></td><td>'.$direccion->getDepartamento().'</td></tr>';
            $cad .= '<tr><td><strong>Ciudad</strong></td><td>'.$direccion->getCiudad().'</td></tr>';
            $cad .= '<tr><td><strong>Dirección</strong></td><td>'.$direccion->getDireccion().'</td></tr>';
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
        $direccion = $this->getDireccion();
        if($direccion || 1){
            $cad = '<table class="table table-bordered"><tr><td>Nombre</td><td>Talla</td><td>Cantidad</td></tr>';
            foreach ($this->getCompraitems() as $item){
                if(0){$item = new Compraitem();}
                $cad .= '<tr><td>'.$item->getProducto()->getNombreEs().'</td><td>'.$item->getTalla().'</td><td>'.$item->getCantidad().'</td></tr>';
            }
            $cad .= '</table>';
            return $cad;
        }
        return '';
    }

    /**
     * Get Transaccion
     *
     * @return string
     */
    public function getTransaccion()
    {
        $continuar = true;
        $respuestas = $this->getRespuestasPago();
        if($respuestas){
            $cad = '<ul class="">';
            foreach ($respuestas as $respuesta){
                if(0){$respuesta = new RepuestaPago();}
                if($respuesta->getTipo() == 'CONFIRMACION' && $continuar){
                    $continuar = false;
                    $cad .= '<li><strong>Id Transacción: </strong>'.$respuesta->getTransactionId().'</li>';
                    $cad .= '<li><strong>Referencia: </strong>'.$respuesta->getReferenceCode().'</li>';
                    $cad .= '<li><strong>Valor: </strong>$'.number_format($respuesta->getTXVALUE()).'</li>';
                    $cad .= '<li><strong>Código Estado: </strong>'.$respuesta->getTransactionState().'</li>';
                    $cad .= '<li><strong>Fecha: </strong>'.$respuesta->getProcessingDate().'</li>';
                }
            }
            $cad .= '</ul>';
            return $cad;
        }
        return '';


        $continuar = true;
        $respuestas = $this->getRespuestasPago();
        if($respuestas){
            $cad = '<table class="table table-bordered">';
            foreach ($respuestas as $respuesta){
                if(0){$respuesta = new RepuestaPago();}
                if($respuesta->getTipo() == 'CONFIRMACION' && $continuar){
                    $continuar = false;
                    $cad .= '<tr><td><strong>Id Transacción</strong></td><td>'.$respuesta->getTransactionId().'</td></tr>';
                    $cad .= '<tr><td><strong>Referencia</strong></td><td>'.$respuesta->getReferenceCode().'</td></tr>';
                    $cad .= '<tr><td><strong>Valor</strong></td><td>$'.number_format($respuesta->getTXVALUE()).'</td></tr>';
                    $cad .= '<tr><td><strong>Código Estado</strong></td><td>'.$respuesta->getTransactionState().'</td></tr>';
                    $cad .= '<tr><td><strong>Fecha</strong></td><td>'.$respuesta->getProcessingDate().'</td></tr>';
                }
            }
            $cad .= '</table>';
            return $cad;
        }
        return '';
    }



    /**
     * Add respuestasPago
     *
     * @param \PagosPayuBundle\Entity\RepuestaPago $respuestasPago
     *
     * @return Compra
     */
    public function addRespuestasPago(\PagosPayuBundle\Entity\RepuestaPago $respuestasPago)
    {
        $this->RespuestasPago[] = $respuestasPago;
    
        return $this;
    }

    /**
     * Remove respuestasPago
     *
     * @param \PagosPayuBundle\Entity\RepuestaPago $respuestasPago
     */
    public function removeRespuestasPago(\PagosPayuBundle\Entity\RepuestaPago $respuestasPago)
    {
        $this->RespuestasPago->removeElement($respuestasPago);
    }

    /**
     * Get respuestasPago
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getRespuestasPago()
    {
        return $this->RespuestasPago;
    }

    /**
     * Add comprabono
     *
     * @param \CarroiridianBundle\Entity\Comprabono $comprabono
     *
     * @return Compra
     */
    public function addComprabono(\CarroiridianBundle\Entity\Comprabono $comprabono)
    {
        $this->comprabonos[] = $comprabono;

        return $this;
    }

    /**
     * Remove comprabono
     *
     * @param \CarroiridianBundle\Entity\Comprabono $comprabono
     */
    public function removeComprabono(\CarroiridianBundle\Entity\Comprabono $comprabono)
    {
        $this->comprabonos->removeElement($comprabono);
    }

    /**
     * Get comprabonos
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getComprabonos()
    {
        return $this->comprabonos;
    }

    /**
     * Add bono
     *
     * @param \CarroiridianBundle\Entity\Bono $bono
     *
     * @return Compra
     */
    public function addBono(\CarroiridianBundle\Entity\Bono $bono)
    {
        $this->bonos[] = $bono;

        return $this;
    }

    /**
     * Remove bono
     *
     * @param \CarroiridianBundle\Entity\Bono $bono
     */
    public function removeBono(\CarroiridianBundle\Entity\Bono $bono)
    {
        $this->bonos->removeElement($bono);
    }
}

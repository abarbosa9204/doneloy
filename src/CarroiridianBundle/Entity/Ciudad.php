<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Ciudad
 *
 * @ORM\Table(name="ciudad")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\CiudadRepository")
 */
class Ciudad
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
     * @var Almacen[]
     * @ORM\ManyToMany(targetEntity="CarroiridianBundle\Entity\Almacen")
     */
    private $almacenes;

    /**
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Departamento")
     * @ORM\JoinColumn(name="departamento_id", referencedColumnName="id")
     */
    private $departamento;

    /**
     * @var string
     *
     * @ORM\Column(name="nombre", type="string", length=255)
     */
    private $nombre;

    /**
     * @var integer
     *
     * @ORM\Column(name="orden", type="integer")
     */
    private $orden = 1;

    /**
     * @var boolean
     *
     * @ORM\Column(name="visible", type="boolean")
     */
    private $visible = true;

    /**
     * @var boolean
     *
     * @ORM\Column(name="soloenvio", type="boolean")
     */
    private $soloenvio = true;

    /**
     * @var boolean
     *
     * @ORM\Column(name="envio", type="boolean")
     */
    private $envio = true;

    /**
     * @var float
     *
     * @ORM\Column(name="costo", type="float")
     */
    private $costo;

    public function __toString()
    {
        return $this->getNombre().' -- $'.number_format($this->getCosto());
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
     * Set nombre
     *
     * @param string $nombre
     *
     * @return Ciudad
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
     * Set orden
     *
     * @param integer $orden
     *
     * @return Ciudad
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
     * @return Ciudad
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
     * Set departamento
     *
     * @param \CarroiridianBundle\Entity\Departamento $departamento
     *
     * @return Ciudad
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
     * Set costo
     *
     * @param float $costo
     *
     * @return Ciudad
     */
    public function setCosto($costo)
    {
        $this->costo = $costo;
    
        return $this;
    }

    /**
     * Get costo
     *
     * @return float
     */
    public function getCosto()
    {
        return $this->costo;
    }

    /**
     * Set soloenvio
     *
     * @param boolean $soloenvio
     *
     * @return Ciudad
     */
    public function setSoloenvio($soloenvio)
    {
        $this->soloenvio = $soloenvio;

        return $this;
    }

    /**
     * Get soloenvio
     *
     * @return boolean
     */
    public function getSoloenvio()
    {
        return $this->soloenvio;
    }

    /**
     * Set envio
     *
     * @param boolean $envio
     *
     * @return Ciudad
     */
    public function setEnvio($envio)
    {
        $this->envio = $envio;

        return $this;
    }

    /**
     * Get envio
     *
     * @return boolean
     */
    public function getEnvio()
    {
        return $this->envio;
    }


    /**
     * Constructor
     */
    public function __construct()
    {
        $this->almacenes = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add almacene
     *
     * @param \CarroiridianBundle\Entity\Almacen $almacene
     *
     * @return Ciudad
     */
    public function addAlmacene(\CarroiridianBundle\Entity\Almacen $almacene)
    {
        $this->almacenes[] = $almacene;

        return $this;
    }

    /**
     * Remove almacene
     *
     * @param \CarroiridianBundle\Entity\Almacen $almacene
     */
    public function removeAlmacene(\CarroiridianBundle\Entity\Almacen $almacene)
    {
        $this->almacenes->removeElement($almacene);
    }

    /**
     * Get almacenes
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getAlmacenes()
    {
        return $this->almacenes;
    }
}

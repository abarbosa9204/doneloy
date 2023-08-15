<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * Entrada
 *
 * @ORM\Table(name="entrada")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\EntradaRepository")
 */
class Entrada
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
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Inventario")
     * @ORM\JoinColumn(name="inventario_id", referencedColumnName="id")
     */
    private $inventario;

    /**
     * @var int
     *
     * @ORM\Column(name="cantidad", type="integer", nullable=true)
     */
    private $cantidad = 0;

    /**
     * @var \DateTime
     *
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(name="fecha", type="datetime")
     */
    private $fecha;


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
     * Set cantidad
     *
     * @param integer $cantidad
     *
     * @return Entrada
     */
    public function setCantidad($cantidad)
    {
        $this->cantidad = $cantidad;

        return $this;
    }

    /**
     * Get cantidad
     *
     * @return int
     */
    public function getCantidad()
    {
        return $this->cantidad;
    }

    /**
     * Set fecha
     *
     * @param \DateTime $fecha
     *
     * @return Entrada
     */
    public function setFecha($fecha)
    {
        $this->fecha = $fecha;

        return $this;
    }

    /**
     * Get fecha
     *
     * @return \DateTime
     */
    public function getFecha()
    {
        return $this->fecha;
    }


    /**
     * Set inventario
     *
     * @param \CarroiridianBundle\Entity\Inventario $inventario
     *
     * @return Entrada
     */
    public function setInventario(\CarroiridianBundle\Entity\Inventario $inventario = null)
    {
        $this->inventario = $inventario;
    
        return $this;
    }

    /**
     * Get inventario
     *
     * @return \CarroiridianBundle\Entity\Inventario
     */
    public function getInventario()
    {
        return $this->inventario;
    }


}

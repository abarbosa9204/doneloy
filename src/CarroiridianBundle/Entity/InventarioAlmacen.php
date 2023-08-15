<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * InventarioAlmacen
 *
 * @ORM\Table(name="inventario_almacen")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\InventarioAlmacenRepository")
 */
class InventarioAlmacen
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
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Producto")
     * @ORM\JoinColumn(name="producto_id", referencedColumnName="id")
     */
    private $producto;


    /**
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Talla")
     * @ORM\JoinColumn(name="talla_id", referencedColumnName="id")
     */
    private $talla;


    /**
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Almacen")
     * @ORM\JoinColumn(name="almacen_id", referencedColumnName="id", nullable=true)
     */
    private $almacen;

    /**
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Color")
     * @ORM\JoinColumn(name="color_id", referencedColumnName="id", nullable=true)
     */
    private $color;

    /**
     * @var int
     *
     * @ORM\Column(name="cantidad", type="integer")
     */
    private $cantidad;


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
     * @return InventarioAlmacen
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
     * Set producto
     *
     * @param \CarroiridianBundle\Entity\Producto $producto
     *
     * @return InventarioAlmacen
     */
    public function setProducto(\CarroiridianBundle\Entity\Producto $producto = null)
    {
        $this->producto = $producto;

        return $this;
    }

    /**
     * Get producto
     *
     * @return \CarroiridianBundle\Entity\Producto
     */
    public function getProducto()
    {
        return $this->producto;
    }

    /**
     * Set talla
     *
     * @param \CarroiridianBundle\Entity\Talla $talla
     *
     * @return InventarioAlmacen
     */
    public function setTalla(\CarroiridianBundle\Entity\Talla $talla = null)
    {
        $this->talla = $talla;

        return $this;
    }

    /**
     * Get talla
     *
     * @return \CarroiridianBundle\Entity\Talla
     */
    public function getTalla()
    {
        return $this->talla;
    }

    /**
     * Set almacen
     *
     * @param \CarroiridianBundle\Entity\Almacen $almacen
     *
     * @return InventarioAlmacen
     */
    public function setAlmacen(\CarroiridianBundle\Entity\Almacen $almacen = null)
    {
        $this->almacen = $almacen;

        return $this;
    }

    /**
     * Get almacen
     *
     * @return \CarroiridianBundle\Entity\Almacen
     */
    public function getAlmacen()
    {
        return $this->almacen;
    }

    /**
     * Set color
     *
     * @param \CarroiridianBundle\Entity\Color $color
     *
     * @return InventarioAlmacen
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
}

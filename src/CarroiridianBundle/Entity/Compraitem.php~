<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Compraitem
 *
 * @ORM\Table(name="compraitem")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\CompraitemRepository")
 */
class Compraitem
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
     * @var int
     *
     * @ORM\Column(name="cantidad", type="integer")
     */
    private $cantidad;

    /**
     * Producto que se va a comprar
     *
     * @var Producto
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Producto")
     * @ORM\JoinColumn(name="producto_id", referencedColumnName="id")
     */
    protected $producto;

    /**
     * Talla del producto que se va a comprar
     *
     * @var Talla
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Talla")
     * @ORM\JoinColumn(name="talla_id", referencedColumnName="id")
     */
    protected $talla;

    /**
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Compra", inversedBy="compraitems")
     * @ORM\JoinColumn(name="compra_id", referencedColumnName="id")
     */
    protected $compra;

    public function __toString()
    {
        return $this->getProducto().' | '.$this->getTalla().' | X'.$this->getCantidad();
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
     * Set cantidad
     *
     * @param integer $cantidad
     *
     * @return Compraitem
     */
    public function setCantidad($cantidad)
    {
        $this->cantidad = $cantidad;
    
        return $this;
    }

    /**
     * Get cantidad
     *
     * @return integer
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
     * @return Compraitem
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
     * Set compra
     *
     * @param \CarroiridianBundle\Entity\Compra $compra
     *
     * @return Compraitem
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
     * Set talla
     *
     * @param \CarroiridianBundle\Entity\Talla $talla
     *
     * @return Compraitem
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
}

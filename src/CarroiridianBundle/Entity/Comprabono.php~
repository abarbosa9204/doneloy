<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Comprabono
 *
 * @ORM\Table(name="comprabono")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\ComprabonoRepository")
 */
class Comprabono
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
     * Bono que se va a regalar
     *
     * @var Bono
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Bono")
     * @ORM\JoinColumn(name="bono_id", referencedColumnName="id")
     */
    protected $bono;


    /**
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Compra", inversedBy="comprabonos")
     * @ORM\JoinColumn(name="compra_id", referencedColumnName="id")
     */
    protected $compra;

    public function __toString()
    {
        return $this->getId().' ';
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
     * Set bono
     *
     * @param \CarroiridianBundle\Entity\Bono $bono
     *
     * @return Comprabono
     */
    public function setBono(\CarroiridianBundle\Entity\Bono $bono = null)
    {
        $this->bono = $bono;

        return $this;
    }

    /**
     * Get bono
     *
     * @return \CarroiridianBundle\Entity\Bono
     */
    public function getBono()
    {
        return $this->bono;
    }

    /**
     * Set compra
     *
     * @param \CarroiridianBundle\Entity\Compra $compra
     *
     * @return Comprabono
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
}

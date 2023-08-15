<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Taller
 *
 * @ORM\Table(name="taller")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\TallerRepository")
 */
class Taller
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
     * @ORM\JoinColumn(name="producto_id", referencedColumnName="id", nullable=true)
     */
    private $taller;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="fecha", type="datetime", nullable=false)
     */
    private $fecha;


    public function __toString()
    {
		$months = [
			'',
			'Enero',
			'Febrero',
			'Marzo',
			'Abril',
			'Mayo',
			'Junio',
			'Julio',
			'Agosto',
			'Septiembre',
			'Octubre',
			'Noviembre',
			'Diciembre',
		];
        return $this->fecha->format('d').' de '.$months[$this->fecha->format('n')];
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
     * Set fecha
     *
     * @param \DateTime $fecha
     *
     * @return Taller
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
     * Set producto
     *
     * @param \CarroiridianBundle\Entity\Producto $taller
     *
     * @return Taller
     */
    public function setTaller(\CarroiridianBundle\Entity\Producto $taller = null)
    {
        $this->taller = $taller;
    
        return $this;
    }

    /**
     * Get talller
     *
     * @return \CarroiridianBundle\Entity\Producto
     */
    public function getTaller()
    {
        return $this->taller;
    }
}

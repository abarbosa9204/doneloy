<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Estilo
 *
 * @ORM\Table(name="estilo")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\EstiloRepository")
 */
class Estilo
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


    public function __toString()
    {
        return $this->nombreEs;
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
     * Set nombreEs
     *
     * @param string $nombreEs
     *
     * @return Estilo
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
     * @return Estilo
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
     * Set orden
     *
     * @param integer $orden
     *
     * @return Estilo
     */
    public function setOrden($orden)
    {
        $this->orden = $orden;

        return $this;
    }

    /**
     * Get orden
     *
     * @return int
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
     * @return Estilo
     */
    public function setVisible($visible)
    {
        $this->visible = $visible;

        return $this;
    }

    /**
     * Get visible
     *
     * @return bool
     */
    public function getVisible()
    {
        return $this->visible;
    }
}

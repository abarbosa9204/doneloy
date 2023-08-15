<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Ruta
 *
 * @ORM\Table(name="ruta")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\RutaRepository")
 */
class Ruta
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
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Ruta")
     * @ORM\JoinColumn(name="padre_id", referencedColumnName="id")
     */
    private $padre;

    /**
     * @var string
     *
     * @ORM\Column(name="nombre_interno", type="string", length=255)
     */
    private $nombreInterno;

    /**
     * @var string
     *
     * @ORM\Column(name="nombre_es", type="string", length=255)
     */
    private $nombreEs;

    /**
     * @var string
     *
     * @ORM\Column(name="nombre_en", type="string", length=255)
     */
    private $nombreEn;

    public function __toString()
    {
        return $this->getNombreEs().' ';
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
     * Set nombreInterno
     *
     * @param string $nombreInterno
     *
     * @return Ruta
     */
    public function setNombreInterno($nombreInterno)
    {
        $this->nombreInterno = $nombreInterno;

        return $this;
    }

    /**
     * Get nombreInterno
     *
     * @return string
     */
    public function getNombreInterno()
    {
        return $this->nombreInterno;
    }

    /**
     * Set nombreEs
     *
     * @param string $nombreEs
     *
     * @return Ruta
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
     * @return Ruta
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
     * Set padre
     *
     * @param \AppBundle\Entity\Ruta $padre
     *
     * @return Ruta
     */
    public function setPadre(\AppBundle\Entity\Ruta $padre = null)
    {
        $this->padre = $padre;

        return $this;
    }

    /**
     * Get padre
     *
     * @return \AppBundle\Entity\Ruta
     */
    public function getPadre()
    {
        return $this->padre;
    }
}

<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping\JoinTable;

/**
 * ConfiguracionPlan
 *
 * @ORM\Table(name="configuracion_plan")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\ConfiguracionPlanRepository")
 */
class ConfiguracionPlan
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
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Categoria")
     * @ORM\JoinColumn(name="tipo_plan", referencedColumnName="id")
     */
    private $tipoPlan;

    /**
     * @var bool
     *
     * @ORM\Column(name="incluye_jarron", type="boolean")
     */
    private $incluyeJarron;

    /**
     * @var bool
     *
     * @ORM\Column(name="flor_seleccionable", type="boolean")
     */
    private $florSeleccionable;

    /**
     * @var bool
     *
     * @ORM\Column(name="corporativo", type="boolean")
     */
    private $corporativo;

    /**
     * @var Duracion[]
     * 
     * @ORM\ManyToMany(targetEntity="CarroiridianBundle\Entity\Duracion")
     * @ORM\JoinTable(name="configuracion_plan_duracion",
     *      joinColumns={@ORM\JoinColumn(name="configuracion_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="duracion_id", referencedColumnName="id")}
     *      )
     */
    private $duraciones;


    public function __construct()
    {
        $this->duraciones = new ArrayCollection();
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
     * Set incluyeJarron
     *
     * @param boolean $incluyeJarron
     *
     * @return ConfiguracionPlan
     */
    public function setIncluyeJarron($incluyeJarron)
    {
        $this->incluyeJarron = $incluyeJarron;

        return $this;
    }

    /**
     * Get incluyeJarron
     *
     * @return bool
     */
    public function getIncluyeJarron()
    {
        return $this->incluyeJarron;
    }

    /**
     * Set florSeleccionable
     *
     * @param boolean $florSeleccionable
     *
     * @return ConfiguracionPlan
     */
    public function setFlorSeleccionable($florSeleccionable)
    {
        $this->florSeleccionable = $florSeleccionable;

        return $this;
    }

    /**
     * Get florSeleccionable
     *
     * @return bool
     */
    public function getFlorSeleccionable()
    {
        return $this->florSeleccionable;
    }

    /**
     * Set corporativo
     *
     * @param boolean $corporativo
     *
     * @return ConfiguracionPlan
     */
    public function setCorporativo($corporativo)
    {
        $this->corporativo = $corporativo;

        return $this;
    }

    /**
     * Get corporativo
     *
     * @return bool
     */
    public function getCorporativo()
    {
        return $this->corporativo;
    }

    /**
     * Set tipoPlan
     *
     * @param \CarroiridianBundle\Entity\Categoria $categoria
     *
     * @return ConfiguracionPlan
     */
    public function setTipoPlan(\CarroiridianBundle\Entity\Categoria $categoria = null)
    {
        $this->tipoPlan = $categoria;
    
        return $this;
    }

    /**
     * Get tipoPlan
     *
     * @return \CarroiridianBundle\Entity\Categoria
     */
    public function getTipoPlan()
    {
        return $this->tipoPlan;
    }

    /**
     * Add duracion
     *
     * @param \CarroiridianBundle\Entity\Duracion $duracion
     *
     * @return ConfiguracionPlan
     */
    public function addDuracion(\CarroiridianBundle\Entity\Duracion $duracion)
    {
        $this->duraciones[] = $duracion;
    
        return $this;
    }

    /**
     * Remove duracion
     *
     * @param \CarroiridianBundle\Entity\Duracion $duracion
     */
    public function removeDuracion(\CarroiridianBundle\Entity\Duracion $duracion)
    {
        $this->duraciones->removeElement($duracion);
    }

    /**
     * Get duraciones
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getDuraciones()
    {
        return $this->duraciones;
    }
}


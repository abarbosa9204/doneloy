<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Departamento
 *
 * @ORM\Table(name="departamento")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\DepartamentoRepository")
 */
class Departamento
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
     * @ORM\ManyToOne(targetEntity="GeoBundle\Entity\PaisFacturacion")
     * @ORM\JoinColumn(name="pais_id", referencedColumnName="id")
     */
    private $pais;

    /**
     * @var string
     *
     * @ORM\Column(name="nombre", type="string", length=255)
     */
    private $nombre;


    public function __toString()
    {
        return $this->nombre.' ';
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
     * @return Departamento
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
     * Set pais
     *
     * @param \GeoBundle\Entity\PaisFacturacion $pais
     *
     * @return Departamento
     */
    public function setPais(\GeoBundle\Entity\PaisFacturacion $pais = null)
    {
        $this->pais = $pais;
    
        return $this;
    }

    /**
     * Get departamento
     *
     * @return \GeoBundle\Entity\PaisFacturacion
     */
    public function getPais()
    {
        return $this->pais;
    }
}

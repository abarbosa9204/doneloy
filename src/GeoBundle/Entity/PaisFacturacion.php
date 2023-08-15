<?php

namespace GeoBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * PaisFacturacion
 *
 * @ORM\Table(name="pais_facturacion")
 * @ORM\Entity(repositoryClass="GeoBundle\Repository\PaisFacturacionRepository")
 */
class PaisFacturacion
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
     * @ORM\Column(name="nombre", type="string", length=255)
     */
    private $nombre;


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
     * Set nombre
     *
     * @param string $nombre
     *
     * @return PaisFacturacion
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

    public function __toString(){
        return $this->nombre.' ';
    }

    public function __construct(){
        // error_log('asdasdasdasd'.PHP_EOL,3,'log_jimmy.log');
    }
}


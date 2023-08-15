<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Galeria
 *
 * @ORM\Table(name="galeria")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\GaleriaRepository")
 */
class Galeria
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
     * @ORM\Column(name="llave", type="string", length=255, unique=true)
     */
    private $llave;


    public function __toString()
    {
        return $this->llave.' ';
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
     * Set llave
     *
     * @param string $llave
     *
     * @return Galeria
     */
    public function setLlave($llave)
    {
        $this->llave = $llave;

        return $this;
    }

    /**
     * Get llave
     *
     * @return string
     */
    public function getLlave()
    {
        return $this->llave;
    }
}

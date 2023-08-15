<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * PagoLogger
 *
 * @ORM\Table(name="pago_logger")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\PagoLoggerRepository")
 */
class PagoLogger
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
     * @ORM\Column(name="respuesta", type="text")
     */
    private $respuesta;


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
     * Set respuesta
     *
     * @param string $respuesta
     *
     * @return PagoLogger
     */
    public function setRespuesta($respuesta)
    {
        $this->respuesta = $respuesta;
    
        return $this;
    }

    /**
     * Get respuesta
     *
     * @return string
     */
    public function getRespuesta()
    {
        return $this->respuesta;
    }
}

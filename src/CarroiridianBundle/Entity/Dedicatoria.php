<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Dedicatoria
 *
 * @ORM\Table(name="dedicatoria")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\DedicatoriaRepository")
 */
class Dedicatoria
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
     * @ORM\Column(name="de", type="string", length=255)
     * @Assert\NotBlank(message = "El remitente no puede ser vacio")
     */
    private $de;

    /**
     * @var string
     *
     * @ORM\Column(name="para", type="string", length=255)
     * @Assert\NotBlank(message = "El destinatario no puede ser vacio")
     */
    private $para;

    /**
     * @var string
     *
     * @ORM\Column(name="mensaje", type="text")
     * @Assert\NotBlank(message = "El mensaje no puede ser vacio")
     */
    private $mensaje;

    public function __toString()
    {
        return ' '.$this->de;
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
     * Set de
     *
     * @param string $de
     *
     * @return Dedicatoria
     */
    public function setDe($de)
    {
        $this->de = $de;

        return $this;
    }

    /**
     * Get de
     *
     * @return string
     */
    public function getDe()
    {
        return $this->de;
    }

    /**
     * Set para
     *
     * @param string $para
     *
     * @return Dedicatoria
     */
    public function setPara($para)
    {
        $this->para = $para;

        return $this;
    }

    /**
     * Get para
     *
     * @return string
     */
    public function getPara()
    {
        return $this->para;
    }

    /**
     * Set mensaje
     *
     * @param string $mensaje
     *
     * @return Dedicatoria
     */
    public function setMensaje($mensaje)
    {
        $this->mensaje = $mensaje;

        return $this;
    }

    /**
     * Get mensaje
     *
     * @return string
     */
    public function getMensaje()
    {
        return $this->mensaje;
    }
}

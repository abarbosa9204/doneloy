<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Recomendacion
 *
 * @ORM\Table(name="recomendacion")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\RecomendacionRepository")
 */
class Recomendacion
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
     * @ORM\Column(name="remitente", type="string", length=255)
     */
    private $remitente;

    /**
     * @var string
     *
     * @ORM\Column(name="remitente_correo", type="string", length=255)
     */
    private $remitenteCorreo;

    /**
     * @var string
     *
     * @ORM\Column(name="receptor", type="string", length=255)
     */
    private $receptor;

    /**
     * @var string
     *
     * @ORM\Column(name="receptor_correo", type="string", length=255)
     */
    private $receptorCorreo;

    /**
     * @var string
     *
     * @ORM\Column(name="mensaje", type="text")
     */
    private $mensaje;


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
     * Set remitente
     *
     * @param string $remitente
     *
     * @return Recomendacion
     */
    public function setRemitente($remitente)
    {
        $this->remitente = $remitente;

        return $this;
    }

    /**
     * Get remitente
     *
     * @return string
     */
    public function getRemitente()
    {
        return $this->remitente;
    }

    /**
     * Set remitenteCorreo
     *
     * @param string $remitenteCorreo
     *
     * @return Recomendacion
     */
    public function setRemitenteCorreo($remitenteCorreo)
    {
        $this->remitenteCorreo = $remitenteCorreo;

        return $this;
    }

    /**
     * Get remitenteCorreo
     *
     * @return string
     */
    public function getRemitenteCorreo()
    {
        return $this->remitenteCorreo;
    }

    /**
     * Set receptor
     *
     * @param string $receptor
     *
     * @return Recomendacion
     */
    public function setReceptor($receptor)
    {
        $this->receptor = $receptor;

        return $this;
    }

    /**
     * Get receptor
     *
     * @return string
     */
    public function getReceptor()
    {
        return $this->receptor;
    }

    /**
     * Set receptorCorreo
     *
     * @param string $receptorCorreo
     *
     * @return Recomendacion
     */
    public function setReceptorCorreo($receptorCorreo)
    {
        $this->receptorCorreo = $receptorCorreo;

        return $this;
    }

    /**
     * Get receptorCorreo
     *
     * @return string
     */
    public function getReceptorCorreo()
    {
        return $this->receptorCorreo;
    }

    /**
     * Set mensaje
     *
     * @param string $mensaje
     *
     * @return Recomendacion
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

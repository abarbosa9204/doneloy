<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Tarjeta
 *
 * @ORM\Table(name="tarjeta")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\TarjetaRepository")
 */
class Tarjeta
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
     * @ORM\Column(name="numeroTarjeta", type="string", length=255)
     */
    private $numeroTarjeta;

    /**
     * @var string
     *
     * @ORM\Column(name="ultimos", type="string", length=255)
     */
    private $ultimos;

    /**
     * @var string
     *
     * @ORM\Column(name="tipoTarjeta", type="string", length=255)
     */
    private $tipoTarjeta;

    /**
     * @var string
     *
     * @ORM\Column(name="fecha", type="string", length=255)
     */
    private $fecha;

    /**
     * @var string
     *
     * @ORM\Column(name="cvv", type="string", length=255)
     */
    private $cvv;

    /**
     * @var string
     *
     * @ORM\Column(name="numDoc", type="string", length=255)
     */
    private $numDoc;

    /**
     * @var string
     *
     * @ORM\Column(name="tipoDoc", type="string", length=255)
     */
    private $tipoDoc;

    /**
     * @var string
     *
     * @ORM\Column(name="titular", type="string", length=255)
     */
    private $titular;

    /**
     * @var string
     *
     * @ORM\Column(name="code", type="string", nullable=true)
     */
    private $code;

    /**
     * @var string
     *
     * @ORM\Column(name="creditCardTokenId", type="string", length=255)
     */
    private $creditCardTokenId;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User")
     * @ORM\JoinColumn(name="usuario_id", referencedColumnName="id")
     */
    private $usuario;


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
     * Set numeroTarjeta
     *
     * @param string $numeroTarjeta
     *
     * @return Tarjeta
     */
    public function setNumeroTarjeta($numeroTarjeta)
    {
        $this->numeroTarjeta = $numeroTarjeta;

        return $this;
    }

    /**
     * Get numeroTarjeta
     *
     * @return string
     */
    public function getNumeroTarjeta()
    {
        return $this->numeroTarjeta;
    }

    /**
     * Set tipoTarjeta
     *
     * @param string $tipoTarjeta
     *
     * @return Tarjeta
     */
    public function setTipoTarjeta($tipoTarjeta)
    {
        $this->tipoTarjeta = $tipoTarjeta;

        return $this;
    }

    /**
     * Get tipoTarjeta
     *
     * @return string
     */
    public function getTipoTarjeta()
    {
        return $this->tipoTarjeta;
    }

    /**
     * Set fecha
     *
     * @param string $fecha
     *
     * @return Tarjeta
     */
    public function setFecha($fecha)
    {
        $this->fecha = $fecha;

        return $this;
    }

    /**
     * Get fecha
     *
     * @return string
     */
    public function getFecha()
    {
        return $this->fecha;
    }

    /**
     * Set cvv
     *
     * @param string $cvv
     *
     * @return Tarjeta
     */
    public function setCvv($cvv)
    {
        $this->cvv = $cvv;

        return $this;
    }

    /**
     * Get cvv
     *
     * @return string
     */
    public function getCvv()
    {
        return $this->cvv;
    }

    /**
     * Set numDoc
     *
     * @param string $numDoc
     *
     * @return Tarjeta
     */
    public function setNumDoc($numDoc)
    {
        $this->numDoc = $numDoc;

        return $this;
    }

    /**
     * Get numDoc
     *
     * @return string
     */
    public function getNumDoc()
    {
        return $this->numDoc;
    }

    /**
     * Set tipoDoc
     *
     * @param string $tipoDoc
     *
     * @return Tarjeta
     */
    public function setTipoDoc($tipoDoc)
    {
        $this->tipoDoc = $tipoDoc;

        return $this;
    }

    /**
     * Get tipoDoc
     *
     * @return string
     */
    public function getTipoDoc()
    {
        return $this->tipoDoc;
    }



    /**
     * Set usuario
     *
     * @param \AppBundle\Entity\User $usuario
     *
     * @return Tarjeta
     */
    public function setUsuario(\AppBundle\Entity\User $usuario = null)
    {
        $this->usuario = $usuario;

        return $this;
    }

    /**
     * Get usuario
     *
     * @return \AppBundle\Entity\User
     */
    public function getUsuario()
    {
        return $this->usuario;
    }

    /**
     * Set ultimos
     *
     * @param string $ultimos
     *
     * @return Tarjeta
     */
    public function setUltimos($ultimos)
    {
        $this->ultimos = $ultimos;

        return $this;
    }

    /**
     * Get ultimos
     *
     * @return string
     */
    public function getUltimos()
    {
        return $this->ultimos;
    }

    /**
     * Set titular
     *
     * @param string $titular
     *
     * @return Tarjeta
     */
    public function setTitular($titular)
    {
        $this->titular = $titular;

        return $this;
    }

    /**
     * Get titular
     *
     * @return string
     */
    public function getTitular()
    {
        return $this->titular;
    }

    /**
     * Set code
     *
     * @param string $code
     *
     * @return Tarjeta
     */
    public function setCode($code)
    {
        $this->code = $code;

        return $this;
    }

    /**
     * Get code
     *
     * @return string
     */
    public function getCode()
    {
        return $this->code;
    }

    /**
     * Set creditCardTokenId
     *
     * @param string $creditCardTokenId
     *
     * @return Tarjeta
     */
    public function setCreditCardTokenId($creditCardTokenId)
    {
        $this->creditCardTokenId = $creditCardTokenId;

        return $this;
    }

    /**
     * Get creditCardTokenId
     *
     * @return string
     */
    public function getCreditCardTokenId()
    {
        return $this->creditCardTokenId;
    }
}

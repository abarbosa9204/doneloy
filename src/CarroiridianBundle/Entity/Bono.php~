<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Bono
 *
 * @ORM\Table(name="bono")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\BonoRepository")
 */
class Bono
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
     */
    private $de;

    /**
     * @var string
     *
     * @ORM\Column(name="para", type="string", length=255)
     */
    private $para;

    /**
     * Bono que se va a regalar
     *
     * @var Valorbono
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Valorbono")
     * @ORM\JoinColumn(name="valorbono_id", referencedColumnName="id")
     */
    protected $valorbono;

    /**
     * @var string
     *
     * @ORM\Column(name="mensaje", type="text", nullable=true)
     */
    private $mensaje;


    /**
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Compra", inversedBy="comprabonos")
     * @ORM\JoinColumn(name="compra_id", referencedColumnName="id")
     */
    protected $compra;

    /**
     * @var string
     *
     * @ORM\Column(name="codigo", type="string", length=255)
     */
    private $codigo;

    /**
     * @var integer
     *
     * @ORM\Column(name="reclama", type="integer")
     */
    private $reclama = 0;

    public function __toString()
    {
        return $this->getId().' ';
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
     * @return Bono
     */
    public function setDe($de)
    {
        $this->de = $de;

        return $this;
    }

    /**
     * Set reclama
     *
     * @param integer $reclama
     *
     * @return Bono
     */
    public function setReclama($reclama)
    {
        $this->reclama = $reclama;

        return $this;
    }

    /**
     * Get reclama
     *
     * @return int
     */
    public function getReclama()
    {
        return $this->reclama;
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
     * Get compra
     *
     * @return string
     */
    public function getCompra()
    {
        return $this->compra;
    }

    /**
     * Set compra
     *
     * @param \CarroiridianBundle\Entity\Compra $compra
     *
     * @return Bono
     */
    public function setCompra(\CarroiridianBundle\Entity\Compra $compra = null)
    {
        $this->compra = $compra;

        return $this;
    }

    /**
     * Get codigo
     *
     * @return string
     */
    public function getCodigo()
    {
        return $this->codigo;
    }

    /**
     * Set codigo
     *
     * @param string $codigo
     *
     * @return Bono
     */
    public function setCodigo($codigo)
    {
        $this->codigo = $codigo;

        return $this;
    }



    /**
     * Set para
     *
     * @param string $para
     *
     * @return Bono
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
     * @return Bono
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

    /**
     * Set valorbono
     *
     * @param \CarroiridianBundle\Entity\Valorbono $valorbono
     *
     * @return Bono
     */
    public function setValorbono(\CarroiridianBundle\Entity\Valorbono $valorbono = null)
    {
        $this->valorbono = $valorbono;

        return $this;
    }

    /**
     * Get valorbono
     *
     * @return \CarroiridianBundle\Entity\Valorbono
     */
    public function getValorbono()
    {
        return $this->valorbono;
    }
}

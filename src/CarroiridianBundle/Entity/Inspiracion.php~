<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\PropertyAccess\PropertyAccess;


/**
 * Inspiracion
 *
 * @ORM\Table(name="inspiracion")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\InspiracionRepository")
 */
class Inspiracion
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
     * TipoInspiracion de la inspiración
     *
     * @var TipoInspiracion
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\TipoInspiracion")
     * @ORM\JoinColumn(name="tipoinspiracion_id", referencedColumnName="id")
     */
    protected $tipoinspiracion;


    /**
     * @var string
     *
     * @ORM\Column(name="titulo_es", type="string", length=255)
     */
    private $tituloEs;

    /**
     * @var string
     *
     * @ORM\Column(name="titulo_en", type="string", length=255)
     */
    private $tituloEn;

    /**
     * @var string
     *
     * @ORM\Column(name="mensaje_es", type="text")
     */
    private $mensajeEs;

    /**
     * @var string
     *
     * @ORM\Column(name="mensaje_en", type="text")
     */
    private $mensajeEn;

    /**
     * @var int
     *
     * @ORM\Column(name="orden", type="integer")
     */
    private $orden = 1;

    /**
     * @var bool
     *
     * @ORM\Column(name="visible", type="boolean")
     */
    private $visible = true;


    public function gen($campo,$locale){
        $accessor = PropertyAccess::createPropertyAccessor();
        return $accessor->getValue($this,$campo.'_'.$locale);
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
     * Set tituloEs
     *
     * @param string $tituloEs
     *
     * @return Inspiracion
     */
    public function setTituloEs($tituloEs)
    {
        $this->tituloEs = $tituloEs;

        return $this;
    }

    /**
     * Get tituloEs
     *
     * @return string
     */
    public function getTituloEs()
    {
        return $this->tituloEs;
    }

    /**
     * Set tituloEn
     *
     * @param string $tituloEn
     *
     * @return Inspiracion
     */
    public function setTituloEn($tituloEn)
    {
        $this->tituloEn = $tituloEn;

        return $this;
    }

    /**
     * Get tituloEn
     *
     * @return string
     */
    public function getTituloEn()
    {
        return $this->tituloEn;
    }

    /**
     * Set mensajeEs
     *
     * @param string $mensajeEs
     *
     * @return Inspiracion
     */
    public function setMensajeEs($mensajeEs)
    {
        $this->mensajeEs = $mensajeEs;

        return $this;
    }

    /**
     * Get mensajeEs
     *
     * @return string
     */
    public function getMensajeEs()
    {
        return $this->mensajeEs;
    }

    /**
     * Set mensajeEn
     *
     * @param string $mensajeEn
     *
     * @return Inspiracion
     */
    public function setMensajeEn($mensajeEn)
    {
        $this->mensajeEn = $mensajeEn;

        return $this;
    }

    /**
     * Get mensajeEn
     *
     * @return string
     */
    public function getMensajeEn()
    {
        return $this->mensajeEn;
    }

    /**
     * Set orden
     *
     * @param integer $orden
     *
     * @return Inspiracion
     */
    public function setOrden($orden)
    {
        $this->orden = $orden;

        return $this;
    }

    /**
     * Get orden
     *
     * @return int
     */
    public function getOrden()
    {
        return $this->orden;
    }

    /**
     * Set visible
     *
     * @param boolean $visible
     *
     * @return Inspiracion
     */
    public function setVisible($visible)
    {
        $this->visible = $visible;

        return $this;
    }

    /**
     * Get visible
     *
     * @return bool
     */
    public function getVisible()
    {
        return $this->visible;
    }

    /**
     * Set tipoinspiracion
     *
     * @param \CarroiridianBundle\Entity\TipoInspiracion $tipoinspiracion
     *
     * @return Inspiracion
     */
    public function setTipoinspiracion(\CarroiridianBundle\Entity\TipoInspiracion $tipoinspiracion = null)
    {
        $this->tipoinspiracion = $tipoinspiracion;

        return $this;
    }

    /**
     * Get tipoinspiracion
     *
     * @return \CarroiridianBundle\Entity\TipoInspiracion
     */
    public function getTipoinspiracion()
    {
        return $this->tipoinspiracion;
    }
}

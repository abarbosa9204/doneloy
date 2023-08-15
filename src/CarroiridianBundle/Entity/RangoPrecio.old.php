<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\PropertyAccess\PropertyAccess;

/**
 * RangoPrecio
 *
 * @ORM\Table(name="rango_precio")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\RangoPrecioRepository")
 */
class RangoPrecio
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
     * @ORM\Column(name="texto_es", type="string", length=255)
     */
    private $textoEs;

    /**
     * @var string
     *
     * @ORM\Column(name="texto_en", type="string", length=255)
     */
    private $textoEn;

    /**
     * @var int
     *
     * @ORM\Column(name="minimo", type="integer")
     */
    private $minimo;

    /**
     * @var int
     *
     * @ORM\Column(name="maximo", type="integer")
     */
    private $maximo;


    public function gen($campo,$locale)
    {
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
     * Set textoEs
     *
     * @param string $textoEs
     *
     * @return RangoPrecio
     */
    public function setTextoEs($textoEs)
    {
        $this->textoEs = $textoEs;

        return $this;
    }

    /**
     * Get textoEs
     *
     * @return string
     */
    public function getTextoEs()
    {
        return $this->textoEs;
    }

    /**
     * Set textoEn
     *
     * @param string $textoEn
     *
     * @return RangoPrecio
     */
    public function setTextoEn($textoEn)
    {
        $this->textoEn = $textoEn;

        return $this;
    }

    /**
     * Get textoEn
     *
     * @return string
     */
    public function getTextoEn()
    {
        return $this->textoEn;
    }

    /**
     * Set minimo
     *
     * @param integer $minimo
     *
     * @return RangoPrecio
     */
    public function setMinimo($minimo)
    {
        $this->minimo = $minimo;

        return $this;
    }

    /**
     * Get minimo
     *
     * @return int
     */
    public function getMinimo()
    {
        return $this->minimo;
    }

    /**
     * Set maximo
     *
     * @param integer $maximo
     *
     * @return RangoPrecio
     */
    public function setMaximo($maximo)
    {
        $this->maximo = $maximo;

        return $this;
    }

    /**
     * Get maximo
     *
     * @return int
     */
    public function getMaximo()
    {
        return $this->maximo;
    }
}


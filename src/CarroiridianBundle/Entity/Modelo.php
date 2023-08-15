<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\PropertyAccess\PropertyAccess;

/**
 * Modelo
 *
 * @ORM\Table(name="modelo")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\ModeloRepository")
 * @Vich\Uploadable
 */
class Modelo
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
     * @var string
     *
     * @ORM\Column(name="altura", type="string", length=255)
     */
    private $altura;

    /**
     * @var string
     *
     * @ORM\Column(name="medidas_es", type="text", nullable=true)
     */
    private $medidasEs;

    /**
     * @var string
     *
     * @ORM\Column(name="medidas_en", type="text", nullable=true)
     */
    private $medidasEn;

    /**
     * @var string
     *
     * @ORM\Column(name="imagen", type="string", length=255)
     */
    private $imagen;

    /**
     * @Vich\UploadableField(mapping="productos", fileNameProperty="imagen")
     * @var File
     */
    private $imageFile;

    /**
     * @var string
     *
     * @ORM\Column(name="alt", type="string", length=255)
     */
    private $alt;


    public function __toString()
    {
        return $this->getNombre().' ';
    }

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
     * Set nombre
     *
     * @param string $nombre
     *
     * @return Modelo
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
     * Set altura
     *
     * @param string $altura
     *
     * @return Modelo
     */
    public function setAltura($altura)
    {
        $this->altura = $altura;

        return $this;
    }

    /**
     * Get altura
     *
     * @return string
     */
    public function getAltura()
    {
        return $this->altura;
    }

    /**
     * Set medidasEs
     *
     * @param string $medidasEs
     *
     * @return Modelo
     */
    public function setMedidasEs($medidasEs)
    {
        $this->medidasEs = $medidasEs;

        return $this;
    }

    /**
     * Get medidasEs
     *
     * @return string
     */
    public function getMedidasEs()
    {
        return $this->medidasEs;
    }

    /**
     * Set medidasEn
     *
     * @param string $medidasEn
     *
     * @return Modelo
     */
    public function setMedidasEn($medidasEn)
    {
        $this->medidasEn = $medidasEn;

        return $this;
    }

    /**
     * Get medidasEn
     *
     * @return string
     */
    public function getMedidasEn()
    {
        return $this->medidasEn;
    }

    /**
     * Set imagen
     *
     * @param string $imagen
     *
     * @return Modelo
     */
    public function setImagen($imagen)
    {
        $this->imagen = $imagen;

        return $this;
    }

    /**
     * Get imagen
     *
     * @return string
     */
    public function getImagen()
    {
        return $this->imagen;
    }

    /**
     * @param File $image
     */
    public function setImageFile(File $image = null)
    {
        $this->imageFile = $image;
    }

    /**
     * @return File
     */
    public function getImageFile()
    {
        return $this->imageFile;
    }

    /**
     * Set alt
     *
     * @param string $alt
     *
     * @return Modelo
     */
    public function setAlt($alt)
    {
        $this->alt = $alt;

        return $this;
    }

    /**
     * Get alt
     *
     * @return string
     */
    public function getAlt()
    {
        return $this->alt;
    }
}

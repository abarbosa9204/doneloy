<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\HttpFoundation\File\File;

/**
 * Categoria
 *
 * @ORM\Table(name="categoria")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\CategoriaRepository")
 * @Vich\Uploadable
 */
class Categoria
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
     * @ORM\Column(name="nombre_es", type="string", length=255)
     */
    private $nombreEs;

    /**
     * @var string
     *
     * @ORM\Column(name="nombre_en", type="string", length=255, nullable=true)
     */
    private $nombreEn;

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
     * @ORM\Column(name="imagenaux", type="string", length=255, nullable=true)
     */
    private $imagenaux;

    /**
     * @Vich\UploadableField(mapping="productos", fileNameProperty="imagenaux")
     * @var File
     */
    private $imageauxFile;

    /**
     * @var string
     *
     * @ORM\Column(name="imagenmovil", type="string", length=255, nullable=true)
     */
    private $imagenmovil;

    /**
     * @Vich\UploadableField(mapping="productos", fileNameProperty="imagenmovil")
     * @var File
     */
    private $imagemovilFile;

    /**
     * @var string
     *
     * @ORM\Column(name="imagentextoen", type="string", length=255, nullable=true)
     */
    private $imagentextoen;

    /**
     * @Vich\UploadableField(mapping="productos", fileNameProperty="imagentextoen")
     * @var File
     */
    private $imagetextoenFile;

    /**
     * @var string
     *
     * @ORM\Column(name="imagentextoes", type="string", length=255, nullable=true)
     */
    private $imagentextoes;

    /**
     * @Vich\UploadableField(mapping="productos", fileNameProperty="imagentextoes")
     * @var File
     */
    private $imagetextoesFile;

    /**
     * @var string
     *
     * @ORM\Column(name="descripcion_es", type="text", nullable=true)
     */
    private $descripcionEs;

    /**
     * @var string
     *
     * @ORM\Column(name="descripcion_en", type="text", nullable=true)
     */
    private $descripcionEn;

    /**
     * @var text
     *
     * @ORM\Column(name="resumen_es", type="text", length=1024, nullable=true)
     */
    private $resumenEs;

    /**
     * @var text
     *
     * @ORM\Column(name="resumen_en", type="text", length=1024, nullable=true)
     */
    private $resumenEn;


    /**
     * @var string
     *
     * @ORM\Column(name="alt", type="string", length=255)
     */
    private $alt;

    /**
     * @var integer
     *
     * @ORM\Column(name="orden", type="integer")
     */
    private $orden = 1;

    /**
     * @var boolean
     *
     * @ORM\Column(name="visible", type="boolean")
     */
    private $visible = true;

    /**
     * @var boolean
     *
     * @ORM\Column(name="principal", type="boolean")
     */
    private $principal = true;

    /**
     * @var boolean
     *
     * @ORM\Column(name="abasto", type="boolean")
     */
    private $abasto = false;

    /**
     * @var boolean
     *
     * @ORM\Column(name="pret", type="boolean")
     */
    private $pret = false;

    /**
     * @var boolean
     *
     * @ORM\Column(name="app", type="boolean")
     */
    private $app = false;

    public function gen($campo,$locale){
        $accessor = PropertyAccess::createPropertyAccessor();
        return $accessor->getValue($this,$campo.'_'.$locale);
    }

    public function __toString()
    {
        return $this->nombreEs;
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
     * Set nombreEs
     *
     * @param string $nombreEs
     *
     * @return Categoria
     */
    public function setNombreEs($nombreEs)
    {
        $this->nombreEs = $nombreEs;

        return $this;
    }

    /**
     * Get nombreEs
     *
     * @return string
     */
    public function getNombreEs()
    {
        return $this->nombreEs;
    }

    /**
     * Set nombreEn
     *
     * @param string $nombreEn
     *
     * @return Categoria
     */
    public function setNombreEn($nombreEn)
    {
        $this->nombreEn = $nombreEn;

        return $this;
    }

    /**
     * Get nombreEn
     *
     * @return string
     */
    public function getNombreEn()
    {
        return $this->nombreEn;
    }

    /**
     * Set orden
     *
     * @param integer $orden
     *
     * @return Categoria
     */
    public function setOrden($orden)
    {
        $this->orden = $orden;
    
        return $this;
    }

    /**
     * Get orden
     *
     * @return integer
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
     * @return Categoria
     */
    public function setVisible($visible)
    {
        $this->visible = $visible;
    
        return $this;
    }

    /**
     * Get visible
     *
     * @return boolean
     */
    public function getVisible()
    {
        return $this->visible;
    }

    /**
     * Set imagen
     *
     * @param string $imagen
     *
     * @return Categoria
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
     * Set imagenaux
     *
     * @param string $imagenaux
     *
     * @return Categoria
     */
    public function setImagenaux($imagenaux)
    {
        $this->imagenaux = $imagenaux;

        return $this;
    }

    /**
     * Get imagenaux
     *
     * @return string
     */
    public function getImagenaux()
    {
        return $this->imagenaux;
    }

    /**
     * Set imagentexto
     *
     * @param string $imagentextoen
     *
     * @return Categoria
     */
    public function setImagentextoen($imagentextoen)
    {
        $this->imagentextoen = $imagentextoen;

        return $this;
    }

    /**
     * Get imagentextoen
     *
     * @return string
     */
    public function getImagentextoen()
    {
        return $this->imagentextoen;
    }



    /**
     * @param File $imageaux
     */
    public function setImageauxFile(File $imageaux = null)
    {
        $this->imageauxFile = $imageaux;
    }

    /**
     * @return File
     */
    public function getImageauxFile()
    {
        return $this->imageauxFile;
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
     * @param File $image
     */
    public function setImagetextoenFile(File $image = null)
    {
        $this->imagetextoenFile = $image;
    }

    /**
     * @return File
     */
    public function getImagetextoenFile()
    {
        return $this->imagetextoenFile;
    }

    /**
     * @param File $image
     */
    public function setImagetextoesFile(File $image = null)
    {
        $this->imagetextoesFile = $image;
    }

    /**
     * @return File
     */
    public function getImagetextoesFile()
    {
        return $this->imagetextoesFile;
    }

    /**
     * Set alt
     *
     * @param string $alt
     *
     * @return Categoria
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

    /**
     * Set imagenmovil
     *
     * @param string $imagenmovil
     *
     * @return Categoria
     */
    public function setImagenmovil($imagenmovil)
    {
        $this->imagenmovil = $imagenmovil;

        return $this;
    }

    /**
     * Get imagenmovil
     *
     * @return string
     */
    public function getImagenmovil()
    {
        return $this->imagenmovil;
    }

    /**
     * @param File $image
     */
    public function setImagemovilFile(File $image = null)
    {
        $this->imagemovilFile = $image;
    }

    /**
     * @return File
     */
    public function getImagemovilFile()
    {
        return $this->imagemovilFile;
    }

    /**
     * Set imagentextoes
     *
     * @param string $imagentextoes
     *
     * @return Categoria
     */
    public function setImagentextoes($imagentextoes)
    {
        $this->imagentextoes = $imagentextoes;

        return $this;
    }

    /**
     * Get imagentextoes
     *
     * @return string
     */
    public function getImagentextoes()
    {
        return $this->imagentextoes;
    }

    /**
     * Set resumenEs
     *
     * @param string $resumenEs
     *
     * @return Categoria
     */
    public function setResumenEs($resumenEs)
    {
        $this->resumenEs = $resumenEs;

        return $this;
    }

    /**
     * Get resumenEs
     *
     * @return string
     */
    public function getResumenEs()
    {
        return $this->resumenEs;
    }

    /**
     * Set resumenEn
     *
     * @param string $resumenEn
     *
     * @return Categoria
     */
    public function setResumenEn($resumenEn)
    {
        $this->resumenEn = $resumenEn;

        return $this;
    }

    /**
     * Get resumenEn
     *
     * @return string
     */
    public function getResumenEn()
    {
        return $this->resumenEn;
    }

    /**
     * Set principal
     *
     * @param boolean $principal
     *
     * @return Categoria
     */
    public function setPrincipal($principal)
    {
        $this->principal = $principal;

        return $this;
    }

    /**
     * Get principal
     *
     * @return boolean
     */
    public function getPrincipal()
    {
        return $this->principal;
    }

    /**
     * Set abasto
     *
     * @param boolean $abasto
     *
     * @return Categoria
     */
    public function setAbasto($abasto)
    {
        $this->abasto = $abasto;

        return $this;
    }

    /**
     * Get abasto
     *
     * @return boolean
     */
    public function getAbasto()
    {
        return $this->abasto;
    }

    /**
     * Set pret
     *
     * @param boolean $pret
     *
     * @return Categoria
     */
    public function setPret($pret)
    {
        $this->pret = $pret;

        return $this;
    }

    /**
     * Get pret
     *
     * @return boolean
     */
    public function getPret()
    {
        return $this->pret;
    }

    /**
     * Set descripcionEs
     *
     * @param string $descripcionEs
     *
     * @return Categoria
     */
    public function setDescripcionEs($descripcionEs)
    {
        $this->descripcionEs = $descripcionEs;

        return $this;
    }

    /**
     * Get descripcionEs
     *
     * @return string
     */
    public function getDescripcionEs()
    {
        return $this->descripcionEs;
    }

    /**
     * Set descripcionEn
     *
     * @param string $descripcionEn
     *
     * @return Categoria
     */
    public function setDescripcionEn($descripcionEn)
    {
        $this->descripcionEn = $descripcionEn;

        return $this;
    }

    /**
     * Get descripcionEn
     *
     * @return string
     */
    public function getDescripcionEn()
    {
        return $this->descripcionEn;
    }

    /**
     * Set app
     *
     * @param boolean $app
     *
     * @return Categoria
     */
    public function setApp($app)
    {
        $this->app = $app;

        return $this;
    }

    /**
     * Get app
     *
     * @return boolean
     */
    public function getApp()
    {
        return $this->app;
    }
}

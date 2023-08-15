<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * Imagen
 *
 * @ORM\Table(name="imagengaleria")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ImagengaleriaRepository")
 * @Vich\Uploadable
 */
class Imagengaleria
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
     * @ORM\ManyToOne(targetEntity="Galeria")
     * @ORM\JoinColumn(name="galeria_id", referencedColumnName="id")
     */
    private $galeria;

    /**
     * @var string
     *
     * @ORM\Column(name="llave", type="string", length=255, nullable=true)
     */
    private $llave;

    /**
     * @var string
     *
     * @ORM\Column(name="link", type="string", length=255, nullable=true)
     */
    private $link;

    /**
     * @var string
     *
     * @ORM\Column(name="titulo_es", type="string", length=255, nullable=true)
     */
    private $tituloEs;

    /**
     * @var string
     *
     * @ORM\Column(name="titulo_en", type="string", length=255, nullable=true)
     */
    private $tituloEn;

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
     * @ORM\Column(name="image_es", type="string", length=255)
     */
    private $imageEs;

    /**
     * @Vich\UploadableField(mapping="imagesgal", fileNameProperty="imageEs" )
     * @var File
     */
    private $imageEsFile;

    /**
     * @var string
     *
     * @ORM\Column(name="image_en", type="string", length=255, nullable=true)
     */
    private $imageEn;

    /**
     * @Vich\UploadableField(mapping="imagesgal", fileNameProperty="imageEn")
     * @var File
     */
    private $imageEnFile;



    /**
     * @var string
     *
     * @ORM\Column(name="imagemovil_es", type="string", length=255, nullable=true)
     */
    private $imagemovilEs;

    /**
     * @Vich\UploadableField(mapping="imagesgal", fileNameProperty="imagemovilEs" )
     * @var File
     */
    private $imagemovilEsFile;

    /**
     * @var string
     *
     * @ORM\Column(name="imagemovil_en", type="string", length=255, nullable=true)
     */
    private $imagemovilEn;

    /**
     * @Vich\UploadableField(mapping="imagesgal", fileNameProperty="imagemovilEn")
     * @var File
     */
    private $imagemovilEnFile;


    /**
     * @var string
     *
     * @ORM\Column(name="documento_es", type="string", length=255, nullable=true)
     */
    private $documentoEs;

    /**
     * @Vich\UploadableField(mapping="carta", fileNameProperty="documentoEs" )
     * @var File
     */
    private $documentoEsFile;

    /**
     * @var string
     *
     * @ORM\Column(name="documento_en", type="string", length=255, nullable=true)
     */
    private $documentoEn;

    /**
     * @Vich\UploadableField(mapping="carta", fileNameProperty="documentoEn")
     * @var File
     */
    private $documentoEnFile;

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


    public function __toString()
    {
        return $this->image.' ';
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
     * Set imageEsFile
     *
     * @param string $imageEsFile
     *
     * @return Imagengaleria
     */
    public function setImageEsFile(File $imageEs = null)
    {
        $this->imageEsFile = $imageEs;

        // VERY IMPORTANT:
        // It is required that at least one field changes if you are using Doctrine,
        // otherwise the event listeners won't be called and the file is lost
        if ($imageEs) {
            // if 'updatedAt' is not defined in your entity, use another property
            //$this->updatedAt = new \DateTime('now');
        }
    }

    /**
     * Get imageEsFile
     *
     * @return string
     */
    public function getImageEsFile()
    {
        return $this->imageEsFile;
    }

    /**
     * Set imageEnFile
     *
     * @param string $imageEnFile
     *
     * @return Imagengaleria
     */
    public function setImageEnFile(File $imageEn = null)
    {
        $this->imageEnFile = $imageEn;

        // VERY IMPORTANT:
        // It is required that at least one field changes if you are using Doctrine,
        // otherwise the event listeners won't be called and the file is lost
        if ($imageEn) {
            // if 'updatedAt' is not defined in your entity, use another property
            //$this->updatedAt = new \DateTime('now');
        }
    }

    public function getImageEnFile()
    {
        return $this->imageEnFile;
    }

    public function setImagemovilEsFile(File $imageEs = null)
    {
        $this->imagemovilEsFile = $imageEs;
    }

    public function getImagemovilEsFile()
    {
        return $this->imagemovilEsFile;
    }

    public function setImagemovilEnFile(File $imageEs = null)
    {
        $this->imagemovilEnFile = $imageEs;
    }

    public function getImagemovilEnFile()
    {
        return $this->imagemovilEnFile;
    }

    /**
     * Set alt
     *
     * @param string $alt
     *
     * @return Imagen
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
     * Set imageEs
     *
     * @param string $imageEs
     *
     * @return Imagengaleria
     */
    public function setImageEs($imageEs)
    {
        $this->imageEs = $imageEs;

        return $this;
    }

    /**
     * Get imageEs
     *
     * @return string
     */
    public function getImageEs()
    {
        return $this->imageEs;
    }

    /**
     * Set imageEn
     *
     * @param string $imageEn
     *
     * @return Imagengaleria
     */
    public function setImageEn($imageEn)
    {
        $this->imageEn = $imageEn;

        return $this;
    }

    /**
     * Get imageEn
     *
     * @return string
     */
    public function getImageEn()
    {
        return $this->imageEn;
    }

    /**
     * Set orden
     *
     * @param integer $orden
     *
     * @return Imagengaleria
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
     * @return Imagengaleria
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
     * Set galeria
     *
     * @param \AppBundle\Entity\Galeria $galeria
     *
     * @return Imagengaleria
     */
    public function setGaleria(\AppBundle\Entity\Galeria $galeria = null)
    {
        $this->galeria = $galeria;

        return $this;
    }

    /**
     * Get galeria
     *
     * @return \AppBundle\Entity\Galeria
     */
    public function getGaleria()
    {
        return $this->galeria;
    }

    /**
     * Set llave
     *
     * @param string $llave
     *
     * @return Imagengaleria
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

    /**
     * Set link
     *
     * @param string $link
     *
     * @return Imagengaleria
     */
    public function setLink($link)
    {
        $this->link = $link;

        return $this;
    }

    /**
     * Get link
     *
     * @return string
     */
    public function getLink()
    {
        return $this->link;
    }

    public function needsPath(){
        if(strpos($this->link,'http') !== 0 || strpos($this->link,'#') !== 0)
            return 0;
        return 1;
    }

    /**
     * Set documentoEs
     *
     * @param string $documentoEs
     *
     * @return Imagengaleria
     */
    public function setDocumentoEs($documentoEs)
    {
        $this->documentoEs = $documentoEs;

        return $this;
    }

    /**
     * Get documentoEs
     *
     * @return string
     */
    public function getDocumentoEs()
    {
        return $this->documentoEs;
    }

    /**
     * Set documentoEn
     *
     * @param string $documentoEn
     *
     * @return Imagengaleria
     */
    public function setDocumentoEn($documentoEn)
    {
        $this->documentoEn = $documentoEn;

        return $this;
    }

    /**
     * Get documentoEn
     *
     * @return string
     */
    public function getDocumentoEn()
    {
        return $this->documentoEn;
    }

    public function setDocumentoEsFile(File $documentoEs = null)
    {
        $this->documentoEsFile = $documentoEs;
    }

    public function setDocumentoEnFile(File $documentoEn = null)
    {
        $this->documentoEnFile = $documentoEn;
    }

    public function getDocumentoEsFile()
    {
        return $this->documentoEsFile;
    }

    public function getDocumentoEnFile()
    {
        return $this->documentoEnFile;
    }

    /**
     * Set tituloEs
     *
     * @param string $tituloEs
     *
     * @return Imagengaleria
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
     * @return Imagengaleria
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
     * Set resumenEs
     *
     * @param string $resumenEs
     *
     * @return Imagengaleria
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
     * @return Imagengaleria
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
     * Set imagemovilEs
     *
     * @param string $imagemovilEs
     *
     * @return Imagengaleria
     */
    public function setImagemovilEs($imagemovilEs)
    {
        $this->imagemovilEs = $imagemovilEs;

        return $this;
    }

    /**
     * Get imagemovilEs
     *
     * @return string
     */
    public function getImagemovilEs()
    {
        return $this->imagemovilEs;
    }

    /**
     * Set imagemovilEn
     *
     * @param string $imagemovilEn
     *
     * @return Imagengaleria
     */
    public function setImagemovilEn($imagemovilEn)
    {
        $this->imagemovilEn = $imagemovilEn;

        return $this;
    }

    /**
     * Get imagemovilEn
     *
     * @return string
     */
    public function getImagemovilEn()
    {
        return $this->imagemovilEn;
    }
}

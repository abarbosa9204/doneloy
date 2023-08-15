<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * Mailing
 *
 * @ORM\Table(name="mailing")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\MailingRepository")
 * @Vich\Uploadable
 */
class Mailing
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
     * @ORM\Column(name="llave", type="string", length=255, unique=true)
     */
    private $llave;

    /**
     * @ORM\ManyToOne(targetEntity="Texto")
     * @ORM\JoinColumn(name="texto_id", referencedColumnName="id")
     */
    private $asunto;

    /**
     * @var string
     *
     * @ORM\Column(name="mensaje_es", type="text", nullable=true)
     */
    private $mensajeEs;

    /**
     * @var string
     *
     * @ORM\Column(name="mensaje_en", type="text", nullable=true)
     */
    private $mensajeEn;

    /**
     * @var string
     *
     * @ORM\Column(name="imagenhead", type="string", length=255)
     */
    private $imagenhead;

    /**
     * @Vich\UploadableField(mapping="mailings", fileNameProperty="imagenhead")
     * @var File
     */
    private $imagenheadFile;

    /**
     * @var string
     *
     * @ORM\Column(name="imagenstore", type="string", length=255)
     */
    private $imagenstore;

    /**
     * @Vich\UploadableField(mapping="mailings", fileNameProperty="imagenstore")
     * @var File
     */
    private $imagenstoreFile;

    /**
     * @var string
     *
     * @ORM\Column(name="imagenpinterest", type="string", length=255)
     */
    private $imagenpinterest;

    /**
     * @Vich\UploadableField(mapping="mailings", fileNameProperty="imagenpinterest")
     * @var File
     */
    private $imagenpinterestFile;

    /**
     * @var string
     *
     * @ORM\Column(name="imageninsta", type="string", length=255)
     */
    private $imageninsta;

    /**
     * @Vich\UploadableField(mapping="mailings", fileNameProperty="imageninsta")
     * @var File
     */
    private $imageninstaFile;

    /**
     * @var string
     *
     * @ORM\Column(name="imagenface", type="string", length=255)
     */
    private $imagenface;

    /**
     * @Vich\UploadableField(mapping="mailings", fileNameProperty="imagenface")
     * @var File
     */
    private $imagenfaceFile;

    /**
     * @var string
     *
     * @ORM\Column(name="alt", type="string", length=255)
     */
    private $alt;


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
     * Set llave
     *
     * @param string $llave
     *
     * @return Mailing
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
     * Set asunto
     *
     * @param \AppBundle\Entity\Texto $asunto
     *
     * @return Mailing
     */
    public function setAsunto(\AppBundle\Entity\Texto $asunto = null)
    {
        $this->asunto = $asunto;

        return $this;
    }

    /**
     * Get asunto
     *
     * @return \AppBundle\Entity\Texto
     */
    public function getAsunto()
    {
        return $this->asunto;
    }

    /**
     * Set mensajeEs
     *
     * @param string $mensajeEs
     *
     * @return Mailing
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
     * @return Mailing
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
     * @param File $image
     */
    public function setImagenheadFile(File $image = null)
    {
        $this->imagenheadFile = $image;
    }

    /**
     * @return File
     */
    public function getImagenheadFile()
    {
        return $this->imagenheadFile;
    }

    /**
     * @param File $image
     */
    public function setImagenstoreFile(File $image = null)
    {
        $this->imagenstoreFile = $image;
    }

    /**
     * @return File
     */
    public function getImagenstoreFile()
    {
        return $this->imagenstoreFile;
    }

    /**
     * @param File $image
     */
    public function setImagenpinterestFile(File $image = null)
    {
        $this->imagenpinterestFile = $image;
    }

    /**
     * @return File
     */
    public function getImagenpinterestFile()
    {
        return $this->imagenpinterestFile;
    }

    /**
     * @param File $image
     */
    public function setImageninstaFile(File $image = null)
    {
        $this->imageninstaFile = $image;
    }

    /**
     * @return File
     */
    public function getImageninstaFile()
    {
        return $this->imageninstaFile;
    }

    /**
     * @param File $image
     */
    public function setImagenfaceFile(File $image = null)
    {
        $this->imagenfaceFile = $image;
    }

    /**
     * @return File
     */
    public function getImagenfaceFile()
    {
        return $this->imagenfaceFile;
    }


    /**
     * Set imagenhead
     *
     * @param string $imagenhead
     *
     * @return Mailing
     */
    public function setImagenhead($imagenhead)
    {
        $this->imagenhead = $imagenhead;

        return $this;
    }

    /**
     * Get imagenhead
     *
     * @return string
     */
    public function getImagenhead()
    {
        return $this->imagenhead;
    }

    /**
     * Set imagenstore
     *
     * @param string $imagenstore
     *
     * @return Mailing
     */
    public function setImagenstore($imagenstore)
    {
        $this->imagenstore = $imagenstore;

        return $this;
    }

    /**
     * Get imagenstore
     *
     * @return string
     */
    public function getImagenstore()
    {
        return $this->imagenstore;
    }

    /**
     * Set imagenpinterest
     *
     * @param string $imagenpinterest
     *
     * @return Mailing
     */
    public function setImagenpinterest($imagenpinterest)
    {
        $this->imagenpinterest = $imagenpinterest;

        return $this;
    }

    /**
     * Get imagenpinterest
     *
     * @return string
     */
    public function getImagenpinterest()
    {
        return $this->imagenpinterest;
    }

    /**
     * Set imageninsta
     *
     * @param string $imageninsta
     *
     * @return Mailing
     */
    public function setImageninsta($imageninsta)
    {
        $this->imageninsta = $imageninsta;

        return $this;
    }

    /**
     * Get imageninsta
     *
     * @return string
     */
    public function getImageninsta()
    {
        return $this->imageninsta;
    }

    /**
     * Set imagenface
     *
     * @param string $imagenface
     *
     * @return Mailing
     */
    public function setImagenface($imagenface)
    {
        $this->imagenface = $imagenface;

        return $this;
    }

    /**
     * Get imagenface
     *
     * @return string
     */
    public function getImagenface()
    {
        return $this->imagenface;
    }

    /**
     * Set alt
     *
     * @param string $alt
     *
     * @return Mailing
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

<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\HttpFoundation\File\File;

/**
 * Seo
 *
 * @ORM\Table(name="seo")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\SeoRepository")
 * @Vich\Uploadable
 */
class Seo
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
     * @ORM\Column(name="url", type="string", length=255, unique=true)
     */
    private $url;

    /**
     * @var string
     *
     * @ORM\Column(name="titulo_es", type="string", length=60)
     */
    private $tituloEs;

    /**
     * @var string
     *
     * @ORM\Column(name="titulo_en", type="string", length=60, nullable=true)
     */
    private $tituloEn;

    /**
     * @var string
     *
     * @ORM\Column(name="descripcion_es", type="text", length=160)
     */
    private $descripcionEs;

    /**
     * @var string
     *
     * @ORM\Column(name="descripcion_en", type="text", length=160, nullable=true)
     */
    private $descripcionEn;

    /**
     * @var string
     *
     * @ORM\Column(name="imagen", type="string", length=255)
     */
    private $imagen;

    /**
     * @Vich\UploadableField(mapping="images", fileNameProperty="imagen")
     * @var File
     */
    private $imageFile;

    /**
     * @ORM\Column(type="datetime")
     * @var \DateTime
     */
    private $updatedAt;


    public function __construct()
    {
        $this->updatedAt = new \DateTime();
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
     * Set url
     *
     * @param string $url
     *
     * @return Seo
     */
    public function setUrl($url)
    {
        $this->url = $url;

        return $this;
    }

    /**
     * Get url
     *
     * @return string
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * Set tituloEs
     *
     * @param string $tituloEs
     *
     * @return Seo
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
     * @return Seo
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
     * Set descripcionEs
     *
     * @param string $descripcionEs
     *
     * @return Seo
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
     * @return Seo
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
     * @param File $image
     */
    public function setImageFile(File $image = null)
    {
        $this->imageFile = $image;
        if ($image) {
            $this->updatedAt = new \DateTime('now');
        }
    }

    /**
     * @return File
     */
    public function getImageFile()
    {
        return $this->imageFile;
    }

    /**
     * Set updatedAt.
     *
     * @param \DateTime $updatedAt
     *
     * @return Seo
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Get updatedAt.
     *
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }
}

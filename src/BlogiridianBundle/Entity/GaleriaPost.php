<?php

namespace BlogiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * GaleriaPost
 *
 * @ORM\Table(name="galeria_post")
 * @ORM\Entity(repositoryClass="BlogiridianBundle\Repository\GaleriaPostRepository")
 * @Vich\Uploadable
 */
class GaleriaPost
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
     * @ORM\ManyToOne(targetEntity="BlogiridianBundle\Entity\Post")
     * @ORM\JoinColumn(name="post_id", referencedColumnName="id")
     */
    private $post;

    /**
     * @var string
     *
     * @ORM\Column(name="imagen", type="string", length=255)
     */
    private $imagen;

    /**
     * @Vich\UploadableField(mapping="blogs", fileNameProperty="imagen")
     * @var File
     */
    private $imageFile;

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
        return $this->post.' - '.$this->id;
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
     * Set imagen
     *
     * @param string $imagen
     *
     * @return GaleriaPost
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
     * Set orden
     *
     * @param integer $orden
     *
     * @return GaleriaPost
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
     * @return GaleriaPost
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
     * Set post
     *
     * @param \BlogiridianBundle\Entity\Post $post
     *
     * @return GaleriaPost
     */
    public function setPost(\BlogiridianBundle\Entity\Post $post = null)
    {
        $this->post = $post;

        return $this;
    }

    /**
     * Get post
     *
     * @return \BlogiridianBundle\Entity\Post
     */
    public function getPost()
    {
        return $this->post;
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
     * @return GaleriaPost
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

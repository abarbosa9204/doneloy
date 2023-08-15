<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * Florero
 *
 * @ORM\Table(name="florero")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\FloreroRepository")
 * @Vich\Uploadable
 */
class Florero
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
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Tamano")
     * @ORM\JoinColumn(name="tamano", referencedColumnName="id")
     */
    private $tamano;

    /**
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Producto")
     * @ORM\JoinColumn(name="producto", referencedColumnName="id")
     */
    private $producto;

    /**
     * @var string
     *
     * @ORM\Column(name="nombre_es", type="string", length=255)
     */
    private $nombreEs;

    /**
     * @var string
     *
     * @ORM\Column(name="nombre_en", type="string", length=255)
     */
    private $nombreEn;

    /**
     * @var string
     *
     * @ORM\Column(name="imagen", type="string", length=255, nullable=true)
     */
    private $imagen;

    /**
     * @Vich\UploadableField(mapping="productos", fileNameProperty="imagen")
     * @var File
     */
    private $imageFile;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="update_at", type="datetime", nullable=true)
     */
    private $updateAt;


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
     * Set nombreEs
     *
     * @param string $nombreEs
     *
     * @return Florero
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
     * @return Florero
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
     * Set imagen
     *
     * @param string $imagen
     *
     * @return Florero
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
            // if 'updatedAt' is not defined in your entity, use another property
            $this->updateAt = new \DateTime('now');
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
     * Set tamano
     *
     * @param \CarroiridianBundle\Entity\Tamano $tamano
     *
     * @return Florero
     */
    public function setTamano(\CarroiridianBundle\Entity\Tamano $tamano = null)
    {
        $this->tamano = $tamano;
    
        return $this;
    }

    /**
     * Get tamano
     *
     * @return \CarroiridianBundle\Entity\Tamano
     */
    public function getTamano()
    {
        return $this->tamano;
    }

    /**
     * Set producto
     *
     * @param \CarroiridianBundle\Entity\Producto $producto
     *
     * @return Florero
     */
    public function setProducto(\CarroiridianBundle\Entity\Producto $producto = null)
    {
        $this->producto = $producto;
    
        return $this;
    }

    /**
     * Get producto
     *
     * @return \CarroiridianBundle\Entity\Producto
     */
    public function getProducto()
    {
        return $this->producto;
    }

    /**
     * Set update
     * 
     * @param \DateTime $updateAt
     * @return Florero
     */
    public function setUpdateAt($updateAt)
    {
        $this->updateAt = $updateAt;
    }

    /**
     * Get update
     * 
     * @return \DateTime
     */
    public function getUpdateAt()
    {
        return $this->updateAt;
    }
}


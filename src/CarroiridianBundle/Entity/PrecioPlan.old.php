<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * PrecioPlan
 *
 * @ORM\Table(name="precio_plan")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\PrecioPlanRepository")
 * @Vich\Uploadable
 */
class PrecioPlan
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
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Producto")
     * @ORM\JoinColumn(name="plan_id", referencedColumnName="id")
     */
    private $plan;

    /**
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Tamano")
     * @ORM\JoinColumn(name="tamano_id", referencedColumnName="id")
     */
    private $tamano;

    /**
     * @var float
     *
     * @ORM\Column(name="precio_1", type="float", nullable=true)
     */
    private $precio1;

    /**
     * @var float
     *
     * @ORM\Column(name="precio_2", type="float", nullable=true)
     */
    private $precio2;

    /**
     * @var float
     *
     * @ORM\Column(name="precio_3", type="float", nullable=true)
     */
    private $precio3;

    /**
     * @var float
     *
     * @ORM\Column(name="precio_4", type="float", nullable=true)
     */
    private $precio4;

    /**
     * @var int
     *
     * @ORM\Column(name="entregas_descuento1", type="integer")
     */
    private $entregasDescuento1;

    /**
     * @var int
     *
     * @ORM\Column(name="descuento1", type="integer")
     */
    private $descuento1;

    /**
     * @var int
     *
     * @ORM\Column(name="entregas_descuento2", type="integer")
     */
    private $entregasDescuento2;

    /**
     * @var int
     *
     * @ORM\Column(name="descuento2", type="integer")
     */
    private $descuento2;

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
     * Set precio1
     *
     * @param float $precio1
     *
     * @return PrecioPlan
     */
    public function setPrecio1($precio1)
    {
        $this->precio1 = $precio1;

        return $this;
    }

    /**
     * Get precio1
     *
     * @return float
     */
    public function getPrecio1()
    {
        return $this->precio1;
    }

    /**
     * Set precio2
     *
     * @param float $precio2
     *
     * @return PrecioPlan
     */
    public function setPrecio2($precio2)
    {
        $this->precio2 = $precio2;

        return $this;
    }

    /**
     * Get precio2
     *
     * @return float
     */
    public function getPrecio2()
    {
        return $this->precio2;
    }

    /**
     * Set precio3
     *
     * @param float $precio3
     *
     * @return PrecioPlan
     */
    public function setPrecio3($precio3)
    {
        $this->precio3 = $precio3;

        return $this;
    }

    /**
     * Get precio3
     *
     * @return float
     */
    public function getPrecio3()
    {
        return $this->precio3;
    }

    /**
     * Set precio4
     *
     * @param float $precio4
     *
     * @return PrecioPlan
     */
    public function setPrecio4($precio4)
    {
        $this->precio4 = $precio4;

        return $this;
    }

    /**
     * Get precio4
     *
     * @return float
     */
    public function getPrecio4()
    {
        return $this->precio4;
    }

    /**
     * Set plan
     *
     * @param \CarroiridianBundle\Entity\Producto $plan
     *
     * @return ConfiguracionPlan
     */
    public function setPlan(\CarroiridianBundle\Entity\Producto $plan = null)
    {
        $this->plan = $plan;
    
        return $this;
    }

    /**
     * Get plan
     *
     * @return \CarroiridianBundle\Entity\Producto
     */
    public function getPlan()
    {
        return $this->plan;
    }

    /**
     * Set tamano
     *
     * @param \CarroiridianBundle\Entity\Tamano $tamano
     *
     * @return ConfiguracionPlan
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
     * Set imagen
     *
     * @param string $imagen
     *
     * @return Tamano
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
     * Set EntregasDescuento1
     *
     * @param int $entregasDescuento1
     *
     * @return PrecioPlan
     */
    public function setEntregasDescuento1($entregasDescuento1)
    {
        $this->entregasDescuento1 = $entregasDescuento1;

        return $this;
    }

    /**
     * Get EntregasDescuento1
     *
     * @return int
     */
    public function getEntregasDescuento1()
    {
        return $this->entregasDescuento1;
    }
    
    /**
     * Set Descuento1
     *
     * @param int $Descuento1
     *
     * @return PrecioPlan
     */
    public function setDescuento1($Descuento1)
    {
        $this->descuento1 = $Descuento1;

        return $this;
    }

    /**
     * Get Descuento1
     *
     * @return int
     */
    public function getDescuento1()
    {
        return $this->descuento1;
    }
    
    /**
     * Set EntregasDescuento2
     *
     * @param int $entregasDescuento2
     *
     * @return PrecioPlan
     */
    public function setEntregasDescuento2($entregasDescuento2)
    {
        $this->entregasDescuento2 = $entregasDescuento2;

        return $this;
    }

    /**
     * Get EntregasDescuento2
     *
     * @return int
     */
    public function getEntregasDescuento2()
    {
        return $this->entregasDescuento2;
    }
    
    /**
     * Set Descuento2
     *
     * @param int $Descuento2
     *
     * @return PrecioPlan
     */
    public function setDescuento2($Descuento2)
    {
        $this->descuento2 = $Descuento2;

        return $this;
    }

    /**
     * Get Descuento2
     *
     * @return int
     */
    public function getDescuento2()
    {
        return $this->descuento2;
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
     * Set update
     * 
     * @param \DateTime $updateAt
     * @return PrecioPlan
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


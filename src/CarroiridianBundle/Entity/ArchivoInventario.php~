<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * ArchivoInventario
 *
 * @ORM\Table(name="archivo_inventario")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\ArchivoInventarioRepository")
 * @Vich\Uploadable
 */
class ArchivoInventario
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
     * @ORM\Column(name="imagen", type="string", length=255)
     */
    private $archivo;

    /**
     * @Vich\UploadableField(mapping="inventarios", fileNameProperty="archivo")
     * @var File
     */
    private $archivoFile;



    /**
     * @param File $image
     */
    public function setArchivoFile(File $image = null)
    {
        $this->archivoFile = $image;

        if($image){
            //exit(dump($image));
        }
    }

    /**
     * @return File
     */
    public function getArchivoFile()
    {
        return $this->archivoFile;
    }


    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set archivo
     *
     * @param string $archivo
     *
     * @return RecaudoMasivo
     */
    public function setArchivo($archivo)
    {
        $this->archivo = $archivo;

        return $this;
    }

    /**
     * Get archivo
     *
     * @return string
     */
    public function getArchivo()
    {
        return $this->archivo;
    }
}

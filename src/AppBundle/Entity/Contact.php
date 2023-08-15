<?php
/**
 * Created by PhpStorm.
 * User: Iridian 4
 * Date: 19/07/2016
 * Time: 6:26 PM
 */

namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;

/**
 * Contact
 *
 * @ORM\Table(name="contact")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ContactRepository")
 */
class Contact
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
     * @ORM\Column(name="llave", type="string", length=255, unique=true)
     */
    private $llave;

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
     * Set mensajeEs
     *
     * @param string $mensajeEs
     *
     * @return Contact
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
     * @return Contact
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
     * Set llave
     *
     * @param string $llave
     *
     * @return Contact
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
     * Constructor
     */
    public function __construct()
    {
        $this->matters = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add matter
     *
     * @param \AppBundle\Entity\Matter $matter
     *
     * @return Contact
     */
    public function addMatter(\AppBundle\Entity\Matter $matter)
    {
        $this->matters[] = $matter;

        return $this;
    }

    /**
     * Remove matter
     *
     * @param \AppBundle\Entity\Matter $matter
     */
    public function removeMatter(\AppBundle\Entity\Matter $matter)
    {
        $this->matters->removeElement($matter);
    }

    /**
     * Get matters
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getMatters()
    {
        return $this->matters;
    }
}

<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Texto
 *
 * @ORM\Table(name="texto")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\TextoRepository")
 */
class Texto
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
     * @ORM\Column(name="llave", type="string", length=255)
     */
    private $llave;

    /**
     * @var string
     *
     * @ORM\Column(name="es", type="string", length=255)
     */
    private $es;

    /**
     * @var string
     *
     * @ORM\Column(name="en", type="string", length=255, nullable=true)
     */
    private $en;

    public function getLocalName($locale){
        switch ($locale){
            case "es":
                return $this->es;
                break;
            case "en":
                return $this->en;
                break;
        }
    }


    public function __toString()
    {
        // TODO: Implement __toString() method.
        return $this->llave.' ';
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
     * Set es
     *
     * @param string $es
     *
     * @return Texto
     */
    public function setEs($es)
    {
        $this->es = $es;

        return $this;
    }

    /**
     * Get es
     *
     * @return string
     */
    public function getEs()
    {
        return $this->es;
    }

    /**
     * Set en
     *
     * @param string $en
     *
     * @return Texto
     */
    public function setEn($en)
    {
        $this->en = $en;

        return $this;
    }

    /**
     * Get en
     *
     * @return string
     */
    public function getEn()
    {
        return $this->en;
    }

    /**
     * Set llave
     *
     * @param string $llave
     *
     * @return Texto
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
}

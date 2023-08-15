<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * TextoBig
 *
 * @ORM\Table(name="texto_big")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\TextoBigRepository")
 */
class TextoBig
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
     * @ORM\Column(name="es", type="text")
     */
    private $es;

    /**
     * @var string
     *
     * @ORM\Column(name="en", type="text", nullable=true)
     */
    private $en;


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
     * @return TextoBig
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
     * Set es
     *
     * @param string $es
     *
     * @return TextoBig
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
     * @return TextoBig
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
}

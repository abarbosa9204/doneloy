<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * General
 *
 * @ORM\Table(name="general")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\GeneralRepository")
 */
class General
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
     * @ORM\Column(name="snippets", type="text", nullable=true)
     */
    private $snippets;

    /**
     * @ORM\ManyToOne(targetEntity="Imagen")
     * @ORM\JoinColumn(name="logo_id", referencedColumnName="id")
     */
    private $logo;


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
     * Set snippets
     *
     * @param string $snippets
     *
     * @return General
     */
    public function setSnippets($snippets)
    {
        $this->snippets = $snippets;

        return $this;
    }

    /**
     * Get snippets
     *
     * @return string
     */
    public function getSnippets()
    {
        return $this->snippets;
    }

    

    /**
     * Set logo
     *
     * @param \AppBundle\Entity\Imagen $logo
     *
     * @return General
     */
    public function setLogo(\AppBundle\Entity\Imagen $logo = null)
    {
        $this->logo = $logo;

        return $this;
    }

    /**
     * Get logo
     *
     * @return \AppBundle\Entity\Imagen
     */
    public function getLogo()
    {
        return $this->logo;
    }
}

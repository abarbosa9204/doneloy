<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Nohabil
 *
 * @ORM\Table(name="nohabil")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\NohabilRepository")
 */
class Nohabil
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
     * @var \DateTime
     *
     * @ORM\Column(name="dia", type="date")
     */
    private $dia;


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
     * Set dia
     *
     * @param \DateTime $dia
     *
     * @return Nohabil
     */
    public function setDia($dia)
    {
        $this->dia = $dia;

        return $this;
    }

    /**
     * Get dia
     *
     * @return \DateTime
     */
    public function getDia()
    {
        return $this->dia;
    }
}

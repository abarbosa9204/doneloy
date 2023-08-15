<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use PhpParser\Node\Scalar\String_;

/**
 * Valorbono
 *
 * @ORM\Table(name="valorbono")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\ValorbonoRepository")
 */
class Valorbono
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
     * @var int
     *
     * @ORM\Column(name="valor", type="integer")
     */
    private $valor;

    public function __toString() {
        return (string)$this->valor;
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
     * Set valor
     *
     * @param integer $valor
     *
     * @return Valorbono
     */
    public function setValor($valor)
    {
        $this->valor = $valor;

        return $this;
    }

    /**
     * Get valor
     *
     * @return int
     */
    public function getValor()
    {
        return $this->valor;
    }
}

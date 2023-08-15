<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Settings
 *
 * @ORM\Table(name="settings")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\SettingsRepository")
 */
class Settings
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
     * @ORM\Column(name="llave", type="string", length=255, unique=true)
     */
    private $llave;

    /**
     * @var string
     *
     * @ORM\Column(name="valor", type="string", length=255)
     */
    private $valor;


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
     * @return Settings
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
     * Set valor
     *
     * @param string $valor
     *
     * @return Settings
     */
    public function setValor($valor)
    {
        $this->valor = $valor;

        return $this;
    }

    /**
     * Get valor
     *
     * @return string
     */
    public function getValor()
    {
        return $this->valor;
    }
}

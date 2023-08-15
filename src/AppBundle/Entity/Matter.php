<?php
/**
 * Created by PhpStorm.
 * User: Iridian 4
 * Date: 26/07/2016
 * Time: 11:13 AM
 */

namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;

/**
 * Matter
 *
 * @ORM\Table(name="matter")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\MatterRepository")
 */
class Matter
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
     * @ORM\Column(name="nombre_es", type="text", nullable=true)
     */
    private $nombreEs;

    /**
     * @var string
     *
     * @ORM\Column(name="nombre_en", type="text", nullable=true)
     */
    private $nombreEn;

    /**
     * @var string
     *
     * @ORM\Column(name="destinatario", type="text", nullable=true)
     */
    private $destinatario;

    public function getLocalName($locale){
        switch ($locale){
            case "es":
                return $this->nombreEs;
                break;
            case "en":
                return $this->nombreEn;
                break;
        }
    }

    public function __toString()
    {
        return $this->nombreEs;
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
     * Set nombreEs
     *
     * @param string $nombreEs
     *
     * @return Matter
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
     * @return Matter
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
     * Set destinatario
     *
     * @param string $destinatario
     *
     * @return Matter
     */
    public function setDestinatario($destinatario)
    {
        $this->destinatario = $destinatario;

        return $this;
    }

    /**
     * Get destinatario
     *
     * @return string
     */
    public function getDestinatario()
    {
        return $this->destinatario;
    }
}

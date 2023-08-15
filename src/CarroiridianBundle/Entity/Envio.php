<?php

namespace CarroiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Envio
 *
 * @ORM\Table(name="envio")
 * @ORM\Entity(repositoryClass="CarroiridianBundle\Repository\EnvioRepository")
 */
class Envio
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
     * @ORM\Column(name="nombre", type="string", length=255)
     * @Assert\NotBlank(message = "El nombre no puede ser vacio")
     */
    private $nombre;

    /**
     * @var string
     *
     * @ORM\Column(name="apellidos", type="string", length=255)
     * @Assert\NotBlank(message = "El apellido no puede ser vacio")
     */
    private $apellidos;

    /**
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Ciudad")
     * @ORM\JoinColumn(name="ciudad_id", referencedColumnName="id")
     * @Assert\NotBlank(message = "El lugar de envio no puede ser vacio")
     */
    private $ciudad;

    /**
     * @var string
     *
     * @ORM\Column(name="direccion", type="string", length=255)
     * @Assert\NotBlank(message = "La dirección no puede ser vacia")
     */
    private $direccion;

    /**
     * @var string
     *
     * @ORM\Column(name="telefono", type="string", length=255)
     * @Assert\NotBlank(message = "El teléfono no puede ser vacio")
     * @Assert\Regex(
     *      pattern = "/^(?:\+?\(?(\d{1,3})\)?)?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)$/",
     *      message = "Tiene que ser un número de teléfono válido")
     */
    private $telefono;

    /**
     * @var string
     *
     * @ORM\Column(name="oficina", type="string", length=255)
     * @Assert\NotBlank(message = "Debes escoger si es oficina o no")
     */
    private $oficina;

    /**
     * @var string
     *
     * @ORM\Column(name="adicionales", type="text", nullable=true)
     */
    private $adicionales;


    /**
     * @var string
     *
     * @ORM\Column(name="fecha_de_envio", type="string", length=255)
     * @Assert\NotBlank(message = "La fecha de entrega no puede ser vacia")
     */
    private $fechaDeEnvio;



    public function __toString()
    {
        return $this->direccion.' ';
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
     * Set direccion
     *
     * @param string $direccion
     *
     * @return Envio
     */
    public function setDireccion($direccion)
    {
        $this->direccion = $direccion;
    
        return $this;
    }

    /**
     * Get direccion
     *
     * @return string
     */
    public function getDireccion()
    {
        return $this->direccion;
    }

    /**
     * Set ciudad
     *
     * @param \CarroiridianBundle\Entity\Ciudad $ciudad
     *
     * @return Envio
     */
    public function setCiudad(\CarroiridianBundle\Entity\Ciudad $ciudad = null)
    {
        $this->ciudad = $ciudad;
    
        return $this;
    }

    /**
     * Get ciudad
     *
     * @return \CarroiridianBundle\Entity\Ciudad
     */
    public function getCiudad()
    {
        return $this->ciudad;
    }


    /**
     * Set adicionales
     *
     * @param string $adicionales
     *
     * @return Envio
     */
    public function setAdicionales($adicionales)
    {
        $this->adicionales = $adicionales;
    
        return $this;
    }

    /**
     * Get adicionales
     *
     * @return string
     */
    public function getAdicionales()
    {
        return $this->adicionales;
    }

    /**
     * Set departamento
     *
     * @param \CarroiridianBundle\Entity\Departamento $departamento
     *
     * @return Envio
     */
    public function setDepartamento(\CarroiridianBundle\Entity\Departamento $departamento = null)
    {
        $this->departamento = $departamento;
    
        return $this;
    }

    /**
     * Get departamento
     *
     * @return \CarroiridianBundle\Entity\Departamento
     */
    public function getDepartamento()
    {
        return $this->departamento;
    }

    /**
     * Set nombre
     *
     * @param string $nombre
     *
     * @return Envio
     */
    public function setNombre($nombre)
    {
        $this->nombre = $nombre;

        return $this;
    }

    /**
     * Get nombre
     *
     * @return string
     */
    public function getNombre()
    {
        return $this->nombre;
    }

    /**
     * Set apellidos
     *
     * @param string $apellidos
     *
     * @return Envio
     */
    public function setApellidos($apellidos)
    {
        $this->apellidos = $apellidos;

        return $this;
    }

    /**
     * Get apellidos
     *
     * @return string
     */
    public function getApellidos()
    {
        return $this->apellidos;
    }

    /**
     * Set telefono
     *
     * @param string $telefono
     *
     * @return Envio
     */
    public function setTelefono($telefono)
    {
        $this->telefono = $telefono;

        return $this;
    }

    /**
     * Get telefono
     *
     * @return string
     */
    public function getTelefono()
    {
        return $this->telefono;
    }

    /**
     * Set oficina
     *
     * @param string $oficina
     *
     * @return Envio
     */
    public function setOficina($oficina)
    {
        $this->oficina = $oficina;

        return $this;
    }

    /**
     * Get oficina
     *
     * @return string
     */
    public function getOficina()
    {
        return $this->oficina;
    }

    /**
     * Set fechaDeEnvio
     *
     * @param \DateTime $fechaDeEnvio
     *
     * @return Envio
     */
    public function setFechaDeEnvio($fechaDeEnvio)
    {
        $this->fechaDeEnvio = $fechaDeEnvio;

        return $this;
    }

    /**
     * Get fechaDeEnvio
     *
     * @return \DateTime
     */
    public function getFechaDeEnvio()
    {
        return $this->fechaDeEnvio;
    }
}

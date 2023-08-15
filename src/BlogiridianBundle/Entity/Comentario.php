<?php

namespace BlogiridianBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Comentario
 *
 * @ORM\Table(name="comentario")
 * @ORM\Entity(repositoryClass="BlogiridianBundle\Repository\ComentarioRepository")
 */
class Comentario
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
     * @ORM\ManyToOne(targetEntity="BlogiridianBundle\Entity\Post")
     * @ORM\JoinColumn(name="post_id", referencedColumnName="id")
     */
    private $post;

    /**
     * @var string
     *
     * @ORM\Column(name="usuario", type="string", length=255)
     * @Assert\NotBlank(message = "El nombre no puede ser vacio")
     */
    private $usuario;

    /**
     * @var string
     *
     * @ORM\Column(name="mensaje", type="text")
     * @Assert\NotBlank(message = "El mensaje no puede ser vacio")
     */
    private $mensaje;

    /**
     * @var bool
     *
     * @ORM\Column(name="visible", type="boolean")
     */
    private $visible = true;


    /**
     * @var bool
     *
     * @ORM\Column(name="revisado", type="boolean")
     */
    private $revisado = true;

    /**
     * @var \DateTime
     */
    private $date;


    public function __construct()
    {
        $this->date = new \DateTime();
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
     * Set usuario
     *
     * @param string $usuario
     *
     * @return Comentario
     */
    public function setUsuario($usuario)
    {
        $this->usuario = $usuario;

        return $this;
    }

    /**
     * Get usuario
     *
     * @return string
     */
    public function getUsuario()
    {
        return $this->usuario;
    }

    /**
     * Set mensaje
     *
     * @param string $mensaje
     *
     * @return Comentario
     */
    public function setMensaje($mensaje)
    {
        $this->mensaje = $mensaje;

        return $this;
    }

    /**
     * Get mensaje
     *
     * @return string
     */
    public function getMensaje()
    {
        return $this->mensaje;
    }

    /**
     * Set visible
     *
     * @param boolean $visible
     *
     * @return Comentario
     */
    public function setVisible($visible)
    {
        $this->visible = $visible;

        return $this;
    }

    /**
     * Get visible
     *
     * @return bool
     */
    public function getVisible()
    {
        return $this->visible;
    }

    /**
     * Set revisado
     *
     * @param boolean $revisado
     *
     * @return Comentario
     */
    public function setRevisado($revisado)
    {
        $this->revisado = $revisado;

        return $this;
    }

    /**
     * Get revisado
     *
     * @return boolean
     */
    public function getRevisado()
    {
        return $this->revisado;
    }

    /**
     * Set post
     *
     * @param \BlogiridianBundle\Entity\Post $post
     *
     * @return Comentario
     */
    public function setPost(\BlogiridianBundle\Entity\Post $post = null)
    {
        $this->post = $post;

        return $this;
    }

    /**
     * Get post
     *
     * @return \BlogiridianBundle\Entity\Post
     */
    public function getPost()
    {
        return $this->post;
    }
}

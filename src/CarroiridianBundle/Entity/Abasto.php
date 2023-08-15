<?php
// src/Entity/Abasto.php
namespace CarroiridianBundle\Entity;

use Symfony\Component\Validator\Constraints as Assert;

class Abasto
{
    
    private $fechaDeEnvio;
    private $duration;
    private $delivery;
    
    public function setFechaDeEnvio($fechaDeEnvio)
    {
        $this->fechaDeEnvio = $fechaDeEnvio;

        return $this;
    }
    
    public function getFechaDeEnvio()
    {
        return $this->fechaDeEnvio;
    }

    public function setDuration($duration)
    {
        $this->duration = $duration;

        return $this;
    }

    public function getDuration()
    {
        return $this->duration;
    }

    public function setDelivery($delivery)
    {
        $this->delivery = $delivery;

        return $this;
    }

    public function getDelivery()
    {
        return $this->delivery;
    }
}
?>
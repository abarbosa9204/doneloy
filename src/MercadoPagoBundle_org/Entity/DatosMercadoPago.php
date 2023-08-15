<?php

namespace MercadoPagoBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * DatosMercadoPago
 *
 * @ORM\Table(name="datos_mercadopago")
 * @ORM\Entity(repositoryClass="MercadoPagoBundle\Repository\DatosMercadoPagoRepository")
 */
class DatosMercadoPago
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
     * @ORM\Column(name="client_id", type="string", length=255)
     */
    private $clientID;

    /**
     * @var string
     *
     * @ORM\Column(name="client_secret", type="string", length=255)
     */
    private $clientSecret;

    /**
     * @var bool
     *
     * @ORM\Column(name="sandbox", type="boolean")
     */
    private $sandbox;

    /**
     * @var string
     *
     * @ORM\Column(name="sponsor_id", type="string", length=255)
     */
    private $sponsorID;

    /**
     * @var string
     *
     * @ORM\Column(name="currency", type="string", length=255)
     */
    private $currency;


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
     * Set clientID
     *
     * @param string $clientID
     *
     * @return DatosMercadoPago
     */
    public function setClientID($clientID)
    {
        $this->clientID = $clientID;

        return $this;
    }

    /**
     * Get clientID
     *
     * @return string
     */
    public function getClientID()
    {
        return $this->clientID;
    }

    /**
     * Set clientSecret
     *
     * @param string $clientSecret
     *
     * @return DatosMercadoPago
     */
    public function setClientSecret($clientSecret)
    {
        $this->clientSecret = $clientSecret;

        return $this;
    }

    /**
     * Get clientSecret
     *
     * @return string
     */
    public function getClientSecret()
    {
        return $this->clientSecret;
    }

    /**
     * Set sandbox
     *
     * @param boolean $sandbox
     *
     * @return DatosMercadoPago
     */
    public function setSandbox($sandbox)
    {
        $this->sandbox = $sandbox;

        return $this;
    }

    /**
     * Get sandbox
     *
     * @return bool
     */
    public function getSandbox()
    {
        return $this->sandbox;
    }

    /**
     * Set sponsorID
     *
     * @param string $sponsorID
     *
     * @return DatosMercadoPago
     */
    public function setSponsorID($sponsorID)
    {
        $this->sponsorID = $sponsorID;

        return $this;
    }

    /**
     * Get sponsorID
     *
     * @return string
     */
    public function getSponsorID()
    {
        return $this->sponsorID;
    }

    /**
     * Set currency
     *
     * @param string $currency
     *
     * @return DatosMercadoPago
     */
    public function setCurrency($currency)
    {
        $this->currency = $currency;

        return $this;
    }

    /**
     * Get currency
     *
     * @return string
     */
    public function getCurrency()
    {
        return $this->currency;
    }
}


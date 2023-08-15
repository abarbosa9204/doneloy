<?php

namespace PagosPayuBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * DatosPayu
 *
 * @ORM\Table(name="datos_payu")
 * @ORM\Entity(repositoryClass="PagosPayuBundle\Repository\DatosPayuRepository")
 */
class DatosPayu
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
     * @ORM\Column(name="merchantId", type="string", length=255)
     */
    private $merchantId;

    /**
     * @var string
     *
     * @ORM\Column(name="accountId", type="string", length=255)
     */
    private $accountId;

    /**
     * @var string
     *
     * @ORM\Column(name="currency", type="string", length=255)
     */
    private $currency;

    /**
     * @var bool
     *
     * @ORM\Column(name="test", type="boolean")
     */
    private $test;

    /**
     * @var string
     *
     * @ORM\Column(name="url_pruebas", type="string", length=255)
     */
    private $urlPruebas;

    /**
     * @var string
     *
     * @ORM\Column(name="url_produccion", type="string", length=255)
     */
    private $urlProduccion;

    /**
     * @var string
     *
     * @ORM\Column(name="ApiKey", type="string", length=255)
     */
    private $apiKey;

    /**
     * @var string
     *
     * @ORM\Column(name="ApiLogin", type="string", length=255)
     */
    private $apiLogin;


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
     * Set merchantId
     *
     * @param string $merchantId
     *
     * @return DatosPayu
     */
    public function setMerchantId($merchantId)
    {
        $this->merchantId = $merchantId;
    
        return $this;
    }

    /**
     * Get merchantId
     *
     * @return string
     */
    public function getMerchantId()
    {
        return $this->merchantId;
    }

    /**
     * Set accountId
     *
     * @param string $accountId
     *
     * @return DatosPayu
     */
    public function setAccountId($accountId)
    {
        $this->accountId = $accountId;
    
        return $this;
    }

    /**
     * Get accountId
     *
     * @return string
     */
    public function getAccountId()
    {
        return $this->accountId;
    }

    /**
     * Set currency
     *
     * @param string $currency
     *
     * @return DatosPayu
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

    /**
     * Set test
     *
     * @param boolean $test
     *
     * @return DatosPayu
     */
    public function setTest($test)
    {
        $this->test = $test;
    
        return $this;
    }

    /**
     * Get test
     *
     * @return boolean
     */
    public function getTest()
    {
        return $this->test;
    }

    /**
     * Set urlPruebas
     *
     * @param string $urlPruebas
     *
     * @return DatosPayu
     */
    public function setUrlPruebas($urlPruebas)
    {
        $this->urlPruebas = $urlPruebas;
    
        return $this;
    }

    /**
     * Get urlPruebas
     *
     * @return string
     */
    public function getUrlPruebas()
    {
        return $this->urlPruebas;
    }

    /**
     * Set urlProduccion
     *
     * @param string $urlProduccion
     *
     * @return DatosPayu
     */
    public function setUrlProduccion($urlProduccion)
    {
        $this->urlProduccion = $urlProduccion;
    
        return $this;
    }

    /**
     * Get urlProduccion
     *
     * @return string
     */
    public function getUrlProduccion()
    {
        return $this->urlProduccion;
    }

    /**
     * Set apiKey
     *
     * @param string $apiKey
     *
     * @return DatosPayu
     */
    public function setApiKey($apiKey)
    {
        $this->apiKey = $apiKey;
    
        return $this;
    }

    /**
     * Get apiKey
     *
     * @return string
     */
    public function getApiKey()
    {
        return $this->apiKey;
    }

    /**
     * Set apiLogin
     *
     * @param string $apiLogin
     *
     * @return DatosPayu
     */
    public function setApiLogin($apiLogin)
    {
        $this->apiLogin = $apiLogin;
    
        return $this;
    }

    /**
     * Get apiLogin
     *
     * @return string
     */
    public function getApiLogin()
    {
        return $this->apiLogin;
    }
}

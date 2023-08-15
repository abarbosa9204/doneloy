<?php

namespace PagosPayuBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RepuestaPago
 *
 * @ORM\Table(name="repuesta_pago")
 * @ORM\Entity(repositoryClass="PagosPayuBundle\Repository\RepuestaPagoRepository")
 */
class RepuestaPago
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
     * @ORM\Column(name="referenceCode", type="string", length=255, nullable=true)
     */
    private $referenceCode;

    /**
     * @var string
     *
     * @ORM\Column(name="TX_VALUE", type="string", length=255, nullable=true)
     */
    private $tXVALUE;

    /**
     * @var string
     *
     * @ORM\Column(name="transactionState", type="string", length=255, nullable=true)
     */
    private $transactionState;

    /**
     * @var string
     *
     * @ORM\Column(name="signature", type="string", length=255, nullable=true)
     */
    private $signature;

    /**
     * @var string
     *
     * @ORM\Column(name="reference_pol", type="string", length=255, nullable=true)
     */
    private $referencePol;

    /**
     * @var string
     *
     * @ORM\Column(name="cus", type="string", length=255, nullable=true)
     */
    private $cus;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="string", length=255, nullable=true)
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(name="pseBank", type="string", length=255, nullable=true)
     */
    private $pseBank;

    /**
     * @var string
     *
     * @ORM\Column(name="lapPaymentMethod", type="string", length=255, nullable=true)
     */
    private $lapPaymentMethod;

    /**
     * @var string
     *
     * @ORM\Column(name="transactionId", type="string", length=255, nullable=true)
     */
    private $transactionId;

    /**
     * @var string
     *
     * @ORM\Column(name="processingDate", type="string", length=255, nullable=true)
     */
    private $processingDate;

    /**
     * @var string
     *
     * @ORM\Column(name="TX_ADMINISTRATIVE_FEE", type="string", length=255, nullable=true)
     */
    private $tXADMINISTRATIVEFEE;

    /**
     * @var string
     *
     * @ORM\Column(name="risk", type="string", length=255, nullable=true)
     */
    private $risk;

    /**
     * @var string
     *
     * @ORM\Column(name="tipo", type="string", length=255, nullable=true)
     */
    private $tipo;

    /**
     * @ORM\ManyToOne(targetEntity="CarroiridianBundle\Entity\Compra")
     * @ORM\JoinColumn(name="compra_id", referencedColumnName="id")
     */
    protected $compra;


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
     * Set referenceCode
     *
     * @param string $referenceCode
     *
     * @return RepuestaPago
     */
    public function setReferenceCode($referenceCode)
    {
        $this->referenceCode = $referenceCode;
    
        return $this;
    }

    /**
     * Get referenceCode
     *
     * @return string
     */
    public function getReferenceCode()
    {
        return $this->referenceCode;
    }

    /**
     * Set tXVALUE
     *
     * @param string $tXVALUE
     *
     * @return RepuestaPago
     */
    public function setTXVALUE($tXVALUE)
    {
        $this->tXVALUE = $tXVALUE;
    
        return $this;
    }

    /**
     * Get tXVALUE
     *
     * @return string
     */
    public function getTXVALUE()
    {
        return $this->tXVALUE;
    }

    /**
     * Set transactionState
     *
     * @param string $transactionState
     *
     * @return RepuestaPago
     */
    public function setTransactionState($transactionState)
    {
        $this->transactionState = $transactionState;
    
        return $this;
    }

    /**
     * Get transactionState
     *
     * @return string
     */
    public function getTransactionState()
    {
        return $this->transactionState;
    }

    /**
     * Set signature
     *
     * @param string $signature
     *
     * @return RepuestaPago
     */
    public function setSignature($signature)
    {
        $this->signature = $signature;
    
        return $this;
    }

    /**
     * Get signature
     *
     * @return string
     */
    public function getSignature()
    {
        return $this->signature;
    }

    /**
     * Set referencePol
     *
     * @param string $referencePol
     *
     * @return RepuestaPago
     */
    public function setReferencePol($referencePol)
    {
        $this->referencePol = $referencePol;
    
        return $this;
    }

    /**
     * Get referencePol
     *
     * @return string
     */
    public function getReferencePol()
    {
        return $this->referencePol;
    }

    /**
     * Set cus
     *
     * @param string $cus
     *
     * @return RepuestaPago
     */
    public function setCus($cus)
    {
        $this->cus = $cus;
    
        return $this;
    }

    /**
     * Get cus
     *
     * @return string
     */
    public function getCus()
    {
        return $this->cus;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return RepuestaPago
     */
    public function setDescription($description)
    {
        $this->description = $description;
    
        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set pseBank
     *
     * @param string $pseBank
     *
     * @return RepuestaPago
     */
    public function setPseBank($pseBank)
    {
        $this->pseBank = $pseBank;
    
        return $this;
    }

    /**
     * Get pseBank
     *
     * @return string
     */
    public function getPseBank()
    {
        return $this->pseBank;
    }

    /**
     * Set lapPaymentMethod
     *
     * @param string $lapPaymentMethod
     *
     * @return RepuestaPago
     */
    public function setLapPaymentMethod($lapPaymentMethod)
    {
        $this->lapPaymentMethod = $lapPaymentMethod;
    
        return $this;
    }

    /**
     * Get lapPaymentMethod
     *
     * @return string
     */
    public function getLapPaymentMethod()
    {
        return $this->lapPaymentMethod;
    }

    /**
     * Set transactionId
     *
     * @param string $transactionId
     *
     * @return RepuestaPago
     */
    public function setTransactionId($transactionId)
    {
        $this->transactionId = $transactionId;
    
        return $this;
    }

    /**
     * Get transactionId
     *
     * @return string
     */
    public function getTransactionId()
    {
        return $this->transactionId;
    }

    /**
     * Set processingDate
     *
     * @param string $processingDate
     *
     * @return RepuestaPago
     */
    public function setProcessingDate($processingDate)
    {
        $this->processingDate = $processingDate;
    
        return $this;
    }

    /**
     * Get processingDate
     *
     * @return string
     */
    public function getProcessingDate()
    {
        return $this->processingDate;
    }

    /**
     * Set tXADMINISTRATIVEFEE
     *
     * @param string $tXADMINISTRATIVEFEE
     *
     * @return RepuestaPago
     */
    public function setTXADMINISTRATIVEFEE($tXADMINISTRATIVEFEE)
    {
        $this->tXADMINISTRATIVEFEE = $tXADMINISTRATIVEFEE;
    
        return $this;
    }

    /**
     * Get tXADMINISTRATIVEFEE
     *
     * @return string
     */
    public function getTXADMINISTRATIVEFEE()
    {
        return $this->tXADMINISTRATIVEFEE;
    }

    /**
     * Set compra
     *
     * @param \CarroiridianBundle\Entity\Compra $compra
     *
     * @return RepuestaPago
     */
    public function setCompra(\CarroiridianBundle\Entity\Compra $compra = null)
    {
        $this->compra = $compra;
    
        return $this;
    }

    /**
     * Get compra
     *
     * @return \CarroiridianBundle\Entity\Compra
     */
    public function getCompra()
    {
        return $this->compra;
    }

    /**
     * Set risk
     *
     * @param string $risk
     *
     * @return RepuestaPago
     */
    public function setRisk($risk)
    {
        $this->risk = $risk;
    
        return $this;
    }

    /**
     * Get risk
     *
     * @return string
     */
    public function getRisk()
    {
        return $this->risk;
    }

    /**
     * Set tipo
     *
     * @param string $tipo
     *
     * @return RepuestaPago
     */
    public function setTipo($tipo)
    {
        $this->tipo = $tipo;
    
        return $this;
    }

    /**
     * Get tipo
     *
     * @return string
     */
    public function getTipo()
    {
        return $this->tipo;
    }
}

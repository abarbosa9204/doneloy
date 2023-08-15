<?php 
namespace CarroiridianBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;

class TelType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function getParent()
    {
        return TextType::class;
    }
    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
		// error_log(PHP_EOL.'tel',3,'log_jimmy.log');
        return 'tel';
    }
}
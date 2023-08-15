<?php

namespace UserIridianBundle\Form;


use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\BirthdayType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\IsTrue;

class RegistrationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('nombre', TextType::class, array('required' => true));
        $builder->add('apellidos', TextType::class, array('required' => true));
        $builder->add('telefono', TextType::class, array('required' => true));
        $builder->add('rangoedad',EntityType::class, array('required' => true, 'class' => 'AppBundle\Entity\RangoEdad','placeholder'=>'Rango de Edad (años)'));
        $builder->add('terms', CheckboxType::class, array(
        'mapped' => false,
        'constraints' => new IsTrue(),
        'invalid_message' => 'Debes aceptar los terminos y condiciones',
    ));
    }

    public function getParent()
    {
        return 'FOS\UserBundle\Form\Type\RegistrationFormType';

        // Or for Symfony < 2.8
        // return 'fos_user_registration';
    }

    public function getBlockPrefix()
    {
        return 'app_user_registration';
    }

    // For Symfony 2.x
    public function getNombre()
    {
        return $this->getBlockPrefix();
    }
}
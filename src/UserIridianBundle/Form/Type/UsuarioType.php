<?php
/**
 * Created by PhpStorm.
 * User: Iridian 4
 * Date: 26/07/2016
 * Time: 11:43 AM
 */

namespace UserIridianBundle\Form\Type;

use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Doctrine\ORM\EntityRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\BirthdayType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use AppBundle\Entity\User;
use Symfony\Component\Validator\Constraints\IsTrue;


class UsuarioType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('nombre',null,array(
                'label'=>'Nombres'
            ))
            ->add('apellidos',null,array(
                'label'=>'Apellidos'
            ))
            ->add('email',EmailType::class,array('label'=>'*E-mail'))
            ->add('telefono',null,array('label'=>'*Teléfono'))
            ->add('rangoedad',null,array('label'=>'*Rango de Edad'))
            ->add('terms', CheckboxType::class, array(
                'constraints' => new IsTrue(),
                'mapped' => false,
                'invalid_message' => 'Debes aceptar los terminos y condiciones',
                'label'=>'Acepto términos y condiciones de uso',
                'attr'=> array(
                    'class'=>'check'
                )
            ));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\User'
        ));
    }
}
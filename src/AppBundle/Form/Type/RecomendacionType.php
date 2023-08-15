<?php
/**
 * Created by PhpStorm.
 * User: Iridian 4
 * Date: 26/07/2016
 * Time: 11:43 AM
 */

namespace AppBundle\Form\Type;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
class RecomendacionType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('remitente', TextType::class,array('label'=>'Tu nombre'))
            ->add('remitenteCorreo', EmailType::class,array('label'=>'Tu email'))
            ->add('receptor', TextType::class,array('label'=>'Nombre de tu amigo'))
            ->add('receptorCorreo', EmailType::class,array('label'=>'Email de tu amigo'))
            ->add('mensaje');
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\Recomendacion',
            'locale' => 'en'
        ));
    }
}
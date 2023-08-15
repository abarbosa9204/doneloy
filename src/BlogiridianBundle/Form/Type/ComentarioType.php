<?php
/**
 * Created by PhpStorm.
 * User: Iridian 1
 * Date: 14/07/2016
 * Time: 4:57 PM
 */

namespace BlogiridianBundle\Form\Type;
use Doctrine\DBAL\Types\TextType;
use EWZ\Bundle\RecaptchaBundle\Form\Type\EWZRecaptchaType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use BlogiridianBundle\Entity\Comentario;
use EWZ\Bundle\RecaptchaBundle\Validator\Constraints\IsTrue as RecaptchaTrue;

class ComentarioType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('mensaje')
            ->add('usuario')
            ->add('recaptcha', EWZRecaptchaType::class, array(
                'attr'        => array(
                    'options' => array(
                        'theme' => 'light',
                        'type'  => 'image',
                        'size'  => 'normal'
                    )
                ),
                'mapped'      => false,
                'constraints' => array(
                    new RecaptchaTrue()
                )
            ))
            ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'BlogiridianBundle\Entity\Comentario',
        ));
    }
}
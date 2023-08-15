<?php
/**
 * Created by PhpStorm.
 * User: Iridian 1
 * Date: 9/06/2016
 * Time: 11:30 AM
 */

namespace CarroiridianBundle\Form\Type;

use Doctrine\DBAL\Types\TextType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use CarroiridianBundle\Entity\Envio;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Doctrine\ORM\EntityRepository;

class EnvioType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('nombre')
            ->add('apellidos')
            ->add('telefono')
            ->add('ciudad',EntityType::class,array(
                'class' => 'CarroiridianBundle\Entity\Ciudad',
                'query_builder' => function (EntityRepository $er) {
                    return $er->createQueryBuilder('c')
                        ->where('c.envio = 1')
                        ->orderBy('c.nombre', 'ASC');
                },
                'placeholder'=> 'Ciudad'
            ))
            ->add('direccion')
            ->add('adicionales')
            ->add('fechaDeEnvio')
            ->add('oficina', ChoiceType::class, array(
                'choices'  => array(
                    'Oficina' => null,
                    'Si' => 'Si',
                    'No' => 'No',
                )
            ));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'CarroiridianBundle\Entity\Envio',
            'locale' => 'es'
        ));
    }
}
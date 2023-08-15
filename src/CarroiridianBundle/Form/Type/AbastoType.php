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
use Symfony\Component\Form\Extension\Core\Type\RadioType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use CarroiridianBundle\Entity\Abasto;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Doctrine\ORM\EntityRepository;

class AbastoType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $duraciones = [
            'Selecciona una frecuencia' => '',
        ];
        if(!empty($options['duraciones'])){
            foreach ($options['duraciones'] as $key => $duracion) {
                $duraciones[$duracion->gen('nombre',$options['locale'])] = $duracion->getId().'-'.$duracion->getDias();
            }
        }
        $builder
        ->add('fechaDeEnvio')
        ->add('duration', ChoiceType::class, array(
            'choices'  => $duraciones
        ))
        ->add('delivery', ChoiceType::class, array(
            'choices'  => array(
                'Selecciona el tiempo' => null,
                $options['qi']->getTextoDB('plan_trimestral') => 3,
                $options['qi']->getTextoDB('plan_semestral') => 6,
                $options['qi']->getTextoDB('plan_anual') => 12,
        )));
    }


    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'CarroiridianBundle\Entity\Abasto',
            'locale' => 'es',
            'duraciones' => [],
            'qi' => null
        ));
    }
}
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
use CarroiridianBundle\Entity\Factura;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\Validator\Constraints\IsTrue;


class FacturaType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $locale = $options["locale"];
        $builder
            ->add('nombre',null,array('required' => true))
            ->add('apellidos',null,array('required' => true))
            ->add('direccion',null,array('required' => true))
            ->add('documento',null,array('required' => true))
            ->add('pais',null,array('required' => true))
            ->add('paisEn', EntityType::class, array(
                'class' => 'GeoBundle:PaisFacturacion',
                'placeholder'=> 'Pais',
                'required' => true
            ))
            ->add('departamento', EntityType::class, array(
                'class' => 'CarroiridianBundle:Departamento',
                'placeholder'=> 'Departamento',
                'required' => true
            ))
            ->add('ciudad', EntityType::class, array(
                'class' => 'CarroiridianBundle:Ciudad',
                'placeholder'=> 'Ciudad',
                'query_builder'=> function(EntityRepository $er){
                    return $er->createQueryBuilder('c')
                        ->setMaxResults(1);
                },
                'required' => true
            ))
            ->add('email',null,array('required' => true))
            ->add('celular',null,array('required' => true))
            ->add('tipodocumento', EntityType::class, array(
                'class' => 'CarroiridianBundle:TipoDocumento',
                'choice_label' => 'nombre'.$locale,
                'placeholder'=> 'Tipo de documento',
                'required' => true
            ))
            ->add('direccion',null,array('required' => true))
            ->add('rangoedad',EntityType::class, array(
                'required' => true,
                'class' => 'AppBundle\Entity\RangoEdad',
                'placeholder'=>'Rango de Edad (años)'
            ))
            ->add('terms', CheckboxType::class, array(
                'mapped' => false,
                'constraints' => new IsTrue(),
                'invalid_message' => 'Debes aceptar los terminos y condiciones',
            ));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'CarroiridianBundle\Entity\Factura',
            'locale' => 'es'
        ));
    }
}
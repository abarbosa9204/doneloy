<?php
/**
 * Created by PhpStorm.
 * User: Iridian 1
 * Date: 11/02/2016
 * Time: 5:02 PM
 */

namespace HomeBundle\Form\Type;

use Doctrine\DBAL\Types\TextType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use HomeBundle\Entity\Adicional;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;

class AdicionalType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('mujeres')
            ->add('hombres')
            ->add('colaboradoresDirecto')
            ->add('colaboradoresIndirecto')
            ->add('colaboradoresIndefinido')
            ->add('colaboradoresFijo')
            ->add('colaboradoresCompleta')
            ->add('colaboradoresParcial')
            ->add('hombresAlta')
            ->add('hombresDireccion')
            ->add('hombresAnalista')
            ->add('hombresOperativa')
            ->add('mujeresAlta')
            ->add('mujeresDireccion')
            ->add('mujeresAnalista')
            ->add('mujeresOperativa')
            ->add('bilinguesAlta')
            ->add('bilinguesDireccion')
            ->add('bilinguesAnalista')
            ->add('bilingueOperativa')
            ->add('teletrabajoAlta')
            ->add('teletrabajoDireccion')
            ->add('teletrabajoAnalista')
            ->add('teletrabajoOperativa')
            ->add('menor18Alta')
            ->add('menor18Direccion')
            ->add('menor18Analista')
            ->add('menor18Operativa')
            ->add('entre18_33Alta')
            ->add('entre18_33Direccion')
            ->add('entre18_33Analista')
            ->add('entre18_33Operativa')
            ->add('entre34_45Alta')
            ->add('entre34_45Direccion')
            ->add('entre34_45Analista')
            ->add('entre34_45Operativa')
            ->add('entre46_54Alta')
            ->add('entre46_54Direccion')
            ->add('entre46_54Analista')
            ->add('entre46_54Operativa')
            ->add('mayor55Alta')
            ->add('mayor55Direccion')
            ->add('mayor55Analista')
            ->add('mayor55Operativa')
            ->add('vulnerable')
            ->add('primer')
            ->add('cabeza')
            ->add('discapacidad')
            ->add('minorias')
            ->add('victimas')
            ->add('otros')
            ->add('otrosNum')
            ->add('sena')
            ->add('senaProductiva')
            ->add('aumentoOperacion')
            ->add('aumentoAdministrativo')
            ->add('seguridad')
            ->add('mide',ChoiceType::class, array(
                'choices'=> array(
                    'Si'=>true,
                    'No'=>false
                ),
                'expanded'=>true,
                'multiple'=>false
            ))
            ->add('satisfaccionGeneral')
            ->add('satisfaccionFisicas')
            ->add('satisfaccionHoras')
            ->add('satisfaccionBienestar')
            ->add('satisfaccionPertenencia')
            ->add('empresa')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'HomeBundle\Entity\Adicional',
        ));
    }
}
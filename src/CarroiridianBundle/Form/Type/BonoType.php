<?php
/**
 * Created by PhpStorm.
 * User: Iridian 1
 * Date: 14/07/2016
 * Time: 4:57 PM
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
use HomeBundle\Entity\Adicional;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Doctrine\ORM\EntityRepository;

class BonoType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('de')
            ->add('para')
            ->add('valorbono', EntityType::class, array(
                'required' => true,
                'class' => 'CarroiridianBundle\Entity\Valorbono',
                'query_builder' => function (\CarroiridianBundle\Repository\ValorbonoRepository $er) use ($options) {
                    return $er->createQueryBuilder('s')
                        ->orderBy("s.id", "ASC");
                }
            ))
            ->add('mensaje');
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'CarroiridianBundle\Entity\Bono',
        ));
    }
}
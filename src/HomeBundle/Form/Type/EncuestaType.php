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
use HomeBundle\Entity\Encuesta;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;

class EncuestaType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('nombre')
            ->add('direccion')
            ->add('telefono')
            ->add('nit')
            ->add('actividad')
            ->add('tipoEmpresa',ChoiceType::class, array(
                'choices'=> array(
                    'BPO'=>'BPO',
                    'Cobranza'=>'Cobranza',
                    'Proveedor de Información'=>'Proveedor de Información',
                    'Centro de Servicios Compartido'=>'Centro de Servicios Compartido',
                    'Contact Center'=>'Contact Center',
                    'Inhouse'=>'Inhouse',
                    'Proveedor de Tecnología'=>'Proveedor de Tecnología',
                    'Otro ¿Cuál?'=>'Otro ¿Cuál?'
                ),
                'expanded'=>true,
                'multiple'=>true
            ))
            ->add('tipoEmpresaOtro')
            ->add('directivos', CollectionType::class, array(
                'allow_add'=>true
            ))
            ->add('sedes', CollectionType::class, array(
                'allow_add'=>true
            ))
            ->add('zonaFranca',ChoiceType::class, array(
                'choices'=> array(
                    'Si'=>'Si',
                    'No'=>'No'
                ),
                'expanded'=>false,
                'multiple'=>false
            ))
            ->add('ciudad')
            ->add('zonaFrancaNombre')
            ->add('doctorado')
            ->add('maestria')
            ->add('especializacion')
            ->add('profesional')
            ->add('tecnologico')
            ->add('tecnico')
            ->add('bachiller')
            ->add('sena')
            ->add('servicioEs')
            ->add('servicioEn')
            ->add('servicioPt')
            ->add('servicioFr')
            ->add('televenta')
            ->add('gestionRecursos')
            ->add('facturacion')
            ->add('finanzas')
            ->add('gestionCompras')
            ->add('logistica')
            ->add('atencion')
            ->add('serviciosOtros')
            ->add('servicioOtrosPorcentaje')
            ->add('distribucionContact')
            ->add('distribucionTelecomunicaciones')
            ->add('distribucionSalud')
            ->add('distribucionGobierno')
            ->add('distribucionBanca')
            ->add('distribucionSeguros')
            ->add('distribucionMedios')
            ->add('distribucionConsumo')
            ->add('distribucionTransporte')
            ->add('distribucionServicios')
            ->add('distribucionHidrocarburos')
            ->add('distribucionOtros')
            ->add('distribucionOtrosPorcentaje')
            ->add('activos')
            ->add('pasivos')
            ->add('patrimonio')
            ->add('ingresos')
            ->add('utilidad')
            ->add('exportaciones')
            ->add('exportacionePais', CollectionType::class, array(
                'allow_add'=>true
            ))
            ->add('certificacionesObtenidas')
            ->add('certificacionesCurso')
            ->add('plataformas', CollectionType::class, array(
                'allow_add'=>true
            ))
            ->add('plataformasOtro')
            ->add('actividadInbound')
            ->add('actividadOutbound')
            ->add('actividadBackoffice')
            ->add('actividadAtencion')
            ->add('actividadOtros')
            ->add('actividadOtrosPorcentaje')
            ->add('mediosVoz')
            ->add('mediosEmail')
            ->add('mediosWebchat')
            ->add('mediosSms')
            ->add('mediosRedes')
            ->add('mediosOtros')
            ->add('mediosOtrosPorcentaje')
            ->add('servicios', CollectionType::class, array(
                'allow_add'=>true
            ))
            ->add('empresa')
            ->add('tipoProveedor',HiddenType::class)
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'HomeBundle\Entity\Encuesta',
        ));
    }
}
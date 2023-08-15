<?php

namespace CarroiridianBundle\Command;


use CarroiridianBundle\Entity\Entrada;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Exception\IOException;
use CarroiridianBundle\Entity\Compraitem;
use PagosPayuBundle\Entity\RepuestaPago;

/**
 * Created by PhpStorm.
 * User: Iridian 1
 * Date: 13/09/2016
 * Time: 11:47 AM
 */

class DefaultCommand extends ContainerAwareCommand
{
    public function configure()
    {
        // Must have a name configured
        // ...
        $this
            ->setName('factura:check')
            ->setDescription('Comfirmar compra a SAP')
        ;
    }

    public function execute(InputInterface $input, OutputInterface $output)
    {
        $facturas = $this->getContainer()->get('doctrine')->getRepository('CarroiridianBundle:Factura')->findBy(array('reportada'=>false));
        $em = $this->getContainer()->get('doctrine')->getManager();
        $facturas  = $em
            ->createQueryBuilder()
            ->from('CarroiridianBundle:Factura','f')
            ->select('f')
            ->leftJoin('f.compra','c')
            ->leftJoin('c.estado','e')
            ->where('e.id = 2')
            ->andWhere('f.reportada = 0')
            ->andWhere('f.request is not null')
            ->andWhere('f.id > 22359')
            ->getQuery()
            ->getResult();
        $c = 0;
        //$client = new \nusoap_client('http://45.163.28.59:13027/SIC.asmx?WSDL', true);
        foreach ($facturas as $factura){
            $c = $c + 1;
        //     $full_array = $factura->getRequest();
        //     $mensaje = $full_array['Documents']['UserField']['RowField'][11]['Value'];
        //     $mensaje = str_replace("\r\n",'',$mensaje);
        //     $full_array['Documents']['UserField']['RowField'][11]['Value'] = $mensaje;
        //     $response = $client->call('Document_marketing', $full_array);
        //     error_log('cron '.$response['Document_marketingResult'].PHP_EOL,3,__DIR__.'/../../../html/log_jimmy.log');
        //     if (strpos($response['Document_marketingResult'], 'success') !== false) {
        //         $temp = explode(";",explode(" ",$response['Document_marketingResult'])[1]);
        //         $idsap = $temp[0];
        //         $docsap = $temp[1];
        //         $factura->setIdsap($idsap);
        //         $factura->setDocsap($docsap);
        //         $factura->setReportada(true);
        //     }
        //     $em->persist($factura);
        //     break;
        }
        // error_log('cron '.$c.PHP_EOL,3,__DIR__.'/../../../html/log_jimmy.log');
        $output->writeln(sprintf('Cron Conexión con SAP'));
    }
}
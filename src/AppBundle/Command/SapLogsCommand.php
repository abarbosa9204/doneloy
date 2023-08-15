<?php namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Exception\IOException;
use \ZipArchive;

class SapLogsCommand extends ContainerAwareCommand
{
	public function configure()
    {
        // Must have a name configured
        // ...
        $this
            ->setName('saplogs:zip')
            ->setDescription('Guardar logs de sap a un zip');
	}
	
	public function execute(InputInterface $input, OutputInterface $output){
		$zip = new ZipArchive;
		$saveDir = __DIR__.'/../../../html/';
		$zipName = date('Y-m-d-Hi').'-log_sap.zip';
		$res = $zip->open($saveDir.$zipName, ZipArchive::CREATE);
		if($res){
			$zip->addFile($saveDir.'log_sap.log');
			$zip->renameIndex(0,'log_sap.log');
			file_put_contents($saveDir.'log_sap.log', '');
			$zip->close();
		}
		$output->writeln(sprintf('Cron Zip Sap Logs'));
	}
}

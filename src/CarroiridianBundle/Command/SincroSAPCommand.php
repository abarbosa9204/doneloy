<?php 
namespace CarroiridianBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class SincroSAPCommand extends ContainerAwareCommand {
	public function configure()
    {
        // Must have a name configured
        // ...
        $this
            ->setName('sincro:save')
            ->setDescription('Enviar SincroSN')
        ;
    }
    public function execute(InputInterface $input, OutputInterface $output){
        $path = __DIR__.'/../../../html/sincros.json';
        if(!file_exists($path)){
            file_put_contents($path,'[]');
        }
		$json = file_get_contents($path);
        $arr = json_decode($json,true);
        $newArr = [];
        if(!empty($arr)){
            $client = new \nusoap_client('http://45.163.28.59:13027/SIC.asmx?WSDL', true);
            // error_log(serialize($client).PHP_EOL,3,__DIR__.'/../../../html/log_jimmy.log');

            foreach ($arr as $key => $sincro) {
                array_push($sincro['BusinessPartners']['UserField']['RowFieldSN'],[
                    'Field' => 'U_RDE_AutUsoDatos',
                    'Value' => 'Y'
                ]);
                $response = $client->call('SincroSN', $sincro);
                // error_log(json_encode($sincro).PHP_EOL,3,__DIR__.'/../../../html/log_jimmy.log');
                // error_log($client->request.PHP_EOL,3,__DIR__.'/../../../html/log_jimmy.log');
                // error_log(serialize($response).PHP_EOL,3,__DIR__.'/../../../html/log_jimmy.log');
                if(strpos($response['SincroSNResult'],'success') === false){
                    array_push($newArr, $sincro);
                }
            }
            $json = json_encode($newArr);
            file_put_contents($path, $json);
        }
	}
}
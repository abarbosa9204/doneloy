<?php

use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Config\Loader\LoaderInterface;

class AppKernel extends Kernel
{
    public function registerBundles()
    {
        $bundles = [
            new Symfony\Bundle\FrameworkBundle\FrameworkBundle(),
            new Symfony\Bundle\SecurityBundle\SecurityBundle(),
            new Symfony\Bundle\TwigBundle\TwigBundle(),
            new Symfony\Bundle\MonologBundle\MonologBundle(),
            new Symfony\Bundle\SwiftmailerBundle\SwiftmailerBundle(),
            new Doctrine\Bundle\DoctrineBundle\DoctrineBundle(),
            new Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle(),
            new AppBundle\AppBundle(),
            new FOS\UserBundle\FOSUserBundle(),
            new JavierEguiluz\Bundle\EasyAdminBundle\EasyAdminBundle(),
            new Stof\DoctrineExtensionsBundle\StofDoctrineExtensionsBundle(),
            new Ivory\CKEditorBundle\IvoryCKEditorBundle(),
            new Vich\UploaderBundle\VichUploaderBundle(),
            new Liip\ImagineBundle\LiipImagineBundle(),
            new JMS\SerializerBundle\JMSSerializerBundle(),
            new JMS\I18nRoutingBundle\JMSI18nRoutingBundle(),
            new JMS\TranslationBundle\JMSTranslationBundle(),
            new SunCat\MobileDetectBundle\MobileDetectBundle(),
            new Lexik\Bundle\JWTAuthenticationBundle\LexikJWTAuthenticationBundle(),
            new Ddeboer\DataImportBundle\DdeboerDataImportBundle(),
            new NoiseLabs\Bundle\NuSOAPBundle\NoiseLabsNuSOAPBundle(),
            new JMose\CommandSchedulerBundle\JMoseCommandSchedulerBundle(),
            new Symfony\Bundle\AsseticBundle\AsseticBundle(),
            new EWZ\Bundle\RecaptchaBundle\EWZRecaptchaBundle(),
            new Nelmio\CorsBundle\NelmioCorsBundle(),


            new HomeBundle\HomeBundle(),
            new ContactoBundle\ContactoBundle(),
            new CarroiridianBundle\CarroiridianBundle(),
            new BlogiridianBundle\BlogiridianBundle(),
            new UserIridianBundle\UserIridianBundle(),
            new PagosPayuBundle\PagosPayuBundle(),
            new FM\ElfinderBundle\FMElfinderBundle(),
            new SomosBundle\SomosBundle(),
            new TiendasBundle\TiendasBundle(),
            new BlogBundle\BlogBundle(),
            new TipsBundle\TipsBundle(),
            new GeoBundle\GeoBundle(),
            new ApiBundle\ApiBundle(),
            new MercadoPagoBundle\MercadoPagoBundle(),
        ];

        if (in_array($this->getEnvironment(), ['dev', 'test'], true)) {
            $bundles[] = new Symfony\Bundle\DebugBundle\DebugBundle();
            $bundles[] = new Symfony\Bundle\WebProfilerBundle\WebProfilerBundle();
            $bundles[] = new Sensio\Bundle\DistributionBundle\SensioDistributionBundle();
            $bundles[] = new Sensio\Bundle\GeneratorBundle\SensioGeneratorBundle();
        }

        return $bundles;
    }

    public function getRootDir()
    {
        return __DIR__;
    }

    public function getCacheDir()
    {
        return dirname(__DIR__).'/var/cache/'.$this->getEnvironment();
    }

    public function getLogDir()
    {
        return dirname(__DIR__).'/var/logs';
    }

    public function registerContainerConfiguration(LoaderInterface $loader)
    {
        $loader->load($this->getRootDir().'/config/config_'.$this->getEnvironment().'.yml');
    }
}

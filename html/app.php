<?php

use Symfony\Component\HttpFoundation\Request;
umask(0000);

// if(!array_key_exists('test_rosas',$_COOKIE) && (strpos($_SERVER['REQUEST_URI'], 'pagar-mp') === false && strpos($_SERVER['REQUEST_URI'], 'admin') === false && strpos($_SERVER['REQUEST_URI'], 'login') === false)){
// 	$html =  file_get_contents('landing-migracion/index.html');
// 	echo $html;
// }else{

// include 'app_dev.php';exit();

/**
 * @var Composer\Autoload\ClassLoader
 */
$loader = require __DIR__.'/../app/autoload.php';
include_once __DIR__.'/../var/bootstrap.php.cache';

// Enable APC for autoloading to improve performance.
// You should change the ApcClassLoader first argument to a unique prefix
// in order to prevent cache key conflicts with other applications
// also using APC.
/*
$apcLoader = new Symfony\Component\ClassLoader\ApcClassLoader(sha1(__FILE__), $loader);
$loader->unregister();
$apcLoader->register(true);
*/

/*
$kernel = new AppKernel('prod', false);
$kernel->loadClassCache();

$kernel = new AppCache($kernel);

$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
*/

$kernel = new AppKernel('prod', false);
$kernel->loadClassCache();
//$kernel = new AppCache($kernel);

// When using the HttpCache, you need to call the method in your front controller instead of relying on the configuration parameter
//Request::enableHttpMethodParameterOverride();
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
// }

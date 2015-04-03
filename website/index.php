<?php

require $config['root_path'].'/server-api/lib/Slim/Slim.php';
require $config['root_path'].'/server-api/lib/Twig/Autoloader.php';
require $config['root_path'].'/server-api/modules/db/dbHelper.php';
require 'websitemanager/websiteManager.php';
require 'websitemanager/templateLoader.php';
Slim\Slim::registerAutoloader();
Twig_Autoloader::register();
$app = new Slim\Slim();
$loader = new Twig_Loader_Filesystem($config['root_path'].'/website/templates');
// initialize Twig environment
$twig = new Twig_Environment($loader);


//$app->response->headers->set('Content-Type', 'application/json');

if(isset($_GET['_escaped_fragment_'])){
	$seo = true;
}else{
	$seo = false;
}
$app->get('/', function() use($app, $seo, $twig,$config) {
	//echo $seo;
	// load template
	$web = new websiteManager;
	print_r($web->getRoutes());
	$template = $twig->loadTemplate('child.tmpl');
	$template->display(array(
	'path' => $config['http_template_path'],
	'title' => 'Small Business',
    'name' => 'Clark Kent',
    'username' => 'ckent',
    'password' => 'krypt0n1te',
  ));
	//loadTemplate($seo);
});

$app->get('/sitedata', function() use($app, $config) {
	try{
		$app->response->headers->set('Content-Type', 'application/json');
		$webConfig = websiteManager::getConfig();
		$webData = websiteManager::getData();
		$webRoutes = websiteManager::getRoutes();
		$webTemplate = websiteManager::getTemplate();
		if($webConfig['status'] == 'success'){
			$response['webConfig'] = $webConfig['data'];
		}else{
			throw new Exception($webConfig['message']);
		}
		if($webData['status'] == 'success'){
			$response['webData'] = $webData['data'];
		}else{
			throw new Exception($webData['message']);
		}
		if($webRoutes['status'] == 'success'){
			$response['webRoutes'] = $webRoutes['data'];
		}else{
			throw new Exception($webRoutes['message']);
		}
		if($webTemplate['status'] == 'success'){
			$response['webTemplate'] = $webTemplate['data'];
		}else{
			throw new Exception($webTemplate['message']);
		}
		$response["status"] = "success";
		$response["config"] = $config;
	}catch(Exception $e){
		header("");
		$response["status"] = "error";
		$response["message"] = 'Error: ' .$e->getMessage();
		$response["data"] = null;
	}
	echo json_encode($response);
	
});

$app->run();
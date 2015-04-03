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
$web = new websiteManager;
$routes = $web->getRoutes();

foreach($routes['data'] as $route){
	$app->get('/'.$route, function() use($app, $web, $twig, $config, $route) {
		$template = $twig->loadTemplate('child.tmpl');
		$webConfig = $web->getConfig();
		$webData = $web->getData();
		$webRoutes = $web->getRoutes();
		$webTemplate = $web->getTemplate();
		$response['path'] = $config['http_template_path'];
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
		$template->display($response);
		//loadTemplate($seo);
	});
}

$app->get('/sitedata', function() use($app, $config) {
	try{
		$app->response->headers->set('Content-Type', 'application/json');
		$web = new websiteManager;
		$webConfig = $web->getConfig();
		$webData = $web->getData();
		$webRoutes = $web->getRoutes();
		$webTemplate = $web->getTemplate();
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
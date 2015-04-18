<?php

require $config['root_path'].'/server-api/lib/Slim/Slim.php';
require $config['root_path'].'/server-api/lib/Twig/Autoloader.php';
require $config['root_path'].'/server-api/modules/db/dbHelper.php';
require 'websitemanager/websiteManager.php';
require 'websitemanager/templateLoader.php';
Slim\Slim::registerAutoloader();
Twig_Autoloader::register();
$app = new Slim\Slim();
echo $config['root_path'];
$web = new websiteManager;
$template = new templateLoader();
$routes = $web->getRoutes();

foreach($routes['data'] as $routeKey => $routeName){
	if(is_array($routeName)) foreach($routeName as $childRouteKey => $childRouteName){
		if(is_array($childRouteName)){
			foreach($childRouteName as $childChildRouteKey => $childChildRouteName){
				$app->get('/'.$childChildRouteKey, function() use($app, $web, $template, $childChildRouteKey) {
					$template->displayTemplate($childChildRouteKey);
				});
			}
		}
		$app->get('/'.$childRouteKey, function() use($app, $web, $template, $childRouteKey) {
			$template->displayTemplate($childRouteKey);
		});
	}else{
		$app->get('/'.$routeName, function() use($app, $web, $template, $routeName) {
			$template->displayTemplate($routeName);
		});
	}
}

$app->get('/sitedata', function() use($app, $config) {
	try{
		$app->response->headers->set('Content-Type', 'application/json');
		$web = new websiteManager;
		$webConfig = $web->getConfig();
		$webData = $web->getTemplateData();
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
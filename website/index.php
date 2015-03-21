<?php

require $config['root_path'].'/server-api/lib/Slim/Slim.php';
require $config['root_path'].'/server-api/modules/db/dbHelper.php';
require 'websitemanager/websiteManager.php';
require 'websitemanager/templateLoader.php';
Slim\Slim::registerAutoloader();

$app = new Slim\Slim();
//$app->response->headers->set('Content-Type', 'application/json');
$websiteConfig = websiteManager::getConfig();
$routes = websiteManager::getRoutes();
//print_r($websiteConfig);

foreach ($routes as $route){
	$app->get('/'.$route, function() use($app, $route) {
		
		vilas($route);
		
	});
}

$app->run();
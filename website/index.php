<?php

require '../server-api/lib/Slim/Slim.php';
require 'websitemanager/index.php';
Slim\Slim::registerAutoloader();

$app = new Slim\Slim();
$websiteConfig['routes'] = ['index','home','about'];

foreach ($websiteConfig['routes'] as $route){
	$app->get('/'.$route, function() use($app, $route) {
		$templateData = array('userShortInfo' => "my name is vilas");
		$templateData1 = array('userShortInfo' => "my name is vilas");
		$app->render('templateloader.php',$templateData);
	});
}

$app->run();
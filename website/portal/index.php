<?php

require $config['root_path'].'/server-api/lib/Slim/Slim.php';
require $config['root_path'].'/server-api/lib/Twig/Autoloader.php';
require $config['root_path'].'/server-api/modules/db/dbHelper.php';
require 'models/portalManager.php';

Slim\Slim::registerAutoloader();
Twig_Autoloader::register();
$app = new Slim\Slim();
$db = new dbHelper;
$portal = new portalManager;

$app->get('/', function() use($app, $config, $db,$portal) {
	echo $portal->getBusinessData();
});

$app->run();
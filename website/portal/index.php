<?php

require $config['root_path'].'/server-api/lib/Slim/Slim.php';
require $config['root_path'].'/server-api/lib/Twig/Autoloader.php';
require $config['root_path'].'/server-api/modules/db/dbHelper.php';
require 'models/portalManager.php';

Slim\Slim::registerAutoloader();
Twig_Autoloader::register();
$app = new Slim\Slim();
$portal = new portalManager($config);
$loader = new Twig_Loader_Filesystem("website/portal/views");
$twig = new Twig_Environment($loader);

$app->get('/', function() use($app, $config, $twig, $portal) {
	$response = $portal->getCategories();
	$template = $twig->loadTemplate("home.html");
	$template->display($response);
});

$app->get('/:category', function($category) use($app, $config, $twig, $portal) {
	$response = $portal->getCategoryTypes($category);
	$template = $twig->loadTemplate("types.html");
	$template->display($response);
	echo $response;
});

$app->get('/:category/:type', function($category, $type) use($app, $config, $twig, $portal) {
	echo $category;
	echo $type;
	$response = $portal->getCategories();
	$template = $twig->loadTemplate("index.html");
	$template->display($response);
});

$app->get('/:category/:type/:business', function($category, $type, $business) use($app, $config, $twig, $portal) {
	echo $category;
	echo $type;
	echo "<br>";
	echo $business;
	$response = $portal->getCategories();
	$template = $twig->loadTemplate("index.html");
	$template->display($response);
});

$app->run();
?>
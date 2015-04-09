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
	// this will replace [-] with [space]
	//to add [-] from template use - replace({' ' : '-'}) as a filter
	$category = $portal->decodeUrl($category); 
	$response = $portal->getCategoryTypes($category);
	$template = $twig->loadTemplate("categorytypes.html");
	$template->display($response);
	
});

$app->get('/:category/:type', function($category, $type) use($app, $config, $twig, $portal) {
	$category = $portal->decodeUrl($category);
	$type = $portal->decodeUrl($type);
	
	$response = $portal->getBusiness($category, $type);
	$template = $twig->loadTemplate("business.html");
	$template->display($response);
});

$app->get('/:category/:type/:business', function($category, $type, $business) use($app, $config, $twig, $portal) {
	echo $business;
	$response = $portal->getBusinessView($category, $type, $business);
	$template = $twig->loadTemplate("viewbusiness.html");
	$template->display($response);
});

$app->run();
?>
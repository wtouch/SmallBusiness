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
$app->get('/enquiry/:business/:business_id', function($business, $business_id) use($app, $config, $twig, $portal) {
	
	$business = $portal->decodeUrl($business); 
	$business = $portal->decodeUrl($business); 
	$response['subject'] = "Enquiry from Apna Site: ".$business;
	$response['business_id'] = $business_id;
	$template = $twig->loadTemplate("enquiry.html");
	$template->display($response);
});
$app->get('/search/:keyword', function($keyword) use($app, $config, $twig, $portal) {
	// this will replace [-] with [space]
	//to add [-] from template use - replace({' ' : '-'}) as a filter
	$keyword = $portal->decodeUrl($keyword); 
	$response = $portal->getDataByKeyword($keyword);
	if($response['status'] == "success"){
		$template = $twig->loadTemplate("business.html");
	}else{
		$template = $twig->loadTemplate("error.html");
	}
	
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

$app->get('/:category/:type/:business/:id', function($category, $type, $business,$id) use($app, $config, $twig, $portal) {
	$category = $portal->decodeUrl($category);
	$type = $portal->decodeUrl($type);
	$business = $portal->decodeUrl($business);
	$response = $portal->getBusinessView($category, $type, $business,$id);
	$template = $twig->loadTemplate("viewbusiness.html");
	$template->display($response);
});

$app->run();
?>
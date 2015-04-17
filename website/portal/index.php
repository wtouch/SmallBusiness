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
	print_r($business_id);
	$response['subject'] = "Enquiry from Apna Site: ".$business;
	$response['business_id'] = $business_id;
	$template = $twig->loadTemplate("enquiry.html");
	$template->display($response);
});
$app->get('/search/data', function() use($app, $config, $twig, $portal) {
	// this will replace [-] with [space]
	//to add [-] from template use - replace({' ' : '-'}) as a filter
	foreach($_GET as $key => $value){
		$keyword[$key] = $value;
	}
	
	$keyword = $portal->decodeUrl($keyword); 
	$response = $portal->getDataByKeyword($keyword, true);
	if($response['status'] == "success"){
		$template = $twig->loadTemplate("business.html");
	}else{
		$template = $twig->loadTemplate("error.html");
	}
	$template->display($response); 
	$app->response->headers->set('Content-Type', 'application/json');
	echo json_encode($response);
});

$app->get('/search/:keyword(/:business_name)', function($keyword,$business_name=null) use($app, $config, $twig, $portal) {
	// this will replace [-] with [space]
	//to add [-] from template use - replace({' ' : '-'}) as a filter
	$keyword = $portal->decodeUrl($keyword);
	//$business_name = $portal->decodeUrl($business_name);
	$response = $portal->getDataByKeyword($keyword);
	
	if($response['status'] == "success"){
		$template = $twig->loadTemplate("business.html");
	}else{
		$template = $twig->loadTemplate("error.html");
	}
	
	$template->display($response);
});

$app->get('/:category', function($category) use($app, $config, $twig, $portal) {
	
	$category = $portal->decodeUrl($category); 
	$response = $portal->getCategoryTypes($category);

	$template = $twig->loadTemplate("categorytypes.html");
	$template->display($response);
});

$app->get('/:category/:type', function($category, $type) use($app, $config, $twig, $portal) {
	$category = $portal->decodeUrl($category);
	$type = $portal->decodeUrl($type);
	$response = $portal->getBusinessList($category, $type);
	 if($response['status'] == "success"){
		$template = $twig->loadTemplate("business.html");
	}else{
		$template = $twig->loadTemplate("error.html");
	} 
	//$template = $twig->loadTemplate("business.html");
	$template->display($response);
});

$app->get('/:category/:type/:business/:id', function($category, $type, $business,$id) use($app, $config, $twig, $portal) {
	$category = $portal->decodeUrl($category);
	$type = $portal->decodeUrl($type);
	
	$business = $portal->decodeUrl($business);
	$response = $portal->getBusiness($category, $type, $business,$id);
	 if($response['status'] == "success"){
		$template = $twig->loadTemplate("viewbusiness.html");
	}else{
		$template = $twig->loadTemplate("error.html");
	} 
	$template->display($response);
});

$app->run();
?>
<?php

require $config['root_path'].'/server-api/lib/Slim/Slim.php';
require $config['root_path'].'/server-api/lib/Twig/Autoloader.php';
require $config['root_path'].'/server-api/modules/db/dbHelper.php';
require 'websitemanager/websiteManager.php';
require 'websitemanager/templateLoader.php';
Slim\Slim::registerAutoloader();
Twig_Autoloader::register();
$app = new Slim\Slim();

$web = new websiteManager;

$app->get('/', function() use($app, $config, $web) {
	$modules['headerModule']['carousal'] = true;
	$modules['headerModule']['homeproject'] = true;
	$modules['sidebarModule']['searchProp'] = true;
	$modules['sidebarModule']['enquiry'] = true;
	$modules['sidebarModule']['contact'] = true;
	$modules['sidebarModule']['sidemenu'] = true;
	$modules['contentModule']["featured_products"] = true;
	$modules['contentModule']["featured_services"] = true;
	$modules['contentModule']["featured_projects"] = true;
	$modules['contentModule']["featured_properties"] = true;
	$title = "Home";
	$web->getBusinessData('home', $title);
});

$app->get('/products', function() use($app, $config, $web) {
	$web->getProductData("products", "product");
});

$app->get('/products/:category', function($category) use($app, $config, $web) {
	$web->getProductData("products", "product", $category);
});

$app->get('/products/:product_name/:productId', function($product_name, $productId) use($app, $config, $web) {
	
	$web->getSingleProduct("product", $productId);
}); 

$app->get('/services', function() use($app, $config, $web) {
	$web->getProductData("products", "service");
});

$app->get('/services/:category', function($category) use($app, $config, $web) {
	$web->getProductData("products", "service", $category);
});

$app->get('/services/:product_name/:productId', function($product_name, $productId) use($app, $config, $web) {
	$web->getSingleProduct("product", $productId);
}); 

$app->get('/projects', function() use($app, $config, $web) {
	$web->getProjectData("projects", "project");
});

$app->get('/projects/:project_name/:projectId(/:page)', function($project_name, $projectId, $page = null) use($app, $config, $web) {
	$page = ($page) ? $page : 'overview';
	$web->getSingleProject("project", $projectId, $page);
}); 

$app->get('/properties', function() use($app, $config, $web) {
	$web->getPropertyData("properties");
});
$app->get('/properties/:category', function($category) use($app, $config, $web) {
	$web->getPropertyData("properties", $category);
});


$app->get('/properties/:property_name/:propertyId', function($property_name, $propertyId) use($app, $config, $web) {
	$web->getSingleProperty("property", $propertyId);
});

$app->get('/cp/:page', function($page) use($app, $config, $web) {
	$title = "Home";
	$web->getBusinessData("page", $title, $page);
});
$app->get('/:page', function($page) use($app, $config, $web) {
	$title = "Home";
	$web->getBusinessData($page, $title);
});

$app->get('/:page/:product/:id', function() use($app, $config) {
	
});


$app->get('/sitemapdata', function() use($app, $config, $web) {
	echo json_encode($template->getSitemap());
});

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
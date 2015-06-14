<?php

class websiteManager{
	private $domain;
	private $db;
	private $config;
	private $tempDetails;
	private $routes;
	private $business;
	private $twig;
	
	
	function __construct(){
		$this->domain = $_SERVER['SERVER_NAME'];
		$this->db = new dbHelper;
		
	}
	
	function getTemplate($templateFolder, $page){
		$loader = new Twig_Loader_Filesystem($templateFolder);
		$this->twig = new Twig_Environment($loader);
		return $this->twig->loadTemplate($page);
	}
	
	function getConfig(){
		try{
			
			//if(!isset($_SESSION['config'])){
				$table = 'website';
				$where['domain_name'] = $this->domain;
				$t0 = $this->db->setTable($table);
				$this->db->setWhere($where, $t0);
				$dbresult = $this->db->selectSingle();
				/* $_SESSION['config'] = $dbresult;
				$dbresult = $_SESSION['config'];
			}else{
				$dbresult = $_SESSION['config'];
			} */
			
			if($dbresult['status'] == 'success' && $dbresult['data'] != null) {
				$dbresult = $dbresult['data'];
				$config['domain_name'] = $dbresult['domain_name'];
				$config['website_id'] = $dbresult['id'];
				$config['website_config'] = ($dbresult['config']);
				$config['business_id'] = ($dbresult['business_id']);
				$config['user_id'] = $dbresult['user_id'];
				$config['expired'] = $dbresult['expired'];
				
				if($dbresult['expired'] == 1){
					throw new Exception('Website is expired please renew soon!');
				}
				if($dbresult['status'] != 1){
					throw new Exception('Website is not activated please contact your administrator!');
				}
				//print_r();
				if(empty($dbresult['config'])){
					throw new Exception('Please add website details!');
				}
			}else{
				throw new Exception('Website not registered!');
			}
			
			$response["status"] = "success";
            $response["message"] = "Website Data added to config!";
            $response["data"] = $config;
			
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
		}
		return $response;
	}
	function getBusinessData($page){
		try{
			$table = 'website';
			$where['domain_name'] = $this->domain;
			$website = $this->db->setTable($table);
			$this->db->setWhere($where, $website);
			$this->db->setColumns($website, array("config"=>"web_config"));
			
			$selectInnerJoinCols['name'] = "owner_name";
			$selectInnerJoinCols['email'] = "owner_email";
			$selectInnerJoinCols['address'] = "owner_address";
			$selectInnerJoinCols['country'] = "owner_country";
			$selectInnerJoinCols['state'] = "owner_state";
			$selectInnerJoinCols['phone'] = "owner_phone";
			$selectInnerJoinCols['website'] = "owner_website";
			$selectInnerJoinCols['fax'] = "owner_fax";
			
			$users = $this->db->setJoinString("LEFT JOIN","users", array("id"=>$website.".user_id"));
			$this->db->setColumns($users, $selectInnerJoinCols);

			$business = $this->db->setJoinString("LEFT JOIN","business", array("id"=>$website.".business_id"));
			//$this->db->setWhere($where, $business);
			$this->db->setColumns($business, array("*"));
			
			
			$businessData = $this->db->selectSingle();
			
			if($businessData['status'] != "success"){
				throw new Exception("Business DB Table Error: ".$businessData['message']);
			}
			
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $businessData["data"];
            $response["path"] = "http://".$_SERVER['SERVER_NAME']."/website/templates/educational_books/college/";
			
            $response["templatePath"] = "educational_books/college/";
            //$response["templatePath"] = "educational_books/college/about-us.html";
			
			print_r($response["templatePath"]);
			
			//print_r($businessData["data"]['web_config']['menus']);
			
            $response["routes"] = $businessData["data"]['web_config']['menus'];
			
            $response["uri"] = ($page) ? "/".$page : '/home';
			
            $response["pathLink"] = "includes/links.html";
            
			//$response["routes"] = array('home', 'about', 'contact',array("product" => array("product/26" => "Product one", "product/25" => "Product Two")));
			
			$template = $this->getTemplate($_SERVER['DOCUMENT_ROOT']."/website/templates/", "educational_books/college/index.html");
			
			$template->display($response);
			
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			print_r($response);
		}
		
		return $response;
	}
	
	/* function getTemplate(){
		try{
			$config = $this->getConfig();
			if($config['status'] == 'success'){
				$config = $config['data'];
			}else{
				throw new Exception($config['message']);
			}
			
			$table = "my_template";
			(isset($config['website_config']['template_id'])) ? $template_id = $config['website_config']['template_id'] : "";
			
			(isset($template_id)) ? $where["id"] = $template_id : $template_id = 0;
			
			if($template_id == 0 || $template_id == null || !isset($config['website_config']['template_id'])){
				$templateDetails["template_name"] = "default";
				$templateDetails["template_category"] = "default";
				$templateDetails["template_image"] = "default/preview.png";
				$templateDetails["template_params"] = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT'].'/website/templates/default/default/templateParams.json'),true);
				
			}else{
				//if(!isset($_SESSION['tempDetails'])){
					$t0 = $this->db->setTable($table);
					$this->db->setWhere($where, $t0);
					$dbresult = $this->db->selectSingle();
					//$_SESSION['tempDetails'] = $dbresult;
				/* }else{
					$dbresult = $_SESSION['tempDetails'];
				} * /
				
				if($dbresult['status'] == "success"){
					$templateDetails["template_name"] = $dbresult['data']['template_name'];
					$templateDetails["template_category"] = $dbresult['data']['category'];
					$templateDetails["template_image"] = ($dbresult['data']['template_image']);
					$templateDetails["template_params"] = ($dbresult['data']['template_params']);
				}else{
					throw new Exception("Template DB Error: ".$dbresult['message']);
				}
			}
			$response["status"] = "success";
            $response["message"] = "Template - ".$templateDetails["template_name"]." Selected!";
            $response["data"] = $templateDetails;
			//print_r($response["data"]);
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			//print_r($response);
		}
		return $response;
	} */
	
	
	
	
	
	function getProductData($routes=null, $featured=null){
		try{
			$id = null;
			if($routes != null){
				$route = explode("/", $routes);
				if(count($route) > 1){
					$productType = $route[0];
					$id = $route[1];
				}else{
					$productType = rtrim($route[0], "s");
					$id = null;
				}
			}
			
			$config = $this->getConfig();
			if($config['status'] == 'success'){
				$config = $config['data'];
				//print_r($config['website_config']);
				if(isset($config['business_id'])) {
					$whereProd['business_id'] = $config['business_id'];
				}else{
					throw new Exception("Please add website details!");
				}
				
			}else{
				throw new Exception($config['message']);
			}
			// get data for view from product table, business table, users table, template table
			if($id != null) $whereProd['id'] = $id;
			$whereProd['status'] = 1;
			if($featured != null) $whereProd['featured'] = $featured;
			if(isset($productType)) $whereProd['type'] = $productType;
			
			$table = "product";
			$t0 = $this->db->setTable($table);
			$this->db->setWhere($whereProd, $t0);
			$this->db->setColumns($t0, array("*"));
			
			$t1 = $this->db->setJoinString("INNER JOIN","business", array("id"=>$t0.".business_id"));
			$selectInnerJoinCols['business_name'] = "business_name";
			$this->db->setColumns($t1, $selectInnerJoinCols);
			
			if($id == null){
				$productDbData = $this->db->select();
			}else{
				$productDbData = $this->db->selectSingle();
			}
			
			if($productDbData['status'] != "success"){
				throw new Exception("Product DB Table Error: ".$productDbData['message']);
			}
			
			
			//if(count($productDbData) <= 1 && $id != null) $productDbData = $productDbData[0];
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $productDbData["data"];
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
		}
		return $response;
	}
	
	function getTemplateData($routes){
		try{
			$config = $this->getConfig();
			$config = $config['data'];
			$route = explode("/", $routes);
			if($route[0] == 'product' || $route[0] == 'products' || $route[0] == 'service' || $route[0] == 'services'){
				$products = $this->getProductData($routes);
				if($products['status'] != "success") {
					throw new Exception($business['message']);
				}
				if($route[0] == 'products'){
					$data['products'] = $products['data'];
				}
				if($route[0] == 'services'){
					$data['services'] = $products['data'];
				}
				
				$business = $this->getBusinessData($routes);
				
				if($business['status'] != "success") {
					throw new Exception($business['message']);
				}
				
				$data['business'] = $business['data'];
				
				if($route[0] == 'product' || $route[0] == 'service'){
					
					$data['business'] = array_merge($data['business'],$products['data']);
				}
				//print_r($data['business']);
			}elseif($route[0] == 'home' || $route[0] == '') {
				$featured_products = $this->getProductData('products', 1);
				$featured_services = $this->getProductData('services', 1);
				$business = $this->getBusinessData($routes);
				
				if($business['status'] != "success") {
					throw new Exception($business['message']);
				}
				$data['featured_products'] = $featured_products['data'];
				$data['featured_services'] = $featured_services['data'];
				$data['business'] = $business['data'];
				//print_r($data);
			}else{
				$business = $this->getBusinessData($routes);
				if($business['status'] != "success") {
					throw new Exception($business['message']);
				}
				$data['business'] = $business['data'];
			}
			
			$data['website'] = json_decode(json_encode($config['website_config']),true);
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $data;
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
		}
		//print_r($response);
		return $response;
	}
	
	function getRoutes(){
		try{
			$routes = array("", "home", "about", "contact");
			$products = $this->getProductData("products");
			$services = $this->getProductData("services");
			
			$business = $this->getBusinessData();
			//print_r($business);
			if(count($business['data']['testimonials']) >= 1) array_push($routes,'testimonials');
			if(count($business['data']['job_careers']) >= 1) array_push($routes,'job_careers');
			if(count($business['data']['news_coverage']) >= 1) array_push($routes,'activities');
			if(count($business['data']['gallery']) >= 1) array_push($routes,'gallery');
			if(count($products['data']) >= 1) {
				$productsArr = array();
				foreach($products['data'] as $product){
					$subKey = 'product/'.$product['id'];
					$productsArr[$subKey] = $product['product_service_name'];
				}
				array_push($routes,array('products' => $productsArr));
			}
			if(count($services['data']) >= 1) {
				$servicesArr = array();
				foreach($services['data'] as $service){
					$subKey = 'service/'.$service['id'];
					$servicesArr[$subKey] = $service['product_service_name'];
				}
				array_push($routes,array('services' => $servicesArr));
			}
			//echo implode("/",$routes[7]);
			
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $routes;
//			array("",'home', 'about', 'products','product/26', 'services', 'service/23', 'contact', 'careers', 'testimonials', 'activities');
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = 'Error: ' .$e->getMessage();
            $response["data"] = null;
		}
		return $response;
	}
}
?>
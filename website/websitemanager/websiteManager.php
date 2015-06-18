<?php

class websiteManager{
	private $domain;
	private $db;
	private $config;
	private $tempDetails;
	private $routes;
	private $business;
	private $twig;
	private $modules;
	private $seo;
	
	
	function __construct(){
		$this->domain = $_SERVER['SERVER_NAME'];
		$this->db = new dbHelper;
		$this->config["rootTempPath"] = $_SERVER['DOCUMENT_ROOT']."/website/templates/";
		$this->config['httpTempPath'] = "http://".$_SERVER['SERVER_NAME']."/website/templates/";
	}
	
	function getTemplate($page, $response){
		// assign template category & name
		$templateCategory = ($response['data']['template_category']) ? $response['data']['template_category'] : "default";
		$templateFolder = ($response['data']['template_name']) ? $response['data']['template_name'] : "default";
		
		// set template base path
		$response["templatePath"] = $templateCategory."/".$templateFolder."/";
		
		// apply menus to template
		$response["routes"] = $response["data"]['website_config']['menus'];
		
		
		// set assets path for css, js, images etc
		$response["path"] = $this->config['httpTempPath'].$response["templatePath"];
		
		// set current uri
		if(!isset($response["uri"])){
			$response["uri"] = ($page == "home") ? "/" : '/'.$page;
		}
			
		// load index.html
		$templateIndex = $response["templatePath"]."/index.html";
		
		// set modules
		if(count($this->modules) >= 1){
			$response["modules"] = $this->modules;
		}
		
		// set modules
		if(count($this->seo) >= 1){
			$response["seo"] = $this->seo;
		}

		// set twig loader
		$loader = new Twig_Loader_Filesystem($this->config['rootTempPath']);
		$this->twig = new Twig_Environment($loader);
		$template = $this->twig->loadTemplate($templateIndex);
		
		// this will dynamic with checking template folder and default folder for template page
		if(file_exists($this->config['rootTempPath']."/".$templateCategory."/".$templateFolder."/".$page.".html")){
			$response["contentPath"] = $templateCategory."/".$templateFolder."/".$page.".html";
		}else{
			$response["contentPath"] = "default/default/".$page.".html";
		}
		
		return $template->display($response);
	}
	function setModules($routes){
		foreach($routes as $key => $value){
			if($_SERVER['REQUEST_URI'] === $value["url"]){
				if(isset($value["modules"])){
					$this->modules = $value["modules"];
					
				}
				//$this->seo = $value["seo"];
				
			}else if(strlen($_SERVER['REQUEST_URI']) >= 2 && strpos($_SERVER['REQUEST_URI'], $value["url"]) !== false){
				if(isset($value["modules"])){
					$this->modules = $value["modules"];
					//$this->seo = $value["seo"];
				}
			}
		}
	}
	function getConfigData($businessTable = null){
		try{
			// main website table
			$table = 'website';
			$where['domain_name'] = $this->domain;
			$website = $this->db->setTable($table);
			$this->db->setWhere($where, $website);
			$this->db->setColumns($website, array("status" => "website_status", "expired" => "expired", "domain_name" => "domain_name", "config"=>"website_config", "business_id" => "business_id", "user_id" => "user_id"));
			
			// template table
			$template = $this->db->setJoinString("LEFT JOIN","my_template", array("id"=>$website.".template_id"));
			$this->db->setColumns($template, array("template_name" => "template_name", "category" => "template_category","template_params" => "template_params"));
			
			// users table
			$users = $this->db->setJoinString("INNER JOIN","users", array("id"=>$website.".user_id"));
			$usersCols['name'] = "owner_name";
			$usersCols['email'] = "owner_email";
			$usersCols['address'] = "owner_address";
			$usersCols['country'] = "owner_country";
			$usersCols['state'] = "owner_state";
			$usersCols['phone'] = "owner_phone";
			$usersCols['website'] = "owner_website";
			$usersCols['fax'] = "owner_fax";
			$this->db->setColumns($users, $usersCols);
			
			if($businessTable){
				// business table
				$business = $this->db->setJoinString("INNER JOIN","business", array("id"=>$website.".business_id"));
				$this->db->setColumns($business, array("*"));
			}
			
			$result = $this->db->selectSingle();
			
			// check website status if deleted or expired or data null
			if($result['status'] == 'success' && $result['data'] != null) {
				if($result['data']['expired'] == 1){
					throw new Exception('Website is expired please renew soon!');
				}
				if($result['data']['website_status'] != 1){
					throw new Exception('Website is not activated please contact your administrator!');
				}
				if(empty($result['data']['website_config'])){
					throw new Exception('Please add website details!');
				}
				if(($result['data']['template_name']) == ""){
					throw new Exception('Please add template details!');
				}
			}else{
				throw new Exception('Website not registered!');
			}
			
			$response['status'] = "success";
			$response['message'] = "Website configuration data selected successfully!";
			$response['data'] = $result['data'];
			
			// set Modules
			$this->setModules($result['data']['website_config']['menus']);
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
		}
		return $response;
	}
	function getProducts($business_id, $type, $category = null, $featured = null){
		if($category) $category = str_replace("-", " ", $category);
		$whereProd['status'] = 1;
		$whereProd['business_id'] = $business_id;
		if($type != "all") $whereProd['type'] = $type;
		if($category && $category != "Other") $whereProd['category'] = $category;
		
		$product = $this->db->setTable('product');
		$this->db->setWhere($whereProd, $product);
		if($category == "Other"){
			$this->db->setWhere(array($product.".category IS NULL OR ".$product.".category = ''"), $product, false, true);
		}
		$this->db->setWhere($whereProd, $product);
		$this->db->setColumns($product, array("*"));
		$productData = $this->db->select();
		/* if($productData['status'] != 'success'){
			throw new Exception('Product Error: '.$productData['message']);
		} */
		return $productData["data"];
	}
	function getBusinessData($page, $title, $customPage = null){
		try{
			$businessData = $this->getConfigData(true);
			if($businessData["status"] != "success"){
				throw new Exception($configData["message"]);
			}
			
			if(isset($this->modules['contentModule']["featured_products"])){
				$response["featured_products"] = $this->getProducts($businessData['data']["id"],"all", $category = null, 1);
				//print_r($response["featured_products"] );
			}
			if(isset($this->modules['contentModule']["featured_properties"])){
				$response["featured_properties"] = $this->getProperties($businessData['data']["user_id"], $category = null, 1);
				//print_r($response["featured_properties"] );
			}
			if(isset($this->modules['contentModule']["featured_projects"])){
				$response["featured_projects"] = $this->getProjects($businessData['data']["user_id"], 1);
				//print_r($response["featured_projects"] );
			}
			
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $businessData["data"];
			$response["title"] = $title;
			if($page == "contact-us"){
				$response["google_map"] = $businessData["data"]['website_config']['google_map'];
			}
			if($customPage != null){
				$response["data"]["data"] = $businessData["data"]["custom_details"][str_replace("-", " ", $customPage)]["description"];
				$response["uri"] = '/cp/'.$customPage;
				$response["title"] = str_replace("-", " ", $customPage);
			}
            
			$response = $this->getTemplate($page, $response);
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
		}
		return $response;
	}
	
	function getProductData($page, $type, $category = null){
		try{
			$businessData = $this->getConfigData(true);
			// check website status if deleted or expired or data null
			if($businessData['status'] == 'success' && $businessData['data'] != null) {
				$response["products"] = $this->getProducts($businessData['data']["business_id"], $type, $category);
			}else{
				throw new Exception($businessData['message']);
			}
			
			// assign data to response
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $businessData["data"];
            $response["title"] = ($type == 'product') ? "Products" : "Services";
            $response["uri"] = ($type == 'product') ? "/products" : "/services";
			
			// to render template
			$response = $this->getTemplate($page, $response);
			
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			print_r($response);
		}
		return $response;
	}
	
	function getSingleProduct($page, $productId){
		try{
			$businessData = $this->getConfigData(true);
			if($businessData["status"] == "success"){
				$whereProd['id'] = $productId;
				$product = $this->db->setTable('product');
				$this->db->setWhere($whereProd, $product);
				$this->db->setColumns($product, array("*"));
				$productData = $this->db->selectSingle();
				if($productData['status'] != 'success'){
					throw new Exception('Product Error: '.$productData['message']);
				}
				$response["product"] = $productData["data"];
			}else{
				throw new Exception($businessData["message"]);
			}
			
			// assign data to response
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $businessData["data"];
			$response["uri"] = "/".$response["product"]["type"]."s";
			
			// to render template 
			$response = $this->getTemplate($page, $response);
			
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			print_r($response);
		}
		return $response;
	}
	
	function getProjects($user_id, $featured = null){
		$where['status'] = 1;
		$where['user_id'] = $user_id;
		if($featured != null) $where['featured'] = $featured;
		
		$table = $this->db->setTable('project');
		$this->db->setWhere($where, $table);
		$this->db->setColumns($table, array("*"));
		$projectData = $this->db->select();
		
		return $projectData["data"];
	}
	function getProperties($user_id, $category = null, $featured = null){
		$category = str_replace("-", " ", $category);
		$where['status'] = 1;
		$where['user_id'] = $user_id;
		if($category != null) $where['category'] = $category;
		if($featured != null) $where['featured'] = $featured;
		
		$table = $this->db->setTable('property');
		$this->db->setWhere($where, $table);
		$this->db->setColumns($table, array("*"));
		$projectData = $this->db->select();
		
		return $projectData["data"];
	}
	//to get project data
	function getProjectData($page){
		try{
			$businessData = $this->getConfigData(true);
			// check website status if deleted or expired or data null
			if($businessData['status'] == 'success' && $businessData['data'] != null) {
				$response["projects"] = $this->getProjects($businessData['data']["user_id"]);
			}else{
				throw new Exception($businessData['message']);
			}
			
			// assign data to response
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $businessData["data"];
            $response["title"] = "Projects";
            $response["uri"] = "/projects";
			
			// to render template
			$response = $this->getTemplate($page, $response);
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			print_r($response) ;
		}
		return $response;
	}
	function getSingleProject($page, $projectId, $projectPage){
		try{
			$businessData = $this->getConfigData(true);
			if($businessData["status"] == "success"){
				$whereProd['id'] = $projectId;
				$product = $this->db->setTable('project');
				$this->db->setWhere($whereProd, $product);
				$this->db->setColumns($product, array("*"));
				$productData = $this->db->selectSingle();
				if($productData['status'] != 'success'){
					throw new Exception('Project Error: '.$productData['message']);
				}
				$response["project"] = $productData["data"];
				$response["projectPage"] = $projectPage;
			}else{
				throw new Exception($businessData["message"]);
			}
			
			if(isset($_GET['homeProject'])){
				$modules = $this->modules;
				$modules['headerModule']['homeproject'] = true;
				$this->setModules($modules);
			}
			
			// assign data to response
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $businessData["data"];
			$response["uri"] = "/projects";
			$response["title"] = $response["project"]["title"];
			
			// to render template 
			$response = $this->getTemplate($page, $response);
			
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			print_r($response);
		}
		return $response;
	}
	function getSingleProperty($page, $projectId){
		try{
			$businessData = $this->getConfigData(true);
			if($businessData["status"] == "success"){
				$whereProd['id'] = $projectId;
				$property = $this->db->setTable('property');
				$this->db->setWhere($whereProd, $property);
				$this->db->setColumns($property, array("*"));
				$productData = $this->db->selectSingle();
				if($productData['status'] != 'success'){
					throw new Exception('Project Error: '.$productData['message']);
				}
				$response["property"] = $productData["data"];
			}else{
				throw new Exception($businessData["message"]);
			}
			
			// assign data to response
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $businessData["data"];
			$response["uri"] = "/properties";
			$response["title"] = $response["property"]["title"];
			
			// to render template 
			$response = $this->getTemplate($page, $response);
			
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			print_r($response);
		}
		return $response;
	}
	
	function getPropertyData($page){
		try{
			$businessData = $this->getConfigData(true);
			// check website status if deleted or expired or data null
			if($businessData['status'] == 'success' && $businessData['data'] != null) {
				$response["properties"] = $this->getProperties($businessData['data']["user_id"]);
			}else{
				throw new Exception($businessData['message']);
			}
			
			// assign data to response
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $businessData["data"];
            $response["title"] = "Properties";
            $response["uri"] = "/properties";
			
			// to render template
			$response = $this->getTemplate($page, $response);
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			print_r($response) ;
		}
		return $response;
	}
	
}
?>
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
	private $currentPage;
	private $itemsOnPage;
	
	function __construct(){
		$this->domain = $_SERVER['SERVER_NAME'];
		$this->db = new dbHelper;
		$this->config["rootTempPath"] = $_SERVER['DOCUMENT_ROOT']."/website/templates/";
		$this->config['httpTempPath'] = "http://".$_SERVER['SERVER_NAME']."/website/templates/";
		$this->currentPage = (isset($_GET['page'])) ? $_GET['page'] : 1;
		$this->itemsOnPage = 10;
	}
	
	function getTemplate($page, $response){
		//print_r($response);
		if($response['status'] == "success"){
			// assign template category & name
			$templateCategory = (isset($response['data']['template_category'])) ? $response['data']['template_category'] : "default";
			$templateFolder = (isset($response['data']['template_name'])) ? $response['data']['template_name'] : "default";
			
			// set template base path
			$response["templatePath"] = $templateCategory."/".$templateFolder."/";
			
			// apply menus to template
			$response["routes"] = $response["data"]['website_config']['menus'];
			$response["sidebar"] = $response["data"]['website_config']['sidebar'];
			
			// set assets path for css, js, images etc
			$response["path"] = $this->config['httpTempPath'].$response["templatePath"];
			
			// set current uri
			if(!isset($response["uri"])){
				$response["uri"] = ($page == "home") ? "/" : '/'.$page;
			}

			// load index.html
			
			if(file_exists($this->config['rootTempPath']."/".$response["templatePath"]."/index.html")){
				$templateIndex = $response["templatePath"]."/index.html";
			}else{
				$templateIndex = "default/default/index.html";
				$response["path"] = $this->config['httpTempPath']."default/default/";
				$response["templatePath"] = "default/default/";
			}
			
			//$templateIndex = $response["templatePath"]."/index.html";
			
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
			if(file_exists($this->config['rootTempPath']."/".$response["templatePath"]."/".$page.".html")){
				$response["contentPath"] = $response["templatePath"]."/".$page.".html";
			}else{
				$response["contentPath"] = "default/default/".$page.".html";
			}
		}else{
			// set twig loader
			$loader = new Twig_Loader_Filesystem($this->config['rootTempPath']);
			$this->twig = new Twig_Environment($loader);
			$template = $this->twig->loadTemplate("default/default/error.html");
		}
		return $template->display($response);
	}
	function setModules($routes){
		foreach($routes as $key => $value){
			if($_SERVER['REQUEST_URI'] === $value["url"]){
				if(isset($value["modules"])){
					$this->modules = $value["modules"];
					
				}
				if(isset($value["seo"])){
					$this->seo = $value["seo"];
				}
				
			}else if(strlen($_SERVER['REQUEST_URI']) >= 2 && strpos($_SERVER['REQUEST_URI'], $value["url"]) !== false){
				if(isset($value["modules"])){
					$this->modules = $value["modules"];
					if(isset($value["seo"])){
						$this->seo = $value["seo"];
					}
				}
			}
		}
	}
	function getSitemap(){
		
	}
	function getConfigData($businessTable = null){
		try{
			// main website table
			$table = 'website';
			
			$where['domain_name'] = str_replace("www.", "",$this->domain);
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
					throw new Exception('Website is expired, please renew soon!');
				}
				if($result['data']['website_status'] != 1){
					throw new Exception('Website is not activated, please contact system administrator!');
				}
				if(empty($result['data']['website_config'])){
					throw new Exception('Please add website details!');
				}
				if(($result['data']['template_name']) == ""){
					throw new Exception('Please add template details!');
				}
			}else{
				throw new Exception('Website is Under Construction!');
			}
			
			$response['status'] = "success";
			$response['message'] = "Website configuration data selected successfully!";
			$response['data'] = $result['data'];
			
			// set Modules
			$this->setModules($result['data']['website_config']['menus']);
			$businessData = $response;
			if(isset($this->modules['contentModule']["featured_products"])){
				$featured_products = $this->getProducts($businessData['data']["id"],"all", $category = null, 1);
				$response["featured_products"] = $featured_products['data'];
				//print_r($response["featured_products"] );
			}
			if(isset($this->modules['contentModule']["featured_properties"])){
				$featured_properties = $this->getProperties($businessData['data']["user_id"], $category = null, 1);
				
				$response["featured_properties"] = $featured_properties['data'];
				
				$home_properties = $this->getProperties($businessData['data']["user_id"], $category = null, $featured = null, $businessData['data']['website_config']["project_id"]);
				//print_r($response["featured_properties"] );
				$response["home_properties"] = $home_properties['data'];
				//print_r($home_properties);
			}
			if(isset($this->modules['contentModule']["featured_projects"])){
				$featured_projects = $this->getProjects($businessData['data']["user_id"], 1);
				$response["featured_projects"] = $featured_projects['data'];
				//print_r($response["featured_projects"] );
			}
			if(isset($this->modules['headerModule']["homeproject"]) && isset($businessData['data']['website_config']["project_id"])){
				$productData = $this->singleProject($businessData['data']['website_config']["project_id"]);
				$response["home_project"] = $productData["data"];
				//print_r($response["home_project"]);
			}
			
			$response["currentPage"] = $this->currentPage;
			$response["itemsOnPage"] = $this->itemsOnPage;
			
			if(isset($_GET['category'])&&isset($_GET['title'])){
				foreach($_GET as $key=>$value){
					$response[$key]=$value;
				}
			}
			
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			//print_r($response);
		}
		return $response;
	}
	function getProducts($business_id, $type, $category = null, $featured = null){
		if($category) $category = str_replace("-", " ", $category);
		$whereProd['status'] = 1;
		$whereProd['business_id'] = $business_id;
		if($type != "all") $whereProd['type'] = $type;
		if($featured) $whereProd['featured'] = 1;
		if($category && $category != "Other") $whereProd['category'] = $category;
		
		$product = $this->db->setTable('product');
		$this->db->setWhere($whereProd, $product);
		$limit[0] = $this->currentPage;
		$limit[1] = $this->itemsOnPage;
		$this->db->setLimit($limit);
		if($category == "Other"){
			$this->db->setWhere(array($product.".category IS NULL OR ".$product.".category = ''"), $product, false, true);
		}
		$this->db->setWhere($whereProd, $product);
		$this->db->setColumns($product, array("*"));
		$productData = $this->db->select();
		/* if($productData['status'] != 'success'){
			throw new Exception('Product Error: '.$productData['message']);
		} */
		return $productData;
	}
	
	function getBusinessData($page, $title, $customPage = null){
		try{
			$businessData = $this->getConfigData(true);
			if($businessData["status"] != "success"){
				throw new Exception($businessData["message"]);
			}
			
            $response = $businessData;
			$response["title"] = $title;
			if($page == "contact-us"){
				$response["google_map"] = $businessData["data"]['website_config']['google_map'];
			}
			if($customPage != null){
				foreach($businessData["data"]["custom_details"] as $key => $value){
					if($value['heading'] == str_replace("-", " ", $customPage)){
						$response["data"]['data'] = $value['description'];
						$response["uri"] = '/cp/'.$customPage;
						$response["title"] = str_replace("-", " ", $customPage);
					}
				}
			}
            
			$response = $this->getTemplate($page, $response);
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			$response = $this->getTemplate('error', $response);
			//print_r($response);
		}
		return $response;
	}
	
	function getProductData($page, $type, $category = null){
		try{
			$businessData = $this->getConfigData(true);
			// check website status if deleted or expired or data null
			if($businessData['status'] == 'success' && $businessData['data'] != null) {
				$products = $this->getProducts($businessData['data']["business_id"], $type, $category);
				$response["products"] = $products["data"];
				$response["totalRecords"] = $products["totalRecords"];
			}else{
				throw new Exception($businessData['message']);
			}
			
			// assign data to response
			$response = array_merge($response, $businessData);
            $response["title"] = ($type == 'product') ? "Products" : "Services";
            $response["uri"] = ($type == 'product') ? "/products" : "/services";
			
			// to render template
			$response = $this->getTemplate($page, $response);
			
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			$response = $this->getTemplate('error', $response);
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
			$response = array_merge($response, $businessData);
			$response["uri"] = "/".$response["product"]["type"]."s";
			
			// to render template 
			$response = $this->getTemplate($page, $response);
			
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			$response = $this->getTemplate('error', $response);
		}
		return $response;
	}
	
	function getProjects($user_id, $featured = null){
		$where['status'] = 1;
		$where['user_id'] = $user_id;
		if($featured != null) $where['featured'] = $featured;
		
		$table = $this->db->setTable('project');
		$this->db->setWhere($where, $table);
		$limit[0] = $this->currentPage;
		$limit[1] = $this->itemsOnPage;
		$this->db->setLimit($limit);
		$this->db->setColumns($table, array("*"));
		$projectData = $this->db->select();
		
		return $projectData;
	}
	function getProperties($user_id, $search = array(), $featured = null, $project_id = null){
		//$category = str_replace("-", " ", $category);
		$where['status'] = 1;
		$where['user_id'] = $user_id;
		if(isset($_GET['project_id'])){
			$where['project_id'] = $_GET['project_id'];
		}
		if($project_id != null){
			$where['project_id'] = $project_id;
		}
		if($featured != null) $where['featured'] = $featured;
		$like = $search;
		$table = $this->db->setTable('property');
		$this->db->setWhere($where, $table);
		$this->db->setWhere($like, $table, true);
		$limit[0] = $this->currentPage;
		$limit[1] = $this->itemsOnPage;
		$this->db->setLimit($limit);
		$this->db->setColumns($table, array("*"));
		$projectData = $this->db->select();
		
		return $projectData;
	}
	//to get project data
	function getProjectData($page){
		try{
			$businessData = $this->getConfigData(true);
			// check website status if deleted or expired or data null
			if($businessData['status'] == 'success' && $businessData['data'] != null) {
				$projects = $this->getProjects($businessData['data']["user_id"]);
				$response["projects"] = $projects['data'];
				$response["totalRecords"] = $projects["totalRecords"];
			}else{
				throw new Exception($businessData['message']);
			}
			
			// assign data to response
            $response = array_merge($response, $businessData);
            $response["title"] = "Projects";
            $response["uri"] = "/projects";
			
			// to render template
			$response = $this->getTemplate($page, $response);
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			$response = $this->getTemplate('error', $response);
		}
		return $response;
	}
	
	function singleProject($project_id){
		$where['id'] = $project_id;
		$product = $this->db->setTable('project');
		$this->db->setWhere($where, $product);
		$this->db->setColumns($product, array("*"));
		return $productData = $this->db->selectSingle();
	}
	function getSingleProject($page, $projectId, $projectPage){
		try{
			$businessData = $this->getConfigData(true);
			if($businessData["status"] == "success"){
				$productData = $this->singleProject($projectId);
				if($productData['status'] != 'success'){
					throw new Exception('Project Error: '.$productData['message']);
				}
				$response["project"] = $productData["data"];
				$response["projectPage"] = $projectPage;
			}else{
				throw new Exception($businessData["message"]);
			}
			
			if(isset($_GET['homeProject'])){
				$response["home_project"] = $productData["data"];
				$this->modules['headerModule']['homeproject'] = true;
				$response["homeproject"] = $_GET['homeProject'];
			}
			
			// assign data to response
			$response = array_merge($response, $businessData);
			$response["uri"] = "/projects";
			$response["title"] = $response["project"]["title"];
			
			// to render template 
			$response = $this->getTemplate($page, $response);
			
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			$response = $this->getTemplate('error', $response);
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
			$response = array_merge($response, $businessData);
			$response["uri"] = "/properties";
			$response["title"] = $response["property"]["title"];
			
			// to render template 
			$response = $this->getTemplate($page, $response);
			
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			$response = $this->getTemplate('error', $response);
		}
		return $response;
	}
	
	function getPropertyData($page, $category = null){
		try{
			$businessData = $this->getConfigData(true);
			$search = array();
			if(isset($_GET['property_for'])){
				$search['property_for'] = $_GET['property_for'];
				$search['category'] = $_GET['category'];
				$search['city'] = $_GET['city'];
			}
			
			if($businessData['status'] == 'success' && $businessData['data'] != null) {
				$properties = $this->getProperties($businessData['data']["user_id"],$search);
				$response["properties"] = $properties['data'];
				$response["totalRecords"] = $properties["totalRecords"];
			}else{
				throw new Exception($businessData['message']);
			}
			
			if(count($response["properties"]) >= 1){
				foreach($response["properties"] as $key => $value){
					$categories[] = $value["category"];
					if($value["category"] == $category){
						$newProperty[] = $value;
					}
				}
				if(isset($newProperty)){
					if(count($newProperty) >=1 ){
						$response["properties"] = $newProperty;
						$response["totalRecords"] = count($newProperty);
					}
				}
				if(!isset($_GET['property_for'])){
					$response["prop_category"] = array_unique($categories);
				}
			}
			
			// assign data to response
			$response = array_merge($response, $businessData);
            $response["title"] = "Properties";
            $response["uri"] = "/properties";
			
			// to render template
			$response = $this->getTemplate($page, $response);
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			$response = $this->getTemplate('error', $response);
		}
		return $response;
	}
	
}
?>
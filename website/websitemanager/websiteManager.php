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
		$this->config["rootTempPath"] = $_SERVER['DOCUMENT_ROOT']."/website/templates/";
		$this->config['httpTempPath'] = "http://".$_SERVER['SERVER_NAME']."/website/templates/";
	}
	
	function getTemplate($templateFolder, $page, $response){
		$loader = new Twig_Loader_Filesystem($templateFolder);
		$this->twig = new Twig_Environment($loader);
		$template = $this->twig->loadTemplate($page);
		$template->display($response);
	}
	
	function getBusinessData($page, $modules, $title, $customPage = null){
		try{
			// main website table
			$table = 'website';
			$where['domain_name'] = $this->domain;
			$website = $this->db->setTable($table);
			$this->db->setWhere($where, $website);
			$this->db->setColumns($website, array("status" => "website_status", "expired" => "expired", "domain_name" => "domain_name", "config"=>"website_config"));
			
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
			
			// business table
			$business = $this->db->setJoinString("INNER JOIN","business", array("id"=>$website.".business_id"));
			$this->db->setColumns($business, array("*"));
			
			// template table
			$business = $this->db->setJoinString("LEFT JOIN","my_template", array("id"=>$website.".template_id"));
			$this->db->setColumns($business, array("template_name" => "template_name", "category" => "template_category","template_params" => "template_params"));
			
			$businessData = $this->db->selectSingle();
			
			// check website status if deleted or expired or data null
			if($businessData['status'] == 'success' && $businessData['data'] != null) {
				if($businessData['data']['expired'] == 1){
					throw new Exception('Website is expired please renew soon!');
				}
				if($businessData['data']['website_status'] != 1){
					throw new Exception('Website is not activated please contact your administrator!');
				}
				if(empty($businessData['data']['website_config'])){
					throw new Exception('Please add website details!');
				}
				if(($businessData['data']['template_name']) == ""){
					throw new Exception('Please add template details!');
				}
			}else{
				throw new Exception('Website not registered!');
			}
			
			// this will be dynamic with my template table - category is template category and folder is template name
			$templateCategory = $businessData['data']['template_category'];
			$templateFolder = $businessData['data']['template_name'];
			
			// assign data to response
			$response["modules"] = $modules;
			if(isset($modules["featured_products"])){
				$response["featured_products"] = $this->getProducts($businessData['data']["id"],"product", $category = null, 1);
				
			}
			if(isset($modules["featured_services"])){
				$response["featured_services"] = $this->getProducts($businessData['data']["id"],"service", $category = null, 1);
				
			}
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $businessData["data"];
			$response["title"] = $title;
			if($customPage != null){
				$response["data"]["data"] = $businessData["data"]["custom_details"][str_replace("-", " ", $customPage)]["description"];
				
				$response["title"] = str_replace("-", " ", $customPage);
			}
            
            $response["templatePath"] = $templateCategory."/".$templateFolder."/";
			$response["path"] = $this->config['httpTempPath'].$response["templatePath"];
			$response["routes"] = $businessData["data"]['website_config']['menus'];
			$response["google_map"] = $businessData["data"]['website_config']['google_map'];
			$response["uri"] = ($page) ? "/".$page : '/home';
			
			// this will dynamic with checking template folder and default folder for template page
            $response["contentPath"] = $templateCategory."/".$templateFolder."/".$response["uri"].".html";
			
			// to render template 
			$this->getTemplate($this->config['rootTempPath'], $response["templatePath"]."/index.html", $response);
			
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			print_r($response);
		}
		
		return $response;
	}
	function getProducts($business_id, $type, $category = null, $featured = null){
		if($category) $category = str_replace("-", " ", $category);
		$whereProd['status'] = 1;
		$whereProd['business_id'] = $business_id;
		$whereProd['type'] = $type;
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
	function getProductData($page, $type, $category = null){
		try{
			// main website table
			$table = 'website';
			$where['domain_name'] = $this->domain;
			$website = $this->db->setTable($table);
			$this->db->setWhere($where, $website);
			$this->db->setColumns($website, array("status" => "website_status", "expired" => "expired", "domain_name" => "domain_name", "config"=>"website_config"));
			
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
			
			// business table
			$business = $this->db->setJoinString("INNER JOIN","business", array("id"=>$website.".business_id"));
			$this->db->setColumns($business, array("*"));
			
			// template table
			$business = $this->db->setJoinString("LEFT JOIN","my_template", array("id"=>$website.".template_id"));
			$this->db->setColumns($business, array("template_name" => "template_name", "category" => "template_category"));
			
			$businessData = $this->db->selectSingle();
			
			// check website status if deleted or expired or data null
			if($businessData['status'] == 'success' && $businessData['data'] != null) {
				if($businessData['data']['expired'] == 1){
					throw new Exception('Website is expired please renew soon!');
				}
				if($businessData['data']['website_status'] != 1){
					throw new Exception('Website is not activated please contact your administrator!');
				}
				if(empty($businessData['data']['website_config'])){
					throw new Exception('Please add website details!');
				}
				if(($businessData['data']['template_name']) == ""){
					throw new Exception('Please add template details!');
				}
				$this->getProducts($businessData['data']["id"], $type, $category);
				$response["products"] = $this->getProducts($businessData['data']["id"], $type, $category);
			}else{
				throw new Exception('Website not registered!');
			}
			
			// this will be dynamic with my template table - category is template category and folder is template name
			$templateCategory = $businessData['data']['template_category'];
			$templateFolder = $businessData['data']['template_name'];
			
			// assign data to response
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $businessData["data"];
            $response["title"] = ($type == 'product') ? "Products" : "Services";
			
            $response["templatePath"] = $templateCategory."/".$templateFolder."/";
			$response["path"] = $this->config['httpTempPath'].$response["templatePath"];
			$response["routes"] = $businessData["data"]['website_config']['menus'];
			$response["uri"] = ($page) ? "/".$type."s" : '/home';
			
			// this will dynamic with checking template folder and default folder for template page
            $response["contentPath"] = $templateCategory."/".$templateFolder."/".$page.".html";
			
			// to render template 
			$this->getTemplate($this->config['rootTempPath'], $response["templatePath"]."/index.html", $response);
			
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			print_r($response);
		}
		return $response;
	}
	
	//to get project data
	function getProjectData($page,$category = null){
		try{
			// main website table
			$table = 'website';
			$where['domain_name'] = $this->domain;
			$website = $this->db->setTable($table);
			$this->db->setWhere($where, $website);
			$this->db->setColumns($website, array("status" => "website_status", "expired" => "expired", "domain_name" => "domain_name", "config"=>"website_config"));
			
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
			
			/* // business table
			$business = $this->db->setJoinString("INNER JOIN","business", array("id"=>$website.".business_id"));
			$this->db->setColumns($business, array("*")); */
			
			// template table
			$business = $this->db->setJoinString("LEFT JOIN","my_template", array("id"=>$website.".template_id"));
			$this->db->setColumns($business, array("template_name" => "template_name", "category" => "template_category"));
			
			$project = $this->db->setJoinString("LEFT JOIN","project", array("id"=>$website.".user_id"));
			$this->db->setColumns($project, array("status" => "1", "category" => "category"));
			
			print_r $project;
			
			$projectData = $this->db->selectSingle();
			
			// check website status if deleted or expired or data null
			if($projectData['status'] == 'success' && $projectData['data'] != null) {
				if($projectData['data']['expired'] == 1){
					throw new Exception('Website is expired please renew soon!');
				}
				if($projectData['data']['website_status'] != 1){
					throw new Exception('Website is not activated please contact your administrator!');
				}
				if(empty($projectData['data']['website_config'])){
					throw new Exception('Please add website details!');
				}
				if(($projectData['data']['template_name']) == ""){
					throw new Exception('Please add template details!');
				}
				$this->getProducts($projectData['data']["id"], $type, $category);
				$response["products"] = $this->getProducts($projectData['data']["id"], $type, $category);
			}else{
				throw new Exception('Website not registered!');
			}
			
			// this will be dynamic with my template table - category is template category and folder is template name
			$templateCategory = $projectData['data']['template_category'];
			$templateFolder = $projectData['data']['template_name'];
			
			// assign data to response
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $projectData["data"];
            $response["title"] = "projects";
			print_r  $response["data"];
            $response["templatePath"] = $templateCategory."/".$templateFolder."/";
			$response["path"] = $this->config['httpTempPath'].$response["templatePath"];
			$response["routes"] = $businessData["data"]['website_config']['menus'];
			$response["uri"] = ($page) ? "/".$type."s" : '/home';
			
			// this will dynamic with checking template folder and default folder for template page
            $response["contentPath"] = $templateCategory."/".$templateFolder."/".$page.".html";
			
			// to render template 
			$this->getTemplate($this->config['rootTempPath'], $response["templatePath"]."/index.html", $response);
			
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
			// main website table
			$table = 'website';
			$where['domain_name'] = $this->domain;
			$website = $this->db->setTable($table);
			$this->db->setWhere($where, $website);
			$this->db->setColumns($website, array("status" => "website_status", "expired" => "expired", "domain_name" => "domain_name", "config"=>"website_config"));
			
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
			
			// business table
			$business = $this->db->setJoinString("INNER JOIN","business", array("id"=>$website.".business_id"));
			$this->db->setColumns($business, array("*"));
			
			// template table
			$business = $this->db->setJoinString("LEFT JOIN","my_template", array("id"=>$website.".template_id"));
			$this->db->setColumns($business, array("template_name" => "template_name", "category" => "template_category"));
			
			$businessData = $this->db->selectSingle();
			
			// check website status if deleted or expired or data null
			if($businessData['status'] == 'success' && $businessData['data'] != null) {
				if($businessData['data']['expired'] == 1){
					throw new Exception('Website is expired please renew soon!');
				}
				if($businessData['data']['website_status'] != 1){
					throw new Exception('Website is not activated please contact your administrator!');
				}
				if(empty($businessData['data']['website_config'])){
					throw new Exception('Please add website details!');
				}
				if(($businessData['data']['template_name']) == ""){
					throw new Exception('Please add template details!');
				}
				
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
				throw new Exception('Website not registered!');
			}
			
			// this will be dynamic with my template table - category is template category and folder is template name
			$templateCategory = $businessData['data']['template_category'];
			$templateFolder = $businessData['data']['template_name'];
			
			// assign data to response
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $businessData["data"];
			
            $response["templatePath"] = $templateCategory."/".$templateFolder."/";
			$response["path"] = $this->config['httpTempPath'].$response["templatePath"];
			$response["routes"] = $businessData["data"]['website_config']['menus'];
			$response["uri"] = ($page) ? "/".$page : '/home';
			
			// this will dynamic with checking template folder and default folder for template page
            $response["contentPath"] = $templateCategory."/".$templateFolder."/".$page.".html";
			
			// to render template 
			$this->getTemplate($this->config['rootTempPath'], $response["templatePath"]."/index.html", $response);
			
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			print_r($response);
		}
		return $response;
	}
}
?>
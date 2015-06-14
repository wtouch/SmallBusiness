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
	
	function getBusinessData($page){
		try{
			$table = 'website';
			$where['domain_name'] = $this->domain;
			$website = $this->db->setTable($table);
			$this->db->setWhere($where, $website);
			$this->db->setColumns($website, array("status" => "website_status", "expired" => "expired", "domain_name" => "domain_name", "config"=>"web_config"));
			
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
			
			
			if($businessData['status'] == 'success' && $businessData['data'] != null) {
				
				$config['domain_name'] = $businessData['data']['domain_name'];
				$config['user_id'] = $businessData['data']['user_id'];
				$config['expired'] = $businessData['data']['expired'];
				
				if($businessData['data']['expired'] == 1){
					throw new Exception('Website is expired please renew soon!');
				}
				if($businessData['data']['website_status'] != 1){
					throw new Exception('Website is not activated please contact your administrator!');
				}
				//print_r();
				if(empty($businessData['data']['web_config'])){
					throw new Exception('Please add website details!');
				}
			}else if($businessData['status'] != "success"){
				throw new Exception("Business DB Table Error: ".$businessData['message']);
			}else{
				throw new Exception('Website not registered!');
			}
			
			
			// this will be dynamic with my template table - category is template category and folder is template name
			$templateCategory = "educational_books";
			$templateFolder = "college";
			
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $businessData["data"];
            $response["path"] = "http://".$_SERVER['SERVER_NAME']."/website/templates/".$templateCategory."/".$templateFolder."/";
            $response["templatePath"] = $templateCategory."/".$templateFolder."/";
			$response["routes"] = $businessData["data"]['web_config']['menus'];
			$response["uri"] = ($page) ? "/".$page : '/home';
			
			// this will dynamic with checking template folder and default folder for template page
            $response["contentPath"] = $templateCategory."/".$templateFolder."/".$response["uri"].".html";
			
			// to render template 
			$template = $this->getTemplate($_SERVER['DOCUMENT_ROOT']."/website/templates/", $templateCategory."/".$templateFolder."/index.html");
			$template->display($response);
			
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			print_r($response);
		}
		
		return $response;
	}
	
	function getProductData($routes=null, $featured=null){
		try{
			
			
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
	
}
?>
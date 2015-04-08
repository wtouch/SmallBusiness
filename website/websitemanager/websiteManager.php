<?php

class websiteManager{
	private $domain;
	function getDomain(){
		return $domain = $_SERVER['SERVER_NAME'];
	}

	function getConfig(){
		try{
			$db = new dbHelper;
			$table = 'website';
			$domain = $this->getDomain();
			$where['domain_name'] = $domain;
			$dbresult = $db->selectSingle($table, $where);
			
			if($dbresult['status'] == 'success' && $dbresult['data'] != null) {
				$dbresult = $dbresult['data'];
				$config['domain_name'] = $dbresult['domain_name'];
				$config['website_id'] = $dbresult['id'];
				$config['website_config'] = json_decode($dbresult['config']);
				$config['user_id'] = $dbresult['user_id'];
				$config['expired'] = $dbresult['expired'];
				if($dbresult['expired'] == 1){
					throw new Exception('Website is expired please renew soon!');
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
	function getTemplate(){
		try{
			$db = new dbHelper;
			$config = $this->getConfig();
			if($config['status'] == 'success'){
				$config = $config['data'];
			}else{
				throw new Exception($config['message']);
			}
			
			$table = "my_template";
			(property_exists ( $config['website_config'] , 'template_id')) ? $template_id = $config['website_config']->template_id : "";
			
			(isset($template_id)) ? $where["id"] = $template_id : $template_id = 0;
			
			if($template_id == 0 || !property_exists ( $config['website_config'] , 'template_id')){
				$templateDetails["template_name"] = "default";
				$templateDetails["template_folder"] = "default";
				$templateDetails["template_image"] = "default/preview.png";
				$templateDetails["template_params"] = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT'].'/website/templates/default/default/templateParams.json'),true);
				
			}else{
				$dbresult = $db->selectSingle($table, $where);
				if($dbresult['status'] == "success"){
					$templateDetails["template_name"] = $dbresult['data']['template_name'];
					$templateDetails["template_category"] = $dbresult['data']['category'];
					$templateDetails["template_image"] = json_decode($dbresult['data']['template_image'],true);
					$templateDetails["template_params"] = json_decode($dbresult['data']['template_params'],true);
				}else{
					throw new Exception("Template DB Error: ".$dbresult['message']);
				}
			}
			$response["status"] = "success";
            $response["message"] = "Template - ".$templateDetails["template_name"]." Selected!";
            $response["data"] = $templateDetails;
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			//print_r($response);
		}
		return $response;
	}
	function getBusinessData(){
		try{

			$db = new dbHelper;
			$config = $this->getConfig();
			if($config['status'] == 'success'){
				$config = $config['data'];
			}else{
				throw new Exception($config['message']);
			}
			// get data for view from product table, business table, users table, template table
			$where['id'] = $config['website_config']->business_id;
			
			$businessTable = "business";
			
			// inner join [table name][first table column name] = [second table column name]
			$innerJoin['users']['user_id'] = "id";
			
			$selectInnerJoinCols['users']['user_id']['name'] = "owner_name";
			$selectInnerJoinCols['users']['user_id']['email'] = "owner_email";
			$selectInnerJoinCols['users']['user_id']['address'] = "owner_address";
			$selectInnerJoinCols['users']['user_id']['country'] = "owner_country";
			$selectInnerJoinCols['users']['user_id']['state'] = "owner_state";
			$selectInnerJoinCols['users']['user_id']['phone'] = "owner_phone";
			$selectInnerJoinCols['users']['user_id']['website'] = "owner_website";
			$selectInnerJoinCols['users']['user_id']['fax'] = "owner_fax";
			
			$businessData = $db->selectSingleJoin($businessTable, $where, $innerJoin, $selectInnerJoinCols, $leftJoin = null, $selectLeftJoinCols = null);
			$bizData = array();
			if($businessData['status'] != "success"){
				throw new Exception("Business DB Table Error: ".$dbresult['message']);
			}else{
				foreach ($businessData['data'] as $key => $value){
					$bizData[$key] = (substr($value,0,1) !== "{") ? $value : json_decode($value, true);
				}
			}
			
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $bizData;
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
		}
		return $response;
	}
	
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
			$db = new dbHelper;
			$config = $this->getConfig();
			if($config['status'] == 'success'){
				$config = $config['data'];
			}else{
				throw new Exception($config['message']);
			}
			// get data for view from product table, business table, users table, template table
			if($id != null) $whereProd['id'] = $id;
			if($featured != null) $whereProd['featured'] = $featured;
			if(isset($productType)) $whereProd['type'] = $productType;
			$whereProd['business_id'] = $config['website_config']->business_id;
			$whereProd['user_id'] = $config['user_id'];
			
			$productTable = "product";
			// inner join [table name][first table column name] = [second table column name]
			$innerJoinProd['business']['business_id'] = "id";
			
			// inner join select column [table name][join col name][column to select] = column alias
			$selectInnerJoinColsProd['business']['business_id']['business_name'] = "business_name";
			
			$productDbData = $db->selectJoin($productTable, $whereProd, $limit=null, $likeFilter=null, $innerJoinProd, $selectInnerJoinColsProd, $leftJoin = null, $selectLeftJoinCols = null);
			
			if($productDbData['status'] != "success"){
				throw new Exception("Product DB Table Error: ".$productDbData['message']);
			}
			
			
			$productData = array();
			
			if($productDbData['status'] == "success" && $productDbData['data'] != ""){
				foreach ($productDbData['data'] as $index => $dataArr){
					//$serviceData[$index] = $dataArr;
						foreach($dataArr as $key => $value){
							$DataArray[$key] = (substr($value,0,1) !== "{") ? $value : json_decode($value, true);
						}
						array_push($productData,$DataArray);
				}
			}
			if(count($productData) <= 1 && $id != null) $productData = $productData[0];
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $productData;
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
				$business = $this->getProductData($routes);
				if($business['status'] != "success") {
					throw new Exception($business['message']);
				}
				$data['business'] = $business['data'];
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
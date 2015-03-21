<?php

class websiteManager{
	private $domain;
	private function getDomain(){
		return $domain = $_SERVER['SERVER_NAME'];
	}

	public function getConfig(){
		$db = new dbHelper;
		$table = 'website';
		$domain = websiteManager::getDomain();
		$where['domain_name'] = $domain;
		$dbresult = $db->selectSingle($table, $where)['data'];
		$config['domain_name'] = $dbresult['domain_name'];
		$config['website_id'] = $dbresult['id'];
		$config['website_config'] = json_decode($dbresult['config']);
		$config['user_id'] = $dbresult['user_id'];
		$config['expired'] = $dbresult['expired'];
		return $config;
	}
	public function getTemplate(){
		$db = new dbHelper;
		$config = websiteManager::getConfig();
		$table = "template";
		$template_id = $config['website_config']->template_id;
		$where["id"] = $template_id;
		if($template_id == 0){
			$templateDetails["template_folder"] = "default";
			$templateDetails["template_image"] = "default/preview.png";
		}else{
			$dbresult = $db->selectSingle($table, $where);
			
			if($dbresult['status'] == "success"){
				$templateDetails["template_folder"] = $dbresult['data']['category'];
				$templateDetails["template_image"] = $dbresult['data']['template_image'];
			}else{
				$templateDetails['error'] = $dbresult['message'];
			}
		}
		return $templateDetails;
	}
	public function getData(){
		$db = new dbHelper;
		$config = websiteManager::getConfig();
		// get data for view from product table, business table, users table, template table
		$where['id'] = $config['website_config']->business_id;
		$whereProd['business_id'] = $config['website_config']->business_id;
		$whereProd['user_id'] = $config['user_id'];
		
		$businessTable = "business";
		$productTable = "product";
		// inner join [table name][first table column name] = [second table column name]
		$innerJoinProd['business']['business_id'] = "id";
		$innerJoin['users']['user_id'] = "id";
		
		// inner join select column [table name][join col name][column to select] = column alias
		$selectInnerJoinColsProd['business']['business_id']['business_name'] = "business_name";
		
		$selectInnerJoinCols['users']['user_id']['name'] = "owner_name";
		$selectInnerJoinCols['users']['user_id']['email'] = "owner_email";
		$selectInnerJoinCols['users']['user_id']['address'] = "owner_address";
		$selectInnerJoinCols['users']['user_id']['country'] = "owner_country";
		$selectInnerJoinCols['users']['user_id']['state'] = "owner_state";
		$selectInnerJoinCols['users']['user_id']['phone'] = "owner_phone";
		$selectInnerJoinCols['users']['user_id']['website'] = "owner_website";
		$selectInnerJoinCols['users']['user_id']['fax'] = "owner_fax";
		
		$productDbData = $db->selectJoin($productTable, $whereProd, $limit=null, $likeFilter=null, $innerJoinProd, $selectInnerJoinColsProd, $leftJoin = null, $selectLeftJoinCols = null);
		
		$businessData = $db->selectSingleJoin($businessTable, $where, $innerJoin, $selectInnerJoinCols, $leftJoin = null, $selectLeftJoinCols = null);
		$serviceData = [];
		$productData = [];
		
		if($productDbData['status'] == "success"){
			foreach ($productDbData['data'] as $index => $dataArr){
				//$serviceData[$index] = $dataArr;
				if($dataArr['type'] == 'service' ){
					foreach($dataArr as $key => $value){
						$DataArray[$key] = (is_array($value)||is_object($value)) ? $value : json_decode($value);
					}
					array_push($serviceData,$DataArray);
				}
				if($dataArr['type'] == 'product' ){
					foreach($dataArr as $key => $value){
						$DataArray[$key] = (is_array($value)||is_object($value)) ? $value : json_decode($value);
					}
					array_push($productData,$DataArray);
				}
			}
		}
		if($businessData['status'] == "success"){
			foreach ($businessData['data'] as $key => $value){
				$bizData[$key] = (is_array($value)||is_object($value)) ? $value : json_decode($value);
			}
		}
		$data['business'] = $bizData;
		$data['products'] = $productData;
		$data['services'] = $serviceData;
		return $data;
	}
	
	public function getRoutes(){
		return ['home', 'about', 'products', 'services', 'contact', 'careers', 'testimonials', 'activities'];
	}
}
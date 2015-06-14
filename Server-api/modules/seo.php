<?php
	require_once 'db/dbHelper.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	
	//getMethod
	if($reqMethod=="GET"){
		
		$like = array();
		$userId = 0;
		$limit[0] = $pageNo;
		$limit[1] = $records;
		$where = array();
		$whereProd['status'] = 1;
		if(isset($_GET['user_id'])) $userId = $_GET['user_id'];
		
		(isset($_GET['status'])) ? $where['status'] = $_GET['status'] : 1;
		if(isset($_GET['business_id'])) $where['id'] = $_GET['business_id'];
		
		$userCols['name'] = "name";
		$userCols['username'] = "username";
		$user = $db->getUsers($userId,$userCols);
		
		$db->setLimit($limit);
		$business = $db->setJoinString("INNER JOIN", "business", array("user_id"=>$user.".id"));
		$db->setWhere($where, $business);
		$businessCols[0] = "*";
		$db->setColumns($business, $businessCols);
		
		$product = $db->setJoinString("LEFT JOIN", "product", array("business_id"=>$business.".id"));
		$db->setWhere($whereProd, $product);
		$productCols = array("id" => "product_id", "product_service_name" => "product_name", "type" => "product_type", "product_image" => "product_image", "description" => "product_description", "category" => "product_category");
		$db->setColumns($product, $productCols);
		
		$data = $db->select();
		
		$home = array("name" => "Home", "url" => "/home", "status" => "1");
		$about = array("name" => "About Us", "url" => "/about-us", "status" => "1");
		$contact = array("name" => "Contact Us", "url" => "/contact-us", "status" => "1");
		
		$menus = array($home, $about, $contact);
		
		if($data['status'] == "success"){
			if($data['data'][0]['testimonials']) $menus[] = array("name" => "Testimonials", "url" => "/testimonials", "status" => "1");
				
			if($data['data'][0]['job_careers']) $menus[] = array("name" => "Jobs/Careers", "url" => "/job-careers", "status" => "1");
			
			if($data['data'][0]['news_coverage']) $menus[] = array("name" => "Activities", "url" => "/activities", "status" => "1"); 
			$productCategory = array();
			$serviceCategory = array();
			foreach($data['data'] as $key => $value){
				if($value['product_type'] == "product"){
					$productCategory[$value['product_category']][] = array("name" => $value['product_name'], "url" => "/products/".$value['product_name']."/".$value['product_id'], "status" => "1");
				}
				if($value['product_type'] == "service"){
					$serviceCategory[$value['product_category']][] = array("name" => $value['product_name'], "url" => "/services/".$value['product_name']."/".$value['product_id'], "status" => "1");
				}
				
			}
			$productMenus = array();
			$serviceMenus = array();
			if(count($productCategory) >=1 ){
				foreach($productCategory as $key => $value){
					$productMenus[] = array("name" => ($key) ? $key : 'Other', "url" => "/products/".str_replace(" ", "-",($key) ? $key : 'Other'), "status" => "1", "childMenu" => $value);
				}
			}
			if(count($serviceCategory) >=1 ){
				foreach($serviceCategory as $key => $value){
					$serviceMenus[] = array("name" => ($key) ? $key : 'Other', "url" => "/services/".str_replace(" ", "-",($key) ? $key : 'Other'), "status" => "1", "childMenu" => $value);
				}
			}
			
			if(count($productMenus) >=1 || count($serviceMenus) >=1){
				
				if(count($productMenus) >=1) $menus[] = array("name" => "Products", "url" => "/products", "status" => "1", "childMenu" => $productMenus );
				
				if(count($serviceMenus) >=1) $menus[] = array("name" => "Services", "url" => "/services", "status" => "1", "childMenu" => $serviceMenus );
			}
			
		}
		
		$response["status"] = "success";
		$response["message"] = "Menus selected!";
		$response["data"] = $menus;
		echo json_encode($response);
	}
	
	if($reqMethod == "PUT" || $reqMethod == "DELETE"){
		$where['id'] = $id; // need where clause to update/delete record
		$update = $db->update("website", $body, $where);
		echo json_encode($update);
	}
 ?>
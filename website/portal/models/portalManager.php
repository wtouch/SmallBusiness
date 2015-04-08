<?php

class portalManager{
	private $domain;
	
	function getBusinessData(){
		try{
			$db = new dbHelper;
			// page limit
			$limit['pageNo'] = 1; // from which record to select
			$limit['records'] = 100; // how many records to select
			$where['status'] = 1;
			$data = $db->select('business',$where);
			
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $productData;
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = 'Error: ' .$e->getMessage();
            $response["data"] = null;
		}
		
		return json_encode($data);
		
	}
}
?>
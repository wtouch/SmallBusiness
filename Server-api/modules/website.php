<?php
	require_once 'db/dbHelper.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	
	//getMethod
	if($reqMethod=="GET"){
		if(isset($id)){
			$where['id'] = $id;
			$data = $db->selectSingle("website", $where);
			echo json_encode($data);
			
		}else{
			//this is for search
			 $like = array();
			 if(isset($_GET['search']) && $_GET['search'] == true){
				 (isset($_GET['domain_name'])) ? $like['domain_name'] = $_GET['domain_name'] : "";
			 }
			$where=array(); // this will used for user specific data selection.
			$limit['pageNo'] = $pageNo; // from which record to select
			$limit['records'] = $records; // how many records to select
			
			((isset($_GET['user_id'])) && ($_GET['user_id']!=="")) ? $where['user_id'] = $_GET['user_id'] : "";
			((isset($_GET['validity'])) && ($_GET['validity']!=="")) ? $where['validity'] = $_GET['validity'] : "";
			((isset($_GET['expired'])) && ($_GET['expired']!=="")) ? $where['expired'] = $_GET['expired'] : "";
			(isset($_GET['status'])) ? $where['status'] = $_GET['status'] : "";
			
			// this is used to select data with LIMIT & where clause
			$data = $db->select("website", $where, $limit,$like);
			
			// this is used to count totalRecords with only where clause
			$tootalDbRecords = $db->select("website", $where, null, $like);
			$totalRecords['totalRecords'] = count($tootalDbRecords['data']);		
			
			// $data is array & $totalRecords is also array. So for final output we just merge these two arrays into $data array
			$data = array_merge($totalRecords,$data);
			echo json_encode($data);
		}
	}//end get
	
	if($reqMethod=="POST"){
		$insert = $db->insert("website", $body);
		echo json_encode($insert);
	}
	
	if($reqMethod=="PUT" || $reqMethod=="DELETE"){
		$where['id'] = $id; // need where clause to update/delete record
		$update = $db->update("website", $body, $where);
		echo json_encode($update);
	}

 ?>
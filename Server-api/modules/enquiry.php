<?php
	require_once 'db/dbHelper.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	
	//getMethod
	if($reqMethod=="GET"){
		if(isset($id)){
			$where['id'] = $id;
			$data = $db->selectSingle("enquiry", $where);
			echo json_encode($data);
			
		}else{
			$where=[]; // this will used for user specific data selection.
			 $like = [];
			 if(isset($_GET['search']) && $_GET['search'] == true){
				 
				 (isset($_GET['subject'])) ? $like['subject'] = $_GET['subject'] : "";
			 }
			
			(isset($_GET['user_id'])) ? $where['user_id'] = $_GET['user_id'] : "";
			(isset($_GET['status'])) ? $where['status'] = $_GET['status'] : "";
			(isset($_GET['read_status'])) ? $where['read_status'] = $_GET['read_status'] : "";
			
			
			$limit['pageNo'] = $pageNo; // from which record to select
			$limit['records'] = $records; // how many records to select
			
			// this is used to select data with LIMIT & where clause
			$data = $db->select("enquiry", $where, $limit,$like);
			
			// this is used to count totalRecords with only where clause
			$totalRecords['totalRecords'] = count($db->select("enquiry", $where,null, $like)['data']);	
			
			// $data is array & $totalRecords is also array. So for final output we just merge these two arrays into $data array
			$data = array_merge($totalRecords,$data);
			echo json_encode($data);
		}
	}//end get
	
	if($reqMethod=="POST"){
		$insert = $db->insert("enquiry", $body);
		echo json_encode($insert);
	}
	if($reqMethod=="PUT" || $reqMethod=="DELETE"){
		$where['id'] = $id; // need where clause to update/delete record
		$update = $db->update("enquiry", $body, $where);
		echo json_encode($update);
	}
 ?>
<?php
	require_once 'db/dbHelper.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	
	//getMethod
	if($reqMethod=="GET"){
		if(isset($id)){
			$where['id'] = $id;
			$data = $db->select("template", $where);
			echo json_encode($data);
			
		}else{
			 // This is for search
			 $like = [];
			 if(isset($_GET['search']) && $_GET['search'] == true){
				 
				 (isset($_GET['template_name'])) ? $like['template_name'] = $_GET['template_name'] : "";
			 }
			$where = []; // this will used for user specific data selection.
			$limit['pageNo'] = $pageNo; // from which record to select
			$limit['records'] = $records; // how many records to select
			
			((isset($_GET['user_id'])) && ($_GET['user_id']!=="")) ? $where['user_id'] = $_GET['user_id'] : "";
			(isset($_GET['template_type'])) ? $where['template_type'] = $_GET['template_type'] : "";
			(isset($_GET['status'])) ? $where['status'] = $_GET['status'] : "";
			(isset($_GET['development_status'])) ? $where['development_status'] = $_GET['development_status'] : "";
			(isset($_GET['category'])) ? $where['category'] = $_GET['category'] : "";
			(isset($_GET['custom'])) ? $where['custom'] = $_GET['custom'] : "";
			
			
			// this is used to select data with LIMIT & where clause with like filter
			$data = $db->select("template", $where, $limit,$like);
			
			// this is used to count totalRecords with only where clause
			$totalRecords['totalRecords'] = count($db->select("template", $where)['data']);		
			
			// $data is array & $totalRecords is also array. So for final output we just merge these two arrays into $data array
			$data = array_merge($totalRecords,$data);
			echo json_encode($data);
		}
	}//end get
	
	if($reqMethod=="POST"){
		$insert = $db->insert("template", $body);
		echo json_encode($insert);
	}
	
	if($reqMethod=="PUT" || $reqMethod=="DELETE"){
		$where['id'] = $id; // need where clause to update/delete record
		$update = $db->update("template", $body, $where);
		echo json_encode($update);
	}


 ?>
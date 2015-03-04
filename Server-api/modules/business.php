<?php
	require_once 'db/dbHelper.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	
	//getMethod
	if($reqMethod=="GET"){
		if(isset($id)){
			$where['id'] = $id;
			$data = $db->select("business", $where);
			echo json_encode($data);
			
		}else{
			$where=[]; // this will used for user specific data selection.
			$limit['pageNo'] = $pageNo; // from which record to select
			$limit['records'] = $records; // how many records to select
			
			// this is used to select data with LIMIT & where clause
			$data = $db->select("business", $where, $limit);
			
			// this is used to count totalRecords with only where clause
			$totalRecords['totalRecords'] = count($db->select("business", $where)['data']);		
			
			// $data is array & $totalRecords is also array. So for final output we just merge these two arrays into $data array
			$data = array_merge($totalRecords,$data);
			echo json_encode($data);
		}
	}//end get
	
	
	if($reqMethod=="POST"){
		$insert = $db->insert("business", $body);
		echo json_encode($insert);
	}
	
	
	if($reqMethod=="PUT" || $reqMethod=="DELETE"){
		$where['id'] = $id; // need where clause to update/delete record
		$update = $db->update("business", $body, $where);
		echo json_encode($update);
	}

 ?>
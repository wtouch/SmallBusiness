<?php
	require_once 'db/dbHelper.php';
	require_once 'uploadClass.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	
	if($reqMethod=="GET"){
		if(isset($id)){
			$where['id'] = $id;
			$data = $db->select("websites", $where);
			echo json_encode($data);
			
		}else{
			$where=array(); // this will used for user specific data selection.
			$limit['pageNo'] = $pageNo; // from which record to select
			$limit['records'] = $records; // how many records to select
			
			// this is used to select data with LIMIT & where clause
			$data = $db->select("websites", $where, $limit);
			
			// this is used to count totalRecords with only where clause
			$tootalDbRecords = $db->select("website", $where, $limit=null, $like);
			$totalRecords['totalRecords'] = count($tootalDbRecords['data']);
			
			
			// $data is array & $totalRecords is also array. So for final output we just merge these two arrays into $data array
			$data = array_merge($totalRecords,$data);
			echo json_encode($data);
		}
	}
	
	if($reqMethod=="POST"){
		$upload = new uploadClass;
		// user parameters 
		$path = (isset($_POST['path'])) ? $_POST['path'] : "uploads/general";
		$userInfo = json_decode($_POST['userinfo']);
		$user_id = ($userInfo->user_id) ? $userInfo->user_id : null;
		
		if(isset($_FILES['file']) && $user_id !== null){
			$upload->set_path($path);
			echo json_encode($upload->upload($_FILES['file']));
		}else{
			$response["status"] = "error";
			$response['message'] = 'No image found';
			$response['data'] = null;
			echoResponse(200,$response);
		}
	}
	
	if($reqMethod=="PUT" || $reqMethod=="DELETE"){
		echo "currently no need to update for media!";
		/* $table = 'media';
		$where['id'] = $id;
		$update = $db->update($table, $body, $where);
		echo json_encode($update); */
	}
 ?>
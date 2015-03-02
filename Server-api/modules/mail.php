<?php
	require_once 'db/dbHelper.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	
	if($reqMethod=="GET"){
		echo $reqMethod;
		if(isset($id)){
			$where['id'] = $id;
			$data = $db->select("mail", $where);
			echo json_encode($data);
			
		}else{
			echo $pageNo;
			echo $records;
			$where=[];
			$limit = $pageNo.",".$records;
			$data = $db->select("mail", $where, $limit);
			echo json_encode($data);
		}
	}
	
	if($reqMethod=="POST"){
		echo $reqMethod;
		echo $body;
	}
	
	if($reqMethod=="PUT" || $reqMethod=="DELETE"){
		echo $reqMethod;
		echo $body;
	}

 ?>
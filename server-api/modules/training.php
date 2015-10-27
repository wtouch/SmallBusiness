<?php
	require_once 'db/dbHelper.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	$table = "training";
	if($reqMethod=="POST"){
		$insert = $db->insert($table, $body);
		echo json_encode($insert);
	}
	 
	if($reqMethod=="PUT" || $reqMethod=="DELETE"){
		$where['id'] = $id; // need where clause to update/delete record
		$update = $db->update("training", $body, $where);
		echo json_encode($update);
	}
 ?>
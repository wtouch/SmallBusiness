<?php
	require_once 'db/dbHelper.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	
	if($reqMethod=="POST"){
		$insert = $db->insert("users", $body);
		echo json_encode($insert);
	}
	
 ?>
<?php
	require_once 'db/dbHelper.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	
	if($reqMethod=="POST"){
		echo $reqMethod;
		echo $body;
	}
 ?>
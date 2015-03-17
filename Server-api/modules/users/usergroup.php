<?php

	function userGroup($body){
		$db = new dbHelper();	
		$insert = $db->insert("user_group", $body);
		echo json_encode($insert);
	}
	/* function checkAvailability($body){
		$db = new dbHelper();
		$input = json_decode($body);
		$where['username'] = $input->username;
		
		$select = $db->select("users", $where);
		if($select['status'] === 'success' && $select['data'] >=1){
			$response["message"] = "Username not available!";
			$response["status"] = "warning";
			$response["data"] = null;
		}else{
			$response["message"] = "Username available!";
			$response["status"] = "success";
			$response["data"] = null;
		}
		echo json_encode($response);
	} */
	function editUser($body){
		$db = new dbHelper();
		$where = [];
		(isset($_GET['id'])) ? $where['id'] = $_GET['id'] : "";		
		//$insert = $db->update("users", $body);
		$insert = $db->update("user_group", $body);
		echo json_encode($insert);
		//echo json_encode($insert1);
	}
 ?>
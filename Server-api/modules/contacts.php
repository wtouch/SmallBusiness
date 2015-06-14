<?php
	require_once 'db/dbHelper.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	 
	//getMethod
	if($reqMethod=="GET"){
		$table="contacts";
		if(isset($id)){
			$where['id'] = $id;
			$t0 = $db->setTable("contacts");
			$db->setWhere($where, $t0);
			$data = $db->selectSingle();
			echo json_encode($data);
			
		}else{
			
			$like = array();
			$userId = 0;
			$limit[0] = $pageNo;
			$limit[1] = $records;
			$where = array();
			if(isset($_GET['user_id'])) $userId = $_GET['user_id'];
			
			if(isset($_GET['search']) && $_GET['search'] == true){
				(isset($_GET['name'])) ? $like['name'] = $_GET['name'] : "";
			} 
			
			(isset($_GET['status'])) ? $where['status'] = $_GET['status'] : "";
			(isset($_GET['name'])) ? $where['name'] = $_GET['name'] : "";
			
			$userCols['name'] = "name";
			$userCols['username'] = "username";
			$user = $db->getUsers($userId,$userCols);
			$db->setLimit($limit);
			$table = $db->setJoinString("INNER JOIN", "contacts", array("user_id"=>$user.".id"));
			$db->setWhere($where, $table);
			$db->setWhere($like, $table, true);
			$selectInnerJoinCols[0] = "*";
			$db->setColumns($table, $selectInnerJoinCols);
			$data = $db->select();
			echo json_encode($data);
		}
	}
	
	
	if($reqMethod=="POST"){
		$insert = $db->insert("contacts", $body);
		echo json_encode($insert);
	}
	
	if($reqMethod=="PUT" || $reqMethod=="DELETE"){
		$where['id'] = $id; // need where clause to update/delete record
		$update = $db->update("contacts", $body, $where);
		echo json_encode($update);
	}
 ?>
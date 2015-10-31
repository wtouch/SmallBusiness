<?php
	require_once 'db/dbHelper.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	$table = "training";
	if($reqMethod=="POST"){
		$insert = $db->insert($table, $body);
		echo json_encode($insert);
	}
	
	//getMethod
	if($reqMethod=="GET"){
		$table="training";
		if(isset($id)){
			$where['id'] = $id;
			$t0 = $db->setTable("training");
			$db->setWhere($where, $t0);
			$data = $db->selectSingle();
			echo json_encode($data);
			
		}else{
			
			$like = array();
			$limit[0] = $pageNo;
			$limit[1] = $records;
			$where = array();
			
			if(isset($_GET['search']) && $_GET['search'] == true){
				(isset($_GET['name'])) ? $like['name'] = $_GET['name'] : "";
			} 
			(isset($_GET['status'])) ? $where['status'] = $_GET['status'] : "";
		
			$db->setLimit($limit);
			$table = $db->setTable("training");
			$db->setWhere($where, $table);
			$db->setWhere($like, $table, true);
			$selectCols[0] = "*";
			$db->setColumns($table, $selectCols);
			$data = $db->select();
			echo json_encode($data);
		}
	}//end get
	 
	if($reqMethod=="PUT" || $reqMethod=="DELETE"){
		$where['id'] = $id; // need where clause to update/delete record
		$update = $db->update("training", $body, $where);
		echo json_encode($update);
	}
 ?>
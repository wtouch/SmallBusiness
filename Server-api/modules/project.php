<?php
	require_once 'db/dbHelper.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	
	/* if($reqMethod=="GET"){
		if(isset($id)){
			$where['id'] = $id;
			$data = $db->select("project", $where);
			echo json_encode($data);
			
		}else{
			$like = [];
			if(isset($_GET['search']) && $_GET['search'] == true){	
              
				(isset($_GET['title'])) ? $like['title'] = $_GET['title'] : "";
			}	
			$where=[]; // this will used for user specific data selection.
			((isset($_GET['user_id'])) && ($_GET['user_id']!=="")) ? $where['user_id'] = $_GET['user_id'] : "";			
			(isset($_GET['status'])) ? $where['status'] = $_GET['status'] : "";
			(isset($_GET['domain'])) ? $where['domain'] = $_GET['domain'] : "";
			(isset($_GET['featured'])) ? $where['featured'] = $_GET['featured'] : "";
			
			$limit['pageNo'] = $pageNo; // from which record to select
			$limit['records'] = $records; // how many records to select
			
			// this is used to select data with LIMIT & where clause
			$data = $db->select("project", $where, $limit,$like);
			
			// this is used to count totalRecords with only where clause
			$totalRecords['totalRecords'] = count($db->select("project", $where)['data']);		
			
			// $data is array & $totalRecords is also array. So for final output we just merge these two arrays into $data array
			$data = array_merge($totalRecords,$data);
			echo json_encode($data);
		}
	}//end getMethod
	 */
	 
	//getMethod
	if($reqMethod=="GET"){
		if(isset($id)){
			$where['id'] = $id;
			$t0 = $db->setTable($table);
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
			
			/* if(isset($_GET['search']) && $_GET['search'] == true){
				(isset($_GET['business_name'])) ? $like['business_name'] = $_GET['business_name'] : "";
			} */
			(isset($_GET['status'])) ? $where['status'] = $_GET['status'] : "";
			(isset($_GET['featured'])) ? $where['featured'] = $_GET['featured'] : "";
			(isset($_GET['domain'])) ? $where['domain'] = $_GET['domain'] : "";
			((isset($_GET['user_id'])) && ($_GET['user_id']!=="")) ? $where['user_id'] = $_GET['user_id'] : "";		
			$userCols['name'] = "name";
			$userCols['username'] = "username";
			$user = $db->getUsers($userId,$userCols);
			$db->setLimit($limit);
			$table = $db->setJoinString("INNER JOIN", "project", array("user_id"=>$user.".id"));
			$db->setWhere($where, $table);
			$db->setWhere($like, $table, true);
			$selectInnerJoinCols[0] = "*";
			$db->setColumns($table, $selectInnerJoinCols);
			$data = $db->select();
			
			echo json_encode($data);
		}
	}//end get
	
	
	if($reqMethod=="POST"){
		$insert = $db->insert("project", $body);
		
		echo json_encode($insert);
	}
	
	if($reqMethod=="PUT" || $reqMethod=="DELETE"){
		$where['id'] = $id; // need where clause to update/delete record
		$update = $db->update("project", $body, $where);
		echo json_encode($update);
	}
 ?>
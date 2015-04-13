<?php
	require_once 'db/dbHelper.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	
	$table = "business";
	//getMethod
	if($reqMethod=="GET"){
		if(isset($id)){
			$where['id'] = $id;
			$data = $db->selectSingle($table, $where);
			echo json_encode($data);
			
		}else{
			
			
			$like = array();
			if(isset($_GET['search']) && $_GET['search'] == true){
				(isset($_GET['business_name'])) ? $like['business_name'] = $_GET['business_name'] : "";
			}
			 
			// this will used for user specific data selection.
			$where=array();
			(isset($_GET['user_id'])) ? $where['user_id'] = $_GET['user_id'] : "";
			(isset($_GET['manager_id'])) ? $where['manager_id'] = $_GET['manager_id'] : "";
			(isset($_GET['salesman_id'])) ? $where['salesman_id'] = $_GET['salesman_id'] : "";
			(isset($_GET['status'])) ? $where['status'] = $_GET['status'] : "";
			(isset($_GET['featured'])) ? $where['featured'] = $_GET['featured'] : "";
			(isset($_GET['verified'])) ? $where['verified'] = $_GET['verified'] : "";
			
			$userGropus = $db->select("user_group", array());
			// inner join [table name][column name]
			$innerJoin['users']['user_id'] = "id";
			
			// left join [table name][column name]
			$leftJoin['users']['salesman_id'] = "id";
			$leftJoin['users']['manager_id'] = "id";
			
			// inner join select column [table name][join col name][column to select] = column alias
			$selectInnerJoinCols['users']['user_id']['name'] = "user_name";
			
			// left join select column [table name][join col name][column to select] = column alias
			$selectLeftJoinCols['users']['salesman_id']['name'] = "salesman";
			$selectLeftJoinCols['users']['manager_id']['name'] = "manager";
			
			// page limit
			$limit['pageNo'] = $pageNo; // from which record to select
			$limit['records'] = $records; // how many records to select
			
			// this is used to select data with LIMIT & where clause & inner/left join with join columns
			$data = $db->selectJoin($table, $where, $limit,$like, $innerJoin, $selectInnerJoinCols, $leftJoin, $selectLeftJoinCols);
			
			// this is used to count totalRecords with only where clause
			$totalDBRecords = $db->selectJoin($table, $where, $limit=null,$like, $innerJoin, $selectInnerJoinCols, $leftJoin, $selectLeftJoinCols);
			
			$totalRecords['totalRecords'] = count($totalDBRecords['data']);		
			
			// $data is array & $totalRecords is also array. So for final output we just merge these two arrays into $data array
			$data = array_merge($totalRecords,$data);
			echo json_encode($data);
		}
	}//end get
	
	
	if($reqMethod=="POST"){
		$insert = $db->insert($table, $body);
		echo json_encode($insert);
	}
	
	
	if($reqMethod=="PUT" || $reqMethod=="DELETE"){
		$where['id'] = $id; // need where clause to update/delete record
		$update = $db->update($table, $body, $where);
		echo json_encode($update);
	}

 ?>
<?php
	require_once 'db/dbHelper.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	
	//getMethod
	if($reqMethod=="GET"){
		if(isset($id)){
			$where['id'] = $id;
			$data = $db->select("business", $where);
			echo json_encode($data);
			
		}else{
			$table = "business";
			
			// this will used for user specific data selection.
			$where=[];
			(isset($_GET['user_id'])) ? $where['user_id'] = $_GET['user_id'] : "";
			(isset($_GET['status'])) ? $where['status'] = $_GET['status'] : "";
			
			// inner join [table name][column name]
			$innerJoin['users']['user_id'] = "id";
			
			// left join [table name][column name]
			$leftJoin['users']['salseman_id'] = "id";
			$leftJoin['users']['manager_id'] = "id";
			
			// inner join select column [table name][join col name][column to select] = column alias
			$selectInnerJoinCols['users']['user_id']['name'] = "UserName";
			
			// left join select column [table name][join col name][column to select] = column alias
			$selectLeftJoinCols['users']['salseman_id']['name'] = "salseman";
			$selectLeftJoinCols['users']['manager_id']['name'] = "manager";  
			
			// page limit
			$limit['pageNo'] = $pageNo; // from which record to select
			$limit['records'] = $records; // how many records to select
			
			// this is used to select data with LIMIT & where clause & inner/left join with join columns
			$data = $db->selectJoin($table, $where, $limit, $innerJoin, $selectInnerJoinCols, $leftJoin, $selectLeftJoinCols);
			
			// this is used to count totalRecords with only where clause
			$totalRecords['totalRecords'] = count($db->select("business", $where)['data']);		
			
			// $data is array & $totalRecords is also array. So for final output we just merge these two arrays into $data array
			$data = array_merge($totalRecords,$data);
			echo json_encode($data);
		}
	}//end get
	
	
	if($reqMethod=="POST"){
		$insert = $db->insert("business", $body);
		echo json_encode($insert);
	}
	
	
	if($reqMethod=="PUT" || $reqMethod=="DELETE"){
		$where['id'] = $id; // need where clause to update/delete record
		$update = $db->update("business", $body, $where);
		echo json_encode($update);
	}

 ?>
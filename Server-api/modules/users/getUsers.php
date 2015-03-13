<?php
	function getMultipleUsers($limit){
		$db = new dbHelper();
		$where=[]; // this will used for user specific data selection.
			
			
			// this is used to select data with LIMIT & where clause
			$data = $db->select("users", $where, $limit);
			
			// this is used to count totalRecords with only where clause
			$totalRecords['totalRecords'] = count($db->select("users", $where)['data']);		
			
			// $data is array & $totalRecords is also array. So for final output we just merge these two arrays into $data array
			$data = array_merge($totalRecords,$data);
			echo json_encode($data);
	}
	function getSingleUser($id){
		$db = new dbHelper();
		$where['id'] = $id;
		$data = $db->selectSingle("users", $where);
		echo json_encode($data);
	}
 ?>
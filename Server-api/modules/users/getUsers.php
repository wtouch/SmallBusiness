<?php
	function getMultipleUsers($limit){
		$db = new dbHelper();
		$where=array(); // this will used for user specific data selection.
			$like = array();
			 if(isset($_GET['search']) && $_GET['search'] == true){
				 
				 (isset($_GET['username'])) ? $like['username'] = $_GET['username'] : "";
			 }
			 
			// this is used to select data with LIMIT & where clause
			$data = $db->select("users", $where, $limit,$like);
			
			// this is used to count totalRecords with only where clause
			$totalRecords['totalRecords'] = count($db->select("users", $where));		
			$totalRecords['totalRecords'] = $totalRecords['totalRecords']['data'];
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
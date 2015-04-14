<?php
	function getMultipleUsers($limit){
		$db = new dbHelper();
		$sessionObj = new session();
		$session = $sessionObj->getSession();
		$where=array(); // this will used for user specific data selection.
			$like = array();
			 if(isset($_GET['search']) && $_GET['search'] == true){
				 
				 (isset($_GET['username'])) ? $like['username'] = $_GET['username'] : "";
			 }
			if(isset($_GET['status'])) $where['status'] = $_GET['status'];
			if(isset($_GET['user_id'])) $where['user_id'] = $_GET['user_id'];
			$table = "users";
			$groupTable = "user_group";
			$groupWhere['status'] = 1;
			
			$grTbl = $db->setTable($groupTable);
			$db->setWhere($groupWhere, $grTbl);
			$groupData = $db->select();
			
			$t[0] = $db->setTable($table);
			$db->setWhere($where, $t[0]);
			$db->setWhere($like, $t[0], true);
			$db->setLimit($limit);
			$db->setColumns($t[0], array("name" => "superadmin"));
			
			//$session['group_id']
			if($groupData['status'] == "success"){
				$i = 0;
				foreach($groupData['data'] as $key => $value){
					if($i >= (count($groupData['data']) - 1)){
						 break;
					}	
					$t[$i+1] = $db->setJoinString("LEFT JOIN", "users", array("user_id"=>$t[$i].".id"));
					$JoinCols['name'] = $groupData['data'][$key+1]['group_name'];
					
					if($session['group_id'] == $value['id']){
						$db->setColumns($t[$i+1],$JoinCols);
						$joinWhere['id'] = $session['id'];
						$db->setWhere($joinWhere, $t[$i]);
						
					}else{
						$t1 = $db->setJoinString("INNER JOIN", "user_group", array("id"=>$t[$i].".group_id"));
						$db->setWhere($groupWhere, $t1);
						// inner join select column [table name][join col name][column to select] = column alias
						$selectInnerJoinCols['group_name'] = "group_name";
						$selectInnerJoinCols['config'] = "group_config";
						$selectInnerJoinCols['group_permission'] = "permission";
						$db->setColumns($t1, $selectInnerJoinCols);
						$db->setColumns($t[$i+1],array("*"));
					}
					
				
					$i++;
				}
			}
			
			
			
			
			$data = $db->select(true); // true for totalRecords
			
			if($data['status'] == "success"){
				if(isset($data['data'][0]['totalRecords'])){
					$tootalDbRecords['totalRecords'] = $data['data'][0]['totalRecords'];
					$data = array_merge($tootalDbRecords,$data);
				}
			}
			echo json_encode($data);
	}
	function getSingleUser($id){
		$db = new dbHelper();
		$where['id'] = $id;
		$t0 = $db->setTable("users");
		$db->setWhere($where, $t0);
		$data = $db->selectSingle();
		return $data;
	}
 ?>
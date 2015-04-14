<?php
	require_once 'db/dbHelper.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	
	//getMethod
	if($reqMethod=="GET"){
		try{
			$table = $_GET['table'];
			$limit[0] = 1;
			$limit[1] = 25;
			$where = array();
			$like = array();
			$groupBy = array();
			if(isset($_GET['filter'])){
				$filter = json_decode($_GET['filter'],true);
				if(count($filter) >=1){
					foreach($filter as $key => $value){
						$where[$key] = $value;
					}
				}
			}
			
			if(isset($_GET['search'])){
				$search = json_decode($_GET['search'],true);
				if(count($search) >=1){
					foreach($search as $key => $value){
						$like[$key] = $value;
						$groupBy[$key] = $key;
					}
				}
			}
			if(isset($_GET['groupBy'])){
				$groupBy = json_decode($_GET['groupBy'],true);
				if(count($groupBy) >=1){
					foreach($groupBy as $key => $value){
						$groupBy[$key] = $key;
					}
				}
			}
			//print_r($groupBy);
			$db->setGroupBy($groupBy);
			$t0 = $db->setTable($table);
			$db->setWhere($where, $t0);
			$db->setWhere($like, $t0, true);
			$db->setLimit($limit);
			if($table == 'config'){
				((isset($_GET['config_name'])) && ($_GET['config_name']!=="")) ? $where['config_name'] = $_GET['config_name'] : "";
				$db->setWhere($where, $t0);
				$data = $db->selectSingle();
			}else{
				
				$data = $db->select(false);
				
				if($data['status'] == "success"){
					if(isset($data['data'][0]['totalRecords'])){
						$tootalDbRecords['totalRecords'] = $data['data'][0]['totalRecords'];
						$data = array_merge($tootalDbRecords,$data);
					}
				}
			}
			
			if($data['status'] != "success"){
				throw new Exception($data['message']);
			}
			$response["message"] = "You are logged in successfully.";
			$response["status"] = "success";
			$response["data"] = $data['data'];
			echo json_encode($response);
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = 'Error: ' .$e->getMessage();
            $response["data"] = null;
			echo json_encode($response);
		}
	}//end get
	
	if($reqMethod=="POST"){
		$input = json_decode($body,true);
		
		$postData = array();
		foreach($input as $key => $value){
			$dbData['config_name'] = $key;
			$dbData['config_data'] = $value;
			array_push($postData,$dbData);
			print_r($dbData);
			$insert = $db->insert("config", $dbData);
			echo json_encode($insert);
		}
	}
	
	if($reqMethod=="PUT" || $reqMethod=="DELETE"){
		$where['id'] = $id; // need where clause to update/delete record
		$update = $db->update("website", $body, $where);
		echo json_encode($update);
	}

 ?>
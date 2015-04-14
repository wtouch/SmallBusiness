<?php
	require_once 'db/dbHelper.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	
	//getMethod
	if($reqMethod=="GET"){
		if(isset($id)){
			$where['id'] = $id;
			$t0 = $db->setTable("website");
			$db->setWhere($where, $t0);
			$data = $db->selectSingle();
			echo json_encode($data);
			
		}else{
			
			$like = array();
			if(isset($_GET['search']) && $_GET['search'] == true){
				 (isset($_GET['domain_name'])) ? $like['domain_name'] = $_GET['domain_name'] : "";
			}
			$where = array(); // this will used for user specific data selection.
			$limit = array($pageNo, $records);
			
			((isset($_GET['user_id'])) && ($_GET['user_id']!=="")) ? $where['user_id'] = $_GET['user_id'] : "";
			((isset($_GET['validity'])) && ($_GET['validity']!=="")) ? $where['validity'] = $_GET['validity'] : "";
			((isset($_GET['expired'])) && ($_GET['expired']!=="")) ? $where['expired'] = $_GET['expired'] : "";
			(isset($_GET['status'])) ? $where['status'] = $_GET['status'] : "";
			
			$t0 = $db->setTable("website");
			$db->setWhere($where, $t0);
			$db->setWhere($like, $t0, true);
			$db->setLimit($limit);
			
			$data = $db->select(true); // true for totalRecords
			
			if($data['status'] == "success"){
				if(isset($data['data'][0]['totalRecords'])){
					$tootalDbRecords['totalRecords'] = $data['data'][0]['totalRecords'];
					$data = array_merge($tootalDbRecords,$data);
				}
			}
			echo json_encode($data);
		}
	}//end get
	
	if($reqMethod=="POST"){
		$insert = $db->insert("website", $body);
		echo json_encode($insert);
	}
	
	if($reqMethod=="PUT" || $reqMethod=="DELETE"){
		$where['id'] = $id; // need where clause to update/delete record
		$input = json_decode($body, true);
		
		$t0 = $db->setTable("website");
		$db->setWhere($where, $t0);
		$checkNewDomain = $db->selectSingle();

		if($checkNewDomain['data']['status'] == 2) {
			$input['registered_date'] = date("Y-m-d");
			$inputValidity = (isset($input['validity'])) ? $input['validity'] : ($checkNewDomain['data']['validity'] == 0) ? 10 : $checkNewDomain['data']['validity'];
			$input['expiry_date'] = date('Y-m-d', strtotime('+'.$inputValidity.' years'));
		}
		
		$update = $db->update("website", $input, $where);
		echo json_encode($update);
	}

 ?>
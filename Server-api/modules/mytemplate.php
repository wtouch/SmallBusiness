<?php
	require_once 'db/dbHelper.php';
	require_once 'uploadClass.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	
	//getMethod
	if($reqMethod=="GET"){
		if(isset($id)){
			$where['id'] = $id;
			$data = $db->selectSingle("my_template", $where);
			echo json_encode($data);
			
		}else{
			 // This is for search
			 $like = array();
			 if(isset($_GET['search']) && $_GET['search'] == true){
				 
				 (isset($_GET['template_name'])) ? $like['template_name'] = $_GET['template_name'] : "";
			 }
			$where = array(); // this will used for user specific data selection.
			$limit['pageNo'] = $pageNo; // from which record to select
			$limit['records'] = $records; // how many records to select
			
			((isset($_GET['user_id'])) && ($_GET['user_id']!=="")) ? $where['user_id'] = $_GET['user_id'] : "";
			(isset($_GET['template_type'])) ? $where['template_type'] = $_GET['template_type'] : "";
			(isset($_GET['status'])) ? $where['status'] = $_GET['status'] : "";
		
			
			// this is used to select data with LIMIT & where clause with like filter
			$data = $db->select("my_template", $where, $limit,$like);
			
			// this is used to count totalRecords with only where clause
			$tootalDbRecords = $db->select("my_template", $where,$limit=null,$like);
			$totalRecords['totalRecords'] = count($tootalDbRecords['data']);			
			// $data is array & $totalRecords is also array. So for final output we just merge these two arrays into $data array
			$data = array_merge($totalRecords,$data);
			echo json_encode($data);
		}
	}//end get
	
	if($reqMethod=="POST"){
		if(isset($postParams) && $postParams == 'addtemplate'){
			addTemplate($body);
		}else{
			$insert = $db->insert("my_template", $body);
			echo json_encode($insert);
		}
	}
	
	if($reqMethod=="PUT" || $reqMethod=="DELETE"){
		$where['id'] = $id; // need where clause to update/delete record
		$update = $db->update("my_template", $body, $where);
		echo json_encode($update);
	}
	
	function addTemplate($body){
		try{
			$upload = new uploadClass;
			$db = new dbHelper();
			$input = json_decode($body);
			$file = $input->template_zip->file_path;
			$path_to_extract = $input->category."/".$input->template_name;
			$upload->set_path("website/templates");
			
			$insert = $db->insert("my_template", $body);
			if($insert['status'] == "success" && $insert['data'] != ""){
				$extractZip = $upload->extract_zip($file, $path_to_extract);
				if(!$extractZip){
					throw new Exception("zip not extracted!");
				}
			}else{
				throw new Exception($insert['message']);
			}
			$response = $insert;
			$response["message"] = $insert["message"]." Zip extracted in ".$path_to_extract;
			echo json_encode($response);
		}catch(Exception $e) {
			$response["status"] = "error";
            $response["message"] = 'Error: ' .$e->getMessage();
            $response["data"] = null;
			echo json_encode($response);
		}
	}

 ?>
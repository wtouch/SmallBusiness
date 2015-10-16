<?php
	require_once 'db/dbHelper.php';
	require_once 'uploadClass.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	
	if($reqMethod=="GET"){
		
		$table = $db->setTable("excel");
		//$db->setColumns($table, $selectInnerJoinCols);
		$data = $db->select();
		echo json_encode($data);
	}
	
	if($reqMethod=="POST"){
		try{
			$upload = new uploadClass;
			// user parameters 
			$path = (isset($_POST['path'])) ? $_POST['path'] : "uploads/general";
			$userData = json_decode($_POST['userInfo'], true);
			if(isset($userData['table'])){
				$table = $userData['table'] ;
			}else{
				throw new Exception('Please define table name!');
			}
			
			//print_r($path);
			if(isset($_FILES['file'])){
				$upload->set_path($path);
				$file = $upload->upload($_FILES['file']);
				$fileName = $file['data']['file_path'];
				$excelReader = PHPExcel_IOFactory::createReaderForFile($fileName);
				//the default behavior is to load all sheets
				$excelReader->setLoadAllSheets();
				$excelObj = $excelReader->load($fileName);
				//get all sheet names from the file
				$worksheetNames = $excelObj->getSheetNames($fileName);
				$return = array();
				$tableCols = array();
				$tableArr = array();
				$skippedSheets = 0;
				$skippedRows = array();
				//echo($worksheetNames[0]);
				if(count($worksheetNames) >= 1){
					foreach($worksheetNames as $key => $sheetName){
						if($key == 0){
							//echo $sheetName;
							//set the current active worksheet by name
							$excelObj->setActiveSheetIndexByName($sheetName);
							//create an assoc array with the sheet name as key and the sheet contents array as value
							$return[$sheetName] = $excelObj->getActiveSheet()->toArray(null, true,true,true);
							foreach($return[$sheetName] as $sheetRows => $sheetRowValue){
								if($sheetRows == 1){
									foreach($sheetRowValue as $sheetColumns => $sheetColumnsValues){
										//print_r($values);
										$tableCols[] = str_replace(".","_",str_replace("/","_",str_replace(" ","_",strtolower($sheetColumnsValues))));
									}
									
								}else{
									$checkData = array();
									foreach($sheetRowValue as $sheetColumns => $sheetColumnsValues){
										
										$checkData[] = $sheetColumnsValues;
									}
									if(count($checkData) <= 0){
										$skippedRows[] = $tableArr[$sheetRows];
									}else{
										array_push($tableArr, $checkData);
									}
									
								}
								//echo $sheetRows, " " ;
							}
						}else{
							$skippedSheets += 1;
							
						}							
					}
				}else{
					throw new Exception('No Sheets Found!');
				}

				$data['cols'] = $tableCols;
				$data['tableData'] = $tableArr;
				$response = [];
				$response = $db->insert($table, $data);
				($skippedSheets >= 1) ? $response["skippedSheets"] = $skippedSheets : "";
				//echo json_encode($data);
				
			}else{
				throw new Exception('No Excel Found!');
			}
			echo json_encode($response);
		}catch(Exception $e){
            $response["status"] = "error";
            $response["message"] = 'Excel Insertion Error: ' .$e->getMessage();
            $response["data"] = null;
			echo json_encode($response);
        }
	}
	 
	if($reqMethod=="PUT" || $reqMethod=="DELETE"){
		$where['id'] = $id; // need where clause to update/delete record
		$update = $db->update("excel", $body, $where);
		echo json_encode($update);
	} 
	
	/* if($reqMethod=="PUT" || $reqMethod=="DELETE"){
		$table = 'excel';
		$where['id'] = $id;
		$update = $db->update($table, $body, $where);
		echo json_encode($update);
	} 
	 */
 ?>
<?php
require_once 'modules/db/config.php'; // Database setting constants [DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD]
class dbHelper {
    private $db;
    private $err;
    function __construct() {
	
        $dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME;
        try {
            $this->db = new PDO($dsn, DB_USERNAME, DB_PASSWORD, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        } catch (PDOException $e) {
            $response["status"] = "error";
            $response["message"] = 'Connection failed: ' . $e->getMessage();
            $response["data"] = null;
            exit;
        }
    }
	
	function selectJoin($table, $where, $limit=null){
		try{
            $a = array();
            $w = "";
            foreach ($where as $key => $value) {
                $w .= " and " .$key. " like :".$key;
                $a[":".$key] = $value;
            }
			$lmt = ($limit['pageNo'] == 0 ) ? $limit['pageNo'] : $limit['pageNo'] - 1;
			$startLimit = $lmt * $limit['records']; // start on record $startLimit
			$dbLimit = ($limit===null) ? "" : " LIMIT ".$startLimit.", ".$limit['records'];
			
            $stmt = $this->db->prepare("select * from ".$table." where 1=1 ". $w ." ".$dbLimit);
            $stmt->execute($a);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
			
			/* $res = $this->db->query('SELECT COUNT(*) FROM '.$table);
			$totalRecords = $res->fetchColumn(); */
			
            if(count($rows)<=0){
                $response["status"] = "warning";
                $response["message"] = "No data found.";
				$response["data"] = null;
            }else{
				//$response['totalRecords']= $totalRecords;
				$response["message"] = count($rows)." rows selected.";
                $response["status"] = "success";
				$response["data"] = $rows;
            }
                
        }catch(PDOException $e){
            $response["status"] = "error";
            $response["message"] = 'Select Failed: ' .$e->getMessage();
            $response["data"] = null;
        }
        return $response;
	}
	
    function select($table, $where, $limit=null){
        try{
            $a = array();
            $w = "";
            foreach ($where as $key => $value) {
                $w .= " and " .$key. " like :".$key;
                $a[":".$key] = $value;
            }
			$lmt = ($limit['pageNo'] == 0 ) ? $limit['pageNo'] : $limit['pageNo'] - 1;
			$startLimit = $lmt * $limit['records']; // start on record $startLimit
			$dbLimit = ($limit===null) ? "" : " LIMIT ".$startLimit.", ".$limit['records'];
			
            $stmt = $this->db->prepare("select * from ".$table." where 1=1 ". $w ." ".$dbLimit);
            $stmt->execute($a);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
			
			/* $res = $this->db->query('SELECT COUNT(*) FROM '.$table);
			$totalRecords = $res->fetchColumn(); */
			
            if(count($rows)<=0){
                $response["status"] = "warning";
                $response["message"] = "No data found.";
				$response["data"] = null;
            }else{
				//$response['totalRecords']= $totalRecords;
				$response["message"] = count($rows)." rows selected.";
                $response["status"] = "success";
				$response["data"] = $rows;
            }
                
        }catch(PDOException $e){
            $response["status"] = "error";
            $response["message"] = 'Select Failed: ' .$e->getMessage();
            $response["data"] = null;
        }
        return $response;
    }
    function insert($table, $inputData) {

        try{
			$inputData = json_decode($inputData);
			
			$dataKey = [];
			$dataValue = [];
			foreach($inputData as $key => $val) // $inputData holds input json data
			{
				$value = (is_object($val)) ? json_encode($val) : mysql_real_escape_string($val) ;
				array_push($dataKey,$key);
				array_push($dataValue,"'".$value."'");
			}
			$colNames = implode(",",$dataKey);
			$colValues = implode(",",$dataValue);
		
		    $stmt =  $this->db->prepare("INSERT INTO $table($colNames) VALUES($colValues)");
            $stmt->execute();
            $affected_rows = $stmt->rowCount();
            $response["status"] = "success";
            $response["message"] = $affected_rows." row inserted into database";
			$response["data"] = null;
        }catch(PDOException $e){
            $response["status"] = "error";
            $response["message"] = 'Insert Failed: ' .$e->getMessage();
			$response["data"] = null;
        }
        return $response;
    }
	
    function update($table, $inputData, $where){
        
        try{
            $a = array();
            $w = "";
            foreach ($where as $key => $value) {
                $w .= " and " .$key. " = :".$key;
                $a[":".$key] = $value;
            }
            $inputData = json_decode($inputData);
			$updateTable = [];
			foreach($inputData as $key => $val) // $inputData holds input json data
			{
				$value = (is_object($val)) ? mysql_real_escape_string(json_encode($val)) : mysql_real_escape_string($val) ;
				array_push($updateTable,$key." = '".$value."'");
				
			}
			$updateFields = implode(",",$updateTable);

            $stmt =  $this->db->prepare("UPDATE $table SET $updateFields WHERE 1=1 ".$w);
            $stmt->execute($a);
            $affected_rows = $stmt->rowCount();
            if($affected_rows<=0){
                $response["status"] = "warning";
                $response["message"] = "No row updated";
				$response["data"] = null;
            }else{
                $response["status"] = "success";
                $response["message"] = $affected_rows." row(s) updated in database";
				$response["data"] = null;
            }
        }catch(PDOException $e){
            $response["status"] = "error";
            $response["message"] = "Update Failed: " .$e->getMessage();
			$response["data"] = null;
        }
        return $response;
    }
	
    function delete($table, $where){
        if(count($where)<=0){
            $response["status"] = "warning";
            $response["message"] = "Delete Failed: At least one condition is required";
			$response["data"] = null;
        }else{
            try{
                $a = array();
                $w = "";
                foreach ($where as $key => $value) {
                    $w .= " and " .$key. " = :".$key;
                    $a[":".$key] = $value;
                }
                $stmt =  $this->db->prepare("DELETE FROM $table WHERE 1=1 ".$w);
                $stmt->execute($a);
                $affected_rows = $stmt->rowCount();
                if($affected_rows<=0){
                    $response["status"] = "warning";
                    $response["message"] = "No row deleted";
					$response["data"] = null;
                }else{
                    $response["status"] = "success";
                    $response["message"] = $affected_rows." row(s) deleted from database";
					$response["data"] = null;
                }
            }catch(PDOException $e){
                $response["status"] = "error";
                $response["message"] = 'Delete Failed: ' .$e->getMessage();
				$response["data"] = null;
            }
        }
        return $response;
    }
  
}

?>

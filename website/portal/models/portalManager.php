<?php
require_once "portalDbHelper.php";
class portalManager{
	private $domain;
	private $db;
	private $config;
	function __construct($config){
		$this->db = new portalDbHelper;
		$this->config =$config;
	}
	
	function getBusinessData(){
		try{
			// page limit
			$limit['pageNo'] = 1; // from which record to select
			$limit['records'] = 100; // how many records to select
			$where['status'] = 1;
			$data = $this->db->select('business',$where);
			
			$response["status"] = "success";
            $response["message"] = "Data Selected!";
            $response["data"] = $productData;
		}catch(Exception $e){
			$response["status"] = "error";
            $response["message"] = 'Error: ' .$e->getMessage();
            $response["data"] = null;
		}
		echo json_encode($data);
	}
	function getCategories(){
		$response = array(); 
		$selectSql= mysql_query("SELECT category  FROM `keywords` GROUP BY `category` ");
		$row=mysql_fetch_assoc($selectSql)or die(mysql_error());
		while($row)
		{
			array_push($response,$row);
		}
		echo json_encode($response);	
		//write query to get types & group by category
		$response['title'] = "this is twig template";
		$response['path'] = "http://".$this->config['host']."/website/portal/views/";
		return $response;
	}
	
	function getCategoryTypes($category){
		$data = array(); //write query to get types & group by types
		if($category===Null){
			$selectSql= mysql_query("SELECT category,type  FROM `keywords` GROUP BY `category` ") or die(mysql_error());
			while($row=mysql_fetch_assoc($selectSql))
			{
				array_push($data,$row);
			}
		}else{
			$where="WHERE category= ".$category;
			$selectSql=mysql_query("SELECT category,type  FROM `keywords` GROUP BY `category` $where")or die(mysql_error());
			$data=mysql_fetch_assoc($selectSql)or die(mysql_error());
		}
		if($data['status'] == "success"){
			$response = $data['data'];
		}else{
			throw new Exception($data['message']);
		}
		print_r($data);
	}
}
?>
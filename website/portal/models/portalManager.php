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
		// query to get types & group by category
		$groupByArray['category'] = 'category';
		$this->db->setGroupBy($groupByArray);
		$where = array();
		$data = $this->db->select('keywords', $where);
		print_r($data);
		$response['title'] = "this is twig template";
		$response['path'] = "http://".$this->config['host']."/website/portal/views/";
		return $response;
	}
	
	function getCategoryTypes($category){
		
		$groupByArray['type'] = 'type';
		$this->db->setGroupBy($groupByArray);
		$where['category'] = $category;
		$data = $this->db->select('keywords', $where);
		print_r($data);
		$response['title'] = "this is twig template";
		$response['path'] = "http://".$this->config['host']."/website/portal/views/";
		return $response;
	}
}
?>
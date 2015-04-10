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
	function encodeUrl($url){
		return $url = str_replace(" ","-",$url);
	}
	function decodeUrl($url){
		return $url = str_replace("-"," ",$url);
	}
	
	function jsonDecode($data){
		if($data==null || $data==""){
			return false;
		}else{
			$arr = array();
			if(is_array($data) || is_object($data)){
				foreach($data as $key => $value){
					foreach($value as $subkey => $subvalue){
						$subarr[$subkey] = ((substr($subvalue,0,1) == "{") || (substr($subvalue,0,1) == "[")) ? json_decode($subvalue, true) : $subvalue;
					}
					$arr[$key] = $subarr;
				}
			}else{
				foreach($data as $key => $value){
					$arr[$key] = ((substr($value,0,1) == "{") || (substr($value,0,1) == "[")) ? json_decode($value, true) : $value;
				}
			}
			return $arr;
		}
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
            $response["data"] = $this->jsonDecode($data["data"]);
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
	
		$response['title'] = "this is twig template";
		$response['data'] = $this->jsonDecode($data["data"]);
		$response['path'] = "http://".$this->config['host']."/website/portal/views/";
		return $response;
	}
	
	function getCategoryTypes($category){
		$bizData=array();
		$groupByArray['type'] = 'type';
		$this->db->setGroupBy($groupByArray);
		$where['category'] = $category;
		$data = $this->db->select('keywords', $where);
		$response['title'] = "this is twig template";
		$response['data'] = $this->jsonDecode($data["data"]);
		$response['path'] = "http://".$this->config['host']."/website/portal/views/";
		return $response;
	}
	function getBusiness ($category, $type){
		$where['category'] = $category;
		$where['type'] = $type;
		$where['status'] = 1;
		$data = $this->db->select('business', $where);
		//print_r ($data);
		$response['title'] = "this is twig template";
		$response['data'] = $this->jsonDecode($data["data"]);
		$response['path'] = "http://".$this->config['host']."/website/portal/views/";
		return $response;
	}
	function getBusinessView ($category, $type, $business,$id){

		$where['type'] = $type;
		$where['status'] = 1;
		$where['category'] = $category ;
		$where['id'] = $id ;
		//print_r($where);
		$data = $this->db->select('business', $where);
		print_r ($data);
		$response['title'] = "this is twig template";
		$response['data'] = $this->jsonDecode($data["data"]);
		$response['path'] = "http://".$this->config['host']."/website/portal/views/";
		return $response;
	}
}
?>
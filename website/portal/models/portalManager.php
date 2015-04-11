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
	function getDataByKeyword($keyword){
		try{
			$where['status'] = 1;
			$like['keywords'] = $keyword;
			$data = $this->db->select('business', $where, $limit=null, $like);
			if($data['status'] != "success"){
				throw new Exception($data['message']);
			}
			$response['title'] = "this is twig template";
			$response['data'] = $this->jsonDecode($data["data"]);
			$response['path'] = "http://".$this->config['host']."/website/portal/views/";
			$response["status"] = "success";
		}catch(Exception $e){
            $response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			$response['path'] = "http://".$this->config['host']."/website/portal/views/";
        }
        return $response;
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
		$data = $this->db->select('business', $where);
		$response['title'] = "this is twig template";
		$response['data'] = $this->jsonDecode($data["data"]);
		$response['path'] = "http://".$this->config['host']."/website/portal/views/";
		return $response;
	}
}
?>
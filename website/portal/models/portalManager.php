<?php

class portalManager{
	private $domain;
	private $db;
	private $config;
	function __construct($config){
		$this->db = new dbHelper;
		$this->config = $config;
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
	
			foreach($data as $key => $value){
				if(is_array($value) || is_object($value)){
					foreach($value as $subkey => $subvalue){
						$subarr[$subkey] = ((substr($subvalue,0,1) == "{") || (substr($subvalue,0,1) == "[")) ? json_decode($subvalue, true) : $subvalue;
					}
					$arr[$key] = $subarr;
				}else{
					foreach($data as $key => $value){
						$arr[$key] = ((substr($value,0,1) == "{") || (substr($value,0,1) == "[")) ? json_decode($value, true) : $value;
					}
				}
			}
			return $arr;
		}	
	}
	function getDataByKeyword($keyword, $search = false){
		try{
			$where['status'] = 1;
			
			if(is_array($keyword)){
				foreach($keyword as $key => $value){
					$like[$key] = $value;
				}
			}else{
				$like['keywords'] = $keyword;
				//$like['business_name'] = $keyword;
			}
			
			$t0 = $this->db->setTable("business");
			
			$this->db->setWhere($where, $t0);
			$this->db->setWhere($like, $t0,true);
			
			$cols = array("*");
			$this->db->setColumns($t0, $cols);
			$data = $this->db->select();
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
	
	function getEnquiry($business, $business_id){
		try{
			$where['status'] = 1;
			$t0 = $this->db->setTable("business");
			$this->db->setWhere($where, $t0);
			$cols = array("business_name, id");
			$this->db->setColumns($t0, $cols);
			$data = $this->db->select();
		
			if($data['status'] != "success"){
				throw new Exception($data['message']);
			}
			$response['title'] = "This is Enquiry for Product";
			$response['data'] = $this->jsonDecode($data["data"]);
			$response['path'] = "http://".$this->config['host']."/website/portal/views/";
			$response["status"] = "success";
			$response["message"] = "Record Displayed successfully";
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
		try{
			$groupBy = array('category');
			$where['status'] = 1;
			
			$t0 = $this->db->setTable("business");
			$this->db->setGroupBy($groupBy);
			$this->db->setWhere($where, $t0);
			
			$cols = array("category");
			$this->db->setColumns($t0, $cols);
			
			$data = $this->db->select();
			
			if($data['status'] != "success"){
				throw new Exception($data['message']);
			}
			$response['title'] = "this is twig template";
			$response['data'] = $this->jsonDecode($data["data"]);
			$response['path'] = "http://".$this->config['host']."/website/portal/views/";
			$response["status"] = "success";
			$response["message"] = "Data List displays successfully";
		}catch(Exception $e){
            $response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			$response['path'] = "http://".$this->config['host']."/website/portal/views/";
        }
		
		return $response;
	}
	
	function getCategoryTypes($category){
		try{
			$groupBy['type'] = 'type';
			$where['category'] = $category;
			
			$t0 = $this->db->setTable("business");
			$this->db->setGroupBy($groupBy);
			$this->db->setWhere($where, $t0);
			
			$cols = array("category, type");
			$this->db->setColumns($t0, $cols);
			
			$data = $this->db->select();
			
			if($data['status'] != "success"){
				throw new Exception($data['message']);
			}
			$response["status"] = "success";
			$response["message"] = "Data Shows";
			$response['title'] = "this is twig template";
			$response['data'] = $this->jsonDecode($data["data"]);
			$response['path'] = "http://".$this->config['host']."/website/portal/views/";
		}catch(Exception $e){
           $response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			$response['path'] = "http://".$this->config['host']."/website/portal/views/";
        }
		
		return $response;
	}
	function getBusinessList ($category, $type){
		try{
			$where['category'] = $category;
			$where['type'] = $type;
			$where['status'] = 1;
			
			$t0 = $this->db->setTable("business");
			$this->db->setWhere($where, $t0);
			
			$cols = array("category, type,id,business_name,business_logo,contact_profile,country,state,city,location,area,pincode,keywords,business_info, featured, verified");
			$this->db->setColumns($t0, $cols);
		
			$data = $this->db->select();
			if($data['status'] != "success"){
				throw new Exception($data['message']);
			}
			
			$response["status"] = "success";
			$response["message"] = "Data Shows";
			$response['title'] = "this is twig template";
			$response['data'] = $this->jsonDecode($data["data"]);
			$response['path'] = "http://".$this->config['host']."/website/portal/views/";
		}catch(Exception $e){
            $response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			$response['path'] = "http://".$this->config['host']."/website/portal/views/";
        }
		
		return $response;
	}
	function getBusiness ($category, $type, $business,$id){
		try{
			$where['type'] = $type;
			$where['status'] = 1;
			$where['category'] = $category ;
			$where['id'] = $id ;
			$t0 = $this->db->setTable("business");
			$this->db->setWhere($where, $t0);
			$cols = array("*");
			$this->db->setColumns($t0, $cols);
			
			$data = $this->db->selectSingle();
			
			if($data['status'] != "success"){
				throw new Exception($data['message']);
			}
			$prodwhere['status'] = 1;
			$prodwhere['type'] = "product";
			$prodwhere['business_id'] = $id ;
						
			$t1 = $this->db->setTable("product");
			$this->db->setWhere($prodwhere, $t1);
			$this->db->setLimit(array(1,10));
			$cols = array("*");
			$this->db->setColumns($t1, $cols);
			
			$proddata = $this->db->select();
			
			$servicewhere['status'] = 1;
			$servicewhere['type'] = "service";
			$servicewhere['business_id'] = $id ;
			
			$t2 = $this->db->setTable("product");
			$this->db->setWhere($servicewhere, $t2);
			$this->db->setLimit(array(1,10));
			$cols = array("*");
			
			$this->db->setColumns($t2, $cols);
			
			$servicedata = $this->db->select();
			$response["status"] = "success";
			$response["message"] = "Data Shows";
			
			$response['title'] = "this is twig template";
			$response['data'] = $this->jsonDecode($data["data"]);
			$response['service'] = $this->jsonDecode($servicedata["data"]);	
			$response['product'] = $this->jsonDecode($proddata["data"]);
			$response['path'] = "http://".$this->config['host']."/website/portal/views/";
		
		}catch(Exception $e){
            $response["status"] = "error";
            $response["message"] = $e->getMessage();
            $response["data"] = null;
			$response['path'] = "http://".$this->config['host']."/website/portal/views/";
        }
		
		return $response;
	}
	
}
?>
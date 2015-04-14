<?php
require_once "portalDbHelper.php";
class portalManager{
	private $domain;
	private $db;
	private $config;
	function __construct($config){
		$this->db = new portalDbHelper;
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
					$like['business_name'] = $value;
				}
			}else{
				$like['keywords'] = $keyword;
				$like['business_name'] = $keyword;
			}
			
			$data = $this->db->select('business', $where, $limit=null, $like);
			$keyData = $this->db->select('business', $where, $limit=null, $like);
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
		try{
			$groupBy = array('category');
			$groupByArray['category'] = 'category';
			$groupByArray['type'] = 'type';
			$groupByArray1['type'] = 'desc';
			$where['status'] = 1;
			
			$t0 = $this->db->setTable("users");
			//$this->db->setGroupBy($groupBy);
			//$this->db->setOrderBy($groupByArray1);
			$this->db->setWhere($where, $t0);
			//$this->db->setLimit(array(1,10));
			$userCol['id'] = "id";
			$userCol['name'] = "user_name";
			$userCol['user_id'] = "user_id";
			$this->db->setColumns($t0, $userCol);
			
			$t1 = $this->db->setJoinString("LEFT JOIN", "users", array("user_id"=>$t0.".id"));
			$userCol1['name'] = "salesman";
			$userCol['user_id'] = "salesman_id";
			$this->db->setColumns($t1, $userCol1);
			$where1['id'] = 2;
			$this->db->setWhere($where1, $t1);
			
			$t2 = $this->db->setJoinString("LEFT JOIN", "users", array("user_id"=>$t1.".id"));
			$this->db->setColumns($t2, array("id"=>"customer_id"));
			
			$t3 = $this->db->setJoinString("INNER JOIN", "business", array("user_id"=>$t2.".id"));
			$this->db->setColumns($t3, array("id", "business_name", "user_id"));
			
			$this->db->setLimit(array(1,10));
			
			$data = $this->db->select('business');
			
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
		print_r($response);
		return $response;
	}
	
	function getCategoryTypes($category){
		try{
			$groupByArray['type'] = 'type';
			$this->db->setGroupBy($groupByArray);
			$where['category'] = $category;
			$data = $this->db->select('business', $where);
			if($data['status'] != "success"){
				throw new Exception($data['message']);
			}
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
			$data = $this->db->select('business', $where);
			if($data['status'] != "success"){
				throw new Exception($data['message']);
			}
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
			$data = $this->db->selectSingle('business', $where);
			if($data['status'] != "success"){
				throw new Exception($data['message']);
			}
			$prodwhere['status'] = 1;
			$prodwhere['type'] = "product";
			$prodwhere['business_id'] = $id ;
			$proddata = $this->db->select('product', $prodwhere);
			
			$servicewhere['status'] = 1;
			$servicewhere['type'] = "service";
			$servicewhere['business_id'] = $id ;
			$servicedata = $this->db->select('product', $servicewhere);
			$response['title'] = "this is twig template";
			$response['data'] = $this->jsonDecode($data["data"]);
			$response['service'] = $this->jsonDecode($servicedata["data"]);	
			$response['product'] = $this->jsonDecode($proddata["data"]);
		
			$response['path'] = "http://".$this->config['host']."/website/portal/views/";
			$response['status'] = "success";
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
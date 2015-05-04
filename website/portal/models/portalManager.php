<?php
if(!isset($_SESSION)){
	session_start();
}
class portalManager{
	private $domain;
	private $db;
	private $config;
	private $passHash;
	function __construct($config){
		$this->db = new dbHelper;
		$this->config = $config;
		$this->passHash = new passwordHash;
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
	
	function setResponse($data,$city){
		
		if(isset($data['data'])){
			$response['data'] = $data['data'];
		}else{
			$response['data'] = array();
		}
		if(isset($data['totalRecords'])){
			$response['totalRecords'] = $data['totalRecords'];
		}
		if(isset($_SESSION['username'])){
			$response['username'] = $_SESSION['name'];
			$response['login_user_id'] = $_SESSION['id'];
		}
		$response['currentPage'] = isset($_GET['page']) ? $_GET['page'] : 1;
		$response['city'] = $city;
		$response['path'] = "http://".$this->config['host']."/website/portal/views/";
		return $response;
	}
	
	
	
	function getDataByKeyword($city, $keyword, $search = false){
		try{
			$where['status'] = 1;
			$where['city'] = $city;
			if(is_array($keyword)){
				foreach($keyword as $key => $value){
					$like[$key] = $value;
				}
			}else{
				$like['keywords'] = $keyword;
			}
			
			$currentPage = isset($_GET['page']) ? $_GET['page'] : 1;
			
			$limit[0] = $currentPage;
			$limit[1] = 10;
			
			$t0 = $this->db->setTable("business");
			$this->db->setWhere($where, $t0);
			$this->db->setWhere($like, $t0,true);
			$this->db->setLimit($limit);
			$cols = array("*");
			$this->db->setColumns($t0, $cols);
			$data = $this->db->select();
			if($data['status'] != "success"){
				throw new Exception($data['message']);
			}
			$response = $this->setResponse($data, $city);
			$response["status"] = "success";
			$response["message"] = "Data List displays successfully";
		}catch(Exception $e){
            $response = $this->setResponse($data = array(),$city);
            $response["status"] = "error";
            $response["message"] = $e->getMessage();
        }
		
        return $response;
	}
	function sendEnquiry($body){
		$input = json_decode($body);
		$from['email'] = $input->from_email->from;
		$replyfrom['email'] = $input->to_email->to;
		$from['name'] = $input->name;
		$replyfrom['name'] = "ApnaSite AutoReply";
		(property_exists ($input->to_email, 'cc')) ? $ccMail = explode(",", $input->to_email->cc) : $ccMail = null;
		$recipients = explode(",", $input->to_email->to);
		$replyrecipients = explode(",", $input->from_email->from);
		$subject = $input->subject;
		$message = "<table>
				<tr>
					<td>Name: </td><td>".$from['name']."</td>
				</tr>
				<tr>
					<td>Email: </td><td>".$from['email']."</td>
				</tr>";
		if(is_object($input->message)){
			foreach($input->message as $key => $value){
				$message .= "<tr>
					<td>".$key.":</td><td>".$value."</td>
				</tr>";
			}
		}else{
			$message .= "<tr>
					<td>Message: </td><td>".$input->message."</td>
				</tr>";
		}
		
		$message .= "</table>";
		
		// Reply message mail
		$replymessage =
				
			"<h1>Thank You for your Interest! Our representative will call you shortly!</h1>";
			
		
		$replymessage .= "</table>";
		$mail = $this->db->sendMail($from, $recipients, $subject, $message, $replyTo=null, $attachments = null, $ccMail, $bccMail = null, $messageText = null);
		 if($mail['status'] == 'success'){
			$insert = $this->db->insert("enquiry", $body);
			$insert['message'] = $insert['message']." " .$mail['message'];
			$response= $insert;
		}else{
			$response = $mail;
		};
		
		// reply mail to sender
		
		$replymail = $this->db->sendMail($replyfrom, $replyrecipients, $subject, $replymessage,$replyTo=null, $attachments = null, $ccMail = null, $bccMail = null, $messageText = null);
		if($replymail['status'] == 'success'){
			$response = $replymail;
		}else{
			$response = $replymail;
		}
		
		echo json_encode($response);
	}

	function sendVerification($body){
			$input = json_decode($body);
			$smsUniqueId = rand(99,9999);
			$emailUniqueId = $this->passHash->getUniqueId();
			$mail['email'] = $input->email;
			$subject = "Verify your Account"; 
			
			/* ?ev=$this->passHash->hash($emailUniqueId)
			$this->passHash->check_password($_GET['ev'], session['ev']); */
			
			$message = "<h3>Dear User your verification code is".$smsUniqueId ." Plz Use this to login to add your business</h3>";
			$recipients = array($input->to_email) ;
			$sendmail = $this->db->sendMail($mail, $recipients, $subject, $message,$replyTo=null, $attachments = null, $ccMail = null, $bccMail = null, $messageText = null);
			print_r($sendmail);
			if($sendmail){
			$response = $sendmail;
			$response["status"] = "success";
			$response["message"] = "Data List displays successfully";
			}
			 return $response;
		}
	
	// to add business function
	function addBusiness($body){
		$insert = $this->db->insert("business", $body);
		$insert['message'] = $insert['message'];
		$response= $insert;
		echo json_encode($response);
	}
	
	function getCategories($city){
		// query to get types & group by category
		try{
			if($city==null) $city = "Pune";
			$groupBy = array('category');
			$where['status'] = 1;
			$where['city'] = $city;
				
			$t0 = $this->db->setTable("business");
			$this->db->setGroupBy($groupBy);
			$this->db->setWhere($where, $t0);
			
			$cols = array("category");
			$this->db->setColumns($t0, $cols);
			
			$t1 = $this->db->setJoinString("LEFT JOIN", "business_category", array("id"=>$t0.".category"));
			$col["category_name"] = "category_name";
			$this->db->setColumns($t1, $col);
			$data = $this->db->select();
			
			if($data['status'] != "success"){
				throw new Exception($data['message']);
			}
			$response = $this->setResponse($data,$city);
			$response["status"] = "success";
			$response["message"] = "Data List displays successfully";
			$response['title'] = "Apna Site - Create Your Website in 4 Easy Steps! or Submit your Business on ApnaSite.in";
			$response['keywords'] = "Website Creator, Website Designing, Website Developing, Business Search Portal, Google Business, Search Engine Optimization, Google Map, Business Promotion, Business Marketing, Online Marketing, Social Media Marketing";
			$response['description'] = "Apna Site provides Dynamic Website Creating Tool for Free Business Posting, Business Search, Collect Enquiry from end user and also provides updated information about all B2B and B2C Services & Products.";
		}catch(Exception $e){
            $response = $this->setResponse($data = array(),$city);
            $response["status"] = "error";
            $response["message"] = $e->getMessage();
        }
		return $response;
	}
	
	function getCategoryTypes($city,$category){
		try{
			$groupBy['type'] = 'type';
			$where['category'] = $category;
			$where['city'] = $city;
			$where['status'] = 1;
			
			$t0 = $this->db->setTable("business");
			$this->db->setGroupBy($groupBy);
			$this->db->setWhere($where, $t0);
			
			$cols = array("city,category, type");
			$this->db->setColumns($t0, $cols);
			
			$t1 = $this->db->setJoinString("LEFT JOIN", "business_category", array("id"=>$t0.".category"));
			$t2 = $this->db->setJoinString("LEFT JOIN", "business_category", array("id"=>$t0.".type"));
			$col["category_name"] = "category_name";
			$this->db->setColumns($t1, $col);
			
			$colType["category_name"] = "type_name";
			$this->db->setColumns($t2, $colType);
			
			$data = $this->db->select();
			
			if($data['status'] != "success"){
				throw new Exception($data['message']);
			}
			
			if(is_array($data['data'])){
				foreach($data['data'] as $key => $value){
					$keyword[] = $value['type_name'];
				}
				$keywords = implode(",",$keyword);
			}
			
			$response = $this->setResponse($data,$city);
			$response["status"] = "success";
			$response["message"] = "Data Shows";
			$response['title'] = $data['data'][0]['category_name']." - Apna Site!";
			$response['keywords'] = $keywords;
			$response['description'] = "Apna Site provides updated information about all B2B and B2C Services & Products under category - ".$data['data'][0]['category_name'];
		}catch(Exception $e){
			$response = $this->setResponse($data = array(),$city);
            $response["status"] = "error";
            $response["message"] = $e->getMessage();
        }
		//print_r($response);
		return $response;
	}
	function getBusinessList ($city, $category, $type){
		try{
			$where['category'] = $category;
			$where['type'] = $type;
			$where['status'] = 1;
			$where['city'] = $city;
			
			$currentPage = isset($_GET['page']) ? $_GET['page'] : 1;
			
			$limit[0] = $currentPage;
			$limit[1] = 10;
			$t0 = $this->db->setTable("business");
			$this->db->setWhere($where, $t0);
			
			$this->db->setLimit($limit);
			$cols = array("id, city,category, type,business_name,business_logo,contact_profile,country,state,city,location,area,pincode,keywords,business_info, featured, verified");
			$this->db->setColumns($t0, $cols);
			
			$t1 = $this->db->setJoinString("LEFT JOIN", "business_category", array("id"=>$t0.".category"));
			$t2 = $this->db->setJoinString("LEFT JOIN", "business_category", array("id"=>$t0.".type"));
			$col["category_name"] = "category_name";
			$this->db->setColumns($t1, $col);
			
			$colType["category_name"] = "type_name";
			$this->db->setColumns($t2, $colType);
			
			$data = $this->db->select();
			
			if($data['status'] != "success"){
				throw new Exception($data['message']);
			}
			
			if(is_array($data['data'])){
				foreach($data['data'] as $key => $value){
					$keyword[] = implode(",",$value['keywords']);
				}
				$keywords = implode(",",array_unique($keyword));
			}
			
			$response = $this->setResponse($data,$city);
			$response["status"] = "success";
			$response["currentPage"] = $currentPage;
			$response["message"] = "Data Shows";
			
			$response['title'] = $data['data'][0]['type_name']." - ".$data['data'][0]['category_name']." - Apna Site!";
			$response['keywords'] = $keywords;
			$response['description'] = "Apna Site provides updated information of listed businesses under - ".$data['data'][0]['type_name']." - ".$data['data'][0]['category_name'];
			
		}catch(Exception $e){
            $response = $this->setResponse($data = array(),$city);
            $response["status"] = "error";
            $response["message"] = $e->getMessage();
        }
		
		return $response;
	}
	function getBusiness ($city,$category, $type, $business,$id){
		try{
			$where['type'] = $type;
			$where['status'] = 1;
			$where['category'] = $category ;
			$where['city'] = $city ;
			$where['id'] = $id ;
			$t0 = $this->db->setTable("business");
			$this->db->setWhere($where, $t0);
			$cols = array("*");
			$this->db->setColumns($t0, $cols);
			
			$t1 = $this->db->setJoinString("LEFT JOIN", "website", array("business_id"=>$t0.".id"));
			
			$webcol["domain_name"] = "domain_name";
			$webcol["config"] = "config";
			$this->db->setColumns($t1, $webcol);
			
			$t2 = $this->db->setJoinString("LEFT JOIN", "business_category", array("id"=>$t0.".category"));
			$t3 = $this->db->setJoinString("LEFT JOIN", "business_category", array("id"=>$t0.".type"));
			$col["category_name"] = "category_name";
			$this->db->setColumns($t2, $col);
			
			$colType["category_name"] = "type_name";
			$this->db->setColumns($t3, $colType);
			
			$data = $this->db->selectSingle();
			
			if($data['status'] != "success"){
				throw new Exception($data['message']);
			}
			$prodwhere['status'] = 1;
			$prodwhere['type'] = "product";
			$prodwhere['business_id'] = $id ;
						
			$t1 = $this->db->setTable("product");
			$this->db->setWhere($prodwhere, $t1);
			
			$cols = array("*");
			$this->db->setColumns($t1, $cols);
			
			$proddata = $this->db->select();
			
			$servicewhere['status'] = 1;
			$servicewhere['type'] = "service";
			$servicewhere['business_id'] = $id ;
			
			$t2 = $this->db->setTable("product");
			$this->db->setWhere($servicewhere, $t2);
			
			$cols = array("*");
			
			$this->db->setColumns($t2, $cols);
			
			$servicedata = $this->db->select();
			
			if(is_array($data['data'])){
				/* foreach($data['data'] as $key => $value){
					$keyword[] = implode(",",$value['keywords']);
				} */
				$keywords = implode(",",array_unique($data['data']['keywords']));
			}
			
			$response = $this->setResponse($data,$city);
			$response["status"] = "success";
			$response["message"] = "Data Shows";
			$response['service'] = ($servicedata["data"]);	
			$response['product'] = ($proddata["data"]);
			$response['title'] = $data['data']['business_name']." | ".$data['data']['seo']['title']." | Apna Site!";
			$response['keywords'] = $keywords;
			$response['description'] = "Apna Site - ".$data['data']['seo']['title'];
		}catch(Exception $e){
			$response = $this->setResponse($data = array(),$city);
            $response["status"] = "error";
            $response["message"] = $e->getMessage();
        }
		
		return $response;
	}
		
}
?>
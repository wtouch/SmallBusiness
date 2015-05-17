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
		$url = str_replace(" ","-",$url);
		return $url;
	}
	function decodeUrl($url){
		$url = str_replace("-"," ",$url);
		$url = str_replace("'","\'",$url);
		return $url;
	}
	function getSession($getRequest){
		$sessionObj = new session();
		echo json_encode($sessionObj->getSession());
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
	
	//code to display sitemap details
	function getSitemapData(){
		try{
			$where['status'] = 1;
			$t0 = $this->db->setTable("business");
			$this->db->setWhere($where, $t0);
			$this->db->setColumns($t0, array("business_name"=>"business_name", "category"=>"category", "type"=>"type","city"=>"city","id"=>"business_id"));
			//$this->db->setGroupBy(array('type'));
			
			$data = $this->db->select();
			if($data['status'] != "success"){
				throw new Exception($data['message']);
			}
			foreach($data['data'] as $key => $value){
				$response['url'][$value['city']] = array("url" => "http://".$this->config['host'] . "/" . str_replace(' ','-',urlencode($value['city'])));
				
				$response['url'][$value['category']] = array("url" => "http://".$this->config['host'] . "/" . str_replace(' ','-',urlencode($value['city'])). "/" .str_replace(' ','-', urlencode($value['category'])));
				
				$response['url'][$value['type']] = array("url" => "http://".$this->config['host']  . "/" .str_replace(' ','-', urlencode($value['city'])). "/" .str_replace(' ','-', urlencode($value['category'])). "/" .str_replace(' ','-', urlencode($value['type'])));
				
				$response['url'][$value['business_name'].$value['business_id']] = array("url" => "http://".$this->config['host']  . "/" . str_replace(' ','-',urlencode($value['city'])). "/" . str_replace(' ','-',urlencode($value['category'])). "/" . str_replace(' ','-',urlencode($value['type'])). "/" . str_replace(' ','-',urlencode($value['business_name'])). "/" . $value['business_id']);
			}
			
			$response["status"] = "success";
			$response["message"] = "Data List displays successfully";
		}catch(Exception $e){
            $response = $this->setResponse($data = array(),$city=null);
            $response["status"] = "error";
            $response["message"] = $e->getMessage();
        }
		//print_r($response);
        return $response;
	}
	
	//code for access keywords
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
	
	//code for send user enquiry
	function sendEnquiry($body){
		try{
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
			$response["status"] = "success";
			$response["message"] = "Mail Sent successfully";
		}catch(Exception $e){
            $response = $this->setResponse($data = array(),$city=null);
            $response["status"] = "error";
            $response["message"] = $e->getMessage();
        }
		echo json_encode($response);
	}
	
	function curlCall($url){
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $url);
		//curl_setopt($curl, CURLOPT_PROXY, $proxy);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($curl, CURLOPT_HEADER, false);
		$result = curl_exec($curl);
		curl_close($curl);
		return $result;
	}
	
	function sendSms($message, $phone){
			

			$message = trim($message);
			$number = trim($phone);

			$message = urlencode($message);

			$url = 'http://sms.wtouch.in/httpapi/smsapi?uname=apnasite&password=apna@2015&sender=APNAST&receiver='.$number.'&route=T&msgtype=1&sms='.$message;

			$message_id = $this->curlCall($url);

			$url = 'http://sms.wtouch.in/httpapi/dlrapi?uname=apnasite&password=apna@2015&smsgroupid='.$message_id;
			$dlr = $this->curlCall($url);

			$xml = simplexml_load_string($dlr);
			$json = json_encode($xml);
			$array = json_decode($json,TRUE);
			$json;

			return $array['Report']['Status'];

	}
	//code for verified the mail or mobile verification code
	function verifiCode(){
		try{
			$response = $this->setResponse($data = array(),$city=null);
			echo $_SESSION['mv'];
			if(isset($_SESSION['ev']) && isset($_SESSION['mv'])){
				if(isset($_GET['mv'])){
					if($_SESSION['mv'] != $_GET['mv']){
						throw new Exception("Mobile Verification Failed. Please try again.");
					}
					$response['mobilestatus'] = "success";
					$response['data']['user_mobile'] = $_SESSION['user_mobile'];
					
				}else{
					$response['mobilestatus'] = "pending";
				}
				if(isset($_GET['ev'])){
					if($_SESSION['ev'] != $_GET['ev']){
						throw new Exception("Email Verification Failed. Please try again.");
					}
					$response['emailstatus'] = "success";
					$response['data']['user_email'] = $_SESSION['user_email'];
					$response['ev'] = $_GET['ev'];
				}else{
					$response['emailstatus'] = "pending";
				}
				
			}
			$response["status"] = "success";
			$response["message"] = "Code Verification done successfully";
		}catch(Exception $e){
            $response = $this->setResponse($data = array(),$city=null);
            $response["status"] = "error";
            $response["message"] = $e->getMessage();
        }
		return $response;
	}
	
	//code for send email verification 
	function sendVerification($body){
		try{
			$sessionObj = new session();
			$input = json_decode($body);
			$smsUniqueId = rand(99,9999);
			$emailUniqueId = $this->passHash->getUniqueId();
			$mail['email'] = trim($input->email);
			$mail['name'] = trim("Apna Site");
			$phone = $input->phone;
			$subject = "Verify your Account"; 
			
			$sessionObj->setSession(array("mv"=>$smsUniqueId, "ev"=>$emailUniqueId, "user_email"=>$input->to_email, "user_mobile"=>$phone), 60*15);
			$apppath = $_SERVER['HTTP_HOST'];
			
			$message = trim("<h3>Dear User your verification code is ".$emailUniqueId.", <a href='http://".$apppath."/verified?ev=".$emailUniqueId."'>Verify  your account</a></h3>");
			
			$smsMsg = trim("Apnasite verification code is - ".$smsUniqueId);
			$recipients = array($input->to_email);
			$sendmail = $this->db->sendMail($mail, $recipients, $subject, $message,$replyTo=null, $attachments = null, $ccMail = null, $bccMail = null, $messageText = null);
			
			if($sendmail['status'] == 'success'){
				
				//$sms = $this->sendSms($smsMsg, $phone);
				/* if($sms != "Sent"){
					throw new Exception("Verification code not sent to your Mobile! Please try again later!");
				} */
				$response = $sendmail;
			}else{
				throw new Exception("Mail Not Send Please try again");
			}
			$response["status"] = "success";
			$response["message"] = "Mail Sent successfully";
		}catch(Exception $e){
            $response = $this->setResponse($data = array(),$city=null);
            $response["status"] = "error";
            $response["message"] = $e->getMessage();
        }
		return $response;
	}
	
	// to add business function
	function addBusiness($body){
		try{
			$insert = $this->db->insert("business", $body);
			if($insert["status"] != "success"){
				throw new Exception("Your Business not added. Please try again!");
			}
			
			$response['data'] = $insert['data'];
			$response["status"] = "success";
			$response["message"] = "Your Business Added successfully";
		}catch(Exception $e){
            $response = $this->setResponse($data = array(),$city=null);
            $response["status"] = "error";
            $response["message"] = $e->getMessage();
        }
		return $response;
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
			$cols = array("id, city,category, type,business_name,business_logo,contact_profile,country,state,city,location,area,pincode,keywords,business_info, featured, verified ,user_id");
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
				$keyword =array();
				foreach($data['data'] as $key => $value){
					if($value['keywords']!=""){
						$keyword[] = implode(",",$value['keywords']);
					}
				}
				$keywords ="";
				if(!empty($keyword)){
					$keywords = implode(",",array_unique($keyword));
				}
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
			
			$keywords = $data['data']['business_name'].",".$data['data']['category_name'].",".$data['data']['type_name'];
			if(is_array($data['data'])){
				if(!empty($data['data']['keywords'])){
					$keywords = implode(",",array_unique($data['data']['keywords']));
				}
			}
			
			
			$response = $this->setResponse($data,$city);
			$response["status"] = "success";
			$response["message"] = "Data Shows";
			$response['service'] = ($servicedata["data"]);	
			$response['product'] = ($proddata["data"]);
			if($data['data']['seo'] != ""){
				$response['title'] = $data['data']['business_name']." | ".$data['data']['seo']['title']." | Apna Site!";
				$response['description'] = "Apna Site - ".$data['data']['seo']['title'];
			}else{
				$response['title'] = $data['data']['business_name']." | Apna Site!";
				$response['description'] = "Apna Site - ".$data['data']['business_name'];
			}
			$response['keywords'] = $keywords;
			
		}catch(Exception $e){
			$response = $this->setResponse($data = array(),$city);
            $response["status"] = "error";
            $response["message"] = $e->getMessage();
        }
		
		return $response;
	}
		
}
?>
<?php
	function getSession($getRequest){
		$sessionObj = new session();
		echo json_encode($sessionObj->getSession());
	}
	function doLogin($body){
		$db = new dbHelper();
		$sessionObj = new session();
		
		$input = json_decode($body);
		
		$where['username'] = $input->username;
		$limit['pageNo'] = 1; // from which record to select
		$limit['records'] = 1; // how many records to select
			
		$password = $input->password; // get password from json
		
		$data = $db->select("users", $where, $limit);
		
		// password check with hash encode
		if(passwordHash::check_password($data['data']['password'],$password)){
			$sessionObj->setSession($data['data']);
			echo json_encode($sessionObj->getSession());
			//echo "password match";
		}else{
			echo "password doesn't match";
		}
		
	}
	function forgotPass($body){
		$db = new dbHelper();
		$sessionObj = new session();
		
		$input = json_decode($body);
		
		(property_exists($input,'username')) ? $where['username'] = $input->username : "";
		(property_exists($input,'email')) ? $where['email'] = $input->email : "";
		
		$limit['pageNo'] = 1; // from which record to select
		$limit['records'] = 1; // how many records to select
			
		$password = $input->password; // get password from json
		
		$data = $db->select("users", $where, $limit);
		if($data['status']=='success'){
			echo "reset link will sent to your mail id";
		}else{
			echo "your username or email id doesn't match to database";
		}
	}
	function logout(){
		$sessionObj = new session();
		print_r($sessionObj->destroySession());
	}
 ?>
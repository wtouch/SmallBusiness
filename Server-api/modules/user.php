<?php
	require_once 'db/dbHelper.php';
	require_once 'db/passwordHash.php';
	require_once 'db/session.php';
	require_once 'users/login.php';
	require_once 'users/getUsers.php';
	require_once 'users/register.php';
	
	$db = new dbHelper();
	
	$reqMethod = $app->request->getMethod();
	
	//getMethod
	if($reqMethod=="GET"){
		if(isset($getRequest) && $getRequest =='session'){
			getSession($getRequest);
		}elseif(isset($getRequest) && $getRequest =='logout'){
			logout();
		}else{
			if(isset($id)){
				getSingleUser($id);
			}else{
				$limit['pageNo'] = $pageNo; // from which record to select
				$limit['records'] = $records; // how many records to select
				getMultipleUsers($limit); // from getUsers.php
			}
		}
	}
	if($reqMethod=="POST"){
		if(isset($postParams) && $postParams == 'login'){
			doLogin($body);
		}elseif(isset($postParams) && $postParams == 'register'){
			registerUser($body);
		}elseif(isset($postParams) && $postParams == 'forgotpass'){
			forgotPass($body);
		}elseif(isset($postParams) && $postParams == 'changepass'){
			changePass($body);
		}
	}
	
	if($reqMethod=="PUT" || $reqMethod=="DELETE"){
		$where['id'] = $id; // need where clause to update/delete record
		$update = $db->update("users", $body, $where);
		echo json_encode($update);
	}

 ?>
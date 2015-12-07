<?php

// load required files
require_once 'lib/Slim/Slim.php';
require_once 'lib/PHPExcel/PHPExcel.php';
require_once 'lib/PHPMailer/PHPMailerAutoload.php';
require_once 'modules/db/session.php';

\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

$sessionObj = new session();
$sessionObj->checkActivity();

$app->response->headers->set('Content-Type', 'application/json');
// this will get input
$body = $app->request->getBody();

//global request 	{sunita}
$app->get('/','getRecords');
$app->post('/', 'postRecord' );
$app->put('/', 'putRecord' );
	
//global  request for get record {sunita}
function getRecords(){
	$app = new \Slim\Slim();
	$body = $app->request->getBody();
	$db = new dbHelper();
	try{
		//echo $_GET['params'];
		$params = json_decode($_GET['params'],true);
		$table = $db->setTable($_GET['table']);
		$single = $_GET['single'];
		$cols = $params['cols'];
		// For limited records
		if(isset($params['limit'])){
			$limit[0] = $params['limit']['page'];
			$limit[1] = $params['limit']['records'];
			$db->setLimit($limit);
		}
		// For limited records
		if(isset($params['groupBy'])){
			$db->setGroupBy($params['groupBy']);
			$db->setLimit($limit);
		}
		//for filter
		if(isset($params['search'])){
			$db->setWhere($params['search'], $table, true);
		}

		if(isset($params['where'])){
			$db->setWhere($params['where'], $table);
		}
		$db->setColumns($table,$cols);
		//print_r($params);
		if(isset($params['join'])){
			//print_r($params['join']);
			if(is_array($params['join'])){
				foreach($params['join'] as $key => $value) {
					//print_r($value);
					$joinClause = $db->setJoinString($value['joinType'], $value['joinTable'], $value['joinOn']);
					if(isset($value['cols'])){
						$db->setColumns($joinClause, $value['cols']);
					}
					
				}
			}
		}
		//echo $db->getQueryString();
		$data = $db->select();
		echo json_encode($data);
	}catch(Exception $e) {
		$response["status"] = "error";
		$response["message"] = "Error: '".$e->getMessage()."'";
		$response["data"] = null;
		echoResponse(200, $response);
	}
};

// global request for post record
function postRecord(){
	$app = new \Slim\Slim();
	$body = $app->request->getBody();
	$db = new dbHelper();
	$table = $_GET['table'];
	try{
		if($body===""){
			throw new Exception('There is no input!');
		}else{
			$insert = $db->insert($table, $body);
			echo json_encode($insert);
		}
	}
	catch(Exception $e) {
		$response["status"] = "error";
		$response["message"] = "Error: '".$e->getMessage()."'";
		$response["data"] = null;
		echoResponse(200, $response);
	}
};
	
//global method for update or delete record
function putRecord(){
	$app = new \Slim\Slim();
	$body = $app->request->getBody();
	$db = new dbHelper();
	$params = json_decode($_GET['params'],true);
	$table = $_GET['table'];
	try{
		if(!isset($params['where'])){
			throw new Exception('Please Use proper id for record.');
		}else{
			$update = $db->update($table, $body, $params['where']);
			echoResponse(200, $update);
		}
	}
	catch(Exception $e) {
		$response["status"] = "error";
		$response["message"] = "Error: '".$e->getMessage()."'";
		$response["data"] = null;
		echoResponse(200, $response);
	}
}

function echoResponse($status_code, $response) {
    $app = \Slim\Slim::getInstance();
    // Http response code
    $app->status($status_code);

    // setting response content type to json
    $app->contentType('application/json');

    echo json_encode($response);
}

$app->run();
 ?>
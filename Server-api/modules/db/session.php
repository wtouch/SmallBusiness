<?php
require_once('dbHelper.php');
class session {
	
	public function getSession(){
		if (!isset($_SESSION)) {
			session_start();
		}
		$sess = array();
		if(isset($_SESSION['id']))
		{
			foreach($_SESSION as $sessionName => $sessionValue){
				$sess[$sessionName] = $_SESSION[$sessionName];
			}
		}
		else{
			$sess["id"] = '';
			$sess["username"] = 'Guest';
		}
		return $sess;
	}
	public function setSession($sessionData, $period = null){
		if (!isset($_SESSION)) {
			session_start();
		}
		foreach($sessionData as $sessionName => $sessionValue){
			$_SESSION[$sessionName] = $sessionValue;
		}
		if($period !== null){
			$cookie_name = "auth";
			$cookie_value = "true";
			setcookie($cookie_name, $cookie_value, time() + ($period), "/");
			//print_r($_SESSION);
		}
		return $_SESSION;
	}
    public function destroySession(){
		if (!isset($_SESSION)) {
			session_start();
		}
		if(isSet($_SESSION['id']))
		{
			foreach($_SESSION as $sessionName => $sessionValue){
				unset($_SESSION[$sessionName]);
			}
			$msg="Logged Out Successfully...";
		}
		else{
			$msg = "Not logged in...";
		}
		if (isset($_SERVER['HTTP_COOKIE'])) {
			$cookies = explode(';', $_SERVER['HTTP_COOKIE']);
			foreach($cookies as $cookie) {
				$parts = explode('=', $cookie);
				$name = trim($parts[0]);
				setcookie($name, '', time()-3600);
				setcookie($name, '', time()-3600, '/');
			}
		}
		session_regenerate_id(true);
		return $msg;
	}

}

?>

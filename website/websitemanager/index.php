<?php

class manageWebsite{
	
	function getWebsite(){
		return $_SERVER['SERVER_NAME'];
	}
	
	function getConfig(){
		$config['data'] = "vilas";
		$config['message'] = "shetkar";
		return $config;
	}
}
<?php
require_once "config.php";

if($config['host'] == 'portal.local' || $config['host'] =="mybiz.wtouch.in"){
	require_once 'website/portal/index.php';
}else{
	require_once 'website/index.php';
}
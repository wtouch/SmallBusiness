<?php
require_once "config.php";

if($config['host'] == 'portal.local' /*||  $config['host'] =="pragati.local"  /* ||  $config['host'] =="sunita.local"  */){
	require_once 'website/portal/index.php';
}else{
	require_once 'website/index.php';
}
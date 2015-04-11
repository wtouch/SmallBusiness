<?php
$config['host'] = $_SERVER['HTTP_HOST'];
$config['root_path'] = $_SERVER['DOCUMENT_ROOT'];
$config['template_path'] = $config['root_path']."/website/templates/";
$config['http_template_path'] = "http://".$config['host']."/website/templates/";
$config['uri'] = explode("/",$_SERVER['REQUEST_URI']);
$config['seouri'] = explode("?_escaped_fragment_=",$_SERVER['REQUEST_URI']);

if($config['host'] == 'portal.local' || $config['host'] =='sunita.local' || $config['host'] =="110.227.33.184"){
	require_once 'website/portal/index.php';
}else{
	require_once 'website/index.php';
}
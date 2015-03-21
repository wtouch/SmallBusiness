<?php
$config['host'] = $_SERVER['HTTP_HOST'];
$config['root_path'] = $_SERVER['DOCUMENT_ROOT'];
$config['template_path'] = $config['root_path']."/server-api/templates/";
$config['http_template_path'] = "http://".$config['host']."/server-api/templates/";
$config['uri'] = explode("/",$_SERVER['REQUEST_URI']);


require_once 'website/index.php';
<?php
/**
 * Database configuration
 */
define('DB_USERNAME', 'root');              
define('DB_PASSWORD', '');
define('DB_HOST', 'localhost');
define('DB_NAME', 'smallbusiness');
$config['host'] = $_SERVER['HTTP_HOST'];
$config['root_path'] = $_SERVER['DOCUMENT_ROOT'];
$config['template_path'] = $config['root_path']."/website/templates/";
$config['http_template_path'] = "http://".$config['host']."/website/templates/";
$config['uri'] = explode("/",$_SERVER['REQUEST_URI']);
$config['seouri'] = explode("?_escaped_fragment_=",$_SERVER['REQUEST_URI']);
?>
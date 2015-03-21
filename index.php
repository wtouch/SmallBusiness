<?php
$config['host'] = $_SERVER['HTTP_HOST'];
$config['root_path'] = $_SERVER['DOCUMENT_ROOT'];
$config['template_path'] = $config['root_path']."/server-api/templates/";

require_once 'website/index.php';
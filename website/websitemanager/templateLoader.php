<?php

	function vilas(){
		global $config;
		$template = websiteManager::getTemplate();
		$data = websiteManager::getData();
		$routes = websiteManager::getRoutes();
		$rootUrl = "/".$config['uri'][1];
		$currentUrl = $config['uri'][2];
		
		//print_r($_SERVER['REQUEST_URI']);
		if (file_exists($template['template_folder']) && is_dir($template['template_folder'])) {
			$template_dir = $template['template_folder'];
			include $config['template_path']."/".$template['template_folder']."/index.php";
		}else{
			$template_dir = "default";
			include $config['template_path']."default/index.php";
		}
		//echo $template_dir;
	}

?>
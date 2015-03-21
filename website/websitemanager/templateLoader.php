<?php

	function vilas(){
		global $config;
		$template = websiteManager::getTemplate();
		
		if (file_exists($template['template_folder']) && is_dir($template['template_folder'])) {
			
			include $config['template_path']."/".$template['template_folder']."/index.php";
		}else{
			
			include $config['template_path']."default/index.php";
		}
	}

?>
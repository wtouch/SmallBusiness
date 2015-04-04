<?php
	class templateLoader{
		private $config;
		private $web;
		private $tmplConfig;
		private $twig;
		function __construct(){
			$this->web = new websiteManager;
			$this->tmplConfig['host'] = "http://".$_SERVER['HTTP_HOST'];
			$this->tmplConfig['uri'] = $_SERVER['REQUEST_URI'];
			$this->tmplConfig['root_path'] = $_SERVER['DOCUMENT_ROOT'];
			$this->tmplConfig['template_root_path'] = $this->tmplConfig['root_path'].DIRECTORY_SEPARATOR ."website".DIRECTORY_SEPARATOR ."templates";
			$this->tmplConfig['template_host_path'] = $this->tmplConfig['host'].DIRECTORY_SEPARATOR ."website".DIRECTORY_SEPARATOR ."templates";
			$this->tmplConfig['template_category'] = "default";
			$this->tmplConfig['template_folder'] = "default";
			$this->tmplConfig['template_root_path_folder'] = $this->tmplConfig['template_root_path'].DIRECTORY_SEPARATOR .$this->tmplConfig['template_category'].DIRECTORY_SEPARATOR .$this->tmplConfig['template_folder'];
			$this->tmplConfig['template_host_path_folder'] = $this->tmplConfig['template_host_path'].DIRECTORY_SEPARATOR .$this->tmplConfig['template_category'].DIRECTORY_SEPARATOR .$this->tmplConfig['template_folder'];
			$loader = new Twig_Loader_Filesystem($this->tmplConfig['template_root_path_folder']);
			// initialize Twig environment
			$this->twig = new Twig_Environment($loader);
		}
		function setConfig($property, $value){
			$this->tmplConfig[$property] = $value;
			return true;
		}
		function getConfig(){
			return $this->tmplConfig;
		}
		
		function getTemplate($route){
			$route = explode("/", $route);
			if(count($route) > 1){
				$route = $route[0];
			}else{
				$route = $route[0];
			}
			if($route == "") $route = "home";
			return $this->twig->loadTemplate($route.".html");
		}
		function getData($route){
			$data = $this->web->getTemplateData($route);
			$routes = $this->web->getRoutes();
			$response['title'] = $route;
			$response['uri'] = $this->tmplConfig['uri'];
			$response['routes'] = $routes['data'];
			$response['data'] = $data['business'];
			if(isset($data['featured_services'])) $response['featured_services'] = $data['featured_services'];
			if(isset($data['featured_products'])) $response['featured_products'] = $data['featured_products'];
			$response['path'] = $this->tmplConfig['template_host_path_folder']."/";
			//print_r($data);
			//print_r($response['data']['testimonials']);
			return $response;
		}
		function displayTemplate($route){
			$response = $this->getData($route);
			$template = $this->getTemplate($route);
			return $template->display($response);
		}
	}
	
	
/*	try{	
			}catch(Exception $e){
				$response["status"] = "error";
				$response["message"] = 'Error: ' .$e->getMessage();
				$response["data"] = null;
				echo json_encode($response);
			}

			$web = new websiteManager;
				$webConfig = $web->getConfig();
				$webData = $web->getData();
				$webRoutes = $web->getRoutes();
				$webTemplate = $web->getTemplate();
				
				
				if($webConfig['status'] == 'success'){
					$response['webConfig'] = $webConfig['data'];
				}else{
					throw new Exception($webConfig['message']);
				}
				if($webData['status'] == 'success'){
					$response['webData'] = $webData['data'];
				}else{
					throw new Exception($webData['message']);
				}
				if($webRoutes['status'] == 'success'){
					$response['webRoutes'] = $webRoutes['data'];
				}else{
					throw new Exception($webRoutes['message']);
				}
				if($webTemplate['status'] == 'success'){
					$response['webTemplate'] = $webTemplate['data'];
				}else{
					throw new Exception($webTemplate['message']);
				} */
				
				// this is for angular template
				/* if (file_exists($template['template_folder']) && is_dir($template['template_folder'])){
					$template_dir = $template['template_folder'];
					include $config['template_path']."/".$template['template_folder']."/index.php";
				}else{
					$template_dir = "default";
					include $config['template_path']."default/index.html";
				} */
?>
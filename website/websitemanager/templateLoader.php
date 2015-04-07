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
		function setConfig($property){
			foreach($property as $key => $value){
				$this->tmplConfig[$key] = $value;
			}
			$this->tmplConfig['template_root_path_folder'] = $this->tmplConfig['template_root_path'].DIRECTORY_SEPARATOR .$this->tmplConfig['template_category'].DIRECTORY_SEPARATOR .$this->tmplConfig['template_folder'];
			$this->tmplConfig['template_host_path_folder'] = $this->tmplConfig['template_host_path'].DIRECTORY_SEPARATOR .$this->tmplConfig['template_category'].DIRECTORY_SEPARATOR .$this->tmplConfig['template_folder'];
			$loader = new Twig_Loader_Filesystem($this->tmplConfig['template_root_path_folder']);
			// initialize Twig environment
			$this->twig = new Twig_Environment($loader);
			return $this->tmplConfig;
		}
		function getConfig(){
			return $this->tmplConfig;
		}
		
		function getTemplate($route){
			$route = explode("/", $route);
			$template = $this->web->getTemplate();
			if($template['status']=='success'){
				//print_r($template['data']);
				$this->setConfig(array('template_category'=>$template['data']['template_category'], 'template_folder' => $template['data']['template_name']));
				
			}
			
			if(count($route) > 1){
				$route = $route[0];
			}else{
				$route = $route[0];
			}
			//print_r($this->getConfig());
			if($route == "") $route = "home";
			return $this->twig->loadTemplate($route.".html");
		}
		function getData($route){
			$data = $this->web->getTemplateData($route);
			$template = $this->web->getTemplate();
			
			$routes = $this->web->getRoutes();
			$response['title'] = $route;
			$response['uri'] = $this->tmplConfig['uri'];
			$response['routes'] = $routes['data'];
			$response['data'] = (isset($data['business'])) ? $data['business'] : $data;
			$response['template'] = $template['data'];
			if(isset($data['featured_services'])) $response['featured_services'] = $data['featured_services'];
			if(isset($data['featured_products'])) $response['featured_products'] = $data['featured_products'];
			$response['path'] = $this->tmplConfig['template_host_path_folder']."/";
			//print_r($response['template']);
			print_r($data);
			//print_r($response['data']);
			return $response;
		}
		function displayTemplate($route){
			$response = $this->getData($route);
			$template = $this->getTemplate($route);
			if($response['data']['status'] == 'error'){
				
			}else{
				return $template->display($response);
			}
		}
	}

?>
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
			$this->tmplConfig['template_root_path'] = $this->tmplConfig['root_path']."/" ."website"."/" ."templates";
			$this->tmplConfig['template_host_path'] = $this->tmplConfig['host']."/" ."website"."/" ."templates";
			$this->tmplConfig['template_category'] = "default";
			$this->tmplConfig['template_folder'] = "default";
			$this->tmplConfig['template_root_path_folder'] = $this->tmplConfig['template_root_path']."/" .$this->tmplConfig['template_category']."/" .$this->tmplConfig['template_folder'];
			$this->tmplConfig['template_host_path_folder'] = $this->tmplConfig['template_host_path']."/" .$this->tmplConfig['template_category']."/" .$this->tmplConfig['template_folder'];
			$loader = new Twig_Loader_Filesystem($this->tmplConfig['template_root_path_folder']);
			// initialize Twig environment
			$this->twig = new Twig_Environment($loader);
		}
		function setConfig($property){
			foreach($property as $key => $value){
				$this->tmplConfig[$key] = $value;
			}
			$this->tmplConfig['template_root_path_folder'] = $this->tmplConfig['template_root_path']."/" .$this->tmplConfig['template_category']."/" .$this->tmplConfig['template_folder'];
			$this->tmplConfig['template_host_path_folder'] = $this->tmplConfig['template_host_path']."/" .$this->tmplConfig['template_category']."/" .$this->tmplConfig['template_folder'];
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
			try{
				$data = $this->web->getTemplateData($route);
				$template = $this->web->getTemplate();
				
				if($data['status'] == "success"){
					$data = $data['data'];
				}else{
					throw new Exception($data['message']);
				}
				
				$routes = $this->web->getRoutes();
				$responseDt['title'] = $route;
				$responseDt['uri'] = $this->tmplConfig['uri'];
				$responseDt['routes'] = $routes['data'];
				$responseDt['data'] = $data['business'];
				$responseDt['template'] = $template['data'];
				$responseDt['google_map'] = $data['website']['google_map'];
				if(isset($data['featured_services'])) $responseDt['featured_services'] = $data['featured_services'];
				if(isset($data['featured_products'])) $responseDt['featured_products'] = $data['featured_products'];
				$responseDt['path'] = $this->tmplConfig['template_host_path_folder']."/";
				
				//print_r($responseDt['template']);
				$response["status"] = "success";
				$response["message"] = "Data Selected!";
				$response["data"] = $responseDt;
				$response["path"] = $responseDt['path'];
			}catch(Exception $e){
				$response["status"] = "error";
				$response["message"] = $e->getMessage();
				$response["data"] = null;
				$response["path"] = $this->tmplConfig['template_host_path_folder']."/";
				$response["title"] = "Error!";
			}
			return $response;
		}
		function displayTemplate($route){
			$response = $this->getData($route);
			if($response['status'] == "success") {
				$template = $this->getTemplate($route);
				return $template->display($response['data']);
			}else{
				$template = $this->getTemplate("error");
				return $template->display($response);
			}
			
		}
	}

?>
'use strict'; 

// Nodejs encryption of buffers
	
	var backupUtility = function(){
		const crypto = require('crypto');
		var gui = require('nw.gui'),
			path = require('path'),
			fs = require('fs'),
			zlib = require('zlib');
		var algorithm = 'aes-256-ctr',
			password = 'd6F3Efeq';
	
		var obj = {};
		obj.algorithm = 'aes-256-ctr';
		obj.password = 'd6F3EfeqMakAdChAaLe';
		obj.setPassword = function(pass){
			obj.password = pass;
		}
		// Backup file with Zip Encrypt
		obj.backupWithZipEncrypt = function(source,destination, destiFile){
			if (!fs.existsSync(destination)){
				fs.mkdirSync(destination);
			}
			//console.log(source, destination);
			// input file
			var input = fs.createReadStream(source);
			// zip content
			var zip = zlib.createGzip();
			// encrypt content
			var encrypt = crypto.createCipher(obj.algorithm, obj.password);
			// write file
			var output = fs.createWriteStream(destination + destiFile);
			// start pipe
			input.pipe(zip).pipe(encrypt).pipe(output);
			return true;
		};
		
		// Restore File with Unzip and Decrypt
		obj.restoreWithUnzipDecrypt = function(source,destination,destiFile){
			if (!fs.existsSync(destination)){
				fs.mkdirSync(destination);
			}
			//console.log(source, destination);
			// input file
			var input = fs.createReadStream(source);
			// unzip content
			var unzip = zlib.createGunzip();
			// decrypt content
			var decrypt = crypto.createDecipher(obj.algorithm, obj.password)
			// write file
			var output = fs.createWriteStream(destination + destiFile);
			// start pipe
			input.pipe(decrypt).pipe(unzip).pipe(output);
			return true;
		};
		
		// Get All directories by given source path
		obj.getDirectories = function(source) {
		  return fs.readdirSync(source).filter(function(file) {
			return fs.statSync(path.join(source, file)).isDirectory();
		  });
		};
		
		// Get All Files inside given directory
		obj.getFiles = function(folderPath){
			var files = [];
			var dirs = obj.getDirectories(folderPath);
			if(dirs.length >= 1){
				for(var x in dirs){
					var fileFromDir = fs.readdirSync(folderPath + dirs[x]);
					for(var file in fileFromDir){
						var fileDetails = {
							path : folderPath + dirs[x] + "/" + fileFromDir[file],
							filename : fileFromDir[file],
							dir : dirs[x]
						}
						files.push(fileDetails);
					}
				}
				var fileFromDir = fs.readdirSync(folderPath);
				for(var file in fileFromDir){
					if(!fs.lstatSync(folderPath + fileFromDir[file]).isDirectory()){
						var fileDetails = {
							path : folderPath + fileFromDir[file],
							filename : fileFromDir[file]
						}
						files.push(fileDetails);
					}
				}
			}else{
				//console.log("fd");
				var fileFromDir = fs.readdirSync(folderPath);
				//console.log(fileFromDir);
				for(var file in fileFromDir){
					var fileDetails = {
						path : folderPath + fileFromDir[file],
						filename : fileFromDir[file]
					}
					files.push(fileDetails);
				}
			}
			//console.log(files);
			return files;
		};
		
		obj.takeBackup = function(source, destination){
			var allDbFiles = (obj.getFiles(source));
			if(allDbFiles.length <=0) return false;
			//console.log(allDbFiles);
			for(var x in allDbFiles){
				var file = allDbFiles[x];
				//console.log(file);
				var dir = (file.dir) ? file.dir + "/" : "";
				obj.backupWithZipEncrypt(file.path, destination + dir, file.filename);
			}
			return true;
		};
		
		obj.restoreBackup = function(source, destination){
			
			if (!fs.existsSync(destination)){
				fs.mkdirSync(destination);
			}
			var allDbFiles = (obj.getFiles(source));
			if(allDbFiles.length <=0) return false;
			//console.log(allDbFiles);
			for(var x in allDbFiles){
				var file = allDbFiles[x];
				//console.log(file);
				var dir = (file.dir) ? file.dir + "/" : "";
				obj.restoreWithUnzipDecrypt(file.path, destination + dir, file.filename);
			}
			return true;
		}
		return obj;
	}
	/* 
	//var bckUtility = new backupUtility();
	// Get application data path
	var source = gui.App.dataPath + "/databases/";
	
	// Get current path where app running
	var execPath = path.dirname( process.execPath );
	
	// Where to take backup
	var destination = execPath+"/backup/";

	//bckUtility.takeBackup(source, destination);
	//bckUtility.restoreBackup(destination, execPath + "/data/");
	 */

var $routeProviderReference;
var route;
define(['angular',
	'angularRoute',
	'ngCookies',
	'jquery',
	'uiGrid',
	'uiChart',
	'ngSanitize',
	'routeResolver',
	'bootstrap',
	'directives',
	'services', 
	'filters',
	'ngSortable',
	'googleMap',
	'upload','uploadShim',
	'css!../lib/ui-grid/ui-grid.min','css!../lib/ui-chart/jquery.jqplot.min'
], function(angular, angularRoute, ngCookies, $) {
	// Declare app level module which depends on views, and components
	var app =  angular.module('smallBusiness', [
	  'ngRoute', 'routeResolverServices', 'ui.bootstrap', 'customDirectives', 'customServices', 'customFilters', 'angularFileUpload', 'ngCookies', 'ngSanitize','uiGmapgoogle-maps', 'ui.sortable','ui.grid', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.cellNav','ui.grid.pagination','ui.chart'
	]);
	
	app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider',
                '$compileProvider', '$filterProvider', '$provide', '$httpProvider', 'uiGmapGoogleMapApiProvider',
				function($routeProvider, routeResolverProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider, uiGmapGoogleMapApiProvider) {
					
					$httpProvider.defaults.useXDomain = true;
					delete $httpProvider.defaults.headers.common['X-Requested-With'];
				uiGmapGoogleMapApiProvider.configure({
					// key: 'your api key',
					v: '3.17',
					libraries: 'places' // Required for SearchBox.
				});
				
				//Change default views and controllers directory using the following:
				routeResolverProvider.routeConfig.setBaseDirectories('modules/', 'modules/');
				app.register =
				{
					controller: $controllerProvider.register,
					directive: $compileProvider.directive,
					filter: $filterProvider.register,
					factory: $provide.factory,
					service: $provide.service
				};
				
				//Define routes - controllers will be loaded dynamically
				route = routeResolverProvider.route;
				$routeProviderReference = $routeProvider;
				$routeProvider
                
                .when('/', route.resolve({controller:'login', template: 'login', label:"Home"}, 'users/login/')) 
				// Always home url is '/' so please don't change this. In future home view can be changed.
				
				.when('/login', route.resolve({controller:'login', template: 'login', label: 'Login'}, 'users/login/'))
				
				.when('/logout', route.resolve({controller:'login', template: 'logout', label: 'Logout'}, 'users/login/'))
				
				.when('/changepass',route.resolve({controller: 'editprofile',template: 'changepass',label: "Change Password"
                }, 'users/editprofile/')) 
				
				.when('/changepass/:resetPassKey',route.resolve({controller: 'login',template: 'changepass',label: "Change Password"
                }, 'users/login/'))
				
				.when('/activate/:activateKey/:email/:pass?',route.resolve({controller: 'login',template: 'activate',label: "Activate Account"
                }, 'users/login/'))
				
				.when('/register', route.resolve({controller:'register', template: 'register', label: 'Register'}, 'users/register/'))
				
				.when('/forgotpass', route.resolve({controller:'login', template: 'forgotpass', label: 'Forgot Password'}, 'users/login/'))
				
				.when('/editprofile', route.resolve({controller:'editprofile', template: 'editprofile',label:"Edit Profile"}, 'users/editprofile/'))
	
				
                .when('/dashboard', route.resolve({controller:'dashboard', template: 'dashboard', label: "Dashboard"}, 'dashboard/'))
				
				.when('/dashboard/users', route.resolve({controller:'manageuser', template: 'manageuser', label: 'Users'}, 'users/manageuser/'))
				
				.when('/dashboard/users/:userViews?/:id?', route.resolve({controller:'manageuser', template: 'manageuser', label: "Manage Users"}, 'users/manageuser/'))
				
				.when('/dashboard/enquiry/:mailId?/:id?', route.resolve({controller:'enquiry', template: 'enquiry',label:"Mail Box"}, 'enquiry/'))
				
				.when('/dashboard/templates/mytemplates/:id?', route.resolve({controller:'mytemplates', template: 'mytemplates',label:"My Template"}, 'templates/mytemplates/'))
				
				.when('/dashboard/templates/:tempPart?/:id?', route.resolve({controller:'templates', template: 'templates',label:"Template"}, 'templates/'))
				
				// Always Add Static Route before dynamic route/dynamic parameter
				.when('/dashboard/business/addbusiness/:id?', route.resolve({controller:'addbusiness', template: 'addbusiness',label:"Add New Business"}, 'business/addbusiness/'))
				
				.when('/dashboard/business/adddetails/:id?', route.resolve({controller:'adddetails', template: 'adddetails',label:"Business Details"}, 'business/adddetails/'))
				
				.when('/dashboard/business/products/:productView?', route.resolve({controller:'products', template: 'products',label:"Products & Services"}, 'business/products/'))
				
				.when('/dashboard/business/:businessView?', route.resolve({controller:'business', template: 'business',label:"Business"}, 'business/'))
				
				.when('/dashboard/crm/addquotation/:id?', route.resolve({controller:'quotation', template: 'addquotation',label:"Add New Quotation"}, 'crm/quotation/'))
				
				.when('/dashboard/crm/quotationlist', route.resolve({controller:'quotation', template: 'quotationlist',label:"Quotation List"}, 'crm/quotation/'))
				
				.when('/dashboard/crm/addinvoice/:id?', route.resolve({controller:'invoice', template: 'addinvoice',label:"Add New Invoice"}, 'crm/invoice/'))
				
				.when('/dashboard/crm/invoicelist', route.resolve({controller:'invoice', template: 'invoicelist',label:"Invoice List"}, 'crm/invoice/'))
				
				.when('/dashboard/crm/addpurchase/:id?', route.resolve({controller:'purchase', template: 'addpurchase',label:"Add Purchase Order"}, 'crm/purchaseorder/'))
				
				.when('/dashboard/crm/purchaselist', route.resolve({controller:'purchase', template: 'purchaselist',label:"Purchase List"}, 'crm/purchaseorder/'))
				
				.when('/dashboard/crm/addreceipt/:id?', route.resolve({controller:'receipt', template: 'addreceipt',label:"Receipt"}, 'crm/receipt/'))
				
				.when('/dashboard/crm/receiptlist', route.resolve({controller:'receipt', template: 'receiptlist',label:"Receipt"}, 'crm/receipt/'))
				
				.when('/dashboard/property', route.resolve({controller: 'property', template: 'property',
				 label: "Property"}, 'property/'))
				 
				.when('/dashboard/property/addproperty/:id?/:copy?', route.resolve({controller: 'addproperty', template: 'addproperty',label: "Add Property"}, 'property/addproperty/'))
				 
				.when('/dashboard/project', route.resolve({controller: 'project',template: 'project',
					label: "Project"}, 'project/'))
					
				.when('/dashboard/project/addproject/:id?', route.resolve({controller: 'addproject',template: 'addproject',label: "Add Project"}, 'project/addproject/'))
					
				
				.when('/dashboard/websites/websettings/:id', route.resolve({controller:'websettings', template: 'websettings',label:"Website Settings"}, 'websites/websettings/'))
				
				.when('/dashboard/websites/:websitePart?', route.resolve({controller:'websites', template: 'websites',label:"Websites"}, 'websites/'))
				
				.when('/dashboard/sms', route.resolve({controller: 'sms',template: 'sms',label:"SMS"}, 'sms/'))
				 
				.when('/dashboard/contact', route.resolve({controller: 'contact',template: 'contact',label:"Contact"}, 'contact/'))
				
				.when('/dashboard/excel', route.resolve({controller: 'excel',template: 'excel',label:"Excel Management"}, 'excel/'))
				
				.when('/dashboard/training/:id?', route.resolve({controller: 'training',template: 'training',label: "Training"}, 'training/'))
				
				.when('/dashboard/crm', route.resolve({controller: 'accounting',template: 'accounting',label: "CRM"}, 'crm/'))
                .otherwise({ redirectTo: '/' });
				
	}]);
	
		
	app.run(['$location', '$rootScope', 'breadcrumbs','dataService','$cookieStore', '$cookies','$routeParams','$notification','$timeout', '$route', '$http', function($location, $rootScope, breadcrumbs, dataService, $cookieStore, $cookies, $routeParams, $notification, $timeout, $route,$http) {
		if($cookies.get("auth") == "true"){
			$rootScope.userDetails = dataService.userDetails;
		}
		
		dataService.checkAppMode().then(function(data){
				
			
			$rootScope.$routeProviderReference = $routeProviderReference;
			$rootScope.filterParams = {};
			
			$rootScope.setRoutes = function(routes, subModule){
				
				var routes = (routes) ? routes : (localStorage.module_roots) ? JSON.parse(localStorage.module_roots) : [];
				
				if(subModule){
					var parentPath = "/dashboard/";
				}else{
					var parentPath = "/";
				}
				
				if(routes.moduleName){
					parentPath = "/dashboard/";
					var moduleRoutes = routes.moduleRoutes;
					var currentRoutes = (localStorage.module_roots) ? JSON.parse(localStorage.module_roots) : [];
					angular.forEach(moduleRoutes, function(value, key){
						if(value.childMenu){
							
							if(angular.isArray(value.childMenu)){
								angular.forEach(value.childMenu, function(value){
									//console.log(value);
									moduleRoutes.push(value);
								})
							}
							//console.log(value.childMenu);
						}
					})
					//console.log(moduleRoutes);
					localStorage.module_roots = JSON.stringify(currentRoutes.concat(moduleRoutes));
					
				}else{
					moduleRoutes = routes;
					
					var currentRoutes = (localStorage.module_roots) ? JSON.parse(localStorage.module_roots) : [];
					localStorage.module_roots = JSON.stringify(currentRoutes.concat(moduleRoutes));
					
					//localStorage.module_roots = JSON.stringify(moduleRoutes);
				}
				$rootScope.getRoutes(moduleRoutes, parentPath);
				//console.log(parentPath, routes);
			}
			$rootScope.getRoutes = function(moduleRoutes, parentPath){
				if(!parentPath) parentPath = "";
				angular.forEach(moduleRoutes, function(value, key){

					$routeProviderReference.when(parentPath + value.path, route.resolve({controller: value.controller,template: value.template,label: value.label, directive : value.directive, service : value.service, filter : value.filter}, value.modulePath));
				})
			}
			
			if(localStorage.module_roots){
				$rootScope.getRoutes(JSON.parse(localStorage.module_roots), "/dashboard/");
			}
			
			$rootScope.$on("$routeChangeStart", function (event, next, current) {
				
				$rootScope.module = false;
				$rootScope.userDetails = dataService.userDetails;
				$rootScope.currentSite = location.protocol+'//'+location.hostname;
				$rootScope.breadcrumbs = breadcrumbs;
				$rootScope.serverApiV2 = false;
				$rootScope.moduleMenus = [];
				$rootScope.currentPath = (next.$$route) ? next.$$route.originalPath : "";
				if(next.$$route){
					$rootScope.appConfig = {
						metaTitle : "Small Business",
						headerTitle : (next.$$route.label) ? next.$$route.label:"",
						subTitle : (next.$$route.label) ? next.$$route.label : "",
						assetPath : '..'
					};
				}
				
				var nextUrl = (next.$$route) ? next.$$route.originalPath : "";
				console.log(nextUrl, $cookies.get("auth"),$rootScope.userDetails);
				if(nextUrl == '/logout' || $cookies.get("auth") == 'false'){
					dataService.logout();
					$rootScope.userDetails = null;
				}
				
				if($cookies.get("auth") == 'false' || $rootScope.userDetails == null){
					var changePassUrl = '"/changepass/'+next.pathParams.resetPassKey+'"';
					if (nextUrl == '/forgotpass' || nextUrl == '/register' || nextUrl == '/login' || nextUrl == '/' || nextUrl == '/logout' || nextUrl == '/changepass/:resetPassKey' || nextUrl == '/activate/:activateKey/:email/:pass?') {
					} else {
						$location.path("/login");
						$notification.warning("Login", "You are not logged in!");
					}
				}else{
					if (nextUrl == '/forgotpass' || nextUrl == '/register' || nextUrl == '/login' || nextUrl == '/' || nextUrl == '/changepass/:resetPassKey' || nextUrl == '/activate/:activateKey/:email/:pass?') {
						$location.path("/dashboard");
					}
					
				};
				if($rootScope.userDetails != null){
					if($rootScope.userDetails.config.modules){
						var routes = [];
						angular.forEach($rootScope.userDetails.config.modules, function(value, key){
							$http.get("modules/"+value.name+"/"+value.name+".json").success(function(response){
								//console.log(response);
								var routes = {
									moduleRoutes : response,
									moduleName : value.name
								}
								$rootScope.setRoutes(routes, true);
							})
							$rootScope.setRoutes(value.routes, true);
						})
					}
					if($rootScope.userDetails.group_id == 4){
						if($rootScope.userDetails.config.addbusiness === undefined){
							
							$rootScope.userDetails.config = {
								addbusiness : false,
								addbusinessDetails : false,
								addProducts : false,
								chooseTemplate : false,
								requestSite : false
							}
							
							dataService.put('put/user/'+$rootScope.userDetails.id, {config : $rootScope.userDetails.config}).then(function(response){
								
								if(response.status == "success"){
									dataService.setUserDetails(JSON.stringify($rootScope.userDetails));
									$rootScope.userDetails = dataService.parse(dataService.userDetails);
								}
							})
						}
						
						if($rootScope.userDetails.config.addbusiness == false){
							$location.path("/dashboard/business/addbusiness");
							$rootScope.addbusinessClass = 'col-xs-3 bs-wizard-step active';
							$rootScope.addProductsClass = 'col-xs-3 bs-wizard-step disabled';
							$rootScope.chooseTemplateClass = 'col-xs-3 bs-wizard-step disabled';
							$rootScope.requestSiteClass = 'col-xs-3 bs-wizard-step disabled';
						}else if($rootScope.userDetails.config.addbusinessDetails != true){
							$location.path("/dashboard/business/adddetails/"+$rootScope.userDetails.config.addbusinessDetails);
							$rootScope.addbusinessClass = 'col-xs-3 bs-wizard-step active';
							$rootScope.addProductsClass = 'col-xs-3 bs-wizard-step disabled';
							$rootScope.chooseTemplateClass = 'col-xs-3 bs-wizard-step disabled';
							$rootScope.requestSiteClass = 'col-xs-3 bs-wizard-step disabled';
						}else if($rootScope.userDetails.config.addProducts != true){
							$location.path("/dashboard/business/products/"+$rootScope.userDetails.config.addProducts);
							$rootScope.addbusinessClass = 'col-xs-3 bs-wizard-step complete';
							$rootScope.addProductsClass = 'col-xs-3 bs-wizard-step active';
							
							$rootScope.chooseTemplateClass = 'col-xs-3 bs-wizard-step disabled';
							$rootScope.requestSiteClass = 'col-xs-3 bs-wizard-step disabled';
							
						}else if($rootScope.userDetails.config.chooseTemplate == false){
							$location.path("/dashboard/templates/listoftemplates");
							$rootScope.addbusinessClass = 'col-xs-3 bs-wizard-step complete';
							$rootScope.addProductsClass = 'col-xs-3 bs-wizard-step complete';
							$rootScope.chooseTemplateClass = 'col-xs-3 bs-wizard-step active';
							$rootScope.requestSiteClass = 'col-xs-3 bs-wizard-step disabled';
							
						}else if($rootScope.userDetails.config.requestSite == false){
							$location.path("/dashboard/websites/requestnewsite");
							$rootScope.addbusinessClass = 'col-xs-3 bs-wizard-step complete';
							$rootScope.addProductsClass = 'col-xs-3 bs-wizard-step complete';
							$rootScope.chooseTemplateClass = 'col-xs-3 bs-wizard-step complete';
							$rootScope.requestSiteClass = 'col-xs-3 bs-wizard-step active';
						}
					}
					
				}
			});
		});
	}]);
	
	// Write custome code
	$(document).ready(function(){
		//console.log("custom js");
	
	})
	return app;
});
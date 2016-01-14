'use strict'; 
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
		$rootScope.sqLite = false;
		//$rootScope.standAlone = true;
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
				//console.log(value.controller,value.template,value.label);
				//if(value.directive){
					$routeProviderReference.when(parentPath + value.path, route.resolve({controller: value.controller,template: value.template,label: value.label, directive : value.directive, service : value.service, filter : value.filter}, value.modulePath));
				//}
			})
		}
		//$routeProviderReference.when("/dashboard/inventory", route.resolve({controller: "inventory",template: "inventory",label: "inventory"}, "inventory/"));
		if(localStorage.module_roots){
			$rootScope.getRoutes(JSON.parse(localStorage.module_roots), "/dashboard/");
		}
		
		$rootScope.$on("$routeChangeStart", function (event, next, current) {
			/* if(localStorage.module_roots){
				$rootScope.getRoutes(JSON.parse(localStorage.module_roots), "/dashboard/");
			} */
			$rootScope.module = false;
			//console.log(localStorage);
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
			if(nextUrl == '/logout' || dataService.auth == false){
				dataService.logout();
				$rootScope.userDetails = null;
			}
			
			if(dataService.auth == false || $rootScope.userDetails == null){
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
				
				// For TaxData in user config
				//console.log($rootScope.userDetails.config);
				
				/* if($rootScope.userDetails.config == ""){
					$rootScope.userDetails.config = {};
				}
				if($rootScope.userDetails.config.inventory == undefined) $rootScope.userDetails.config.inventory = {};
				
				$rootScope.taxData = {
					tax : [{
						taxName : "service_tax",
						displayName : "Service Tax",
						taxValue : 14
					},{
						taxName : "vat",
						displayName : "Vat",
						taxValue : 5
					}],
					pan_no : "DIPPS1619D",
					tin_no : "DIPPS1619DST001"
				};
				
				$rootScope.userDetails.config.inventory.taxData = $rootScope.taxData;
				
				dataService.put('put/user/'+$rootScope.userDetails.id, {config : $rootScope.userDetails.config}).then(function(response){
					if(response.status == "success"){
						dataService.setUserDetails(JSON.stringify($rootScope.userDetails));
						$rootScope.userDetails = dataService.parse(dataService.userDetails);
					}
				}) */
				
				//console.log($rootScope.userDetails.config);
			}
		});
		
		//(userDetails.config.chooseTemplate=='true')
	}]);
	
	// Write custome code
	$(document).ready(function(){
		//console.log("custom js");
	
	})
	return app;
});
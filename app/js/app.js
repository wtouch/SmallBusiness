'use strict'; 

define(['angular',
	'angularRoute',
	'routeResolver',
	'bootstrap',
	'breadcrumbs',
	'directives',
	'css!../css/bootstrap.min','css!../css/style'
], function(angular, angularRoute) {
	// Declare app level module which depends on views, and components
	var app =  angular.module('smallBusiness', [
	  'ngRoute',
	   'routeResolverServices','ui.bootstrap','ng-breadcrumbs', 'customDirectives'
	]);
	app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider',
                '$compileProvider', '$filterProvider', '$provide', '$httpProvider', 
				function($routeProvider, routeResolverProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider) {
				
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
				var route = routeResolverProvider.route;
				
				$routeProvider
                
                .when('/login', route.resolve({controller:'login', template: 'login', label:"home"}, 'login/'))
				
				.when('/login', route.resolve({controller:'login', template: 'login', label: 'Login'}, 'users/login/'))
				
				.when('/editprofile', route.resolve({controller:'editprofile', template: 'editprofile',label:"Edit Profile"}, 'users/editprofile/'))
	
				.when('/forgotpass', route.resolve({controller:'forgotpass', template: 'forgotpass', label: 'Forgot Password'}, 'users/forgotpass/'))
				
                .when('/dashboard', route.resolve({controller:'dashboard', template: 'dashboard'}, 'dashboard/'))
				
				.when('/register', route.resolve({controller:'register', template: 'register', label: 'Register'}, 'users/register/'))
				
				.when('/dashboard/addbusiness/:formPart?', route.resolve({controller:'addbusiness', template: 'addbusiness',label:"Business Profile"}, 'mybusiness/addbusiness/'))
		
				.when('/dashboard/businesslist', route.resolve({controller:'businesslist', template: 'businesslist',label:"Business List"}, 'mybusiness/'))
				
				.when('/dashboard/manageprodserv', route.resolve({controller:'businesslist', template: 'manageprodserv',label:"Manage Product-Service"}, 'mybusiness/'))
				
				.when('/addbusiness/:new?', route.resolve({controller:'addbusiness', template: 'addbusiness', label: "New Business"}, 'mybusiness/addbusiness/'))
				
				.when('/dashboard/enquiry/:mailId?', route.resolve({controller:'enquiry', template: 'enquiry',label:"MailBox"}, 'enquiries/'))
				/* Deleted mail view route we don't want that */
								
				//.when('/requestnewsite', route.resolve({controller:'mywebsites', template: 'requestnewsite',label:"Requst New Website"}, 'websites/'))
				
				//.when('/dashboard/mywebsites', route.resolve({controller:'mywebsites', template: 'mywebsites',label:"Websites List"}, 'websites/'))
				
				.when('/dashboard/templates/:tempPart?', route.resolve({controller:'templates', template: 'templates',label:"Template"}, 'templates/'))
				
				.when('/dashboard/websites/:websitePart?', route.resolve({controller:'websites', template: 'websites',label:"Websites"}, 'websites/'))
		
				//.when('/dashboard/templates', route.resolve({controller:'templates', template: 'templates',label:"Templates"}, 'templates/'))
				
				//.when('/dashboard/mytemplates', route.resolve({controller:'templates', template: 'mytemplates',label:"My Templates"}, 'templates/'))
				
				//.when('/dashboard/requestcustomtemplates', route.resolve({controller:'templates', template: 'requestcustomtemplates',label:"Requset Custom Templates"}, 'templates/'))
				
				//.when('/dashboard/custometemplates', route.resolve({controller:'templates', template: 'custometemplates',label:"Custom Templates"}, 'templates/'))
				
				.when('/dashboard/addproducts', route.resolve({controller:'addbusiness', template: 'addproducts',label:"Products"}, 'products/'))
				
				//.when('/mywebsites', route.resolve({controller:'mywebsites', template: 'mywebsites',label:"Website List"}, 'websites/'))
				
				//.when('/requestedsitelist', route.resolve({controller:'mywebsites', template: 'requestedsitelist',label:"Requsted Sit List"}, 'websites/'))
				
                .otherwise({ redirectTo: '/login' });
	}]);
	
		
	app.run(['$location', '$rootScope', 'breadcrumbs', function($location, $rootScope, breadcrumbs) {
		$rootScope.breadcrumbs = breadcrumbs;
		$rootScope.metaTitle = "Small Business";
	}]);
	return app;
});


'use strict';

define(['angular',
	'angularRoute',
	'routeResolver',
	'bootstrap',
	'breadcrumbs',
	'css!../css/bootstrap.min','css!../css/style'
], function(angular, angularRoute) {
	// Declare app level module which depends on views, and components
	var app =  angular.module('smallBusiness', [
	  'ngRoute',
	   'routeResolverServices','ui.bootstrap','ng-breadcrumbs'
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
                
                .when('/', route.resolve({controller:'login', template: 'login', label:"home"}, 'login/'))
				.when('/login', route.resolve({controller:'login', template: 'login', label: 'Login'}, 'users/login/'))
				
                .when('/dashboard', route.resolve({controller:'dashboard', template: 'dashboard'}, 'dashboard/'))
				
				.when('/businessprofile', route.resolve({controller:'addbusiness', template: 'businessprofile',label:"Business Profile"}, 'mybusiness/addbusiness/'))
				
				.when('/contactprofile', route.resolve({controller:'addbusiness', template: 'contactprofile',label:"Contact Profile"}, 'mybusiness/addbusiness/'))
				
				.when('/editprofile', route.resolve({controller:'addbusiness', template: 'editprofile',label:"Edit Profile"}, 'mybusiness/addbusiness/'))
				
				.when('/testimonials', route.resolve({controller:'addbusiness', template: 'testimonials',label:"Testimonials"}, 'mybusiness/addbusiness/'))
				
				.when('/addbusiness/:new?', route.resolve({controller:'addbusiness', template: 'addbusiness', label: "New Business"}, 'mybusiness/addbusiness/'))
				
				.when('/infrastructure', route.resolve({controller:'addbusiness', template: 'infrastructure',label:"Infrastructure & Facilities"}, 'mybusiness/addbusiness/'))
				
				.when('/jobsandcareers', route.resolve({controller:'addbusiness', template: 'jobsandcareers' ,label:"Jobs & Careers"}, 'mybusiness/addbusiness/'))
				
				.when('/products', route.resolve({controller:'addnewbusi', template: 'products',label:"Products"}, 'mybusiness/addnewbusi/'))
				
				.when('/dashboard/businesslist', route.resolve({controller:'businesslist', template: 'businesslist',label:"Business List"}, 'mybusiness/'))
				
				.when('/dashboard/enquiry/:id?', route.resolve({controller:'enquiry', template: 'enquiry',label:"MailBox"}, 'enquiries/'))
				
				.when('/dashboard/enquiry/mailview', route.resolve({controller:'enquiry', template: 'mailview',label:"MailView"}, 'enquiries/'))
				
				.when('/requestnewsite', route.resolve({controller:'mywebsites', template: 'requestnewsite',label:"Requst New Website"}, 'websites/'))
				
				.when('/dashboard/mywebsites', route.resolve({controller:'mywebsites', template: 'mywebsites',label:"Websites List"}, 'websites/'))
				
				.when('/dashboard/templates', route.resolve({controller:'templates', template: 'templates',label:"Templates"}, 'templates/'))
				
				
				.when('/requestedsitelist', route.resolve({controller:'mywebsites', template: 'requestedsitelist'}, 'websites/'))
                .otherwise({ redirectTo: '/' });
	}]);
	
		
	app.run(['$location', '$rootScope', 'breadcrumbs', function($location, $rootScope, breadcrumbs) {
		$rootScope.breadcrumbs = breadcrumbs;
		$rootScope.title = "DEFAULT Title";
	}]);
	return app;
});
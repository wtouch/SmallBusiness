'use strict';

define(['angular',
	'angularRoute',
	'routeResolver',
	'css!../css/bootstrap.min','css!../css/style'
], function(angular, angularRoute) {
	// Declare app level module which depends on views, and components
	var app =  angular.module('smallBusiness', [
	  'ngRoute',
	  'routeResolverServices'
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
                
                .when('/home', route.resolve({controller:'home', template: 'home', directive: 'vilas'}, 'home/'))
				.when('/newbusi', route.resolve({controller:'newbusi', template: 'newbusi'}, 'newbusi/'))
				.when('/busilist', route.resolve({controller:'busilist', template: 'busilist', }, 'busilist/'))
                .when('/dashboard', route.resolve({controller:'dashboard', template: 'dashboard'}, 'dashboard/'))
				.when('/mailbox', route.resolve({controller:'mailbox', template: 'mailbox'}, 'mailbox/'))
				.when('/businessprofile', route.resolve({controller:'contactprofile', template: 'businessprofile'}, 'mybusiness/addnewbusi/'))
				.when('/contactprofile', route.resolve({controller:'contactprofile', template: 'contactprofile'}, 'mybusiness/addnewbusi/contactprofile'))
				.when('/testimonials', route.resolve({controller:'contactprofile', template: 'testimonials'}, 'mybusiness/addnewbusi/testimonials'))
				.when('/busilist', route.resolve({controller:'busilist', template: 'busilist'}, 'mybusiness/busilist'))
				.when('/requestnewsite', route.resolve({controller:'requestnewsite', template: 'requestnewsite'}, '/mywebsite'))
				.when('/websitelist', route.resolve({controller:'requestnewsite', template: 'websitelist'}, '/mywebsite/websitelist'))
                .otherwise({ redirectTo: '/home' });
	}]);
	app.run(['$location', '$rootScope', function($location, $rootScope) {
		$rootScope.title = "DEFAULT Title";
	}]);
	return app;
});
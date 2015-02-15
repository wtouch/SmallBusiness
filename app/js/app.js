

'use strict';

define(['angular',
	'angularRoute',
	'routeResolver',
	'bootstrap',
	'css!../css/bootstrap.min','css!../css/style'
], function(angular, angularRoute) {
	// Declare app level module which depends on views, and components
	var app =  angular.module('smallBusiness', [
	  'ngRoute',
	   'routeResolverServices','ui.bootstrap'
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
                .when('/dashboard', route.resolve({controller:'dashboard', template: 'dashboard'}, 'dashboard/'))
				
				.when('/businessprofile', route.resolve({controller:'addnewbusi', template: 'businessprofile'}, 'mybusiness/addnewbusi/'))
				.when('/contactprofile', route.resolve({controller:'addnewbusi', template: 'contactprofile'}, 'mybusiness/addnewbusi/'))
				.when('/testimonials', route.resolve({controller:'addnewbusi', template: 'testimonials'}, 'mybusiness/addnewbusi/'))
				.when('/newbusi', route.resolve({controller:'addnewbusi', template: 'newbusi'}, 'mybusiness/addnewbusi/'))
				.when('/infrastructure', route.resolve({controller:'addnewbusi', template: 'infrastructure'}, 'mybusiness/addnewbusi/'))
				.when('/jobsandcareers', route.resolve({controller:'addnewbusi', template: 'jobsandcareers'}, 'mybusiness/addnewbusi/'))
				.when('/products', route.resolve({controller:'addnewbusi', template: 'products'}, 'mybusiness/addnewbusi/'))
				
				.when('/busilist', route.resolve({controller:'busilist', template: 'busilist'}, 'mybusiness/list/'))
				
				.when('/requestnewsite', route.resolve({controller:'mywebsite', template: 'requestnewsite'}, 'mywebsite/'))
				.when('/websitelist', route.resolve({controller:'mywebsite', template: 'websitelist'}, 'mywebsite/'))
				.when('/requestedsitelist', route.resolve({controller:'mywebsite', template: 'requestedsitelist'}, 'mywebsite/'))
                .otherwise({ redirectTo: '/home' });
	}]);
	app.run(['$location', '$rootScope', function($location, $rootScope) {
		$rootScope.title = "DEFAULT Title";
	}]);
	return app;
});
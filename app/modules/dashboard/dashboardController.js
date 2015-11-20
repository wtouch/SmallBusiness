'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector', '$http','$cookieStore','$cookies','$rootScope'];
	var dashboardController = function ($scope, $injector, $http, $cookieStore, $cookies, $rootScope) {
		$scope.goBack = function() {
			window.history.back();
		};
		if(!localStorage.module_roots){
			$http.get("routes.json").success(function(response){
				$rootScope.setRoutes(response);
			})
		}
	 };
	// Inject controller's dependencies
	dashboardController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('dashboardController', dashboardController);
});

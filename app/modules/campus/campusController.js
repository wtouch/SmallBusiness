'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector', 'dataService', '$rootScope', '$http'];
	var campusController = function ($scope, $injector, dataService, $rootScope, $http) {
			$http.get("modules/campus/campus.json").success(function(response){
				//console.log("hello");
				$scope.dashboardList = response;
			})
		
	 };
	 
	// Inject controller's dependencies
	campusController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('campusController', campusController);
});
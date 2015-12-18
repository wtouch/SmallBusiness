'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector', 'dataService', '$rootScope', '$http'];
	var departmentController = function ($scope, $injector, dataService, $rootScope, $http) {
			$http.get("modules/campus/department/department.json").success(function(response){
				//console.log("hello");
				$scope.dashboardList = response;
			})
		
	 };
	 
	// Inject controller's dependencies
	departmentController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('departmentController', departmentController);
});
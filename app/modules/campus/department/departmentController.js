'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector', 'dataService', '$rootScope', '$http'];
	var departmentController = function ($scope, $injector, dataService, $rootScope, $http) {
			$http.get("modules/campus/campus.json").success(function(response){
				
				angular.forEach(response, function(value, key){
					
					if(value.childMenu){
						$scope.dashboardList = value.childMenu;
					}
					
				})
				
			})
		
	 };
	 
	// Inject controller's dependencies
	departmentController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('departmentController', departmentController);
});
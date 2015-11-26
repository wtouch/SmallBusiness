'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector', 'dataService', '$rootScope', '$http'];
	var inventoryController = function ($scope, $injector, dataService, $rootScope, $http) {
		
			$http.get("modules/inventory/inventory.json").success(function(response){
				$scope.dashboardList = response;
			})
		
	 };
	 
	// Inject controller's dependencies
	inventoryController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('inventoryController', inventoryController);
});

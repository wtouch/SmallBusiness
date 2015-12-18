'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector', 'dataService', '$rootScope', '$http'];
	var hospitalController = function ($scope, $injector, dataService, $rootScope, $http) {
		
			$http.get("modules/hospital/hospital.json").success(function(response){
				//console.log(response);
				$scope.dashboardList = response;
			})
	 };
	// Inject controller's dependencies
	hospitalController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('hospitalController', hospitalController);
});

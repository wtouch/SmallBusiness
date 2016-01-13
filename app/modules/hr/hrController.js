'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector', 'dataService', '$rootScope', '$http'];
	var hrController = function ($scope, $injector, dataService, $rootScope, $http) {
		
		
			console.log(app);
			$http.get("modules/hr/hr.json").success(function(response){
				$scope.dashboardList = response;
			})
		
	 };
	 
	// Inject controller's dependencies
	hrController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('hrController', hrController);
});


'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector', 'dataService', '$rootScope', '$http'];
	var accountingController = function ($scope, $injector, dataService, $rootScope, $http) {
			$http.get("modules/campus/accounting/accounting.json").success(function(response){
				//console.log("hello");
				$scope.dashboardList = response;
			})
		
	 };
	 
	// Inject controller's dependencies
	accountingController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('accountingController', accountingController);
});
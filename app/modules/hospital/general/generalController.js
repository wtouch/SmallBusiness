
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector', 'dataService', '$rootScope', '$http'];
	var generalController = function ($scope, $injector, dataService, $rootScope, $http) {
		
			$http.get("modules/hospital/hospital.json").success(function(response){
			//console.log(response);
				angular.forEach(response, function(value, key){
					//console.log(value);
					if(value.childMenu){
						$scope.dashboardList = value.childMenu;
					}
					//
				})
			})
			
	 };
	// Inject controller's dependencies
	generalController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('generalController', generalController);
});



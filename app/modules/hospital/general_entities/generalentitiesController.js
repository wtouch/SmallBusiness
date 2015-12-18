
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector', 'dataService', '$rootScope', '$http'];
	var generalentitiesController = function ($scope, $injector, dataService, $rootScope, $http) {
		
			$http.get("modules/hospital/general_entities/general_entities.json").success(function(response){
			console.log(response);
				$scope.GeneraldashboardList = response;
			
			})
	 };
	// Inject controller's dependencies
	generalentitiesController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('generalentitiesController', generalentitiesController);
});



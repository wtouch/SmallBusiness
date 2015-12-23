'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector', 'dataService', '$rootScope', '$http'];
	var campusController = function ($scope, $injector, dataService, $rootScope, $http) {
		
					$scope.formPart ='campusdetails';
					$scope.showFormPart = function(formPart){
						$scope.formPart = formPart;
					}
		
		
	 };
	 
	// Inject controller's dependencies
	campusController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('campusController', campusController);
});
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector', 'dataService', '$rootScope', '$http'];
	var collegeController = function ($scope, $injector, dataService, $rootScope, $http) {
		
		
		
		
		
		
		
		
		
	 };
	 
	// Inject controller's dependencies
	collegeController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('collegeController', collegeController);
});
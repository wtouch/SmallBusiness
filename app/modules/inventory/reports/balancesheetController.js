'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService'];
    
    // This is controller for this view
	var balanceController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService) {
	
	};
		
	// Inject controller's dependencies
	balanceController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('balanceController', balanceController);
});
'use strict';

define(['app', 'css!modules/home/home'], function (app) {
    var injectParams = ['$scope', '$injector','data'];

    // This is controller for this view
	var HomeController = function ($scope, $injector, data) {
		console.log("this is home ctrl " + data.value);
    };
	
	// This is service for this controller/view
	var HomeService = function () {
		this.value = 22;
    };
    
	// Inject controller's dependencies
	HomeController.$inject = injectParams;
	
	// Register/apply controller dynamically
    app.register.controller('HomeController', HomeController);
	
	// Register service to controller/module dynamically
	app.register.service('data', HomeService);
});

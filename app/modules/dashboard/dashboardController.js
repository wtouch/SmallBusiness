'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector'];

    // This is controller for this view
	var dashboardController = function ($scope, $injector) {
		console.log("this is dashboard Controller  ");
    };
	
    
	// Inject controller's dependencies
	dashboardController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('dashboardController', dashboardController);
	
	
});

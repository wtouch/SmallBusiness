

'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector'];

    // This is controller for this view
	var mywebsitesController = function ($scope, $injector) {
		console.log("this is mywebsites ctrl ");
    };
	
    
	// Inject controller's dependencies
	mywebsitesController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('mywebsitesController', mywebsitesController);
	
	
});

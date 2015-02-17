

'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector'];

    // This is controller for this view
	var mywebsiteController = function ($scope, $injector) {
		console.log("this is mywebsite ctrl ");
    };
	
    
	// Inject controller's dependencies
	mywebsiteController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('mywebsiteController', mywebsiteController);
	
	
});

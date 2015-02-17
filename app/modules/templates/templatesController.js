

'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector'];

    // This is controller for this view
	var templatesController = function ($scope, $injector) {
		console.log("this is templates ctrl ");
    };
	
    
	// Inject controller's dependencies
	templatesController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('templatesController', templatesController);
	
	
});

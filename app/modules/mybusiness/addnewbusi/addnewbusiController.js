

'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector'];

    // This is controller for this view
	var addnewbusiController = function ($scope, $injector) {
		console.log("this is addnewbusi ctrl ");
		$scope.goBack = function() 
		{
			window.history.back();
		};
	
    };
	
    
	// Inject controller's dependencies
	addnewbusiController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('addnewbusiController', addnewbusiController);
	
	
});

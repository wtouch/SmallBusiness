

'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector'];

    // This is controller for this view
	var businesslistController = function ($scope, $injector) {
		console.log("Business List ");
		$scope.goBack = function() 
		{
			window.history.back();
		};
    };
	
    
	// Inject controller's dependencies
	businesslistController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('businesslistController', businesslistController);
	
	
});

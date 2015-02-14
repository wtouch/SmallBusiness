

'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector'];

    // This is controller for this view
	var busilistController = function ($scope, $injector) {
		console.log("Business List ");
    };
	
    
	// Inject controller's dependencies
	busilistController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('busilistController', busilistController);
	
	
});



'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector'];

    // This is controller for this view
	var managetempController = function ($scope, $injector) {
		console.log("this is managetemp ctrl ");
    };
	
    
	// Inject controller's dependencies
	managetempController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('managetempController', managetempController);
	
	
});

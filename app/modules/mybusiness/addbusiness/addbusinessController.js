

'use strict';

define(['app', 'css!modules/mybusiness/addbusiness/addbusiness.css'], function (app) {
    var injectParams = ['$scope', '$injector'];

    // This is controller for this view
	var addbusinessController = function ($scope, $injector) {
		console.log("this is addbusiness ctrl ");
		$scope.goBack = function() 
		{
			window.history.back();
		};
	
    };
	
	// Inject controller's dependencies
	addbusinessController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('addbusinessController', addbusinessController);
	
	
});

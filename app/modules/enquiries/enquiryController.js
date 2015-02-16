'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector'];

    // This is controller for this view
	var enquiryController = function ($scope, $injector) {
		console.log("this is enqury Controller");
		$scope.goInbox = function()
		{
			window.history.back();
		};
		
    };
	
	// Inject controller's dependencies
	enquiryController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('enquiryController', enquiryController);
	
	
});

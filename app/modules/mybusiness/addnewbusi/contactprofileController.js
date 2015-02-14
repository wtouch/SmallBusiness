

'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','data'];

    // This is controller for this view
	var contactprofileController = function ($scope, $injector, data) {
		console.log("this is home ctrl " + data.value);
    };
	
    
	// Inject controller's dependencies
	contactprofileController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('contactprofileController', contactprofileController);
	
	
});

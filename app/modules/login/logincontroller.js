

'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$http'];

    // This is controller for this view
	var loginController = function ($scope, $injector,$http) {
		console.log("this is home ctrl");
    };
	// Inject controller's dependencies
	loginController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('loginController', loginController);
	
	
});

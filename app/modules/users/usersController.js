'use strict';

define(['app', 'css!modules/users/users'], function (app) {
    var injectParams = ['$scope', '$injector'];

    // This is controller for this view
	var usersController = function ($scope, $injector) {
		$scope.page = "this is page";
		
    };
	
	
    
	// Inject controller's dependencies
	usersController.$inject = injectParams;
	
	// Register/apply controller dynamically
    app.register.controller('usersController', usersController);
	
	
});

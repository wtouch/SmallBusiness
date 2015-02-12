'use strict';

define(['app', 'css!modules/users/users'], function (app) {
    var injectParams = ['$scope', '$injector','data'];

    // This is controller for this view
	var usersController = function ($scope, $injector, data) {
		$scope.page = data.page;
		
    };
	
	// This is service for this controller/view
	var HomeService = function () {
		this.page = "This is USERS Page!";
    };
    
	// Inject controller's dependencies
	usersController.$inject = injectParams;
	
	// Register/apply controller dynamically
    app.register.controller('usersController', usersController);
	
	// Register service to controller/module dynamically
	app.register.service('data', HomeService);
});

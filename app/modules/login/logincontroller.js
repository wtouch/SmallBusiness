
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector'];

    // This is controller for this view
	var loginController = function ($scope,$injector) {
	//	console.log("this is login ctrl");
		templateUrl:'http://localhost/trupti/SmallBusiness/app/modules/dashboard/dashboard.html';
    };
	// Inject controller's dependencies
	loginController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('loginController', loginController);
});

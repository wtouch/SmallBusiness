
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector'];

    // This is controller for this view
	var registerController = function ($scope,$injector) {
	//	console.log("this is register ctrl");
		templateUrl:'http://localhost/trupti/SmallBusiness/app/modules/users/register/register.html';
    };
	// Inject controller's dependencies
	registerController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('registerController', registerController);
});


'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector'];
	
	var forgotpassController = function ($scope,$injector) {
		templateUrl:'http://localhost/trupti/SmallBusiness/app/modules/forgotpass/forgotpass.html';
    };
	// Inject controller's dependencies
	forgotpassController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('forgotpassController', forgotpassController);
});

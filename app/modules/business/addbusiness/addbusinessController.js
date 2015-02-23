
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$location','$routeParams'];

    // This is controller for this view
	var addbusinessController = function ($scope,$injector,$location,$routeParams) {
	console.log("this is addbusiness ctrl");
		templateUrl:'http://localhost/trupti/SmallBusiness/app/modules/business/addbusiness/addbusiness.html';
    };
	// Inject controller's dependencies
	addbusinessController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('addbusinessController', addbusinessController);
});

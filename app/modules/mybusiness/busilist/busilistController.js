

'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','data'];

    // This is controller for this view
	var busilistController = function ($scope, $injector) {
		console.log("Business List");
		//$scope.value = data.value;
    };
	
    
	// Inject controller's dependencies
	homeController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('busilistController', busilistController);
	
	
});

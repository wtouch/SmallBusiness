

'use strict';

define(['app', 'css!modules/mybusiness/addnewbusi/addnewbusi.css'], function (app) {
    var injectParams = ['$scope', '$injector'];

    // This is controller for this view
	var addnewbusiController = function ($scope, $injector) {
		console.log("this is addnewbusi ctrl ");
    };
	
    
	// Inject controller's dependencies
	addnewbusiController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('addnewbusiController', addnewbusiController);
	
	
});

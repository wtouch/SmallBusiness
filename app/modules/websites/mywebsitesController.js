

'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$location'];

    // This is controller for this view
	var mywebsitesController = function ($scope, $injector,$routeParams,$location) {
		console.log("this is mywebsites ctrl ");
		$scope.newPage=function(){
			location.href='#/mywebsites.html';
			console.log("Hi");
		}
    };
	
    
	// Inject controller's dependencies
	mywebsitesController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('mywebsitesController', mywebsitesController);
	
	
});

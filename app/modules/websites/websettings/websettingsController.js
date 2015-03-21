'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$rootScope','$injector','$routeParams','$location','dataService','upload','modalService'];

    // This is controller for this view
	var websettingController = function ($scope,$rootScope,$injector,$routeParams,$location,dataService,upload,modalService) {
    console.log("hello");
	
    };
	// Inject controller's dependencies
	websettingController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('websettingController', websettingController);
});

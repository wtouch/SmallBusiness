'use strict';

define(['app'], function (app) { 
    var injectParams = ['$scope', '$injector', '$routeParams']; /* Added $routeParams to access route parameters */
    // This is controller for this view
	var manageController = function ($scope, $injector, $routeParams) {
		console.log("this is manage Controller");
		$scope.MailView = $routeParams.mailId; /* this object will check list of mails show or single mail show */
		
		templateUrl:'http://localhost/trupti/SmallBusiness/app/modules/dashboard/dashboard/enquiry/mailview.html';
		$scope.goBack = function() 
		{
			window.history.back();
		};
		
		$scope.newPage = function (){
			location.href = '#/template.html';
			consol.log("Hiii");
		};
		
    };
	
	// Inject controller's dependencies
	enquiryController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('enquiryController', enquiryController);
	
	
});

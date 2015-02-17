'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector'];
    // This is controller for this view
	var enquiryController = function ($scope, $injector) {
		console.log("this is enqury Controller");
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

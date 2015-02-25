'use strict';

define(['app'], function (app) { 
    var injectParams = ['$scope', '$injector', '$routeParams']; /* Added $routeParams to access route parameters */
    // This is controller for this view
	var enquiryController = function ($scope, $injector, $routeParams) {
		console.log("this is enqury Controller");
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
		
		//Code For Pagination
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.tempListCurrentPage = 1;
		$scope.myTempCurrentPage = 1;
		$scope.customTempCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.pageChanged = function() { 
			//$log.log('Page changed to: ' + $scope.currentPage);
			//get request for templatelist 
			$http.get("../server-api/index.php/properties/"+$scope.tempListCurrentPage+"/"+$scope.pageItems)
			.success(function(response) {  //function for templatelist response
				$scope.templates.tempListCurrentPage = response.templates.tempListCurrentPage;
				//$scope.totalRecords = response.totalRecords;
				//console.log($scope.properties);
			});
		};	//End of pagination
		
    };
	
	// Inject controller's dependencies
	enquiryController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('enquiryController', enquiryController);
	
	
});

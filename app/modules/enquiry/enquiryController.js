'use strict';

define(['app'], function (app) { 
    var injectParams = ['$scope', '$injector', '$routeParams','$location','dataService']; /* Added $routeParams to access route parameters */
    // This is controller for this view
	var enquiryController = function ($scope, $injector, $routeParams,$location,dataService) {
		
		//$scope.MailView = $routeParams.mailId; /* this object will check list of mails show or single mail show */
		$scope.mailId = $routeParams.mailId; 
		console.log($scope.mailId);
		
		//For display by default mails.html page{trupti}
		if(!$routeParams.mailId) {
		$location.path('/dashboard/enquiry/mails');
		}
		
		//Code For Pagination
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.mailListCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.pageChanged = function() { 
			//$log.log('Page changed to: ' + $scope.currentPage);
			//get request for templatelist 
			/*$http.get("../server-api/index.php/properties/"+$scope.mailListCurrentPage+"/"+$scope.pageItems)
			.success(function(response) {  //function for maillatelist response
				$scope.mails.mailListCurrentPage = response.mails.mailListCurrentPage;
				//$scope.totalRecords = response.totalRecords;
				//console.log($scope.properties);*/
				dataService.get("/getmultiple/enquiry/"+$scope.mailListCurrentPage+"/"+$scope.pageItems).then(function(response){
					$scope.mailList = response.data;
					console.log(response.data);
				});
		};
		//End of pagination
	
		dataService.get("/getmultiple/enquiry/"+$scope.mailListCurrentPage+"/"+$scope.pageItems)
		.then(function(response) {  //function for templatelist response
			$scope.totalRecords = response.totalRecords;
			$scope.mailList = response.data;
			console.log(response.data);
		});
	 };

	// Inject controller's dependencies
	enquiryController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('enquiryController', enquiryController);
	
});

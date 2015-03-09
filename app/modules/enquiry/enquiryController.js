'use strict';

define(['app'], function (app) { 
    var injectParams = ['$scope', '$injector', '$routeParams','$location','dataService']; /* Added $routeParams to access route parameters */
    // This is controller for this view
	var enquiryController = function ($scope, $injector, $routeParams,$location,dataService) {
		
		//Code For Pagination
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.mailListCurrentPage = 1;
		$scope.sentmailListCurrentPage = 1;
		$scope.delmailListCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		
		$scope.user_id = {user_id : 2};
		// this object will check list of mails show or single mail show 
		$scope.mailId = $routeParams.mailId; 
		
		//For display by default mails.html page{trupti}
		if(!$routeParams.mailId) {
			$location.path('/dashboard/enquiry/mails');
		}
		
		$scope.pageChanged = function(page, where) {
			angular.extend(where, $scope.user_id);
			dataService.get("getmultiple/enquiry/"+page+"/"+$scope.pageItems, where).then(function(response){
				$scope.mailList = response.data;
				//console.log(response.data);
			});
		};
		//End of pagination
		
		var inboxmailList = function(){
			$scope.status = {status : 1};
			angular.extend($scope.status, $scope.user_id);
			
			dataService.get("getmultiple/enquiry/"+$scope.mailListCurrentPage+"/"+$scope.pageItems, $scope.status)
			.then(function(response) {  
				$scope.mailList = response.data;
				$scope.totalRecords = response.totalRecords;
			});
		}
		
		var sentmailList = function(){
			$scope.status = {status : 3};
			dataService.get("getmultiple/enquiry/"+$scope.sentmailListCurrentPage+"/"+$scope.pageItems, $scope.status).then(function(response){
				$scope.mailList = response.data;
				$scope.totalRecords = response.totalRecords;
				console.log(response.data);
			});
		}
		
		var deletemailList = function(){
			$scope.status = {status : 0};
			dataService.get("getmultiple/enquiry/"+$scope.delmailListCurrentPage+"/"+$scope.pageItems, $scope.status).then(function(response){
				$scope.mailList = response.data;
				$scope.totalRecords = response.totalRecords;
				console.log(response.data);
			});
		}
		
		/*var composeMail = function(){
			//reset function
			$scope.reset = function() {
				$scope.compose = {};
			};
			//post method for insert data in request template form{trupti}
			$scope.postData = function(reqtemp) { 
				dataService.post("/post/template",reqtemp)
				.then(function(response) {  //function for response of request temp
					$scope.reqtemp = response.data;
					console.log(response);
					$scope.reset();
				});
				
			}
		}*/
		
		switch($scope.mailId) {
			case 'mails':
				inboxmailList();
				break;
				
			case 'sentmail':
				sentmailList();
				break;
				
			case 'delete':
				deletemailList();
				break;
				
			default:
				inboxmailList();
		};
		
	};

	// Inject controller's dependencies
	enquiryController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('enquiryController', enquiryController);
	
});

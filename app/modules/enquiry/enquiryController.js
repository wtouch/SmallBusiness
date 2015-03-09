'use strict';

define(['app'], function (app) { 
    var injectParams = ['$scope', '$injector', '$routeParams','$location','dataService','upload']; /* Added $routeParams to access route parameters */
    // This is controller for this view
	var enquiryController = function ($scope, $injector, $routeParams,$location,dataService,upload) {
		
		//Code For Pagination
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.mailListCurrentPage = 1;
		$scope.sentmailListCurrentPage = 1;
		$scope.delmailListCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		
		//Upload Function for uploading files {Vilas}
		$scope.composemail={}; // this is form object
		$scope.userinfo = {user_id:1}; // this is for uploading credentials
		$scope.path = "mail/"; // path to store images on server
		$scope.composemail.attach_files = []; // uploaded images will store in this array
		$scope.upload = function(files,path,userinfo){ // this function for uploading files
			upload.upload(files,path,userinfo,function(data){
				if(data.status !== 'error'){
					$scope.composemail.attach_files.push(JSON.stringify(data.details));
					console.log(data.message);
				}else{
					alert(data.message);
				}
				
			});
		};
		
		$scope.generateThumb = function(files){  // this function will generate thumbnails of images
			upload.generateThumbs(files);
		};
		
		$scope.user_id = {user_id : 2};
		// this object will check list of mails show or single mail show 
		$scope.mailId = $routeParams.mailId; 
		
		//For display by default mails.html page{trupti}
		if(!$routeParams.mailId) {
			$location.path('/dashboard/enquiry/mails');
		}
		
		$scope.pageChanged = function(page, where) {
			//angular.extend(where, $scope.user_id);
			dataService.get("getmultiple/enquiry/"+page+"/"+$scope.pageItems, where).then(function(response){
				$scope.mailList = response.data;
				//console.log(response.data);
			});
		};
		//End of pagination
		
		//function for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		
		var inboxmailList = function(){
			$scope.status = {status : 1};
			//`angular.extend($scope.status, $scope.user_id);
			
			dataService.get("getmultiple/enquiry/"+$scope.mailListCurrentPage+"/"+$scope.pageItems, $scope.status)
			.then(function(response) { 
				if(response.status == 'success'){
					$scope.mailList = response.data;
					//$scope.alerts.push({type: response.status, msg:'data access successfully..'});
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.alerts.push({type: response.status, msg: response.message});
				}
			});
		}
		
		var sentmailList = function(){
			$scope.status = {status : 3};
			dataService.get("getmultiple/enquiry/"+$scope.sentmailListCurrentPage+"/"+$scope.pageItems, $scope.status).then(function(response){
				if(response.status == 'success'){
					$scope.mailList = response.data;
					//$scope.alerts.push({type: response.status, msg:'data access successfully..'});
					$scope.totalRecords = response.totalRecords;
					console.log(response.data);
				}else{
					$scope.alerts.push({type: response.status, msg: response.message});
				}
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
		
		var composeMail = function(){
			//reset function
			$scope.reset = function() {
				$scope.composemail = {};
			};
			//post method for insert data of compose mail
			$scope.postData = function(composemail) {
				console.log(composemail);
				dataService.post("/post/enquiry",$scope.composemail)
				.then(function(response) {  
					$scope.composemail = response.data;
					console.log(response);
					$scope.reset();
				});
				
			}
		}
		
		/*var mailView = function(){
			dataService.get("getsingle/enquiry/").then(function(response){
				$scope.mailList = response.data;
				$scope.totalRecords = response.totalRecords;
				console.log(response.data);
			});
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
			
			case 'composemailview':
				composeMail();
				break;
				
			default:
				inboxmailList();
		};
		
		// End upload function
		
	};

	// Inject controller's dependencies
	enquiryController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('enquiryController', enquiryController);
	
});

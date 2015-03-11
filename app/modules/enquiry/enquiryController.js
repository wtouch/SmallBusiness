'use strict';

define(['app'], function (app) { 
    var injectParams = ['$scope', '$injector', '$routeParams','$location','dataService','upload','$route']; /* Added $routeParams to access route parameters */
    // This is controller for this view
	var enquiryController = function ($scope, $injector, $routeParams,$location,dataService,upload,$route) {
		
		//Code For Pagination
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.mailListCurrentPage = 1;
		$scope.sentmailListCurrentPage = 1;
		$scope.delmailListCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.mailList = [];
		
		// code for refresh page
		$scope.refreshpage=function(){
			$route.reload();
		}
		
		//Upload Function for uploading files {Vilas}
		$scope.composemail={}; // this is form object
		$scope.userinfo = {userId:1, name:"vilas"}; // this is for uploading credentials
		$scope.path = "mail/"; // path to store images on server
		$scope.composemail.Attachment = []; // uploaded images will store in this array
		$scope.upload = function(files,path,userinfo){ // this function for uploading files
			upload.upload(files,path,userinfo,function(data){
				if(data.status !== 'error'){
					$scope.composemail.Attachment.push(JSON.stringify(data.details));
					console.log(data.message);
				}else{
					alert(data.message);
				}
				
			});
		};
		
		//code for delete single mail
		$scope.deletemail = function(id, status, index){
			if(status==1){
				$scope.status = {status : 0};
				dataService.put("put/enquiry/"+id, $scope.status)
				.then(function(response) { 
					console.log(response.message);
					$scope.mailList[index].status = 0
				});
			}
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
		
		$scope.changestatus = function(id, read_status, index){
			if(read_status==0){
				$scope.status = {read_status : 1};
				dataService.put("put/enquiry/"+id, $scope.status).then(function(response) { 
					console.log(response.message);
					$scope.mailList[index].read_status = 1
					//$scope.readStatus = 1;
				});
			}
		};
		
		var inboxmailList = function(){
			$scope.status = {status : 1};
			dataService.get("getmultiple/enquiry/"+$scope.mailListCurrentPage+"/"+$scope.pageItems, $scope.status).then(function(response) { 
				if(response.status == 'success'){
					$scope.mailList = response.data;
					//$scope.alerts.push({type: response.status, msg:'data access successfully..'});
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.alerts.push({type: response.status, msg: response.message});
				}
			});
		}
		
		var mailview= function(){
			console.log($routeParams.id);
			if($routeParams.id){
				dataService.get("getsingle/enquiry/"+$routeParams.id)
				.then(function(response) {
					$scope.singlemail = response.data;
					$scope.replyMail = {};
					$scope.replyMail.reply_message ={};
					$scope.replyMail.to_email = $scope.singlemail.from_email;
					$scope.replyMail.from_email = $scope.singlemail.to_email;
					$scope.replyMail.reply_message.subject = "RE: "+$scope.singlemail.subject;
					$scope.replyMsg = ($scope.singlemail.reply_message!="")? JSON.parse($scope.singlemail.reply_message) : {message:""};
					$scope.replyMail.reply_message.message = $scope.replyMsg.message;
					
					if($scope.singlemail.reply_status == 1){
						$scope.tinymceConfig = {
							readonly: true,
						  }
					}
					
					$scope.update = function(id,replyMail){
						dataService.put("put/enquiry/"+id,replyMail)
						.then(function(response) {
							console.log(response);
						});
					};
					console.log($scope.replyMail);
					
				},function(error) {
					console.log(error);
				});
				
			}	
		}
		
		var sentmailList = function(){
			$scope.status = {status : 2};
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
				dataService.post("/post/enquiry",composemail)
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
				
			case 'mailview':
				//console.log(id);
				mailview();
				
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

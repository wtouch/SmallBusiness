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
		$scope.mailId = $routeParams.mailId;
		$scope.user_id = {user_id : 2};
		$scope.alerts = [];
		$scope.tinymceConfig = {};
		$scope.currentDate = dataService.currentDate;
		console.log($scope.currentDate);
		$scope.hideDeleted = "";//hide deleted mails from inbox
		
		//For display by default mails.html page{trupti}
		if(!$routeParams.mailId) {
			$location.path('/dashboard/enquiry/mails');
		}
		
		//function for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		
		// code for refresh page
		$scope.refreshpage=function(){
			$route.reload();
		}
		
		//reset function
		$scope.reset = function() {
			$scope.composemail = {};
		};
			
		//pagination
		$scope.pageChanged = function(page, where) {
			//angular.extend(where, $scope.user_id);
			dataService.get("getmultiple/enquiry/"+page+"/"+$scope.pageItems, where).then(function(response){
				$scope.mailList = response.data;
				//console.log(response.data);
			});
		};//End of pagination
		
		//to change status of read and unread mails
		$scope.changestatus = function(id, read_status, index){
			if(read_status==0){
				$scope.statusParam = {read_status : 1};
				dataService.put("put/enquiry/"+id, $scope.statusParam).then(function(response) { 
					console.log(response.message);
					$scope.mailList[index].read_status = 1
				});
			}
		};

		//code for delete single mail
		$scope.deletemail = function(id, status, index){
			if(status==1){
				$scope.status = {status : 0};
				dataService.put("put/enquiry/"+id, $scope.status)
				.then(function(response) { 
					console.log(response.message);
					$scope.mailList[index].status = 0
					$scope.hideDeleted = 1;
 				});
			}
		};
		
		//code for search filter
		$scope.searchFilter = function(statusCol, colValue) {
			$scope.searchObj = {search: true, subject : colValue};
			angular.extend($scope.searchObj, $scope.statusParam);
			if(colValue.length >= 4){
				dataService.get("/getmultiple/enquiry/1/"+$scope.pageItems, $scope.searchObj)
				.then(function(response) {  //function for templatelist response
					if(response.status=="warning" || response.status=='error' ){
						//$scope.alerts.push({type: response.status, msg: response.message});
						$scope.mailList = response.data;
						$scope.totalRecords = response.totalRecords;
					}else{
						$scope.mailList = response.data;
						$scope.totalRecords = response.totalRecords;
						console.log($scope.mailList);
					}
				});
			}
		};
		
		//view inbox list
		var inboxmailList = function(){
			$scope.statusParam = {status : 1};
			dataService.get("getmultiple/enquiry/"+$scope.mailListCurrentPage+"/"+$scope.pageItems, $scope.statusParam).then(function(response) { 
				if(response.status == 'success'){
					$scope.mailList = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.alerts.push({type: response.status, msg: response.message});
				}
			});
		}
		
		var sentmailList = function(){
			$scope.statusParam = {status : 2};
			dataService.get("getmultiple/enquiry/"+$scope.sentmailListCurrentPage+"/"+$scope.pageItems, $scope.statusParam).then(function(response){
				if(response.status=="success"){
						$scope.mailList = response.data;
						$scope.totalRecords = response.totalRecords;
					}else{
						$scope.alerts.push({type: response.status, msg: response.message});
					}
			});
		}
		
		var deletemailList = function(){
			$scope.statusParam = {status : 0};
			dataService.get("getmultiple/enquiry/"+$scope.delmailListCurrentPage+"/"+$scope.pageItems, $scope.statusParam).then(function(response){
				if(response.status=="warning" || response.status=='error' ){
					$scope.alerts.push({type: response.status, msg: response.message});
				}else{
					$scope.mailList = response.data;
					$scope.totalRecords = response.totalRecords;
				}
			});
		}
		
		// this object will check list of mails show or single mail show 
		
		//view single mail 
		var mailview= function(){
			$scope.mailSingleId = ($routeParams.id) ? $routeParams.id : "";
			$scope.prevmail=function(){
				$scope.mailSingleId = $scope.mailSingleId - 1;
				console.log('/mailview/'+$scope.mailSingleId);
				$location.path('/dashboard/enquiry/mailview/'+$scope.mailSingleId);
			  }
			$scope.nextmail=function(){
				$scope.mailSingleId = parseInt($scope.mailSingleId)  + 1;
				console.log('/mailview/'+$scope.mailSingleId );
				$location.path('/dashboard/enquiry/mailview/'+$scope.mailSingleId  );
			}
			if($scope.mailSingleId != ""){
				dataService.get("getsingle/enquiry/"+$scope.mailSingleId)
				.then(function(response) {
					$scope.singlemail = response.data;
					$scope.totalRecords = response.totalRecords;
					$scope.replyMail = {};
					$scope.replyMail.reply_message ={};
					$scope.replyMail.to_email = $scope.singlemail.from_email;
					$scope.replyMail.from_email = $scope.singlemail.to_email;
					$scope.replyMail.reply_message.subject = "RE: "+$scope.singlemail.subject;
					$scope.replyMsg = ($scope.singlemail.reply_message!="") ? JSON.parse($scope.singlemail.reply_message) : {message:""};
					$scope.replyMail.reply_message.message = $scope.replyMsg.message;
					
					if($scope.singlemail.reply_status == 1){
						$scope.tinymceConfig = {
							readonly: true,
							//toolbar: false,
							//menubar: false,
							//statusbar: false
						  }
					}
					
					$scope.update = function(id,replyMail){
						dataService.put("put/enquiry/"+id,replyMail)
						.then(function(response) {
							console.log(response);
						});
					};
				},function(error) {
					console.log(error);
				});
				
			}	
		}
		
		
		
		
		
		var composeMail = function(){
			
			//Upload Function for uploading files {Vilas}
			$scope.composemail = {user_id: 1, from_email : "vilas@wtouch.in", first_name : "Vilas", last_name : "Shetkar" };
			$scope.composemail.date = $scope.currentDate;
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
			$scope.generateThumb = function(files){  // this function will generate thumbnails of images
				upload.generateThumbs(files);
			};
			
	
			//post method for insert data of compose mail
			$scope.postData = function(composemail) {
				console.log(composemail);
				dataService.post("/post/enquiry",composemail)
				.then(function(response) {  
					if(response.status=="success"){
						$scope.alerts.push({type: response.status, msg: response.message});
					}else{
						$scope.alerts.push({type: response.status, msg: response.message});
					}
					$scope.reset();
				});
				
			}
		}
		
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

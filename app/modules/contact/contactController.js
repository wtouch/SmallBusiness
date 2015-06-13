'use strict';
define(['app'], function (app) {
	
	var injectParams = ['$scope', '$rootScope','$injector','$routeParams','$location','dataService','upload','modalService', '$notification'];
	
	var contactController = function ($scope,$rootScope,$injector,$routeParams,$location,dataService,upload,modalService,$notification) {
		$rootScope.metaTitle = "Contact Form";
		
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.CurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.userInfo = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		$scope.contactView = $routeParams.contactView;
		
		//For display by default userslist.html page
		if(!$routeParams.contactView) {
			$location.path('/dashboard/contact');
		}
	/*************************************************************************/
	$scope.openContact= function (url) {
			var modalDefaults = {
				templateUrl: url,	
				size : 'lg'
			};
			var modalOptions = {
				date : $scope.currentDate,
				getParty: function(modalOptions){
					dataService.get("getmultiple/user/1/100", {status: 1, user_id : $rootScope.userDetails.id}).then(function(response){
						modalOptions.customerList = (response.data);
					});
				},
				postData : function(contact) {
				 dataService.post("post/contact",contact)
				.then(function(response) {  
					if(response.status == "success"){
						
					}
					 if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Contact Added", response.message); 
				});
				}, 
			};
			modalService.showModal(modalDefaults, modalOptions).then(function (result) {
			});
		
			
	};
	
	/**************************************************************************/
		$scope.getContact = function(page,contactParam){
			$scope.contactParam = (contactParam) ? contactParam : {status : 1, user_id : $scope.user_id.user_id};
			dataService.get("/getmultiple/contacts/"+page+"/"+$scope.pageItems,contactParam)
			.then(function(response) {
				if(response.status == 'success'){				
					$scope.totalRecords = response.totalRecords;
					$scope.contacts = response.data;
				}else{
						$scope.totalRecords = [];
						$scope.contacts = 0;
						if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
						$notification[response.status](response.message);
					}
		}); 
		}
	/*******************************************************************************/
	};	
	 
	// Inject controller's dependencies
	contactController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('contactController',contactController);
	
});
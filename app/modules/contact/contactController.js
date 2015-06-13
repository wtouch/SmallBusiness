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
	/************************************************************************/
		$scope.deleted = function(id, status){
			$scope.deletedData = {status : status};
			dataService.put("put/contacts/"+id, $scope.deletedData)
			.then(function(response) { 
				if(response.status == 'success'){
					$scope.getContact($scope.CurrentPage);
				}
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Edit Project", response.message);
			});
		};
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
				 dataService.post("post/contacts",contact)
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
	$scope.openGroup= function (url) {
			var modalDefaults = {
				templateUrl: url,	
				size : 'lg'
			};
			var modalOptions = {
				date : $scope.currentDate
			};
			modalService.showModal(modalDefaults, modalOptions).then(function (result) {
			});
	};
/************************************************************************************/
		$scope.getContact = function(page,contactParam){
			$scope.contactParam = {status : 1,user_id : $rootScope.userDetails.id};
			dataService.get("/getmultiple/contacts/"+page+"/"+$scope.pageItems,$scope.contactParam)
			.then(function(response) {
				if(response.status == 'success'){				
					$scope.totalRecords = response.totalRecords;
					$scope.contacts = response.data;
					console.log(contacts);
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
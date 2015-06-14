'use strict';
define(['app'], function (app) {
	
	var injectParams = ['$scope', '$rootScope','$injector','$routeParams','$location','dataService','upload','modalService', '$notification'];
	
	var groupController = function ($scope,$rootScope,$injector,$routeParams,$location,dataService,upload,modalService,$notification) {
		$rootScope.metaTitle = "Contact Form";
		
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.CurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.userInfo = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		$scope.contactView = $routeParams.contactView;
		
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
		// code for filter data as per satus (delete/active)		
		$scope.changeStatus = function(statusCol, showStatus) {
			$scope.filterStatus= {};
			(showStatus =="") ? delete $scope.contactParam[statusCol] : $scope.filterStatus[statusCol] = showStatus;
			angular.extend($scope.contactParam, $scope.filterStatus);
			dataService.get("getmultiple/contacts/1/"+$scope.pageItems, $scope.contactParam)
			.then(function(response) {  
				if(response.status == 'success'){
					$scope.contacts = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.contacts = {};
					$scope.totalRecords = {};
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status](response.message);
				}
			});
		};
	/**********************************************************************************/
		$scope.getUsers = function(){
			dataService.get("getmultiple/user/1/500", {status: 1, user_id : $rootScope.userDetails.id})
			.then(function(response) {  
				if(response.status == 'success'){
					$scope.customerList = response.data;
				}else{
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Get Customers", response.message);
				}
			});
		};
	/**********************************************************************************/	
	};	
	 
	// Inject controller's dependencies
	groupController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('groupController',groupController);
	
});
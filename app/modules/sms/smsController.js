'use strict';
define(['app'], function (app) {
	
	var injectParams = ['$scope', '$rootScope','$injector','$routeParams','$location','dataService','upload','modalService', '$notification'];
	
	var smsController = function ($scope,$rootScope,$injector,$routeParams,$location,dataService,upload,modalService,$notification) {
		$rootScope.metaTitle = "SMS Form";
		
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.CurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.userInfo = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		$scope.contactView = $routeParams.contactView;
		
		if(!$routeParams.contactView) {
			$location.path('/dashboard/sms');
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
	/**************************************************************************************/	
		$scope.searchFilter = function(statusCol, searchProp) {
			$scope.contactParam = {status : 1,user_id : $rootScope.userDetails.id};
			$scope.filterStatus= {search: true};
			(searchProp =="") ? delete $scope.contactParam[statusCol] : $scope.filterStatus[statusCol] = searchProp;
			angular.extend($scope.contactParam, $scope.filterStatus);
			$scope.getContact(1,$scope.contactParam);
		};
	/**************************************************************************/
	$scope.openCompose= function (url) {
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
	smsController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('smsController',smsController);
	
});
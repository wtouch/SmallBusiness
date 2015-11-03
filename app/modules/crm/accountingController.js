'use strict';
define(['app'], function (app) {
var injectParams = ['$scope', '$injector','$routeParams','$rootScope','dataService','modalService','$notification'];
  // This is controller for this view
	var accountingController = function ($scope, $injector,$routeParams,$rootScope,dataService,modalService,$notification) {
		$rootScope.metaTitle = "training ";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.user_id = $rootScope.userDetails.id;
		console.log($rootScope.userDetails.id);
		
		$scope.openForm = function (url,addtraining) {
			var x = angular.copy(addtraining);
			var modalDefaults = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			$scope.isSend = false;
			var modalOptions = {
				addtraining : (addtraining) ? x : {},
				postData : function(addtraining){
					dataService.post("post/training",addtraining).then(function(response) {
						if(response.status=='success'){
							$scope.getTraining(currentPage, user_id,trainingParam);
					}
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
						$notification[response.status]("Add Record Successfully..", response.message);
					}); 
				},
				
				updateData : function(addtraining) {
					$scope.addtraining =(addtraining);
					delete addtraining.admin;
					delete addtraining.manager;
					delete addtraining.userCount;
					delete addtraining.username;
					delete addtraining.admin_id;
					//delete addtraining.admin_id;
					console.log($scope.addtraining);
					dataService.put("put/training/"+addtraining.id,addtraining)
					.then(function(response) {
						if(response.status == "success"){
							
						}
						if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
						$notification[response.status]("Update Record Successfully..", response.message);
					}); 
				}
			};
			//console.log(response.data);
			modalService.showModal(modalDefaults, modalOptions).then(function (result) {
				console.log("modalOpened");
			});
		};	
		
		$scope.searchFilter = function(statusCol, searchProp,user_id) {
			$scope.filterStatus= {search: true};
			(searchProp =="") ? delete $scope.trainingParam[statusCol] : $scope.filterStatus[statusCol] = searchProp;
			angular.extend($scope.trainingParam, $scope.filterStatus);
			$scope.getTraining(1,user_id,$scope.trainingParam);
		};
	/***************************************************************************************/
		$scope.open = function (url, viewData) {
			
			var modalDefaults = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				viewData : viewData  // assign data to modal
			};
			//console.log(response.data);
			modalService.showModal(modalDefaults, modalOptions).then(function (result) {
				console.log("modalOpened");
			});
		};	
	
	}; 
	// Inject controller's dependencies
	accountingController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('accountingController', accountingController);
});
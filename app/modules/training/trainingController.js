'use strict';
define(['app'], function (app) {
var injectParams = ['$scope', '$injector','$routeParams','$rootScope','dataService','modalService','$notification'];
  // This is controller for this view
	var trainingController = function ($scope, $injector,$routeParams,$rootScope,dataService,modalService,$notification) {
		$rootScope.metaTitle = "training ";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";		
		//$scope.user_id = $rootScope.userDetails.id;
		//console.log($rootScope.userDetails.id);
		
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
					dataService.post("training", addtraining).then(function(response) {
						if(response.status == "success"){
							$scope.getData($scope.currentPage);
						}
						if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
						$notification[response.status]("Add Record Successfully..", response.message);
					});
				},
				updateData : function(addtraining) {
					var params={where:{id:addtraining.id}};
					delete addtraining.id;
					dataService.put("training",addtraining,params)
					.then(function(response) {
						if(response.status == "success"){
							$scope.getData($scope.currentPage);
						}if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
						$notification[response.status]("Update Record Successfully..", response.message);
					});
				}
			};
			modalService.showModal(modalDefaults, modalOptions).then(function (result) {
				console.log("modalOpened");
			});
		};	
		
		// global method for filter  
		$scope.filter = function(col, value, search){
			if(search == true){
				if(value == "" || value == undefined){
					delete $scope.params.search[col];
			},
			cols : ["*"],
		};
		$scope.filterData = function(searchCol, searchValue,user_id) {
			if(searchCol == 'status'){
				$scope.params = {
					cols : ["*"]
					if(!$scope.params.search) $scope.params.search = {};
					$scope.params.search[col] = value;
				}
			}else{
				if(value == "" || value == undefined){
					delete $scope.params.where[col];
				}else{
					if(!$scope.params.where) $scope.params.where = { status : 1};
					$scope.params.where[col] = value;
				}
			}
			$scope.getData($scope.currentPage, "training", "trainingList", $scope.params);
		}
			$scope.filterStatus.search[searchCol] = searchValue;
			(searchValue =="") ? delete $scope.params.search[searchCol] : "";
			
			angular.extend($scope.params, $scope.filterStatus);
			$scope.getData($scope.currentPage,user_id,$scope.params);
	
		// order by filter
		$scope.orderBy = function(col, value){
			if(!$scope.params.orderBy) $scope.params.orderBy = {};
			$scope.params.orderBy[col] = value;
			console.log($scope.params);
			$scope.getData($scope.currentPage, "training", "trainingList", $scope.params);
				},
				cols : ["*"],
		};
		
		// global method for get request  
		$scope.getData = function(page, table, subobj, params, modalOptions) {
			$scope.params = (params) ? params : {
				where : {
					status : 1
				},
				cols : ["*"]
			};
			if(page){
				angular.extend($scope.params, {
					limit : {
						page : page,
						records : $scope.pageItems
					}
				})
			}
			dataService.get(false,table,$scope.params).then(function(response) {
				if(response.status == 'success'){
					if(modalOptions != undefined){
						modalOptions[subobj] = angular.copy(response.data);
						modalOptions.totalRecords = response.totalRecords;
					}else{
						$scope[subobj] = angular.copy(response.data);
						$scope.totalRecords = response.totalRecords;
						console.log($scope[subobj]);
					}
				}else{
					if(modalOptions != undefined){
						modalOptions[subobj] = [];
						modalOptions.totalRecords = 0;
					}else{
						$scope[subobj] = [];
						$scope.totalRecords = 0;
					}
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Get Transactions", response.message);
				}
			});
		};
		
		$scope.changeCol = function(colName, colValue, id){
			$scope.changeStatus = {};
			$scope.changeStatus[colName] = colValue;
			console.log($scope.changeStatus);
			dataService.put("training",$scope.changeStatus,{where : { id : id}})
			.then(function(response) {
				console.log(response);
				if(response.status == "success"){
					$scope.getData($scope.currentPage, "training", "trainingList", $scope.params);
				}if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Update Record Successfully..", response.message);
			});
		};	
		
		$scope.open = function (url, viewData) {
			var modalDefaults = {
				templateUrl: url,
				size : 'lg'
			};
			var modalOptions = {
				viewData : viewData 
			};
			
			modalService.showModal(modalDefaults, modalOptions).then(function (result) {
				console.log("modalOpened");
			});
		};	
	
	}; 
	// Inject controller's dependencies
	trainingController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('trainingController', trainingController);
});
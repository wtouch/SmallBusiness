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
		
		// global method for filter  {sunita}
		$scope.params = {
			where : {
				status : 1,
				user_id : 8
			},
			cols : ["*"],
		};
		$scope.filterData = function(searchCol, searchValue,user_id) {
			if(searchCol == 'status'){
				$scope.params = {
					cols : ["*"]
				};
			}
			$scope.filterStatus = { search : {}};
			$scope.filterStatus.search[searchCol] = searchValue;
			(searchValue =="") ? delete $scope.params.search[searchCol] : "";
			
			angular.extend($scope.params, $scope.filterStatus);
			$scope.getData($scope.currentPage,user_id,$scope.params);
		};
	
		// global method for get request  {sunita}
		$scope.getData = function(page, user_id, params){
			$scope.params = (params)? params :{
				where : {
					status : 1,
					user_id : 8
				},
				cols : ["*"],
			};
			if(page){
				angular.extend($scope.params, {
					limit : {
						page : page,
						records : $scope.pageItems
					}
				})
			}
			dataService.get(false, 'training', $scope.params)
			.then(function(response) {
				if(response.status == 'success'){
					$scope.totalRecords = response.totalRecords;
					$scope.training = response.data;
				}else{
					$scope.totalRecords = [];
					$scope.training = 0;
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status](response.message);
				}  
			}); 
		}
		
		$scope.changeCol = function(colName, colValue, id){
			$scope.changeStatus = {};
			$scope.changeStatus[colName] = colValue;
			console.log($scope.changeStatus);
			dataService.put("training",$scope.changeStatus,{where : { id : id}})
			.then(function(response) {
				console.log(response);
				if(response.status == "success"){
					$scope.getData($scope.currentPage);
				}if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Update Record Successfully..", response.message);
			});
		};	
		
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
	trainingController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('trainingController', trainingController);
});
'use strict';
define(['app'], function (app) {
var injectParams = ['$scope', '$injector','$routeParams','$rootScope','dataService','modalService','$notification'];
  // This is controller for this view
	var trainingController = function ($scope, $injector,$routeParams,$rootScope,dataService,modalService,$notification) {
		$rootScope.metaTitle = "Real Estate Project";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.user_id = $rootScope.userDetails.id;
		console.log($rootScope.userDetails.id);
		$scope.getTraining = function(page, user_id, trainingParam){
			$scope.trainingParam = (trainingParam) ? trainingParam : {
					status : 1,
					user_id : user_id
				};
			
			dataService.get("/getmultiple/training/"+page+"/"+$scope.pageItems, $scope.trainingParam)
			.then(function(response) {
				if(response.status == 'success'){				
					$scope.totalRecords = response.totalRecords;
					$scope.training = response.data;
					console.log(response);
				}else{
						$scope.totalRecords = [];
						$scope.training = 0;
						if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
						$notification[response.status](response.message);
					}
			}); 
		}
		
		$scope.update = function(colName, colValue, id){
			$scope.changeStatus = {};
			$scope.changeStatus[colName] = colValue;
			
			 dataService.put("put/training/"+id,$scope.changeStatus)
			.then(function(response) { 
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Training Record!", response.message);
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
'use strict';
define(['app'], function (app) {
var injectParams = ['$scope', '$injector','$routeParams','$rootScope','dataService','modalService','$notification'];
  // This is controller for this view
	var trainingController = function ($scope, $injector,$routeParams,$rootScope,dataService,modalService,$notification) {
		$rootScope.metaTitle = "Real Estate Project";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.CurrentPage = 1;
		$scope.pageItems = 100;
		$scope.numPages = "";		
		$scope.user_id = "";
		
		$scope.getTraining = function(page, user_id, trainingParam){
			$scope.trainingParam = (trainingParam) ? trainingParam : {status : 1, user_id : user_id};
			angular.extend($scope.trainingParam, {user_id : user_id});
			dataService.get("/getmultiple/training/"+page+"/"+$scope.pageItems, $scope.trainingParam)
			.then(function(response) {
				if(response.status == 'success'){				
					$scope.totalRecords = response.totalRecords;
					$scope.training = response.data;
					console.log($scope.training);
				}else{
						$scope.totalRecords = [];
						$scope.training = 0;
						if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
						$notification[response.status](response.message);
					}
		}); 
		}
	
	}; 
	// Inject controller's dependencies
	trainingController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('trainingController', trainingController);
});
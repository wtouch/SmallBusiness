'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService', 'uiGridConstants'];
    
    // This is controller for this view
	var taxsettingController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
		//global scope objects
		$scope.invoice = true;
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");
		$rootScope.serverApiV2 = true;
		$rootScope.module = "inventory";
		
		$scope.inventoryTax = $rootScope.userDetails.config.inventory.taxData;
		
		$scope.addToObject = function(inputArray,reset,formObject){
			$rootScope.addToObject(inputArray,formObject);
			$scope[reset] = {};
			$scope.totalCalculate(inputArray);
		}
		
		$scope.taxinfo = ($scope.inventoryTax) ? $scope.inventoryTax : {
			tax : [{
				taxName : "service_tax",
				displayName : "Service Tax",
				taxValue : 14
			},{
				taxName : "vat",
				displayName : "Vat",
				taxValue : 5
			}],
			pan_no : "DIPPS1619D",
			tin_no : "DIPPS1619DST001"
		};
		
		$scope.updateData = function(taxinfo){
			$rootScope.serverApiV2 = false;
			$rootScope.userDetails.config.inventory.taxData = taxinfo;
			console.log($rootScope.userDetails.config.inventory.taxData);
			dataService.put('put/user/'+$rootScope.userDetails.id, {config : $rootScope.userDetails.config}).then(function(response){
				if(response.status == "success"){
					dataService.setUserDetails(JSON.stringify($rootScope.userDetails));
					$rootScope.userDetails = dataService.parse(dataService.userDetails);
					$rootScope.serverApiV2 = true;
				}
			})
		};
		
	 };
	// Inject controller's dependencies
	taxsettingController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('taxsettingController', taxsettingController);
});
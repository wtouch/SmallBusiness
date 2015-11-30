'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector', 'dataService', '$rootScope', '$http'];
	var inventoryController = function ($scope, $injector, dataService, $rootScope, $http) {
		
		$rootScope.moduleMenus = [
			{
				name : "Inventory",
				path : "/dashboard/inventory"
				
			},{
				name : "Party",
				path : "/dashboard/inventory"
			}
		]
		
			console.log(app);
			$http.get("modules/inventory/inventory.json").success(function(response){
				$scope.dashboardList = response;
			})
		
	 };
	 
	// Inject controller's dependencies
	inventoryController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('inventoryController', inventoryController);
});

/*
console.log($rootScope.userDetails.config);
				
				if($rootScope.userDetails.config == ""){
					$rootScope.userDetails.config = {};
				}
				if($rootScope.userDetails.config.inventory == undefined) $rootScope.userDetails.config.inventory = {};
				
				$rootScope.taxData = {
					service_tax : 14,
					vat : 5,
					pan_no : "DIPPS1619D",
					tin_no : "DIPPS1619DST001"
				};
				
				$rootScope.userDetails.config.inventory.taxData = $rootScope.taxData;
				
				dataService.put('put/user/'+$rootScope.userDetails.id, {config : $rootScope.userDetails.config}).then(function(response){
					if(response.status == "success"){
						dataService.setUserDetails(JSON.stringify($rootScope.userDetails));
						$rootScope.userDetails = dataService.parse(dataService.userDetails);
					}
				})
*/
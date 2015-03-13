'use strict';

define(['app','css!modules/business/products/products.css'], function (app) {
    var injectParams = ['$scope','$rootScope', '$injector','$location','$routeParams'];

    // This is controller for this view
	var productsController = function ($scope, $rootScope,$injector,$location,$routeParams) {
		console.log("Product Controller"); // Just Added for testing {Vilas}
		
		//for display form parts of product & service
		$scope.productView = $routeParams.productView;
		
		
		
		
		// all $scope object goes here
		/*$scope.alerts = [];
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.addproductCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.user_id = {user_id : 2};*/
		
			
			
			
			/*$scope.getData = function(product) { 
			product.business_name=$scope.business_name.;
			//console.log(business_name);
				dataService.get("/getmultiple/product",product,$scope.business_name)
				.then(function(response) {  //function for response of product
					$scope.product = response.data;
					$scope.product.business_name=response.data.business_name;
					console.log(response);
					
				});
			}//end of post method{trupti}
			*/
    };
	
		
		
		
	// Inject controller's dependencies
	productsController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('productsController', productsController);
	
	
});

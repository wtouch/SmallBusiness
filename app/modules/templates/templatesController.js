

'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$location','$routeParams'];

    // This is controller for this view
	var templatesController = function ($scope, $injector,$location,$routeParams) {
		console.log("this is templates ctrl ");
		
		$scope.tempPart = $routeParams.tempPart; 
		
		console.log($scope.tempPart);
		/*For display by default templ.html page*/
		if(!$routeParams.tempPart) {
		$location.path('/dashboard/templates/listoftemplates');
		}
		
		templateUrl:'http://localhost/trupti/SmallBusiness/app/modules/templates/templates.html';
		
		//Code For Pagination
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";		

		$scope.pageChanged = function() {
			//$log.log('Page changed to: ' + $scope.currentPage);
			$http.get("../server-api/index.php/properties/"+$scope.currentPage+"/"+$scope.pageItems)
			.success(function(response) {
				$scope.properties = response.properties;
				//$scope.totalRecords = response.totalRecords;
				//console.log($scope.properties);
			});
		};	//End of pagination
    };
	
    
	// Inject controller's dependencies
	templatesController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('templatesController', templatesController);
	
	
});

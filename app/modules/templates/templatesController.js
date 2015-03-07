
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$location','$routeParams','dataService'];

    // This is controller for this view
	var templatesController = function ($scope, $injector,$location,$routeParams,dataService) {
		console.log("this is templates ctrl ");
		
		//method for insert data{trupti}
		$scope.insert = function(reqtemp){
			console.log($scope.reqtemp);
			dataService.post("../server-api/index.php/post/template",$scope.reqtemp)
			.then(function(response) {
				
				console.log(response);
			})
		}	//end of insert
		
		$scope.tempPart = $routeParams.tempPart; 
		
		console.log($scope.tempPart);
		/*For display by default templ.html page*/
		if(!$routeParams.tempPart) {
		$location.path('/dashboard/templates/listoftemplates');
		}
		
				
		//Code For Pagination
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.tempListCurrentPage = 1;
		$scope.myTempCurrentPage = 1;
		$scope.customTempCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.pageChanged = function() { 
			//$log.log('Page changed to: ' + $scope.currentPage);
			//get request for templatelist 
			dataService.get("/getmultiple/template/"+$scope.tempListCurrentPage+"/"+$scope.pageItems)
			.then(function(response) {  //function for templatelist response
				$scope.tempListCurrentPage = response.data;
				//console.log($scope.properties);
			});
			//get request for mytemplate
			$http.get("../server-api/index.php/properties/"+$scope.myTempCurrentPage+"/"+$scope.pageItems)
			.success(function(response) {  //function for mytemplate response
				$scope.templates.myTempCurrentPage = response.templates.myTempCurrentPage;
				//$scope.totalRecords = response.totalRecords;
				//console.log($scope.properties);
			});
			//get request for customtemplate 
			$http.get("../server-api/index.php/properties/"+$scope.customTempCurrentPage+"/"+$scope.pageItems)
			.success(function(response) {  //function for customtemplate response
				$scope.templates.customTempCurrentPage = response.templates.customTempCurrentPage;
				//$scope.totalRecords = response.totalRecords;
				//console.log($scope.properties);
			});
		};	//End of pagination
		dataService.get("/getmultiple/template/"+$scope.tempListCurrentPage+"/"+$scope.pageItems)
		.then(function(response) {  //function for templatelist response
			$scope.totalRecords = response.totalRecords;
			console.log(response);
		});
		
    };
	
	// Inject controller's dependencies
	templatesController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('templatesController', templatesController);
	
});

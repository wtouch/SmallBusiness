
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$location','$routeParams','dataService'];

    // This is controller for this view
	var templatesController = function ($scope, $injector,$location,$routeParams,dataService) {
			
		//to show parts of the templates form{trupti}
		$scope.tempPart = $routeParams.tempPart; 
		
		/*For display by default templatelist page {trupti}*/
		if(!$routeParams.tempPart) {
			$location.path('/dashboard/templates/listoftemplates');
		}
			
		//post method for insert data in request template form{trupti}
		$scope.postData = function() { 
			dataService.post("/post/template",$scope.reqtemp)
			.then(function(response) {  //function for response of request temp
				$scope.reqtemp = response.reqtemp;
				console.log(response.reqtemp);
			});
		}
		//end of post method
	
		//Code For Pagination{trupti}
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.tempListCurrentPage = 1;
		$scope.myTempCurrentPage = 1;
		$scope.customTempCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		
		$scope.pageChanged = function() { 
			//get request for templatelist 
			dataService.get("/getmultiple/template/"+$scope.tempListCurrentPage+"/"+$scope.pageItems)
			.then(function(response) {  //function for templatelist response
				$scope.templates = response.data;
				//console.log($scope.properties);
			});
			
			//get request for  mytemplate{trupti}
			dataService.get("/getmultiple/template/"+$scope.myTempCurrentPage+"/"+$scope.pageItems)
			.then(function(response) {  //function for my templates response
				$scope.templates = response.data;
				//console.log($scope.properties);
			});
			
			//get request for  custom template{trupti}
			dataService.get("/getmultiple/template/"+$scope.customTempCurrentPage+"/"+$scope.pageItems)
			.then(function(response) {  //function for custom templates response
				$scope.templates = response.data;
			}); 
			
		};//End of pagination
		dataService.get("/getmultiple/template/"+$scope.tempListCurrentPage+"/"+$scope.pageItems)
		.then(function(response) {  //function for templatelist response
			$scope.totalRecords = response.totalRecords;
			$scope.templates = response.data;
			console.log(response.data);
		});
		
		//for custom templtae
		dataService.get("/getmultiple/template/"+$scope.customTempCurrentPage+"/"+$scope.pageItems)
		.then(function(response) {  //function for templatelist response
			$scope.totalRecords = response.totalRecords;
			$scope.templates = response.data;
			console.log(response.data);
		});
    };
	
	// Inject controller's dependencies
	templatesController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('templatesController', templatesController);
	
});

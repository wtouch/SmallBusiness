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
			
		//reset function{trupti}
		$scope.reset = function() {
		$scope.reqtemp = {};
		};		
			
		//post method for insert data in request template form{trupti}
		$scope.postData = function(reqtemp) { 
			dataService.post("/post/template",reqtemp)
			.then(function(response) {  //function for response of request temp
				$scope.reqtemp = response.data;
				console.log(response);
				$scope.reset();
			});
			
		}//end of post method{trupti}
	
		//Code For Pagination{trupti}
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.tempListCurrentPage = 1;
		$scope.myTempCurrentPage = 1;
		$scope.customTempCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		
		$scope.pageChanged = function(page) { 
			//get request for templatelist 
			dataService.get("/getmultiple/template/"+page+"/"+$scope.pageItems)
			.then(function(response) {  //function for templatelist response
				$scope.templates = response.data;
				//console.log($scope.properties);
			});
			//this is conditional if for open my template list{trupti}
			if($routeParams.tempPart=='mytemplates') {
			//get request for  mytemplate{trupti}
			dataService.get("/getmultiple/template/"+page+"/"+$scope.pageItems)
			.then(function(response) {  //function for my templates response
				$scope.templates = response.data;
				//console.log($scope.properties);
			});
			}//end conditional if{trupti}
			else{
				//for open by default templist{trupti}
				dataService.get("/getmultiple/template/"+$scope.tempListCurrentPage+"/"+$scope.pageItems)
				.then(function(response) {  //function for templatelist response
				$scope.totalRecords = response.totalRecords;
				$scope.templates = response.data;
				console.log(response.data);
			});//end of by default templist
			}//end else
				
			//this is conditional if for open custom template list{trupti}
			if($routeParams.tempPart=='custometemplates') {
			//get request for  custom template{trupti}
			dataService.get("/getmultiple/template/"+$scope.customTempCurrentPage+"/"+$scope.pageItems)
			.then(function(response) {  //function for custom templates response
				$scope.templates = response.data;
			}); 
			}//end if
			else{
				//for open by default templist{trupti}
				dataService.get("/getmultiple/template/"+$scope.tempListCurrentPage+"/"+$scope.pageItems)
				.then(function(response) {  //function for templatelist response
				$scope.totalRecords = response.totalRecords;
				$scope.templates = response.data;
				console.log(response.data);
			});//end of by default templist
			}//end else
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

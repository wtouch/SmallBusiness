
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$location','dataService'];

    // This is controller for this view
	var websitesController = function ($scope, $injector,$routeParams,$location,dataService) {
		console.log("this is mywebsites ctrl ");
		
		//insert method for add data{trupti}
		$scope.insert = function(){
			//console.log($scope.user);
			console.log("hello");
			dataService.post("post/website",$scope.reqnewsite)
			.then(function(response) {
				//alert(response);
				console.log(response);
			})
		}	//end of insert
	
		$scope.websitePart = $routeParams.websitePart; 
		console.log($scope.websitePart);
		/*For display by default websitelist.html page*/
		if(!$routeParams.websitePart) {
		$location.path('/dashboard/websites/websiteslist');
		}
	
		//Code For Pagination
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.webListCurrentPage = 1;
		$scope.reqestSiteCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";	
	
		$scope.pageChanged = function() {
			//$log.log('Page changed to: ' + $scope.currentPage);
			//get request for website list
			dataService.get("/getmultiple/website/"+$scope.webListCurrentPage+"/"+$scope.pageItems)
			.then(function(response) {  //function for websitelist response
				$scope.webListCurrentPage = response.data;
				//console.log($scope.data);
				console.log(response);
			});
		
			//get request for requestedSite list
			$http.get("../server-api/index.php/getsingle/website/"+$scope.reqestSiteCurrentPage+"/"+$scope.pageItems)
			.success(function(response) { //fuction for requestedsite list response
				$scope.websites.reqestSiteCurrentPage = response.reqestSiteCurrentPage;
				//$scope.totalRecords = response.totalRecords;
				console.log(response);
			});
			
			
		};//End of pagination
		dataService.get("/getmultiple/website/"+$scope.webListCurrentPage+"/"+$scope.pageItems)
		.then(function(response) {  //function for websitelist response
			$scope.totalRecords = response.totalRecords;
			console.log(response);
		});
		
    };
	
	// Inject controller's dependencies
	websitesController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('websitesController', websitesController);
	
	
});

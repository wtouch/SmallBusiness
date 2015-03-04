
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$location'];

    // This is controller for this view
	var websitesController = function ($scope, $injector,$routeParams,$location) {
		console.log("this is mywebsites ctrl ");
		
		//insert method for add data{trupti}
		$scope.insert = function(reqnewsite){
			//console.log($scope.user);
			console.log($scope.reqnewsite);
			$http.post("../server-api/index.php/post/website",$scope.reqnewsite)
			.success(function(response) {
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
	
		templateUrl:'http://localhost/aarti/SmallBusiness/app/modules/websites/mywebsites.html';
		
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
			$http.get("../server-api/index.php/getsingle/website/"+$scope.webListCurrentPage+"/"+$scope.pageItems)
			.success(function(response) { //fuction for wesitelist response
				$scope.websites.webListCurrentPage = response.webListCurrentPage;
				//$scope.totalRecords = response.totalRecords;
				//console.log($scope.properties);
			});
			//get request for requestedSite list
			$http.get("../server-api/index.php/getsingle/website/"+$scope.reqestSiteCurrentPage+"/"+$scope.pageItems)
			.success(function(response) { //fuction for requestedsite list response
				$scope.websites.reqestSiteCurrentPage = response.reqestSiteCurrentPage;
				//$scope.totalRecords = response.totalRecords;
				//console.log($scope.properties);
			});
		};//End of pagination	
    };
	
    
	// Inject controller's dependencies
	websitesController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('websitesController', websitesController);
	
	
});

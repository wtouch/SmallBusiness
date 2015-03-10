'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$location','dataService','upload'];

    // This is controller for this view
	var websitesController = function ($scope, $injector,$routeParams,$location,dataService,upload) {
        //for display form parts
        $scope.websitePart = $routeParams.websitePart;
        // all $scope object goes here
        $scope.alerts = [];
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.webListCurrentPage = 1;
		$scope.reqestSiteCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
        $scope.user_id = {user_id : 1}; // these are URL parameters
		// All $scope methods
        $scope.pageChanged = function(page,where) { // Pagination page changed
		angular.extend(where, $scope.user_id);
			dataService.get("/getmultiple/website/"+page+"/"+$scope.pageItems, where)
			.then(function(response) {  //function for websitelist response
				$scope.website = response.data;
				
			});
		};
        
        //function for close alert
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
        /*For display by default websitelist.html page*/
		if(!$scope.websitePart) {
			$location.path('/dashboard/websites/websiteslist');
		}
        
        // switch functions
        var requestnewsite = function(){
			//reset function{Dnyaneshwar}
			$scope.reset = function() {
				$scope.reqnewsite = {};
			};
			//post method for insert data in request template form{trupti}
			$scope.postData = function(reqnewsite) { 
				dataService.post("/post/website",reqnewsite)
				.then(function(response) {  //function for response of request temp
					$scope.reqnewsite = response.data;
					console.log(response);
					$scope.reset();
				});
			}//end of post method{Dnyaneshwar}
		};
        
        var websiteslist = function(){
			//function for websiteslist{Dnyaneshwar}
			dataService.get("/getmultiple/website/"+$scope.webListCurrentPage+"/"+$scope.pageItems, $scope.user_id)
			.then(function(response) {  //function for websiteslist response
			if(response.status == 'success'){
					$scope.website=response.data;
					console.log($scope.website);
					$scope.alerts.push({type: response.status, msg:'data access successfully..'});
					$scope.totalRecords = response.totalRecords;	
				}
				else
				{
					$scope.alerts.push({type: response.status, msg: response.message});
				};
				//$scope.website = response.data;
			});
		};
        
        var requestedsitelist = function(){
			//function for requestedsitelist{Dnyaneshwar}
			dataService.get("/getmultiple/website/"+$scope.reqestSiteCurrentPage+"/"+$scope.pageItems, $scope.user_id)
			.then(function(response) {  //function for requestedsitelist response
			if(response.status == 'success'){
					$scope.website=response.data;
					$scope.alerts.push({type: response.status, msg:'data access successfully..'});
					$scope.totalRecords = response.totalRecords;	
				}
				else
				{
					$scope.alerts.push({type: response.status, msg: response.message});
				};
				$scope.website = response.data;
			});
		};
        
        switch($scope.websitePart) {
			case 'websiteslist':
				websiteslist();
				break;
			case 'requestnewsite':
				requestnewsite();
				break;
			case 'requestedsitelist':
				requestedsitelist();
				break;
			default:
				websiteslist();
		};
		
    };
	
	// Inject controller's dependencies
	websitesController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('websitesController', websitesController);
	
	
});

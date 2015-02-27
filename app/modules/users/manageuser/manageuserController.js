'use strict';

define(['app'], function (app) { 
    var injectParams = ['$scope', '$injector', '$routeParams','$location']; /* Added $routeParams to access route parameters */
    // This is controller for this view
	var manageuserController = function ($scope, $injector, $routeParams,$location) {
		console.log("this is manageuserController");
		
		$scope.userPart = $routeParams.userPart; 
		console.log($scope.userPart);
		//For display by default userslist.html page{trupti}
		if(!$routeParams.userPart) {
		$location.path('/dashboard/users/userslist');
		}
		templateUrl:'http://localhost/trupti/SmallBusiness/app/modules/users/manageuser/userslist.html';
		
		//Code For Pagination
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.usersGroupCurrentPage = 1;
		$scope.usersListCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.pageChanged = function() { 
			//$log.log('Page changed to: ' + $scope.currentPage);
			
			//get request for usersGroup
			$http.get("../server-api/index.php/properties/"+$scope.usersGroupCurrentPage+"/"+$scope.pageItems)
			.success(function(response) {  //function for templatelist response
				$scope.manageusers.usersGroupCurrentPage = response.manageusers.usersGroupCurrentPage;
				//$scope.totalRecords = response.totalRecords;
				//console.log($scope.properties);
			});
			//get request for usersList
			$http.get("../server-api/index.php/properties/"+$scope.usersListCurrentPage+"/"+$scope.pageItems)
			.success(function(response) {  //function for mytemplate response
				$scope.manageusers.usersListCurrentPage = response.manageusers.usersListCurrentPage;
				//$scope.totalRecords = response.totalRecords;
				//console.log($scope.properties);
			});
		};	//End of pagination
		
	//datepicker {sonali}	
		$scope.today = function() 
		{
			$scope.dt = new Date();
		};
		$scope.today();
		$scope.open = function($event)
		{
			$event.preventDefault();
			$event.stopPropagation();
			$scope.opened = true;
		};
		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};

		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
	/* Date Picker Ended here --------------------------------------------------------------------------------------*/
	
	};

	// Inject controller's dependencies
	manageuserController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('manageuserController', manageuserController);
	
});

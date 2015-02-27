'use strict';

define(['app'], function (app) { 
    var injectParams = ['$scope', '$injector', '$routeParams','$location']; /* Added $routeParams to access route parameters */
    // This is controller for this view
	var manageuserController = function ($scope, $injector, $routeParams,$location) {
		console.log("this is manageuserController");
		
		$scope.userPart = $routeParams.userPart; 
		console.log($scope.userPart);
		//For display by default usersgroup.html page{trupti}
		if(!$routeParams.userPart) {
		$location.path('/dashboard/users/usersgroup');
		}
		templateUrl:'http://localhost/trupti/SmallBusiness/app/modules/users/manageuser/usersgroup.html';
		
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

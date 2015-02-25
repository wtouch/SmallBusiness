'use strict';

define(['app'], function (app) { 
    var injectParams = ['$scope', '$injector', '$routeParams']; /* Added $routeParams to access route parameters */
    // This is controller for this view
	var manageuserController = function ($scope, $injector, $routeParams) {
		console.log("this is manageuserController ctrl");
	
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
    };
	
	// Inject controller's dependencies
	manageuserController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('manageuserController', manageuserController);
	
	
});

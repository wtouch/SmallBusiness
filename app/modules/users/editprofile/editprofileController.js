
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector'];

    // This is controller for this view
	var editprofileController = function ($scope,$injector) {
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
			$scope.opened = ($scope.opened==true)?false:true;
		};
		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};

		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
	/* Date Picker Ended here --------------------------------------------------------------------------------------*/
	
	
	console.log("this is editprofile ctrl");
		templateUrl:'http://localhost/trupti/SmallBusiness/app/modules/mybusiness/addbusiness/editprofile.html';
    };
	// Inject controller's dependencies
	editprofileController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('editprofileController', editprofileController);
});

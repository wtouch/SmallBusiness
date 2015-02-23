
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$location','$routeParams'];
	
    // This is controller for this view
	var addbusinessController = function ($scope,$injector,$location,$routeParams) {
	console.log("this is addbusiness ctrl");
		templateUrl:'http://localhost/trupti/SmallBusiness/app/modules/business/addbusiness/addbusiness.html';
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
		$scope.dateOptions = 
		{
		   formatYear: 'yy',
		   startingDay: 1
		};

		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
    };
	// Inject controller's dependencies
	addbusinessController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('addbusinessController', addbusinessController);
});

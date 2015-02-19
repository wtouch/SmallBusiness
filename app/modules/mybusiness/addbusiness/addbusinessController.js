

'use strict';

define(['app', 'css!modules/mybusiness/addbusiness/addbusiness.css'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams'];

    // This is controller for this view
	var addbusinessController = function ($scope, $injector, $routeParams)
	{
		console.log("this is addbusiness ctrl ");
		$scope.goBack = function() 
		{
			window.history.back();
		};
	
	
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
		
		
		$scope.Businessprofile = $routeParams; /* this object will check list of mails show or single mail show */
		
		templateUrl:'http://localhost/sonali/SmallBusiness/app/modules/mybusiness/addbusiness/businessprofile.html';
		$scope.goBack = function() 
		{
			window.history.back();
		};
		
		$scope.newPage = function (){
			location.href = '#/template.html';
			consol.log("Hiii");
		};
		
		
    };
	
	// Inject controller's dependencies
	addbusinessController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('addbusinessController', addbusinessController);

});



/*
angular.module('ui.bootstrap.demo').controller('addbusinessController', function ($scope) {
  $scope.today = function() {
	   $scope.dt = new Date();
		};
	  $scope.today();
	  $scope.open = function($event) {
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
});
  /*
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
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
});*/
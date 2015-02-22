

'use strict';

define(['app', 'css!modules/business/addbusiness/addbusiness.css'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$location'];

    // This is controller for this view
	var businessController = function ($scope, $injector, $routeParams,$location)
	{
		console.log("this is addbusiness ctrl ");
		
	
	
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
		
		// This will change businessView dynamically from 'business.html'
		$scope.businessView = $routeParams.businessView;
		console.log($scope.businessView );
		
		// Add Business multi part form show/hide operation from here!
		$scope.formPart = 'home';
		console.log($scope.formPart);
		$scope.showFormPart = function(formPart){
			$scope.formPart = formPart;
		};
		
		
		
		
	
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
	businessController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('businessController', businessController);

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
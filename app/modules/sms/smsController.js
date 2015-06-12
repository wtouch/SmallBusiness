'use strict';

define(['app'], function (app) { 
    var injectParams = ['$scope','$rootScope', '$injector', '$routeParams','$location','dataService','$route','$notification']; 
   
	var smsController = function ($scope,$rootScope, $injector, $routeParams,$location,dataService,$route,$notification) {
		
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.pageItems = 10;
		$scope.numPages = "";	
		
		$scope.currentDate = dataService.currentDate;
		$scope.userInfo = {user_id : $rootScope.userDetails.id};
		
		$scope.manage_user = dataService.config.manage_user;
		$scope.smsView = $routeParams.smsView;
		
		//For display by default userslist.html page
		if(!$routeParams.smsView) {
			$location.path('/dashboard/sms/sms');
		}
	
		};	
	};
	// Inject controller's dependencies
	smsController.$inject = injectParams;
	// adduser/apply controller dynamically
    app.register.controller('smsController', smsController);
});

'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope', '$injector','dataService','$location', '$cookieStore', '$cookies'];

    // This is controller for this view
	var loginController = function ($scope,$rootScope,$injector,dataService,$location, $cookieStore, $cookies) {
		console.log($cookies);
		($rootScope.alerts) ? $scope.alerts = $rootScope.alerts : $scope.alerts = [];
		//function for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		$scope.insert = function(login){
			
			dataService.post("/post/user/login",$scope.login)
			.then(function(response) {
				if(response.status == 'success'){
					$location.path("/dashboard");
					$cookieStore.put("vilas", "vilas");
				}else{
					$scope.alerts.push({type: (response.status == 'error') ? "danger" :response.status, msg: response.message});
					$cookieStore.remove("vilas");
				}
			})
		}	

    };
	// Inject controller's dependencies
	loginController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('loginController', loginController);
});

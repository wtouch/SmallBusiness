
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope', '$injector','dataService','$location', '$cookieStore', '$cookies', '$routeParams','$notification'];

    // This is controller for this view
	var loginController = function ($scope,$rootScope,$injector,dataService,$location, $cookieStore, $cookies,$routeParams,$notification) {
		
		console.log("this is login controller");
		
		//function to login user
		$scope.insert = function(login){
				$location.path("/dashboard");
			dataService.post("post/user/login",login)
			.then(function(response) {
				if(response.status == 'success'){
					$location.path("/dashboard");
					dataService.setUserDetails(dataService.parse(response.data));
					if($scope.login.remember){
						dataService.rememberPass(true);
					}
					dataService.setAuth(true);
					$rootScope.userDetails = dataService.userDetails;
				}
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Login", response.message);
			}) 
		}
	};
	// Inject controller's dependencies
	loginController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('loginController', loginController);
});

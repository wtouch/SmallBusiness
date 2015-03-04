
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$http'];

    // This is controller for this view
	var loginController = function ($scope,$injector,$http) {
		console.log("this is login ctrl");
		$scope.insert = function(login){
			//console.log($scope.user);
			console.log($scope.login);
			$http.post("../server-api/index.php/post/user",$scope.login)
			.success(function(response) {
				//alert(response);
				console.log(response);
			})
		}	
		templateUrl:'http://localhost/trupti/SmallBusiness/app/modules/dashboard/dashboard.html';
    };
	// Inject controller's dependencies
	loginController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('loginController', loginController);
});

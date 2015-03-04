
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$injector','$http'];

    // This is controller for this view
	var registerController = function ($scope,$injector,$http) {
		console.log("this is register ctrl");
		//templateUrl:'http://localhost/trupti/SmallBusiness/app/modules/users/register/register.html';
		$scope.insert = function(){
			//console.log($scope.user);
			console.log($scope.reg);
			$http.post("../server-api/index.php/post/user",$scope.reg)
			.success(function(response) {
				//alert(response);
				//$scope.reset();
				console.log(response);
			})
		}	
		
    };
	// Inject controller's dependencies
	registerController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('registerController', registerController);
});

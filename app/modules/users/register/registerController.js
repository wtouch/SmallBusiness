
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$injector','dataService'];

    // This is controller for this view
	var registerController = function ($scope,$injector,dataService) {
		console.log("this is register ctrl");
		//templateUrl:'http://localhost/trupti/SmallBusiness/app/modules/users/register/register.html';
		$scope.passMatch = function(pass1, pass2){
			$scope.pass = (pass1===pass2) ? true : false;
			//alert($scope.pass);
		}
		
		$scope.insert = function(register){
			$scope.params = {url:'login'};
			//angular.extend($scope.register, register)
			dataService.post("post/user", register, $scope.params)
			.then(function(response) {
				//alert(response);
				console.log(response);
			},function(err){
				console.log(err);
			})
		}	
		
    };
	// Inject controller's dependencies
	registerController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('registerController', registerController);
});

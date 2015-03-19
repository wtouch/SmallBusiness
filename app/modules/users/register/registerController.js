
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$injector','dataService'];

    // This is controller for this view
	var registerController = function ($scope,$injector,dataService) {
		
		$scope.passMatch = function(pass1, pass2){
			$scope.pass = (pass1===pass2) ? true : false;
		}
		
		$scope.alerts = [];
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		$scope.register = {address:{}};
		
		//check availability
		$scope.checkuserAvailable = function(fieldName, fieldValue){
			$scope.checkParams = {};
			$scope.checkParams[fieldName] = fieldValue;
			dataService.post("post/user/checkavailability",$scope.checkParams)
			.then(function(response) {  
				if(response.status == 'success'){
					$scope.registerForm[fieldName].$setValidity('available', true);
				}else{
					$scope.registerForm[fieldName].$setValidity('available', false);
				}
				$scope.availabilityMsg = response.message;
			});
		} 
		
		
		
		$scope.contries = dataService.config.country;

		$scope.getState = function(country){
			var states = [];
			for (var x in $scope.contries){
				if($scope.contries[x].country_name == country){
					for(var y in $scope.contries[x].states){
						states.push($scope.contries[x].states[y])
					}
				}
			}
			$scope.states = states;
		};
		$scope.getCities = function(state){
			var cities = [];
			for (var x in $scope.states){
				if($scope.states[x].state_name == state){
					for(var y in $scope.states[x].cities){
						cities.push($scope.states[x].cities[y])
					}
				}
			}
			$scope.cities = cities;
		};
		$scope.submitted = false;
		$scope.insert = function(register){
			$scope.params = {url:'login'};
			console.log(register);
			//angular.extend($scope.register, register)
			dataService.post("post/user/register", register)
			.then(function(response) {
				if(response.status == 'success'){
					$scope.submitted = true;
				}
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

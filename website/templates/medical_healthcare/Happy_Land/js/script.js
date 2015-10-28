'use strict';
var app = angular.module('myApp',[]);

	
/*********************************Traning controller***********************/	
app.controller('trainingController', function($scope,$http, $location) {

console.log("trainingController");
	$scope.postData = function(training){
		console.log(training);
		$http.post("/server-api/index.php/post/training", training).success(function(response) {
			console.log(response);
		}); 
	};
	

});	
	

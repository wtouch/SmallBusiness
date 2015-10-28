'use strict';
var app = angular.module('myApp',[]);

	
/*********************************Traning controller***********************/	
app.controller('trainingController', function($scope,$http, $location) {
	$scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];
	$scope.today = function() {
		$scope.date = new Date();
	};
	$scope.open = function($event,opened){
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = ($scope.opened==true)?false:true;
		$scope.isCollapsed = true;
	};
	$scope.postData = function(training){
		console.log(training);
		$http.post("/server-api/index.php/post/training", training).success(function(response) {
			console.log(response);
		}); 
	};
});	
	

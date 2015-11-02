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
	$scope.isSend = false;
	$scope.postData = function(addtraining){
		console.log(addtraining);
		$http.post("/server-api/index.php/post/training", addtraining).success(function(response) {
				if(response.status=='success'){
					$scope.isSend = true;
					//alert("Record Inserted Successfully");
				}
			console.log(response);
		}); 
	};
});	
	

'use strict';
var hostUrl = '/website/templates/default/';

var app = angular.module('myApp',[]);

app.config(function($locationProvider) {
  /* $routeProvider
   .when('/:view', {
    templateUrl: function(rd) { return hostUrl+"/"+rd.view+'.html';}
  })
  .otherwise({ redirectTo: '/home' }); */
});
app.controller('enquiryController', function($scope,$http, $location) {
	$scope.hostUrl = hostUrl;
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth() + 1;
	var date = today.getDate();
	var hour = today.getHours();
	var min = today.getMinutes();
	var sec = today.getSeconds();
	$scope.mailSent = false;
	
	var params = {table : "config", config_name : "property"};
	$http({
		url: '/server-api/index.php/getmultiple/config/1/1',
		method: "GET",
		params: params
	}).then(function (results) {
		console.log(results);
		if(results.data.status == 'success'){
			$scope.propertyConfig = results.data.data.config_data;
		}else{
			$scope.propertyConfig = results.data.data;
		}
	});
	$scope.enquiry = {
		date : year + "-" + month + "-" + date + " " + hour + ":" + min + ":"+sec
	};
	$scope.postData = function(enquiry){
		$scope.loading = true;
		console.log(enquiry);
		  $http.post("/server-api/index.php/post/enquiry", $scope.enquiry).success(function(response) {
			$scope.loading = false;
			$scope.mailSent = true;
		}); 
	};
});	
	app.controller('aboutController', function($scope,$http, $location) {
		var s = $location.path();
		$scope.url = s.substr(1);
		$scope.makeActive = function(url){
			$scope.id = url;
		}
		$scope.makeActive($scope.url);
		
	});
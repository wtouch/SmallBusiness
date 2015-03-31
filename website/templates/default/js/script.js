'use strict';
var hostUrl = '/website/templates/default/';

var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/:view', {
    templateUrl: function(rd) { return hostUrl+"/"+rd.view+'.html';}
  })
  .otherwise({ redirectTo: '/home' });
});
app.controller('enquiryController', function($scope,$http, $route, $location) {
	$scope.hostUrl = hostUrl;
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth() + 1;
	var date = today.getDate();
	var hour = today.getHours();
	var min = today.getMinutes();
	var sec = today.getSeconds();
	$scope.mailSent = false;
	$http.get("/sitedata").success(function(response){
		if(response.status == "success"){
			$scope.config = response.config;
			$scope.hostUrl = response.config.http_template_path + response.webTemplate.template_folder+"/";
			$scope.business = response.webData.business;
			$scope.products = response.webData.products;
			$scope.services = response.webData.services;
			$scope.routes = response.webRoutes;
			$scope.enquiry = {
				user_id : $scope.business.user_id,
				to_email : {to : $scope.business.owner_email},
				subject : 'Website Enquiry',
				date : year + "-" + month + "-" + date + " " + hour + ":" + min + ":"+sec
			};
			console.log($scope.enquiry);
		}
	});
	
	$scope.postData = function(enquiry){
		$http.post("../server-api/index.php/post/enquiry", $scope.enquiry).success(function(response) {
				$scope.mailSent = true;
		});
	};

});
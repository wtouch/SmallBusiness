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
	$scope.enquiry = {
				subject : 'Website Enquiry',
				date : year + "-" + month + "-" + date + " " + hour + ":" + min + ":"+sec
			};
	$scope.postData = function(enquiry){
		$http.post("/server-api/index.php/post/enquiry", $scope.enquiry).success(function(response) {
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
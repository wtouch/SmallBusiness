'use strict';
var hostUrl = '/website/templates/default/';
$(document).ready(function(){
	$('.bxslider').bxSlider({
		mode:'horizontal',
		slideWidth: 250,
		minSlides:3,
		maxSlides: 3,
		slideMargin: 25,
		auto: true, 
		autoDirection:'next',
		moveSlides: 2,
		pause:2500,
		pager:true,
		pagerType:'full',
		autoControls: true, 
		controls:true, 
		autoHover:true,
		speed:1000,
	});
	$('.bxslider1').bxSlider({
		mode:'vertical',
		slideWidth: 600,
		minSlides: 4,
		maxSlides:4,
		slideMargin: 15,
		auto: true, 
		autoDirection:'next',
		moveSlides: 2,
		pause:5000,
		pager:false,
		pagerType:'full',
		autoControls: false, 
		controls:false, 
		autoHover:true,
		speed:2000,
	});
});
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
		subject : 'Website Enquiry',
		date : year + "-" + month + "-" + date + " " + hour + ":" + min + ":"+sec
	};
	$scope.postData = function(enquiry){
		console.log(enquiry);
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
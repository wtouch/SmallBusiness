'use strict';
var hostUrl = '/website/templates/default/';
$(document).ready(function(){
	$('.bxslider').bxSlider({
		mode:'horizontal',
		slideWidth: 250,
		minSlides:3,
		maxSlides: 4,
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
	$('.bxslidervertical').bxSlider({
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
/* app.factory("factories",function ($http) {
	var obj = {};
	obj.config = function(table, params){
		if(params == undefined) params = {};
		params.table = table;
		return $http({
			url: serviceBase +'getmultiple/config/1/1',
			method: "GET",
			params: params
		}).then(function (results) {
			if(results.data.status == 'success'){
				return obj.parse(results.data.data);
			}else{
				return obj.parse(results.data.data);
			}
		});
	};
}); */
app.controller('enquiryController', function($scope,$http, $location) {
	$scope.hostUrl = hostUrl;
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth() + 1;
	var date = today.getDate();
	var hour = today.getHours();
	var min = today.getMinutes();
	var sec = today.getSeconds();
	
	/* factories.config('config', {config_name : "property"}).then(function(response){
		$scope.propertyConfig = response.config_data;
	}); */
	
	$scope.getData = function(location){
		$scope.readOnly = true;
		$scope.enquiry.message.location = location.location;
		$scope.enquiry.message.city = location.city;
		$scope.enquiry.message.state = location.state;
		$scope.enquiry.message.country = location.country;
		$scope.enquiry.message.area = location.area;
		$scope.enquiry.message.pincode = location.pincode;
	}
	$scope.getTypeaheadData = function(table,searchColumn, searchValue){
		var locationParams = {search : {}}
		locationParams.search[searchColumn] = searchValue;
		return dataService.config('locations', locationParams).then(function(response){
			return response;
		});
	}
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
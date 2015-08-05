'use strict';
var hostUrl = '/website/templates/default/';
jQuery(document).ready(function() {
	jQuery(".subimgs").click(function(){
		jQuery(".mainimgs").attr("src",(jQuery(this).attr("src")))
	})
});
$(document).ready(function(){
	$('.bxslider1').bxSlider({
			mode:'vertical',
			minSlides: 1,
			auto: true, 
			autoDirection:'next',
			moveSlides: 1,
			pause:3000,
			pager:false,
			pagerType:'full',
			autoControls: false, 
			controls:false, 
			autoHover:true,
			speed : 1000
	});
	$('.bxslider').bxSlider({
		mode:'horizontal',
		slideMargin: 5,
		minSlides :3,
		maxSlides: 3,
		moveSlides: 1,
		slideWidth: 210,
		auto: true, 
		autoDirection:'next',
		pause:3000,
		pager:false,
		pagerType:'full',
		autoControls: false, 
		controls:true, 
		autoHover:true,
		speed : 1000
	});
	$('#bxslider3').bxSlider({
		mode:'horizontal',
		slideMargin: 5,
		minSlides :3,
		maxSlides: 3,
		moveSlides: 3,
		//slideWidth: 600,
		auto: true, 
		autoDirection:'next',
		pause:4000,
		pager:false,
		pagerType:'full',
		autoControls: false, 
		controls:true, 
		autoHover:true
	});
	$('#carousslider').bxSlider({
		mode:'fade',
		slideWidth: 600,
		slideHeight:500,
		
		auto: true, 
		autoDirection:'next',
		pause:2500,
		pager:true,
		pagerType:'full',
		autoControls: false, 
		controls:false, 
		autoHover:true,
		speed:1000,
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
		$scope.loading = true;
		$http.post("/server-api/index.php/post/enquiry", $scope.enquiry).success(function(response) {
				if(response.status == 'success'){
					$scope.loading = false;
					$scope.mailSent = true;
				}
				else{
					alert(response.message);
				}
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
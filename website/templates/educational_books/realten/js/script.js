'use strict';
var hostUrl = '/website/templates/default/';
$(document).ready(function(){
	$('#bxslider1').bxSlider({
			mode:'vertical',
			minSlides: 1,auto: true, 
			autoDirection:'next',
			moveSlides: 1,
			pause:4000,
			pager:false,
			pagerType:'full',
			autoControls: false, 
			controls:false, 
			autoHover:true,
			speed : 1000
	});
	$('#bxslider').bxSlider({
		mode:'horizontal',
		slideMargin: 5,
		minSlides :1,
		maxSlides: 4,
		moveSlides: 2,
		slideWidth: 200,
		auto: true, 
		autoDirection:'next',
		pause:4000,
		pager:false,
		pagerType:'full',
		autoControls: false, 
		controls:true, 
		autoHover:true
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
	$scope.enquiry = {
				subject : 'Website Enquiry',
				date : year + "-" + month + "-" + date + " " + hour + ":" + min + ":"+sec
			};
	$scope.postData = function(enquiry){
		$http.post("/server-api/index.php/post/enquiry", $scope.enquiry).success(function(response) {
				$scope.loading = true;
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
'use strict';
var hostUrl = '/website/templates/default/';

$(document).ready(function(){
	jQuery(".subimgs").click(function(){
		jQuery(".mainimgs").attr("src",(jQuery(this).attr("src")))
	})
	 /* $(window).scroll(function(e){
		var scrollTop = $(document).scrollTop();
		if(scrollTop > 0){
			console.log(scrollTop);
			$('nav').removeClass('navbar-static-top').addClass("navbar-fixed-top");
		} else {
			$('nav').removeClass("navbar-fixed-top").addClass('navbar-static-top')
		}
	});  */
	$(window).scroll(function(e){
		var scrollTop = $(document).scrollTop();
		if(scrollTop > 800){
			console.log(scrollTop);
			$('featured_gallery').addClass("anim1");
		} else {
			$('featured_gallery').removeClass("anim1")
		}
	}); 
	
 	// This is for Cookie
	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(name) == 0) return true;
		}
		return false;
	}
	var cookieExpiry = new Date();
	cookieExpiry.setMinutes(cookieExpiry.getMinutes() + 30);
	var cookieTime = cookieExpiry.toUTCString();
	if(getCookie('anim') == false){
		document.cookie="anim=true; expires=" + cookieTime;
	}else{
		$(".anim2, .anim4").hide();
		$(".anim1").removeClass("anim1");
		console.log(getCookie('anim'));
	} 
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
	$scope.mailSent = false;

	$scope.enquiry = {
		message : {
			property_for :0
		},
		subject : 'Website Enquiry',
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
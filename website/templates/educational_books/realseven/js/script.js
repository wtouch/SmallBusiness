'use strict';
var hostUrl = '/website/templates/default/';
jQuery(document).ready(function() {
	jQuery(".subimgs").click(function(){
		jQuery(".mainimgs").attr("src",(jQuery(this).attr("src")))
	})
	$(".block-menu >li >a").addClass('three-d').append(function(n,txt){

            return '<span class="three-d-box"><span class="front">'+ txt +'</span><span class="back">'+ txt +'</span></span>';

        });
});

			jQuery(document).ready(function(){

		jQuery('#featuredProject,#featuredProp,#featuredService, #featuredProduct').carousel({

		  interval: 4000

		})

		jQuery('.carousel .item').each(function(){

		  var next = jQuery(this).next();

		  if (!next.length) {

			next = jQuery(this).siblings(':first');

		  }

		  next.children(':first-child').clone().appendTo(jQuery(this));

		  for (var i=0;i<2;i++) {

			next=next.next();

			if (!next.length) {

				next = jQuery(this).siblings(':first');

			}

			next.children(':first-child').clone().appendTo(jQuery(this));

		  }

		});	

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
		slideMargin: 10,
		minSlides :1,
		maxSlides: 3,
		moveSlides: 1,
		slideWidth: 250,
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
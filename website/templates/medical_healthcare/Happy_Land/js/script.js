'use strict';
var hostUrl = '/website/templates/default/';
jQuery(document).ready(function() {
	jQuery(".subimgs").click(function(){
		jQuery(".mainimgs").attr("src",(jQuery(this).attr("src")))
	})
});

$(document).ready(function(){
    $("featured_services.html").onload(function(){
        $(".this").fadeIn();
        $(".this").fadeIn("slow");
        $(".this").fadeIn(3000);
    });
});





$(document).ready(function(){
	var sliderMode, minSlides, maxSlides;
	//$(window).resize(function(){
		if($(window).width() <= "480"){
			sliderMode = "horizontal";
			minSlides = 1;
			maxSlides = 1;
			
		}else{
			sliderMode = "vertical";
			minSlides = 3;
			maxSlides = 3;
		}
	//})
	$('#bxslider').bxSlider({
		mode:'horizontal',
		slideWidth: 250,
		minSlides: minSlides,
		maxSlides: maxSlides,
		slideMargin: 25,
		auto: true, 
		autoDirection:'next',
		moveSlides: 1,
		pause:3000,
		pager:true,
		pagerType:'full',
		autoControls: true, 
		controls:true, 
		autoHover:true,
		speed:1000,
	});
	$('#associate').bxSlider({
		mode:'horizontal',
		slideWidth: 300,
		minSlides: minSlides,
		maxSlides: maxSlides,
		slideMargin: 25,
		auto: true, 
		autoDirection:'next',
		moveSlides: 1,
		pause:3000,
		pager:true,
		pagerType:'full',
		autoControls: true, 
		controls:true, 
		autoHover:true,
		speed:1000,
	});
	$('.bxslider1').bxSlider({
		mode: sliderMode,
		slideWidth: 680,
		minSlides: minSlides,
		maxSlides: maxSlides,
		slideMargin: 15,
		auto: true, 
		autoDirection:'next',
		moveSlides: 1,
		pause:3000,
		pager:false,
		pagerType:'full',
		autoControls: false, 
		controls:false, 
		autoHover:true,
		speed:1000,
	});
	$('.carousslider').bxSlider({ 
		mode:'fade',
		minSlides:1,
		maxSlides: 1,
		auto: true, 
		autoDirection:'next',
		pause:2500,
		pager:false,
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

	app.controller('aboutController', function($scope,$http, $location) {
		var s = $location.path();
		$scope.url = s.substr(1);
		$scope.makeActive = function(url){
			$scope.id = url;
		}
		$scope.makeActive($scope.url);
		
	});
	
/*********************************Traning controller***********************/	
app.controller('trainingController', function($scope,$http, $location) {
	$scope.hostUrl = hostUrl;
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth() + 1;
	var date = today.getDate();
	var hour = today.getHours();
	var min = today.getMinutes();
	var sec = today.getSeconds();
	
	var params = {table : "training", config_name : "property"};
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
	$scope.postData = function(training){
		$scope.loading = true;
		console.log(training);
		 $http.post("/server-api/index.php/post/training", $scope.training).success(function(response) {
			 $scope.loading = false;
			$scope.mailSent = true;
		});
	};
	/*****************modalOptions*******************************/
	$scope.openTrainingForm= function (url,traningData) {
		var modalDefaults = {
			templateUrl: url,	
			size : 'lg'
		};
		var modalOptions = {
			date : $scope.currentDate,
			traningData : traningData,
			
		/*	getParty: function(modalOptions){
				dataService.get("getmultiple/user/1/100", {status: 1, user_id : $rootScope.userDetails.id}).then(function(response){
					modalOptions.customerList = (response.data);
				});
			},*/
			postData : function(traningData) {
			 dataService.post("post/traning",traningData)
			.then(function(response) {  
				if(response.status == "success"){
					$scope.getContact($scope.CurrentPage);
				}
				 if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Traning Details Added", response.message); 
			});
			}, 
			updateData : function(id,traningData) {
				dataService.put("put/traning/"+ contactData.id,traningData)
				.then(function(response) {
					if(response.status == "success"){
						$scope.getContact($scope.CurrentPage);
					}
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Record Updated", response.message);
				});
			} 
		};
		modalService.showModal(modalDefaults, modalOptions).then(function (result) {
		});
	};

});	
	

'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$location','dataService','upload','modalService'];

    // This is controller for this view
	var addbusinessController = function ($scope, $injector,$routeParams,$location,dataService,upload,modalService)
	{
		//for display form parts
		$scope.formPart = $routeParams.formPart;
		// all $scope object goes here
		$scope.alerts = [];
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.userDetails = {user_id : 2};
		
		// Add Business multi part form show/hide operation from here! {Vilas}
		$scope.formPart = 'home';
		console.log($scope.formPart);
		$scope.showFormPart = function(formPart){
			$scope.formPart = formPart;
		};
		$scope.infrastructure = {};
		$scope.addToObject = function(data, object){
			object[data.infraHeading] = data.infraDesc;
		}	
		$scope.removeObject = function(key, object){
			delete object[key];
		}

		//Upload Function for uploading files {Vilas}
		$scope.addbusiness={}; // this is form object
		$scope.addbusiness.infrastructure = {};
		$scope.userinfo = {userId:1, name:"vilas"}; // this is for uploading credentials
		$scope.path = "business/"; // path to store images on server
		$scope.addbusiness.business_logo  = []; // uploaded images will store in this array
		$scope.addbusiness.contact_profile = {};
		$scope.addbusiness.contact_profile.contact_photo  = [];
		$scope.addbusiness.testimonials = {};
		$scope.addbusiness.testimonials.testimage  = [];
		$scope.addbusiness.news_coverage = {};
		$scope.addbusiness.news_coverage.news_image  = [];
		$scope.addbusiness.infrastructure.infra_image  = [];	
		
		$scope.upload = function(files,path,userinfo, picArr){ // this function for uploading files
			upload.upload(files,path,userinfo,function(data){
				if(data.status === 'success'){
					picArr.push(JSON.stringify(data.details));
					console.log(data.message);
				}else{
					$scope.alerts.push({type: response.status, msg: response.message});
				}
				
			});
		};
		$scope.generateThumb = function(files){  // this function will generate thumbnails of images
			upload.generateThumbs(files);
		};// End upload function
		
		//method for insert data of add businessProfile form{sonali}
		
		
		/************************************************************************************/
		// add business form code here
		angular.extend($scope.addbusiness, $scope.userDetails);
		
		console.log($scope.addbusiness);
		//reset function{sonali}
		$scope.reset = function() {
			$scope.addbusiness = {};
		};
		//post method for insert data in request businessprofile form{sonali}
		$scope.postData = function(addbusiness) { 
			$scope.addbusiness.user_id = $scope.userDetails.user_id;
			dataService.post("post/business",addbusiness,$scope.user_id)
				.then(function(response) {  //function for response of request temp
					$scope.addbusiness = response.data;
					console.log(response);
					$scope.reset();
				});
			//console.log(addbusiness);
		}//end of post method{sonali}
		
		//datepicker {sonali}
		$scope.today = function(){
			$scope.newsDate = new Date();
		};
		$scope.today();
		$scope.open = function($event,opened)
		{
			$event.preventDefault();
			$event.stopPropagation();
			$scope[opened] = ($scope[opened]===true) ? false : true;
		};
		$scope.dateOptions ={
			formatYear: 'yy',
			startingDay: 1
		};

		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		/* Date Picker Ended here --------------------------------------------------------------------------------------*/
		
		
		
		
    };
	
	// Inject controller's dependencies
	addbusinessController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('addbusinessController', addbusinessController);

});

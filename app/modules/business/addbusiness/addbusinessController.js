'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$location','dataService','upload','modalService', '$rootScope'];

    // This is controller for this view
	var addbusinessController = function ($scope, $injector,$routeParams,$location,dataService,upload,modalService, $rootScope)
	{
		//for display form parts
		$scope.formPart = $routeParams.formPart;
		// all $scope object goes here
		$scope.alerts = [];
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.userDetails = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		
		// Add Business multi part form show/hide operation from here! {Vilas}
		$scope.formPart = 'home';
		console.log($scope.formPart);
		$scope.showFormPart = function(formPart){
			$scope.formPart = formPart;
		};
		$scope.infrastructure = {};
		$scope.infrastructure.desc = {};
		$scope.job_careers = {};
		$scope.job_careers.desc = {};
		$scope.testimonials = {};
		$scope.testimonials.desc = {};
		$scope.news_coverage = {};
		$scope.news_coverage.desc = {};
		
		$scope.addToObject = function(data, object){
			object[data.heading] = data.desc;
		}
		
		$scope.removeObject = function(key, object){
			delete object[key];
		}

		//Upload Function for uploading files {Vilas}
		$scope.addbusiness={}; // this is form object
		$scope.addbusiness.created_date = $scope.currentDate
		$scope.addbusiness.infrastructure = {};
		$scope.addbusiness.job_careers = {};
		$scope.addbusiness.testimonials = {};
		$scope.addbusiness.contact_profile = {};
		$scope.addbusiness.news_coverage = {};
		$scope.userinfo = $scope.userDetails; // this is for uploading credentials
		$scope.path = "business/"; // path to store images on server
		$scope.addbusiness.business_logo  = {}; // uploaded images will store in this object
		$scope.addbusiness.contact_profile.contact_photo  = {};	
		$scope.testimonials.desc.testimage  = {};	
		$scope.news_coverage.desc.news_image  = {};
		$scope.infrastructure.desc.infra_image  = {};
		
		$scope.upload = function(files,path,userinfo, picArr){ // this function for uploading files
			
			upload.upload(files,path,userinfo,function(data){
				var picArrKey = 0, x;
				for(x in picArr) picArrKey++;
				if(data.status === 'success'){
					picArr[picArrKey] = (JSON.stringify(data.details));
					console.log(data.message);
				}else{
					$scope.alerts.push({type: response.status, msg: response.message});
				}
				
			}); 
		};
		$scope.generateThumb = function(files){  // this function will generate thumbnails of images
			upload.generateThumbs(files);
		};// End upload function
			
		/************************************************************************************/
		// add business form code here{sonali}
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

		$scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		/* Date Picker Ended here --------------------------------------------------------------------------------------*/
		
		
		
		
    };
	
	// Inject controller's dependencies
	addbusinessController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('addbusinessController', addbusinessController);

});

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
		$scope.userInfo = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		
		console.log(dataService.config);
		// Add Business multi part form show/hide operation from here! {Vilas}
		$scope.formPart = 'home';
		console.log($scope.formPart);
		$scope.showFormPart = function(formPart){
			$scope.formPart = formPart;
		};
		
		/***********************************************************************
		code for add infrastructure,job_careers,testimonials and news_coverage */
		 $scope.infrastructure = {};
		$scope.infrastructure.desc = {};
		$scope.job_careers = {};
		$scope.job_careers.desc = {};
		$scope.testimonials = {};
		$scope.testimonials.desc = {};
		$scope.news_coverage = {};
		$scope.news_coverage.desc = {};
		
		$scope.addToObject = function(data, object){
			var dtlObj = JSON.stringify(data.desc);
			object[data.heading] = JSON.parse(dtlObj);
		}
		
		 $scope.addInfrastructure = function(data, object){
			$scope.addToObject(data, object);
			$scope.infrastructure = { desc : { infra_image  : {} }};
		}
		$scope.addJobsCareers = function(data, object){
			$scope.addToObject(data, object);
			$scope.job_careers = { desc : {} };
		}
		$scope.addTestimonials = function(data, object){
			$scope.addToObject(data, object);
			$scope.testimonials = { desc : { testimage : {} }};
		}
		$scope.addNewsCoverage = function(data, object){
			$scope.addToObject(data, object);
			$scope.news_coverage = { desc : { news_image : {} }};
		} 
		
		$scope.removeObject = function(key, object){
			delete object[key];
		} 
		//end of code
		
		/**********************************************************************
		code for accessing json data of business	{Sonali} */
		$scope.biz = {};
		$scope.biz = dataService.config.business;
		
		//end of code		
		
		/**********************************************************************
		code for accessing json data of country, State & City {Sonali}*/
		$scope.contries = dataService.config.country;
		$scope.getState = function(country){
			var states = [];
			for (var x in $scope.contries){
				if($scope.contries[x].country_name == country){
					for(var y in $scope.contries[x].states){
						states.push($scope.contries[x].states[y])
					}
				}
			}
			$scope.states = states;
		};
		$scope.getCities = function(state){
			var cities = [];
			for (var x in $scope.states){
				if($scope.states[x].state_name == state){
					for(var y in $scope.states[x].cities){
						cities.push($scope.states[x].cities[y])
					}
				}
			}
			$scope.cities = cities;
		};
		
		//for testimonial Country,State, City
		 $scope.countries = dataService.config.country;
		 $scope.getTestimonialState = function(country){
			var states = [];
			for (var x in $scope.countries){
				if($scope.countries[x].country_name == country){
					for(var y in $scope.countries[x].states){
						states.push($scope.countries[x].states[y])
					}
				}
			}
			$scope.states = states;
		};
		$scope.getTestimonialCities = function(state){
			var cities = [];
			for (var x in $scope.states){
				if($scope.states[x].state_name == state){
					for(var y in $scope.states[x].cities){
						cities.push($scope.states[x].cities[y])
					}
				}
			}
			$scope.cities = cities;
		}; 
		//end of code 
				
		/*************************************************************************
		Upload Function for uploading files {sonali}*/
		$scope.addbusiness={}; // this is form object
		$scope.addbusiness.created_date = $scope.currentDate
		$scope.addbusiness.contact_profile = {}	;
		$scope.path = "business/"; // path to store images on server
		$scope.addbusiness.business_logo  = {}; // uploaded images will store in this object
		$scope.addbusiness.contact_profile.contact_photo  = {};	
		
		$scope.addbusiness.infrastructure = {};
		$scope.addbusiness.job_careers = {};
		$scope.addbusiness.testimonials = {};	
		$scope.addbusiness.news_coverage = {};
		$scope.userinfo = $scope.userInfo; // this is for uploading credentials		
		$scope.testimonials.desc.testimage  = {};	
		$scope.news_coverage.desc.news_image  = {};
		$scope.infrastructure.desc.infra_image  = {}; 
		
		$scope.upload = function(files,path,userinfo, picArr){ // this function for uploading files
			
			upload.upload(files,path,userinfo,function(data){
				var picArrKey = 0, x;
				for(x in picArr) picArrKey++;
				if(data.status === 'success'){
					picArr[picArrKey] = data.details;
					console.log(data.message);
				}else{
					$scope.alerts.push({type: data.status, msg: data.message});
				}
				
			}); 
		};
		$scope.generateThumb = function(files){  // this function will generate thumbnails of images
			upload.generateThumbs(files);
		};// End upload function
			
		/***********************************************************************************
		add business form code here{sonali}*/
		
		angular.extend($scope.addbusiness, $scope.userInfo);
		
		console.log($scope.addbusiness);
		//reset function{sonali}
		$scope.reset = function() {
			$scope.addbusiness = {};
		};
		//post method for insert data in request businessprofile form{sonali}
		$scope.postData = function(addbusiness) { 
			dataService.post("post/business",addbusiness)
				.then(function(response) {  //function for response of request temp
					$scope.addbusiness = response.data;
					console.log(response);
					$scope.reset();
				});
			//console.log(addbusiness);
		}//end of post method
		
		//update data into addbusiness table
		 if(/* $scope.user_id */){//Update business		// use business id here	
			dataService.get("getsingle/business/"+$scope.user_id) // use business id here
			.then(function(response) {
					$scope.addbusiness = response.data;					
			});
			$scope.update = function(addbusiness){				
				console.log(addbusiness);						
				dataService.put("put/business/"+/* $scope.user_id */ ,addbusiness)  // use business id here
				.then(function(response) {  //function for response of request temp
					if(response.status == 'success'){
						$scope.submitted = true;
						$scope.alerts.push({type: response.status,msg: response.message});						
					}else{
						$scope.alerts.push({type: response.status,msg: response.message});
					}	
				});	 
			};	
		}		
		 
		/*****************************************************************************
		datepicker {sonali}*/
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
		
		// Date Picker Ended here 		
    };
	
	// Inject controller's dependencies
	addbusinessController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('addbusinessController', addbusinessController);

});

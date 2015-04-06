'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$location','dataService','upload','modalService', '$rootScope'];

    // This is controller for this view
	var addbusinessController = function ($scope, $injector,$routeParams,$location,dataService,upload,modalService, $rootScope)
	{
		// all $scope object goes here
		$scope.alerts = [];
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.userInfo = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
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
		
		//function for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		// Add Business multi part form show/hide operation from here! {Vilas}
		$scope.formPart = 'home';
		$scope.showFormPart = function(formPart){
			$scope.formPart = formPart;
		};
		
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
		
		dataService.get("getmultiple/user/1/100")
		.then(function(response) {
			$scope.selectUsers = response.data;
		});	
		
		$scope.addbusiness={
			created_date : $scope.currentDate,
			contact_profile : {contact_photo : {}},
			business_logo  : {},
		};
		$scope.reset = function() {
			$scope.addbusiness = {
				created_date : $scope.currentDate,
				contact_profile : {contact_photo : []},
				business_logo  : [],
			};
		};
		$scope.path = "business/"; // path to store images on server
		$scope.userinfo = $scope.userInfo; // this is for uploading credentials	
		
		//this upload function for uploading single image.{trupti}
		$scope.upload = function(files,path,userInfo, picArr){ // this function for uploading files
			upload.upload(files,path,userInfo,function(data){
		
				if(picArr){
					if(data.status === 'success'){
						$scope.addbusiness.business_logo = data.data;
						
						console.log($scope.addbusiness.business_logo);
					}else{
						$scope.alerts.push({type: data.status, msg: data.message});
					}
				}
			}); 
		};
		$scope.generateThumb = function(files){  // this function will generate thumbnails of images
			upload.generateThumbs(files);
		};// End upload function
			
		/***********************************************************************************
		add business form code here{sonali}*/
		
		//post method for insert data in request businessprofile form{sonali}
		$scope.postData = function(addbusiness) {
			dataService.post("post/business",addbusiness)
			.then(function(response) {  //function for response of request temp
				if(response.status == "success"){
					$scope.alerts.push({type: (response.status=='error') ? 'danger' : response.status, msg: response.message});
					
					setTimeout(function(){
						alert(response.data);
						$location.path("/dashboard/business/adddetails/"+response.data);
						$scope.$apply();
					}, 3000);
				}else{
					$scope.alerts.push({type: (response.status=='error') ? 'danger' : response.status, msg: response.message});
				}
				
			});
		}
		
		//get method for get data from business
		var addbusiness = function(){
			console.log(addbusiness);
			$scope.bizId = $routeParams.id;
			if($scope.bizId){
				dataService.get("getsingle/business/"+$scope.bizId)
				.then(function(response) {
					$scope.reset = function() {
						$scope.addbusiness = {
							business_logo : {},
							category : {},
							ownership : {},
							contact_profile : {}
						};
					angular.extend(response.data, $scope.addbusiness);
					$scope.addbusiness = response.data;
				};
				$scope.reset();
				console.log($scope.addbusiness);
			})
			}else{
				$scope.reset = function() {
					$scope.addbusiness = {
						business_logo : {},
							category : {},
							ownership : {},
							contact_profile : {}
					};
				};
				$scope.reset();
			}
		}
		$scope.updateData = function(addbusiness) {
				dataService.put("put/business/"+$scope.bizId,addbusiness)
				.then(function(response) {
					if(response.status == "success"){
						$scope.reset();
						setTimeout(function(){
							$location.path("#/dashboard/templates/mytemplates");
						},500);
					}
					$scope.alerts.push({type: response.status, msg: response.message});
				});
			}
    };
	
	// Inject controller's dependencies
	addbusinessController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('addbusinessController', addbusinessController);

});

'use strict';
define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$http','$rootScope','upload', '$timeout', 'dataService','$notification','$location'];
    // This is controller for this view
	var addpropertyController = function ($scope, $injector,$routeParams,$http,$rootScope, upload, $timeout,dataService,$notification,$location) {
		$rootScope.metaTitle = "Add Real Estate Property";
		
		// all $scope object goes here
		$scope.userinfo = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		$scope.property = { property_images : [],config : { google_map: {}}};
		$scope.path = "property";
		
		dataService.config('config', {config_name : "property"}).then(function(response){
			$scope.propertyConfig = response.config_data;
		});
		
		$scope.getData = function(location){
			$scope.readOnly = true;
			$scope.property.location = location.location;
			$scope.property.city = location.city;
			$scope.property.state = location.state;
			$scope.property.country = location.country;
			$scope.property.area = location.area;
			$scope.property.pincode = location.pincode;
		}
		$scope.getTypeaheadData = function(table,searchColumn, searchValue){
			var locationParams = {search : {}}
			locationParams.search[searchColumn] = searchValue;
			return dataService.config('locations', locationParams).then(function(response){
				return response;
			});
		}
		
		$scope.removeImg = function(item, imgObject) {
			imgObject.splice(item, 1);     
		};
		
		$scope.uploadMultiple = function(files,path,userinfo, picArr){
			upload.upload(files,path,userinfo,function(data){
				if(data.status === 'success'){
					picArr.property_images.push(data.data);
				}else{
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("", response.message);
				}
			});
		};
		
		dataService.get("getmultiple/user/1/500", {status: 1, user_id : $rootScope.userDetails.id})
		.then(function(response) {  
			if(response.status == 'success'){
				$scope.customerList = response.data;
			}else{
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Get Customers", response.message);
			}
		});
		
		$scope.upload = function(files,path,userinfo, picArr){ 
			upload.upload(files,path,userinfo,function(data){
				
				if(data.status === 'success'){
					picArr = data.data.file_relative_path;
					
				}else{
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Upload Images", response.message);
				}
				
			}); 
		};
		$scope.generateThumb = function(files){  
			upload.generateThumbs(files);
		};
	/*********************************************************************/
		// Add Business multi part form show/hide operation from here! 
		$scope.formPart = 'property';
		$scope.showFormPart = function(formPart){
			$scope.formPart = formPart;
		};
	/*********************************************************************/
	//display dynamic list from project table 
		dataService.get('getmultiple/project/1/500', $scope.userinfo)
			.then(function(response){		
				$scope.addProjName = response.data;				
			});
	/************************************************************************************/		
		//Add property
		$scope.addPropertyFun = function(property){	
			$scope.property.date = $scope.currentDate;
			dataService.post("post/property",property,$scope.userinfo)
			.then(function(response) {
				
				if(response.status=="success"){
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Post Property", response.message);
				}else{
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Post Property", response.message);
				}				
			}); 
		};
	/**********************************************************************************/
			//update into property
			 if($routeParams.id){//Update user
				console.log($routeParams.id);	
				dataService.get("getsingle/property/"+$routeParams.id)
				.then(function(response) {
						$scope.property = response.data;	
						console.log($scope.property);					
					});	
					
					$scope.update = function(property){	
						dataService.put("put/property/"+$routeParams.id,property)
						.then(function(response) { //function for response of request temp
							if(response.status == 'success'){
								$scope.submitted = true;
								if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
								$notification[response.status]("Put Property", response.message);						
							}else{
								if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
								$notification[response.status]("Put Property", response.message);
							}	
						});	  
					};	 
			}			
	/*********************************************************************/	
	 //display websites-domain into checkbox $scope.userinfo $routeParams.id
		dataService.get('getmultiple/website/1/200',$scope.userinfo)
		.then(function(response) {
			var websites = [];
			for(var id in response.data){
				var obj = {id: response.data[id].id, domain_name : response.data[id].domain_name};
				websites.push(obj);
			}
			$scope.websites = websites;
		})  
		
		$scope.$watchCollection('websites', function(newNames, oldNames) {	
		}); 
		$scope.checkAll = function(websites, checkValue) {			
			if(checkValue){
				$scope.property.domain = angular.copy(websites);
			}
		};  
	/*********************************************************************/	
	// Google Map
		$scope.initGoogleMap = function(latitude,longitude, zoom){
			$scope.property.config.google_map.latitude = latitude;
			$scope.property.config.google_map.longitude = longitude;
			$scope.map = {
				"center": {
					"latitude": latitude,
					"longitude": longitude
				},
				"zoom": zoom
			}; //TODO:  set location based on users current gps location 
			$scope.marker = {
				id: 0,
				coords: {
					latitude: latitude,
					longitude: longitude
				},
				options: { draggable: true },
				events: {
					dragend: function (marker, eventName, args) {
						$scope.property.config.google_map.latitude = $scope.marker.coords.latitude;
						$scope.property.config.google_map.longitude = $scope.marker.coords.longitude;
						
						$scope.marker.options = {
							draggable: true,
							labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
							labelAnchor: "100 0",
							labelClass: "marker-labels"
						};
					}
				}
			};
		}
		var events = {
			places_changed: function (searchBox) {
				var place = searchBox.getPlaces();
				if (!place || place == 'undefined' || place.length == 0) {
					return;
				}
				$scope.initGoogleMap(place[0].geometry.location.lat(), place[0].geometry.location.lng(), 15);
			}
		};
		$scope.searchbox = { template: 'modules/websites/websettings/searchbox.html', events: events };
		$scope.showPosition = function (position) {
			$scope.initGoogleMap(position.coords.latitude, position.coords.longitude, 5);
			$scope.$apply();
		}
		$scope.showError = function (error) {
			switch (error.code) {
				case error.PERMISSION_DENIED:
					$scope.error = "User denied the request for Geolocation."
					break;
				case error.POSITION_UNAVAILABLE:
					$scope.error = "Location information is unavailable."
					break;
				case error.TIMEOUT:
					$scope.error = "The request to get user location timed out."
					break;
				case error.UNKNOWN_ERROR:
					$scope.error = "An unknown error occurred."
					break;
			}
			$scope.initGoogleMap("19.7514798", "75.71388839999997", 5);
			$notification.error("Location Error", $scope.error);
			$scope.$apply();
		}
		$scope.getLocation = function () {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
			}
			else {
				$scope.error = "Geolocation is not supported by this browser.";
			}
		}
	/*************************************************************************/
	};		
	
	// Inject controller's dependencies
	addpropertyController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('addpropertyController', addpropertyController);
	
});

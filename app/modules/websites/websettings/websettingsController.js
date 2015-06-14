'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$rootScope','$injector','$routeParams','$location','dataService','upload','modalService','$notification'];

	var websettingsController = function ($scope,$rootScope,$injector,$routeParams,$location,dataService,upload,modalService,$notification) {
		$scope.permission = $rootScope.userDetails.permission.website_module;
		$scope.userInfo = {user_id : $rootScope.userDetails.id};
		$scope.website_id = $routeParams.id;
		$scope.currentDate = dataService.currentDate;
		$scope.userInfo = dataService.parse($rootScope.userDetails);
		$scope.websetting = {config : { google_map: {}}};
		$scope.isCollapsed = true;
		
		$scope.dragControlListeners = {
			accept: function (sourceItemHandleScope, destSortableScope) {
				return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
			}
		};
		
		//code for view single website details
		dataService.get("getsingle/website/"+$routeParams.id)
		.then(function(response) {
			if(response.status == 'success'){
				$scope.status = {status:1};
				angular.extend($scope.status, {user_id : response.data.user_id});
				dataService.get("getmultiple/business/1/100",$scope.status)
				.then(function(business) {
					if(business.status == 'success'){
						$scope.businessList = business.data;
						console.log($scope.businessList);
					}else{
						if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
						$notification.error("Get Business", "You didn't added any business! Please add business first.");
					}
				});
				
				//code for get business name from business
				$scope.status = {status:1};
				angular.extend($scope.status, {user_id : response.data.user_id});
				dataService.get("getmultiple/mytemplate/1/100",$scope.status)
				.then(function(template) {
					if(template.status == 'success'){
						$scope.templateList = template.data;
					}else{
						if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
						$notification.error("Get Template", "You didn't have any Template! Please apply free template or buy new template first.");
					}
				});
				
				$scope.websetting.business_id = response.data.business_id;
				$scope.websetting.template_id = response.data.template_id;
				$scope.websetting.user_id = response.data.user_id;
				
				if(response.data.config.menus == undefined){
					$scope.getMenulist(response.data.user_id, response.data.business_id);
				}
				
				var config = (response.data.config!='') ? (response.data.config) : { google_map : {}};
				angular.extend($scope.websetting.config,config);
				if(config.google_map.latitude != undefined && config.google_map.longitude != undefined){
					$scope.initGoogleMap(config.google_map.latitude, config.google_map.longitude, 18);
				}else{
					$scope.getLocation();
				}
			}else{
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Website Settings", response.message);
			};
		});
		
		
		$scope.getMenulist = function(user_id, business_id){
			console.log(user_id, business_id);
			$scope.seoParam = {user_id : user_id, status : 1, business_id : business_id};
				
				dataService.get("getmultiple/seo/1/100",$scope.seoParam)
				.then(function(response) {
					if(response.status == 'success'){
						$scope.websetting.config.menus = response.data;
					}else{
						if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
						$notification[response.status]("Menu Selection", response.message);
					}
				});
			
		}
		
		//update method for website settings form
		$scope.editWebsitedetails = function(config){
			dataService.put("put/website/"+$routeParams.id, config)
			.then(function(response) {
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Website Settings", response.message);
			}) 
		}
		
		// Google Map
		$scope.initGoogleMap = function(latitude,longitude, zoom){
			$scope.websetting.config.google_map.latitude = latitude;
			$scope.websetting.config.google_map.longitude = longitude;
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
						$scope.websetting.config.google_map.latitude = $scope.marker.coords.latitude;
						$scope.websetting.config.google_map.longitude = $scope.marker.coords.longitude;
						
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
    };
	//Inject controller's dependencies
	websettingsController.$inject = injectParams;
	//Register/apply controller dynamically
    app.register.controller('websettingsController', websettingsController);
});

'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$rootScope','$injector','$routeParams','$location','dataService','upload','modalService'];

    // This is controller for this view
	var websettingsController = function ($scope,$rootScope,$injector,$routeParams,$location,dataService,upload,modalService) {
	// all $scope object goes here
	$scope.userDetails = {user_id : $rootScope.userDetails.id};
	$scope.website_id=$routeParams.id;
	$scope.currentDate = dataService.currentDate;
	$scope.alerts = [];
	//this is for get business name from business
	dataService.get("getmultiple/business/1/100",$scope.userDetails)
			.then(function(response) {  //function for template list response
			//$scope.businessList.user_id=$scope.userDetails.user_id;
				if(response.status == 'success'){
					$scope.businessList = response.data;
					
				}else{
					
					$scope.alerts.push({type: response.status, msg: "You didn't added any business! Please add business first."});
				}
			});
			
			//this is for get business name from business{trupti}
			dataService.get("getmultiple/mytemplate/1/100",$scope.userDetails)
			.then(function(response) {  //function for template list response
			//$scope.templateList.user_id=$scope.userDetails.user_id;
				if(response.status == 'success'){
					$scope.templateList = response.data;
					
				}
				else{
					
					$scope.alerts.push({type: response.status, msg: "You didn't added any business! Please add business first."});
				}
			});
			
			//code for edit website details{trupti}
			$scope.userInfo = dataService.parse($rootScope.userDetails);
				dataService.get("getsingle/website/"+$routeParams.id,$scope.userDetails)
				.then(function(response) {  //function for my templates response
				if(response.status == 'success'){
					if(response.data.config!=''){
					var config = JSON.parse(response.data.config);
					$scope.config = config;
					console.log(config);
					}
					
				}
				else
				{
					$scope.alerts.push({type: response.status, msg: response.message});
				};
				//$scope.config = response.data;
			});
			//update method for website settings form{trupti}
			$scope.editWebsitedetails = function(config){
				dataService.put("put/website/"+$routeParams.id,{config : config})
				.then(function(response) {
					if(response.status == 'success'){
						$scope.alerts.push({type: response.status, msg: response.message});
					}else{
						$scope.alerts.push({type: (response.status == 'error') ? "danger" :response.status, msg: response.message});
					}
				}) 
			}
			
			
		// Google Map
		
		$scope.map = {
			"center": {
				"latitude": 18.520430299999997,
				"longitude": 73.8567437
			},
			"zoom": 5
		}; //TODO:  set location based on users current gps location 
		 $scope.marker = {
			id: 0,
			coords: {
				latitude: 18.520430299999997,
				longitude: 73.8567437
			},
			options: { draggable: true },
			events: {
				dragend: function (marker, eventName, args) {
					$scope.config.google_map.latitude = $scope.marker.coords.latitude;
					$scope.config.google_map.longitude = $scope.marker.coords.longitude;
					console.log($scope.config.google_map.latitude);
					console.log($scope.marker.coords);
					$scope.marker.options = {
						draggable: true,
						labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
						labelAnchor: "100 0",
						labelClass: "marker-labels"
					};
				}
			}
		};
		var events = {
			places_changed: function (searchBox) {
				var place = searchBox.getPlaces();
				if (!place || place == 'undefined' || place.length == 0) {
					console.log('no place data :(');
					return;
				}

				$scope.map = {
					"center": {
						"latitude": place[0].geometry.location.lat(),
						"longitude": place[0].geometry.location.lng()
					},
					"zoom": 18
				};

				$scope.marker = {
					id: 0,
					coords: {
						latitude: place[0].geometry.location.lat(),
						longitude: place[0].geometry.location.lng()
					},
					options: { draggable: true },
					events: {
						dragend: function (marker, eventName, args) {
							$scope.config.google_map.latitude = $scope.marker.coords.latitude;
							$scope.config.google_map.longitude = $scope.marker.coords.longitude;
							console.log($scope.config.google_map.latitude);
							console.log($scope.marker.coords);
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
		};

		$scope.searchbox = { template: 'modules/websites/websettings/searchbox.html', events: events };

		$scope.showPosition = function (position) {
				$scope.config.google_map.latitude = position.coords.latitude;
				$scope.config.google_map.longitude = position.coords.longitude;
				$scope.map = {
					"center": {
						"latitude": position.coords.latitude,
						"longitude": position.coords.longitude
					},
					"zoom": 10
				};
				$scope.marker = {
					"id": 0,
					"coords": {
						"latitude": position.coords.latitude,
						'longitude': position.coords.longitude
					},
					'options': { draggable: true },
					events: {
						dragend: function (marker, eventName, args) {
							$scope.config.google_map.latitude = $scope.marker.coords.latitude;
							$scope.config.google_map.longitude = $scope.marker.coords.longitude;
							console.log($scope.marker.coords);
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

		$scope.getLocation();
			
			
    };
	//Inject controller's dependencies
	websettingsController.$inject = injectParams;
	//Register/apply controller dynamically
    app.register.controller('websettingsController', websettingsController);
});

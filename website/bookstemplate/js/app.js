'use strict';

define(['angular',
	'bootstrap',
	'services',
	'ngCookies',
	'angularRoute'
	
], function (angular, ngCookies) {
    // Declare app level module which depends on views, and components
    var app = angular.module('apnasitePortal', [
   'ui.bootstrap', 'customServices', 'ngCookies', 'ngRoute'
 ]);
	app.controller('TypeaheadCtrl', ['$scope','$http','dataService', function($scope, $http,dataService) {
		$scope.data = "vilas";
		$scope.city = "Pune";
		$scope.getTypeaheadData = function(table, searchColumn,city, searchValue){
			var locationParams = {search : {}, groupBy : {}}
			locationParams.search[searchColumn] = searchValue;
			locationParams.groupBy[searchColumn] = searchValue;
			return dataService.config(table, locationParams).then(function(response){
				return response;
			}); 
		}
		
		$scope.getSearchData = function(inputValue, city){
			$scope.searchParams = {				
				city : city,
				business_name : inputValue
			}
			return $http.get('/search/'+city, {params : $scope.searchParams}).then(function(response){
				return response.data.data;
			}); 
		}
		
		$scope.getSearchResult = function(city,item){
			console.log(item);
			var url = '/'+city+'/'+item.category+'/'+item.type+'/'+item.business_name+'/'+item.id;
			window.location.href = url.replace(/ /g, "-");
		}
		
		$scope.onItemClicked = function (isVisible) {
			isVisible = !isVisible;
		};
		
		$scope.getCurLocation = function(lat, lang) {
			$http.get('http://maps.googleapis.com/maps/api/geocode/json', {
				params: {
					latlng : lat+','+lang,
					sensor: false
				}
			}).then(function(response){
				response.data.results.map(function(item){
					$scope.findCity(item);
				});
			});
		};
		
		$scope.findCity = function($item){
			for(var x in $item.address_components){
				for(var y in $item.address_components[x].types){
					if($item.address_components[x].types[y] == 'administrative_area_level_2'){
						console.log($item.address_components[x].long_name);
						$scope.city = $item.address_components[x].long_name;
					}
				}
			}
		}
		
		$scope.showPosition = function (position) {
			$scope.latitude = position.coords.latitude;
			$scope.longitude = position.coords.longitude;
			//console.log(position.coords.latitude, position.coords.longitude);
			$scope.$apply();
			$scope.getCurLocation(position.coords.latitude, position.coords.longitude);
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
			console.log($scope.error);
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
		
	}]).controller('aboutController',['$scope','$http', '$location', function($scope,$http, $location) {
		var s = $location.path();
		$scope.url = s.substr(1);
		$scope.makeActive = function(url){
			$scope.id = url;
		}
		$scope.makeActive($scope.url);
	}]).controller('enquiryController', ['$scope','$http','$location','dataService','modalService', function($scope,http, $location,dataService,modalService) {
			
			var today = new Date();
			var year = today.getFullYear();
			var month = today.getMonth() + 1;
			var date = today.getDate();
			var hour = today.getHours();
			var min = today.getMinutes();
			var sec = today.getSeconds();
			$scope.mailSent = false;
			
			$scope.openModel = function (url, buzId,businessname,toemail,userId) {
				var modalDefaults = {
					templateUrl: url,	// apply template to modal
					size : 'sm'
				};
				var modalOptions = {
					formData : function(enquiry){
						enquiry.subject = 'Portal Enquiry: '+ businessname;
						enquiry.to_email.to = toemail;
						enquiry.user_id = userId;
						enquiry.date = year + "-" + month + "-" + date + " " + hour + ":" + min + ":"+sec;
						
						modalOptions.myenquiryData = enquiry;
					}
				};
				modalService.showModal(modalDefaults, modalOptions).then(function (result) {
					dataService.post("/enquiry",modalOptions.myenquiryData).then(function(response) {
						$scope.mailSent = true;
					}); 
				});
			};
			$scope.ok = function () {
				$modalOptions.close('ok');
			};
		}]).controller('productController',['$scope','$http', '$location', function($scope,$http, $location) {
			$scope.isShow = function(id){
				$scope.isVisible = "true";
				
			}
		}]);
    return app;
});

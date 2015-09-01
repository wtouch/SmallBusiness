'use strict';

define(['angular',
	'bootstrap',
	'services',
	'ngCookies',
	'angularRoute',
	'upload',
	'uploadShim',
	'ngSanitize'
], function (angular, ngCookies) {
    // Declare app level module which depends on views, and components
    var app = angular.module('apnasitePortal', [
   'ui.bootstrap', 'customServices', 'ngCookies', 'ngRoute','angularFileUpload','ngSanitize'
	]);
	app.controller('TypeaheadCtrl', ['$scope','$http','dataService', function($scope, $http,dataService) {
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
			return $http.get('/search/data', {params : $scope.searchParams}).then(function(response){
				return response.data.data;
			}); 
		}
		
		$scope.getSearchResult = function(city,item){
			console.log(item);
			var url = '/'+city+'/'+item.category+'/'+item.type+'/'+item.business_name+'/'+item.id;
			window.location.href = url.replace(/ /g, "-");
		}
		$scope.setCity = function(city,item){
			console.log(item);
			var url = '/'+city;
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
		
		$scope.setCityName = function(city){
			if(city == undefined || city == "Pune"){
				$scope.city = "Pune";
				$scope.getLocation();
			}else{
				$scope.city = city;
			}
		}
		
		
	}]).controller('aboutController',['$scope','$http', '$location', function($scope,$http, $location) {
			var s = $location.path();
			$scope.url = s.substr(1);
			$scope.makeActive = function(url){
				$scope.id = url;
			}
			$scope.makeActive($scope.url);
	}]).controller('enquiryController', ['$scope','$http','$location','dataService','modalService', function($scope,http, $location,dataService,modalService) {
			$scope.currentDate = dataService.currentDate;
			var today = new Date();
			var year = today.getFullYear();
			var month = today.getMonth() + 1;
			var date = today.getDate();
			var hour = today.getHours();
			var min = today.getMinutes();
			var sec = today.getSeconds();
			$scope.mailSent = false;
			
			$scope.openModel = function (url, buzId,businessname,toemail,userId,category,type,keywords) {
				var modalDefaults = {
					templateUrl: url,	// apply template to modal
					size : 'md'
				};
				var modalOptions = {
					modal : true,
					formData : function(enquiry){
						modalOptions.myenquiryData = enquiry;
					}
				};
				$scope.initEnquiryData(buzId,businessname,toemail,userId,category,type,keywords);
				angular.extend(modalOptions, $scope.modalOptions);
				
				modalService.showModal(modalDefaults, modalOptions).then(function (result) {
					console.log(modalOptions.myenquiryData);
					$scope.postData(modalOptions.myenquiryData);
				});
			};
			$scope.initEnquiryData = function(buzId,businessname,toemail,userId,category,type,keywords){
				$scope.modalOptions = {
					enquiryData : {
						subject : (businessname) ? 'Portal Enquiry: '+ businessname : "",
						to_email: (toemail) ? {to : toemail, cc : 'admin@apnasite.in'} : {to : "admin@apnasite.in"},
						user_id : (userId) ? userId : 1,
						category : category,
						type : type,
						keywords : keywords
					}
				}
				console.log($scope.modalOptions);
			}
			$scope.postData= function (enquiry){
				enquiry.date = $scope.currentDate;
				
				console.log(enquiry);
				dataService.post("/enquiry",enquiry).then(function(response) {
					if(response.status=="success"){
						$scope.mailSent = true; 
					}else{
						console.log(response.message);
					}
				}); 
			};
			
			$scope.setCategoryType = function(item){
				$scope.addbusiness.category = item.id;
				$scope.getTypes(item.id);
				$scope.addbusiness.type = item.type_id;
				$scope.getKeywords(item.type_id);
			}
			
			$scope.getCategory = function(filterColumn){
				if(filterColumn){
					var locationParams = {filter : {parent_id : filterColumn}, groupBy: 'category_name'};
				}else{
					var locationParams = {filter : {parent_id : 0}, groupBy: 'category_name'};
				}
				dataService.config('business_category',locationParams).then(function(response){
					$scope.businessCategories = response;
				});
			}
			
			$scope.getCategory(0);
			$scope.getTypes = function(filterColumn){
				var locationParams = {filter : {parent_id : filterColumn}, groupBy: 'type'};
				dataService.config('business_category',locationParams).then(function(response){
					$scope.businessTypes = response;
				});
			}
			
			$scope.getKeywords = function(filterColumn){
				var locationParams = {filter : {parent_id : filterColumn}};
				dataService.config('business_category',locationParams).then(function(response){
					$scope.businessKyewords = response;
				});
			}
			
			
		}]).controller('productController',['$scope','$http', '$location', function($scope,$http, $location) {
			$scope.isShow = function(id){
				$scope.isVisible = "true";
				
			}
		}]).controller('loginuserController',['$scope','$injector','dataService','$location', function($scope,$injector,dataService,$location) {
			$scope.insert = function(userlogin){
				console.log(userlogin);
				dataService.post("/businesslogin",userlogin).then(function(response) {
					if(response.status=="success"){
						window.location.href = "/verified";
					}
				});
			} 
		}]).controller('verificationController',['$scope','$injector','dataService','$location', function($scope,$injector,dataService,$location) {
			$scope.verifyCode = function(verify){
				console.log(verify);
				 /* dataService.get("/verified",verify).then(function(response) {
					if(response.status == "success"){
						window.location.href = "/addbusiness";
					}
					
				});   */
			}
			
		}]).controller('applicationController',['$scope','$injector','dataService','$location','$routeParams','upload','$rootScope', function($scope,$injector,dataService,$location,routeParams,upload,$rootScope) {
			$scope.path = "application/";
			$scope.userinfo = {user_id:1}; // this is for uploading credentials	
			$scope.upload = function(files,path,userInfo, picArr){ 
				upload.upload(files,path,userInfo,function(data){
					if(data.status === 'success'){
						if(picArr == "resume"){
							$scope.addapplicant.resume = data.data;
						}
						if(picArr == "resume"){
							$scope.addapplicant.resume = data.data;
						}
					}
				});
			};
			//to generate thumbnail
			$scope.generateThumb = function(files){
				//console.log(files);
				$scope.addapplicant.resume= files;
				upload.generateThumbs(files);
			};
			
			$scope.open = function($event) {
				$event.preventDefault();
				$event.stopPropagation();
				$scope.opened = true;
			};

			$scope.dateOptions = {
				formatYear: 'yy',
				startingDay: 1
			};
			
			$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
			$scope.format = $scope.formats[0];
			$scope.postData = function(addapplicant){
				console.log(addapplicant);
			};
			
			
		}]).controller('businessController',['$scope', '$injector','$routeParams','$location','dataService','upload','modalService', '$rootScope', function($scope, $injector,$routeParams,$location,dataService,upload,modalService, $rootScope) {
			$scope.oneAtATime = true;
			$scope.addbusiness= {};
			$scope.readOnly = false;
			$scope.currentDate = dataService.currentDate;
			
			// to add establish year in combobox
			$scope.estyear = [];
			var date = new Date();
			var todayYear = date.getFullYear();
			for (var value =1900; value <= todayYear;value++){
				$scope.estyear.push(value);
			}
				
			$scope.alerts = [
				{ type: 'danger', msg: 'Error to add business.' },
				{ type: 'success', msg: 'Business Added Successfully.' }
			];

			// function to close alert
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
			
			// to next button code
			 $scope.status = {
				isFirstOpen: true,
				isFirstDisabled: false,
			};
			
			$scope.biz = {};
			dataService.config('config', {config_name : "business"}).then(function(response){
				$scope.biz = response.config_data;
			});
			
			$scope.getData = function(location){
				$scope.readOnly = true;
				$scope.addbusiness.location = location.location;
				$scope.addbusiness.city = location.city;
				$scope.addbusiness.state = location.state;
				$scope.addbusiness.country = location.country;
				$scope.addbusiness.area = location.area;
				$scope.addbusiness.pincode = location.pincode;
			}
			
			$scope.getTypeaheadData = function(table, searchColumn, searchValue){
				var locationParams = {search : {}}
				locationParams.search[searchColumn] = searchValue;
				return dataService.config('locations', locationParams).then(function(response){
					return response;
				});
			}
			
			$scope.setCategoryType = function(item){
				$scope.addbusiness.category = item.id;
				$scope.getTypes(item.id);
				$scope.addbusiness.type = item.type_id;
				$scope.getKeywords(item.type_id);
			}
			
			$scope.getCategory = function(filterColumn){
				if(filterColumn){
					var locationParams = {filter : {parent_id : filterColumn}, groupBy: 'category_name'};
				}else{
					var locationParams = {filter : {parent_id : 0}, groupBy: 'category_name'};
				}
				dataService.config('business_category',locationParams).then(function(response){
					$scope.businessCategories = response;
				});
			}
			
			$scope.getCategory(0);
			$scope.getTypes = function(filterColumn){
				var locationParams = {filter : {parent_id : filterColumn}, groupBy: 'type'};
				dataService.config('business_category',locationParams).then(function(response){
					$scope.businessTypes = response;
				});
			}
			
			$scope.getKeywords = function(filterColumn){
				var locationParams = {filter : {parent_id : filterColumn}};
				dataService.config('business_category',locationParams).then(function(response){
					$scope.businessKyewords = response;
				});
			}
		
			$scope.path = "business/";
			$scope.userinfo = {user_id:1}; // this is for uploading credentials	
			$scope.upload = function(files,path,userInfo, picArr){ 
				upload.upload(files,path,userInfo,function(data){
					if(data.status === 'success'){
						if(picArr == "business_logo"){
							$scope.addbusiness.business_logo = data.data;
						}
						if(picArr == "contact_photo"){
							$scope.addbusiness.contact_profile.contact_photo = data.data;
						}
					}
				});
			};
			//to generate thumbnail
			$scope.generateThumb = function(files){
				//console.log(files);
				$scope.business_logo = files;
				$scope.contact_photo = files;
				console.log($scope.business_logo);
				upload.generateThumbs(files);
			};
			
			//to add business code
			$scope.postData = function(addbusiness) {
				$scope.addbusiness.created_date = $scope.currentDate;
				dataService.post("/addbusiness",addbusiness)
				.then(function(response) { 
					console.log(response);
					if(response.status == "success"){
						window.location.href = "/"+addbusiness.city+"/"+addbusiness.category+"/"+addbusiness.type+"/"+addbusiness.business_name+"/"+response.data;
						console.log(response.data);
					}
				}); 
			}; 
		}]);
    return app;
});

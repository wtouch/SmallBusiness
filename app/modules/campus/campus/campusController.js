'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector', 'dataService', '$rootScope', '$http','upload'];
	var campusController = function ($scope, $injector, dataService, $rootScope, $http, upload) {
		$scope.campusDetails = $rootScope.userDetails.config.campus.campusData;
		$scope.campus = ($scope.campusDetails)?$scope.campusDetails:{};
		$scope.awarddetail={};
		$scope.certificate={};
		$scope.distribution={};
		$scope.campus.awarddetails = ($scope.campusDetails.awarddetails)?$scope.campusDetails.awarddetails:[];
		$scope.campus.certificates = ($scope.campusDetails.certificates)?$scope.campusDetails.certificates:[];
		$scope.campus.distributions = ($scope.campusDetails.distributions.length>0)?$scope.campusDetails.distributions:[{"percentage":"100","category":"Higher Percentage Student"}];
		$scope.formPart ='campusdetails';
		$scope.showFormPart = function(formPart){
						$scope.formPart = formPart;
					}
		$scope.addToObject = function(inputArray,reset,formObject){
			$rootScope.addToObject(inputArray,formObject);
			$scope[reset] = {};
			$scope.totalCalculate(inputArray);
		}
		$scope.removeObject = $rootScope.removeObject;
		$scope.userinfo = $scope.userInfo;
		// this is for uploading credentials	
		$scope.upload = function(files,path,userInfo, picArr){ 
			upload.upload(files,path,userInfo,function(data){
				if(data.status === 'success'){
					if(picArr == "campus_logo"){
						$scope.campus.campus_logo = data.data;
					}
					
				}
				else{
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification.error("Upload Image", data.message);
				}
			});
		};
		$scope.uploads = function(files,path,userInfo, picArr){ 
			upload.upload(files,path,userInfo,function(data){
				if(data.status === 'success'){
					if(picArr == "certificates"){
						$scope.certificate.certificates = data.data;
					}
				}
				
				else{
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification.error("Upload Image", data.message);
				}
			});
		};
		//to generate thumbnail
		$scope.generateThumb = function(files){  
			upload.generateThumbs(files);
		};
		$scope.updateData = function(campus){
			$rootScope.serverApiV2 = false;
			$rootScope.userDetails.config.campus={campusData :campus};
			console.log($rootScope.userDetails.config.campus.campusData);
			dataService.put('put/user/'+$rootScope.userDetails.id, {config : $rootScope.userDetails.config}).then(function(response){
				if(response.status == "success"){
					dataService.setUserDetails(JSON.stringify($rootScope.userDetails));
					$rootScope.userDetails = dataService.parse(dataService.userDetails);
					$rootScope.serverApiV2 = true;
				}
			})
		};
		$scope.totalCalculate = function(inputArray){
			$scope.percentage = 0;
			angular.forEach(inputArray,function(object){
				$scope.percentage += parseFloat(object.percentage);
				console.log($scope.percentage);
			});
		}
	 };
	 
	// Inject controller's dependencies
	campusController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('campusController', campusController);
});
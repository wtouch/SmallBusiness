'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector', 'dataService', '$rootScope', '$http','upload'];
	var campusController = function ($scope, $injector, dataService, $rootScope, $http, upload) {
		$scope.campus = {};
		$scope.awarddetail={};
		$scope.certificate={};
		$scope.campus.awarddetails = [];
		$scope.campus.certificates = [];
					$scope.formPart ='campusdetails';
					$scope.showFormPart = function(formPart){
						$scope.formPart = formPart;
					}
				
				$scope.addToObject = function(object,reset,awarddetail){
					console.log(object,awarddetail);
					$rootScope.addToObject(object,awarddetail);
					$scope[reset] = {};
					
				
				}
				$scope.removeObject = $rootScope.removeObject;
				
				
				
		$scope.userinfo = $scope.userInfo; // this is for uploading credentials	
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
				
				
				
				
				
				/* if($rootScope.userDetails.config == ""){
					$rootScope.userDetails.config = {};
				}
				if($rootScope.userDetails.config.inventory == undefined) $rootScope.userDetails.config.inventory = {};
				
				$rootScope.taxData = {
					service_tax : 14,
					vat : 5,
					pan_no : "DIPPS1619D",
					tin_no : "DIPPS1619DST001"
				};
				
				$rootScope.userDetails.config.inventory.taxData = $rootScope.taxData;
				
				dataService.put('put/user/'+$rootScope.userDetails.id, {config : $rootScope.userDetails.config}).then(function(response){
					if(response.status == "success"){
						dataService.setUserDetails(JSON.stringify($rootScope.userDetails));
						$rootScope.userDetails = dataService.parse(dataService.userDetails);
					}
				}) */
	 };
	 
	// Inject controller's dependencies
	campusController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('campusController', campusController);
});
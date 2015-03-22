
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope', '$injector','dataService','$location', '$cookieStore', '$cookies','upload'];

    // This is controller for this view
	var editprofileController = function ($scope,$rootScope,$injector,dataService,$location, $cookieStore, $cookies,upload) {
		
		$scope.userDetails = {user_id : $rootScope.userDetails.id};
		$scope.alerts = [];
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		
		//datepicker {sonali}	
		$scope.today = function() 
		{
			$scope.dt = new Date();
		};
		$scope.today();
		$scope.open = function($event)
		{
			$event.preventDefault();
			$event.stopPropagation();
			$scope.opened =true;
		};
		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};

		$scope.formats = ['yyyy/MM/dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		/* Date Picker Ended here */
		
		//function for match password
		$scope.passMatch = function(pass1, pass2){
			$scope.pass = (pass1===pass2) ? true : false;
		}
		
		//dynamic dropdwnlist of country,state & city
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
		
		//Upload Function for uploading files {Vilas}
		$scope.editprofile = {user_img : {}};	// this is form object
		$scope.path = "users/"; // path to store images on server
		$scope.upload = function(files,path,userDetails,picArr){ // this function for uploading files
			console.log(picArr);
			upload.upload(files,path,userDetails,function(data){
				var picArrKey = 0, x;
				for(x in picArr) picArrKey++;
				if(data.status === 'success'){
					picArr[picArrKey] = data.details;
				}else{
					$scope.alerts.push({type: data.status, msg: data.message});
				}
			});
		};
		$scope.generateThumb = function(files){  // this function will generate thumbnails of images
			upload.generateThumbs(files);
		};// End upload function
		
		//code for change profile 
		$scope.userInfo = dataService.parse($rootScope.userDetails);
		$scope.userInfo = dataService.parse($rootScope.userDetails);
			$scope.editprofile = {
			id : $scope.userInfo.id,
			name : $scope.userInfo.name,
			username : $scope.userInfo.username,
			email : $scope.userInfo.email,
			phone : $scope.userInfo.phone,
			address :$scope.userInfo.address,
			fax :$scope.userInfo.fax,
			website :$scope.userInfo.website,
			dob : $scope.userInfo.dob
		};
		$scope.changeProfile = function(id,editprofile){
			dataService.put("put/user/"+id,editprofile)
			.then(function(response) {
				if(response.status == 'success'){
					$scope.editprofile = {};
					$scope.editProfileForm.$setPristine();
					$scope.alerts.push({type: response.status, msg: response.message});
					//angular.extend($rootScope.userDetails, editprofile);
					//console.log($rootScope.userDetails);
					//console.log(editprofile);
					//dataService.setUserDetails($rootScope.userDetails);
				}else{
					$scope.alerts.push({type: (response.status == 'error') ? "danger" :response.status, msg: response.message});
				}
			}) 
		}	
		
		//code for change password 
		$scope.changepassword = function(changepasswd) {
			console.log($rootScope.userDetails.id);
			console.log(changepasswd);
			$scope.userID = {user_id : $rootScope.userDetails.id };
			angular.extend(changepasswd, $scope.userID);
			dataService.post("post/user/changepass",changepasswd)
			.then(function(response) {
				if(response.status == 'success'){
					$scope.changepasswd = {};
					$scope.changepassForm.$setPristine();
					$scope.alerts.push({type: response.status, msg: response.message});
				}else{
					$scope.alerts.push({type: (response.status == 'error') ? "danger" :response.status, msg: response.message});
				}
			})  
		}
		templateUrl:'http://localhost/trupti/SmallBusiness/app/modules/mybusiness/addbusiness/editprofile.html';
    };
	// Inject controller's dependencies
	editprofileController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('editprofileController', editprofileController);
});

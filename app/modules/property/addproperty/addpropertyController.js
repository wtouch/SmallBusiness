'use strict';
define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$http','$rootScope','upload', '$timeout', 'dataService','$notification'];
    // This is controller for this view
	var addpropertyController = function ($scope, $injector,$routeParams,$http,$rootScope, upload, $timeout,dataService,$notification) {
		$rootScope.metaTitle = "Add Real Estate Property";
		
		// all $scope object goes here
		$scope.alerts = [];
		$scope.userinfo = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		$scope.property = dataService.config.property;
		$scope.property={};
		
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
		$scope.getTypeaheadData = function(table, searchColumn, searchValue){
			var locationParams = {search : {}}
			locationParams.search[searchColumn] = searchValue;
			return dataService.config('locations', locationParams).then(function(response){
				return response;
			});
		}
		
		//function for upload images
		 $scope.uploadMultiple = function(files,path,userInfo,picArr){ //this function for uploading files
			 upload.upload(files,path,userInfo,function(data){
				var picArrKey = 0, x;
				for(x in picArr) picArrKey++;
				if(data.status === 'success'){
					picArr.push(data.data);
				}else{
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Upload Images", response.message);
				}
			}); 
		};    
		//function for Users list response
		dataService.get("getmultiple/user/1/500", {status: 1, user_id : $rootScope.userDetails.id})
		.then(function(response) {  
			if(response.status == 'success'){
				$scope.customerList = response.data;
			}else{
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Get Customers", response.message);
			}
		});
		
		// to close alert message
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
			
			// this function for uploading files
			$scope.upload = function(files,path,userinfo, picArr){ 
				upload.upload(files,path,userinfo,function(data){
					var picArrKey = 0, x;
					for(x in picArr) picArrKey++;
					if(data.status === 'success'){
						picArr[picArrKey] = data.details;
						
					}else{
						if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Upload Images", response.message);
					}
					
				}); 
			};
			$scope.generateThumb = function(files){  
				upload.generateThumbs(files);
			};// end file upload code
		
	/**********************************************************************/
		//display records from config.js to combo
		
		$scope.propertyConfig = dataService.config.property;					
		
		
	/*********************************************************************/
		
		// Add Business multi part form show/hide operation from here! 
		$scope.formPart = 'property';
		$scope.showFormPart = function(formPart){
			$scope.formPart = formPart;
		};
	
	/*********************************************************************/
	
	//display dynamic list from project table 
		dataService.get('getmultiple/project/1/50', $scope.userinfo)
			.then(function(response){
												
				$scope.addProjName = response.data;				
			});
         
		dataService.get('getmultiple/property/1/50', $scope.userinfo)
			.then(function(response){
												
				$scope.addPropStruct = response.data;				
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
			/********************************************************************************/
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
		
	};		
	
	
	
	// Inject controller's dependencies
	addpropertyController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('addpropertyController', addpropertyController);
	
});

'use strict';
define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$http','$rootScope','upload', '$timeout', 'dataService','$notification'];
    // This is controller for this view
	var addprojectController = function ($scope, $injector,$routeParams,$http,$rootScope, upload, $timeout,dataService,$notification) {
		$rootScope.metaTitle = "Add Real Estate Property";
		
		
		// all $scope object goes here
		$scope.alerts = [];
		$scope.userInfo = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		$scope.project = dataService.config.project;
		$scope.project={};
		
		dataService.config('config', {config_name : "project"}).then(function(response){
			$scope.projectConfig = response.config_data;
		});
		
		$scope.getData = function(location){
			$scope.readOnly = true;
			$scope.project.location = location.location;
			$scope.project.city = location.city;
			$scope.project.state = location.state;
			$scope.project.country = location.country;
			$scope.project.area = location.area;
			$scope.project.pincode = location.pincode;
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
		
		// remove object from main form object
			$scope.removeObject = function(key, object){
				$scope.alerts.splice(key, 1);
			}
		
		/* // to close alert message
			$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			};
			 */
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
		
		$scope.projectConfig = dataService.config.project;					
		
		
	/*********************************************************************/
		
		// Add Business multi part form show/hide operation from here! 
		$scope.formPart = 'project';
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
		
		 //Add Project
		$scope.addProjectFun = function(project){	
			$scope.Project.date = $scope.currentDate;
			dataService.post("post/project",Project,$scope.userInfo)
			.then(function(response) {
				
				if(response.status=="success"){
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Post Project", response.message);
				}else{
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Post Project", response.message);
				}				
			}); 
			/********************************************************************************/
			//update into Project
			};
			 if($routeParams.id){//Update user
				console.log($routeParams.id);	
				dataService.get("getsingle/Project/"+$routeParams.id)
				.then(function(response) {
						$scope.Project = response.data;	
						console.log($scope.Project);					
					});	
					
					$scope.update = function(Project){				
						Project.modified_date = dataService.currentDate;
						dataService.put("put/Project/"+$routeParams.id,Project)
						.then(function(response) { //function for response of request temp
							if(response.status == 'success'){
								$scope.submitted = true;
								if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
								$notification[response.status]("Put Project", response.message);						
							}else{
								if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
								$notification[response.status]("Put Project", response.message);
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
	addprojectController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('addprojectController', addprojectController);
	
});

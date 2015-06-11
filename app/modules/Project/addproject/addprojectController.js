'use strict';
define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$http','$rootScope','upload', '$timeout', 'dataService','$notification'];
    // This is controller for this view
	var addprojectController = function ($scope, $injector,$routeParams,$http,$rootScope, upload, $timeout,dataService,$notification) {
		$rootScope.metaTitle = "Add Real Estate Property";
		
		$scope.userInfo = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		//$scope.project = { project_images : [] };
		$scope.path = "project/"; 
		
		dataService.config('config', {config_name : "project"}).then(function(response){
			$scope.projectConfig = response.config_data;
		});
	/********************************************************************/
		
		$scope.addToObject = function(data, object, resetObj){
			var dtlObj = JSON.stringify(data);
			object.push = JSON.parse(dtlObj);
			$scope[resetObj] = { desc : { }};
		}
		$scope.removeObject = function(key, object){
			delete object[key];
		}
		$scope.editObject = function(object, FormObj){
			var dtlObj = JSON.stringify(object);
			FormObj = JSON.parse(dtlObj);
		}
		
		$scope.showForm = function(obj, resetObj){
			$scope[obj] = !$scope[obj];
			if(resetObj){
				$scope.headingDisabled = false;
				$scope.imgRemoved = true;
				$scope[resetObj] = { desc : {}};
			}
		}
		
		$scope.add = function(project){				
			dataService.post("post/project/"+$routeParams.id,project)  
			 .then(function(response) { 
				if(response.status == 'success'){
					$scope.submitted = true;
					if($rootScope.userDetails.config.addprojectDetails != true){
						dataService.progressSteps('addprojectDetails', true);
					}
				}
				if(response.status == undefined){
					$notification.error("", response.message);
				}else{
					$notification[response.status]("", response.message);
				}
			});
		};
	/***********************************************************************/
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
	/**************************************************************************************/
		$scope.project = {
			featured : 0,
			builder :{},
			overview : {},
			amenities : {},
			specifications : {},
			location_map : {},
			layout_map : {},
			floor_plan : {},
			project_gallery : {gallery_image : [] },
			project_images : [] ,
			created_date : $scope.currentDate,
			modified_date :$scope.currentDate,
		};
	/**********************************************************************************/	
		$scope.uploadMultiple = function(files,path,userinfo, picArr){
			upload.upload(files,path,userinfo,function(data){
				if(data.status === 'success'){
					picArr.project_images.push(data.data);
				}else{
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("", response.message);
				}
			});
		};
		
		$scope.removeImg = function(item, imgObject) {
			imgObject.splice(item, 1);     
		};
	/**********************************************************************************/
		dataService.get("getmultiple/user/1/500", {status: 1, user_id : $rootScope.userDetails.id})
		.then(function(response) {  
			if(response.status == 'success'){
				$scope.customerList = response.data;
			}else{
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Get Customers", response.message);
			}
		});
	/************************************************************************************/	
		// this function for uploading files
			$scope.upload = function(files,path,userInfo, picArr){ 
				upload.upload(files,path,userInfo,function(data){
					if(data.status === 'success'){
						/* //$scope[picArr] = data.data;
						picArr.project_gallery.image.push(data.data);
						console.log($scope[picArr]); */
						if(picArr == "gallery_image"){
						$scope.project.project_gallery.gallery_image = data.data;
						}
						/* if(picArr == "contact_photo"){
							$scope.addbusiness.contact_profile.contact_photo = data.data;
						} */
					}else{
						$scope.alerts.push({type: response.status, msg: response.message});
					}					
				}); 
			};  
			
			$scope.generateThumb = function(files){  
				upload.generateThumbs(files);
			};
	/*********************************************************************/
		// Add Business multi part form show/hide operation from here! 
		$scope.formPart = 'project';
		$scope.showFormPart = function(formPart){
			$scope.formPart = formPart;
		};
	/*********************************************************************/
	$scope.getWebsite = function(userId){
			// for dynamic value of domain name
			dataService.get('getmultiple/website/1/200', {user_id:userId})
			.then(function(response){
				var websites = [];
				for(var id in response.data){
					var obj = {id: response.data[id].id, domain_name : response.data[id].domain_name};
					websites.push(obj);
				}
				$scope.websites = websites;
			}) ;
			}
			$scope.checkAll = function(websites, checkValue) {
				if(checkValue){
					$scope.project.domain = angular.copy(websites);
				}
			};
			
			$scope.setFormScope= function(scope){
			$scope.formScope = scope;
			}
	
		//add project //project,$scope.userinfo
		$scope.addproject = function(project){
			console.log(project);
			dataService.post("post/project",project)
			.then(function(response) {
				if(response.status=="success"){
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Post Project", response.message);
				}else{
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Post Project", response.message);
				}
				
			});
		};
		
		//update into project
			 if($routeParams.id){//Update user
				console.log($routeParams.id);	
				dataService.get("getsingle/project/"+$routeParams.id)
				.then(function(response) {
						$scope.project = response.data;	
						console.log($scope.project);					
					});	
					
					$scope.update = function(project){	
						dataService.put("put/project/"+$routeParams.id,project)
						.then(function(response) { //function for response of request temp
							if(response.status == 'success'){
								$scope.submitted = true;
								if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
								$notification[response.status]("Put project", response.message);						
							}else{
								if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
								$notification[response.status]("Put project", response.message);
							}	
						});	  
					};	 
			}			
		
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

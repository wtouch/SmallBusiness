'use strict';
define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$http','$rootScope','upload', '$timeout', 'dataService','$notification','$location'];
    // This is controller for this view
	var addprojectController = function ($scope, $injector,$routeParams,$http,$rootScope, upload, $timeout,dataService,$notification,$location) {
		$rootScope.metaTitle = "Add Real Estate Property";
		$scope.path = "/project"; 
		$scope.project = {
			featured : 0,
			builder :{},
			overview : {},
			amenities : {},
			specifications : {},
			location_map : [],
			layout_map : [],
			floor_plan : [],
			project_gallery : [],
			projecttestimonials :[],
			project_images : [],
			created_date : $scope.currentDate,
			modified_date :$scope.currentDate,
		};
		$scope.overview = {};
		$scope.location_map = {};
		$scope.layout_map = {};
		$scope.floor_plan = {};
		$scope.project_gallery = {};
		$scope.projecttestimonials ={};
		$scope.builder = {},
		$scope.userInfo = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		dataService.config('config', {config_name : "project"}).then(function(response){
			$scope.projectConfig = response.config_data;
		});
	/********************************************************************/
		$scope.edit = false;
		$scope.addToObject = function(data, object, resetObj){
			$scope.infra = false;
			if($scope.edit == true){
				$scope[resetObj] = {};
				$scope.edit = false;
				return true;
			}
			var dtlObj = JSON.stringify(data);
			object.push(JSON.parse(dtlObj));
			$scope[resetObj] = {};
			
		}
		
		$scope.removeObject = function(item, object){
			object.splice(item, 1); 
		}
		$scope.editObject = function(object, FormObj){
			$scope.edit = true;
			console.log(FormObj);
			var dtlObj = JSON.stringify(object);
			$scope[FormObj] = object;
		}
		
		$scope.showForm = function(obj, resetObj){
			$scope[obj] = !$scope[obj];
			if(resetObj){
				$scope.headingDisabled = false;
				$scope.imgRemoved = true;
				//$scope[resetObj] = { desc : {}};
			}
		}
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
		
		$scope.uploads = function(files,path,userinfo, picArr){ 
			upload.upload(files,path,userinfo,function(data){
				if(data.status === 'success'){
					if(picArr == "builder_photo"){
						$scope.project.builder.builder_photo = data.data;
					}
					if(picArr == "owner_photo"){
						$scope.project.builder.owner_photo = data.data;
					}
				}else{
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification.error("Upload Image", data.message);
				}
			});
		};
		
	/************************************************************************************/	
	// this function for uploading files
		$scope.upload = function(files,path,userInfo, picArr){ 
			upload.upload(files,path,userInfo,function(data){
				if(data.status === 'success'){
					$scope[picArr].image = data.data.file_relative_path;
				}else{
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Upload Image", response.message);
				}					
			}); 
		};  
	/**********************************************************************************/
		$scope.getUsers = function(){
		dataService.get("getmultiple/user/1/500", {status: 1, user_id : $rootScope.userDetails.id})
		.then(function(response) {  
			if(response.status == 'success'){
				$scope.customerList = response.data;
			}else{
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Get Customers", response.message);
			}
		});
		};
	
	/*********************************************************************/
		// Add Business multi part form show/hide operation from here! 
		$scope.formPart = 'project';
		$scope.showFormPart = function(formPart){
			$scope.formPart = formPart;
		};
	/*********************************************************************/
	$scope.getWebsite = function(user_id){
		console.log(user_id);
		// for dynamic value of domain name
		var websParams = {user_id : user_id, status : 1};
		dataService.get("getmultiple/business/"+$scope.bizListCurrentPage+"/"+$scope.pageItems,$scope.businessParams)
		dataService.get('getmultiple/website/1/200',websParams)
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
	
		//add project 
		$scope.addproject = function(project){
			console.log(project);
			project.created_date = $scope.currentDate;
			project.modified_date = $scope.currentDate;
			dataService.post("post/project",project)
			.then(function(response) {
				if(response.status=="success"){
					$location.path("/dashboard/project");
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Post Project", response.message);
				}else{
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Post Project", response.message);
				}
				
			});
		};
		
	/************************************************************************************/	
			//update into Project
			if($routeParams.id){
				console.log($routeParams.id);	
				dataService.get("getsingle/project/"+$routeParams.id)
				.then(function(response) {
						$scope.project = response.data;	
						console.log($scope.project);					
					});	
					
					$scope.update = function(project){				
						project.modified_date = dataService.currentDate;
						dataService.put("put/project/"+$routeParams.id,project)
						.then(function(response) { //function for response of request temp
							if(response.status == 'success'){
								$scope.submitted = true;
								$location.path("/dashboard/project");
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
				$scope.project.domain = angular.copy(websites);
			}
		}; 
	/*****************************************************************************/	
	};		
	
	// Inject controller's dependencies
	addprojectController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('addprojectController', addprojectController);
	
});

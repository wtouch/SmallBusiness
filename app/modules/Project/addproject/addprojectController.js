'use strict';
define(['app'], function (app) {
	
	var injectParams = ['$scope','$rootScope','$injector', '$routeParams','upload','dataService'];
  // This is controller for this view
	var addprojectController = function ($scope,$rootScope, $injector,$routeParams,upload,dataService) {
		 $rootScope.metaTitle = "Real Estate Add Project";
		$scope.alerts = [];
		$scope.userinfo = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		
		
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
			project_images : [] ,
			created_date : $scope.currentDate,
			
		};
		
		$scope.proj = {};
		dataService.config('config', {config_name : "project"}).then(function(response){
			$scope.proj = response.config_data;
			console.log(response.config_data);
		});
		
		$scope.projects={};
		$scope.getData = function(location){
			$scope.readOnly = true;
			$scope.projects.location = location.location;
			$scope.projects.city = location.city;
			$scope.projects.state = location.state;
			$scope.projects.country = location.country;
			$scope.projects.area = location.area;
			$scope.projects.pincode = location.pincode;
		}
		$scope.getTypeaheadData = function(table, searchColumn, searchValue){
			var locationParams = {search : {}}
			locationParams.search[searchColumn] = searchValue;
			return dataService.config('locations', locationParams).then(function(response){
				return response;
			});
		}

		//Upload Function for uploading files 
			$scope.path = "project/"; 
			
			// add form part to main form object
			$scope.addToObject = function(data, object){
				 var dtlObj = JSON.stringify(data);
				 object.push(JSON.parse(dtlObj));
			}

			// remove object from main form object
			$scope.removeObject = function(key, object){
				$scope.alerts.splice(key, 1);
			}
			
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
			 $scope.location_map = { image : ""};
			// this function for uploading files
			$scope.upload = function(files,path,userinfo, picArr){ 
				upload.upload(files,path,userinfo,function(data){
					var picArrKey = 0, x;
					for(x in picArr) picArrKey++;
					if(data.status === 'success'){
						$scope[picArr] = data.data;
						console.log($scope[picArr]);
					}else{
						$scope.alerts.push({type: response.status, msg: response.message});
					}					
				}); 
			}; 
			
			$scope.generateThumb = function(files){  
				upload.generateThumbs(files);
			};// end file upload code
			
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

			// for check all checkboxes
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
					$scope.alerts.push({type: response.status, msg: response.message});
					$scope.formScope.addprojectForm.$setPristine();
				}else{
					$scope.alerts.push({type: response.status, msg: response.message});
				}
				
			});
		};
		
		//code to edit project details
		 if($routeParams.id){ 
			dataService.get("getsingle/project/"+$rootScope.userDetails.id)
			.then(function(response) {
				
				console.log(response);
			});
			
			$scope.update = function(id,project){
				dataService.put("put/project/"+id,project)
				.then(function(response) {
					console.log(response);
				});
			};
		 }; 
		
		
	};	
	 
	// Inject controller's dependencies
	addprojectController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('addprojectController',addprojectController);
	
});
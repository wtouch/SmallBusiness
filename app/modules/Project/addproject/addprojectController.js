'use strict';
define(['app'], function (app) {
	
	var injectParams = ['$scope','$rootScope','$injector', '$routeParams','upload','dataService','$notification'];
  // This is controller for this view
	var addprojectController = function ($scope,$rootScope, $injector,$routeParams,upload,dataService,$notification) {
		 $rootScope.metaTitle = "Real Estate Add Project";
		$scope.alerts = [];
		$scope.userinfo = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		$scope.project={};
		
		$scope.project = {
			featured : 0,
			builder :{},
			overview : { details : {} },
			amenities : { details : {} },
			specifications : { details : {} },
			location_map : { details : {} },
			layout_map : { details : {} },
			floor_plan : { details : {} },
			project_gallery : { details : {} },
			project_images : {} ,
			created_date : $scope.currentDate,
			user_id : $rootScope.userDetails.id
		};
		
		$scope.proj = {};
		dataService.config('config', {config_name : "project"}).then(function(response){
			$scope.proj = response.config_data;
			console.log(response.config_data);
		});
		
		// Add Project multi part form show/hide operation from here!
		$scope.formPart = 'project';
		$scope.showFormPart = function(formPart){
			$scope.formPart = formPart;
		};
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

		//Upload Function for uploading files 
			$scope.path = "project/"; 
			
			// for project image form part
			$scope.addimage = {
				description : {project_images : {}}
			};
			// for location map form part
			$scope.addlocation_map = {
				description : {location_image : {}}
			};
			// for floor plan form part
			$scope.addfloor_plan = {
				description : {floor_image : {}}
			};
			//for amenities form part
			$scope.addamenities = {
				description : {}
			};
			//for overviews form part
			$scope.addoverview = {
				description : {}
			};
			//for project gallery form part
			$scope.addproject_gallery = {
				description : {}
			};
			//for specification form part
			$scope.addspecification = {
				description : {}
			};
			//for layout map form part
			$scope.addlayout_map = {
				description : {layout_image : {}}
			};
			//for builder  & owner images
			$scope.project.builder.owner_logo = {};
			$scope.project.builder.builder_logo = {};
			
			// add form part to main form object
			$scope.addToObject = function(data, object){
				 var dtlObj = JSON.stringify(data.description);
				 object[data.title] = JSON.parse(dtlObj);
			}

			// remove object from main form object
			$scope.removeObject = function(key, object){
				delete object[key];
			}
			
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
						console.log(data.message);
					}else{
						$scope.alerts.push({type: response.status, msg: response.message});
					}					
				}); 
			}; 
			
			$scope.generateThumb = function(files){  
				upload.generateThumbs(files);
			};// end file upload code
			
			// for dynamic value of domain name
			dataService.get('getmultiple/website/1/200', {user_id:$rootScope.userDetails.id})
			.then(function(response){
				var websites = [];
				for(var id in response.data){
					var obj = {id: response.data[id].id, domain_name : response.data[id].domain_name};
					websites.push(obj);
				}
				$scope.websites = websites;
			}) ;

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
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Get Users", response.message);
				}
				
			});
		};
		
		//code to edit project details
		 if($routeParams.id){ 
			dataService.get("getsingle/project/"+$rootScope.userDetails.id)
			.then(function(response) {
				$scope.project = response.data;
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
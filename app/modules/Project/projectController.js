'use strict';
define(['app'], function (app) {
var injectParams = ['$scope', '$injector','$routeParams','$rootScope','dataService','modalService','$notification'];
  // This is controller for this view
	var projectController = function ($scope, $injector,$routeParams,$rootScope,dataService,modalService,$notification) {
		$rootScope.metaTitle = "Real Estate Project";
	
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.projectListCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.user_id = {user_id : $rootScope.userDetails.id}; 
		//$scope.userInfo = {user_id : $rootScope.userDetails.id};
		$scope.alerts = [];
		
		// function to close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		
		//for dynamic tooltip
		$scope.dynamicTooltip = function(status, active, notActive){
			return (status==1) ? active : notActive;
		};
		
		//This code for featured & un-featured button 
			$scope.feature = function(id, featured){
				$scope.featuredData = {featured : featured};
				dataService.put("put/project/"+id, $scope.featuredData)
				.then(function(response) {
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Feature Project", response.message);
				});
			};
			
		//Code For Pagination
		$scope.pageChanged = function(page) { 
			angular.extend($scope.projectParam, $scope.user_id);
			dataService.get("getmultiple/project/"+page+"/"+$scope.pageItems,$scope.projectParam).then(function(response){
				$scope.projects = response.data;
			
			});
		};
		
		//delete button for change status for template
			$scope.deleted = function(id, status){
				$scope.deletedData = {status : status};
				dataService.put("put/project/"+id, $scope.deletedData)
				.then(function(response) { 
					if(response.status == 'success'){
						//$scope.hideDeleted = 1;
					}
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Edit Project", response.message);
				});
			};

		// code for verify button 
			$scope.verify = function(id, verified){
				$scope.veryfiedData = {verified : verified};
				dataService.put("put/project/"+id, $scope.veryfiedData)
				.then(function(response) { 
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Verify Property", response.message);
				});
			} ;		
		
		$scope.searchFilter = function(statusCol, showStatus) {
			$scope.search = {search: true};
			$scope.filterStatus= {};
			$scope.projectParam={};
			(showStatus =="") ? delete $scope.projectParam[statusCol] : $scope.filterStatus[statusCol] = showStatus;
			angular.extend($scope.projectParam, $scope.filterStatus);
			angular.extend($scope.projectParam, $scope.search);
			if(showStatus.length >= 4 || showStatus == ""){
			dataService.get("getmultiple/project/1/"+$scope.pageItems, $scope.projectParam)
			.then(function(response) {  
				if(response.status == 'success'){
					$scope.projects = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.projects = {};
					$scope.totalRecords = {};
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status](response.message);
				}
			});
			}
		}; 
		
		// code for filter data as per satus (delete/active)		
		$scope.changeStatus = function(statusCol, showStatus) {
			$scope.filterStatus= {};
			(showStatus =="") ? delete $scope.projectParam[statusCol] : $scope.filterStatus[statusCol] = showStatus;
			angular.extend($scope.projectParam, $scope.filterStatus);
			dataService.get("getmultiple/project/1/"+$scope.pageItems, $scope.projectParam)
			.then(function(response) {  
				if(response.status == 'success'){
					$scope.projects = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.projects = {};
					$scope.totalRecords = {};
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status](response.message);
				}
			});
		};
		
		// code for change status when user delete/ active the project
		$scope.changeValue = function(statusCol,status) {
			$scope.filterStatus= {};
			(status =="") ? delete $scope.projectParam[statusCol] : $scope.filterStatus[statusCol] = status;
			angular.extend($scope.projectParam, $scope.filterStatus);
			angular.extend($scope.projectParam, $scope.search);			
			
			dataService.get("/getmultiple/project/1/"+$scope.pageItems, $scope.projectParam)
			.then(function(response) {  
				if(response.status == 'success'){
					$scope.projects = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.projects = {};
					$scope.totalRecords = {};
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status](response.message);
				}				
			});
		};
		// code to access domain names dynamically
		$scope.userinfo={user_id:$rootScope.userDetails.id,status :1};
		dataService.get('getmultiple/website/1/200', $scope.userinfo).then(function(response){
				var domains = [];
				for(var id in response.data){
					var obj = {id: response.data[id].id, domain_name : response.data[id].domain_name};
					domains.push(obj);
				}
				$scope.domains = domains;
		});
		
		//modal for open project details.
			$scope.open = function (url, projectId) {
				dataService.get("getsingle/project/"+projectId)
				.then(function(response) {
					var modalDefaults = {
						templateUrl: url,	
						size : 'lg'
					};
					var modalOptions = {
						project: dataService.parse(response.data)  
					};
					modalService.showModal(modalDefaults, modalOptions).then(function (result) {
					});
				});
			};
			$scope.ok = function () {
				$modalOptions.close('ok');
			};
		
		//code for view project details
		$scope.projectParam = {status : 1};			
		angular.extend($scope.projectParam,$scope.user_id);
		dataService.get("/getmultiple/project/"+$scope.projectListCurrentPage+"/"+$scope.pageItems, $scope.projectParam)
		.then(function(response) {  
			$scope.totalRecords = response.totalRecords;
			$scope.projects = response.data;
			if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status];
		}); 
	/******************************************************************************************/
		
		/* //view multiple records
			$scope.projectParam = {status : 1};			
			angular.extend($scope.projectParam,$scope.userInfo);
			dataService.get("getmultiple/project/1/"+$scope.pageItems, $scope.projectParam)
			.then(function(response) { //function for property list response  
				//console.log(response.data);				
					if(response.status == 'success'){
						$scope.totalRecords = response.totalRecords;
						$scope.projects = response.data; 					
						
					}else{
						$scope.alerts.push({type: response.status, msg: response.message});
					}
			});	
			
	}; */
	/*****************************************************************************************/
	/*****************************************************************************************/	
			//update single record
			if($routeParams.id){//Update user 	 	
			dataService.get("getsingle/project/"+$rootScope.userDetails.id)
				.then(function(response) {
						$scope.project = response.data;	
						console.log($scope.project);					
					});				
				$scope.update = function(project){				
					console.log(project);
				};	
			 };  	
	 /***********************************************************************************/	
 }; 
	// Inject controller's dependencies
	projectController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('projectController', projectController);
});
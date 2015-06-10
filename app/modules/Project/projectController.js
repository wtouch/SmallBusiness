'use strict';
define(['app'], function (app) {
var injectParams = ['$scope', '$injector','$routeParams','$rootScope','dataService','modalService','$notification'];
  // This is controller for this view
	var projectController = function ($scope, $injector,$routeParams,$rootScope,dataService,modalService,$notification) {
		$rootScope.metaTitle = "Real Estate Project";
	
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.CurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.user_id = {user_id : $rootScope.userDetails.id}; 
		
		$scope.dynamicTooltip = function(status, active, notActive){
			return (status==1) ? active : notActive;
		};
	/*************************************************************************************/
			$scope.feature = function(id, featured){
				$scope.featuredData = {featured : featured};
				dataService.put("put/project/"+id, $scope.featuredData)
				.then(function(response) {
					if(response.status == "success"){
					$scope.getProject($scope.CurrentPage);
					}
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Feature Project", response.message);
				
				});
			};
	/***********************************************************************************/	
		//delete button for change status for template
			$scope.deleted = function(id, status){
				$scope.deletedData = {status : status};
				dataService.put("put/project/"+id, $scope.deletedData)
				.then(function(response) { 
					if(response.status == 'success'){
						$scope.getProject($scope.CurrentPage);
					}
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Edit Project", response.message);
				});
			};
	/**************************************************************************************/
		// code for verify button 
			$scope.verify = function(id, verified){
				$scope.veryfiedData = {verified : verified};
				dataService.put("put/project/"+id, $scope.veryfiedData)
				.then(function(response) {
					if(response.status == 'success'){
						$scope.getProject($scope.CurrentPage);
					}
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Verify Property", response.message);
				});
			} ;		
	/**************************************************************************************/	
		$scope.searchFilter = function(statusCol, searchProp) {
			$scope.filterStatus= {search: true};
			(searchProp =="") ? delete $scope.projectParam[statusCol] : $scope.filterStatus[statusCol] = searchProp;
			angular.extend($scope.projectParam, $scope.filterStatus);
			$scope.getProject(1,$scope.projectParam);
		};
    /**************************************************************************************/
		$scope.removeImg = function(item, imgObject) {
			imgObject.splice(item, 1);     
		};
	/************************************************************************************/
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
	/**********************************************************************************/
		// code to access domain names dynamically
		$scope.getWebsitelist = function(){
		$scope.userinfo={user_id:$rootScope.userDetails.id,status :1};
		dataService.get('getmultiple/website/1/200', $scope.userinfo).then(function(response){
				var domains = [];
				for(var id in response.data){
					var obj = {id: response.data[id].id, domain_name : response.data[id].domain_name};
					domains.push(obj);
				}
				$scope.domains = domains;
		});
		};
	/********************************************************************************/
		//Model
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
	/**************************************************************************************/
		// code for delete button 
		$scope.domainUpdate = function(id, domain){
			$scope.domainData = {domain : domain};
			console.log($scope.domainData);
			console.log(domain);
			dataService.put("put/project/"+id, $scope.domainData)
			.then(function(response) { 
				if(response.status == "success"){
					$scope.getProject($scope.currentPage);
				}
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Update Property", response.message);
			});
		};			
	/**************************************************************************************/	
		$scope.getProject = function(page, projectParam){
			$scope.projectParam = (projectParam) ? projectParam : {status : 1, user_id : $scope.user_id.user_id};
			dataService.get("/getmultiple/project/"+page+"/"+$scope.pageItems, $scope.projectParam)
			.then(function(response) {
				if(response.status == 'success'){				
					$scope.totalRecords = response.totalRecords;
					$scope.projects = response.data;
				}else{
						$scope.totalRecords = [];
						$scope.projects = 0;
						if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
						$notification[response.status](response.message);
					}
		}); 
		}
	/*****************************************************************************************/	
 }; 
	// Inject controller's dependencies
	projectController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('projectController', projectController);
});
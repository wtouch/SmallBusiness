'use strict';
define(['app'], function (app) {
var injectParams = ['$scope', '$injector','$routeParams','$rootScope','dataService','modalService','$notification'];
  // This is controller for this view
	var projectController = function ($scope, $injector,$routeParams,$rootScope,dataService,modalService,$notification) {
		$rootScope.metaTitle = "Real Estate Project";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.CurrentPage = 1;
		$scope.pageItems = 100;
		$scope.numPages = "";		
		$scope.user_id = "";
		$scope.changeUserId = function(user_id){
			$scope.user_id = user_id;
		}
		$scope.dynamicTooltip = function(status, active, notActive){
			return (status==1) ? active : notActive;
		};

		$scope.getCustomers = function(){
			dataService.get("getmultiple/user/1/500", {status: 1, user_id : $rootScope.userDetails.id})
			.then(function(response) {  
				if(response.status == 'success'){
					$scope.customerList = response.data;
				}else{
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Get Users", response.message);
				}
			});
		}
			$scope.feature = function(id, featured,user_id){
				$scope.featuredData = {featured : featured};
				dataService.put("put/project/"+id, $scope.featuredData)
				.then(function(response) {
					if(response.status == "success"){
					$scope.getProject(1,user_id,$scope.projectParam);
					}
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Feature Project", response.message);
				
				});
			};
	/***********************************************************************************/	
			$scope.deleted = function(id, status,user_id){
				$scope.deletedData = {status : status};
				dataService.put("put/project/"+id, $scope.deletedData)
				.then(function(response) { 
					if(response.status == 'success'){
						$scope.getProject(1,user_id,$scope.projectParam);
					}
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Edit Project", response.message);
				});
			};
	/**************************************************************************************/
		$scope.verify = function(id, verified,user_id){
			$scope.veryfiedData = {verified : verified};
			dataService.put("put/project/"+id, $scope.veryfiedData)
			.then(function(response) {
				if(response.status == 'success'){
					$scope.getProject(1,user_id,$scope.projectParam);
				}
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Verify Property", response.message);
			});
		} ;		
	/**************************************************************************************/	
		$scope.searchFilter = function(statusCol, searchProp,user_id) {
			$scope.filterStatus= {search: true};
			(searchProp =="") ? delete $scope.projectParam[statusCol] : $scope.filterStatus[statusCol] = searchProp;
			angular.extend($scope.projectParam, $scope.filterStatus);
			$scope.getProject(1,user_id,$scope.projectParam);
		};
    /**************************************************************************************/
		$scope.removeImg = function(item, imgObject) {
			imgObject.splice(item, 1);     
		};
	/************************************************************************************/
		// code for filter data as per satus (delete/active)		
		$scope.changeStatus = function(statusCol, showStatus,user_id) {
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
		$scope.getWebsitelist = function(user_id){
		$scope.userinfo={user_id : user_id, status : 1};
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
					console.log(result);
					});
				});
			};
	/**************************************************************************************/
		// code for delete button 
		$scope.domainUpdate = function(id, domain,user_id){
			$scope.domainData = {domain : domain};
			console.log($scope.domainData);
			console.log(domain);
			dataService.put("put/project/"+id, $scope.domainData)
			.then(function(response) { 
				if(response.status == "success"){
					$scope.getProject(1,user_id,$scope.projectParam);
				}
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Update Property", response.message);
			});
		};			
	/**************************************************************************************/	
		$scope.getProject = function(page, user_id, projectParam){
			$scope.projectParam = (projectParam) ? projectParam : {status : 1, user_id : user_id};
			angular.extend($scope.projectParam, {user_id : user_id});
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
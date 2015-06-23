'use strict';
define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$http','$log', 'modalService', '$rootScope','dataService','upload','$notification'];
    // This is controller for this view
	var propertyController = function ($scope, $injector,$routeParams,$http, $log, modalService, $rootScope,dataService,upload,$notification) {
		$rootScope.metaTitle = "Real Estate Properties";
		
		//Code For Pagination
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.CurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.userInfo = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		console.log($scope.currentDate);
		$scope.user_id = "";
		$scope.changeUserId = function(user_id){
			$scope.user_id = user_id;
		}
		$scope.dynamicTooltip = function(status, active, notActive){
			return (status==1) ? active : notActive;
		};
		
		// code for delete button 
		$scope.deleted = function(id, status){
			$scope.deletedData = {status : status};
			dataService.put("put/property/"+id, $scope.deletedData)
			.then(function(response) { 
				if(response.status == "success"){
					$scope.getProperty($scope.currentPage,user_id);
				}
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Delete Property", response.message);
			});
		};
		/*****************************************************************************/
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
	/**************************************************************************************/	
		// code for delete button 
		$scope.domainUpdate = function(id, domain,user_id){
			$scope.domainData = {domain : domain};
			console.log($scope.domainData);
			console.log(domain);
			dataService.put("put/property/"+id, $scope.domainData)
			.then(function(response) { 
				if(response.status == "success"){
					$scope.getProperty($scope.currentPage,user_id);
				}
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Update Property", response.message);
			});
		};			
	/************************************************************************************/
	//This code for featured & un-featured button 
		$scope.feature = function(id, featured,user_id){
			$scope.featuredData = {featured : featured};
			dataService.put("put/property/"+id, $scope.featuredData)
			.then(function(response) {
				if(response.status == "success"){
					$scope.getProperty($scope.currentPage,user_id);
				}
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Feature Property", response.message);
			});
		};
	/**************************************************************************************/
		$scope.verify = function(id, verified,user_id){
			$scope.veryfiedData = {verified : verified};
			dataService.put("put/property/"+id, $scope.veryfiedData)
			.then(function(response) { 
				if(response.status == "success"){
					$scope.getProperty($scope.currentPage,user_id);
				}
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Verify Property", response.message);
			});
		};	
	/**************************************************************************************/	
		$scope.searchFilter = function(statusCol, searchProp,user_id) {
			$scope.filterStatus= {search: true};
			(searchProp =="") ? delete $scope.propertyParam[statusCol] : $scope.filterStatus[statusCol] = searchProp;
			angular.extend($scope.propertyParam, $scope.filterStatus);
			$scope.getProperty(1,$scope.propertyParam,user_id);
		};
	/***************************************************************************************/
		$scope.uploadMultiple = function(files,path,userInfo,picArr){ 
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
	/***************************************************************************************/	
		// code to access domain names dynamically
		$scope.getWebsitelist = function(user_id){
			var websiteParams = {user_id:user_id,status : 1};
			dataService.get('getmultiple/website/1/200', websiteParams).then(function(response){
				var domains = [];
				for(var id in response.data){
					var obj = {id: response.data[id].id, domain_name : response.data[id].domain_name};
					domains.push(obj);
				}
				$scope.domains = domains;
				
			}); 
		};
/***************************************************************************************/
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
					$notification[response.status]("Get Users", response.message);
				}
			});
		};
/***************************************************************************************/	
		$scope.changeValue = function(statusCol,status,user_id) {
			//console.log($scope.propertyParam);
			$scope.filterStatus= {};
			(status =="") ? delete $scope.propertyParam[statusCol] : $scope.filterStatus[statusCol] = status;
			angular.extend($scope.propertyParam, $scope.filterStatus);
			angular.extend($scope.propertyParam, $scope.search);			
			$scope.getProperty(1, $scope.propertyParam,user_id);
		};
/*****************************************************************************************/		

	//view single property modal		 
		$scope.open = function (url, propId) {
			dataService.get("getsingle/property/"+ propId)
			.then(function(response) {
				
				console.log(response);
				var modalDefaults = {
					templateUrl: url,	// apply template to modal
					size : 'lg'
				};
				var modalOptions = {
					viewProperty: dataService.parse(response.data)  // assign data to modal
				};
				//console.log(response.data);
				modalService.showModal(modalDefaults, modalOptions).then(function (result) {
					console.log("modalOpened");
				});
			});			
		};	
/**************************************************************************************/				
		//view multiple records
		$scope.getProperty = function(page, user_id,propertyParam){
			$scope.propertyParam = (propertyParam) ? propertyParam : {status : 1, user_id : user_id};
			angular.extend($scope.propertyParam, {user_id : user_id});
			dataService.get("getmultiple/property/"+page+"/"+$scope.pageItems, $scope.propertyParam)
			.then(function(response) { 				
					if(response.status == 'success'){
						$scope.totalRecords = response.totalRecords;
						$scope.properties = response.data; 					
					}else{
						$scope.totalRecords = [];
						$scope.properties = 0;
						if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
						$notification[response.status](response.message);
					}
			});	
		}
			
	};		
/***************************************************************************************/
	
	// Inject controller's dependencies
	propertyController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('propertyController', propertyController);
});

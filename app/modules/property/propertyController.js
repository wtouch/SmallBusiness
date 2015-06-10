'use strict';
define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$http','$log', 'modalService', '$rootScope','dataService','upload','$notification'];
    // This is controller for this view
	var propertyController = function ($scope, $injector,$routeParams,$http, $log, modalService, $rootScope,dataService,upload,$notification) {
		$rootScope.metaTitle = "Real Estate Properties";
		
		//Code For Pagination
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.userInfo = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		console.log($scope.currentDate);
		
		$scope.dynamicTooltip = function(status, active, notActive){
			return (status==1) ? active : notActive;
		};
		
		// code for delete button 
		$scope.deleted = function(id, status){
			$scope.deletedData = {status : status};
			dataService.put("put/property/"+id, $scope.deletedData)
			.then(function(response) { 
				if(response.status == "success"){
					$scope.getProperty($scope.currentPage);
				}
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Delete Property", response.message);
			});
		};		
	/**************************************************************************************/	
		// code for delete button 
		$scope.domainUpdate = function(id, domain){
			$scope.domainData = {domain : domain};
			console.log($scope.domainData);
			console.log(domain);
			dataService.put("put/property/"+id, $scope.domainData)
			.then(function(response) { 
				if(response.status == "success"){
					$scope.getProperty($scope.currentPage);
				}
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Update Property", response.message);
			});
		};			
	/************************************************************************************/
	//This code for featured & un-featured button 
		$scope.feature = function(id, featured){
			$scope.featuredData = {featured : featured};
			dataService.put("put/property/"+id, $scope.featuredData)
			.then(function(response) {
				if(response.status == "success"){
					$scope.getProperty($scope.currentPage);
				}
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Feature Property", response.message);
			});
		};
	/**************************************************************************************/
		$scope.verify = function(id, verified){
			$scope.veryfiedData = {verified : verified};
			dataService.put("put/property/"+id, $scope.veryfiedData)
			.then(function(response) { 
				if(response.status == "success"){
					$scope.getProperty($scope.currentPage);
				}
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Verify Property", response.message);
			});
		};	
	/**************************************************************************************/	
		$scope.searchFilter = function(statusCol, searchProp) {
			$scope.filterStatus= {search: true};
			(searchProp =="") ? delete $scope.propertyParam[statusCol] : $scope.filterStatus[statusCol] = searchProp;
			angular.extend($scope.propertyParam, $scope.filterStatus);
			$scope.getProperty(1,$scope.propertyParam);
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
		$scope.getWebsitelist = function(){
			var websiteParams = {user_id:$rootScope.userDetails.id,status : 1};
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
		$scope.changeValue = function(statusCol,status) {
			//console.log($scope.propertyParam);
			$scope.filterStatus= {};
			(status =="") ? delete $scope.propertyParam[statusCol] : $scope.filterStatus[statusCol] = status;
			angular.extend($scope.propertyParam, $scope.filterStatus);
			angular.extend($scope.propertyParam, $scope.search);			
			$scope.getProperty(1, $scope.propertyParam);
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
		$scope.getProperty = function(page, propertyParam){
			$scope.propertyParam = (propertyParam) ? propertyParam : {status : 1, user_id : $scope.userInfo.user_id};
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

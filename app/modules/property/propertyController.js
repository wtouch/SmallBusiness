'use strict';
define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$http','$log', 'modalService', '$rootScope','dataService','upload'];
    // This is controller for this view
	var propertyController = function ($scope, $injector,$routeParams,$http, $log, modalService, $rootScope,dataService,upload) {
		$rootScope.metaTitle = "Real Estate Properties";
		
		//Code For Pagination
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.alerts = [];
		$scope.userInfo = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		console.log($scope.currentDate);
		
		 //for alert 		 
		if($scope.status=="warning"){     
			 $scope.alerts.push({type: 'error', msg: "Error to load data"});
			 $scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
			 };
		}	 
		//function for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		}; 	
		
		//dynamic tooltip
		$scope.dynamicTooltip = function(status, active, notActive){
			return (status==1) ? active : notActive;
		};
		
		// code for delete button 
			$scope.deleted = function(id, status){
				$scope.deletedData = {status : status};
				dataService.put("put/property/"+id, $scope.deletedData)
				.then(function(response) { 
					if(response.status == 'success'){
						$scope.hideDeleted = 1;
					}
					
					$notification[response.status]("Delete Property", response.message);
				});
			};			
		
		//code for pagination		
		$scope.pageChanged = function(page) {	
			angular.extend($scope.propertyParam, $scope.userInfo);
			dataService.get("getmultiple/property/"+page+"/"+$scope.pageItems,$scope.propertyParam)
			.then(function(response) {
				$scope.properties = response.data;
				//console.log(response.data);				
			});			
		};	//end pagination
		
		//This code for featured & un-featured button 
			$scope.feature = function(id, featured){
				$scope.featuredData = {featured : featured};
				dataService.put("put/property/"+id, $scope.featuredData)
				.then(function(response) {
					
					$notification[response.status]("Feature Property", response.message);
				});
			};
			
		// code for verify button 
			$scope.verify = function(id, verified){
				$scope.veryfiedData = {verified : verified};
				dataService.put("put/property/"+id, $scope.veryfiedData)
				.then(function(response) { 
					
					$notification[response.status]("Verify Property", response.message);
				});
			} ;	
			
		//search filter function
		$scope.searchFilter = function(statusCol, searchProp) {
			$scope.search = {search: true};
			$scope.filterStatus= {};
			(searchProp =="") ? delete $scope.propertyParam[statusCol] : $scope.filterStatus[statusCol] = searchProp;
			angular.extend($scope.propertyParam, $scope.filterStatus);
			angular.extend($scope.propertyParam, $scope.search);			
			
			dataService.get("/getmultiple/property/1/"+$scope.pageItems, $scope.propertyParam)
			.then(function(response) {  //function for propertylist response
				if(response.status == 'success'){
					$scope.properties = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.properties = {};
					$scope.totalRecords = {};
					$scope.alerts.push({type: response.status, msg: response.message});
				}
				//console.log($scope.properties);
			});
		};

		//upload method for multiple images
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
		
		
/***************************************************************************************/
		/* $scope.changeStatus = {};
		$scope.changeStatusFn = function(colName, colValue, id){
			$scope.changeStatus[colName] = colValue;				
			//console.log($scope.changeStatus);
			
				 dataService.put("put/property/"+id,$scope.changeStatus)			
				.then(function(response) {					
					if(colName=='title'){					
					}
					$scope.alerts.push({type: response.status,msg: response.message});
				}); 
		}		 */
		
		
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
					$scope.alerts.push({type: response.status, msg: response.message});
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
			
			dataService.get("/getmultiple/property/1/"+$scope.pageItems, $scope.propertyParam)
			.then(function(response) {  //function for property response
				if(response.status == 'success'){
					$scope.properties = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.properties = {};
					$scope.totalRecords = {};
					$scope.alerts.push({type: response.status, msg: response.message});
				}				
			});
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
		
		$scope.ok = function () {
			$modalOptions.close('ok');
		};	//end of modal function		
				
/**************************************************************************************/				
		//view multiple records
			$scope.propertyParam = {status : 1};			
			angular.extend($scope.propertyParam,$scope.userInfo);
			dataService.get("getmultiple/property/1/"+$scope.pageItems, $scope.propertyParam)
			.then(function(response) { //function for property list response  
				//console.log(response.data);				
					if(response.status == 'success'){
						$scope.totalRecords = response.totalRecords;
						$scope.properties = response.data; 					
						
					}else{
						$scope.alerts.push({type: response.status, msg: response.message});
					}
			});	
			
	};		
/***************************************************************************************/
	
	// Inject controller's dependencies
	propertyController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('propertyController', propertyController);
});

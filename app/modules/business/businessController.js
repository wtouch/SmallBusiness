'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$location','dataService','modalService'];

    // This is controller for this view
	var businessController = function ($scope, $injector, $routeParams,$location,dataService,modalService)
	{
		
		$scope.open = function (url, buzId) {
			dataService.get("getsingle/business/"+buzId)
			.then(function(response) {
				var modalDefaults = {
					templateUrl: url,	// apply template to modal
					size : 'lg'
				};
				var modalOptions = {
					bizList: response.data[0]  // assign data to modal
				};
				console.log(response.data[0]);
				modalService.showModal(modalDefaults, modalOptions).then(function (result) {
					console.log("modalOpened");
				});
			});
			
		};
		$scope.ok = function () {
			$modalOptions.close('ok');
		};

		
		
		//all $scope object goes here
		$scope.alerts = [];
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.bizListCurrentPage = 1;
		$scope.delBizCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";	
		$scope.user_id = {user_id : 1}; // these are URL parameters
		
		
		
		//function for close alert
			$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
			};
		
		// This will change businessView dynamically from 'business.html' {Vilas}
		
		$scope.businessView = $routeParams.businessView;
		console.log($scope.businessView );
				
		
		
		//for display default businesslist.html{sonali}
		if(!$routeParams.businessView) {
			$location.path('/dashboard/business/businesslist');
		}
			
		
		$scope.pageChanged = function(page) {
			//$log.log('Page changed to: ' + $scope.currentPage);
			//get request for businesslist
			angular.extend($scope.featured, $scope.user_id);
			dataService.get("/getmultiple/business/"+page+"/"+$scope.pageItems, $scope.user_id)
			.then(function(response) { //function for businesslist response			
				$scope.bizList = response.data;			
			});
			//get request for delete bizlist 
			dataService.get("/getmultiple/business/"+page+"/"+$scope.pageItems, $scope.user_id)
			.then(function(response) { //function for deltebiz response
				$scope.delBiz = response.data;
				$scope.totalRecords = response.totalRecords;
			});
		};
		
		//this is global method for filter 
		$scope.changeStatus = function(statusCol, showStatus) {
			console.log($scope.featured);
			$scope.filterStatus= {};
			(showStatus =="") ? delete $scope.featured[statusCol] : $scope.filterStatus[statusCol] = showStatus;
			angular.extend($scope.featured, $scope.filterStatus);
			dataService.get("/getmultiple/business/1/"+$scope.pageItems, $scope.featured)
			.then(function(response) {  //function for templatelist response
				if(response.status == 'success'){
					$scope.bizList = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.bizList = {};
					$scope.totalRecords = {};
					$scope.alerts.push({type: response.status, msg: response.message});
				}
				//console.log($scope.properties);
			});
		};
			
		
		$scope.searchFilter = function(statusCol, showStatus) {
			$scope.search = {search: true};
			$scope.filterStatus= {};
			(showStatus =="") ? delete $scope.searchObj[statusCol] : $scope.filterStatus[statusCol] = showStatus;
			angular.extend($scope.searchObj, $scope.filterStatus);
			angular.extend($scope.searchObj, $scope.search);
			dataService.get("/getmultiple/business/1/"+$scope.pageItems, $scope.searchObj)
			.then(function(response) {  //function for templatelist response
				if(response.status == 'success'){
					$scope.bizList = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.bizList = {};
					$scope.totalRecords = {};
					$scope.alerts.push({type: response.status, msg: response.message});
				}
				//console.log($scope.properties);
			});
		};
		
		
		
		var businesslist = function(){
			dataService.get("/getmultiple/business/"+$scope.bizListCurrentPage+"/"+$scope.pageItems, $scope.user_id)
			.then(function(response){
				if(response.status == 'success'){	
					$scope.bizList=response.data;
				//	$scope.alerts.push({type: response.status, msg:'data access successfully..'});
					$scope.totalRecords=response.totalRecords;									
					//console.log(response.data);
				}
				else
				{
					$scope.alerts.push({type: response.status, msg: response.message});
				}
				$scope.bizList=response.data;
			});	
			//This code for publish unpublish button{sonali}
			
			$scope.dynamicTooltip = function(status, active, notActive){
				return (status==1) ? active : notActive;
			};
			
			$scope.verify = function(id, verified){
				$scope.veryfiedData = {verified : verified};
				
				dataService.put("put/business/"+id, $scope.veryfiedData)
				.then(function(response) { //function for businesslist response
					console.log(response);
				});
			} ;
			//This code for featured unfeatured button {sonali}
			$scope.feature = function(id, featured){
				$scope.featuredData = {featured : featured};
				console.log($scope.featuredData);
				dataService.put("put/business/"+id, $scope.featuredData)
				.then(function(response) { //function for businesslist response
					console.log(response);
				});
			};
			//Update business edit button {sonali}
			$scope.editBusiness = function(id){
				$location.path('/dashboard/business/addbusiness/'+id);
			};
				
			/*/delete button {sonali}
			$scope.deleted = function(id, status){
				$scope.deletedData = {status : status};
				//console.log($scope.deletedData);
				dataService.put("put/business/"+id, $scope.deletedData)
				.then(function(response) { //function for businesslist response
					if(response.status == '1'){
						
						console.log(response);
					}
				});
			};*/
			$scope.deleted = function(id, status){
				if(response.status == '1'){
					$scope.deletedData = {status : status};
					dataService.put("put/business/"+id, $scope.deletedData)
					.then(function(response) {
						$scope.bizList = response.data;
					});
				}	
				else{
					
				}
			};
			
			
		};
		
		var deletedbusiness = function(){
			
			dataService.get("/getmultiple/business/"+$scope.delBizCurrentPage+"/"+$scope.pageItems, $scope.user_id)
			.then(function(response){
				if(response.status == 'success'){	
					$scope.delBiz=response.data;
					$scope.alerts.push({type: response.status, msg:'data access successfully..'});
					$scope.totalRecords=response.totalRecords;									
					//console.log(response.data);
				}
				else
				{
					$scope.alerts.push({type: response.status, msg: response.message});
				}
				$scope.delBiz=response.data;
			});	
			//This code for publish unpublish button{sonali}
			
			$scope.dynamicTooltip = function(status, active, notActive){
				return (status==1) ? active : notActive;
			};
			
			//delete button {sonali}
			$scope.deleted = function(id, status){
				$scope.deletedData = {status : status};
				console.log($scope.deletedData);
				dataService.put("put/business/"+id, $scope.deletedData)
				.then(function(response) { //function for businesslist response
					console.log(response);
				});
			};
		};
		
		
		switch($scope.formPart) {
			case 'businesslist':
				businesslist();
				break;
			case 'deletedbusiness':
				deletedbusiness();
				break;
			default:
				businesslist();
		};
		
    };
	
	// Inject controller's dependencies
	businessController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('businessController', businessController);

});

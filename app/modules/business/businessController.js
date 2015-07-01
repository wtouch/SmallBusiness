'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$rootScope','$injector','$routeParams','$location','dataService','modalService','$notification'];

	var businessController = function ($scope,$rootScope,$injector, $routeParams,$location,dataService,modalService,$notification)
	{
		//all $scope object goes here
		$scope.permission = $rootScope.userDetails.permission.business_module;
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.bizListCurrentPage = 1;
		$scope.delBizCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.userInfo = {user_id : $rootScope.userDetails.id}; // these are URL parameters
		$scope.hideDeleted = "";
		
		$scope.items = [{business_name : "Vilas Shetkar"},{business_name : "fdfas Shetkar"},{business_name : "Vilas Shetdgdsgkar"},{business_name : "Vilas gsdgd"},{business_name : "fsdfasd Shetkar"}];
		$scope.sortableOptions = {
			//containment: '#sortable-container',
			//restrict move across columns. move only within column.
			accept: function (sourceItemHandleScope, destSortableScope) {
			  return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
			}
		  };
		
		$scope.dynamicTooltip = function(status, active, notActive){
			return (status==1) ? active : notActive;
		};
		// This will change businessView dynamically from 'business.html'
		$scope.businessView = $routeParams.businessView;
		
		//for display default businesslist.html
		if(!$routeParams.businessView) {
			$location.path('/dashboard/business/businesslist');
		}	
		
		$scope.pageChanged = function(page, featured) {
			(featured) ? angular.extend($scope.businessParams, featured) : "";
			dataService.get("getmultiple/business/"+page+"/"+$scope.pageItems, $scope.businessParams)
			.then(function(response) { 
				$scope.bizList = response.data;			
			});
		};
		$scope.ok = function () {
			$modalOptions.close('ok');
		};
		
		$scope.open = function (url, buzId) {
				var modalDefaults = {
					templateUrl: url,	
					size : 'lg'
				};
				var modalOptions = {
					bizList: buzId  
				};
				modalService.showModal(modalDefaults, modalOptions).then(function (result) {
				});
		};
		
		dataService.get("getmultiple/user/1/500", {status: 1, user_id : $rootScope.userDetails.id})
		.then(function(response) {  
			if(response.status == 'success'){
				$scope.customerList = response.data;
			}else{
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Get Users", response.message);
			}
		});
		
		$scope.changeStatus = function(statusCol, colValue) {
			$scope.filterStatus= {};
			(colValue == "") ? delete $scope.businessParams[statusCol] : $scope.filterStatus[statusCol] = colValue;
			angular.extend($scope.businessParams, $scope.filterStatus);
			if(statusCol == 'user_id' && colValue == null) {
				angular.extend($scope.businessParams, $scope.userInfo);
			}
			dataService.get("getmultiple/business/1/"+$scope.pageItems, $scope.businessParams)
			.then(function(response) {  //function for templatelist response
				if(response.status == 'success'){
					$scope.bizList = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.bizList = {};
					$scope.totalRecords = {};
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Get Business", response.message);
				}
			});
		};
		
		$scope.searchFilter = function(statusCol, colValue) {
			$scope.search = {search: true};
			$scope.filterStatus= {};
			(colValue =="") ? delete $scope.businessParams[statusCol] : $scope.filterStatus[statusCol] = colValue;
			angular.extend($scope.businessParams, $scope.filterStatus, $scope.search);
			if(colValue.length >= 4 || colValue ==""){
				dataService.get("getmultiple/business/1/"+$scope.pageItems, $scope.businessParams)
				.then(function(response) {  
					if(response.status == 'success'){
						$scope.bizList = response.data;
						$scope.totalRecords = response.totalRecords;
					}else{
						$scope.bizList = {};
						$scope.totalRecords = {};
						if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
						$notification[response.status]("Business Filter", response.message);
					}
				});
			}
		};
		
		//function to view business list
		var businesslist = function(){
			$scope.businessParams = {status: 1};
			angular.extend($scope.businessParams, $scope.userInfo);
			dataService.get("getmultiple/business/"+$scope.bizListCurrentPage+"/"+$scope.pageItems, $scope.businessParams)
			.then(function(response){
				if(response.status == 'success'){	
					$scope.bizList=response.data;
					$scope.totalRecords=response.totalRecords;									
				}
				else{
					$scope.bizList = {};
					$scope.totalRecords = {};	
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Get Business List", response.message);
				}
			});	
			
			//Update business edit button 
			$scope.editBusiness = function(id){
				$location.path('/dashboard/business/addbusiness/'+id);
			};
			
			// code for verify button 
			$scope.verify = function(id, verified){
				$scope.veryfiedData = {verified : verified};
				dataService.put("put/business/"+id, $scope.veryfiedData)
				.then(function(response) { 
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Verify Business", response.message);
				});
			} ;
			
			//This code for featured & un-featured button 
			$scope.feature = function(id, featured){
				$scope.featuredData = {featured : featured};
				dataService.put("put/business/"+id, $scope.featuredData)
				.then(function(response) {
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Feature Business", response.message);
				});
			};

			// code for delete button 
			$scope.deleted = function(id, status){
				$scope.deletedData = {status : status};
				dataService.put("put/business/"+id, $scope.deletedData)
				.then(function(response) { 
					if(response.status == 'success'){
						$scope.hideDeleted = 1;
					}
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Delete Business", response.message);
				});
			};			
		};
		
		//function for delete business
		var deletedbusiness = function(){
			$scope.businessParams = {status: 0};
			angular.extend($scope.businessParams, $scope.userInfo);
			dataService.get("getmultiple/business/"+$scope.bizListCurrentPage+"/"+$scope.pageItems, $scope.businessParams)
			.then(function(response){
				if(response.status == 'success'){	
					$scope.bizList = response.data;
					$scope.totalRecords=response.totalRecords;									
				}
				else{
					$scope.bizList = {};
					$scope.totalRecords = {};	
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Get Deleted Business", response.message);
				}
			});
			$scope.deleted = function(id, status){
				$scope.deletedData = {status : status};
				dataService.put("put/business/"+id, $scope.deletedData)
				.then(function(response) { 
					if(response.status == 'success'){
						$scope.hideDeleted = 0;
					}
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Delete Business", response.message);
				});
			};

		};
		
		switch($scope.businessView) {
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

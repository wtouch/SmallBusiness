'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$rootScope','$injector','$routeParams','$location','dataService','upload','modalService'];
	
    // This is controller for this view
	var websitesController = function ($scope,$rootScope,$injector,$routeParams,$location,dataService,upload,modalService) {
		$scope.permission = $rootScope.userDetails.permission.website_module;
        //for display form parts
        $scope.websitePart = $routeParams.websitePart;
		// For displaying manage domain module parts! {Dnyaneshwar}
		$scope.formPart = 'checkdomainavailable';
		$scope.showFormPart = function(formPart){
			$scope.formPart = formPart;
		};
        //open function for previewing the website[Dnyaneshwar].
        $scope.open = function (url, webId) {
			dataService.get("getsingle/website/"+webId)
			.then(function(response) {
				var modalDefaults = {
					templateUrl: url,	// apply template to modal
					size : 'lg'
				};
				var modalOptions = {
					website: response.data  // assign data to modal
				};
				console.log(response.data);
				modalService.showModal(modalDefaults, modalOptions).then(function (result) {
					console.log("modalOpened");
				}); 
				
			});
		};
		
        // all $scope object goes here
        $scope.alerts = [];
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.webListCurrentPage = 1;
		$scope.reqestSiteCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.currentDate = dataService.currentDate;
		$scope.userInfo = {user_id : $rootScope.userDetails.id};
		$scope.numbers = dataService.config.numbers;
		// All $scope methods
        $scope.pageChanged = function(page,where) { // Pagination page changed
			(where) ? angular.extend($scope.websiteParams, where) : "";
			dataService.get("getmultiple/website/"+page+"/"+$scope.pageItems, $scope.websiteParams)
			.then(function(response) {  //function for websitelist response
				$scope.website = response.data;
				console.log($scope.website);
			});
		};
		// for users list/customerList
		dataService.get("getmultiple/user/1/500")
		.then(function(response) {  //function for websitelist response
			if(response.status == 'success'){
				$scope.customerList = response.data;
			}else{
				$scope.alerts.push({type: response.status, msg: response.message});
			}
		});
		//for search filter{trupti}
		$scope.searchFilter = function(statusCol, showStatus) {
			$scope.search = {search: true};
			$scope.filterStatus = {};

			(showStatus =="") ? delete $scope.websiteParams[statusCol] : $scope.filterStatus[statusCol] = showStatus;
			angular.extend($scope.websiteParams, $scope.filterStatus, $scope.search);

			if(showStatus.length >= 4 || showStatus == ""){
			dataService.get("getmultiple/website/1/"+$scope.pageItems, $scope.websiteParams)
			.then(function(response) {  //function for websitelist response
			console.log(response);
				if(response.status == 'success'){
					$scope.website = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.website = {};
					$scope.totalRecords = {};
					$scope.alerts.push({type: response.status, msg: response.message});
				}
			});
			}
		}; 
			
		$scope.changeStatus={};
		$scope.editDomainName = function(colName, colValue, id, editStatus){
			$scope.changeStatus[colName] = colValue;
			console.log(colValue);
			console.log($scope.changeStatus);
				if(editStatus==0){
				 dataService.put("put/website/"+id,$scope.changeStatus)
				.then(function(response) { 
					//if(status=='success'){
						//$scope.hideDeleted = 1;
					//}
					$scope.alerts.push({type: response.status,msg: response.message});
				}); 
			}
		};	 
		
		$scope.showInput = function($event,opened) 		
		{
			$scope.websiteParams = []; 				  				
			$event.preventDefault();
			$event.stopPropagation();
			$scope[opened] = ($scope[opened] ===true) ? false : true;
		};
		
		//this is global method for filter 
		$scope.changeStatusFn = function(statusCol, showStatus) {
			$scope.filterStatus= {};
			(showStatus =="") ? delete $scope.websiteParams[statusCol] : $scope.filterStatus[statusCol] = showStatus;
			angular.extend($scope.websiteParams, $scope.filterStatus);
			dataService.get("getmultiple/website/1/"+$scope.pageItems, $scope.websiteParams)
			.then(function(response) {  
				if(response.status == 'success'){
					$scope.website = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.website = {};
					$scope.totalRecords = {};
					$scope.alerts.push({type: response.status, msg: "No data Found"});
				}
			});
		};  
	
        //function for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		
        /*For display by default websitelist.html page*/
		if(!$scope.websitePart) {
			$location.path('/dashboard/websites/websiteslist');
		}
		
		//for tooltip
		$scope.dynamicTooltip = function(status, active, notActive){
			return (status==1) ? active : notActive;
		};
        
        // switch functions
        var requestnewsite = function(){
			$scope.reqnewsite = {};
			//post method for insert data in request site form{trupti}
			$scope.postData = function(reqnewsite) { 
			//$scope.reqnewsite = {};
			//$scope.requestsiteForm.$setPristine();
			console.log(reqnewsite);
			$scope.userInfo=$scope.userInfo;
			$scope.reqnewsite.user_id= $rootScope.userDetails.id;
			$scope.reqnewsite.date = $scope.currentDate;
				 dataService.post("post/website",reqnewsite)
				//dataService.post("post/website",reqnewsite,$scope.userInfo)
				.then(function(response) {  //function for response of request site
					$scope.reqnewsite = response.data;
					console.log(response);
					console.log(reqnewsite);
				});   
			}//end of post method{trupti} 
		};
        
        var websiteslist = function(){
			//function for websiteslist{Dnyaneshwar}
			$scope.websiteParams = {status: 1}
			angular.extend($scope.websiteParams, $scope.userInfo);
			dataService.get("getmultiple/website/"+$scope.webListCurrentPage+"/"+$scope.pageItems, $scope.websiteParams)
			.then(function(response) {  //function for websiteslist response
			if(response.status == 'success'){
					$scope.website=response.data;
					$scope.totalRecords = response.totalRecords;	
				}
				else
				{
					$scope.alerts.push({type: response.status, msg: response.message});
				};
			});
			//delete button {trupti}
			$scope.deleted = function(id, status){
				$scope.deletedData = {status : status};
				dataService.put("put/website/"+id, $scope.deletedData)
				.then(function(response) { //function for businesslist response
					if(response.status == 'success'){
						$scope.alerts.push({type: response.status, msg: response.message});
					}
				});
			};
			//Expire button {Dnyaneshwar}
			$scope.expire = function(id, expired){
				$scope.expiredData = {expired : expired};
				console.log($scope.expiredData);
				dataService.put("put/website/"+id, $scope.expiredData)
				.then(function(response) { //function for businesslist response
					$scope.alerts.push({type: response.status, msg: response.message});
				});
			};
		};
		
		//function for active button
		var showActive= function(status){
		$scope.status = {status:1};
			dataService.get("getmultiple/website/"+$scope.webListCurrentPage+"/"+$scope.pageItems, $scope.status)
				.then(function(response) {  //function for templatelist response
					if(response.status == 'success'){
						$scope.website=response.data;
						$scope.totalRecords = response.totalRecords;
					}
					else
					{
						$scope.alerts.push({type: response.status, msg: response.message});
					};
				});
			
		}//end of active button function
        
        var requestedsitelist = function(){
			//function for requestedsitelist{Dnyaneshwar}
			$scope.websiteParams = $scope.userInfo;
			dataService.get("getmultiple/website/"+$scope.reqestSiteCurrentPage+"/"+$scope.pageItems, $scope.userInfo)
			.then(function(response) {  //function for requestedsitelist response
			if(response.status == 'success'){
					$scope.website=response.data;
					//$scope.alerts.push({type: response.status, msg:'data access successfully..'});
					$scope.totalRecords = response.totalRecords;	
				}
				else
				{
					$scope.alerts.push({type: response.status, msg: response.message});
				};
				$scope.website = response.data;
			});
		};
        
        switch($scope.websitePart) {
			case 'websiteslist':
				websiteslist();
				break;
			case 'requestnewsite':
				requestnewsite();
				break;
			case 'requestedsitelist':
				requestedsitelist();
				break;
			default:
				websiteslist();
		};
	
    };
	// Inject controller's dependencies
	websitesController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('websitesController', websitesController);
});

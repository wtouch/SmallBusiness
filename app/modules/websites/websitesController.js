'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$rootScope','$injector','$routeParams','$location','dataService','upload','modalService', '$http'];
	
	var websitesController = function ($scope,$rootScope,$injector,$routeParams,$location,dataService,upload,modalService,$http) {
		//all $scope object goes here
        $scope.alerts = [];
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.webListCurrentPage = 1;
		$scope.reqestSiteCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.currentDate = dataService.currentDate;
		$scope.permission = $rootScope.userDetails.permission.website_module;
		$scope.userInfo = {user_id : $rootScope.userDetails.id}; // these are URL parameters
		$scope.websitePart = $routeParams.websitePart;
		$scope.formPart = 'checkdomainavailable';
		$scope.changeStatus={};
		$scope.showFormPart = function(formPart){
			$scope.formPart = formPart;
		};
		$scope.setFormScope= function(scope){
			$scope.formScope = scope;
		}
		
		//function for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		//For display by default website list
		if(!$scope.websitePart) {
			$location.path('/dashboard/websites/websiteslist');
		}
		$scope.checkAvailable = function(domain_name){
			if(domain_name !== undefined){
				dataService.post("post/domain", {domain : domain_name }).then(function(response){
					if(response[domain_name].status == 'available'){
						$scope.formScope.requestsiteForm.domain_name.$setValidity('available', true);
						$scope.domainAvailableMsg = "Domain Available";
					}else{
						$scope.formScope.requestsiteForm.domain_name.$setValidity('available', false);
						$scope.domainAvailableMsg = "Domain not available please select another!";
					}
				})
			}else{
				$scope.formScope.requestsiteForm.domain_name.$setValidity('available', false);
			}
		};
		
		$scope.checkSubsomainAvailable = function(domain_name){
			if(domain_name !== undefined){
				dataService.post("post/domain", {domain : domain_name }, {subdomain : true}).then(function(response){
					if(response.status == 'success'){
						$scope.formScope.requestsiteForm.subdomain.$setValidity('available', true);
						$scope.domainAvailableMsg = "Domain Available";
					}else{
						$scope.formScope.requestsiteForm.subdomain.$setValidity('available', false);
						$scope.domainAvailableMsg = "Domain not available please select another!";
					}
				})
			}else{
				$scope.formScope.requestsiteForm.domain_name.$setValidity('available', false);
			}
		}
		
		//open function for previewing the website
        $scope.open = function (url, webId) {
			dataService.get("getsingle/website/"+webId)
			.then(function(response) {
				var modalDefaults = {
					templateUrl: url,	
					size : 'lg'
				};
				var modalOptions = {
					website: dataService.parse(response.data)
				};
				modalService.showModal(modalDefaults, modalOptions).then(function (result) {
				}); 
			});
		};
		
		// All $scope methods
        $scope.pageChanged = function(page,where) { 
			(where) ? angular.extend($scope.websiteParams, where, $scope.userInfo) : "";
			dataService.get("getmultiple/website/"+page+"/"+$scope.pageItems, $scope.websiteParams)
			.then(function(response) {  
				$scope.website = response.data;
			});
		};
		
		// for users list/customerList
		var userStatus = {status: 1};
		angular.extend(userStatus, $scope.userInfo)
		dataService.get("getmultiple/user/1/500", userStatus)
		.then(function(response) {  
			if(response.status == 'success'){
				$scope.customerList = response.data;
			}else{
				$scope.alerts.push({type: response.status, msg: response.message});
			}
		});
		
		//for search filter
		$scope.searchFilter = function(statusCol, showStatus) {
			$scope.search = {search: true};
			$scope.filterStatus = {};
			(showStatus =="") ? delete $scope.websiteParams[statusCol] : $scope.filterStatus[statusCol] = showStatus;
			angular.extend($scope.websiteParams, $scope.filterStatus, $scope.search, $scope.userInfo);
			if(showStatus.length >= 4 || showStatus == ""){
			dataService.get("getmultiple/website/1/"+$scope.pageItems, $scope.websiteParams)
			.then(function(response) { 
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
			
		$scope.editDomainName = function(colName, colValue, id, editStatus){
			$scope.changeStatus[colName] = colValue;
				if(editStatus==0){
				 dataService.put("put/website/"+id,$scope.changeStatus)
				.then(function(response) { 
					$scope.alerts.push({type: response.status,msg: response.message});
				}); 
			}
		};	 
		$scope.showInput = function($event,opened){
			$scope.websiteParams = {};
			$event.preventDefault();
			$event.stopPropagation();
			$scope[opened] = ($scope[opened] ===true) ? false : true;
		};
		
		//this is global method for filter 
		$scope.changeStatusFn = function(statusCol, showStatus) {
			$scope.filterStatus = {};
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
		
		 // code for request new website 
        var requestnewsite = function(){
			$scope.reqnewsite = {};
			$scope.postData = function(reqnewsite) { 
			$scope.reqnewsite.date = $scope.currentDate;
				 dataService.post("post/website",reqnewsite)
				.then(function(response) {
					if(response.status == "success"){
						$scope.reqnewsite = {};
						$scope.formScope.requestsiteForm.$setPristine;
						$scope.alerts.push({type: response.status, msg: "Your Request has successfully registered. Kindly check your mailbox for activation status!"});
						dataService.progressSteps('requestSite', true);
					}else{
						$scope.alerts.push({type: response.status, msg: response.message});
					}
				});   
			}
		};
        
		//code for view website list
        var websiteslist = function(){
			$scope.websiteParams = {status: 1}
			angular.extend($scope.websiteParams, $scope.userInfo);
			dataService.get("getmultiple/website/"+$scope.webListCurrentPage+"/"+$scope.pageItems, $scope.websiteParams)
			.then(function(response) { 
			if(response.status == 'success'){
					$scope.website=response.data;
					$scope.totalRecords = response.totalRecords;	
				}
				else
				{
					$scope.alerts.push({type: response.status, msg: response.message});
				};
			});
			//delete button 
			$scope.deleted = function(id, status, activate){
				if(activate == 2){
					$scope.deletedData = {status : status, registered_date : $scope.currentDate};
				}else{
					$scope.deletedData = {status : status};
				}
				dataService.put("put/website/"+id, $scope.deletedData)
				.then(function(response) { 
					if(response.status == 'success'){
						$scope.alerts.push({type: response.status, msg: response.message});
					}
				});
			};
			//Expire button 
			$scope.expire = function(id, expired){
				$scope.expiredData = {expired : expired};
				dataService.put("put/website/"+id, $scope.expiredData)
				.then(function(response) { 
					$scope.alerts.push({type: response.status, msg: response.message});
				});
			};
		};
		
		//function for active button
		var showActive= function(status){
		$scope.status = {status:1};
			dataService.get("getmultiple/website/"+$scope.webListCurrentPage+"/"+$scope.pageItems, $scope.status)
			.then(function(response) {  
				if(response.status == 'success'){
					$scope.website=response.data;
					$scope.totalRecords = response.totalRecords;
				}
				else{
					$scope.alerts.push({type: response.status, msg: response.message});
				};
			});
		}
        
		//code for requested site list
        var requestedsitelist = function(){
			$scope.websiteParams = {status : 2};
			angular.extend($scope.websiteParams, $scope.userInfo);
			dataService.get("getmultiple/website/"+$scope.reqestSiteCurrentPage+"/"+$scope.pageItems,$scope.websiteParams)
			.then(function(response) {  
				if(response.status == 'success'){
					$scope.website=response.data;
					$scope.totalRecords = response.totalRecords;	
				}
				else{
					$scope.alerts.push({type: response.status, msg: response.message});
				};
					$scope.website = response.data;
			});
			
			//This code for apply/buy button
			$scope.dynamicTooltip = function(status, active, notActive){
				return (status==1) ? active : notActive;
			};
		
			//delete button 
			$scope.deleted = function(id, status){
				$scope.deletedData = {status : status};
				dataService.put("put/website/"+id, $scope.deletedData)
				.then(function(response) { 
					if(response.status == 'success'){
						$scope.alerts.push({type: response.status, msg: response.message});
					}
				});
			};
			//Expire button 
			$scope.expire = function(id, expired){
				$scope.expiredData = {expired : expired};
				dataService.put("put/website/"+id, $scope.expiredData)
				.then(function(response) { 
					$scope.alerts.push({type: response.status, msg: response.message});
				});
			};
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

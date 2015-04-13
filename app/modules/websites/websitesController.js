'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$rootScope','$injector','$routeParams','$location','dataService','upload','modalService', '$http'];
	
    // This is controller for this view
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
		
		console.log($scope.permission);
		
        //for display form parts
        $scope.websitePart = $routeParams.websitePart;
		// For displaying manage domain module parts! {Dnyaneshwar}
		$scope.formPart = 'checkdomainavailable';
		$scope.showFormPart = function(formPart){
			$scope.formPart = formPart;
		};
		$scope.setFormScope= function(scope){
			$scope.formScope = scope;
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
					console.log(response[domain_name].status);
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
					console.log(response.status);
				})
			}else{
				$scope.formScope.requestsiteForm.domain_name.$setValidity('available', false);
			}
		}
		
		
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
		
		if($rootScope.userDetails.group_name == "customer"){
			$scope.userInfo = {user_id : $rootScope.userDetails.id}; // these are URL parameters
		}
		if($rootScope.userDetails.group_name == "manager"){
			$scope.userInfo = {manager_id : $rootScope.userDetails.id}; // these are URL parameters
		}
		if($rootScope.userDetails.group_name == "superadmin" || $rootScope.userDetails.group_name == "admin"){
			$scope.userInfo = {}; // these are URL parameters
		}
		if($rootScope.userDetails.group_name == "salesman"){
			$scope.userInfo = {salesman_id : $rootScope.userDetails.id}; // these are URL parameters
		}
	
		
		// All $scope methods
        $scope.pageChanged = function(page,where) { // Pagination page changed
			(where) ? angular.extend($scope.websiteParams, where, $scope.userInfo) : "";
			dataService.get("getmultiple/website/"+page+"/"+$scope.pageItems, $scope.websiteParams)
			.then(function(response) {  //function for websitelist response
				$scope.website = response.data;
				console.log($scope.website);
			});
		};
		// for users list/customerList
		
		dataService.get("getmultiple/user/1/500", {status: 1, user_id : $rootScope.userDetails.id})
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
			angular.extend($scope.websiteParams, $scope.filterStatus, $scope.search, $scope.userInfo);

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
			$scope.websiteParams = {};
			$event.preventDefault();
			$event.stopPropagation();
			$scope[opened] = ($scope[opened] ===true) ? false : true;
		};
		
		//this is global method for filter 
		$scope.changeStatusFn = function(statusCol, showStatus) {
			$scope.filterStatus= {};
			(showStatus =="") ? delete $scope.websiteParams[statusCol] : $scope.filterStatus[statusCol] = showStatus;
			angular.extend($scope.websiteParams, $scope.filterStatus, $scope.userInfo);
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
				.then(function(response) {
					if(response.status == "success"){
						$scope.reqnewsite = {};
						$scope.formScope.requestsiteForm.$setPristine;
						$scope.alerts.push({type: response.status, msg: "Your Request has successfully registered. Kindly check your mailbox for activation status!"});
					}else{
						$scope.alerts.push({type: response.status, msg: response.message});
					}
					
					
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
			$scope.deleted = function(id, status, activate){
				if(activate == 2){
					$scope.deletedData = {status : status, registered_date : $scope.currentDate};
				}else{
					
				}
				
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
			$scope.websiteParams = {status : 2};
			angular.extend($scope.websiteParams, $scope.userInfo);
			dataService.get("getmultiple/website/"+$scope.reqestSiteCurrentPage+"/"+$scope.pageItems,$scope.websiteParams)
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

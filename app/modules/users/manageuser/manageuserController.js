'use strict';

define(['app'], function (app) { 
    var injectParams = ['$scope', '$injector', '$routeParams','$location','dataService','$route','modalService']; /* Added $routeParams to access route parameters */
    // This is controller for this view
	var manageuserController = function ($scope, $injector, $routeParams,$location,dataService,$route,modalService) {
		
		//variable decalaration
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.usersGroupCurrentPage = 1;
		$scope.usersListCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";	
		$scope.userList = [];
		$scope.alerts = [];
		$scope.currentDate = dataService.currentDate;
		
		//For display by default userslist.html page
		$scope.userViews = $routeParams.userViews; 
		if(!$routeParams.userViews) {
			$location.path('/dashboard/users/userslist');
		}
		
		//change tooltip dynamically
		$scope.dynamicTooltip = function(status, active, notActive){
			return (status==1) ? active : notActive;
		};
		
		//function for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		
		//datepicker {sonali}	
		$scope.today = function() 
		{
			$scope.date = new Date();
		};
		$scope.today();
		$scope.open = function($event,opened)
		{
			$event.preventDefault();
			$event.stopPropagation();
			$scope.opened = ($scope.opened==true)?false:true;
		};
		 /* $scope.dateOptions = {
			formatYear: 'yyyy',
			startingDay: 1
		};  */
		
		$scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		// Date Picker Ended here 
		
		//code for pagination
		$scope.pageChanged = function(page) { 
			dataService.get("getmultiple/user/"+page+"/"+$scope.pageItems).then(function(response){
				$scope.userList = response.data;
				console.log(response.data);
				$scope.totalRecords = response.totalRecords;
			});
		};	
		//End of pagination
		
		//code for modal
		$scope.openModal = function (url, userId) {
				var modalDefaults = {
					templateUrl: url,	// apply template to modal
					size : 'lg'
				};
				var modalOptions = {
					userId : userId
				};
				
				modalService.showModal(modalDefaults, modalOptions).then(function (result) {
					console.log("modalOpened");
					console.log(modalOptions);
					dataService.put("put/user/register"+id, modalOptions.data)
					.then(function(response){
						console.log(response);
					})
					$scope.ok = function () {
						$modalOptions.close('ok');
					};
				});
		};
		
		
		//code for check password
		$scope.passMatch = function(pass1, pass2){
			$scope.pass = (pass1===pass2) ? true : false;
			//alert($scope.pass);
		}
		$scope.submitted = false;
		
		
		//code for search filter
		$scope.searchFilter = function(statusCol, colValue) {
			$scope.search = {search: true};
			$scope.userParams = {};
			$scope.filterStatus= {}; // search filter for send request ex. {columnName : value}
			(colValue =="") ? delete $scope.userParams[statusCol] : $scope.filterStatus[statusCol] = colValue;
			angular.extend($scope.userParams, $scope.filterStatus);
			angular.extend($scope.userParams, $scope.search);
			if(colValue.length >= 4 || colValue ==""){
				if($scope.userViews == 'userslist'){
					dataService.get("/getmultiple/user/1/"+$scope.pageItems, $scope.userParams).then(function(response) { 
						if(response.status == 'success'){
							$scope.userList = response.data; // this will change for template
							$scope.totalRecords = response.totalRecords; // this is for pagination
						}else{
							$scope.userList = {};
							$scope.totalRecords = {};
							$scope.alerts.push({type: response.status, msg: response.message});
						}
					});
				}
				if($scope.userViews == 'usersgroup'){
					dataService.get("/getmultiple/usergroup/1/"+$scope.pageItems, $scope.userParams).then(function(response) { 
						if(response.status == 'success'){
							$scope.usergroupList = response.data; // this will change for template
							$scope.totalRecords = response.totalRecords; // this is for pagination
						}else{
							$scope.usergroupList = {};
							$scope.totalRecords = {};
							$scope.alerts.push({type: response.status, msg: response.message});
						}
					});
				}
				
			}
		};
		
		//global method for change status of particular column 
		$scope.hideDeleted = "";// & use this filter in ng-repeat - filter: { status : hideDeleted}
		$scope.changeStatus = {};
		$scope.changeStatusFn = function(colName, colValue, id){
			$scope.changeStatus[colName] = colValue;
			console.log($scope.changeStatus);
			if($scope.userViews=='userslist'){
				dataService.put("put/user/"+id, $scope.changeStatus)
				.then(function(response) { 
					
					$scope.alerts.push({type: response.status, msg: response.message});
				});
			}
			if($scope.userViews=='usersgroup'){
				dataService.put("put/usergroup/"+id, $scope.changeStatus)
				.then(function(response) { 
					/* if(colName=='status'){
						//$scope.hideDeleted = 1;
					} */
					$scope.alerts.push({type: response.status, msg: response.message});
				}); 
			}
			
		};
		
		/*code for delete user	
		$scope.deleteuser = function(id, status, index){
			if(status==1){
				$scope.status = {status : 0};
				console.log($scope.status);
				/*dataService.put("put/user/"+id, $scope.status)
				.then(function(response) { 
					console.log(response.message);
					$scope.userList[index].status = 0
					$scope.hideDeleted = 1;
 				});
			}
		};*/
		
		/* function(scope, element, attrs, accordionCtrl) {
			var getIsOpen, setIsOpen;
			accordionCtrl.addGroup(scope);
			scope.isOpen = false;
			if ( attrs.isOpen ) {
				getIsOpen = $parse(attrs.isOpen);
				setIsOpen = getIsOpen.assign;
				scope.$parent.$watch(getIsOpen, function(value) {
					scope.isOpen = !!value;
				});
			}
			scope.$watch('isOpen', function(value) {
				if ( value ) {
					accordionCtrl.closeOthers(scope);
				}
				if ( setIsOpen ) {
					setIsOpen(scope.$parent, value);
				}
			});
		} */
		$scope.open = function() {
			$scope.opened = true;
		}
		$scope.close = function() {
			dataService.put("put/usergroup/"+id, $scope.changeStatus)
				.then(function(response) { 
					$scope.alerts.push({type: response.status, msg: response.message});
				});
			$scope.opened = false;
		}
	
		$scope.adduser ={};
		//add user information
		var addUsers =	function(){
			$scope.reset = function() {
				$scope.adduser = {};
			};
			$scope.postData = function(adduser) {
				$scope.adduser.register_date = $scope.currentDate;
				console.log(adduser);
				dataService.post("post/user/register",adduser)
				.then(function(response) {  
					if(response.status == 'success'){
						$scope.submitted = true;
						$scope.alerts.push({type: response.status, msg: response.message});
						
					}else{
						$scope.alerts.push({type: response.status, msg: response.message});
					}
					$scope.reset();
				});
			}
			if($routeParams.id){
				dataService.get("getsingle/user/"+$routeParams.id)
				.then(function(response) {
					$scope.adduser = response.data;
					console.log(response);
					//$scope.usersId = $routeParams.id;
				});
				$scope.update = function(adduser){
					dataService.put("put/user/"+$routeParams.id,adduser)
					.then(function(response) {
						console.log(response);
						if(response.status == 'success'){
							$scope.submitted = true;
							$scope.alerts.push({type: response.status, msg: response.message});
						
						}else{
							$scope.alerts.push({type: response.status, msg: response.message});
						}
						$scope.reset();
					});
				};
			}
		};			
		
		$scope.usersgroup ={};
		//create user group
		var usersGroup = function(){
			$scope.reset = function() {
				$scope.usersgroup = {};
			};
			$scope.usersgroup.date = $scope.currentDate;
				$scope.postData = function(usersgroup) {
					dataService.post("post/usergroup",usersgroup)
					.then(function(response) {  
						if(response.status == 'success'){
							$scope.submitted = true;
							$scope.alerts.push({type: response.status, msg: response.message});
							
						}else{
							$scope.alerts.push({type: response.status, msg: response.message});
						}	
						$scope.reset();
					});
				
			}
			if($routeParams.id){
				dataService.get("getsingle/usergroup/"+$routeParams.id)
				.then(function(response) {
					$scope.usersgroup = response.data;
					console.log(response);
					//$scope.usersId = $routeParams.id;
				});
				$scope.update = function(usersgroup){
					dataService.put("put/usergroup/"+$routeParams.id,usersgroup)
					.then(function(response) {
						console.log(response);
						if(response.status == 'success'){
							$scope.submitted = true;
							$scope.alerts.push({type: response.status, msg: response.message});
						
						}else{
							$scope.alerts.push({type: response.status, msg: response.message});
						}
						$scope.reset();
					});
				};
			}
		}	
		
		var usersList = function(){
			dataService.get("getmultiple/user/"+$scope.usersListCurrentPage+"/"+$scope.pageItems).then(function(response) { 
				if(response.status == 'success'){
					$scope.userList = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.alerts.push({type: response.status, msg: response.message});
				}
			});
		}
		
		var usersgroupList = function(){
			dataService.get("getmultiple/usergroup/"+$scope.usersGroupCurrentPage+"/"+$scope.pageItems).then(function(response) { 
				//console.log(response);
				if(response.status == 'success'){
					$scope.usergroupList = response.data;
					console.log(response.data);
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.alerts.push({type: response.status, msg: response.message});
				}
			});
		}
		
		switch($scope.userViews) {
			case 'adduser':
				addUsers();
				break;
				
			case 'createusergroup':
				usersGroup();
				break;
				
			case 'userslist':
				usersList();
				break;
				
			case 'usersgroup':
				usersgroupList();
				break;
				
			default:
				usersList();
		};
			
		
	
	};

	// Inject controller's dependencies
	manageuserController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('manageuserController', manageuserController);
	
});
/*$http.get("../server-api/index.php/properties/"+$scope.usersGroupCurrentPage+"/"+$scope.pageItems).success(function(response) {
				$scope.manageusers.usersGroupCurrentPage = response.manageusers.usersGroupCurrentPage;
				//$scope.totalRecords = response.totalRecords;
				//console.log($scope.properties);
			});
			//get request for usersList
			$http.get("../server-api/index.php/properties/"+$scope.usersListCurrentPage+"/"+$scope.pageItems)
			.success(function(response) {  //function for mytemplate response
				$scope.manageusers.usersListCurrentPage = response.manageusers.usersListCurrentPage;
				//$scope.totalRecords = response.totalRecords;
				//console.log($scope.properties);
			});*/
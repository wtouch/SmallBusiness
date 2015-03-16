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
		
		//For display by default userslist.html page
		$scope.userViews = $routeParams.userViews; 
		if(!$routeParams.userViews) {
		$location.path('/dashboard/users/userslist');
		}
		
		//change tooltip dynamically
		$scope.dynamicTooltip = function(status, active, notActive){
			return (status==1) ? active : notActive;
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
		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};

		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
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
					dataService.put("put/user/"+id, modalOptions.data)
					.then(function(response){
						console.log(response);
					})
				});
		};
		$scope.ok = function () {
			$modalOptions.close('ok');
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
		};
		
		//global method for change status of particular column 
		$scope.hideDeleted = "";// & use this filter in ng-repeat - filter: { status : hideDeleted}
		$scope.changeStatus = function(colName, colValue, id){
		$scope.changeStatus[colName] = colValue;
		console.log(colValue);
			dataService.put("put/user/register"+id, $scope.changeStatus)
			.then(function(response) { //function for businesslist response
					if(colName=='status'){
						$scope.hideDeleted = 1;
					}
					if(response.status == 'success'){
						$scope.userList = response.data; // this will change for template
						$scope.totalRecords = response.totalRecords; // this is for pagination
					}else{
						$scope.userList = {};
						$scope.totalRecords = {};
						$scope.submitted = true;
						$scope.alerts.push({type: response.status, msg: response.message});
					}
			});
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
		
		//add user information
		var addUsers =	function(){
			$scope.postData = function(adduser) {
				console.log(adduser);
				dataService.post("post/user/register",adduser)
				.then(function(response) {  
					if(response.status == 'success'){
						$scope.submitted = true;
						$scope.alerts.push({type: response.status, msg: response.message});
						
					}else{
						$scope.alerts.push({type: response.status, msg: response.message});
					}					
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
					});
				};
				
			}
		};			
		
		
		//create user group
		var usersGroup = function(){
				$scope.postData = function(usergroup) {
				console.log(usergroup);
				dataService.post("post/user/register",usergroup)
				.then(function(response) {  
					if(response.status == 'success'){
						$scope.submitted = true;
						$scope.alerts.push({type: response.status, msg: response.message});
						
					}else{
						$scope.alerts.push({type: response.status, msg: response.message});
					}	
					//$scope.reset();
				});
				
			}
		}	
		
		var usersList = function(){
			//$scope.statusParam = {status : 1};
			
			dataService.get("getmultiple/user/"+$scope.usersListCurrentPage+"/"+$scope.pageItems).then(function(response) { 
				
				if(response.status == 'success'){
					$scope.userList = response.data;
					console.log(response.data);
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.alerts.push({type: response.status, msg: response.message});
				}
			});
			
			$scope.verify = function(id, status){
				$scope.veryfiedData = {status : status};
				
				dataService.put("put/user_group/"+id, $scope.veryfiedData)
				.then(function(response) { //function for businesslist response
					console.log(response);
				});
			} ;
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
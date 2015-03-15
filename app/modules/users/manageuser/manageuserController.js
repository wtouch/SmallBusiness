'use strict';

define(['app'], function (app) { 
    var injectParams = ['$scope', '$injector', '$routeParams','$location','dataService','$route','modalService']; /* Added $routeParams to access route parameters */
    // This is controller for this view
	var manageuserController = function ($scope, $injector, $routeParams,$location,dataService,$route,modalService) {
		
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
				});
		};
		$scope.ok = function () {
			$modalOptions.close('ok');
		};
		
		//For display by default userslist.html page
		$scope.userViews = $routeParams.userViews; 
		if(!$routeParams.userViews) {
		$location.path('/dashboard/users/userslist');
		}
		
		//Code For Pagination
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.usersGroupCurrentPage = 1;
		$scope.usersListCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";	
		$scope.userList = [];
		
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
		
		//code for search filter
		$scope.searchFilter = function(statusCol, colValue) {
			$scope.searchObj = {search: true, username : colValue};
			//angular.extend($scope.searchObj, $scope.statusParam);
			if(colValue.length >= 4){
				dataService.get("/getmultiple/user/1/"+$scope.pageItems, $scope.searchObj)
				.then(function(response) {  
					if(response.status=="warning" || response.status=='error' ){
						$scope.userList = response.data;
						console.log(response);
						$scope.totalRecords = response.totalRecords;
					}else{
						$scope.userList = response.data;
						$scope.totalRecords = response.totalRecords;
						console.log($scope.userList);
					}
				});
			}
		};
		
		//add user information
		var addUsers =	function(){
			$scope.postData = function(adduser) {
				console.log(adduser);
				/*dataService.post("/post/user/"+pageItems,adduser)
				.then(function(response) {  
					if(response.status=="success"){
						$scope.alerts.push({type: response.status, msg: response.message});
					}else{
						$scope.alerts.push({type: response.status, msg: response.message});
					}
					$scope.reset();
				});*/
			}
		}
		
		//create user group
		var usersGroup = function(){
				$scope.postData = function(usergroup) {
				console.log(usergroup);
				/*dataService.post("/post/user/"+pageItems,adduser)
				.then(function(response) {  
					if(response.status=="success"){
						$scope.alerts.push({type: response.status, msg: response.message});
					}else{
						$scope.alerts.push({type: response.status, msg: response.message});
					}
					$scope.reset();
				});*/
				
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
				
				dataService.put("put/user/"+id, $scope.veryfiedData)
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
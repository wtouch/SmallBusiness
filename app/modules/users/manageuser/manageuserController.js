'use strict';

define(['app'], function (app) { 
    var injectParams = ['$scope', '$injector', '$routeParams','$location']; /* Added $routeParams to access route parameters */
    // This is controller for this view
	var manageuserController = function ($scope, $injector, $routeParams,$location) {
		//console.log("this is manageuserController");
		
		//For display by default userslist.html page{trupti}
		$scope.userViews = $routeParams.userViews; 
		//console.log($scope.userViews);
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
				//$scope.opened = true;
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
			//$log.log('Page changed to: ' + $scope.currentPage);
			//get request for usersGroup
			dataService.get("getmultiple/user/"+page+"/"+$scope.pageItems).then(function(response){
				$scope.userList = response.data;
				console.log(response.data);
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
			
			
		};	
		//End of pagination
		
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
				
			default:
				usersGroup();
		};
			
		
	
	};

	// Inject controller's dependencies
	manageuserController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('manageuserController', manageuserController);
	
});

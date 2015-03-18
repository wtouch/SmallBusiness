
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector'];

    // This is controller for this view
	var editprofileController = function ($scope,$injector) {
	//datepicker {sonali}	
		$scope.today = function() 
		{
			$scope.dt = new Date();
		};
		$scope.today();
		$scope.open = function($event)
		{
			$event.preventDefault();
			$event.stopPropagation();
			$scope.opened =true;
		};
		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};

		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
	/* Date Picker Ended here --------------------------------------------------------------------------------------*/
	
	$scope.passMatch = function(pass1, pass2){
			$scope.pass = (pass1===pass2) ? true : false;
			//alert($scope.pass); 
		}
		$scope.changepassword = function(changepasswd) {
			console.log(changepasswd);
			$scope.userID = {user_id : $rootScope.userDetails.id}
			angular.extend(changepasswd, $scope.userID);
			console.log(JSON.stringify(changepasswd));
			dataService.post("post/user/changepass",changepasswd)
			.then(function(response) {
				if(response.status == 'success'){
					$scope.changepasswd = {};
					$scope.alerts.push({type: response.status, msg: response.message});
				}else{
					$scope.alerts.push({type: (response.status == 'error') ? "danger" :response.status, msg: response.message});
				}
			})  
		}
	
	console.log("this is editprofile ctrl");
		templateUrl:'http://localhost/trupti/SmallBusiness/app/modules/mybusiness/addbusiness/editprofile.html';
    };
	// Inject controller's dependencies
	editprofileController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('editprofileController', editprofileController);
});

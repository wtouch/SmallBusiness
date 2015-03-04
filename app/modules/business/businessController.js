

'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$location'];

    // This is controller for this view
	var businessController = function ($scope, $injector, $routeParams,$location)
	{
		//method for insert data of add business form{trupti}
		$scope.insert = function(addbusiness){
			console.log($scope.addbusiness);
			$http.post("../server-api/index.php/post/business",$scope.addbusiness)
			.success(function(response) {
				alert(response);
				console.log(response);
			})
		}	//end of insert
		
		// This code for Date Picker {Vilas}
		$scope.today = function(){
			$scope.newsDate = new Date();
		};
		$scope.today();
		$scope.open = function($event,opened)
		{
			$event.preventDefault();
			$event.stopPropagation();
			$scope[opened] = ($scope[opened]===true) ? false : true;
		};
		$scope.dateOptions ={
			formatYear: 'yy',
			startingDay: 1
		};

		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		/* Date Picker Ended here --------------------------------------------------------------------------------------*/
		
		// This will change businessView dynamically from 'business.html' {Vilas}
		
		$scope.businessView = $routeParams.businessView;
		console.log($scope.businessView );
		
		//for display default businesslist.html{trupti}
		if(!$routeParams.businessView) {
			$location.path('/dashboard/business/businesslist');
		}
		
		// Add Business multi part form show/hide operation from here! {Vilas}
		$scope.formPart = 'home';
		console.log($scope.formPart);
		$scope.showFormPart = function(formPart){
			$scope.formPart = formPart;
		};  


		//Code For Pagination
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.bizListCurrentPage = 1;
		$scope.delBizCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";		

		$scope.pageChanged = function() {
			//$log.log('Page changed to: ' + $scope.currentPage);
			//get request for businesslist
			$http.get("../server-api/index.php/properties/"+$scope.bizListCurrentPage+"/"+$scope.pageItems)
			.success(function(response) { //function for businesslist response
				$scope.business.bizListCurrentPage = response.business.bizListCurrentPages;
				//$scope.totalRecords = response.totalRecords;
				//console.log($scope.properties);
			});
			//get request for delete bizlist 
			$http.get("../server-api/index.php/properties/"+$scope.delBizCurrentPage+"/"+$scope.pageItems)
			.success(function(response) { //function for deltebiz response
				$scope.business.delBizCurrentPage = response.business.delBizCurrentPage;
				//$scope.totalRecords = response.totalRecords;
				//console.log($scope.properties);
			});
		};//End of pagination
    };
	
	// Inject controller's dependencies
	businessController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('businessController', businessController);

});

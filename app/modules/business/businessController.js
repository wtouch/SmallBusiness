'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$location','dataService'];

    // This is controller for this view
	var businessController = function ($scope, $injector, $routeParams,$location,dataService)
	{
		//all $scope object goes here
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.bizListCurrentPage = 1;
		$scope.delBizCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";	
		$scope.user_id = {user_id : 2}; // these are URL parameters
		$scope.formPart = $routeParams.formPart;
		
		
		// This will change businessView dynamically from 'business.html' {Vilas}
		
		$scope.businessView = $routeParams.businessView;
		console.log($scope.businessView );
				
		// Add Business multi part form show/hide operation from here! {Vilas}
		$scope.formPart = 'home';
		console.log($scope.formPart);
		$scope.showFormPart = function(formPart){
			$scope.formPart = formPart;
		};  
		
		//for display default businesslist.html{sonali}
		if(!$routeParams.businessView) {
			$location.path('/dashboard/business/businesslist');
		}
				
		$scope.pageChanged = function(page) {
			//$log.log('Page changed to: ' + $scope.currentPage);
			//get request for businesslist
			dataService.get("/getmultiple/business/"+page+"/"+$scope.pageItems)
			.then(function(response) { //function for businesslist response
				$scope.bizList = response.data;
				//$scope.totalRecords = response.totalRecords;
				
			});
			//get request for delete bizlist 
			dataService.get("/getmultiple/business/"+page+"/"+$scope.pageItems)
			.then(function(response) { //function for deltebiz response
				$scope.delBiz = response.data;
				//$scope.totalRecords = response.totalRecords;
				//console.log($scope.properties);
			});
		};
		
		var businesslist = function(){
			dataService.get("/getmultiple/business/"+$scope.bizListCurrentPage+"/"+$scope.pageItems)
			.then(function(response){
				$scope.totalRecords=response.totalRecords;
				$scope.bizList=response.data;
				console.log(response.data);
			});	
			//This code for publish unpublish button{sonali}
			
			$scope.dynamicTooltip = function(status, active, notActive){
				return (status==1) ? active : notActive;
			};
			
			$scope.verify = function(id, verified){
				$scope.veryfiedData = {verified : verified};
				
				dataService.put("put/business/"+id, $scope.veryfiedData)
				.then(function(response) { //function for businesslist response
					console.log(response);
				});
			} ;
			//This code for featured unfeatured button {sonali}
			$scope.feature = function(id, featured){
				$scope.featuredData = {featured : featured};
				console.log($scope.featuredData);
				dataService.put("put/business/"+id, $scope.featuredData)
				.then(function(response) { //function for businesslist response
					console.log(response);
				});
			};
			//Update business edit button {sonali}
			$scope.editBusiness = function(id){
				$location.path('/dashboard/business/addbusiness/'+id);
			};
				
			//delete button {sonali}
			$scope.deleted = function(id, status){
				$scope.deletedData = {status : status};
				console.log($scope.deletedData);
				dataService.put("put/business/"+id, $scope.deletedData)
				.then(function(response) { //function for businesslist response
					console.log(response);
				});
			};
			
			
			
		};
		
		var deletedbusiness = function(){
			dataService.get("/getmultiple/business/"+$scope.delBizCurrentPage+"/"+$scope.pageItems)
			.then(function(response){
				$scope.totalRecords=response.totalRecords;
				$scope.delBiz=response.data;
				console.log(response.data);
			});		
		};
		
		//method for insert data of add business form{trupti}
		$scope.insert = function(addbusiness){
			console.log($scope.addbusiness);
			dataService.post("../server-api/index.php/post/business",$scope.addbusiness)
			.then(function(response) {
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
		
		switch($scope.formPart) {
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

'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$http','$routeParams','$location','dataService','modalService'];

    // This is controller for this view
	var businessController = function ($scope, $injector,$http, $routeParams,$location,dataService,modalService)
	{
		
		$scope.open = function (url, buzId) {
			dataService.get("getsingle/business/"+buzId)
			.then(function(response) {
				var modalDefaults = {
					templateUrl: url,	// apply template to modal
				};
				var modalOptions = {
					bizList: response  // assign data to modal
				};
				modalService.showModal(modalDefaults, modalOptions).then(function (result) {
					console.log("modalOpened");
				});
			});
			
		};
		$scope.ok = function () {
			$modalOptions.close('ok');
		};

		
		
		//all $scope object goes here
		$scope.alerts = [];
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.bizListCurrentPage = 1;
		$scope.delBizCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";	
		$scope.user_id = {user_id : 1}; // these are URL parameters
		$scope.formPart = $routeParams.formPart;
		
		
		//function for close alert
			$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
			};
		
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
			dataService.get("/getmultiple/business/"+page+"/"+$scope.pageItems, $scope.user_id)
			.then(function(response) { //function for businesslist response
				
				$scope.bizList = response.data;
				
				
			});
			//get request for delete bizlist 
			dataService.get("/getmultiple/business/"+page+"/"+$scope.pageItems, $scope.user_id)
			.then(function(response) { //function for deltebiz response
				$scope.delBiz = response.data;
				$scope.totalRecords = response.totalRecords;
			});
		};
		
		var businesslist = function(){
			dataService.get("/getmultiple/business/"+$scope.bizListCurrentPage+"/"+$scope.pageItems, $scope.user_id)
			.then(function(response){
				if(response.status == 'success'){	
					$scope.bizList=response.data;
					//$scope.alerts.push({type: response.status, msg:'data access successfully..'});
					$scope.totalRecords=response.totalRecords;									
					//console.log(response.data);
				}
				else
				{
					$scope.alerts.push({type: response.status, msg: response.message});
				}
				$scope.bizList=response.data;
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
			dataService.get("/getmultiple/business/"+$scope.delBizCurrentPage+"/"+$scope.pageItems, $scope.user_id)
			.then(function(response){
				if(response.status == 'success'){
					$scope.delBiz=response.data;
					//$scope.alerts.push({type: response.status, msg:'data access successfully..'});
					$scope.totalRecords=response.totalRecords;				
				//console.log(response.data);			
				}
				else
				{
					$scope.alerts.push({type: response.status, msg: response.message});
				}
				$scope.delBiz=response.data;
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
		
		
		
		
		/*/ This code for Date Picker {Vilas}
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

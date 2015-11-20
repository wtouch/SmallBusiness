 'use strict'; 
define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService'];
	 
    //This is controller for this view
	var transactionController = function ($scope, $rootScope, $injector, modalService, $routeParams, $notification, dataService) {
		
		$rootScope.metaTitle = "Inventory Project";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.transactionView = true;
		$scope.currentDate = dataService.currentDate;
		
		/* dataService.config('config', {config_name : "category"}).then(function(response){
			$scope.categoryConfig = response.config_data;
		});
		 */
		$scope.getData = function(single, page, table, subobj, params, modalOptions) {
			$scope.params = (params) ? params : {
				where : {
					status : 1
				},
				cols : ["*"]
			};
			if(page){
				angular.extend($scope.params, {
					limit : {
						page : page,
						records : $scope.pageItems
					}
				})
			}
			dataService.get(false,table,$scope.params).then(function(response) {
				console.log(response);
				if(response.status == 'success'){
					if(modalOptions != undefined){
						modalOptions[subobj] = angular.copy(response.data);
						modalOptions.totalRecords = response.totalRecords;
					}else{
						$scope[subobj] = angular.copy(response.data);
						$scope.totalRecords = response.totalRecords;
					}
				}else{
					if(modalOptions != undefined){
						modalOptions[subobj] = [];
						modalOptions.totalRecords = 0;
					}else{
						$scope[subobj] = [];
						$scope.totalRecords = 0;
					}
				}
			});
		}
		
	/*********************************************************************************/
	//Modlal For add income form
		$scope.openAddincome = function (url) {
			var modalDefaults = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				//addincome : (addincome) ? x : {},
				incomeDate : { date : $scope.currentDate},
				/* postData : function(addincome) {
					console.log(addincome);
					dataService.post("transaction", addincome).then(function(response){
						if(response.status == "success"){
							
						}
						if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
						$notification[response.status]("Add record", response.message);
					});
				}, */
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'transaction','addincome');
						}
					})
				},
				getData:function (){
					$scope.getData(false, currentPage,'user','userList');
				}
			}; 
			modalService.showModal(modalDefaults, modalOptions).then(function (result) {
				
			});
		
		
		};
	/***********************************************************************************/
	
		$scope.openAddexpence = function (url) {
			var modalDefaults = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				//addincome : (addincome) ? x : {},
				Date : { date : $scope.currentDate},
				/* postData : function(addincome) {
					console.log(addincome);
					dataService.post("transaction", addincome).then(function(response){
						if(response.status == "success"){
							
						}
						if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
						$notification[response.status]("Add record", response.message);
					});
				}, */
				
			}; 
			modalService.showModal(modalDefaults, modalOptions).then(function (result) {
				
			});
		
		
		};
	/***********************************************************************************/
	};
		
	// Inject controller's dependencies
	transactionController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('transactionController', transactionController);
}); */
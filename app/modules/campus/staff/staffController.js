'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants','$http'];
    
    // This is controller for this view
	var staffController= function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants,$http) {
		
		//global scope objects
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.currentPage = 1;
		$scope.currentDate = dataService.currentDate;
		$rootScope.serverApiV2 = true;
		$rootScope.module = "campus";	
		/* 
		$http.get("modules/campus/config.json").success(function(response){
			console.log(response);
				$scope.staffConfig = response;
			})  */
			
		$scope.staffParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
			},
			cols : ["*"]
		}
		
		$rootScope.moduleMenus = [
			{
				name : "Add staff",
				path : "#/dashboard/campus/staff/",
				SubTitle :"Staff",
				events : {
					click : function(){
						return $scope.openModal("modules/campus/staff/addstaff.html");
					}
				}
			}			
		]
		
		$scope.openModal = function(url,data){
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions ={
				addstaff:(data)?{
					id:data.id,
					name:data.name,
					particulars:data.particulars
				}:{
					user_id:$rootScope.userDetails.id
				},
				postData : function(table, input){
						console.log(table, input);
						$rootScope.postData(table, input,function(response){
							if(response.status == "success"){
								$scope.getData(false, $scope.currentPage, 'staff','staff',$Scope.staffParams);
							}
						})
					},
					formPart : 'personalDetails',
					showFormPart : function(formPart, modalOptions){
						console.log(formPart);
						modalOptions.formPart = formPart;
					},
					getData : $scope.getData,
					addToObject : function(object,data,modalOptions){
						console.log(object,data,modalOptions);
					$rootScope.addToObject(object,modalOptions[data]);
					modalOptions[data] = {};
				},
				
				removeObject : $rootScope.removeObject,
					
	 };
	 modalService.showModal(modalDefault, modalOptions).then(function(){
				
			})
		}
		// For Get (Select Data from DB)
		$scope.getData = function(single, page, table, subobj, params, modalOptions) {
			$scope.params = (params) ? params : {
				where : {
					status : 1,
					user_id : $rootScope.userDetails.id
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
			dataService.get(single,table,$scope.params, subobj, params, modalOptions).then(function(response) {
				console.log(response);
				if(response.status == 'success'){
					if(modalOptions != undefined){
						modalOptions[subobj] = angular.copy(response.data);
						modalOptions.totalRecords = response.totalRecords;
					}else{
						($scope[subobj]) ? $scope[subobj].data = angular.copy(response.data) : $scope[subobj] = angular.copy(response.data) ;
						$scope.totalRecords = response.totalRecords;
					}
				}else{
					if(modalOptions != undefined){
						modalOptions[subobj] = [];
						modalOptions.totalRecords = 0;
					}else{
						($scope[subobj]) ? $scope[subobj].data = [] : $scope[subobj] = [] ;
						$scope.totalRecords = 0;
					}
				}
			});
		}
	}		
	// Inject controller's dependencies
	staffController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('staffController', staffController);
});
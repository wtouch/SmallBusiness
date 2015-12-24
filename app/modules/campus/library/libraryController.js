'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants','$http'];
    
    // This is controller for this view
	var libraryController= function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants,$http) {
		//global scope objects
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.pageItems = 10;
		$scope.numPages = "";	
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");		
		$scope.currentPage = 1;
		$scope.currentDate = dataService.currentDate;
		$rootScope.serverApiV2 = true;
		$rootScope.module = "campus";	
			
		$scope.bookParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
			},
			cols : ["*"]
		}
		
		$rootScope.moduleMenus = [
			{
				name : "Book Transaction",
				events : {
					click : function(){
						return $scope.openModal("modules/campus/library/booktransaction.html");
					}
				}
			}
			]
			
		$scope.openModal=function(url,data){
				var modalDefault={
					templateUrl:url,
					size:'lg'
				};
			var modalOptions={	
				date : $scope.currentDate,
				addBook:(data)?{
					id:data.id,
					user_id:data.user_id,
					student_id:data.student_id,
					book_transaction_id:data.book_transaction_id,
					
				}:{
					user_id:$rootScope.userDetails.id,
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
				},
					postData : function(table, input){
						console.log(table, input);
						$rootScope.postData(table, input,function(response){
							if(response.status == "success"){
								$scope.getData(false, $scope.currentPage, 'book_transaction','book_transaction',$Scope.bookParams);
							}
						})
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
	};
	// Inject controller's dependencies
	libraryController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('libraryController', libraryController);
});
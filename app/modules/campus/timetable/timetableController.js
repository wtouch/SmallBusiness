'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$location','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants'];
    
    // This is controller for this view
	var timetableController= function ($scope,$location,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
		//global scope objects
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.pageItems = 10;
		$scope.numPages = "";	
		$scope.currentPage = 1;
		/* $scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS"); */
		$rootScope.serverApiV2 = true;
		$rootScope.module = "campus";
		$scope.currentDate = dataService.currentDate;
		
		$scope.vendorParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
			},
			cols : ["*"]
		}
		
		$rootScope.moduleMenus = [
			{
				name : "Add Timetable",
				SubTitle :"Add Timetable",
				events : {
					click : function(){
						return $scope.openModal("modules/campus/timetable/addtimetable.html");
					}
				}
			}
		]
		
		$scope.setDate = function(date, days, sql){
			var curDate = new Date(date);
			var newDate = curDate.setDate(curDate.getDate() + days);
			var finalDate;
			if(sql == "date"){
				finalDate = dataService.sqlDateFormate(newDate);
			}else if(sql == "datetime"){
				finalDate = dataService.sqlDateFormate(newDate, "datetime");
			}else{
				finalDate = new Date(newDate);
			}
			return finalDate;
		}
		
		$scope.openModal = function(url,data){
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions ={
				addstaff:(data)?{
					id:data.id,
					name:data.name
				}:{},
				postData : function(table, input){
						console.log(table, input);
						$rootScope.postData(table, input,function(response){
							if(response.status == "success"){
								$scope.getData(false, $scope.currentPage, 'timetable','timetable',$Scope.examParams);
							}
						})
					},
					/* formPart : 'examDetails',
					showFormPart : function(formPart, modalOptions){
						console.log(formPart);
						modalOptions.formPart = formPart;
					}, */
					getData : $scope.getData,
					
	 };
	 modalService.showModal(modalDefault, modalOptions).then(function(){
				
		})
	}
	}		
	// Inject controller's dependencies
	timetableController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('timetableController', timetableController);
});

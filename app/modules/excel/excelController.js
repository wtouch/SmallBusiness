'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$rootScope','$injector','$routeParams','$location','dataService','upload','modalService', '$notification'];
	
	var excelController = function ($scope,$rootScope,$injector,$routeParams,$location,dataService,upload,modalService,$notification) {
		//all $scope object goes here
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.excelPart = $routeParams.excelPart;
		
		$scope.getData = function(){
			dataService.get("getmultiple/excel/1/10", {})
			/* dataService.get("getmultiple/excel/"+page+"/"+$scope.pageItems, {}) */
			.then(function(response) {  
				console.log(response);
				if(response.status == 'success'){
					$scope.list = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$notification.error("Get Patient List", "You didn't added any business! Please add business first.");
				}
			});
		}
		$scope.getData();
		
		/* $scope.pageChanged = function(page) {
			//(featured) ? angular.extend($scope.businessParams, featured) : "";
		dataService.get("getmultiple/excel/"+page+"/"+$scope.pageItems, {})
			.then(function(response) { 
				console.log(response);
				$scope.list = response.data;			
			}); 
			$scope.getData();
		};   */
		
		$scope.open = function (url, patientlist) {
			var modalDefaults = {
				templateUrl: url,	
				size : 'lg'
			};
			var modalOptions = {
				patientlist: patientlist, 
				
				updateData : function(patientlist) {
					 dataService.put("put/excel/"+patientlist.id)
					.then(function(response) {	
						if(response.status == "success"){
							$location.path("/dashboard/excel/excellist");
						}
						if(response.status == undefined){
							if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
							$notification.error("Edit Details", response.message);
						}else{
							if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
							$notification[response.status]("Edit Details", response.message);
						}	
					});
				},
			};
			modalService.showModal(modalDefaults, modalOptions).then(function (result) {
			});
		};
		
		$scope.uploads = function(files){
			upload.upload(files,"excel",{url : "../server-api/index.php/excel", table : "excel"},function(response){
				if(response.status === 'success'){
					$scope.getData();
				}
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Excel Sheet Insert!", response.message);
			});
		};
		
	 };
	// Inject controller's dependencies
	excelController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('excelController', excelController);
});

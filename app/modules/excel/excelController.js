'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$rootScope','$injector','$routeParams','$location','dataService','upload','modalService', '$notification'];
	
	var excelController = function ($scope,$rootScope,$injector,$routeParams,$location,dataService,upload,modalService,$notification) {
		//all $scope object goes here
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		
		
		$scope.getData = function(){
			dataService.get("getmultiple/excel/1/100", {})
			.then(function(response) {  
				console.log(response);
				if(response.status == 'success'){
					$scope.list = response.data;
				}else{
					$notification.error("Get Business", "You didn't added any business! Please add business first.");
				}
			});
		}
		$scope.getData();
		
		$scope.uploads = function(files){
			upload.upload(files,"excel",{url : "../server-api/index.php/excel", table : "excel_jaidev"},function(response){
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

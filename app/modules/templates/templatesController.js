'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope', '$injector','$location','$routeParams','dataService','upload','modalService'];
    
    // This is controller for this view
	var templatesController = function ($scope,$rootScope,$injector,$location,$routeParams,dataService,upload,modalService) {
		
		console.log($rootScope.userDetails);
		//this code block for modal{trupti}
		$scope.open = function (url, tempId) {
			dataService.get("getsingle/template/"+tempId)
			.then(function(response) {
				var modalDefaults = {
					templateUrl: url,	// apply template to modal
					size : 'lg'
				};
				var modalOptions = {
					tempList: response.data[0]  // assign data to modal
				};
				console.log(response.data[0]);
				modalService.showModal(modalDefaults, modalOptions).then(function (result) {
					console.log("modalOpened");
				});
			});
		};
		$scope.ok = function () {
			$modalOptions.close('ok');
		};
		
		//for display form parts
		$scope.tempPart = $routeParams.tempPart;
		// all $scope object goes here
		$scope.alerts = [];
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.tempListCurrentPage = 1;
		$scope.myTempCurrentPage = 1;
		$scope.customTempCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.currentDate = dataService.currentDate;
		$scope.user_id = {user_id : 2};// these are URL parameters
		// All $scope methods
		
		$scope.pageChanged = function(page, template_type) { // Pagination page changed
			angular.extend(template_type, $scope.user_id);
			dataService.get("/getmultiple/template/"+page+"/"+$scope.pageItems, $scope.template_type)
			.then(function(response){  //function for templatelist response
				$scope.templates = response.data;
				//console.log($scope.properties);
			});
		};
		//this is global method for filter 
		$scope.changeStatus = function(statusCol, showStatus) {
			console.log($scope.template_type);
			$scope.filterStatus= {};
			(showStatus =="") ? delete $scope.template_type[statusCol] : $scope.filterStatus[statusCol] = showStatus;
			angular.extend($scope.template_type, $scope.filterStatus);
			dataService.get("/getmultiple/template/1/"+$scope.pageItems, $scope.template_type)
			.then(function(response) {  //function for templatelist response
				if(response.status == 'success'){
					$scope.templates = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.templates = {};
					$scope.totalRecords = {};
					$scope.alerts.push({type: response.status, msg: response.message});
				}
				//console.log($scope.properties);
			});
		};
		
		$scope.searchFilter = function(statusCol, showStatus) {
			$scope.search = {search: true};
			$scope.filterStatus= {};
			(showStatus =="") ? delete $scope.template_type[statusCol] : $scope.filterStatus[statusCol] = showStatus;
			angular.extend($scope.template_type, $scope.filterStatus);
			angular.extend($scope.template_type, $scope.search);
			dataService.get("/getmultiple/template/1/"+$scope.pageItems, $scope.template_type)
			.then(function(response) {  //function for templatelist response
				if(response.status == 'success'){
					$scope.templates = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.templates = {};
					$scope.totalRecords = {};
					$scope.alerts.push({type: response.status, msg: response.message});
				}
				//console.log($scope.properties);
			});
		};
		
		//function for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		/*For display by default templatelist page {trupti}*/
		if(!$routeParams.tempPart) {
			$location.path('/dashboard/templates/listoftemplates');
		}
		
		//Upload Function for uploading files {Vilas}
		$scope.reqtemp={}; // this is form object
		$scope.userinfo = {userId:1, name:"vilas"}; // this is for uploading credentials
		$scope.path = "template/"; // path to store images on server
		$scope.reqtemp.scrible  = []; // uploaded images will store in this array
		
		$scope.upload = function(files,path,userinfo,picArr){ // this function for uploading files
		console.log(picArr);
		
			upload.upload(files,path,userinfo,function(data){
				var picArrKey = 0, x;
				for(x in picArr) picArrKey++;
				if(data.status === 'success'){
					picArr[picArrKey] = (JSON.stringify(data.details));
					console.log(data.message);
				}else{
					$scope.alerts.push({type: response.status, msg: response.message});
				}
			});
		};
		$scope.generateThumb = function(files){  // this function will generate thumbnails of images
			upload.generateThumbs(files);
		};// End upload function
		
		// switch functions
		var mytemplates = function(){
			dataService.get("/getmultiple/template/"+$scope.myTempCurrentPage+"/"+$scope.pageItems, $scope.user_id)
			.then(function(response) {  //function for my templates response
			if(response.status == 'success'){
					$scope.templates=response.data;
					$scope.totalRecords = response.totalRecords;	
				}
				else
				{
					$scope.alerts.push({type: response.status, msg: response.message});
				};
				$scope.templates = response.data;
			});
		};
		
		var listoftemplates = function(){
			$scope.template_type = {template_type : 'public', status:1};
			angular.extend($scope.template_type, $scope.user_id);
			dataService.get("/getmultiple/template/"+$scope.tempListCurrentPage+"/"+$scope.pageItems, $scope.template_type)
				.then(function(response) {  //function for templatelist response
					if(response.status == 'success'){
					$scope.templates=response.data;
					$scope.totalRecords = response.totalRecords;
				}
				else
				{
					$scope.alerts.push({type: response.status, msg: response.message});
				};
			});//end of by default templist
			
			//function for active button
			var showActive= function(status){
				$scope.template_type = {template_type : 'public',status:1};
				dataService.get("/getmultiple/template/"+$scope.tempListCurrentPage+"/"+$scope.pageItems, $scope.template_type)
				.then(function(response) {  //function for templatelist response
						if(response.status == 'success'){
						$scope.templates=response.data;
						$scope.totalRecords = response.totalRecords;
					}
					else
					{
						$scope.alerts.push({type: response.status, msg: response.message});
					};
				});
			//end of active button function
			}
			
			
			//This code for apply/buy button{trupti}
			
			$scope.dynamicTooltip = function(status, active, notActive){
				return (status==1) ? active : notActive;
			};
			
			$scope.apply = function(id, applied){
				$scope.appliedData = {applied : applied};
				
				dataService.put("put/template/"+id, $scope.appliedData)
				.then(function(response) { //function for businesslist response
					console.log(response);
				});
			} ;
		};
		
		var custometemplates = function(){
			$scope.template_type = {template_type : 'private',status:1,custom:1};
			angular.extend($scope.template_type, $scope.user_id);
			dataService.get("/getmultiple/template/"+$scope.customTempCurrentPage+"/"+$scope.pageItems, $scope.template_type)
			.then(function(response) {  //function for template list response
				if(response.status == 'success'){
					$scope.templates=response.data;
					$scope.totalRecords = response.totalRecords;
				}
				else
				{
					$scope.alerts.push({type: response.status, msg: response.message});
				};

			});
			
			//function for active button
			var showActive= function(status){
				$scope.template_type = {template_type : 'private',status:1,custom:1};
				dataService.get("/getmultiple/template/"+$scope.tempListCurrentPage+"/"+$scope.pageItems, $scope.template_type)
				.then(function(response) {  //function for templatelist response
						if(response.status == 'success'){
						$scope.templates=response.data;
						$scope.totalRecords = response.totalRecords;
					}
					else
					{
						$scope.alerts.push({type: response.status, msg: response.message});
					};
				});
			//end of active button function
			}
			
			//This code for apply/buy button{trupti}
			
			$scope.dynamicTooltip = function(status, active, notActive){
				return (status==1) ? active : notActive;
			};
			
			//This code for active/delete button 
			$scope.feature = function(id, featured){
				$scope.featuredData = {featured : featured};
				console.log($scope.featuredData);
				dataService.put("put/template/"+id, $scope.featuredData)
				.then(function(response) { //function for businesslist response
					console.log(response);
				});
			};
			
			//This code for reject/order_placed button 
			$scope.reject = function(id, development_status){
				$scope.featuredData = {development_status : development_status};
				console.log($scope.featuredData);
				dataService.put("put/template/"+id, $scope.featuredData)
				.then(function(response) { 
					console.log(response);
				});
			};
		
			$scope.apply = function(id, applied){
				$scope.appliedData = {applied : applied};
				
				dataService.put("put/template/"+id, $scope.appliedData)
				.then(function(response) { //function for businesslist response
					console.log(response);
				});
			} ;
		}
		
		var requestcustomtemplates = function(){
			//reset function{trupti}
			$scope.reset = function() {
				$scope.reqtemp = {};
			};
			//$scope.userid={user_id : 1};
			//post method for insert data in request template form{trupti}
			$scope.postData = function(reqtemp) { 
			reqtemp.user_id=$scope.user_id.user_id;
			$scope.reqtemp.date = $scope.currentDate;
			//console.log(user_id);
				dataService.post("/post/template",reqtemp,$scope.user_id)
				.then(function(response) {  //function for response of request temp
					$scope.reqtemp = response.data;
					console.log(response);
					$scope.reset();
					console.log(reqtemp);
				});
			}//end of post method{trupti}
		}
		
		switch($scope.tempPart) {
			case 'listoftemplates':
				listoftemplates();
				break;
			case 'mytemplates':
				mytemplates();
				break;
			case 'custometemplates':
				custometemplates();
				break;
			case 'requestcustomtemplates':
				requestcustomtemplates();
				break;	
			default:
				listoftemplates();
		};
    };
	
	// Inject controller's dependencies
	templatesController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('templatesController', templatesController);
});

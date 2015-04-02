'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','$location','$routeParams','dataService','upload','modalService'];
    
    // This is controller for this view
	var templatesController = function ($scope,$rootScope,$injector,$location,$routeParams,dataService,upload,modalService) {
		
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
		$scope.userInfo = {user_id : $rootScope.userDetails.id};
		$scope.tempPart = $routeParams.tempPart;
		$scope.permission = $rootScope.userDetails.permission.template_module;
		$scope.filterStatus= {};
		$scope.webParam = {};
		$scope.path = "template/"; // path to store images on server
		
		//function for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		
		//For display by default templatelist page 
		if(!$routeParams.tempPart) {
			$location.path('/dashboard/templates/listoftemplates');
		}
		//This code for apply/buy button
		$scope.dynamicTooltip = function(status, active, notActive){
			return (status==1) ? active : notActive;
		};
		
		$scope.ok = function () {
			$modalOptions.close('ok');
		};
		
		//for display form parts
		$scope.pageChanged = function(page, where) {
			dataService.get("getmultiple/template/"+page+"/"+$scope.pageItems, $scope.template_type)
			.then(function(response){ 
				$scope.templates = response.data;
			});
		};
	
		//for get the single col value from db
		$scope.changeScope = function(value, object){
			$scope.website.userDetails = value.id;
			$scope.changeScopeObject($scope.domain_name);
		}
		
		// this function will generate thumbnails of images
		$scope.generateThumb = function(files){  
			upload.generateThumbs(files);
		};
		
		//this is form object
		$scope.reqtemp = {
			scrible : {}
		}; 
		
		// functions 
		$scope.open = function (url, tempId) {
			dataService.get("getsingle/template/"+tempId)
			.then(function(response) {
					var modalDefaults = {
						templateUrl: url,	// apply template to modal
						size : 'lg'
					};
					var modalOptions = {
						tempList: dataService.parse(response.data),
					};
					modalService.showModal(modalDefaults, modalOptions).then(function (result) {
					
					});
			});
		};
		
		$scope.addMytemplate=function(tempList){
			 dataService.post("post/mytemplate",tempList)
			.then(function(response) { 
				console.log(response);
				$scope.alerts.push({type: response.status, msg: response.message});
			});
		};
		/*
			dataService.get("getmultiple/website/1/50",$scope.status)
			.then(function(response) {
				var formData = modalOptions.formData;
					var userConfig = dataService.parse($rootScope.userDetails).config;
					var webConfig = dataService.parse(modalOptions.websiteList[formData.website_id].config);
					var userTemplateConfig = (userConfig.templates.template_id) ? userConfig.templates.template_id.push(tempId) : angular.extend(userConfig,formData.config);
					angular.extend(webConfig, formData.config);
					dataService.put('put/website/'+formData.website_id, {config : webConfig})
					.then(function(response){
							$scope.alerts.push({type: response.status, msg: response.message});
					});
					dataService.put('put/user/'+$rootScope.userDetails.id, {config : userConfig})
					.then(function(response){
							$scope.alerts.push({type: response.status, msg: response.message});
					});  
					
				});
			
		*/
		
		//this is global method for filter 
		$scope.changeStatus = function(statusCol, showStatus) {
			(showStatus =="") ? delete $scope.template_type[statusCol] : $scope.filterStatus[statusCol] = showStatus;
			angular.extend($scope.template_type, $scope.filterStatus);
			dataService.get("getmultiple/template/1/"+$scope.pageItems, $scope.template_type)
			.then(function(response) {  //function for templatelist response
				if(response.status == 'success'){
					$scope.templates = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.templates = {};
					$scope.totalRecords = {};
					$scope.alerts.push({type: response.status, msg: response.message});
				}
			});
		};
	
		//for search filter
		$scope.searchFilter = function(statusCol, showStatus) {
			$scope.search = {search: true};
			(showStatus =="") ? delete $scope.webParam[statusCol] : $scope.filterStatus[statusCol] = showStatus;
			angular.extend($scope.webParam, $scope.filterStatus);
			angular.extend($scope.webParam, $scope.search);
			if(showStatus.length >= 4 || showStatus == ""){
			dataService.get("getmultiple/template/1/"+$scope.pageItems, $scope.webParam)
			.then(function(response) {  //function for websitelist response
				if(response.status == 'success'){
					$scope.templates = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.templates = {};
					$scope.totalRecords = {};
					$scope.alerts.push({type: response.status, msg: response.message});
				}
			});
			}
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
		
	
		$scope.path = "template/mytemplate"; // path to store images on server
		$scope.upload = function(files,path,userinfo, picArr){ // this function for uploading files
			upload.upload(files,path,userinfo,function(data){
				var picArrKey = 0, x;
				for(x in picArr) picArrKey++;
				if(data.status === 'success'){
					picArr[picArrKey] = data.data;
					console.log(data);
				}else{
					$scope.alerts.push({type: data.status, msg: data.message});
				}
				
			}); 
		};
		
		
		// switch functions
		var mytemplates = function(){
			dataService.get("getmultiple/template/"+$scope.myTempCurrentPage+"/"+$scope.pageItems, $scope.userInfo)
			.then(function(response) {  //function for my templates response
			if(response.status == 'success'){
					$scope.templates=response.data;
					$scope.totalRecords = response.totalRecords;	
				}else{
					$scope.alerts.push({type: response.status, msg: response.message});
				};
				$scope.templates = response.data;
			});
		};
	
		//list of templates
		var listoftemplates = function(){
			$scope.template_type = {template_type : 'public', status:1};
			dataService.get("getmultiple/template/"+$scope.tempListCurrentPage+"/"+$scope.pageItems, $scope.template_type)
				.then(function(response) {  //function for templatelist response
					if(response.status == 'success'){
					$scope.templates=response.data;
					$scope.totalRecords = response.totalRecords;
				}
				else{
					$scope.alerts.push({type: response.status, msg: response.message});
				};
			});
		};
		
		var custometemplates = function(){
			$scope.template_type = {custom:1};
			angular.extend($scope.template_type, $scope.userInfo);
			dataService.get("getmultiple/template/"+$scope.customTempCurrentPage+"/"+$scope.pageItems, $scope.template_type)
			.then(function(response) {  //function for template list response
				if(response.status == 'success'){
					$scope.templates=response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.alerts.push({type: response.status, msg: response.message});
				};
			});
		}
		
		var requestcustomtemplates = function(){
			$scope.postData = function(reqtemp) { 
			$scope.reqtemp.user_id= $rootScope.userDetails.id;
			$scope.reqtemp.date = $scope.currentDate;
				 dataService.post("post/template",reqtemp)
				.then(function(response) { 
					$scope.alerts.push({type: response.status, msg: response.message});
				});
			}
		}
	
		//post method for add template form(trupti)
		var addtemplate = function(){
			$scope.zipPath = 'zip_templates';
			$scope.reset = function() {
				$scope.addtemplate = {
					date : $scope.currentDate,
					template_params : {},
					template_image : {},
					created_by : $rootScope.userDetails.id,
					development_status : 'completed'
				};
			};
			$scope.uploadZip = function(files,path,userDetails,picArr){ 
				upload.upload(files,path,userDetails,function(data){
					var picArrKey = 0, x;
					for(x in $scope.addtemplate.template_image) picArrKey++;
					if(data.status === 'success'){
						if(picArr == "zip"){
							$scope.addtemplate.template_zip = data.data;
						}else{
							$scope.addtemplate.template_image[picArrKey] = data.data;
						}
						console.log($scope.addtemplate.template_image);
					}else{
						$scope.alerts.push({type: data.status, msg: data.message});
					}
				});
			};
			
			$scope.postData = function(addtemplate) {
				dataService.post("post/template/addtemplate",addtemplate)
				.then(function(response) {
					if(response.status == "success"){
						$scope.reset();
						setTimeout(function(){
							$location.path("/dashboard/templates/mytemplates");
						},500);
					}
					$scope.alerts.push({type: data.status, msg: data.message});
				});
			}
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
			case 'addtemplate':
				addtemplate();
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

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
		$scope.permission = $rootScope.userDetails.permission.template_module;
		$scope.tempPart = $routeParams.tempPart;//for display form parts
		$scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		$scope.temp = dataService.config.template;
		$scope.path = "template/"; // path to store images on server
		$scope.userinfo = $scope.userInfo;
		
		//global methods
		//Upload Function for uploading files {Vilas}
		$scope.reqtemp = {
			scrible : {}
		};
		//function for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		/*For display by default templatelist page */
		if(!$routeParams.tempPart) {
			$location.path('/dashboard/templates/listoftemplates');
		}
		//This code for apply/buy button{trupti}
		$scope.dynamicTooltip = function(status, active, notActive){
			return (status==1) ? active : notActive;
		};
		
		// this function will generate thumbnails of images
		$scope.generateThumb = function(files){  
			upload.generateThumbs(files);
		};
		
		// code for datepicker 	
		$scope.today = function() 
		{
			$scope.date = new Date();
		};
		
		$scope.open = function($event,opened)
		{
			$event.preventDefault();
			$event.stopPropagation();
			$scope.opened = ($scope.opened==true)?false:true;
		};
	
		//this code block for modal
		$scope.openModel = function (url, tempId) {
			dataService.get("getsingle/template/"+tempId)
			.then(function(response) {
				dataService.get("getmultiple/website/1/50",$scope.status)
				.then(function(webresponse) {
					var modalDefaults = {
						templateUrl: url,	// apply template to modal
						size : 'lg'
					};
					var modalOptions = {
						websiteList: webresponse.data,  // assign data to modal
						tempList: dataService.parse(response.data),
						myTemplateData : {},
						formData : function(data){
							modalOptions.myTemplateData = data;
						},
					};

				modalService.showModal(modalDefaults, modalOptions).then(function (result) {
					dataService.post("post/mytemplate",modalOptions.myTemplateData,$scope.userInfo).then(function(response) {
						$scope.alerts.push({type: response.status,msg: response.message});
					}); 
					
				});
				});
			});
		};
		$scope.ok = function () {
			$modalOptions.close('ok');
		};
	
		//open model for template img
		$scope.openTemp = function (url, tempId) {
			dataService.get("getsingle/template/"+tempId)
			.then(function(response) {

					var modalDefaults = {
						templateUrl: url,	// apply template to modal
						size : 'lg'
					};
					 var modalOptions = {
						
						tempList: dataService.parse(response.data)  // assign data to modal
					}; 
				modalService.show(modalDefaults, modalOptions).then(function (result) {
						console.log("modalOpened");
				});
				
			});
		};
		//open model for My template img
		$scope.openMyTemp = function (url, tempId) {
			dataService.get("getsingle/mytemplate/"+tempId)
			.then(function(response) {
					var modalDefaults = {
						templateUrl: url,	// apply template to modal
						size : 'lg'
					};
					 var modalOptions = {
						tempList: dataService.parse(response.data)  // assign data to modal
					}; 
				modalService.show(modalDefaults, modalOptions).then(function (result) {
						console.log("modalOpened");
				});
		
			});
		};
		
		//for edit the price of template
		$scope.changeStatusf={};
		$scope.editTemplatePrice = function(colName, colValue, id, editStatus){
			$scope.changeStatusf[colName] = colValue;
			if(editStatus==0){
				 dataService.put("put/template/"+id,$scope.changeStatusf)
				.then(function(response) { 
					$scope.alerts.push({type: response.status,msg: response.message});
				}); 
			}
		};	
		
		//for show template_price
		$scope.showInput = function($event,opened) 		
		{
			$scope.template_price = []; 				  				
			$event.preventDefault();
			$event.stopPropagation();
			$scope[opened] = ($scope[opened] ===true) ? false : true;
		};
		
		$scope.changePrice = function(id, prices){
			var template_price;
			for(var x in prices){
				if(prices[x].id == id) template_price = prices[x].template_price;
			}
			return template_price;
		}
		
		
		//method for select development status
		$scope.changeStatusf={};
		$scope.editDevelopmentStatus = function(colName, colValue, id, editStatus){
			$scope.changeStatusf[colName] = colValue;
			if(editStatus==0){
				 dataService.put("put/template/"+id,$scope.changeStatusf)
				.then(function(response) { 
					$scope.alerts.push({type: response.status,msg: response.message});
				}); 
			}
		};	 
		
		//for show development status{trupti}
		$scope.showInput = function($event,opened) 		
		{
			$scope.development_status = []; 				  				
			$event.preventDefault();
			$event.stopPropagation();
			$scope[opened] = ($scope[opened] ===true) ? false : true;
		};
		
		$scope.changeDevelopmentStatus = function(id, development){
			var development_status;
			for(var x in development){
			if(development[x].id == id) development_status = development[x].development_status;
			}
			return development_status;
		}

		$scope.pageChanged = function(page, where) {
			dataService.get("getmultiple/template/"+page+"/"+$scope.pageItems, $scope.template_type)
			.then(function(response){ 
				$scope.templates = response.datconsole.log($scope.templates);
			});
		};
	
		$scope.changeScope = function(value, object){
			$scope.website.userDetails = value.id;
			$scope.changeScopeObject($scope.domain_name);
		}
		
		//this is global method for filter 
		$scope.changeStatus = function(statusCol, showStatus) {
			$scope.filterStatus= {};
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
		
		//to change status 	
		$scope.changeStatusf = {};
		$scope.changeStatusFn = function(colName, colValue, id){
		$scope.changeStatusf[colName] = colValue;    
			dataService.put("put/template/"+id,$scope.changeStatusf)   
			.then(function(response) {     
				if(colName=='template_type'){     
				}
				$scope.alerts.push({type: response.status,msg: response.message});
				}); 
		}//end method
		
		//for search filter
		$scope.searchFilter = function(statusCol, showStatus) {
			$scope.search = {search: true};
			$scope.filterStatus= {};
			$scope.webParam={};
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
				$scope.alerts.push({type: response.status, msg: response.message});
			});
		};
		//This code for reject/order_placed button 
		$scope.reject = function(id, development_status){
			$scope.featuredData = {development_status : development_status};
			console.log($scope.featuredData);
			dataService.put("put/template/"+id, $scope.featuredData)
			.then(function(response) { 
				$scope.alerts.push({type: response.status, msg: response.message});
			});
		};
		
		//delete button for cahnge status for template
			$scope.deleted = function(id, status){
				$scope.deletedData = {status : status};
				dataService.put("put/template/"+id, $scope.deletedData)
				.then(function(response) { //function for businesslist response
					if(response.status == 'success'){
						$scope.hideDeleted = 1;
					}
					$scope.alerts.push({type: response.status, msg: response.message});
				});
			};			
		
		//delete for my template
		$scope.deletedmytemp = function(id, status){
				$scope.deletedData = {status : status};
				dataService.put("put/mytemplate/"+id, $scope.deletedData)
				.then(function(response) { //function for businesslist response
					if(response.status == 'success'){
						//$scope.hideDeleted = 1;
					}
					$scope.alerts.push({type: response.status, msg: response.message});
				});
			};			
		$scope.apply = function(id, applied){
			$scope.appliedData = {applied : applied};
			dataService.put("put/template/"+id, $scope.appliedData)
			.then(function(response) { //function for businesslist response
				$scope.alerts.push({type: response.status, msg: response.message});
			});
		} ;
		
		
		$scope.upload = function(files,path,userInfo,picArr){ //this function for uploading files
			upload.upload(files,path,userInfo,function(data){
				var picArrKey = 0, x;
				for(x in picArr) picArrKey++;
				if(data.status === 'success'){
					picArr[picArrKey] = data.data;
					//console.log(data.message);
				}else{
					$scope.alerts.push({type: data.status, msg: data.message});
				}
			});
		};
		
		// switch functions
		var mytemplates = function(){
			dataService.get("getmultiple/mytemplate/"+$scope.myTempCurrentPage+"/"+$scope.pageItems, $scope.userInfo)
			.then(function(response) { 
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
			$scope.reset = function() {
				$scope.reqtemp = {};
			};
			
			//post method for insert data in request template form{trupti}
			$scope.reqtemp.date = $scope.currentDate;
			$scope.postData = function(reqtemp) { 
			$scope.reqtemp.user_id= $rootScope.userDetails.id;
			
				//$scope.reqtemp.custom = {custom:1};
				 dataService.post("post/template",reqtemp)
				.then(function(response) {  //function for response of request temp
					$scope.reset();
				});
			}
		}
	
		//post method for add template form(trupti)
		var addtemplate = function(){
			$scope.tempId = $routeParams.id;
			$scope.zipPath = 'zip_templates';
			if($scope.tempId){
				dataService.get("getsingle/template/"+$scope.tempId)
				.then(function(response) {
					$scope.reset = function() {
						$scope.addtemplate = {
							template_params : {},
							template_image : {},
							created_by : $rootScope.userDetails.id,
							development_status : 'completed'
						};
					angular.extend(response.data, $scope.addtemplate);
					$scope.addtemplate = response.data;
				};
				$scope.reset();
				console.log($scope.addtemplate);
				
			})
			}else{
				$scope.reset = function() {
					$scope.addtemplate = {
						date : $scope.currentDate,
						template_params : {},
						template_image : {},
						created_by : $rootScope.userDetails.id,
						development_status : 'completed'
					};
				};
				$scope.reset();
			}
			
			//$scope.addtemplate = {custom:1};
			//angular.extend($scope.template_type, $scope.userInfo);
			
			//$scope.reset();
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
			$scope.updateData = function(addtemplate) {
				dataService.put("put/template/"+$scope.tempId,addtemplate)
				.then(function(response) {
					if(response.status == "success"){
						$scope.reset();
						setTimeout(function(){
							$location.path("#/dashboard/templates/mytemplates");
						},500);
					}
					$scope.alerts.push({type: response.status, msg: response.message});
				});
			}
			$scope.postData = function(addtemplate) {
				dataService.post("post/template/addtemplate",addtemplate)
				.then(function(response) {
					if(response.status == "success"){
						$scope.reset();
						setTimeout(function(){
							$location.path("#/dashboard/templates/mytemplates");
						},500);
					}
					$scope.alerts.push({type: response.status, msg: response.message});
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

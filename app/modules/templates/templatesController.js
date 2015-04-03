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
		//$rootScope.userDetails.permission="";
		$scope.permission = $rootScope.userDetails.permission.template_module;
		//this code block for modal{trupti}
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
						tempList: dataService.parse(response.data)  // assign data to modal
					};

				modalService.showModal(modalDefaults, modalOptions).then(function (result) {
						dataService.post("post/mytemplate",modalOptions.tempList,$scope.userInfo).then(function(response) {
							console.log(modalOptions.tempList,$scope.userInfo);
						});
				});
				});
			});
		};
		$scope.ok = function () {
			$modalOptions.close('ok');
		};
		//this model for show website details when click on apply button{trupti}
		/* $scope.showWebsitedetails = function (url, tempId) {
			$scope.status = {status:1};
			angular.extend($scope.status, $scope.userInfo);
			dataService.get("getmultiple/website/1/50",$scope.status)
			.then(function(response) {
				
				var modalOptions = {
					websiteList: dataService.parse(oldObj),  // assign data to modal
				};
				//console.log(dataService.parse($rootScope.userDetails));
				modalService.showModal(modalDefaults, modalOptions).then(function (result) {
					var formData = modalOptions.formData;
					var userConfig = dataService.parse($rootScope.userDetails).config;
					var webConfig = dataService.parse(modalOptions.websiteList[formData.website_id].config);
					var userTemplateConfig = (userConfig.templates.template_id) ? userConfig.templates.template_id.push(tempId) : angular.extend(userConfig,formData.config);
					
					console.log(userTemplateConfig);
					console.log(userConfig);
					//angular.extend(userConfig, formData.config);
					angular.extend(webConfig, formData.config);
					dataService.put('put/website/'+formData.website_id, {config : webConfig})
					.then(function(response){
						console.log(response.message);
					});
					dataService.put('put/user/'+$rootScope.userDetails.id, {config : userConfig})
					.then(function(response){
						console.log(response.message);
					});  
					
				});
			});
		}; */
		$scope.ok = function () {
			$modalOptions.close('ok');
		};
		
		//for edit the price of template{trupti}
		$scope.changeStatusf={};
		$scope.editTemplatePrice = function(colName, colValue, id, editStatus){
			$scope.changeStatusf[colName] = colValue;
			console.log(colValue);
			console.log($scope.changeStatusf);
				if(editStatus==0){
				 dataService.put("put/template/"+id,$scope.changeStatusf)
				.then(function(response) { 
					//if(status=='success'){
						//$scope.hideDeleted = 1;
					//}
					$scope.alerts.push({type: response.status,msg: response.message});
				}); 
			}
		};	 
		//for show template_price{trupti}
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
			console.log(template_price);
		}
	
		 // for dynamic value of development status
		dataService.get('getmultiple/template/1/100').then(function(response){
			
			if(response.status=='success'){
				$scope.development = response.data;
			}else{
				$scope.alerts.push({type: response.status, msg: response.message});
			}
		}) ; 
		//method for select development status
		$scope.changeStatusf={};
		$scope.editDevelopmentStatus = function(colName, colValue, id, editStatus){
			$scope.changeStatusf[colName] = colValue;
			console.log(colValue);
			console.log($scope.changeStatusf);
				if(editStatus==0){
				 dataService.put("put/template/"+id,$scope.changeStatusf)
				.then(function(response) { 
					//if(status=='success'){
						//$scope.hideDeleted = 1;
					//}
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
			console.log(development_status);
		}//end development status

		//for display form parts
		$scope.tempPart = $routeParams.tempPart;
		// All $scope methods
		$scope.pageChanged = function(page, where) { // Pagination page changed
			//angular.extend(template_type, $scope.userInfo);
			dataService.get("getmultiple/template/"+page+"/"+$scope.pageItems, $scope.template_type)
			.then(function(response){  //function for templatelist response
				$scope.templates = response.data;
				console.log($scope.templates);
			});
		};
	
		//for get the single col value from db{trupti} 
		$scope.changeScope = function(value, object){
			$scope.website.userDetails = value.id;
			//$scope.addproduct.business_id = value.id;
			$scope.changeScopeObject($scope.domain_name);
		}
		
		//this is global method for filter 
		$scope.changeStatus = function(statusCol, showStatus) {
			console.log($scope.template_type);
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
				//console.log($scope.properties);
			});
		};
		//to change status {trupti}			
		$scope.changeStatusf = {};
		$scope.changeStatusFn = function(colName, colValue, id){
		$scope.changeStatus[colName] = colValue;    
		//console.log($scope.changeStatus);
			dataService.put("put/template/"+id,$scope.changeStatus)   
			.then(function(response) {     
					if(colName=='template_type'){     
					}
					$scope.alerts.push({type: response.status,msg: response.message});
					}); 
		}//end method
		
		//for search filter{trupti}
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
			console.log(response);
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

		//function for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		/*For display by default templatelist page {trupti}*/
		if(!$routeParams.tempPart) {
			$location.path('/dashboard/templates/listoftemplates');
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
		
		//delete button {trupti}
			$scope.deleted = function(id, status){
				$scope.deletedData = {status : status};
				//console.log($scope.deletedData);
				dataService.put("put/template/"+id, $scope.deletedData)
				.then(function(response) { //function for businesslist response
					if(response.status == 'success'){
						$scope.hideDeleted = 1;
					}
					$scope.alerts.push({type: response.status, msg: response.message});
				});
			};			
	
		$scope.apply = function(id, applied){
			$scope.appliedData = {applied : applied};
			dataService.put("put/template/"+id, $scope.appliedData)
			.then(function(response) { //function for businesslist response
				console.log(response);
			});
		} ;
		
		//Upload Function for uploading files {Vilas}
		$scope.reqtemp = {
			scrible : {}
		}; // this is form object
		$scope.path = "template/"; // path to store images on server
		$scope.userinfo = $scope.userInfo;
		$scope.upload = function(files,path,userInfo,picArr){ //this function for uploading files
			upload.upload(files,path,userInfo,function(data){
				var picArrKey = 0, x;
				for(x in picArr) picArrKey++;
				if(data.status === 'success'){
					picArr[picArrKey] = data.details;
					console.log(data.message);
				}else{
					$scope.alerts.push({type: data.status, msg: data.message});
				}
			});
		};
		
		$scope.generateThumb = function(files){  // this function will generate thumbnails of images
			upload.generateThumbs(files);
		};// End upload function
		
		
		 //datepicker 	
		$scope.today = function() 
		{
			$scope.date = new Date();
		};
		$scope.today();
		$scope.open = function($event,opened)
		{
			$event.preventDefault();
			$event.stopPropagation();
			$scope.opened = ($scope.opened==true)?false:true;
		};
		$scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		// Date Picker Ended here  
		
		
		$scope.temp = dataService.config.template;
		
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
			});//end of by default templist
			
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
			//reset function{trupti}
			$scope.reset = function() {
				$scope.reqtemp = {};
			};
			//post method for insert data in request template form{trupti}
			$scope.postData = function(reqtemp) { 
			$scope.reqtemp.user_id= $rootScope.userDetails.id;
			$scope.reqtemp.date = $scope.currentDate;
				 dataService.post("post/template",reqtemp)
				.then(function(response) {  //function for response of request temp
					console.log(response);
					$scope.reset();
					console.log(reqtemp);
				});
			}//end of post method{trupti}
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
			$scope.reset();
			$scope.uploadZip = function(files,path,userDetails,picArr){ 
			//addtemplate.template_zip
			console.log(files);
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

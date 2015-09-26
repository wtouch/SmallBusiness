'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','$location','$routeParams','dataService','upload','modalService','$notification'];
    
    // This is controller for this view
	var mytemplatesController = function ($scope,$rootScope,$injector,$location,$routeParams,dataService,upload,modalService,$notification) {
		// all $scope object goes here
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.myTempCurrentPage = 1;
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
		//$scope.userinfo = $scope.userInfo;
		
		//code for accessing json data of template
		$scope.temp = {};
		dataService.config('config', {config_name : "template"}).then(function(response){
			$scope.temp = response.config_data;
		});
		
		$scope.dynamicTooltip = function(status, active, notActive){
			return (status==1) ? active : notActive;
		};
		
		
		
		/* // code for datepicker 	
		$scope.today = function() {
			$scope.date = new Date();
		}; */
		/* $scope.open = function($event,opened){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.opened = ($scope.opened==true)?false:true;
		}; */
		
		$scope.addToObject = function(data, object, resetObj){
			var dtlObj = JSON.stringify(data.desc);
			object[data.heading] = JSON.parse(dtlObj);
			$scope.headingDisabled = false;
			$scope.temp = false;
			$scope.imgRemoved = false;
			$scope[resetObj] = { desc : { image  : {} }};
		}
		
		$scope.removeObject = function(key, object){
			$scope.imgRemoved = true;
			delete object[key];
		}
		/* $scope.editObject = function(key, object, FormObj){
			$scope.headingDisabled = true;
			$scope.imgRemoved = true;
			var dtlObj = JSON.stringify(object[key]);
			FormObj['desc'] = JSON.parse(dtlObj);
			FormObj['heading'] = key;
		} */
		$scope.showForm = function(obj, resetObj){
			$scope[obj] = !$scope[obj];
			if(resetObj){
				$scope.headingDisabled = false;
				$scope.imgRemoved = true;
				$scope[resetObj] = { desc : { image  : {} }};
			}
		}
		
		//Function to Update template 
		$scope.update = function(businessData){				
			dataService.put("put/mytemplate/"+ $scope.template_id, templateData)
			.then(function(response) {  
				if(response.status == 'success'){
					$scope.submitted = true;
				}
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Update Template", response.message);
			});
		};

		/* //code for edit the price of template
		$scope.changeStatusf={};
		$scope.editTemplatePrice = function(colName, colValue, id, editStatus){
			$scope.changeStatusf[colName] = colValue;
			if(editStatus==0){
				 dataService.put("put/mytemplate/"+id,$scope.changeStatusf)
				.then(function(response) { 
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Edit Template Price", response.message);
				}); 
			}
		};	 */
		
		//code for show template_price
		$scope.showInput = function($event,opened){
			$scope.template_price = []; 				  				
			$event.preventDefault();
			$event.stopPropagation();
			$scope[opened] = ($scope[opened] ===true) ? false : true;
		};
		
		/* $scope.changePrice = function(id, prices){
			var template_price;
			for(var x in prices){
				if(prices[x].id == id) template_price = prices[x].template_price;
			}
			return template_price;
		} */
		
		//code for select development status
		$scope.changeStatusf={};
		$scope.editDevelopmentStatus = function(colName, colValue, id, editStatus){
			console.log(colName, colValue, id, editStatus);
			$scope.changeStatusf[colName] = colValue;
			if(editStatus==0){
				 dataService.put("put/mytemplate/"+id,$scope.changeStatusf)
				.then(function(response) { 
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Change Development Status", response.message);
				}); 
			}
		};	

		
		$scope.changeStatusfs={};
		$scope.editUser = function(colName, colValue, id){
			console.log(colName, colValue, id);
			$scope.changeStatusfs[colName] = colValue;
				 dataService.put("put/mytemplate/"+id,$scope.changeStatusfs)
				.then(function(response) { 
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Change User", response.message);
				}); 
			
		};	 
		
		
		//code for show development status
		$scope.showInput = function($event,opened) 		{
			$scope.development_status = []; 				  				
			$event.preventDefault();
			$event.stopPropagation();
			$scope[opened] = ($scope[opened] ===true) ? false : true;
		};
		
		//code for change development  status
		$scope.changeDevelopmentStatus = function(id, development){
			var development_status;
			for(var x in development){
			if(development[x].id == id) development_status = development[x].development_status;
			}
			return development_status;
		}
		
		$scope.changeOwnerUser = function(id, owner){
			var owner_status;
			for(var x in owner){
			if(owner[x].id == id) owner_status = owner[x].owner_status;
			}
			return owner_status;
		}
	
		$scope.changeScope = function(value, object){
			$scope.website.userDetails = value.id;
			$scope.changeScopeObject($scope.domain_name);
		}
		
		//function for Users list response
		$scope.getUsers = function(){
		dataService.get("getmultiple/user/1/500", {status: 1, user_id : $rootScope.userDetails.id})
		.then(function(response) {  
			if(response.status == 'success'){
				$scope.customerList = response.data;
			}else{
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Get Customers", response.message);
			}
		});
		}
		
		//this is global method for filter 
		$scope.changeStatus = function(statusCol, showStatus) {
			$scope.filterStatus= {};
			(showStatus =="") ? delete $scope.template_type[statusCol] : $scope.filterStatus[statusCol] = showStatus;
			angular.extend($scope.template_type, $scope.filterStatus);
			if(statusCol == 'user_id' && showStatus == null) {
				angular.extend($scope.template_type, $scope.userInfo);
			}
			dataService.get("getmultiple/mytemplate/1/"+$scope.pageItems, $scope.template_type)
			.then(function(response) {  
				if(response.status == 'success'){
					$scope.templates = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.templates = {};
					$scope.totalRecords = {};
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Get Template List", response.message);
				}
			});
		};
		
		//delete button for change status for template
		$scope.deleted = function(id, status){
			$scope.deletedData = {status : status};
			dataService.put("put/mytemplate/"+id, $scope.deletedData)
			.then(function(response) { 
				if(response.status == 'success'){
					$scope.hideDeleted = 1;
				}
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Delete Template", response.message);
			});
		};	
		//code for change status 	
		$scope.changeStatusf = {};
		$scope.changeStatusFn = function(colName, colValue, id){
		$scope.changeStatusf[colName] = colValue;    
			dataService.put("put/mytemplate/"+id,$scope.changeStatusf)   
			.then(function(response) {     
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Modify Template Status", response.message);
			}); 
		}
	
		//code for search filter
		$scope.searchFilter = function(statusCol, showStatus) {
			$scope.search = {search: true};
			$scope.filterStatus= {};
			$scope.webParam={};
			(showStatus =="") ? delete $scope.webParam[statusCol] : $scope.filterStatus[statusCol] = showStatus;
			angular.extend($scope.webParam, $scope.filterStatus);
			angular.extend($scope.webParam, $scope.search);
			if(showStatus.length >= 4 || showStatus == ""){
			dataService.get("getmultiple/mytemplate/1/"+$scope.pageItems, $scope.webParam)
			.then(function(response) {  //function for websitelist response
				if(response.status == 'success'){
					$scope.templates = response.data;
					$scope.totalRecords = response.totalRecords;
				}else{
					$scope.templates = {};
					$scope.totalRecords = {};
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Search Template", response.message);
				}
			});
			}
		}; 
			
		/* //This code for active/delete button 
		$scope.feature = function(id, featured){
			$scope.featuredData = {featured : featured};
			dataService.put("put/mytemplate/"+id, $scope.featuredData)
			.then(function(response) { //function for businesslist response
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Feature Template", response.message);
			});
		}; */
		/* //This code for reject/order_placed button 
		$scope.reject = function(id, development_status){
			$scope.featuredData = {development_status : development_status};
			dataService.put("put/mytemplate/"+id, $scope.featuredData)
			.then(function(response) { 
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Reject Template", response.message);
			});
		}; */
		
		//delete for my template
		$scope.deletedmytemp = function(id, status){
				$scope.deletedData = {status : status};
				dataService.put("put/mytemplate/"+id, $scope.deletedData)
				.then(function(response) { 
					if(response.status == 'success'){
					}
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Delete Template", response.message);
				});
			};			
		$scope.apply = function(id, applied){
			$scope.appliedData = {applied : applied};
			dataService.put("put/mytemplate/"+id, $scope.appliedData)
			.then(function(response) { 
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Apply Template", response.message);
			});
		} ;
		
	   $scope.uploadMultiple = function(files,path,userInfo,picArr){ //this function for uploading files
			 upload.upload(files,path,userInfo,function(data){
				var picArrKey = 0, x;
				for(x in picArr) picArrKey++;
				if(data.status === 'success'){
					picArr.push(data.data);
				}else{
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Upload Images", response.message);
				}
			}); 
		};    
		
		$scope.mypageChanged = function(page, where) {
			dataService.get("getmultiple/mytemplate/"+page+"/"+$scope.pageItems, $scope.template_type)
			.then(function(response){ 
				$scope.templates = response.data;
			});
		};
		
		// fuction for display mytemplate list
		var mytemplates = function(){
			$scope.template_type = {status:1};
			angular.extend($scope.template_type, $scope.userInfo);
			dataService.get("getmultiple/mytemplate/"+$scope.myTempCurrentPage+"/"+$scope.pageItems, $scope.template_type)
			.then(function(response) { 
			if(response.status == 'success'){
					$scope.templates=response.data;
					$scope.totalRecords = response.totalRecords;	
				}else{
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Get Templates List", response.message);
				};
			});
			
			//open model for My template image
			$scope.openMyTemp = function (url, tempId) {
				dataService.get("getsingle/mytemplate/"+tempId)
				.then(function(response) {
					var modalDefaults = {
							templateUrl: url,	
							size : 'lg'
						};
						 var modalOptions = {
							tempLists: dataService.parse(response.data)  
						}; 
					modalService.showModal(modalDefaults, modalOptions).then(function (result) {
					});
				});
			};
			
		//this code block for modal
		$scope.editTempParamsModel = function (url, tempId) {
			dataService.get("getsingle/mytemplate/"+tempId)
			.then(function(response) {
				var modalDefaults = {
					templateUrl: url,	
					size : 'lg'
				};
				if(response.data.template_params.slider == undefined){
						response.data.template_params = {slider : []};
					}
				var modalOptions = {
					editTemplate: response.data,
					modifiedDate : dataService.currentDate,
					date : $scope.currentDate,
					editIndex : {},
					slider : {},
					myTemplateData : {},
					editTempParamsModel : {},
					editIndex : {},
					files : {},
					path : $scope.path,
					userInfo : $scope.userInfo,
					formData : function(templateData){
						
						modalOptions.myTemplateData = templateData;
					},
					resetParams : function(resetData){
						console.log(response.data.template_id);
						dataService.get("getsingle/template/"+response.data.template_id)
						.then(function(resetRes) {	
						if(resetRes.status == "success"){
						console.log(resetRes);
						//console.log(resetRes.data.template_params);
							resetData.template_params.color = resetRes.data.template_params.color;
							resetData.template_params.light_color = resetRes.data.template_params.light_color; 
							resetData.template_params.dark_color = resetRes.data.template_params.dark_color;
							resetData.template_params.background_color = resetRes.data.template_params.background_color;
							resetData.template_params.background_color_light = resetRes.data.template_params.background_color_light;
							resetData.template_params.background_color_dark = resetRes.data.template_params.background_color_dark;
						}else{
							console.log(resetRes.message);
						} 
						});
					},
					
					deleteSlide : function(index,object){
						object.splice(index, 1); 
					},
					
					addSlide : function(data, modalOptions){
						console.log(modalOptions);
						modalOptions.editTempParamsModel.template_params.slider = (angular.isArray(modalOptions.editTempParamsModel.template_params.slider)) ? modalOptions.editTempParamsModel.template_params.slider : [];
						var pushdata = JSON.stringify(data);
						modalOptions.editTempParamsModel.template_params.slider.push(JSON.parse(pushdata));
						modalOptions.slider = {};
						for(var x in data){
							delete data[x];
						} 
					},
					upload : function(files,path,userInfo,modalOptions){
						upload.upload(files,path,userInfo,function(data){
							if(data.status === 'success'){
								modalOptions.slider.image = data.data.file_relative_path;
							}else{
								if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
								$notification[response.status]("Upload Image", response.message);
							}
					
					}); 
					},
					generateThumb : function(files){  
						upload.generateThumbs(files);
					},
					
					updateSlide : function(index, array, data){
						var pushdata = JSON.stringify(data);
						array[index.index] = JSON.parse(pushdata);
						for(var x in data){
							delete data[x];
						}
						delete index['index'];
					}
				};
				modalService.showModal(modalDefaults, modalOptions).then(function (result) {
					dataService.put("put/mytemplate/"+tempId,modalOptions.myTemplateData).then(function(response) {
						if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
						$notification[response.status]("Update Template Details", response.message);
					});
				});
			});
		};
		$scope.ok = function () {
			$modalOptions.close('ok');
		};
		};
		
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
				mytemplates();
		};
    
	};
	// Inject controller's dependencies
	mytemplatesController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('mytemplatesController', mytemplatesController);
});
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$location','dataService','upload','modalService', '$rootScope', '$cookies', '$cookieStore','$notification'];

	var receiptController = function ($scope, $injector,$routeParams,$location,dataService,upload,modalService, $rootScope, $cookies, $cookieStore,$notification)
	{ 
		$scope.businessData = {
			infrastructure : [],
			testimonials : [],
			custom_details : [],
			news_coverage : [],
			gallery : [],
			associate : [],
			job_careers : [],
			
		};
		dataService.get("getsingle/business/"+$routeParams.id)
		.then(function(response) {
			$scope.businessData = dataService.parse(response.data);
			if($scope.businessData.infrastructure == "") $scope.businessData.infrastructure = [];
			if($scope.businessData.testimonials == "") $scope.businessData.testimonials = [];
			if($scope.businessData.custom_details == "") $scope.businessData.custom_details = [];
			if($scope.businessData.news_coverage == "") $scope.businessData.news_coverage = [];
			if($scope.businessData.gallery == "") $scope.businessData.gallery = [];
			if($scope.businessData.associate == "") $scope.businessData.associate = [];
			if($scope.businessData.job_careers == "") $scope.businessData.job_careers = [];
		});	
		
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.userInfo = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		$scope.business_id = $routeParams.id;
		$scope.userinfo = $scope.userInfo; // this is for uploading credentials
		$scope.path = "/business"; // path to store images on server
		$scope.infrastructure = {};
		$scope.custompage = {};
		$scope.testimonials = {};
		$scope.news_coverage = {};
		$scope.job_careers = {};
		$scope.gallery = {};
		$scope.associate = {};
		$scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];
		$scope.isCollapsed = true;
		$scope.biz = {};
		
		dataService.config('config', {config_name : "business"}).then(function(response){
			$scope.biz = response.config_data;
		});
		
		$scope.dragControlListeners = {
			accept : function (sourceItemHandleScope, destSortableScope) {
				return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
			}
		};
		
		$scope.today = function() {
			$scope.date = new Date();
		};
		$scope.open = function($event,testimonialdate){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.testimonialdate = ($scope.testimonialdate==true)?false:true;
		};
		$scope.opendate = function($event,selectDate){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.selectDate = ($scope.selectDate==true)?false:true;
		};
		
		$scope.biz = dataService.config.business;
		
		$scope.formPart = ($cookies.bizFormPart) ? $cookieStore.get("bizFormPart") : 'infrastructure';
	
		$scope.infra = false;
		$scope.imgRemoved = false;
		
		$scope.showFormPart = function(formPart){
			$cookieStore.put("bizFormPart", formPart);
			$scope.formPart = $cookieStore.get("bizFormPart");
			$scope.edit = false;
			$scope.infra = false;
		};
		
		$scope.addToObject = function(data, object, resetObj){
			
			if(data == "edit"){
				$scope.infra = false;
				$scope.edit = false;
				$scope[resetObj] = {};
			}else{
				var dtlObj = JSON.stringify(data);
				console.log(data);
				object.push(JSON.parse(dtlObj));
				$scope.infra = false;
				$scope[resetObj] = {};
			}
		}
		
		$scope.removeImg = function(imgObject) {
			console.log(imgObject);
			$scope.infrastructure.image = "";
			$scope.testimonials.image = "";
			$scope.news_coverage.image = "";
			$scope.gallery.image = "";
			$scope.associate.image = "";
		};
		
		$scope.removeObject = function(index, object){
			object.splice(index, 1);
		}
		$scope.editObject = function(object, FormObj){
			$scope.edit = true;
			$scope[FormObj] = object;
		}
		
		$scope.showForm = function(obj, resetObj){
			$scope[obj] = !$scope[obj];
			if(resetObj){
				$scope.edit = false;
				$scope.imgRemoved = true;
				$scope[resetObj] = {};
			}
		}
		
		$scope.upload = function(files,path,userInfo, picArr){ 
			upload.upload(files,path,userInfo,function(data){
					if(data.status === 'success'){
						$scope.infrastructure.image = data.data;
					}else{
						$notification.error("Upload Image", data.message);
					}
			}); 
		}; 
		
		$scope.uploadtesti = function(files,path,userInfo, picArr){ 
			upload.upload(files,path,userInfo,function(data){
					if(data.status === 'success'){
						$scope.testimonials.image = data.data;
					}else{
						$notification.error("Upload Image", data.message);
					}
			}); 
		}; 
		
		$scope.uploadnews = function(files,path,userInfo, picArr){ 
			upload.upload(files,path,userInfo,function(data){
					if(data.status === 'success'){
						$scope.news_coverage.image = data.data;
					}else{
						
						$notification.error("Upload Image", data.message);
					}
			}); 
		}; 
		$scope.uploadgallery = function(files,path,userInfo, picArr){ 
			upload.upload(files,path,userInfo,function(data){
					if(data.status === 'success'){
						$scope.gallery.image = data.data;
					}else{
						$notification.error("Upload Image", data.message);
					}
			}); 
		}; 
		
		$scope.uploadassociate = function(files,path,userInfo, picArr){ 
			upload.upload(files,path,userInfo,function(data){
					if(data.status === 'success'){
						$scope.associate.image = data.data;
					}else{
						$notification.error("Upload Image", data.message);
					}
			}); 
		}; 
		$scope.generateThumb = function(files){ 
			upload.generateThumbs(files);
		};
			
		$scope.update = function(businessData){				
			dataService.put("put/business/"+ $scope.business_id, businessData)  
			 .then(function(response) { 
				if(response.status == 'success'){
					$scope.submitted = true;
					if($rootScope.userDetails.config.addbusinessDetails != true){
						dataService.progressSteps('addbusinessDetails', true);
						dataService.progressSteps('addProducts', $scope.business_id);
					}
				}
				if(response.status == undefined){
					$notification.error("Add Business Details", response.message);
				}else{
					$notification[response.status]("Add Business Details", response.message);
				}
			});
		};
		
		$scope.openGallery = function (url) {
				var modalDefaults = {
					templateUrl: url,	
					size : 'lg'
				};
				var modalOptions = {
					
					
				};
				modalService.showModal(modalDefaults, modalOptions).then(function (result) {
				});
		};
    };
	
	// Inject controller's dependencies
	receiptController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('receiptController', receiptController);

});

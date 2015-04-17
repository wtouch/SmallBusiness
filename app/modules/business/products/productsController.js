'use strict';

define(['app','css!modules/business/products/products.css'], function (app) {
    var injectParams = ['$scope','$rootScope', '$injector','$location','$routeParams','dataService','upload','modalService','$cookieStore', '$cookies'];

    // This is controller for this view
	var productsController = function ($scope,$rootScope,$injector,$location,$routeParams,dataService,upload,modalService,$cookieStore, $cookies) {
		//for display form parts of product & service
		$scope.productView = $routeParams.productView;
	
		// all $scope object goes here
		$scope.alerts = [];
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.addproductCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.userInfo = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		$scope.path = "product/"+$rootScope.userDetails.id; // path to store images on server
		$scope.permission = $rootScope.userDetails.permission.product_module;
		$scope.userInfo = {user_id : $rootScope.userDetails.id}; // these are URL parameters
		$scope.showProductForm = false;
		$scope.showServiceForm = false;
		$scope.editProdForm = false;
		$scope.editServForm = false;
		($cookies.productType) ? "" : $cookieStore.put("productType", "product");
		$scope.productType = $cookieStore.get("productType");
		//Upload Function for uploading files {Vilas}
		$scope.addproduct = {
			product_image : []
		}; 
		// this is form object
		$scope.addservice = {
			product_image : []
		};
		
		$scope.upload = function(files,path,userInfo,picArr){//this function for uploading files
	
			upload.upload(files,path,userInfo,function(data){
				var picArrKey = 0, x;
				for(x in picArr) picArrKey++;
				if(data.status === 'success'){
					picArr.push(data.data);
				}else{
					$scope.alerts.push({type: data.status, msg: data.message});
				}
	
			});
		};
		$scope.pageChanged = function(page) {
			dataService.get("/getmultiple/product/"+page+"/"+$scope.pageItems)
			.then(function(response) { 		
				$scope.services = response.data;			
			});
		};
		
		$scope.generateThumb = function(files){  // this function will generate thumbnails of images
			upload.generateThumbs(files);
		};// End upload function
		$scope.changeScope = function(value, object){
			$cookieStore.put("businessId", value);
			$scope.selectBusiness = $cookieStore.get("businessId");
			$scope.addservice.business_id = value;
			$scope.addproduct.business_id = value;
			$scope.changeScopeObject($scope.productType);
		};
		$scope.selectBusiness = $cookieStore.get("businessId");
		$scope.addservice.business_id = $cookieStore.get("businessId");
		$scope.addproduct.business_id = $cookieStore.get("businessId");
		console.log($scope.addservice.business_id);
		$scope.showForm = function(object){
			$scope[object] = ($scope[object]==true) ? false : true;
			$scope.$apply;
			if(object == 'showProductForm'){
				addproducts();
			}
			if(object == 'showServiceForm'){
				addservices();
			}
			$scope.showProductForm = true;
			$scope.showServiceForm = true;
		}
		$scope.editServiceForm = function(x){
			$scope.showServiceForm = true;
			$scope.editServeForm = true;
			angular.extend($scope.addservice, x);
		}
		$scope.editProductForm = function(x1){
			$scope.showProductForm = true;
			$scope.editProdForm = true;
			angular.extend($scope.addproduct, x1);
		}
		$scope.removeImg = function(item, imgObject) {
		  //var index = imgObject.indexOf(item);
		  imgObject.splice(item, 1);     
		}
		
		//for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		
		dataService.get("getmultiple/business/1/100",$scope.userInfo)
			.then(function(response) {  //function for template list response
			//$scope.businessList.user_id=$scope.userInfo.user_id;
				if(response.status == 'success'){
					$scope.businessList = response.data;
					//console.log($scope.businessList);
				}else{
					
					$scope.alerts.push({type: response.status, msg: "You didn't added any business! Please add business first."});
				}
				$scope.businessList = response.data;
				//console.log(businessList);
			});
		//end of options
		var addproducts = function(){ 
				$scope.reset = function(){
				$scope.addproduct = {};
			};
			//angular.extend(addproduct,$scope.userInfo);
			$scope.postData = function(addproduct) { 
			//$scope.addproducts = {};
			//$scope.addproductForm.$setPristine();
			$scope.addproduct.user_id= $rootScope.userDetails.id;
			$scope.addproduct.date = $scope.currentDate;
				 dataService.post("post/product",addproduct)
				.then(function(response) {  //function for response of request temp
					$scope.addproduct = response.data;
					$scope.reset();
				});
			}//end of post method {trupti} 
		}
		
		var addservices = function(){
			
		    $scope.addservice.user_id= $rootScope.userDetails.id;
			$scope.postData = function(addservice) {
				$scope.userInfo=$scope.userInfo;
				$scope.addservice.date = $scope.currentDate;
				dataService.post("post/product",addservice)
				.then(function(response) {  //function for response of request temp
					if(response.status == "success"){
						$scope.showServiceForm = false;
						$scope.showProductForm = false;
					}
				
				});
			} //end of post method {trupti} 
			 
		}
	
		//view for product list
		var productlist= function(){
					$scope.productFilter = {business_id : $scope.selectBusiness, type : 'product'};
					angular.extend($scope.userInfo, $scope.productFilter);
					dataService.get("getmultiple/product/1/10",$scope.userInfo)
					.then(function(response) {  
						if(response.status == 'success'){
							$scope.products = dataService.parse(response.data);
						}else{
							$scope.alerts.push({type: response.status, msg: response.message});
							$scope.products = [];
						};
					});
				
			}
			$scope.dynamicTooltip = function(status, active, notActive){
						return (status==1) ? active : notActive;
					};
						
		//This code for featured unfeatured button {sonali}
			$scope.feature = function(id, featured){
					$scope.featuredData = {featured : featured};
					dataService.put("put/product/"+id, $scope.featuredData)
					.then(function(response) { //function for businesslist response
						$scope.alerts.push({type: response.status, msg: response.message});
					});
			};
		//This code for featured unfeatured button {sonali}
			$scope.deleted = function(id, status){
				$scope.deletedData = {status : status};
				//console.log($scope.deletedData);
				dataService.put("put/product/"+id, $scope.deletedData)
				.then(function(response) { //function for businesslist response
					if(response.status == 'success'){
						$scope.hideDeleted = 0;
					}
					$scope.alerts.push({type: response.status, msg: response.message});
				});
			};

		var servicelist= function(){
			$scope.id=$routeParams.id
			$scope.productFilter = {business_id : $scope.selectBusiness, type : 'service'};
				angular.extend($scope.userInfo, $scope.productFilter);
				dataService.get("getmultiple/product/1/10",$scope.userInfo)
				.then(function(response) {  
					if(response.status == 'success'){
						$scope.services = dataService.parse(response.data);
					}
					else
					{
						$scope.alerts.push({type: response.status, msg: response.message});
						$scope.services = {};
					};
				});	
				
		}
		$scope.updateData = function(addservice) {
					delete addservice.imgkey;
				console.log(addservice);
				dataService.put("put/product/"+addservice.id,addservice)
				.then(function(response) {
					if(response.status == "success"){
						$scope.showServiceForm = false;
						$scope.showProductForm = false;
						$scope.editProdForm = false;
						$scope.editServForm = false;
					}

					$scope.alerts.push({type: response.status, msg: response.message});
				});
			} 
		
		$scope.changeScopeObject = function(value){
			$cookieStore.put("productType", value);
			value = $cookieStore.get("productType");
			$scope.productType = value;
			if(value=="product" && $scope.showProductForm == true){
				addproducts();
			}
			
			if(value=="product"){
				productlist();
			}
			
			if(value=="service" && $scope.showServiceForm == true){
				addservices();
			}
			
			if(value=="service"){
				servicelist();
			}
		}
		if($cookies.businessId){
			$scope.changeScopeObject($scope.productType);
		}
		
	
    };
	// Inject controller's dependencies
	productsController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('productsController', productsController);
	
});

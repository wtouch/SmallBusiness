'use strict';

define(['app','css!modules/business/products/products.css'], function (app) {
    var injectParams = ['$scope','$rootScope', '$injector','$location','$routeParams','dataService','upload','modalService','$cookieStore', '$cookies','$notification'];
	
	var purchaseController = function ($scope,$rootScope,$injector,$location,$routeParams,dataService,upload,modalService,$cookieStore, $cookies,$notification) {
		//for display form parts of product & service
		$scope.productView = $routeParams.productView;
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.addproductCurrentPage = 1;
		$scope.CurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.userInfo = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		$scope.path = "/product"; // path to store images on server
		$scope.permission = $rootScope.userDetails.permission.product_module;
		$scope.showProductForm = false;
		$scope.showServiceForm = false;
		$scope.editProdForm = false;
		$scope.editServForm = false;
		($cookies.productType) ? "" : $cookieStore.put("productType", "product");
		$scope.productType = $cookieStore.get("productType");
		
		//function to upload files
		$scope.upload = function(files,path,userInfo,picArr){
			upload.upload(files,path,userInfo,function(data){
				var picArrKey = 0, x;
				for(x in picArr) picArrKey++;
				if(data.status === 'success'){
					picArr.push(data.data);
				}else{
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Upload Image", response.message);
				}
			});
		};
		
		$scope.pageChanged = function(page) {
			dataService.get("/getmultiple/product/"+page+"/"+$scope.pageItems)
			.then(function(response) { 		
				$scope.services = response.data;			
			});
		};
		
		$scope.generateThumb = function(files){ 
			upload.generateThumbs(files);
		};
		$scope.addservice = {};
		$scope.addproduct = {};
		$scope.changeScope = function(value){
			$cookieStore.put("businessId", value);
			$scope.selectBusiness = ($cookieStore.get("businessId"));
			($scope.addservice.business_id) ? $scope.addservice.business_id = value.id : $scope.addservice = {business_id : value.id};
			($scope.addproduct.business_id) ? $scope.addproduct.business_id = value.id : $scope.addproduct = {business_id : value.id};
			
			$scope.changeScopeObject($scope.productType);
		};
		$scope.selectBusiness = ($cookieStore.get("businessId"));
		$scope.showForm = function(object){
			$scope[object] = ($scope[object]==true) ? false : true;
			$scope.$apply;
			if(object == 'showProductForm'){
				addproducts();
			}
			if(object == 'showServiceForm'){
				addservices();
			}
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
		   imgObject.splice(item, 1);     
		}
		
		$scope.businessParams = {status: 0};
			angular.extend($scope.businessParams, $scope.userInfo);
		dataService.get("getmultiple/business/1/100",$scope.userInfo)
		.then(function(response) {  
			if(response.status == 'success'){
				$scope.businessList = [];
				for(var x in response.data){
					$scope.businessList.push({id : response.data[x].id, user_id : response.data[x].user_id, business_name : response.data[x].business_name  });
				}
			}else{
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Get Business List", "You didn't added any business! Please add business first.");
			}
		});
			
		//code for add product
		var addproducts = function(){
			$scope.addproduct = {user_id : $scope.selectBusiness.user_id, product_image : []};
			$scope.addproduct.business_id = $cookieStore.get("businessId").id;
			$scope.postData = function(addproduct) { 
			$scope.addproduct.date = $scope.currentDate;
				 dataService.post("post/product",addproduct)
				.then(function(response) { 
					if(response.status == "success"){
						$scope.showServiceForm = false;
						$scope.showProductForm = false;
						$scope.productlist($scope.CurrentPage);
						if($rootScope.userDetails.config.addProducts != true){
							dataService.progressSteps('addProducts', true);
						}
					}
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Add Product", response.message);
				});
			}
		}
		
		//function for add services
		var addservices = function(){
			$scope.addservice = {user_id : $scope.selectBusiness.user_id, product_image : []};
			console.log($scope.selectBusiness);
			$scope.addservice.business_id = $cookieStore.get("businessId").id;
			$scope.postData = function(addservice) {
				$scope.userInfo=$scope.userInfo;
				$scope.addservice.date = $scope.currentDate;
				dataService.post("post/product",addservice)
				.then(function(response) { 
					if(response.status == "success"){
						$scope.showServiceForm = false;
						$scope.showProductForm = false;
						if($rootScope.userDetails.config.addProducts != true){
							dataService.progressSteps('addProducts', true);
						}
						$scope.servicelist();	
					}
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Add Service", response.message);
				});
			} 
		}
		//view for product list
		$scope.productlist = function(page){
			$scope.productFilter = {business_id : $scope.selectBusiness.id, type : 'product'};
			angular.extend($scope.userInfo, $scope.productFilter);
			dataService.get("getmultiple/product/"+page+"/10",$scope.userInfo)
			.then(function(response) {  
				if(response.status == 'success'){
					$scope.products = response.data;
					$scope.totalRecords = response.totalRecords;
				}else if($rootScope.userDetails.config.addProducts == true){
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Get Product List", response.message);
					$scope.products = {};
				};
			});
		}
		
		$scope.dynamicTooltip = function(status, active, notActive){
			return (status==1) ? active : notActive;
		};
						
		$scope.feature = function(id, featured){
			$scope.featuredData = {featured : featured};
			dataService.put("put/product/"+id, $scope.featuredData)
			.then(function(response) {
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Feature Product", response.message);
			});
		};
		
		$scope.deleted = function(id, status){
			$scope.deletedData = {status : status};
			dataService.put("put/product/"+id, $scope.deletedData)
			.then(function(response) { 
				if(response.status == 'success'){
					$scope.hideDeleted = 0;
				}
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Delete Product", response.message);
			});
		};
		
		//To show service list
		$scope.servicelist= function(page){
			$scope.id=$routeParams.id
			$scope.productFilter = {business_id : $scope.selectBusiness.id, type : 'service'};
			angular.extend($scope.userInfo, $scope.productFilter);
			dataService.get("getmultiple/product/"+page+"/10",$scope.userInfo)
			.then(function(response) {  
				if(response.status == 'success'){
					$scope.services = response.data;
					$scope.totalRecords = response.totalRecords;
				}else if($rootScope.userDetails.config.addProducts == true){
					if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
					$notification[response.status]("Get Services List", response.message);
					$scope.services = {};
				};
			});	
		}
		
		//code to update service
		$scope.updateData = function(addservice) {
			delete addservice.imgkey;
			dataService.put("put/product/"+addservice.id,addservice)
			.then(function(response) {
				if(response.status == "success"){
					$scope.showServiceForm = false;
					$scope.showProductForm = false;
					$scope.editProdForm = false;
					$scope.editServForm = false;
					if(addservice.type =='product'){
						$scope.productlist($scope.CurrentPage);
					}
					else{
						$scope.servicelist($scope.CurrentPage);
					}
				}
				if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Edit Product", response.message);
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
				$scope.productlist($scope.CurrentPage);
			}
			
			if(value=="service" && $scope.showServiceForm == true){
				addservices();
			}
			
			if(value=="service"){
				$scope.servicelist($scope.CurrentPage);
			}
		}
		if($cookies.businessId){
			$scope.changeScopeObject($scope.productType);
		}
		if($scope.productView){
			$scope.changeScope($scope.productView);
			$scope.showForm('showProductForm');
			$scope.showForm('showServiceForm');
		}
	 };
	// Inject controller's dependencies
	purchaseController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('purchaseController', purchaseController);
	
});

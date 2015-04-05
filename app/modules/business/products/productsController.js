'use strict';

define(['app','css!modules/business/products/products.css'], function (app) {
    var injectParams = ['$scope','$rootScope', '$injector','$location','$routeParams','dataService','upload','modalService'];

    // This is controller for this view
	var productsController = function ($scope,$rootScope,$injector,$location,$routeParams,dataService,upload,modalService) {
		//for display form parts of product & service
		$scope.productView = $routeParams.productView;
	
		// all $scope object goes here
		$scope.alerts = [];
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.addproductCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.userDetails = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		$scope.path = "product/"; // path to store images on server
		$scope.showProductForm = false;
		$scope.showServiceForm = false;
		$scope.editProductForm = false;
		$scope.productType = "service";
		//Upload Function for uploading files {Vilas}
		$scope.addproduct = {
			product_image : {}
		}; 
		// this is form object
		$scope.addservice = {
			product_image : {}
		};
		$scope.userinfo = {user_id:1}; // this is for uploading credentials
		$scope.upload = function(files,path,userinfo,picArr){//this function for uploading files
	
			upload.upload(files,path,userinfo,function(data){
				var picArrKey = 0, x;
				for(x in picArr) picArrKey++;
				if(data.status === 'success'){
					picArr[picArrKey] = data.data;
				}else{
					$scope.alerts.push({type: data.status, msg: d.message});
				}
	
			});
		};
		
		$scope.generateThumb = function(files){  // this function will generate thumbnails of images
			upload.generateThumbs(files);
		};// End upload function
		$scope.changeScope = function(value, object){
			$scope.addservice.business_id = value.id;
			$scope.addproduct.business_id = value.id;
			$scope.changeScopeObject($scope.productType);
		};
		$scope.showForm = function(object){
			$scope[object] = ($scope[object]==true) ? false : true;
			$scope.$apply;
			if(object == 'showProductForm'){
				addproducts();
			}
			if(object == 'showServiceForm'){
				addservices();
			}
			$scope.editProductForm = false;//this is for closing the edit form
			$scope.editServiceForm = false
		}
		$scope.editServiceForm = function(x1){
			$scope.showServiceForm = true;
			$scope.editServiceForm = true;
			angular.extend($scope.addservice, x1);
		}
		$scope.editProductForm = function(x1){
			$scope.showProductForm = true;
			$scope.editProductForm = true;
			angular.extend($scope.addproduct, x1);
		}
		
		// get data for business options 
		
		//for close alert
		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};
		
		dataService.get("getmultiple/business/1/100",$scope.userDetails)
			.then(function(response) {  //function for template list response
			//$scope.businessList.user_id=$scope.userDetails.user_id;
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
			//reset function{trupti}
				$scope.reset = function(){
				$scope.addproduct = {};
			};
			//angular.extend(addproduct,$scope.userDetails);
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
				$scope.userDetails=$scope.userDetails;
				$scope.addservice.date = $scope.currentDate;
				dataService.post("post/product",addservice)
				.then(function(response) {  //function for response of request temp
				});
			} //end of post method {trupti} 
			 //end of post method {trupti}
		}
		
		
		//view for product list
		var productlist= function(){
					$scope.productFilter = {business_id : $scope.selectBusiness.id, type : 'product'};
					angular.extend($scope.userDetails, $scope.productFilter);
					dataService.get("getmultiple/product/1/10",$scope.userDetails)
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
			$scope.productFilter = {business_id : $scope.selectBusiness.id, type : 'service'};
				angular.extend($scope.userDetails, $scope.productFilter);
				dataService.get("getmultiple/product/1/10",$scope.userDetails)
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
		$scope.changeScopeObject = function(value){
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
	
    };
	// Inject controller's dependencies
	productsController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('productsController', productsController);
	
});

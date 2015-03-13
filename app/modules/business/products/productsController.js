'use strict';

define(['app','css!modules/business/products/products.css'], function (app) {
    var injectParams = ['$scope','$rootScope', '$injector','$location','$routeParams','dataService','upload'];

    // This is controller for this view
	var productsController = function ($scope, $rootScope,$injector,$location,$routeParams,dataService,upload) {
		console.log("Product Controller"); // Just Added for testing {Vilas}
		
		//for display form parts of product & service
		$scope.productView = $routeParams.productView;
	
		// all $scope object goes here
		$scope.alerts = [];
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.addproductCurrentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";
		$scope.user_id = {user_id : 2};
		//$scope.selectBusiness = {};
		
		//Upload Function for uploading files {Vilas}
		$scope.addproduct={}; // this is form object
		$scope.addservice = {};
		$scope.userinfo = {userId:1}; // this is for uploading credentials
		$scope.path = "product/"; // path to store images on server
		$scope.addproduct.product_image  = []; // uploaded images will store in this array
		$scope.addservice.product_image  = []; // uploaded images will store in this array
		$scope.upload = function(files,path,userinfo,imgArr){ // this function for uploading files
		console.log(imgArr);
			upload.upload(files,path,userinfo,function(data){
				if(data.status === 'success'){
					imgArr.push(JSON.stringify(data.details));
					console.log(data.message);
				}else{
					$scope.alerts.push({type: response.status, msg: response.message});
				}
	
			});
		};
		$scope.generateThumb = function(files){  // this function will generate thumbnails of images
			upload.generateThumbs(files);
		};// End upload function
		
		
		
		$scope.changeScope = function(value, object){
			$scope.addservice.business_id = value.id;
			$scope.addproduct.business_id = value.id;
			console.log($scope.addproduct);
		}
		
		// get data for business options 
		dataService.get("/getmultiple/business/1/100")
			.then(function(response) {  //function for template list response
				if(response.status == 'success'){
					$scope.businessList = response.data;
					console.log($scope.businessList);
				}else{
					
				}
			});
		//end of options
		
		var addproducts = function(){
			//reset function{trupti}
			
			
			//console.log($scope.addproduct.business_id);
			$scope.reset = function() {
				$scope.addproduct = {};
			};
			$scope.postData = function(addproduct) { 
			addproduct.user_id=$scope.user_id.user_id;
			
			//console.log(user_id);
				dataService.post("post/product",addproduct)
				.then(function(response) {  //function for response of request temp
					$scope.addproduct = response.data;
					console.log(response);
					$scope.reset();
				});
			}//end of post method {trupti}
		}
		
		var addservices = function(){
			//reset function{trupti}
			
			
			//console.log($scope.addproduct.business_id);
			$scope.reset = function() {
				$scope.addservice = {};
			};
			$scope.postData = function(addservice) { 
			addproduct.user_id=$scope.user_id.user_id;
			
			//console.log(user_id);
				dataService.post("post/product",addservice)
				.then(function(response) {  //function for response of request temp
					$scope.addservice = response.data;
					console.log(response);
					$scope.reset();
				});
			}//end of post method {trupti}
		}
		
		switch($scope.productView) {
			case 'addproducts':
				addproducts();
				break;
			case 'addservices':
				addservices();
				break;
			default:
				addproducts();
		};
		
    };

	// Inject controller's dependencies
	productsController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('productsController', productsController);
	
	
});

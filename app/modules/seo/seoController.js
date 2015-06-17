'use strict';
define(['app'], function (app) {
	
	var injectParams = ['$scope','$rootScope','$injector', '$routeParams','upload','dataService','$notification'];

	var seoController = function ($scope,$rootScope, $injector,$routeParams,upload,dataService,$notification) {
		$rootScope.metaTitle = "SEO Form";
		$scope.alerts = [];
		$scope.userInfo = {user_id : $rootScope.userDetails.id};
		$scope.currentDate = dataService.currentDate;
		
		$scope.postData = function(seo) {
			dataService.post("post/seo",seo)
			.then(function(response) {  
				if(response.status == "success"){
				}
				 if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
				$notification[response.status]("Submit SEO", response.message); 
			});
		}
		
		$scope.getMenulist = function(user_id){
			//console.log(user_id, business_id);
			$scope.seoParam = {user_id : user_id, status : 1};
				dataService.get("getmultiple/seo/1/100",$scope.seoParam)
				.then(function(response) {
					if(response.status == 'success'){
						$scope.seosetting.config.menus = response.data;
					}else{
						if(response.status == undefined) response = {status :"error", message:"Unknown Error"};
						$notification[response.status]("Menu Selection", response.message);
					}
				});
			
		}
		
	/****************************************************************************/
		$scope.openseo= function (url) {
		var modalDefaults = {
			templateUrl: url,	
			size : 'lg'
		};
		var modalOptions = {
			
		};
		modalService.showModal(modalDefaults, modalOptions).then(function (result) {
		});
	};
	/**********************************************************************************/
		
		
	};	
	 
	// Inject controller's dependencies
	seoController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('seoController',seoController);
	
});
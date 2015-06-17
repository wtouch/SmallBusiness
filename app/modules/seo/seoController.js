'use strict';
define(['app'], function (app) {
	
	var injectParams = ['$scope','$rootScope','$injector', '$routeParams','upload','dataService','$notification'];
  // This is controller for this view
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
		
		
	};	
	 
	// Inject controller's dependencies
	seoController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('seoController',seoController);
	
});
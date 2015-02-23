

'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$location','$routeParams'];

    // This is controller for this view
	var businessController = function ($scope, $injector,$location,$routeParams) {
		console.log("this is business ctrl ");
		
			
		$scope.businessPart = $routeParams.businessPart; 
		
		console.log($scope.businessPart);
		/*For display by default businesslist.html page*/
		if(!$routeParams.businessPart) {
		$location.path('/dashboard/business/businesslist');
		}
	
		templateUrl:'http://localhost/trupti/SmallBusiness/app/modules/business/business.html';
    };
	
    
	// Inject controller's dependencies
	businessController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('businessController', businessController);
	
	
});

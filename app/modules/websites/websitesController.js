

'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$routeParams','$location'];

    // This is controller for this view
	var websitesController = function ($scope, $injector,$routeParams,$location) {
		console.log("this is mywebsites ctrl ");
		
		$scope.websitePart = $routeParams.websitePart; 
		
		console.log($scope.websitePart);
		/*For display by default templ.html page*/
		if(!$routeParams.websitePart) {
		$location.path('/dashboard/websites/websiteslist');
		}
	
		templateUrl:'http://localhost/aarti/SmallBusiness/app/modules/websites/mywebsites.html';
    };
	
    
	// Inject controller's dependencies
	websitesController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('websitesController', websitesController);
	
	
});

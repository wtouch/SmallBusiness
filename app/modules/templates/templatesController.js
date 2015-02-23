

'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$location','$routeParams'];

    // This is controller for this view
	var templatesController = function ($scope, $injector,$location,$routeParams) {
		console.log("this is templates ctrl ");
		
		$scope.tempPart = $routeParams.tempPart; 
		
		console.log($scope.tempPart);
		/*For display by default templ.html page*/
		if(!$routeParams.tempPart) {
		$location.path('/dashboard/templates/listoftemplates');
		}
	
		templateUrl:'http://localhost/trupti/SmallBusiness/app/modules/templates/templates.html';
    };
	
    
	// Inject controller's dependencies
	templatesController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('templatesController', templatesController);
	
	
});

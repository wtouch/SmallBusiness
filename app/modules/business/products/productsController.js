'use strict';

define(['app','css!modules/business/products/products.css'], function (app) {
    var injectParams = ['$scope', '$injector'];

    // This is controller for this view
	var productsController = function ($scope, $injector) {
		console.log("Product Controller"); // Just Added for testing {Vilas}
		
    };
    
	// Inject controller's dependencies
	productsController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('productsController', productsController);
	
	
});

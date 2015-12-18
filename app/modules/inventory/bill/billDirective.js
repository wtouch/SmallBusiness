'use strict';

define(['app'], function (app) {
   
   var firstname = function () {
		return {
			restrict: "A", // A - Attribute, E - Element, EA - Attribute/Element
			require: "?ngModel", // ngModel
			link: function (scope, element, attributes, ngModel) {
				console.log(ngModel);
				ngModel.$validators.firstname = function (modelValue) {
					console.log(ngModel);
					if (modelValue == "Tony" || modelValue == "John") {
						return true;
					}
					else return false;
				};
				ngModel.$validators.lkjfdk = function (modelValue) {
					console.log(ngModel);
					if (modelValue == "Tony" || modelValue == "John") {
						return true;
					}
					else return false;
				};
			}
		};
	};
	
	// Inject controller's dependencies
	//billController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.directive('firstname', firstname);
});
'use strict';

define(['app'], function (app) {
	var checkAmount = function () {
		return {
			restrict: "A", // A - Attribute, E - Element, EA - Attribute/Element
			require: "?ngModel", // ngModel
			scope : {
				previous_balance : "=previousBalance",
				due_amount : "=dueAmount"
			},
			link: function (scope, element, attributes, ngModel) {
				ngModel.$validators.checkAmount = function (modelValue) {
					//console.log(ngModel.$viewValue);
					//console.log(scope.previous_balance);
					//console.log(scope.due_amount);
					var amount = parseFloat(ngModel.$viewValue);
					var due_amount = parseFloat(scope.due_amount);
					var previous_balance = parseFloat(scope.previous_balance);
					if((amount <= due_amount) && (amount <= previous_balance)){
						console.log(ngModel.$viewValue, scope.due_amount, scope.previous_balance);
						return true;
					}else{
						console.log(ngModel.$viewValue, scope.due_amount, scope.previous_balance);
						return false;
					} 
				};
			}
		};
	};
    app.register.directive('checkAmount', checkAmount);
});
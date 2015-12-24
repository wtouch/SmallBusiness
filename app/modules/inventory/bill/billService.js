'use strict';

define(['app'], function (app) {
	var injectParams = ['$rootScope'];
    
	var billService = function ($rootScope) {
		return {
			taxCalc : function(modalOptions){
				console.log(modalOptions);
					modalOptions.singleparticular.tax = {};
					
					angular.forEach($rootScope.userDetails.config.inventory.taxData.tax, function(value, key){
						if(modalOptions.taxInfo[value.taxName]){
							modalOptions.singleparticular.tax[value.taxName] = (modalOptions.singleparticular.tax[value.taxName]) ? modalOptions.singleparticular.tax[value.taxName] + (value.taxValue * modalOptions.singleparticular.amount / 100) : (value.taxValue * modalOptions.singleparticular.amount / 100);
						}
					})
				},
				totalCalculate : function(modalOptions,object){
					console.log(modalOptions,object);
					modalOptions[object].subtotal = 0;
					modalOptions[object].total_amount = 0;
					modalOptions[object].tax = {};
					angular.forEach(modalOptions[object].particular, function(value, key){
						modalOptions[object].subtotal += value.amount;
						angular.forEach(value.tax,function(value, key){
							modalOptions[object].tax[key] = (modalOptions[object].tax[key]) ? modalOptions[object].tax[key] + value : value;
						})
						
					})
					
					var taxSubtotal = 0;
					angular.forEach(modalOptions[object].tax, function(value, key){
						taxSubtotal += value;
					})
					
					modalOptions[object].total_amount = modalOptions[object].subtotal + taxSubtotal;
					return modalOptions;
				},
		}
	};
	billService.$inject = injectParams;
    app.register.service('billService', billService);
});
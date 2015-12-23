'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService', 'uiGridConstants'];
    
    // This is controller for this view
	var balanceController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
		$scope.transactions = true;
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.currentDate = dataService.currentDate;
		$scope.transactionView = true;
		$rootScope.serverApiV2 = true;
		$rootScope.module = "campus";
		
				$scope.invoiceParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
			},
			join : [
				{
					joinType : 'INNER JOIN',
					joinTable : "campus_vendor",
					joinOn : {
						id : "t0.party_id"
					},
					cols : {name : "name"}
				},{
					joinType : "left join",
					joinTable : "campus_transaction",
					joinOn : {
						reference_id : "t0.id"
					},
					cols : ['credit_amount, IFNULL(sum(t2.credit_amount),0) as paid_amount']
				}
			],
			groupBy : {
				id : "id"
			},
			cols : ["*, (t0.total_amount - IFNULL(sum(t2.credit_amount),0)) as due_amount"]
		}
		$scope.transactionParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
			},
				join : [
					{
						joinType : 'INNER JOIN',
						joinTable : "campus_transaction",
						joinOn : {
							acc_id : "t0.id"
						},
						cols : [ "id,account_name,(sum(t1.credit_amount)-sum(t1.debit_amount))as account_balance"]
					},
				],
				groupBy : {
					acc_id : "acc_id"
				},
			cols : ["*"]
		}
		$scope.getData = function(single, page, table, subobj, params, modalOptions) {
			$scope.params = (params) ? params : {
				where : {
					status : 1,
					user_id : $rootScope.userDetails.id
				},
				cols : ["*"]
			};
			if(page){
				angular.extend($scope.params, {
					limit : {
						page : page,
						records : $scope.pageItems
					}
				})
			}
			dataService.get(single,table,$scope.params).then(function(response) {
				if(response.status == 'success'){
					if(modalOptions != undefined){
						modalOptions[subobj] = angular.copy(response.data);
						modalOptions.totalRecords = response.totalRecords;
					}else{
						($scope[subobj]) ? $scope[subobj].data = angular.copy(response.data) : $scope[subobj] = angular.copy(response.data) ;
						$scope.totalRecords = response.totalRecords;
					}
				}else{
					if(modalOptions != undefined){
						modalOptions[subobj] = [];
						modalOptions.totalRecords = 0;
					}else{
						($scope[subobj]) ? $scope[subobj].data = [] : $scope[subobj] = [] ;
						$scope.totalRecords = 0;
					}
				}
			});
		}
		$scope.getData(false, true,'account', "transaction_list",$scope.transactionParams);
		$scope.getData(false, true,'invoice', "invoice_list",$scope.invoiceParams);
		$scope.getData(false, true,'bill', "bill_list",$scope.invoiceParams);
		$scope.getTotal = function(){
				var total = 0;
				for(var i = 0; i < $scope.invoice_list.length; i++){
					var addition = $scope.invoice_list[i];
					total += parseInt(addition.due_amount);
				}
				return total;
		}
		$scope.getTotalBill = function(){
				var total = 0;
				for(var i = 0; i < $scope.bill_list.length; i++){
					var addition = $scope.bill_list[i];
					total += parseInt(addition.due_amount);
				}
				return total;
		}
		$scope.getTotalBalance = function(){
				var total = 0;
				for(var i = 0; i < $scope.transaction_list.length; i++){
					var addition = $scope.transaction_list[i];
					total += parseInt(addition.account_balance);
				}
				return total;
		}
	 };
		
	// Inject controller's dependencies
	balanceController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('balanceController', balanceController);
});
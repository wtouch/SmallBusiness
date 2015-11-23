'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants'];
    
    // This is controller for this view
	var transactionController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
		//global scope objects
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
		$rootScope.module = "inventory";
		$scope.transactionList = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{ name:'SrNo', 
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false, enableFiltering: false
				},
				{ name:'account_id',enableSorting: false ,
				filterHeaderTemplate: '<input id="id" class="form-control" ng-change="grid.appScope.filter(\'id\', id, \'transaction\', \'transactionList\')" ng-model="id" placeholder="Id">',
					},
				{ name:'category', enableSorting: false, 
					filterHeaderTemplate: '<input id="category" class="form-control" ng-change="grid.appScope.filter(\'category\', category, \'transaction\', \'transactionList\')" ng-model="category" placeholder="Category">',
					},
				{ name:'description',enableSorting: false, enableFiltering: false},
				{ name:'type',enableSorting: false,
					filterHeaderTemplate: '<select id="type" class="form-control" ng-change="grid.appScope.filter(\'type\', type, \'transactions\', \'transactionList\')" ng-model="type">'
							+'<option value="" selected>type</option>'
							+'<option value="expense">Expence</option>'
							+'<option value="income">Income</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					 
					  options: [ { value: 'income', label: 'Income' }, { value: 'expense', label: 'Expence' }]
					} },
				{ name:'credit_amount',
					filterHeaderTemplate: '<input id="credit_amount" class="form-control" ng-change="grid.appScope.filter(\'credit_amount\', credit_amount, \'transaction\', \'transactionList\')" ng-model="credit_amount" placeholder="Amount">',
					},
				{ name:'debit_amount',
					filterHeaderTemplate: '<input id="debit_amount" class="form-control" ng-change="grid.appScope.filter(\'debit_amount\', debit_amount, \'transaction\', \'transactionList\')" ng-model="debit_amount" placeholder="Amount">',
					},
				{ name:'balance',
					filterHeaderTemplate: '<input id="balance" class="form-control" ng-change="grid.appScope.filter(\'balance\', balance, \'transaction\', \'transactionList\')" ng-model="balance" placeholder="Amount">',
					},
				{ name:'status',
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'transaction\', \'transactionList\')" ng-model="status">'
							+'<option value="" selected>Status</option>'
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					 
					  options: [ { value: '1', label: 'Active' }, { value: '0', label: 'Delete' }]
					} 
				},
				
				{ name:'Manage', enableSorting: false, enableFiltering: false, 
					cellTemplate : '<a ng-click="grid.appScope.openAddincome(\'modules/inventory/transaction/addincome.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit Account Information"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete Account" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'transactions\', \'status\',row.entity.status, row.entity.id)" btn-checkbox="" btn-checkbox-true="1" btn-checkbox-false="0" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					
				}
			],
			onRegisterApi: function( gridApi ) {
			  $scope.gridApi = gridApi;
				$scope.gridApi.core.on.filterChanged( $scope, function() {
					
				})
			}
		};
		
		//Add Income form pop up 
		$scope.openAddincome = function(url,data){
			
			var modalDefault = {
				templateUrl:url,	// apply template to modal
				size : 'lg'
			};
			
			var modalOptions = {
				incomeDate : { date : $scope.currentDate},
				
				addincome : (data) ? {
					id : data.id,
					category : data.category,
					customer : data.customer,
					user_id : data.user_id,
					balance : data.balance,
					date : data.date,
					amount : data.amount,
					due_amount : data.due_amount,
					description : data.description 
				} : {
					//date : dataService.sqlDateFormate()
				},
				
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							console.log(response);
							$scope.getData(false, $scope.currentPage, 'transaction','transactionList');
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'transaction','transactionList');
						}
					})
				},
				getData : $scope.getData,
				addToObject : $rootScope.addToObject,
				removeObject : $rootScope.removeObject
			};
			
			modalService.showModal(modalDefault, modalOptions).then(function(){
		
			})
		}
		
		
		$scope.openAddexpense = function(url,data){
			
			var modalDefault = {
				templateUrl:url,	// apply template to modal
				size : 'lg'
			};
			
			var modalOptions = {
				expenceDate : { date : $scope.currentDate},
				
				addexpence : (data) ? {
					id : data.id,
					category : data.category,
					customer : data.customer,
					user_id : data.user_id,
					balance : data.balance,
					expenceDate : data.date,
					amount : data.amount,
					due_amount : data.due_amount,
					description : data.description 
				} : {
					//date : dataService.sqlDateFormate()
				},
				
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							console.log(response);
							$scope.getData(false, $scope.currentPage, 'transaction','transactionList');
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'transaction','transactionList');
						}
					})
				},
				getData : $scope.getData,
				addToObject : $rootScope.addToObject,
				removeObject : $rootScope.removeObject
			};
			
			modalService.showModal(modalDefault, modalOptions).then(function(){
		
			})
		} 
		
		//add transaction
		$scope.openAddtransaction = function(url,data){
			
			var modalDefault = {
				templateUrl:url,	// apply template to modal
				size : 'lg'
			};
			
			var modalOptions = {
				transferDate : { date : $scope.currentDate},
				
				addtransfer : (data) ? {
					id : data.id,
					transferDate : data.date,
				
				} : {
					//date : dataService.sqlDateFormate()
				},
				
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							console.log(response);
							$scope.getData(false, $scope.currentPage, 'transaction','transactionList');
						}
					})
				},
				 updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'transaction','transactionList');
						}
					})
				}, 
				getData : $scope.getData,
				addToObject : $rootScope.addToObject,
				removeObject : $rootScope.removeObject
			};
			
			modalService.showModal(modalDefault, modalOptions).then(function(){
		
			})
		}
		
		
		// For Get (Select Data from DB)
		$scope.getData = function(single, page, table, subobj, params, modalOptions) {
			$scope.params = (params) ? params : {
				where : {
					status : 1
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
				console.log(response);
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
		
		$scope.filter = function(col, value, table, subobj, search){
			value = (value) ? value : undefined;
			$rootScope.filterData(col, value, search, function(response){
				angular.extend($scope.params, response);
				$scope.getData(false, $scope.currentPage, table, subobj, $scope.params);
			})
		}
		$scope.orderBy = function(col, value, table, subobj){
			if(!$scope.params.orderBy) $scope.params.orderBy = {};
			$scope.params.orderBy[col] = value;
			$scope.getData($scope.currentPage, table, subobj, $scope.params);
		}
		
	 };
	// Inject controller's dependencies
	transactionController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('transactionController', transactionController);
});
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
		$scope.today = new Date();
		$scope.todayDt = $scope.today.getFullYear() + "-" + ($scope.today.getMonth() + 1) + "-" + $scope.today.getDate();
		$scope.duration = {start : $scope.todayDt};
		
		$scope.open = function($event,rentdate){
			$event.preventDefault();
			$event.stopPropagation();
			$scope[rentdate] = !$scope[rentdate];
		};
		
		
		$rootScope.moduleMenus = [
			{
				name : "Add Income",
				events : {
					click : function(){
						return $scope.openAddincome("modules/inventory/transaction/addincome.html");
					}
				}
			},{
				name : "Add Expence",
				events : {
					click : function(){
						return $scope.openAddexpense("modules/inventory/transaction/addexpense.html");
					}
				}
			},
			{
				name : "Transfer",
				events : {
					click : function(){
						return $scope.openModal("modules/inventory/transaction/transfer.html");
					}
				}
			}
		]
		
		
		
		$scope.calcDuration = function(type, duration){
			var curDate = new Date();
			if(type == 'custom'){
				var dateS = new Date(duration.start);
				var dateE = new Date(duration.end);
				var startDt = dateS.getFullYear() + "-" + (dateS.getMonth() + 1) + "-" + dateS.getDate();
				var endtDt = dateE.getFullYear() + "-" + (dateE.getMonth() + 1) + "-" + (dateE.getDate() + 1 );
			}
			if(type == 'daily'){
				var dateS = new Date(duration.start);
				var startDt = dateS.getFullYear() + "-" + (dateS.getMonth() + 1) + "-" + dateS.getDate();
				var endtDt = dateS.getFullYear() + "-" + (dateS.getMonth() + 1) + "-" + (dateS.getDate() + 1);
			}
			if(type == 'month'){
				duration = parseInt(duration);
				var today = new Date();
				var start = new Date(today.getFullYear(), (duration - 1), 1);
				var endt = new Date(today.getFullYear(), (duration - 1) + 1, 0);
				
				var startDt = start.getFullYear() +"-" + (start.getMonth() + 1) + "-"+start.getDate();
				var endtDt = endt.getFullYear() +"-" + (endt.getMonth() + 1) + "-"+ (endt.getDate() + 1);
			}
			if(type == 'year'){
				duration = parseInt(duration);
				var today = new Date();
				var start = new Date(duration, 3, 1);
				var endt = new Date(duration + 1, 3, 1);
				
				var startDt = start.getFullYear() +"-" + (start.getMonth() + 1) + "-"+start.getDate();
				var endtDt = endt.getFullYear() +"-" + (endt.getMonth() + 1) + "-"+ (endt.getDate());
			}
			
			$scope.transactionParams.endtDt = endtDt;
			$scope.transactionParams.startDt = startDt;
			//$scope.getTransaction($scope.CurrentPage, $scope.transactionParams);
		}
		
		
		console.log(uiGridConstants.scrollbars);
		$scope.transactionList = {
			enableSorting: true,
			enableFiltering: true,
			//showGridFooter: true,
			showColumnFooter: true,
			enableHorizontalScrollbar : uiGridConstants.scrollbars.NEVER,
			enableVerticalScrollbar : uiGridConstants.scrollbars.NEVER,
			columnDefs: [
				{ name:'SrNo', 
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false, enableFiltering: false
				},
				{ name:'account_name',enableSorting: false ,
				filterHeaderTemplate: '<select id="account_id" class="form-control" ng-change="grid.appScope.filter(\'account_id\', account_id, \'transaction\', \'transactionList\',true, grid.appScope.transactionParams)" ng-model="account_id" ng-options="item.account_id as item.account_name for item in grid.appScope.accountList">'
							+'<option value="" selected>Account Name</option>'
						+'</select>',
					},
				{ name:'category', enableSorting: false, 
					filterHeaderTemplate: '<select id="category" class="form-control" ng-change="grid.appScope.filter(\'category\',category, \'transaction\', \'transactionList\',true, grid.appScope.transactionParams)" ng-model="transaction_category">'
							+'<option value="" selected>Select Category</option>'
								+'<option value="type1" >Licence Fees</option>'
								+'<option value="type2">Agriculture</option>'
								+'<option value="type3">Commisions</option>'
								+'<option value="type4">Fees & Chagrges</option>'
								+'<option value="type5">Investments</option>'
								+'<option value="type6">Non Profit</option>'
								+'<option value="type7">Other Income</option>'
								+'<option value="type8">Proffesional Services</option>'
								+'<option value="type9">Sales products & services</option>'
						+'</select>',
					},
					{ name:'type',enableSorting: false,
					filterHeaderTemplate: '<select id="type" class="form-control" ng-change="grid.appScope.filter(\'type\', type, \'transaction\', \'transactionList\',true, grid.appScope.transactionParams)" ng-model="type">'
							+'<option value="" selected>type</option>'
							+'<option value="expense">Expence</option>'
							+'<option value="income">Income</option>'
						+'</select>',
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					 
					  options: [ { value: 'income', label: 'Income' }, { value: 'expense', label: 'Expence' }]
					} },
				{ name:'description',
				enableSorting: false, enableFiltering: false,
					filterHeaderTemplate: '<input id="description" class="form-control" ng-change="grid.appScope.filter(\'description\', description, \'transaction\', \'transactionList\',true, grid.appScope.transactionParams)" ng-model="description" placeholder="description">'},
				{ name:'date',
				enableSorting: false, enableFiltering: false,
					filterHeaderTemplate: '<input id="date" class="form-control" ng-change="grid.appScope.filter(\'date\', date, \'transaction\', \'transactionList\',true, grid.appScope.transactionParams)" ng-model="date" placeholder="date">',
					},
				{ name:'credit_amount',
					filterHeaderTemplate: '<input id="credit_amount" class="form-control" ng-change="grid.appScope.filter(\'credit_amount\', credit_amount, \'transaction\', \'transactionList\',true)" ng-model="credit_amount" placeholder="Credit Amount">',
					footerCellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.totalCredit}}</div>'
					},
				{ name:'debit_amount',
					filterHeaderTemplate: '<input id="debit_amount" class="form-control" ng-change="grid.appScope.filter(\'debit_amount\', debit_amount, \'transaction\', \'transactionList\',true, grid.appScope.transactionParams)" ng-model="debit_amount" placeholder="Debit Amount">',
					footerCellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.totalDebit}}</div>'
					},
				{ name:'balance',
					filterHeaderTemplate: '<input id="balance" class="form-control" ng-change="grid.appScope.filter(\'balance\', balance, \'transaction\', \'transactionList\', false, grid.appScope.transactionParams)" ng-model="balance" placeholder="Balance">',
					footerCellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.totalCredit - grid.appScope.totalDebit}}</div>'
					},
				{ name:'status',
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'transaction\', \'transactionList\', false, grid.appScope.transactionParams)" ng-model="status">'
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
		
		$scope.verticalSum = function(inputArray, column, subobj){
			/* if(!$scope[subobj])  */$scope[subobj] = 0;
			
			angular.forEach(inputArray, function(value, key){
				$scope[subobj] += parseFloat(value[column]);
			})
			return $scope[subobj];
		}
		
		$scope.verticalProductSum = function(inputArray, column1, column2, calculation, subobj){
			/* if(!$scope[subobj])  */
			$scope[subobj] = 0;
			
			angular.forEach(inputArray, function(value, key){
				$scope[subobj] += eval(parseFloat(value[column1]) + calculation +parseFloat(value[column2]));
			})
			return $scope[subobj];
		}
		
		$scope.$watch(function(){ return $scope.transactionList.data},function(newValue){
			if(angular.isArray(newValue)){
				if(newValue.length >= 1){
					
					$scope.verticalSum($scope.transactionList.data, 'credit_amount', 'totalCredit');
					$scope.verticalSum($scope.transactionList.data, 'debit_amount', 'totalDebit');
				}
			}
		})
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
					party_id : data.party_id,
					account_id : data.account_id,
					category : data.category,
					user_id : data.user_id,
					balance : data.balance,
					payment_type : data.payment_type,
					date : data.date,
					credit_amount : data.credit_amount,
					description : data.description 
				} : {
					//date : dataService.sqlDateFormate()
				},
				
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'transaction','transactionList',$scope.transactionParams);
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
					date : data.date,
					amount : data.amount,
					due_amount : data.due_amount,
					description : data.description 
				} : {
					date : dataService.sqlDateFormate()
				},
				
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'transaction','transactionList',$scope.transactionParams);
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'transaction','transactionList',$scope.transactionParams);
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
		
		$scope.transactionParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
			},
				join : [
					{
						joinType : 'INNER JOIN',
						joinTable : "inventory_account",
						joinOn : {
							account_id : "t0.account_id"
						},
						cols : {account_name : "account_name",category:"transaction_category"}
					}
				],
			cols : ["*"]
		}
		
		// For Get (Select Data from DB)
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
		$scope.filter = function(col, value, table, subobj, search, params){
			value = (value) ? value : undefined;
			if(!params) params = {};
			$rootScope.filterData(col, value, search, function(response){
				angular.extend($scope.params, params, response);
				console.log($scope.params);
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
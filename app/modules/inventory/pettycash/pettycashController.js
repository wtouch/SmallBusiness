'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$http','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants','$timeout'];
    // This is controller for this view
	var pettycashController = function ($scope,$rootScope,$http,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants,$timeout) {
		
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
		$scope.toDate = function(date){
			return new Date(date);
		}
		
		$http.get("modules/inventory/config.json").success(function(response){
			console.log(response);
				$scope.staffConfig = response;
			})
		
		$rootScope.moduleMenus = [
			{
				name : "Staff Payment",
				path : "#/dashboard/inventory/pettycash/",
				events : {
					click : function(){
						return $scope.openStaffpayment("modules/inventory/pettycash/staffpayment.html");
					}
				}
			}
		]
		
		$http.get("modules/inventory/config.json").success(function(response){
				$scope.inventoryConfig = response;
			})
		$scope.today = function() {
				$scope.date = new Date();
			};
		$scope.open = function($event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.opened = ($scope.opened==true)?false:true;
		};
		$scope.open1 = function($event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.opened1 = ($scope.opened1==true)?false:true;
		};
		$scope.open2 = function($event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.opened2 = ($scope.opened2==true)?false:true;
		};
		
		$scope.transactionCategory = [];
		$scope.transactionList = {
			enableSorting: true,
			enableFiltering: true,
			//showGridFooter: true,
			showColumnFooter: true,
			enableHorizontalScrollbar : uiGridConstants.scrollbars.NEVER,
			enableVerticalScrollbar : uiGridConstants.scrollbars.NEVER,
			columnDefs: [
				{ name:'SrNo',  width:50,
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false, enableFiltering: false
				},
				{ name:'name',enableSorting: false ,  width:70,
				},
				{ name:'surname',enableSorting: false ,  width:70,
				},
				{ name:'account_name',enableSorting: false ,  width:70,
				filterHeaderTemplate: '<select id="account_id" class="form-control" ng-change="grid.appScope.filter(\'account_id\', account_id, \'transaction\', \'transactionList\',true, grid.appScope.transactionParams)" ng-model="account_id" ng-options="item.id as item.account_name for item in grid.appScope.accountList">'
							+'<option value="" selected>Account Name</option>'
						+'</select>',
					},
				{
					name:'type',
					enableSorting: false,
					filterHeaderTemplate: '<select id="type" class="form-control" ng-change="grid.appScope.filter(\'type\', type, \'transaction\', \'transactionList\',true, grid.appScope.transactionParams);grid.appScope.transactionCategory = grid.appScope.inventoryConfig[type]" ng-model="type">'
							+'<option value="" selected>type</option>'
							+'<option value="expense">Expense</option>'
							+'<option value="income">Income</option>'
							+'<option value="transfer">Transfer</option>'
							+'<option value="invoice_payment">Invoice Payment</option>'
							+'<option value="bill_payment">Bill Payment</option>'
							+'<option value="staff_payment">Staff Payment</option>'
						+'</select>',
					filter: {
						//type: uiGridConstants.filter.SELECT,
						options: [{ value: 'income', label: 'Income' }, { value: 'expense', label: 'Expense' }]
					} ,
					cellTemplate:'<span>{{row.entity.type.replace("_"," ")|capitalize}}</span>'
				},
				{ name:'category',enableSorting: false, 
					filterHeaderTemplate: '<select ng-if="grid.appScope.transactionCategory" id="category" class="form-control" ng-change="grid.appScope.filter(\'category\', category, \'transaction\', \'transactionList\',true, grid.appScope.transactionParams)" ng-model="category" ng-options="item.system_name as item.name for item in grid.appScope.transactionCategory">'
							+'<option value="" selected>Category</option>'
						+'</select>',
					cellTemplate:'<span>{{row.entity.category.replace("_"," ")|capitalize}}</span>'
				},
					
				{ name:'description',
				enableSorting: false, visible : false,enableFiltering: false,
					filterHeaderTemplate: '<input id="description" class="form-control" ng-change="grid.appScope.filter(\'description\', description, \'transaction\', \'transactionList\',true, grid.appScope.transactionParams)" ng-model="description" placeholder="description">',
					cellTemplate: '<span ng-repeat=" x in row.entity.description">{{x}}</span>'
					},
				{ name:'date',
				enableSorting: true, enableFiltering: false,
					filterHeaderTemplate: '<input id="date" class="form-control" ng-change="grid.appScope.filter(\'date\', date, \'transaction\', \'transactionList\',true, grid.appScope.transactionParams)" ng-model="date" placeholder="date">',
				},
				{ name:'credit_amount',
					filterHeaderTemplate: '<input id="credit_amount" class="form-control" ng-change="grid.appScope.filter(\'credit_amount\', credit_amount, \'transaction\', \'transactionList\',true,grid.appScope.transactionParams)" ng-model="credit_amount" placeholder="Credit Amount">',
					footerCellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.totalCredit}}</div>'
					},
				{ name:'debit_amount',
					filterHeaderTemplate: '<input id="debit_amount" class="form-control" ng-change="grid.appScope.filter(\'debit_amount\', debit_amount, \'transaction\', \'transactionList\',true, grid.appScope.transactionParams)" ng-model="debit_amount" placeholder="Debit Amount">',
					footerCellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.totalDebit}}</div>'
					},
				{ name:'balance',
					filterHeaderTemplate: '<input id="balance" class="form-control" ng-change="grid.appScope.filter(\'balance\', balance, \'transaction\', \'transactionList\', true, grid.appScope.transactionParams)" ng-model="balance" placeholder="Balance">',
					footerCellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.totalCredit - grid.appScope.totalDebit}}</div>'
					},
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
				Category : $scope.inventoryConfig,
				addincome : (data) ? {
					id : data.id,
					party_id : data.party_id,
					account_id : data.account_id,
					category : data.category,
					user_id : data.user_id,
					balance : parseFloat(data.balance),
					payment_type : data.payment_type,
					date : data.date,
					credit_amount : parseFloat(data.credit_amount),
					description : data.description,
				} : {
					date : dataService.sqlDateFormate(false, "datetime"),
					modified_date : dataService.sqlDateFormate(false, "datetime"),
					type : "income",
					user_id : $rootScope.userDetails.id,
					status : 1,
					credit_amount : 0
				},
				
				getBalance : function(accountId, modalOptions) {
					//console.log(accountId, modalOptions);
					var accountParams = {
						where : {
							user_id : $rootScope.userDetails.id,
							status : 1,
							account_id : accountId
						},
						cols : ["account_id, IFNULL((sum(t0.credit_amount) - sum(t0.debit_amount)),0) as previous_balance"]
					}
					dataService.get(false,'transaction', accountParams).then(function(response) {
						console.log(response);
						modalOptions.previous_balance = response.data[0].previous_balance;
					})
					
				},
				calcBalance : function(previousBal, amount, modalOptions){
					modalOptions.addincome.balance = parseFloat(previousBal) + parseFloat(amount);
				},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$notification[response.status]("Transaction Successfull", response.message);
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
		
		$scope.openStaffpayment= function(url,data){
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				staffpaymentdate: dataService.sqlDateFormate(),
				Category : $scope.staffConfig,
				date:{date : $scope.currentDate},
				staffpayment : (data) ? {
					id : data.id,
					category : data.category,
					name : data.name,
				}:{
						date : dataService.sqlDateFormate(),
						user_id : $rootScope.userDetails.id,
						status:1,
						modified_date : dataService.sqlDateFormate()
						
						
				}, 
				getBalance : function(accountId, modalOptions) {
					//console.log(accountId, modalOptions);
					var accountParams = {
						where : {
							user_id : $rootScope.userDetails.id,
							status : 1,
							account_id : accountId
						},
						cols : ["account_id, IFNULL((sum(t0.credit_amount) - sum(t0.debit_amount)),0) as previous_balance"]
					}
					dataService.get(false,'transaction', accountParams).then(function(response) {
						console.log(response);
						modalOptions.previous_balance = response.data[0].previous_balance;
					})
					
				},
				getData:$scope.getData,	
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							
						}
					})
				},
				
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){
				
			})
		}
		
		
		$scope.transactionParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id,
				type : "staff_debit"
			},
				join : [
					{
						joinType : 'INNER JOIN',
						joinTable : "inventory_account",
						joinOn : {
							id : "t0.account_id"
						},
						cols : {account_name : "account_name", category:"transaction_category"}
					},
					{
						joinType : 'INNER JOIN',
						joinTable : "inventory_staff",
						joinOn : {
							id : "t0.reference_id"
						},
						cols : {name: "name",surname:"surname"}
					}
				],
			cols : ["*"]
		}
		$scope.setTransactionDate = function(transfer){
			$scope.transactionParams.whereRaw = ["t0.date BETWEEN '"+dataService.sqlDateFormate(transfer.fromDate)+"' AND '" + dataService.sqlDateFormate(transfer.toDate)
			+"'"];
			console.log($scope.transactionParams);
			$scope.getData(false, $scope.currentPage, "transaction", "transactionList", $scope.transactionParams);
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
		
		$scope.calcDuration = function(type, duration){
			console.log(type, duration);
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
			var setDate={ "fromDate" : startDt,"toDate" : endtDt}
			$scope.setTransactionDate(setDate);
			
		}
		
		
		
		
	 };
	// Inject controller's dependencies
	pettycashController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('pettycashController', pettycashController);
});
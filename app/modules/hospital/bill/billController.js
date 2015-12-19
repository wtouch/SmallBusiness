'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService', 'uiGridConstants'];
    
   var billController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService, uiGridConstants) {
		$rootScope.metaTitle = "inventory";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.alerts = [];
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");
		$rootScope.serverApiV2 = true;
		$rootScope.module = "inventory";
		
		$scope.printDiv = function(divName) {
			var printContents = document.getElementById(divName).innerHTML;
			var popupWin = window.open('', '_blank', 'width=1000,height=620');
			popupWin.document.open()
			popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/bootstrap.min.css" /><link rel="stylesheet" type="text/css" href="css/style.css" /></head><body onload="window.print()">' + printContents + '</html>');
			popupWin.document.close();
		}
		
		$rootScope.moduleMenus = [
			{
				name : "Add Bill",
				path : "#/dashboard/inventory/bill",
				SubTitle :" Purchase Bill",
				events : {
					click : function(){
						return $scope.openModal("modules/inventory/bill/addbill.html");
					}
				}
			}
		]
		var rowtpl='<div><div style="{\'background-color\': getBkgColorTable(myData[row.rowIndex].count)}" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';
		
		$scope.billData = {
			enableSorting: true,
			enableFiltering: true,
			rowTemplate:rowtpl,
			columnDefs: [
				{ name:'SrNo', width:50,
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false, enableFiltering: false,
					
				},
				
				{ name:'bill_id', width:70,enableSorting: false, enableFiltering: true,
					filterHeaderTemplate: '<input id="bill_id" class="form-control" ng-change="grid.appScope.filter(\'bill_id\', bill_id, \'bill\', \'billData\',true,grid.appScope.billParams)" ng-model="bill_id" placeholder="Bill No">',
				},
				{
					name:'name',width :110,enableSorting: false,enableFiltering: true,
					filterHeaderTemplate: '<select id="name" class="form-control" ng-change="grid.appScope.filter(\'party_id\', party_id, \'bill\', \'billData\',true, grid.appScope.billParams)" ng-model="party_id" ng-options="item.id as item.name for item in grid.appScope.partyList">' 
							+'<option value="">Select Party</option>'
						+'</select>',
				}, 
			
				{ name:'bill_date',width :110,
					filterHeaderTemplate: '<input id="bill_date" class="form-control" ng-change="grid.appScope.filter(\'bill_date\', bill_date, \'bill\', \'billData\',true,grid.appScope.billParams)" ng-model="bill_date" placeholder="Bill Date">',
				},
				{ name:'payment_status',width:110,
				     filterHeaderTemplate: '<select id="payment_status" class="form-control" ng-change="grid.appScope.filter(\'payment_status\', payment_status, \'bill\', \'billData\',true,grid.appScope.billParams)" ng-model="payment_status" placeholder="search">'
					+'<option value="" selected>payment status</option>'
							+'<option value="1">Paid</option>'
							+'<option value="0">Unpaid</option>'
							+'<option value="2">Partial Paid</option>'
						+'</select>',
					cellTemplate : '<span ng-if="row.entity.payment_status==1">Paid</span><span ng-if="row.entity.payment_status==0">Unpaid</span><span ng-if="row.entity.payment_status==2">Partial Paid</span>',
				},
				{ name:'total_amount',width:110,enableSorting: false,enableFiltering: false,
					filterHeaderTemplate: '<input id="total_amount" class="form-control" ng-change="grid.appScope.filter(\'total_amount\', total_amount, \'bill\', \'billData\',true,grid.appScope.billParams)" ng-model="total_amount" placeholder="Search">',
					cellTemplate : "<span>{{row.entity.total_amount}}</span>",
					filter:{
					placeholder: 'Total amount'
					
					}
				},
				{ name:'paid_amount',width:90,enableSorting: false,enableFiltering: false,
				},
				{ name:'due_amount',width:100,enableSorting: false,enableFiltering: false,
				},
				{
					name:'manage',width:200,enableSorting: false,enableFiltering: true,
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'bill\', \'billData\',false,grid.appScope.billParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>',
					
					
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/inventory/bill/addbill.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit bill Information"> <span class="glyphicon glyphicon-pencil"></span></a>'
					
					+ '<a type="button" tooltip="Delete stock" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'bill\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+
					'<a ng-disabled="row.entity.due_amount <= 0" ng-click="grid.appScope.openPaybill(\'modules/inventory/bill/payBill.html\',row.entity)" class="btn btn-info btn-sm" type="button" tooltip-animation="true" tooltip="pay bill Information"> <span class="glyphicon glyphicon-usd"></span></a>'
							+
					'<a ng-disabled="row.entity.due_amount <= 0" ng-click="grid.appScope.openViewbill(\'modules/inventory/bill/viewbill.html\',row.entity)" class="btn btn-info btn-sm" type="button" tooltip-animation="true" tooltip="view bill Information"> <span class="glyphicon glyphicon-eye-open"></span></a>'
							+
					'<a ng-click="grid.appScope.openViewreceipt(\'modules/inventory/bill/viewreceipt.html\',row.entity)" class="btn btn-warning btn-sm" type="button" tooltip-animation="true" tooltip="view Receipt Information"> <span class="glyphicon glyphicon-eye-open"></span></a>'
					
				}
			],
			onRegisterApi: function( gridApi ) {
			  $scope.gridApi = gridApi;
				$scope.gridApi.core.on.filterChanged( $scope, function() {
					
				})
			}
		};
		
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "bill", "billData", $scope.billParams);
			}
		}
		
		$scope.verticalSum = function(inputArray, column, subobj, modalOptions){
			if(modalOptions){
				modalOptions[subobj] = 0;
				angular.forEach(inputArray, function(value, key){
					modalOptions[subobj] += parseFloat(value[column]);
				})
				return modalOptions[subobj];
			}else{
				$scope[subobj] = 0;
				angular.forEach(inputArray, function(value, key){
					$scope[subobj] += parseFloat(value[column]);
				})
				return $scope[subobj];
			}
			
			
		}
		$scope.$watch(function(){ return $scope.billData.data},function(newValue){
			if(angular.isArray(newValue)){
				if(newValue.length >= 1){
					$scope.verticalSum($scope.billData.data, 'particular[0].amount', 'totalAmount');
				}
			}
		})
		$scope.getBalance = function(accountId, modalOptions) {
			var accountParams = {
				where : {
					user_id : $rootScope.userDetails.id,
					status : 1,
					account_id : accountId
				},
				cols : ["account_id, IFNULL((sum(t0.credit_amount) - sum(t0.debit_amount)),0) as previous_balance"]
			}
			dataService.get(false,'transaction', accountParams).then(function(response) {
				modalOptions.previous_balance = response.data[0].previous_balance;
			})
			
		}	
		
		$scope.calcBalance = function(previousBal, amount, modalOptions){
			modalOptions.addincome.balance = parseFloat(previousBal) + parseFloat(amount);
		}
			
		$scope.openModal = function(url,data){
				var modalDefault = {
				templateUrl: url, // apply template to modal
				size : 'lg'
				};
			var modalOptions = {
				date : dataService.sqlDateFormate(),
				addBill : (data) ? {
					id : data.id,
					bill_id :data.bill_id,
					party_id : data.party_id,
					user_id : data.user_id,
					bill_date : data.bill_date,
					due_date : data.due_date,
					remark : data.remark,
					particular : data.particular,
					modified_date : dataService.sqlDateFormate(false,"datetime")
				} : {
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					due_date : $scope.setDate(dataService.sqlDateFormate(), 10, "date"),
					status : 1,
					user_id : $rootScope.userDetails.id
				},
				
				getBalance : $scope.getBalance,
				calcBalance : $scope.calcBalance,
				receiptData : (data) ?{
					name : data.name
				}:{
					
				},
				receiptParams : (data) ?{
					where : {
						reference_id : data.id,
						type : "bill_payment",
						user_id : $rootScope.userDetails.id,
						status : 1
					},
					cols : ["*"]
				}:{

				},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							// For Insert each item from particulars into Stock Table
							
							$scope.stockData = {};
							$scope.stockData.user_id = input.user_id;
							$scope.stockData.party_id = input.party_id;
							if(input.date) $scope.stockData.date = input.date;
							$scope.stockData.stockdate = input.generated_date;
							$scope.stockData.modified_date = input.modified_date;
							$scope.stockData.stock_type = 0; 
							angular.forEach(input.particular, function(value, key){
								$scope.stockData.goods_name = value.particular_name;
								$scope.stockData.quantity =  "+" + value.quantity;
								$scope.stockData.price =value.price;
								$scope.stockData.goods_type = value.goods_type;
								$scope.stockData.category = value.category;
								$rootScope.postData("stock", angular.copy($scope.stockData),function(response){
								});
							})
							
						$scope.getData(false, $scope.currentPage, 'bill','billData',$scope.billParams);
						}
					})
				},
				
				taxCalculate : function(modalOptions){
					modalOptions.singleparticular.tax = {};
					
					angular.forEach($rootScope.userDetails.config.inventory.taxData.tax, function(value, key){
						if(modalOptions.taxInfo[value.taxName]){
							modalOptions.singleparticular.tax[value.taxName] = (modalOptions.singleparticular.tax[value.taxName]) ? modalOptions.singleparticular.tax[value.taxName] + (value.taxValue * modalOptions.singleparticular.amount / 100) : (value.taxValue * modalOptions.singleparticular.amount / 100);
						}
					})
				},
				totalCalculate : function(modalOptions){
					modalOptions.addBill.subtotal = 0;
					modalOptions.addBill.total_amount = 0;
					modalOptions.addBill.tax = {};
					angular.forEach(modalOptions.addBill.particular, function(value, key){
						modalOptions.addBill.subtotal += value.amount;
						angular.forEach(value.tax,function(value, key){
							modalOptions.addBill.tax[key] = (modalOptions.addBill.tax[key]) ? modalOptions.addBill.tax[key] + value : value;
						})
						
					})
					
					var taxSubtotal = 0;
					angular.forEach(modalOptions.addBill.tax, function(value, key){
						taxSubtotal += value;
					})
					
					modalOptions.addBill.total_amount = modalOptions.addBill.subtotal + taxSubtotal;
					return modalOptions;
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'bill','billData',$scope.billParams);
						}
					})
				},
				setDate : function(date, days){
					var dueDate = $scope.setDate(date, days, "date");
					modalOptions.addBill.due_date = dueDate;
				},
				sqlDateFormat : function(date, object){
					var sqlDate = dataService.sqlDateFormate(date,"date");
					object = sqlDate;
				},
				getData: $scope.getData,
				//addToObject : $rootScope.addToObject,
				addToObject : function(object,data,modalOptions){
					$rootScope.addToObject(object,modalOptions[data]);
					modalOptions[data] = {};
				},
				
				removeObject : $rootScope.removeObject
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){
			})
		}
		
		$scope.openPaybill = function(url,data){
				var modalDefault = {
				templateUrl: url, // apply template to modal
				size : 'lg'
				};
			var modalOptions = {
				date : dataService.sqlDateFormate(),
				payBill : {
					reference_id : data.id,
					party_id : data.party_id,
					user_id : data.user_id,
					debit_amount : data.due_amount,
					date : data.bill_date,
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					status : 1,
					type : "bill_payment"
				},
				getBalance : $scope.getBalance,
				calcBalance : $scope.calcBalance,
				getPaidAmount :	$scope.getPaidAmount,
				checkPaidStatus : function(value, modalOptions){
					if((parseFloat(data.due_amount) - parseFloat(value)) == 0){
						modalOptions.payment_status = 1;
					}else{
						modalOptions.payment_status = 2;
					}
					return modalOptions.payment_status;
				},
				postData : function(table,input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							var paymentStatus = {
								payment_status : (modalOptions.payment_status) ? modalOptions.payment_status : modalOptions.checkPaidStatus(modalOptions.payBill.debit_amount, modalOptions)
							}
							$rootScope.updateData("bill", paymentStatus, data.id, function(response){
								
							})
						}
					})
				},
				
				calcBalance : function(previousBal, amount, modalOptions){
					modalOptions.payBill.balance = parseFloat(previousBal) + parseFloat(amount);
				},
				
				
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							
						}
					})
				},
				
				getData: $scope.getData,
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){
			})
		}
		
		$scope.openViewbill = function(url,data){
				var modalDefault = {
				templateUrl: url, // apply template to modal
				size : 'lg'
				};
			var modalOptions = {
				date : dataService.sqlDateFormate(),
				viewBill :data,
				printDiv : $scope.printDiv,
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){
			})
		}
		
		$scope.openViewreceipt = function(url,data){
				var modalDefault = {
				templateUrl: url, // apply template to modal
				size : 'lg'
				};
			var modalOptions = {
				date : dataService.sqlDateFormate(),
				Billdata : data,
				receiptParams : (data) ?{
					where : {
						reference_id : data.id,
						type : "bill_payment",
						user_id : $rootScope.userDetails.id,
						status : 1
					},
					join:[
						{
							joinType : 'INNER JOIN',
							joinTable : "inventory_party",
							joinOn : {
								party_id : "t0.party_id"
							},
							cols : ["*"]
						}],
					cols : ["*"]
				}:{

				},
				getData : $scope.getData,
				
				
				
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){
			})
		}
		
		
		
		
		
		$scope.setDate = function(date, days, sql){
			var curDate = new Date(date);
			var newDate = curDate.setDate(curDate.getDate() + days);
			var finalDate;
			if(sql == "date"){
				finalDate = dataService.sqlDateFormate(newDate);
			}else if(sql == "datetime"){
				finalDate = dataService.sqlDateFormate(newDate, "datetime");
			}else{
				finalDate = new Date(newDate);
			}
			return finalDate;
		}
		
		
		$scope.billParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
			},
			join : [
				{
					joinType : 'INNER JOIN',
					joinTable : "inventory_party",
					joinOn : {
						id : "t0.party_id"
					},
					cols : ["name","email","phone","address","location","area","city","state","country","pincode","department"]
				},{
					joinType : "left join",
					joinTable : "inventory_transaction",
					joinOn : {
						reference_id : "t0.id"
					},
					cols : ['debit_amount, IFNULL(sum(t2.debit_amount),0) as paid_amount']
				}
			],
			groupBy : {
				id : "id"
			},
			cols : ["*, (t0.total_amount - IFNULL(sum(t2.debit_amount),0)) as due_amount"]
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
				dataService.extendDeep($scope.params, params, response);
				$scope.getData(false ,$scope.currentPage, table, subobj, $scope.params);
			})
		}
		$scope.orderBy = function(col, value){
			if(!$scope.params.orderBy) $scope.params.orderBy = {};
			$scope.params.orderBy[col] = value;
			$scope.getData(false,$scope.currentPage, 'bill', 'billData', $scope.params);
		}
	};	
	// Inject controller's dependencies
	billController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('billController', billController);
});
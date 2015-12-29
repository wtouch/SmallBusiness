'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService', 'uiGridConstants', 'billService'];
    
   var billController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService, uiGridConstants, billService) {
		$rootScope.metaTitle = "inventory";
		$scope.maxSize = 5;
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
				events : {
					click : function(){
						return $scope.openModal("modules/inventory/bill/addbill.html");
					}
				}
			},{
				name : "Add Purchase Order",
				events : {
					click : function(){
						return $scope.openOrder("modules/inventory/bill/addpurchaseorder.html");
					}
				}
			},
			{
				name : "Purchase Order",
				path : "#/dashboard/inventory/purchaseorder",
				SubTitle :"Purchase Order"
			},
			{
				name : "Purchase Bill",
				path : "#/dashboard/inventory/bill",
				SubTitle :"Purchase Bill"
			}
		]
		var rowtpl='<div ng-class="{ \'my-css-class\': grid.appScope.rowFormatter( row ),\'text-success\':(row.entity.payment_status==1),\'text-danger\':(row.entity.payment_status==0),\'text-warning\':(row.entity.payment_status==2)}">' +
                 '  <div ng-if="row.entity.merge">{{row.entity.title}}</div>' +
                 '  <div ng-if="!row.entity.merge" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                 '</div>';
		
		$scope.billData = {
			enableSorting: true,
			enableFiltering: true,
			rowTemplate:rowtpl,
			columnDefs: [
				{ name:'SrNo', width:50,
					enableSorting: false, enableFiltering: false,
					cellTemplate : "<div class=\'ui-grid-cell-contents ng-binding ng-scope\'>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</div>",	
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
				cellTemplate :'<span>{{row.entity.due_amount}}</span>'
				},
				{
					name:'manage',width:200,enableSorting: false,enableFiltering: true,
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'bill\', \'billData\',false,grid.appScope.billParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>',
					
					
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/inventory/bill/addbill.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit Bill"> <span class="glyphicon glyphicon-pencil"></span></a>'
					
					+ '<a type="button" tooltip="Delete Bill" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'bill\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+
					'<a ng-disabled="row.entity.due_amount <= 0" ng-click="grid.appScope.openPaybill(\'modules/inventory/bill/payBill.html\',row.entity)" class="btn btn-info btn-sm" type="button" tooltip-animation="true" tooltip="Pay Bill"> <span class="glyphicon glyphicon-usd"></span></a>'
							+
					'<a ng-disabled="row.entity.due_amount <= 0" ng-click="grid.appScope.openViewbill(\'modules/inventory/bill/viewbill.html\',row.entity)" class="btn btn-info btn-sm" type="button" tooltip-animation="true" tooltip="View Bill"><span class="glyphicon glyphicon-eye-open"></span></a>'
					+
					'<a ng-click="grid.appScope.openViewreceipt(\'modules/inventory/bill/viewreceipt.html\',row.entity)" class="btn btn-warning btn-sm" type="button" tooltip-animation="true" tooltip="View Receipt"> <span class="glyphicon glyphicon-eye-open"></span></a>'
					
				}
			],
			onRegisterApi: function( gridApi ) {
			  $scope.gridApi = gridApi;
				$scope.gridApi.core.on.filterChanged( $scope, function() {
					
				})
			}
		};
		
		//Grid For Purcahse Order	
		$scope.PurchaseOrderData = {
			enableSorting: true,
			enableFiltering: true,
			rowTemplate:rowtpl,
			columnDefs: [
				{ name:'SrNo', width:50,
					enableSorting: false, enableFiltering: false,
					cellTemplate : "<div class=\'ui-grid-cell-contents ng-binding ng-scope\'>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</div>",
					
				},
				{
					name:'name',width :200,enableSorting: false,enableFiltering: true,
					filterHeaderTemplate: '<select id="party_id" class="form-control" ng-change="grid.appScope.filter(\'party_id\', party_id, \'purchase_order\', \'PurchaseOrderData\',false, grid.appScope.purchaseorderParams)" ng-model="party_id" ng-options="item.id as item.name for item in grid.appScope.partyList">' 
							+'<option value="">Select Party</option>'
						+'</select>',
				}, 
				
				{ name:'purchase_order_date',width :200,
					filterHeaderTemplate: '<input id="purchase_order_date" class="form-control" ng-change="grid.appScope.filter(\'purchase_order_date\', purchase_order_date, \'purchase_order\', \'PurchaseOrderData\',true,grid.appScope.purchaseorderParams)" ng-model="purchase_order_date" placeholder="Purchase Order Date">',
				},
				
				{
					name:'manage',width:250,enableSorting: false,enableFiltering: true,
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'purchase_order\', \'PurchaseOrderData\',false,grid.appScope.purchaseorderParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>',
					
					
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/inventory/bill/addbill.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit"> <span class="glyphicon glyphicon-pencil"></span></a>'
					
					+ '<a type="button" tooltip="Delete Order" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'purchase_order\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange1)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+		
					'<a ng-click="grid.appScope.openViewOrder(\'modules/inventory/bill/vieworder.html\',row.entity)" class="btn btn-warning btn-sm" type="button" tooltip-animation="true" tooltip="View Order"> <span class="glyphicon glyphicon-eye-open"></span></a>'
					+
					'<a ng-click="grid.appScope.openModal(\'modules/inventory/bill/generateBill.html\',row.entity)" class="btn btn-success btn-sm" type="button" tooltip-animation="true" tooltip="Generate Bill"> <span class="glyphicon glyphicon-ok"></span></a>'
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
		$scope.callbackColChange1 = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "purchase_order", "PurchaseOrderData", $scope.purchaseorderParams);
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
					due_amount : data.due_amount,
					total_amount : data.total_amount,
					remark : data.remark,
					particular : data.particular,
					modified_date : dataService.sqlDateFormate(false,"datetime")
				} : {
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					due_date : $scope.setDate(dataService.sqlDateFormate(), 10, "date"),
					user_id : $rootScope.userDetails.id
				},
				//for generate Invoice
				generateBill : (data) ? {
					//id : data.id,
					bill_id :data.bill_id,
					party_id : data.party_id,
					user_id : data.user_id,
					bill_date : data.bill_date,
					due_date : data.due_date,
					due_amount : data.due_amount,
					total_amount : data.total_amount,
					remark : data.remark,
					particular : data.particular,
					modified_date : dataService.sqlDateFormate(false,"datetime")
				} : {
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					due_date : $scope.setDate(dataService.sqlDateFormate(), 10, "date"),
					user_id : $rootScope.userDetails.id
				},
				
				getBalance : $scope.getBalance,
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
								$scope.stockData.goods_name = value.goods_name;
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
				
				getTypeaheadData : function(table, searchColumn, searchValue){
					//console.log(table, searchColumn, searchValue);
					var locationParams = {
						search : {},
						cols : ["*"]
					};
					locationParams.search[searchColumn] = searchValue;
					console.log(locationParams);
					return dataService.get(false, 'stock_items', locationParams).then(function(response){
						console.log(response);
						if(response.status == 'success'){
							return response.data;
						}else{
							return [];
						}
					}); 
				},
				assignData : function(object, formObject){
					formObject.goods_name = object.goods_name;
					formObject.goods_type = object.goods_type;
					formObject.price = object.price;
					formObject.quantity = 1;
					formObject.amount = object.price*formObject.quantity;
					formObject.category = object.category;
					console.log(object);
				},
				
				taxCalculate : billService.taxCalc,
				totalCalculate : billService.totalCalculate,
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
					modalOptions.taxInfo = {}
				},
				
				removeObject : $rootScope.removeObject
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){
			})
		}
		
		
		//Modal for Order
		$scope.openOrder = function(url,data){
				var modalDefault = {
				templateUrl: url, // apply template to modal
				size : 'lg'
				};
			var modalOptions = {
				date : dataService.sqlDateFormate(),
				addOrder : (data) ? {
					id : data.id,
					purchase_order_id :data.purchase_order_id,
					party_id : data.party_id,
					user_id : data.user_id,
					purchase_order_date : data.purchase_order_date,
					due_date : data.due_date,
					due_amount : data.due_amount,
					total_amount : data.total_amount,
					remark : data.remark,
					particular : data.particular,
					modified_date : dataService.sqlDateFormate(false,"datetime")
				} : {
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					user_id : $rootScope.userDetails.id
				},
				//for generate Order
				generateBill : (data) ? {
					//id : data.id,
					purchase_order_id :data.purchase_order_id,
					party_id : data.party_id,
					user_id : data.user_id,
					purchase_order_date : data.purchase_order_date,
					due_date : data.due_date,
					due_amount : data.due_amount,
					total_amount : data.total_amount,
					remark : data.remark,
					particular : data.particular,
					modified_date : dataService.sqlDateFormate(false,"datetime")
				} : {
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					due_date : $scope.setDate(dataService.sqlDateFormate(), 10, "date"),
					user_id : $rootScope.userDetails.id
				},
				
				getBalance : $scope.getBalance,
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
						$scope.getData(false, $scope.currentPage, 'purchase_order','PurchaseOrderData',$scope.billParams);
						}
					})
				},
				
				getTypeaheadData : function(table, searchColumn, searchValue){
					//console.log(table, searchColumn, searchValue);
					var locationParams = {
						search : {},
						cols : ["*"]
					};
					locationParams.search[searchColumn] = searchValue;
					console.log(locationParams);
					return dataService.get(false, 'stock_items', locationParams).then(function(response){
						console.log(response);
						if(response.status == 'success'){
							return response.data;
						}else{
							return [];
						}
					}); 
				},
				assignData : function(object, formObject){
					formObject.goods_name = object.goods_name;
					formObject.goods_type = object.goods_type;
					formObject.price = object.price;
					formObject.quantity = 1;
					formObject.amount = object.price*formObject.quantity;
					formObject.category = object.category;
					console.log(object);
				},
				
				taxCalculate : billService.taxCalc,
				totalCalculate : billService.totalCalculate,
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
					modalOptions.taxInfo = {}
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
				due_amount : (data.due_amount) ? data.due_amount : 0,
				payBill : {
					reference_id : data.id,
					party_id : data.party_id,
					user_id : data.user_id,
					debit_amount : data.due_amount,
					date : data.bill_date,
					description : {
						total_amount : data.total_amount,
						previous_payment : (data.paid_amount) ? data.paid_amount : 0
					},
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					status : 1,
					type : "bill_payment"
				},
				calcDueAmount : function(modalOptions){
					modalOptions.payBill.description.due_amount = data.due_amount - modalOptions.payBill.debit_amount;
				},
				getBalance : $scope.getBalance,
				calcBalance: function(previousBal, amount, modalOptions){
				modalOptions.payBill.balance = parseFloat(previousBal) - parseFloat(amount)},
				getPaidAmount :	$scope.getPaidAmount,
				getDueAmount : function(modalOptions)
				{
					console.log(modalOptions);
					modalOptions.payBill.amount_description.due_amount = modalOptions.payBill.due_amount-modalOptions.payBill.debit_amount;
					modalOptions.payBill.amount_description.total_amount = modalOptions.payBill.total_amount;
				},
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
								$scope.getData(false,$scope.currentPage, 'bill', 'billData', $scope.billParams);
								
							})
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false,$scope.currentPage, 'bill', 'billData', $scope.billParams);
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
		$scope.openViewOrder = function(url,data){
				var modalDefault = {
				templateUrl: url, // apply template to modal
				size : 'lg'
				};
			var modalOptions = {
				date : dataService.sqlDateFormate(),
				viewOrder :data,
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
							cols : ['name, email, phone, address, location, area, city, state, country, pincode,department']
						}],
					cols : ["*"]
				}:{

				},
				getData : $scope.getData,
				printDiv : $scope.printDiv,
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
					cols : ['name, email, phone, address, location, area, city, state, country, pincode,department']
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
		
        //Params For Purchase order
		$scope.purchaseorderParams = {
			where : {
				user_id : $rootScope.userDetails.id,
				status : 1,
			},
			join : [
				{
					joinType : 'INNER JOIN',
					joinTable : "inventory_party",
					joinOn : {
						id : "t0.party_id"
					},
					cols : {name : "name"}
				}
			],
			cols : ['*']
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
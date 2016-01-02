'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants', 'invoiceService'];
    
    // This is controller for this view
	var invoiceController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants,invoiceService) {
		$rootScope.serverApiV2 = true;
		$rootScope.module = "inventory";
		$scope.invoice=true;
		
		// Global Data Objects
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.currentPage = 1;
		$scope.pageItems = 10;		
		$scope.currentDate = dataService.currentDate;
		
		$scope.printDiv = function(divName) {
			var printContents = document.getElementById(divName).innerHTML;
			var popupWin = window.open('', '_blank', 'width=1000,height=620');
			popupWin.document.open()
			popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/bootstrap.min.css" /><link rel="stylesheet" type="text/css" href="css/style.css" /></head><body onload="window.print()">' + printContents + '</html>');
			popupWin.document.close();
		}
		$rootScope.moduleMenus = [
			{
				name : "Add Invoice",
				events : {
					click : function(){
						return $scope.openModal("modules/inventory/invoice/addinvoice.html");
					}
				}
			},
			{
				name : "Add Quotation",
				events : {
					click : function(){
						return $scope.openModalQuotation("modules/inventory/invoice/addquotation.html");
					}
				}
			},
			{
				name : "Quotations",
				path : "#/dashboard/inventory/quotation",
				SubTitle :"Quotations"
			},
			{
				name : "Invoices",
				path : "#/dashboard/inventory/invoice",
				SubTitle :"Invoices"
			}
			                                                         
		]
		
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
		
		var rowtpl='<div ng-class="{ \'my-css-class\': grid.appScope.rowFormatter( row ),\'text-success\':(row.entity.payment_status==1),\'text-danger\':(row.entity.payment_status==0),\'text-warning\':(row.entity.payment_status==2)}">' +
                 '  <div ng-if="row.entity.merge">{{row.entity.title}}</div>' +
                 '  <div ng-if="!row.entity.merge" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                 '</div>';
		$scope.invoiceList = {
			enableSorting: true,
			enableFiltering: true,
			rowTemplate:rowtpl,
			columnDefs: [
				{ name:'SrNo',width:50, enableSorting: false,enableFiltering: false, 
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",
				},
				{ name:'invoice_id', width:70,enableSorting: false, enableFiltering: true,
					filterHeaderTemplate: '<input id="invoice_id" class="form-control" ng-change="grid.appScope.filter(\'invoice_id\', invoice_id, \'invoice\', \'invoiceList\',true,grid.appScope.invoiceParams)" ng-model="invoice_id" placeholder="Invoice No">',
				},
				{ name:'name',enableSorting: false ,
				width:110,
				filterHeaderTemplate: '<select id="name" class="form-control" ng-change="grid.appScope.filter(\'party_id\', party_id, \'invoice\', \'invoiceList\',true, grid.appScope.invoiceParams)" ng-model="party_id" ng-options="item.id as item.name for item in grid.appScope.partyList">' 
							+'<option value="">Select Party</option>'
						+'</select>',
				cellTemplate : '<span>{{row.entity.name}}</span>',
					},
				{ 
					name:'generated_date',
					width:110, 
					enableSorting: false,
					filterHeaderTemplate: '<input id="generated_date" class="form-control" ng-change="grid.appScope.filter(\'generated_date\', generated_date, \'invoice\', \'invoiceList\',true, grid.appScope.invoiceParams)" ng-model="generated_date" placeholder="Date">',
				},
				
				{ name:'payment_status',width:110,
				     filterHeaderTemplate: '<select id="payment_status" class="form-control" ng-change="grid.appScope.filter(\'payment_status\', payment_status, \'bill\', \'billData\',true,grid.appScope.invoiceParams)" ng-model="payment_status" placeholder="search">'
					+'<option value="" selected>payment status</option>'
							+'<option value="1">Paid</option>'
							+'<option value="0">Unpaid</option>'
							+'<option value="2">Partial Paid</option>'
						+'</select>',
					cellTemplate : '<span ng-if="row.entity.payment_status==1">Paid</span><span ng-if="row.entity.payment_status==0">Unpaid</span><span ng-if="row.entity.payment_status==2">Partial Paid</span>',
				},
				
				{ 
					name:'due_date', 
					width:150, 
					enableSorting: false,
					filterHeaderTemplate: '<input id="due_date" class="form-control" ng-change="grid.appScope.filter(\'due_date\', due_date, \'invoice\', \'invoiceList\',true, grid.appScope.invoiceParams)" ng-model="due_date" placeholder="Date">',
				},
				{ 
					name:'total_amount',width:80,
					enableSorting: false ,
					enableFiltering: false, 
					cellTemplate : "<span>{{row.entity.total_amount}}</span>"
								
				},
				{ name:'paid_amount',width:90,enableSorting: false,enableFiltering: false,
				},
				{ name:'due_amount',width:100,enableSorting: false,enableFiltering: false,
				},
				
				{
					name:'Manage', 
					enableSorting: false, 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'invoice\', \'invoiceList\',false,grid.appScope.invoiceParams)" ng-model="status">'
							+'<option value="" selected>Status</option>'
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					  options: [ { value: '1', label: 'Active' }, { value: '0', label: 'Delete' }]
					} ,
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/inventory/invoice/addinvoice.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit Invoice"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete Invoice" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'invoice\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+'<a ng-disabled="row.entity.due_amount <= 0" ng-click="grid.appScope.openPayInvoice(\'modules/inventory/invoice/payInvoice.html\',row.entity)" class="btn btn-info btn-sm" type="button" tooltip-animation="true" tooltip="Pay Invoice"> <span class="glyphicon glyphicon-usd"></span></a>'
					+'<a ng-click="grid.appScope.openModal(\'modules/inventory/invoice/viewinvoice.html\',row.entity)" class="btn btn-info btn-sm" type="button" tooltip-animation="true" tooltip="View Invoice"> <span class="glyphicon glyphicon-eye-open"></span></a>'
					+'<a ng-click="grid.appScope.openViewreceipt(\'modules/inventory/invoice/viewReceipt.html\',row.entity)"  class="btn btn-warning btn-sm" type="button" tooltip-animation="true" tooltip="View Receipt"><span class="glyphicon glyphicon-eye-open"></span></a>'
					
				}
			],
			onRegisterApi: function( gridApi ) {
			  $scope.gridApi = gridApi;
				$scope.gridApi.core.on.filterChanged( $scope, function() {
					
				})
			}
		};
		
//Quotation Grid....		
		$scope.quotationList = {
			enableSorting: true,
			enableFiltering: true,
			rowTemplate:rowtpl,
			columnDefs: [
				{ name:'SrNo',width:110, enableSorting: false,enableFiltering: false, 
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",
				},
				{ name:'quotation_id', width:110,enableSorting: false, enableFiltering: true,
					filterHeaderTemplate: '<input id="quotation_id" class="form-control" ng-change="grid.appScope.filter(\'quotation_id\', quotation_id, \'quotation\', \'quotationList\',true,grid.appScope.invoiceParams)" ng-model="quotation_id" placeholder="Quotation">',
				},
				{ name:'name',enableSorting: false ,
				width:150,
				filterHeaderTemplate: '<select id="name" class="form-control" ng-change="grid.appScope.filter(\'party_id\', party_id, \'quotation\', \'quotationList\',true, grid.appScope.quotationParams)" ng-model="party_id" ng-options="item.id as item.name for item in grid.appScope.partyList">' 
							+'<option value="">Select Party</option>'
						+'</select>',
				cellTemplate : '<span>{{row.entity.name}}</span>',
					},
				{ 
					name:'generated_date',
					width:110, 
					enableSorting: false,
					filterHeaderTemplate: '<input id="generated_date" class="form-control" ng-change="grid.appScope.filter(\'generated_date\', generated_date, \'quotation\', \'quotationList\',true, grid.appScope.quotationParams)" ng-model="generated_date" placeholder="Date">',
				},
				{ 
					name:'total_amount',width:110,
					enableSorting: false ,
					enableFiltering: false, 
					cellTemplate : "<span>{{row.entity.total_amount}}</span>"
								
				},
				{
					name:'Manage', 
					enableSorting: false, 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'quotation\', \'quotationList\',false, grid.appScope.quotationParams)" ng-model="status">'
							+'<option value="" selected>Status</option>'
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					  options: [ { value: '1', label: 'Active' }, { value: '0', label: 'Delete' }]
					} ,
					cellTemplate : '<a ng-click="grid.appScope.openModalQuotation(\'modules/inventory/invoice/addquotation.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit Quotation"> <span class="glyphicon glyphicon-pencil"></span></a>'+
					'<a ng-click="grid.appScope.openModal(\'modules/inventory/invoice/generateinvoice.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Generate Invoice">Genarate Invoice </a>'
					+ '<a type="button" tooltip="Delete Quotation" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'quotation\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange1)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					
				}
			],
			onRegisterApi: function( gridApi ) {
			  $scope.gridApi = gridApi;
				$scope.gridApi.core.on.filterChanged( $scope, function() {
					
				})
			}
		};
		
		$scope.callbackColChange = function(response){
			//console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "invoice", "invoiceList", $scope.invoiceParams);
			}
		}
		$scope.callbackColChange1 = function(response){
			//console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "quotation", "quotationList", $scope.quotationParams);
			}
		}
		
		$scope.verticalSum = function(inputArray, column, subobj){
			 /*  if(!$scope[subobj])    */
				 $scope[subobj] = 0;
			angular.forEach(inputArray, function(value, key){
				$scope[subobj] += parseFloat(value[column]);
			})
			return $scope[subobj];
		};
		$scope.$watch(function(){ return $scope.invoiceList.data},function(newValue){
			if(angular.isArray(newValue)){
				if(newValue.length >= 1){
					$scope.verticalSum($scope.invoiceList.data, 'particulars[0].amount', 'totalAmount');
					//$scope.verticalSum($scope.transactionList.data, 'debit_amount', 'totalDebit');
				}
			}
		})
		
		$scope.openModal = function(url , data){
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			
			var modalOptions = {
					date : $scope.currentDate,
					invoiceData : (data)?{
						id : data.id
					}:{},
					addinvoice : (data) ? {
						id : data.id,
						invoice_id : data.invoice_id,
						user_id : data.user_id,
						party_id :data.party_id,
						generated_date : data.generated_date,
						modified_date : dataService.sqlDateFormate(false,"datetime"),
						particulars:data.particulars,
						tax : data.tax,
						remark : data.remark,
						subtotal : data.subtotal,
						total_amount : data.total_amount,
						due_date : $scope.setDate(dataService.sqlDateFormate(), 10, "date")
					} : {
						user_id : $rootScope.userDetails.user_id,
						date : dataService.sqlDateFormate(false,"datetime"),
						modified_date : dataService.sqlDateFormate(false,"datetime"),
						due_date : $scope.setDate(dataService.sqlDateFormate(), 10, "date"),
					},
					genarateinvoice : (data) ? {
						invoice_id : data.invoice_id,
						user_id : data.user_id,
						party_id :data.party_id,
						generated_date : data.generated_date,
						modified_date : dataService.sqlDateFormate(false,"datetime"),
						particulars:data.particulars,
						remark : data.remark,
						total_amount : data.total_amount,
						due_date : $scope.setDate(dataService.sqlDateFormate(), 10, "date")
					} : {
						user_id : $rootScope.userDetails.user_id,
						date : dataService.sqlDateFormate(false,"datetime"),
						modified_date : dataService.sqlDateFormate(false,"datetime"),
						due_date : $scope.setDate(dataService.sqlDateFormate(), 10, "date"),
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
							
							angular.forEach(input.particulars, function(value, key){
								$scope.stockData.goods_name = value.particular_name;
								$scope.stockData.quantity =  "-" + value.quantity;
								$scope.stockData.price =value.price;
								$scope.stockData.goods_type = value.goods_type;
								$scope.stockData.category = value.category;
								//console.log($scope.stockData);
								$rootScope.postData("stock", angular.copy($scope.stockData),function(response){
								});
							})
						$scope.getData(false, $scope.currentPage, 'invoice','invoiceList',$scope.invoiceParams);
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
					formObject.category = object.category;
					formObject.quantity = 1;
					formObject.amount = object.price*formObject.quantity;
					console.log(object);
				},
				printDiv : $scope.printDiv,
				taxCalculate : invoiceService.taxCalc,
				totalCalculate : invoiceService.totalCalculate,
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'invoice','invoiceList',$scope.invoiceParams);
						}
					})
					
				},
				getData : $scope.getData,
					addToObject : function(object,data,modalOptions){
					$rootScope.addToObject(object,modalOptions[data]);
					modalOptions[data] = {};
					modalOptions.taxInfo = {}
				},
					removeObject : $rootScope.removeObject,
				};
			
			modalService.showModal(modalDefault, modalOptions).then(function(){
				$scope.getData(false, $scope.currentPage, 'invoice','invoiceList',$scope.invoiceParams);;
			})
		}
		
//modal for Quotation Generation
		$scope.openModalQuotation = function(url , data){
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			
			var modalOptions = {
					date : $scope.currentDate,
					addquotation : (data) ? {
						id : data.id,
						quotation_id : data.quotation_id,
						user_id : data.user_id,
						party_id :data.party_id,
						generated_date : data.generated_date,
						modified_date : dataService.sqlDateFormate(false,"datetime"),
						particulars:data.particulars,
						remark : data.remark,
						total_amount : data.total_amount,
						due_date : data.due_date
					} : {
						date : dataService.sqlDateFormate(false,"datetime"),
						modified_date : dataService.sqlDateFormate(false,"datetime"),
						due_date : $scope.setDate(dataService.sqlDateFormate(), 10, "date"),
						user_id : $rootScope.userDetails.user_id
					},
				postData : function(table, input){
					console.log(table, input);
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
						$scope.getData(false, $scope.currentPage, 'quotation','quotationList',$scope.quotationParams);
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
					formObject.category = object.category;
					formObject.amount = object.price*formObject.quantity;
					console.log(object);
				},
				printDiv : $scope.printDiv,
				taxCalculate : invoiceService.taxCalc,
				totalCalculate : invoiceService.totalCalculate,
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'quotation','quotationList',$scope.quotationParams);
						}
					})
					
				},
				getData : $scope.getData,
					addToObject : function(object,data,modalOptions){
					$rootScope.addToObject(object,modalOptions[data]);
					modalOptions[data] = {};
					modalOptions.taxInfo = {}
				},
					removeObject : $rootScope.removeObject,
				};
			
			modalService.showModal(modalDefault, modalOptions).then(function(){
				$scope.getData(false, $scope.currentPage, 'invoice','invoiceList',$scope.invoiceParams);;
			})
		}
		
		$scope.openPayInvoice = function(url,data){
				var modalDefault = {
				templateUrl: url, // apply template to modal
				size : 'lg'
				};
			var modalOptions = {
				date : dataService.sqlDateFormate(),
				payInvoice : (data) ? {
					reference_id : data.id,
					party_id : data.party_id,
					user_id : data.user_id,
					credit_amount : data.due_amount,
					description : {
						total_amount : data.total_amount,
						previous_payment : (data.paid_amount) ? data.paid_amount : 0
					},
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					date : dataService.sqlDateFormate(false,"datetime"),
					status : 1,
					type : "invoice_payment",
				} : {
				},
				calcDueAmount : function(modalOptions){
					modalOptions.payInvoice.description.due_amount = data.due_amount - modalOptions.payInvoice.credit_amount;
				},
				getBalance : $scope.getBalance,
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
								payment_status : (modalOptions.payment_status) ? modalOptions.payment_status : modalOptions.checkPaidStatus(modalOptions.payInvoice.credit_amount, modalOptions)
							}
							$rootScope.updateData("invoice", paymentStatus, data.id, function(response){
								$scope.getData(false, $scope.currentPage, 'invoice','invoiceList',$scope.invoiceParams);
							})
						}
					})
				},
				
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'invoice','invoiceList',$scope.invoiceParams);
						}
					})
				},
				
				calcBalance : function(previousBal, amount, modalOptions){
					modalOptions.payInvoice.balance = parseFloat(previousBal) + parseFloat(amount);
				},
				
				
				getData: $scope.getData,
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){
			})
		}
		
		$scope.invoiceParams = {
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
					cols : {name : "name"}
				},{
					joinType : "left join",
					joinTable : "inventory_transaction",
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
		
		$scope.quotationParams = {
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
		
		$scope.partyParams = {
			where : {
				user_id : $rootScope.userDetails.id,
				status : 1,
				type :"client"
			},
			cols : ["*"]
		}
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
						type : "invoice_payment",
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
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){
			})
		}
		
		// For Get (Select Data from DB)
		/*get data */
		 $scope.getData = function(single, page, table, subobj, params, modalOptions) {
			$scope.params = (params) ? params : {
				where : {
					status : 1,
					user_id : $rootScope.userDetails.id,
					//type : ($routeParams.party == "vendor") ? "vendor" : "client"
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
		$scope.orderBy = function(col, value, table, subobj){
			if(!$scope.params.orderBy) $scope.params.orderBy = {};
			$scope.params.orderBy[col] = value;
			$scope.getData($scope.currentPage, table, subobj, $scope.params);
		}
		
	};
		
	// Inject controller's dependencies
	invoiceController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('invoiceController', invoiceController);
});
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants'];
    
    // This is controller for this view
	var invoiceController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		$rootScope.serverApiV2 = true;
		$rootScope.module = "inventory";
		$scope.invoice=true;
		
		// Global Data Objects
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.currentDate = dataService.currentDate;
		$scope.invoiceList = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{ name:'SrNo',width:50, enableSorting: false,enableFiltering: false, 
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",
				},
				{ name:'invoice_id',  width:150, enableSorting: false ,displayName: "Invoice No",
				filterHeaderTemplate: '<input id="id" class="form-control" ng-change="grid.appScope.filter(\'invoice_id\', invoice_id, \'invoice\', \'invoiceList\',true)" ng-model="invoice_id" placeholder="Invoice No">',
				},
				 {
					name:'Party Name', width:150,
					filterHeaderTemplate: '<select class="form-control" ng-change="grid.appScope.filter(\'name\', partyFilter, \'party\', \'partyList\')" ng-model="partyFilter" ng-options="item.id as item.name for item in grid.appScope.partyList">'
							+'<option value="" selected>Party Name</option>'
						+'</select>',
					filter: {
					  placeholder: 'Party Name'
					}
				}, 
				
				{ name:'generated_date',width:150, enableSorting: false,
				filterHeaderTemplate: '<input id="generated_date" class="form-control" ng-change="grid.appScope.filter(\'generated_date\', generated_date, \'invoice\', \'invoiceList\',true)" ng-model="generated_date" placeholder="Date">',
				},
				{ name:'due_date', width:150, enableSorting: false,
				filterHeaderTemplate: '<input id="due_date" class="form-control" ng-change="grid.appScope.filter(\'due_date\', due_date, \'invoice\', \'invoiceList\',true)" ng-model="due_date" placeholder="Date">',
					},
				{ 
					name:'amount',width:80,
					enableSorting: false ,
					enableFiltering: false, 
					cellTemplate : "<span>{{row.entity.particulars[0].amount}}</span>"
								
					},
				{
					name:'price',width:80,
					enableSorting: false ,
					enableFiltering: false, 
					cellTemplate : "<span>{{row.entity.particulars[0].price}}</span>"
					},
				{
					name:'Manage', 
					enableSorting: false, 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'invoice\', \'invoiceList\')" ng-model="status">'
							+'<option value="" selected>Status</option>'
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					 
					  options: [ { value: '1', label: 'Active' }, { value: '0', label: 'Delete' }]
					} ,
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/inventory/invoice/addinvoice.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit Account Information"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete Account" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'invoice\', \'status\',row.entity.status, row.entity.id)" btn-checkbox="" btn-checkbox-true="1" btn-checkbox-false="0" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+'<a ng-click="grid.appScope.openModal(\'modules/inventory/invoice/payInvoice.html\')" class="btn btn-info btn-sm" type="button" tooltip-animation="true" tooltip="Pay Invoice Information"> <span class="glyphicon glyphicon-usd"></span></a>'
					+'<a ng-click="openGenerateinvoice(\'modules/accounting/invoice/viewinvoice.html\',x)" class="btn btn-primary" type="button" tooltip-animation="true" tooltip="View Invoice"><span class="glyphicon glyphicon-eye-open"></span></a>'
					+'<a ng-disabled="(x.payment_status == 0)" ng-click="viewReceipt(\'modules/accounting/invoice/viewreceipt.html\',x)"  class="btn btn-warning" type="button" tooltip-animation="true" tooltip="View Receipt"><span class="glyphicon glyphicon-eye-open"></span></a>'
					
				}
			],
			onRegisterApi: function( gridApi ) {
			  $scope.gridApi = gridApi;
				$scope.gridApi.core.on.filterChanged( $scope, function() {
					
				})
			}
		};
		
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
					addinvoice : (data) ? {
						id : data.id,
						party_id :data.party_id,
						generated_date : data.generated_date,
						modified_date : data.modified_date,
						particulars:data.particulars,
						remark : data.remark
					} : {
						//generated_date : dataService.sqlDateFormate()
					},
					invoicePayment: (data) ? {
						pay_date : data.pay_date,
					} : {
						//generated_date : dataService.sqlDateFormate()
					},
				
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							console.log(input);
							$scope.stockData = {};
							$scope.stockData.user_id = input.user_id;
							$scope.stockData.goods_name = input.particulars[0].particular_name;
							$scope.stockData.quantity = input.particulars[0].quantity;
							$scope.stockData.price = "-" + input.particulars[0].price;
							$scope.stockData.goods_type = input.particulars[0].goods_type;
							$scope.stockData.category = input.particulars[0].category;
							console.log($scope.stockData);
							
							$rootScope.postData("stock", $scope.stockData,function(response){
								
							});
						$scope.getData(false, $scope.currentPage, 'invoice','invoiceList');
						}
					})
				},
				
			updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'invoice','invoiceList');
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
		$scope.invoiceParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
			},
			cols : ["*"]
		}
		
		
		// For Get (Select Data from DB)
		$scope.getData = function(single, page, table, subobj, params, modalOptions) {
			$scope.params = (params) ? params : {
				where : {
					status : 1,
					user_id : $rootScope.userDetails.id
				},
				 /* join : [
					{
						joinType : 'INNER JOIN',
						joinTable : "inventory_party",
						joinOn : {
							party_id : "t0.party_id"
						},
						cols : {name : "name"}
					}
				],  */
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
		$scope.orderBy = function(col, value){
			if(!$scope.params.orderBy) $scope.params.orderBy = {};
			$scope.params.orderBy[col] = value;
			console.log($scope.params);
			$scope.getData(false,$scope.currentPage, 'invoice', 'invoiceList', $scope.params);
		}
	};
		
	// Inject controller's dependencies
	invoiceController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('invoiceController', invoiceController);
});
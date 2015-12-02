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
		console.log('Hello');
		
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
		
		$scope.billData = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{ name:'SrNo', width:50,
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false, enableFiltering: false,
					
				},
				
				{ name:'id', width:50,
					filterHeaderTemplate: '<input id="id" class="form-control" ng-change="grid.appScope.filter(\'id\', id, \'bill\', \'billData\')" ng-model="id" placeholder="Bill No">',
				},
				 { name:'name',enableSorting: false ,enableFiltering: true
				}, 
			
				{ name:'bill_date',
					filterHeaderTemplate: '<input id="bill_date" class="form-control" ng-change="grid.appScope.filter(\'bill_date\', bill_date, \'bill\', \'billData\')" ng-model="bill_date" placeholder="search">',
				},
				{ name:'payment_status',width:100,
				     filterHeaderTemplate: '<select id="payment_status" class="form-control" ng-change="grid.appScope.filter(\'payment_status\', payment_status, \'bill\', \'billData\')" ng-model="payment_status" placeholder="search">'
					+'<option value="" selected>payment status</option>'
							+'<option value="Paid">Paid</option>'
							+'<option value="Unpaid">Unpaid</option>	'
							+'<option value="PartialPaid">PartialPaid</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					 
					  options: [ { value: 'Paid', label: 'Paid' }, { value: 'Unpaid', label: 'Unpaid' }, { value: 'PartialPaid', label: 'PartialPaid' }]
					} 
            
				},
				{ name:'total_amount',width:100, 
					filterHeaderTemplate: '<input id="total_amount" class="form-control" ng-change="grid.appScope.filter(\'total_amount\', total_amount, \'bill\', \'billData\')" ng-model="total_amount" placeholder="search">',
					cellTemplate : "<span>{{row.entity.total_amount}}</span>",
					filter:{
					placeholder: 'Total amount'
					
					}
				},
				{ name:'Due_Amount',width:100,
					filterHeaderTemplate: '<input id="Due_Amount" class="form-control" ng-change="grid.appScope.filter(\'Due_Amount\', Due_Amount, \'bill\', \'billData\')" ng-model="Due_Amount" placeholder="search">',},
				
				{ name:'due_date',width:80,
					filterHeaderTemplate: '<input id="due_date" class="form-control" ng-change="grid.appScope.filter(\'due_date\', due_date, \'bill\', \'billData\')" ng-model="remark" placeholder="search">',},
				{ name:'manage',
				filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'bill\', \'billData\')" ng-model="status">'
							+'<option value="" selected>Status</option>'
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					   options: [ { value: '1', label: 'Active' }, { value: '0', label: 'Delete' }]
					} ,
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/inventory/bill/addbill.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit bill Information"> <span class="glyphicon glyphicon-pencil"></span></a>'
					
					+ '<a type="button" tooltip="Delete bill" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'bill\', \'status\',row.entity.status, row.entity.id)" btn-checkbox="" btn-checkbox-true="1" btn-checkbox-false="0" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+
					'<a ng-click="grid.appScope.openModal(\'modules/inventory/bill/payBill.html\')" class="btn btn-info btn-sm" type="button" tooltip-animation="true" tooltip="pay bill Information"> <span class="glyphicon glyphicon-usd"></span></a>'
							+
					'<a ng-click="grid.appScope.openModal(\'modules/inventory/bill/viewbills.html\')" class="btn btn-info btn-sm" type="button" tooltip-animation="true" tooltip="view bill Information"> <span class="glyphicon glyphicon-eye-open"></span></a>'
							+
					'<a ng-click="grid.appScope.openModal(\'modules/inventory/bill/viewreceipt.html\')" class="btn btn-warning btn-sm" type="button" tooltip-animation="true" tooltip="view bill Information"> <span class="glyphicon glyphicon-eye-open"></span></a>'
					
				}
			],
			onRegisterApi: function( gridApi ) {
			  $scope.gridApi = gridApi;
				$scope.gridApi.core.on.filterChanged( $scope, function() {
					
				})
			}
		};
		

		
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
		$scope.openModal = function(url,data){
				var modalDefault = {
				templateUrl: url, // apply template to modal
				size : 'lg'
				};
			var modalOptions = {
				date : $scope.currentDate,
				addBill : (data) ? {
					id : data.id,
					party_id : data.party_id,
					user_id : data.user_id,
					generated_date : data.generated_date,
					due_date : data.due_date,
					remark : data.remark,
					particular : data.particular
				} : {
					date : dataService.sqlDateFormate(),
					modified_date : dataService.sqlDateFormate()
				},
				payBill : (data) ? {
					
					pay_date:data.pay_date
					
				} : {
					//date : dataService.sqlDateFormate()
				},
				
				postData : function(table,input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							console.log(input);
							$scope.stockData = {};
							$scope.stockData.user_id = input.user_id;
							$scope.stockData.party_id = input.party_id;
							$scope.stockData.date=input.date;
							$scope.stockData.stockdate=input.bill_date;
							$scope.stockData.modified_date=input.modified_date;
							//$scope.stockData.modified_date=input.modified_date;
							$scope.stockData.goods_name = input.particular[0].particular_name;
							
							$scope.stockData.quantity = input.particular[0].quantity;
							$scope.stockData.price = input.particular[0].price;
							$scope.stockData.goods_type = input.particular[0].goods_type;
							$scope.stockData.category = input.particular[0].category;
							console.log($scope.stockData);
							
							$rootScope.postData("stock", $scope.stockData,function(response){
								
							});
							
							
							$scope.getData(false, $scope.currentPage, 'bill','billData');
						}
					})
				},
				taxCalculate : function(modalOptions){
					modalOptions.singleparticular.tax = {};
					
					angular.forEach($rootScope.userDetails.config.inventory.taxData.tax, function(value, key){
						if(modalOptions.taxInfo[value.taxName]){
							//console.log(value.taxName, value.taxValue, modalOptions.singleparticular.amount);
							modalOptions.singleparticular.tax[value.taxName] = (modalOptions.singleparticular.tax[value.taxName]) ? modalOptions.singleparticular.tax[value.taxName] + (value.taxValue * modalOptions.singleparticular.amount / 100) : (value.taxValue * modalOptions.singleparticular.amount / 100);
						}
					})
					//console.log(modalOptions.singleparticular.tax);
				},
				totalCalculate : function(modalOptions){
					modalOptions.addBill.subtotal = 0;
					modalOptions.addBill.total_amount = 0;
					modalOptions.addBill.tax = {};
					console.log(modalOptions.addBill.particular);
					
					
					angular.forEach(modalOptions.addBill.particular, function(value, key){
						modalOptions.addBill.subtotal += value.amount;
						angular.forEach(value.tax,function(value, key){
							console.log(value, key);
							modalOptions.addBill.tax[key] = (modalOptions.addBill.tax[key]) ? modalOptions.addBill.tax[key] + value : value;
						})
						
					})
					
					var taxSubtotal = 0;
					angular.forEach(modalOptions.addBill.tax, function(value, key){
						taxSubtotal += value;
					})
					
					modalOptions.addBill.total_amount = modalOptions.addBill.subtotal + taxSubtotal;
					console.log(modalOptions.addBill.subtotal);
					console.log(taxSubtotal);
					console.log(modalOptions.addBill.total_amount);
						
					
					return modalOptions;
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'bill','billData');
						}
					})
				},
				
				getData: $scope.getData,
				
				addToObject : $rootScope.addToObject,
				reset : $rootScope.reset,
				removeObject : $rootScope.removeObject
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){
			})
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
					cols : {name : "name"}
				}
			],
			cols : ["*"]
		}
		// For Get (Select Data from DB)
		$scope.getData = function(single, page, table, subobj, billParams, modalOptions) {
			$scope.billParams = (billParams) ? billParams : {
				where : {
					status : 1,
					user_id : $rootScope.userDetails.id
				},
				 
				cols : ["*"]
			};
			if(page){
				angular.extend($scope.billParams, {
					limit : {
						page : page,
						records : $scope.pageItems
					}
				})
			}
			dataService.get(single,table,$scope.billParams).then(function(response) {
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
				angular.extend($scope.billParams, response);
				$scope.getData(false, $scope.currentPage, table, subobj, $scope.billParams);
			})
		}
		$scope.orderBy = function(col, value){
			if(!$scope.billParams.orderBy) $scope.billParams.orderBy = {};
			$scope.billParams.orderBy[col] = value;
			$scope.getData(false,$scope.currentPage, 'bill', 'billData', $scope.billParams);
		}
	};	
	// Inject controller's dependencies
	billController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('billController', billController);
});
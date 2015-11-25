'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService', 'uiGridConstants'];
    
    // This is controller for this view
	var billController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService, uiGridConstants) {
		$rootScope.metaTitle = "inventory";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.alerts = [];
		//$scope.currentDate = dataService.currentDate;	
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.currentDate = dataService.sqlDateFormate(dataService.currentDate);
		$rootScope.serverApiV2 = true;
		$rootScope.module = "inventory";
		console.log('Hello');
		$scope.billData = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{ name:'SrNo', 
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false, enableFiltering: false,
					
				},
				
				{ name:'id', 
					filter: {
					  placeholder: 'Bill.no'
					}
				},
				{
					name:'Party Name',
					filterHeaderTemplate: '<select id="user_id" class="form-control" ng-change="grid.appScope.filter(\'user_id\', partyFilter, \'party\', \'partyList\')" ng-model="partyFilter" ng-options="item.id as item.name for item in grid.appScope.partyList">'
							+'<option value="" selected>Party name</option>'
							+'<option value="0">Unpaid</option>'
							+'<option value="1">Paid</option>	'
						+'</select>',
					filter: {
					  placeholder: 'Party Name'
					}
				},
				{ name:'generated_date',enableSorting: false, enableFiltering: false,
				},
				{ name:'remark',enableSorting: false, enableFiltering: false,
				},
				{ name:'total_amount', 
					cellTemplate : "<span>{{row.entity.particular[0].total_amount}}</span>",
					enableSorting: false, enableFiltering: false,
				},
				/* { name:'Paid Amount',enableSorting: false, enableFiltering: false,}, */
				{ name:'Due Amount',enableSorting: false, enableFiltering: false,},
				{ name:'due_date',enableSorting: false, enableFiltering: false,},
				{
					name:'status',
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'bill\', \'billData\')" ng-model="status">'
							+'<option value="" selected>Status</option>'
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					 
					  options: [ { value: '1', label: 'Active' }, { value: '0', label: 'Delete' }]
					} 
				},
				{ name:'manage', enableSorting: false, enableFiltering: false, 
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/inventory/bill/addbill.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit bill Information"> <span class="glyphicon glyphicon-pencil"></span></a>'
					
					+ '<a type="button" tooltip="Delete bill" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'bill\', \'status\',row.entity.status, row.entity.id)" btn-checkbox="" btn-checkbox-true="1" btn-checkbox-false="0" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+
					'<a ng-click="grid.appScope.openModal(\'modules/inventory/bill/viewbill.html\')" class="btn btn-info btn-sm" type="button" tooltip-animation="true" tooltip="view bill Information"> <span class="glyphicon glyphicon-eye-open"></span></a>'
					+
					'<a ng-disabled="(row.entity.payment_status == 0)" ng-click="grid.appScope.openModal(\'modules/inventory/bill/viewbill.html\',row.entity)" class="btn btn-warning btn-sm" type="button" tooltip-animation="true" tooltip="view bill Information"> <span class="glyphicon glyphicon-eye-open" disabled="disabled"></span></a>'
				}
			],
			onRegisterApi: function( gridApi ) {
			  $scope.gridApi = gridApi;
				$scope.gridApi.core.on.filterChanged( $scope, function() {
					
				})
			}
		};
		$scope.openModal = function(url,data){
				var modalDefault = {
				templateUrl: url, // apply template to modal
				size : 'lg'
				};
			var modalOptions = {
				date : $scope.currentDate,
				addBill : (data) ? {
					id : data.id,
					generated_date : data.generated_date,
					due_date : data.due_date,
					remark:data.remark,
					particular:data.particular
				} : {
					//date : dataService.sqlDateFormate()
				},
				postData : function(table,input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							
							$scope.stockData = {};
							$scope.stockData.user_id = input.user_id;
							$scope.stockData.goods_name = input.particular[0].particular_name;
							$scope.stockData.quantity ="-"+ input.particular[0].quantity;
							$scope.stockData.price = input.particular[0].price;
							console.log($scope.stockData);
							console.log(input);
							$rootScope.postData("stock", $scope.stockData,function(response){
								
							});
							
							
							$scope.getData(false, $scope.currentPage, 'bill','billData');
						}
					})
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
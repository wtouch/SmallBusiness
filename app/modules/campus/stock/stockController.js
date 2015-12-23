'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService', 'uiGridConstants'];
    
   var stockController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService, uiGridConstants) {
		$rootScope.metaTitle = "campus";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.alerts = [];
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");
		$rootScope.serverApiV2 = true;
		$rootScope.module = "campus";
		
		
		
		$rootScope.moduleMenus = [
			{
				name : "Add stock",
				path : "#/dashboard/campus/stock",
			
				events : {
					click : function(){
						return $scope.openModal("modules/campus/stock/addstock.html");
					}
				}
			}
		]
		var rowtpl='<div ng-class="{ \'my-css-class\': grid.appScope.rowFormatter( row ),\'text-success\':(row.entity.payment_status==1),\'text-danger\':(row.entity.payment_status==0),\'text-warning\':(row.entity.payment_status==2)}">' +
                 '  <div ng-if="row.entity.merge">{{row.entity.title}}</div>' +
                 '  <div ng-if="!row.entity.merge" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                 '</div>';
		
		$scope.stockData = {
			enableSorting: true,
			enableFiltering: true,
			rowTemplate:rowtpl,
			columnDefs: [
				{ name:'SrNo', width:50,
					enableSorting: false, enableFiltering: false,
					cellTemplate : "<div class=\'ui-grid-cell-contents ng-binding ng-scope\'>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</div>",
					
				},
				
				{ name:'stock_id', width:70,enableSorting: false, enableFiltering: true,
					filterHeaderTemplate: '<input id="stock_id" class="form-control" ng-change="grid.appScope.filter(\'stock_id\', stock_id, \'stock_view\', \'stockData\',true,grid.appScope.stockParams)" ng-model="stock_id" placeholder="stock No">',
				},
				{
					name:'name',width :110,enableSorting: false,enableFiltering: true,
					filterHeaderTemplate: '<select id="name" class="form-control" ng-change="grid.appScope.filter(\'vendor_id\', vendor_id, \'stock_view\', \'stockData\',true, grid.appScope.stockParams)" ng-model="vendor_id" ng-options="item.id as item.name for item in grid.appScope.vendorList">' 
							+'<option value="">Select Vendor</option>'
						+'</select>',
				}, 
			
				{
					name:'manage',width:200,enableSorting: false,enableFiltering: true,
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'stock\', \'stockData\',false,grid.appScope.stockParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>',
					
					
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/campus/stock/addstock.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit stock"> <span class="glyphicon glyphicon-pencil"></span></a>'
					
					+ '<a type="button" tooltip="Delete stock" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'stock\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+
					'<a ng-click="grid.appScope.openViewreceipt(\'modules/campus/stock/viewstock.html\',row.entity)" class="btn btn-warning btn-sm" type="button" tooltip-animation="true" tooltip="view stock Information"> <span class="glyphicon glyphicon-eye-open"></span></a>'
					
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
				$scope.getData(false, $scope.currentPage, "stock", "stockData", $scope.stockParams);
			}
		}
		
		$scope.openModal = function(url,data){
				var modalDefault = {
				templateUrl: url, // apply template to modal
				size : 'lg'
				};
			var modalOptions = {
				date : dataService.sqlDateFormate(),
				addstock : (data) ? {
					id : data.id,
					stock_id :data.stock_id,
					vendor_id : data.vendor_id,
					user_id : data.user_id,
					type : data.type,
					remark : data.remark,
					particular : data.particular,
					modified_date : dataService.sqlDateFormate(false,"datetime")
				} : {
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
				
					status : 1,
					user_id : $rootScope.userDetails.id
				},
				
		
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							// For Insert each item from particulars into Stock Table
							
							$scope.stockData = {};
							$scope.stockData.user_id = input.user_id;
							$scope.stockData.vendor_id = input.vendor_id;
							if(input.date) $scope.stockData.date = input.date;
							$scope.stockData.stockdate = input.generated_date;
							$scope.stockData.modified_date = input.modified_date;
							$scope.stockData.type = input.type; 
							angular.forEach(input.particular, function(value, key){
								$scope.stockData.goods_name = value.particular_name; 
								$scope.stockData.quantity =  "+" + value.quantity;
								$scope.stockData.goods_type = value.goods_type; 
								$scope.stockData.category = value.category;
								$rootScope.postData("stock", angular.copy($scope.stockData),function(response){
								});
							})						
						$scope.getData(false, $scope.currentPage, 'stock','stockData',$scope.stockParams);
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'stock','stockData',$scope.stockParams);
						}
					})
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
		$scope.stockParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
			},
			
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
			$scope.getData(false,$scope.currentPage, 'stock', 'stockData', $scope.params);
		}
	};	
	// Inject controller's dependencies
	stockController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('stockController', stockController);
});
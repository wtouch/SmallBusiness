'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService', 'uiGridConstants'];
    
   var stockController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService, uiGridConstants) {
		$rootScope.metaTitle = "campus";
		$scope.maxSize = 5;
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
				subtitle:"stock List",
				events : {
					click : function(){
						return $scope.openModal("modules/campus/stock/addstock.html");
					}
				}
			}
			
		]
		$scope.stockData = {
			enableSorting: true,
			enableFiltering: true,
		
			columnDefs: [
				{
					name:'SrNo', 
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false,
					enableFiltering: false,	
				},
				{
					name:'stock_type',enableSorting: false,enableFiltering: true,
					filterHeaderTemplate: '<select id="stock_type" class="form-control" ng-change="grid.appScope.filter(\'stock_type\', stock_type, \'stock\', \'stockData\',true, grid.appScope.stockParams)" ng-model="stock_type">' 
							+'<option value="">Select Type</option>'
							  +'<option value="1">Equipment</option>'
						      +'<option value="2">Stationary</option>'
						+'</select>'
				},
				{
					name:'vendor_name',enableSorting: false,enableFiltering: true,
					filterHeaderTemplate: '<select id="name" class="form-control" ng-change="grid.appScope.filter(\'vendor_name\', vendor_name, \'stock\', \'stockData\',false, grid.appScope.stockParams)" ng-model="vendor_name" ng-options="item.name as item.name for item in grid.appScope.vendorList">' 
							+'<option value="">Select Vendor</option>'
						+'</select>',
                },
				{
					name:'manage',enableSorting: false,enableFiltering: true,
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'stock\', \'stockData\',false,grid.appScope.stockParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>',
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/campus/stock/addstock.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit stock"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete stock" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'stock\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+'<a ng-click="grid.appScope.openModal(\'modules/campus/stock/stockView.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view  vendor" > <span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
					
				}
			],
		
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
					user_id : data.user_id,
					vendor_id : data.vendor_id,
					stock_type : data.stock_type,
					goods_name: data.goods_name,
					goods_type: data.goods_type,
					category: data.category,
					quantity: data.quantity,
				} : {
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					status : 1,
					user_id : $rootScope.userDetails.id
				},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
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
				getData:$scope.getData,
			};
				
			modalService.showModal(modalDefault, modalOptions).then(function(){
			})
			
		}
		$scope.stockParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
			},
			join : [
				{
					joinType : 'INNER JOIN',
					joinTable : "campus_vendor",
					joinOn : {
						id : "t0.vendor_id"
					},
					cols : ['name, email, phone, address, location, area, city, state, country, pincode']
				}
			],
			groupBy : {
				id : "id"
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
	stockController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('stockController', stockController);
});
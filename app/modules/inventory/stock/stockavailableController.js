'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService', 'uiGridConstants'];
    
    // This is controller for this view
	var stockavailableController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		//global scope objects
		$scope.invoice = true;
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");
		$rootScope.serverApiV2 = true;
		$rootScope.module = "inventory";
		console.log('Hello');
		
		$scope.getTypeaheadData = function(table, searchColumn, searchValue){
					//console.log(table, searchColumn, searchValue);
					var locationParams = {
						search : {},
						cols : ["*"],
						status : 1,
						user_id : $rootScope.userDetails.id
					};
					locationParams.search[searchColumn] = searchValue;
					return dataService.get(false, 'stock_items', locationParams).then(function(response){
						if(response.status == 'success'){
							return response.data;
						}else{
							return [];
						}
					}); 
				},
				$scope.assignData = function(object, formObject){
					formObject.goods_name = object.goods_name;
					formObject.goods_type = object.goods_type;
					formObject.price = object.price;
					formObject.quantity = 1;
					formObject.category = object.category;
				},
		
		
		$rootScope.moduleMenus = [
			{
				name : "Available Stock",
				path : "#/dashboard/inventory/stockavailable",
				Subtitle : "Available Stock"
			},
			{
				name : "Stock Master",
				path : "#/dashboard/inventory/stock",
				Subtitle : "Stock Master"
			}
		]
		$scope.addstock = ($scope.addstock)?
		$scope.addstock:{
			user_id : $rootScope.userDetails.id,
			stockdate : dataService.sqlDateFormate(false,"datetime"),
			modified_date : dataService.sqlDateFormate(false,"datetime"),
		}
		$scope.postData = function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'stock','stockList',$scope.stockParams);
							$scope.addstock = {
								user_id : $rootScope.userDetails.id,
								stockdate : dataService.sqlDateFormate(false,"datetime"),
								modified_date : dataService.sqlDateFormate(false,"datetime"),};
						}
					})
			},
		$scope.updateData = function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){ 
							/* $scope.addstock = {
								user_id : $rootScope.userDetails.id,
								stockdate : dataService.sqlDateFormate(false,"datetime"),
								modified_date : dataService.sqlDateFormate(false,"datetime")
							}; */
								$scope.getData(false, $scope.currentPage, 'stock','stockList',$scope.stockParams);
						}
					})
				},
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
		$scope.partyParams = {
			where : {
				user_id : $rootScope.userDetails.id,
				status : 1,
				type :"vendor"
			},
			cols : ["*"]
		}
		$scope.editData = function(object){
			$scope.isCollapsed = true;
			$scope.stock = object;
		}
		$scope.stockList = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{ name:'SrNo',width :60, 
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false,
					enableFiltering: false,	
				},
				{
				    name:'goods_name',
					filterHeaderTemplate: '<input id="goods_name" class="form-control" ng-change="grid.appScope.filter(\'goods_name\', goods_name, \'stock\', \'stockList\',true, grid.appScope.stockParams)" ng-model="goods_name" placeholder="search">',
                },
					{
					name:'goods_type',
					filterHeaderTemplate: '<select id="goods_type" class="form-control" ng-change="grid.appScope.filter(\'goods_type\', goods_type, \'stock\', \'stockList\',true, grid.appScope.stockParams)" ng-model="goods_type">'
							+'<option value="" selected>goods type</option>'
							+'<option value="type1">type1</option>'
							+'<option value="type2">type2</option>	'
							+'<option value="type3">type3</option>'
							+'<option value="type4">type4</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					 
					  options: [ { value: 'type1', label: 'type1' }, { value: 'type2', label: 'type2' },
					  { value: 'type3', label: 'type3'}, { value: 'type4', label: 'type4' } ]
					} 
				},
				{
					name:'category',
					filterHeaderTemplate: '<select id="category" class="form-control" ng-change="grid.appScope.filter(\'category\', category, \'stock\', \'stockList\',true, grid.appScope.stockParams)" ng-model="category">'
							+'<option value="" selected>Account category</option>'
							+'<option value="category1">category1</option>'
							+'<option value="category2">category2</option>	'
							+'<option value="category3">category3</option>'
							+'<option value="category4">category4</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					 
					  options: [ { value: 'category1', label: 'category1' }, { value: 'category2', label: 'category2' },
					  { value: 'category3', label: 'category3'}, { value: 'category4', label: 'category4' } ]
					} 
				},
				{ name:'unit',enableSorting: false, enableFiltering: false,},
				{ name:'price',enableSorting: false, enableFiltering: false,},
				{ name:'Manage', 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'stock\', \'stockList\',false,grid.appScope.stockParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					   type: uiGridConstants.filter.SELECT,  
					  selectOptions: [ { value: '1', label: 'Active' }, { value: '0', label: 'Deleted' }
					  ]
					} , 
					cellTemplate : '<a ng-click="grid.appScope.editData(row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit stock Information"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete stock" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'stock\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					
				}
			]
		};
		
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "stock", "stockList", $scope.stockParams);
			}
		}
		$scope.openModal = function(url,data){
			var modalDefault = {
				templateUrl:url,	// apply template to modal
				size : 'lg'
			};
			console.log(data);
			var modalOptions = {
				partyParams : $scope.partyParams,
				date : $scope.currentDate,
				stockdate:$scope.currentData,
				stock : (data) ? {
					id : data.id,
					user_id : data.user_id,
					//party_id:data.party_id,
					goods_name: data.goods_name,
					goods_type : data.goods_type,
					category : data.category,
					//quantity : data.quantity,
					unit : data.unit,
					//date:data.stockdate,
					price : data.price,
					date : data.date,
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
							$scope.getData(false, $scope.currentPage, 'stock','stockList',$scope.stockParams);
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							/* $scope.getData(false, $scope.currentPage, 'stock','stockList',$scope.stockParams); */
							$scope.getData(false, $scope.currentPage, 'stock','stockList');
						}
					})
				},
				getData : $scope.getData
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){	
			})
		}
		
		 $scope.getData = function(single, page, table, subobj, params, modalOptions) {
			$scope.params = (params) ? params : {
				where : {
					user_id : $rootScope.userDetails.id,
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
		/* filter  dynamic*/
		$scope.filter = function(col, value, table, subobj, search, params){
			value = (value) ? value : undefined;
			if(!params) params = {};
			$rootScope.filterData(col, value, search, function(response){
				dataService.extendDeep($scope.params, params, response);
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
	stockavailableController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('stockavailableController', stockavailableController);
});
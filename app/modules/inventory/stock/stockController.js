'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService', 'uiGridConstants'];
    
    // This is controller for this view
	var stockController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
		//global scope objects
		$scope.invoice = true;
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.currentDate = dataService.currentDate;
		//$scope.stockList = {};
		$scope.stockList = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{ name:'SrNo', 
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false,
			enableFiltering: false,	
				},
				
				/* { name:'user_id',
					
					filter: {
					  placeholder: ' user_id '
					}
				
				}, */
				{
				    name:'user_id',
					filterHeaderTemplate: '<input id="user_id" class="form-control" ng-change="grid.appScope.filter(\'user_id\', user_id, \'stock\', \'stockList\')" ng-model="user_id" placeholder="search user id">',
                },
				/* { name:'goods_name',
				filter: {
					  placeholder: ' Search Goods name '
					}
				}, */
				{
				    name:'goods_name',
					filterHeaderTemplate: '<input id="goods_name" class="form-control" ng-change="grid.appScope.filter(\'goods_name\', goods_name, \'stock\', \'stockList\')" ng-model="goods_name" placeholder="search">',
                },
					{
					name:'goods_type',
					filterHeaderTemplate: '<select id="goods_type" class="form-control" ng-change="grid.appScope.filter(\'goods_type\', goods_type, \'stock\', \'stockList\')" ng-model="goods_type">'
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
				/* { name:'category',
				
				filter: {
					   type: uiGridConstants.filter.SELECT,  
					  selectOptions: [ { value: 'category1', label: 'category1' }, { value: 'category2', label: 'category2' },
					  { value: 'category3', label: 'category3'}, { value: 'category4', label: 'category4' } ]
					} 
				}, */
				{
					name:'category',
					filterHeaderTemplate: '<select id="category" class="form-control" ng-change="grid.appScope.filter(\'category\', category, \'stock\', \'stockList\')" ng-model="category">'
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
				 { name:'quantity',enableSorting: false, enableFiltering: false,},
				{ name:'price',enableSorting: false, enableFiltering: false,},
				{ name:'unit',enableSorting: false, enableFiltering: false,},
				{
					name:'status',
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'stock\', \'stockList\')" ng-model="status">'
							+'<option value="" selected>Account Status</option>'
							+'<option value="1">Active</option>'
							+'<option value="0">Delete</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					 
					  options: [ { value: '1', label: 'Active' }, { value: '0', label: 'Delete' }]
					} 
				},
				{ name:'manage', enableSorting: false, enableFiltering: false, 
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/stock/addstock.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit stock Information"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete stock" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'stock\', \'status\',row.entity.status, row.entity.id)" btn-checkbox="" btn-checkbox-true="1" btn-checkbox-false="0" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					
				}
			]
		};
			$scope.openModal = function(url,data){
			var modalDefault = {
				templateUrl:url,	// apply template to modal
				size : 'lg'
			};
			console.log(data);
			var modalOptions = {
				stockdate:{date : $scope.currentDate},
				stock : (data) ? {
					id : data.id,
					user_id : data.user_id,
					goods_name: data.goods_name,
					goods_type : data.goods_type,
					category : data.category,
					quantity : data.quantity,
					price : data.price,
					unit : data.unit,
					status : data.status,
					date : data.date
				} : {
					date : dataService.sqlDateFormate()
				},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'stock','stockList');
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'stock','stockList');
						}
					})
				},
				getData : $scope.getData
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
			dataService.get(false,table,$scope.params).then(function(response) {
				console.log(response);
				if(response.status == 'success'){
					if(modalOptions != undefined){
						modalOptions[subobj] = angular.copy(response.data);
						modalOptions.totalRecords = response.totalRecords;
					}else{
						$scope[subobj].data = angular.copy(response.data);
						$scope.totalRecords = response.totalRecords;
					}
				}else{
					if(modalOptions != undefined){
						modalOptions[subobj].data = [];
						modalOptions.totalRecords = 0;
					}else{
						$scope[subobj].data = [];
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
		$scope.orderBy = function(col, value, table, subobj){
			if(!$scope.params.orderBy) $scope.params.orderBy = {};
			$scope.params.orderBy[col] = value;
			$scope.getData(false,$scope.currentPage, 'stock', 'stockList', $scope.params);
		}
	 };
		
	// Inject controller's dependencies
	stockController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('stockController', stockController);
});
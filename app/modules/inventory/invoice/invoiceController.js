'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants'];
    
    // This is controller for this view
	var invoiceController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
	
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
				{ name:'SrNo', 
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false,enableFiltering: false
					
				},
				{ name:'id',enableSorting: false ,
				filterHeaderTemplate: '<input id="id" class="form-control" ng-change="grid.appScope.filter(\'id\', id, \'invoice\', \'invoiceList\')" ng-model="id" placeholder="Id">',
				},
				
				{
					name:'User Name',
					filterHeaderTemplate: '<select class="form-control" ng-change="grid.appScope.filter(\'id\', userFilter, \'user\', \'userList\')" ng-model="userFilter" ng-options="item.id as item.name for item in grid.appScope.userList">'
							+'<option value="" selected>User Name</option>'
						+'</select>',
					filter: {
					  placeholder: 'User Name'
					}
				},
				{
					name:'Account Name',
					filterHeaderTemplate: '<select id="payment_status" class="form-control" ng-change="grid.appScope.filter(\'user_id\', accountFilter, \'account\', \'accountList\')" ng-model="accountFilter" ng-options="item.id as item.account_name for item in grid.appScope.accountList">'
							+'<option value="" selected>Account Name</option>'
						+'</select>',
					filter: {
					  placeholder: 'Account Name'
					}
				},
				{ name:'generated_date', enableFiltering: false,enableSorting: false},
				{ name:'due_date', enableFiltering: false,enableSorting: false},
				{ name:'status',
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'invoice\', \'invoiceList\')" ng-model="status">'
							+'<option value="" selected>Status</option>'
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					 
					  options: [ { value: '1', label: 'Active' }, { value: '0', label: 'Delete' }]
					} 
				},
				{ name:'amount',enableSorting: false , enableFiltering: false, cellTemplate : "<span>{{row.entity.particulars[0].amount}}</span>"},
				{ name:'price',enableSorting: false , enableFiltering: false, cellTemplate : "<span>{{row.entity.particulars[0].price}}</span>"},
				{ name:'Manage', enableSorting: false, enableFiltering: false, 
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/invoice/addinvoice.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit Account Information"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete Account" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'invoice\', \'status\',row.entity.status, row.entity.id)" btn-checkbox="" btn-checkbox-true="1" btn-checkbox-false="0" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					
				}
			],
			onRegisterApi: function( gridApi ) {
			  $scope.gridApi = gridApi;
				$scope.gridApi.core.on.filterChanged( $scope, function() {
					
				})
			}
		};
		$scope.openModal = function(url , data){
			
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			
			var modalOptions = {
					date : $scope.currentDate,
					addinvoice : (data) ? {
					id : data.id,
					generated_date : data.generated_date,
					due_date : data.due_date,
					particulars:data.particulars,
					remark : data.remark
				} : {
					//generated_date : dataService.sqlDateFormate()
				},
				
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
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
			console.log($scope.params);
			$scope.getData(false,$scope.currentPage, 'invoice', 'invoiceList', $scope.params);
		}
	};
		
	// Inject controller's dependencies
	invoiceController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('invoiceController', invoiceController);
});
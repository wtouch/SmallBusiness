'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService', 'uiGridConstants'];
    
    // This is controller for this view
	var accountController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
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
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");
		$rootScope.serverApiV2 = true;
		$rootScope.module = "inventory";
		console.log('Hello');
		
		$rootScope.moduleMenus = [
			{
				name : "Add Account",
				path : "#/dashboard/inventory/account",
				events : {
					click : function(){
						return $scope.openModal("modules/inventory/account/addaccount.html");
					}
				}
			},{
				name : "Account List",
				path : "#/dashboard/inventory/account/account.html"
			}
		]
		
		//$scope.accountList = {};
		$scope.accountList = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{ name:'SrNo', width: 60,
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false, enableFiltering: false,
					
				},
				
				{
				    name:'account_name',
					filterHeaderTemplate: '<input id="account_name" class="form-control" ng-change="grid.appScope.filter(\'account_name\', account_name, \'account\', \'accountList\',true, grid.appScope.accountParams)" ng-model="account_name" placeholder="search">'
                }, 
				{
					name:'category',
					filterHeaderTemplate: '<select id="category" class="form-control" ng-change="grid.appScope.filter(\'category\', category, \'account\', \'accountList\',true,grid.appScope.accountParams)" ng-model="category">'
							+'<option value="" selected>Account category</option>'
							+'<option value="Bank">Bank</option>'
							+'<option value="Cash">Cash</option>	'
							+'<option value="Credit">Credit</option>'
							+'<option value="Loan">loan</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					 
					  options: [ { value: 'Bank', label: 'Bank Account' }, { value: 'Cash', label: 'cash Account' },
					  { value: 'Credit', label: 'credit card'}, { value: 'Loan', label: 'loan' } ]
					} 
				},
				{
					name:'account_no',filterHeaderTemplate: '<input id="account_no" class="form-control" ng-change="grid.appScope.filter(\'account_no\', account_no, \'account\', \'accountList\',true, grid.appScope.accountParams)" ng-model="account_no" placeholder="search">'
				},
				{ 
				name:'balance',filterHeaderTemplate: '<input id="balance" class="form-control" ng-change="grid.appScope.filter(\'balance\', balance, \'account\', \'accountList\',true,grid.appScope.accountParams)" ng-model="balance" placeholder="search">'},
				{ 
				name:'description',enableSorting: false, enableFiltering: false,
				},

				
				{  name:'Manage', 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'account\', \'accountList\',true,grid.appScope.accountParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					   type: uiGridConstants.filter.SELECT,  
					  selectOptions: [ { value: '1', label: 'Active' }, { value: '0', label: 'Deleted' }
					  ]
					} , 
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/inventory/account/addaccount.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit Account Information"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete Account" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'account\', \'status\',row.entity.status, row.entity.id)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					
				}
			]
		};
		/* post And update data */
		$scope.openModal = function(url,data){
			var modalDefault = {
				templateUrl:url,	// apply template to modal
				size : 'lg'
			};
			console.log(data);
			var modalOptions = {

				date : $scope.currentDate,
				account : (data) ? {
					id : data.id,
					account_name : data.account_name,
					account_no : data.account_no,
					balance: data.balance,
					description : data.description,
					user_id : data.user_id,
					category : data.category,
					status:data.status,
					date : data.date
				} : {
					date : dataService.sqlDateFormate()
				},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'account','accountList');
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'account','accountList');
						}
					})
				},
				getData : $scope.getData
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){	
			})
		}
		/* get user_id */
		$scope.accountParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id,
			},
			cols : ["*"]
		}
		/* get data */
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
		/* filter  dynamic*/
		$scope.filter = function(col, value, table, subobj, search, params){
			value = (value) ? value : undefined;
			if(!params) params = {};
			$rootScope.filterData(col, value, search, function(response){
				angular.extend($scope.params, params, response);
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
	accountController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('accountController', accountController);
});
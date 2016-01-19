'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants','$http'];
    
    // This is controller for this view
	var staff_paymentController= function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants,$http) {
		
		//global scope objects
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.currentPage = 1;
		$scope.currentDate = dataService.currentDate;
		$rootScope.serverApiV2 = true;
		$rootScope.module = "hr";
		
		$http.get("modules/hr/config.json").success(function(response){
			console.log(response);
				$scope.staffConfig = response;
			})
		
		$rootScope.moduleMenus = [
			{
				name : "Pay by Staff",
				path : "#/dashboard/hr/staff_payment",
				events : {
					click : function(){
						return $scope.openStaffbypayment("modules/hr/staff_payment/paybystaff.html");
					}
				} 
			},
				{
				name : "Pay for Staff",
				path : "#/dashboard/hr/staff_payment",
				events : {
					click : function(){
						return $scope.openStaffforpayment("modules/hr/staff_payment/payforstaff.html");
					}
				} 
			},
		]
		$scope.staff_payment= {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{ name:'SrNo',
				  width:50,
				  enableSorting: false,
				  enableFiltering: false, 
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",
					filter: {
					  //placeholder: 'ends with'
					}
				},
				{
				    name:'date',
					width:150,
					filterHeaderTemplate: '<input id="date" class="form-control" ng-change="grid.appScope.filter(\'date\', date, \'transaction\', \'staff_payment\',true)" ng-model="date" placeholder="payment date">'
                },
				
				{
				    name:'type',
					width:150,
					filterHeaderTemplate: '<select id="type" class="form-control" ng-change="grid.appScope.filter(\'type\', type, \'transaction\', \'staff_payment\',true,grid.appScope.staffpaymentParams);grid.appScope.staff_payment = grid.appScope.staffConfig[type]" ng-model="type">'
							+'<option value="" selected>Type</option>'
							+'<option value="staff.debit">staff debit</option>'
							+'<option value="staff.credit">Staff Credit</option>'
						+'</select>',
					filter: {
						//type: uiGridConstants.filter.SELECT,
						options: [{ value: 'staff.credit', label: 'Staff Credit' }, { value: 'staff.debit', label: 'Staff Debit' }]
					} ,
					cellTemplate:'<span>{{row.entity.type.replace("_"," ")|capitalize}}</span>'
                },
				{
				    name:'category',
					width:150,
					filterHeaderTemplate: '<select id="category" class="form-control" ng-change="grid.appScope.filter(\'category\', category, \'transaction\', \'staff_payment\',true,grid.appScope.staffpaymentParams)" ng-model="category" placeholder="Search" ng-options="item.system_name as item.name for item in grid.appScope.staff_payment">'
					+'<option value="" selected>Category</option>'
						+'</select>',
					cellTemplate:'<span>{{row.entity.category.replace("_"," ")|capitalize}}</span>'
                },
				{
				    name:'payment_type',
					width:150,
					filterHeaderTemplate: '<input id="payment_type" class="form-control" ng-change="grid.appScope.filter(\'payment_type\', payment_type, \'transaction\', \'staff_payment\',true,grid.appScope.staffpaymentParams)" ng-model="payment_type" placeholder="payment type">',
                },
				
				
			
				{
				    name:'name',
					width:150,
					filterHeaderTemplate: '<input id="name" class="form-control" ng-change="grid.appScope.filter(\'name\', name, \'transaction\', \'staff_payment\',true)" ng-model="name" placeholder="name">'
                },
				
			    { 
				 name:'Manage', width:300,
				 filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'transaction\', \'staff_payment\')" ng-model="status">'
							 +'<option value="" selected>--Select--</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
				 filter: {
					   type: uiGridConstants.filter.SELECT,  
					  selectOptions: [ { value: '1', label: 'Active' }, { value: '0', label: 'Deleted' }
					  ]
					},
					cellTemplate :
					'<a type="button" tooltip="Delete staff_payment" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'transaction\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
				} 
			]
		};	
		
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "transaction", "staff_payment", $scope.staffpaymentParams);
			}
		}
		
		$scope.openStaffbypayment= function(url,data){
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				staffpaymentdate: dataService.sqlDateFormate(),
				Category : $scope.staffConfig,
				staff_type: $scope.staffConfig,
				date:{date : $scope.currentDate},
				staffpayment : (data) ? {
					id : data.id,
					staff_id:data.staff_id,
					category : data.category,
					name : data.name,
				}:{
						date : dataService.sqlDateFormate(false,"datetime"),
						user_id : $rootScope.userDetails.id,
						status:1,
						modified_date : dataService.sqlDateFormate(false,"datetime")
						
						
				}, 
				getBalance : function(accountId, modalOptions) {
					//console.log(accountId, modalOptions);
					var accountParams = {
						where : {
							user_id : $rootScope.userDetails.id,
							status : 1,
							account_id : accountId
						},
						cols : ["account_id, IFNULL((sum(t0.credit_amount) - sum(t0.debit_amount)),0) as previous_balance"]
					}
					dataService.get(false,'transaction', accountParams).then(function(response) {
						console.log(response);
						modalOptions.previous_balance = response.data[0].previous_balance;
					})
					
				},
				
					staffpaymentParams :(data) ?{
						where : {
							user_id : $rootScope.userDetails.id,
							status : 1,
							module_name:'inventory'
						},
						join: [
							{
								joinType : 'INNER JOIN',
								joinTable : "hr_staff",
								joinOn : {
									id : "t0.staff_id"
								},
								cols : ['name']
							}],
						
						cols : ["*"]
					} :{},
		
				getData:$scope.getData,	
				postData : function(table, input){
						$rootScope.module = "inventory";
						$scope.transData  = {};
						$scope.transData.type='staff_credit';
						$scope.transData.user_id=input.user_id;
						$scope.transData.modified_date=input.modified_date;
						$scope.transData.date=input.date;
					//	$scope.transData.reference_id=input.staff_id;
						$scope.transData.account_id=input.account_id;
						$scope.transData.balance=input.balance;
						$scope.transData.credit_amount = input.credit_amount;
						//$scope.transData.debit_amount = input.debit_amount;
						$scope.transData.payment_type=input.payment_type;
						$scope.transData.category=input.category;
						$scope.transData.description=input.description,
					$rootScope.postData("transaction", $scope.transData,function(response){
						if(response.status == "success"){
									$rootScope.module = "hr";	
						}
					})
				},
				
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){
				
			})
		}
		$scope.openStaffforpayment= function(url,data){
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				//staffpaymentdate: dataService.sqlDateFormate(),
				Category : $scope.staffConfig,
				staff_type: $scope.staffConfig,
				date:{date : $scope.currentDate},
				staffpayment : (data) ? {
					id : data.id,
					staff_id:data.staff_id,
					category : data.category,
					name : data.name,
				}:{
						date : dataService.sqlDateFormate(false,"datetime"),
						user_id : $rootScope.userDetails.id,
						status:1,
						modified_date : dataService.sqlDateFormate(false,"datetime")
						
						
				}, 
				getBalance : function(accountId, modalOptions) {
					//console.log(accountId, modalOptions);
					var accountParams = {
						where : {
							user_id : $rootScope.userDetails.id,
							status : 1,
							account_id : accountId
						},
						cols : ["account_id, IFNULL((sum(t0.credit_amount) - sum(t0.debit_amount)),0) as previous_balance"]
					}
					dataService.get(false,'transaction', accountParams).then(function(response) {
						console.log(response);
						modalOptions.previous_balance = response.data[0].previous_balance;
					})
					
				},
				
					staffpaymentParams :(data) ?{
						where : {
							user_id : $rootScope.userDetails.id,
							status : 1,
							module_name:'inventory'
						},
						join: [
							{
								joinType : 'INNER JOIN',
								joinTable : "hr_staff",
								joinOn : {
									id : "t0.staff_id"
								},
								cols : ['name']
							}],
						
						cols : ["*"]
					} :{},
		
				getData:$scope.getData,	
				postData : function(table, input){
						$rootScope.module = "inventory";
						$scope.transData  = {};
						$scope.transData.type='staff_debit';
						$scope.transData.user_id=input.user_id;
						$scope.transData.modified_date=input.modified_date;
						$scope.transData.date=input.date;
					//	$scope.transData.reference_id=input.staff_id;
						$scope.transData.account_id=input.account_id;
						$scope.transData.balance=input.balance;
						//$scope.transData.credit_amount = input.credit_amount;
						$scope.transData.debit_amount = input.debit_amount;
						$scope.transData.payment_type=input.payment_type;
						$scope.transData.category=input.category;
						$scope.transData.description=input.description,
					$rootScope.postData("transaction", $scope.transData,function(response){
						if(response.status == "success"){
									$rootScope.module = "hr";	
						}
					})
				},
				
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){
				
			})
		}

		
		// For Get (Select Data from DB)
		$scope.getData = function(single, page, table, subobj, params, modalOptions,module_name) {
			console.log(module_name);
			if(module_name){
				$rootScope.module = module_name;
			}
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
					
					$rootScope.module = "inventory";
					if(modalOptions){
						modalOptions[subobj] = angular.copy(response.data);
						modalOptions.totalRecords = response.totalRecords;
					}else{
						($scope[subobj]) ? $scope[subobj].data = angular.copy(response.data) : $scope[subobj] = angular.copy(response.data) ;
						$scope.totalRecords = response.totalRecords;
					}
				}else{
					if(modalOptions){
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
		$scope.orderBy = function(col, value, table, subobj){
			if(!$scope.params.orderBy) $scope.params.orderBy = {};
			$scope.params.orderBy[col] = value;
			$scope.getData($scope.currentPage, table, subobj, $scope.params);
		}
		
	 };
	// Inject controller's dependencies
	staff_paymentController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('staff_paymentController', staff_paymentController);
});
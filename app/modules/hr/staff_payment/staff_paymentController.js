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
				name : "Staff Payment",
				path : "#/dashboard/hr/staff_payment",
				events : {
					click : function(){
						return $scope.openStaffpayment("modules/hr/staff_payment/addstaff_payment.html");
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
				    name:'payment_date',
					width:100,
					filterHeaderTemplate: '<input id="payment_date" class="form-control" ng-change="grid.appScope.filter(\'payment_date\', payment_date, \'staff_payment\', \'staff_payment\',true)" ng-model="payment_date" placeholder="payment date">'
                },
				{
				    name:'payment_type',
					width:100,
					filterHeaderTemplate: '<input id="payment_type" class="form-control" ng-change="grid.appScope.filter(\'payment_type\', payment_type, \'staff_payment\', \'staff_payment\',true)" ng-model="payment_type" placeholder="payment type">',
                },
				{
				    name:'leaves_for',
					width:150,
					filterHeaderTemplate: '<input id="leaves_for" class="form-control" ng-change="grid.appScope.filter(\'leaves_for\', leaves_for, \'staff_payment\', \'staff_payment\',true)" ng-model="phone" placeholder="Phone">'
                },
				{
				    name:'name',
					width:150,
					filterHeaderTemplate: '<input id="name" class="form-control" ng-change="grid.appScope.filter(\'name\', name, \'staff_payment\', \'staff_payment\',true)" ng-model="name" placeholder="name">'
                },
				{
				    name:'leavestatus',
					width:150,
					filterHeaderTemplate: '<input id="leavestatus" class="form-control" ng-change="grid.appScope.filter(\'leavestatus\', leavestatus, \'staff_payment\', \'staff_payment\',true)" ng-model="phone" placeholder="Phone">'
                },
			    { 
				 name:'Manage', width:300,
				 filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'staff_payment\', \'staff_payment\')" ng-model="status">'
							 +'<option value="" selected>--Select--</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
				 filter: {
					   type: uiGridConstants.filter.SELECT,  
					  selectOptions: [ { value: '1', label: 'Active' }, { value: '0', label: 'Deleted' }
					  ]
					},
					cellTemplate :  '<a ng-click="grid.appScope.openSalary(\'modules/hospital/hospitalstaff/salary.html\', row.entity)" class="btn btn-primary btn-sm btn btn-warning" type="button" tooltip-animation="true" tooltip="Salary" > <span class="	glyphicon glyphicon-usd" ></span></a>'
					+
					'<a ng-click="grid.appScope.openPayslip(\'modules/hospital/hospitalstaff/viewpayslip.html\', row.entity)" class="btn btn-primary btn-sm btn btn-warning" type="button" tooltip-animation="true" tooltip="viewpayslip"> <span class="glyphicon glyphicon-eye-open" ></span></a>'
					+
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/hospitalstaff/view_staff.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view Staff" > <span class="glyphicon glyphicon-user"></span></a>'
					+
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/hospitalstaff/staffpayment.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit staff" > <span class="glyphicon glyphicon-pencil"></span></a>'
					+
				
					'<a ng-click="grid.appScope.openViewattendance(\'modules/hospital/hospitalstaff/view_attendence.html\',row.entity)" class="btn btn-primary btn-sm btn" type="button" tooltip-animation="true" tooltip="Attendence"><span class="glyphicon glyphicon-ok"></span></a>'
					+
					'<a ng-click="grid.appScope.openViewleaves(\'modules/hospital/hospitalstaff/viewleaves.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view leaves"><span class="glyphicon glyphicon-eye-open"></span></a>'
					+
					'<a type="button" tooltip="Delete staff_payment" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'staff_payment\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
				} 
			]
		};	
		
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "staff", "staff", $scope.staffParams);
			}
		}
		
		$scope.openStaffpayment= function(url,data){
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
						date : dataService.sqlDateFormate(),
						user_id : $rootScope.userDetails.id,
						status:1,
						modified_date : dataService.sqlDateFormate()
						
						
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
					dataService.get(false,'transactions', accountParams).then(function(response) {
						console.log(response);
						modalOptions.previous_balance = response.data[0].previous_balance;
					})
					
				},
				getData:$scope.getData,	
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							
						}
					})
				},
				
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){
				
			})
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
			dataService.get(single,table,$scope.params, subobj, params, modalOptions).then(function(response) {
		//		console.log(response);
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
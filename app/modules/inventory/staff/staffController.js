'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants'];
    
    // This is controller for this view
	var staffController= function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
		//global scope objects
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.currentPage = 1;
		$scope.currentDate = dataService.currentDate;
		$rootScope.serverApiV2 = true;
		$rootScope.module = "inventory";
		
		
		$rootScope.moduleMenus = [
			{
				name : "Add Staff",
				path : "#/dashboard/inventory/staff/",
				events : {
					click : function(){
						return $scope.openModal("modules/inventory/staff/addstaff.html");
					}
				}
			},
			{
				name : "Add Attendance",
				path : "#/dashboard/inventory/staff/",
				events : {
					click : function(){
						return $scope.openModal("modules/inventory/staff/staff_attendence.html");
					}
				}
			},
			{
				name : "Add Leaves",
				path : "#/dashboard/inventory/staff/",
				events : {
					click : function(){
						return $scope.openModal("modules/inventory/staff/addleaves.html");
					}
				}
			},
			{
				name : "Pay by Staff",
				path : "#/dashboard/inventory/staff/",
				events : {
					click : function(){
						return $scope.openModal("modules/inventory/staff/pay_by_staff.html");
					}
				}
			},
			{
				name : "Pay for Staff",
				path : "#/dashboard/inventory/staff/",
				events : {
					click : function(){
						return $scope.openModal("modules/inventory/staff/pay_for_staff.html");
					}
				}
			},
			{
				name : "Holidays",
				path : "#/dashboard/inventory/staff/",
				events : {
					click : function(){
						return $scope.openModal("modules/inventory/staff/addholidays.html");
					}
				}
			},
			{
				name : "View Holidays",
				path : "#/dashboard/inventory/staff/",
				events : {
					click : function(){
						return $scope.openModal("modules/inventory/staff/view_holiday.html");
					}
				}
			},
		]
		
		$scope.staff = {
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
				    name:'name',
					width:200,
					filterHeaderTemplate: '<input id="name" class="form-control" ng-change="grid.appScope.filter(\'name\', name, \'staff\', \'staff\',true)" ng-model="name" placeholder="Name">',
                },
				{
				    name:'email',
					width:130,
					filterHeaderTemplate: '<input id="email" class="form-control" ng-change="grid.appScope.filter(\'email\', email, \'staff\', \'staff\',true)" ng-model="email" placeholder="Email">'
                },
				
			   {
				    name:'address',
					width:130,
					filterHeaderTemplate: '<input id="address" class="form-control" ng-change="grid.appScope.filter(\'address\', address, \'staff\', \'staff\',true)" ng-model="address" placeholder="Address">',
                },
				
				
				{
				 name:'city',
				 width:90,
				 filterHeaderTemplate: '<input id="city" class="form-control" ng-change="grid.appScope.filter(\'city\', city, \'staff\', \'staff\',true)" ng-model="city" placeholder="City">', 
                },
				{ 
				  name:'designation',
				  width:100,
					filterHeaderTemplate: '<input id="designation" class="form-control" ng-change="grid.appScope.filter(\'designation\', designation, \'staff\', \'staff\',true)" ng-model="designation" placeholder="Designation">'
				},
				{ 
				  name:'department',
				  width:120,
				  filterHeaderTemplate: '<select id="department" class="form-control" ng-change="grid.appScope.filter(\'department\', department, \'staff\', \'staff\',true)" ng-model="department">'
							+'<option value="" selected>--Select--</option>' 
							+'<option value="IT">IT</option>'
							+'<option value="CIVIL">CIVIL</option>'
							+'<option value="MECH">MECH</option>'
						+'</select>', 
				  filter: {
					   type: uiGridConstants.filter.SELECT,  
					  selectOptions: [ { value: 'IT', label: 'IT' }, { value: 'CIVIL', label: 'CIVIL'},{ value: 'MECH', label: 'MECH' }]
					} 
					
				},
				
				
				 { 
				 name:'Manage',
				 width:250,
				 filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'staff\', \'staff\')" ng-model="status">'
							 +'<option value="" selected>--Select--</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
				 filter: {
					   type: uiGridConstants.filter.SELECT,  
					  selectOptions: [ { value: '1', label: 'Active' }, { value: '0', label: 'Deleted' }
					  ]
					} ,
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/inventory/staff/viewpayslip.html\')" class="btn btn-primary btn-sm btn btn-warning" type="button" tooltip-animation="true" tooltip="Salary" > <span class="glyphicon glyphicon-eye-open"></span></a>'
					
					+'<a ng-click="grid.appScope.openModal(\'modules/inventory/staff/viewleaves.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view leaves"><span class="glyphicon glyphicon-eye-open"></span></a>'
					
					+'<a ng-click="grid.appScope.openModal(\'modules/inventory/staff/view_staff.html\',row.entity)" class="btn btn-primary btn-sm btn btn-warning" type="button" tooltip-animation="true" tooltip="View Staff"><span class="glyphicon glyphicon-eye-open"></span></a>'
					
					+'<a ng-click="grid.appScope.openModal(\'modules/inventory/staff/staff_attendence.html\',row.entity)" class="btn btn-primary btn-sm btn" type="button" tooltip-animation="true" tooltip="Attendence"><span class="glyphicon glyphicon-user"></span></a>'
					+'<a ng-click="grid.appScope.openModal(\'modules/inventory/staff/addstaff.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit staff" > <span class="glyphicon glyphicon-pencil"></span></a>'
					
					+ '<a type="button" tooltip="Delete record" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'staff\', \'status\',row.entity.status, row.entity.id)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
				} 
			]
		};
		$scope.openModal = function(url,data){
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				staffdate:{date : $scope.currentDate},
				date:{date : $scope.currentDate},
				addstaff : (data) ? {
					id : data.id,
					name : data.name,
					email : data.email,
					phone: data.phone,
					address: data.address,
					location: data.location,
					area: data.area,
					city: data.city,
					state: data.state,
					country: data.country,
					pincode: data.pincode,
					date : data.date,				
					designation: data.designation,
					department: data.department,
					salary: data.salary,
					deduction:data.deduction,
					advance:data.advance,
					loan:data.loan,
					staff_type:data.staff_type,
					staff_id:data.staff_id,
					modified_date:data.modified_date,
					registration_date:data.registration_date
				
								} : {
						date : dataService.sqlDateFormate()
					}, 
					
					postData : function(table, input){
						console.log(table, input);
						$rootScope.postData(table, input,function(response){
							if(response.status == "success"){
								$scope.getData(false, $scope.currentPage, 'staff','staff',$Scope.staffParams);
							}
						})
					},
					updateData : function(table, input, id){
						$rootScope.updateData(table, input, id, function(response){
							if(response.status == "success"){
								$scope.getData(false, $scope.currentPage, 'staff','staff',$Scope.staffParams);
							}
						})
					},
					formPart : 'personalDetails',
					showFormPart : function(formPart){
						$scope.formPart = formPart;
					}
				};
			
			
			modalService.showModal(modalDefault, modalOptions).then(function(){
				
			})
			
		}
		$scope.staffParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
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
			dataService.get(single,table,$scope.params, subobj, params, modalOptions).then(function(response) {
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
		$scope.orderBy = function(col, value, table, subobj){
			if(!$scope.params.orderBy) $scope.params.orderBy = {};
			$scope.params.orderBy[col] = value;
			$scope.getData($scope.currentPage, table, subobj, $scope.params);
		}
		
	 };
	// Inject controller's dependencies
	staffController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('staffController', staffController);
});
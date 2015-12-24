'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants','$http'];
    
    // This is controller for this view
	var staffController= function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants,$http) {
		//global scope objects
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.pageItems = 10;
		$scope.numPages = "";	
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");		
		$scope.currentPage = 1;
		$scope.currentDate = dataService.currentDate;
		$rootScope.serverApiV2 = true;
		$rootScope.module = "campus";	
			
		$scope.staffParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
			},
			cols : ["*"]
		}
		
		$rootScope.moduleMenus = [
			{
				name : "Add staff",
				events : {
					click : function(){
						return $scope.openModal("modules/campus/staff/addstaff.html");
					}
				}
			},	
			{
				name : "Add Attendance",
				events : {
					click : function(){
						return $scope.openstaffattendance("modules/campus/staff/staffattendence.html");
					}
				}
			},
			{
				name : "Add Leaves",
				events : {
					click : function(){
						return $scope.openstaffleaves("modules/campus/staff/addleaves.html");
					}
				}
			},
			{
				name : "Payment",
				events : {
					click : function(){
						return $scope.openstaffpayment("modules/campus/staff/addleaves.html");
					}
				}
			},
			{
				name : "Holidays",
				events : {
					click : function(){
						return $scope.openstaffholidays("modules/campus/staff/addholidays.html");
					}
				}
			}
			]
		$scope.staffList={
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{
					name:'SrNo', width:40,
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false,
					enableFiltering: false,	
				},
				{ 
					name:'staff_id',width:90,
					enableSorting: false, enableFiltering: true,
					filterHeaderTemplate: '<input id="staff_id" class="form-control" ng-change="grid.appScope.filter(\'staff_id\', staff_id, \'staff\', \'staffList\',true,grid.appScope.staffParams)" ng-model="staff_id" placeholder="Staff No">',
				},
				{ 
					name:'name',width:100,
					filterHeaderTemplate: '<input id="staff_name" class="form-control" ng-change="grid.appScope.filter(\'staff_name\', staff_name, \'staff\', \'staffList\',true,grid.appScope.staffParams)" ng-model="staff_name" placeholder="Staff Name">',
					/* cellTemplate : '<span>{{row.entity.staff_id}}</span>' */
				},
				{ 
					name:'email_id',width:120,
					filterHeaderTemplate: '<input id="email_id" class="form-control" ng-change="grid.appScope.filter(\'email_id\', email_id, \'staff\', \'staffList\',true,grid.appScope.staffParams)" ng-model="email_id" placeholder="Email ID">',
				},
				{ 
					name:'address',width:110,
					filterHeaderTemplate: '<input id="address" class="form-control" ng-change="grid.appScope.filter(\'address\', address, \'staff\', \'staffList\',true,grid.appScope.staffParams)" ng-model="address" placeholder="Address">',
				},
				{ 
					name:'city',width:100,
					filterHeaderTemplate: '<input id="city" class="form-control" ng-change="grid.appScope.filter(\'city\', city, \'staff\', \'staffList\',true,grid.appScope.staffParams)" ng-model="city" placeholder="City">',
				},
				{ 
					name:'Designation',width:110,
					filterHeaderTemplate: '<input id="joining_details" class="form-control" ng-change="grid.appScope.filter(\'joining_details\', joining_details, \'staff_view\', \'staffList\',true,grid.appScope.staffParams)" ng-model="joining_details" placeholder="Designation">',
					cellTemplate:'<span>{{row.entity.joining_details.post}}</span>'
				},
				{ 
					name:'dept_name',width:110,
					filterHeaderTemplate: '<input id="dept_name" class="form-control" ng-change="grid.appScope.filter(\'dept_name\', dept_name, \'staff_view\', \'staffList\',true,grid.appScope.staffParams)" ng-model="dept_name" placeholder="Department Name">',
				},
				{ 
					name:'contact_no',width:110,
					filterHeaderTemplate: '<input id="contact_no" class="form-control" ng-change="grid.appScope.filter(\'contact_no\', contact_no, \'staff\', \'staffList\',true,grid.appScope.staffParams)" ng-model="contact_no" placeholder="Contact No">',
				},
				{
					name:'Manage', 
					enableSorting: false, 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'staff\', \'staffList\',false,grid.appScope.staffParams)" ng-model="status">'
							+'<option value="" selected>Status</option>'
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					  options: [ { value: '1', label: 'Active' }, { value: '0', label: 'Delete' }]
					} ,
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/campus/staff/addstaff.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit Staff"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete Staff" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'staff\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+'<a ng-click="grid.appScope.openModal(\'modules/campus/staff/view_staff.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="View Staff"> <span class="glyphicon glyphicon-eye-open"></span></a>'
				}
			]
		};
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "staff", "staffList", $scope.staffParams);
			}
		}
							//add staff details
		$scope.openModal = function(url,data){
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions ={
				addstaff:(data)?{
					id:data.id,
					name:data.name,
					surname:data.surname,
					email_id:data.email_id,
					contact_no:data.contact_no,
					address:data.address,
					city:data.city,
					state:data.state,
					country:data.country,
					pincode:data.pincode,
					designation:data.designation,
					joining_details:data.joining_details,
					education:data.education,
					medical:data.medical,
					age:data.age,
					dob:data.dob,
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					hobbies:data.hobbies,
					joining_details :data.joining_details,
					education:data.education,
					medical:data.medical,
					specialization:data.specialization,
					experiance:data.experiance,
					attachments:data.attachments,
					dept_id:data.dept_id,
					bank_details:data.bank_details,
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					
				}:{
					user_id:$rootScope.userDetails.id,
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
				},
				postData : function(table, input){
						console.log(table, input);
						$rootScope.postData(table, input,function(response){
							if(response.status == "success"){
								$scope.getData(false, $scope.currentPage, 'staff','staff',$Scope.staffParams);
								$scope.getData(false, $scope.currentPage, 'staff_view','staff',$Scope.staffParams);
							}
						})
				},
					formPart : 'personalDetails',
					showFormPart : function(formPart, modalOptions){
						console.log(formPart);
						modalOptions.formPart = formPart;
					},
					getData : $scope.getData,
					addToObject : function(object,data,modalOptions){
						console.log(object,data,modalOptions);
					$rootScope.addToObject(object,modalOptions[data]);
					modalOptions[data] = {};
					},
				
				removeObject : $rootScope.removeObject,
					
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){
				
			})
		}
						/* staff attendence */
													
		$scope.openstaffattendance=function(url,data){
			var modalDefault={
				templateUrl:url,// apply template to modal
				size:'lg'
			};
			var modalOptions={
				staffattendence:(data)?{
					modified_date : dataService.sqlDateFormate(false,"datetime"),
				}:{
						user_id:$rootScope.userDetails.id,
						date : dataService.sqlDateFormate(false,"datetime"),
						modified_date : dataService.sqlDateFormate(false,"datetime"),
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
								/* staff Leaves */
													
		$scope.openstaffleaves=function(url,data){
			var modalDefault={
				templateUrl:url,// apply template to modal
				size:'lg'
			};
			var modalOptions={
				date : $scope.currentDate,
				addleaves:(data)?{
					modified_date : dataService.sqlDateFormate(false,"datetime"),
				}:{
					user_id:$rootScope.userDetails.id,
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
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

						/* staff Payment */		
		$scope.openstaffpayment=function(url,data){
			var modalDefault={
				templateUrl:url,// apply template to modal
				size:'lg'
			};
			var modalOptions={
				date : $scope.currentDate,
				staffpayment:(data)?{
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					
				}:{
					user_id:$rootScope.userDetails.id,
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
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
							/* add hollidays */
		$scope.openstaffholidays=function(url,data){
			var modalDefault={
				templateUrl:url,// apply template to modal
				size:'lg'
			};
			var modalOptions={
				date : $scope.currentDate,
				addholidays:(data)?{
					modified_date : dataService.sqlDateFormate(false,"datetime"),
				}:{
					user_id:$rootScope.userDetails.id,
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
				},	
				
				updateData : function(table, input, id){ 
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'staff','staffList',$scope.deptParams);
						}
					})
				},
				getData:$scope.getData,
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
	staffController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('staffController', staffController);
});
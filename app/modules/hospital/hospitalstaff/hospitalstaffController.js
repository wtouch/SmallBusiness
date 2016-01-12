'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants','$http'];
    
    // This is controller for this view
	var hospitalstaffController= function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants,$http) {
		
		//global scope objects
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.currentPage = 1;
		$scope.currentDate = dataService.currentDate;
		$rootScope.serverApiV2 = true;
		$rootScope.module = "hospital";
		
		$http.get("modules/hospital/config.json").success(function(response){
			console.log(response);
				$scope.staffConfig = response;
			})
		
		$rootScope.moduleMenus = [
			{
				name : "Staff",
				path : "#/dashboard/hospital/hospitalstaff/",
				events : {
					click : function(){
						return $scope.openModal("modules/hospital/hospitalstaff/addhospitalstaff.html");
					}
				}
			},
			{
				name : "Add Attendance",
				events : {
					click : function(){
						return $scope.openstaffattendance("modules/hospital/hospitalstaff/staffattendence.html");
					}
				}
			},
			{
				name : "Add Leaves",
				events : {
					click : function(){
						return $scope.openAddleaves("modules/hospital/hospitalstaff/addleaves.html");
					}
				}
			},
			{
				name : "Staff Payment",
				events : {
					click : function(){
						return $scope.openStaffpayment("modules/hospital/hospitalstaff/staffpayment.html");
					}
				}
			},
			{
				name : "Holidays",
				events : {
					click : function(){
						return $scope.openAddholiday("modules/hospital/hospitalstaff/addholidays.html");
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
				    name:'staff_type',
					width:100,
					filterHeaderTemplate: '<input id="staff_type" class="form-control" ng-change="grid.appScope.filter(\'staff_type\', staff_type, \'staff\', \'staff\',true)" ng-model="staff_type" placeholder="Staff type">'
                },
				{
				    name:'name',
					width:100,
					filterHeaderTemplate: '<input id="name" class="form-control" ng-change="grid.appScope.filter(\'name\', name, \'staff\', \'staff\',true)" ng-model="name" placeholder="Staff Name">',
                },
				{
				    name:'phone',
					width:150,
					filterHeaderTemplate: '<input id="phone" class="form-control" ng-change="grid.appScope.filter(\'phone\', phone, \'staff\', \'staff\',true)" ng-model="phone" placeholder="Phone">'
                },
				{
				    name:'email',
					width:150,
					filterHeaderTemplate: '<input id="email" class="form-control" ng-change="grid.appScope.filter(\'email\', email, \'staff\', \'staff\',true)" ng-model="email" placeholder="Email">'
                },
				{
				 name:'city',
				 width:90,
				 filterHeaderTemplate: '<input id="city" class="form-control" ng-change="grid.appScope.filter(\'city\', city, \'staff\', \'staff\',true)" ng-model="city" placeholder="City">', 
                },
			   {
				    name:'address.current_address',width:100,
					enableSorting: false, enableFiltering: false,	
                },
				
				
				
			    { 
				 name:'Manage', width:300,
				 filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'staff\', \'staff\')" ng-model="status">'
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
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/hospitalstaff/addhospitalstaff.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit staff" > <span class="glyphicon glyphicon-pencil"></span></a>'
					+
				
					'<a ng-click="grid.appScope.openViewattendance(\'modules/hospital/hospitalstaff/view_attendence.html\',row.entity)" class="btn btn-primary btn-sm btn" type="button" tooltip-animation="true" tooltip="Attendence"><span class="glyphicon glyphicon-ok"></span></a>'
					+
					'<a ng-click="grid.appScope.openViewleaves(\'modules/hospital/hospitalstaff/viewleaves.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view leaves"><span class="glyphicon glyphicon-eye-open"></span></a>'
					+
					'<a type="button" tooltip="Delete staff" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'staff\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
				} 
			]
		};
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "staff", "staff", $scope.staffParams);
			}
		}
		
			$scope.openModal = function(url,data){
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				staffdate:dataService.sqlDateFormate(),
				date:{date : $scope.currentDate},
				department: $scope.staffConfig,
				staff_type: $scope.staffConfig,
				addstaff : (data) ? {
					id : data.id,
					staff_id:data.staff_id,
					staff_type : data.staff_type,
					name:data.name,
					staff_date:data.staff_date,
					fees:data.fees,
					email:data.email,
					phone:data.phone,
					dob:data.dob,
					gender:data.gender,
					age:data.age,
					marital_status:data.marital_status,
					blood_group:data.blood_group,
					disability:data.disability,
					address:data.address,
					location:data.location,
					area:data.area,
					city:data.city,
					state:data.state,
					country:data.country,
					pincode:data.pincode,
					qualification:data.qualification,
					specification:data.specification,
					joining_date:data.joining_date,
					confirmation_date:data.confirmation_date,
					pan_no:data.pan_no,
					uan:data.uan,
					adhaar_no:data.adhaar_no,
					salary:data.salary,
					department:data.department,
					designation:data.designation
					} : {
					date : dataService.sqlDateFormate(),
					user_id : $rootScope.userDetails.id,
					modified_date : dataService.sqlDateFormate(),
					staff_date: dataService.sqlDateFormate()
					}, 
				
					postData : function(table, input){
						console.log(table, input);
						$rootScope.postData(table, input,function(response){
							if(response.status == "success"){
								$scope.getData(false, $scope.currentPage, 'staff','staff',$scope.staffParams);
							}
						})
					},
					updateData : function(table, input, id){
						$rootScope.updateData(table, input, id, function(response){
							if(response.status == "success"){
								$scope.getData(false, $scope.currentPage, 'staff','staff',$scope.staffParams);
							}
						})
					},
					formPart : 'personalDetails',
					showFormPart : function(formPart, modalOptions){
						console.log(formPart);
						modalOptions.formPart = formPart;
					},
					getData : $scope.getData,
					addToObject:function(object,data,modalOptions){
						$rootScope.addToObject(object,modalOptions[data]);
						modalOptions[data] = {};
					}, 
				
				removeObject : $rootScope.removeObject
				};
			
			
			modalService.showModal(modalDefault, modalOptions).then(function(){
				
			})
			
		}
		$scope.staffParams = {
			where : {
				user_id : $rootScope.userDetails.id,
				status : 1
			},
			cols : ["*"]
		}
		
		
		$scope.openstaffattendance = function(url,data){
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
			attendancedate:dataService.sqlDateFormate(),
				date:{date : $scope.currentDate},
				staffattendance : (data) ? {
	
				}:{
						date : dataService.sqlDateFormate(),
						user_id : $rootScope.userDetails.id,
						status:1,
						modified_date : dataService.sqlDateFormate(),
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
		
		$scope.openAddleaves = function(url,data){
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				leavedate: dataService.sqlDateFormate(),
				date:{date : $scope.currentDate},
				addleave : (data) ? {
					id : data.id,
					name : data.name,
					//user_id:data.user_id,
				}:{
						date : dataService.sqlDateFormate(),
						user_id : $rootScope.userDetails.id,
						status:1,
						modified_date : dataService.sqlDateFormate()
						
						
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
		$scope.openAddholiday = function(url,data){
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				staffdate: dataService.sqlDateFormate(),
				date:{date : $scope.currentDate},
				addholiday : (data) ? {
					id : data.id,
					name : data.name,
				}:{
						date : dataService.sqlDateFormate(),
						user_id : $rootScope.userDetails.id,
						status:1,
						modified_date : dataService.sqlDateFormate(),
						
						
				}, 
				getData:$scope.getData,	
				holidayParams :{
						where : {
							status : 1,
							user_id : $rootScope.userDetails.id,
							
						},
						cols : ["*"]
					},
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
		
		$scope.openPayslip = function(url,data){
				var modalDefault = {
				templateUrl: url, // apply template to modal
				size : 'lg'
				};
			var modalOptions = {
				date : dataService.sqlDateFormate(),
			viewPayslip:{
						user_id : $rootScope.userDetails.id,
						salary:data.salary,
						name:data.name,
						staff_id : data.staff_id,
						date : data.date,
						//debit_amount:data.debit_amount
					},
					
				getData : $scope.getData,
				paysalaryParams : {
						where : {
							status : 1,
							user_id : $rootScope.userDetails.id,
							reference_id : data.id,
							type : "staff_debit" 
						},
						cols : ["*"]
					},
			 myFunction:function(datetime) {
				 console.log(datetime);
						var month = new Array();
						month[0] = "January";
						month[1] = "February";
						month[2] = "March";
						month[3] = "April";
						month[4] = "May";
						month[5] = "June";
						month[6] = "July";
						month[7] = "August";
						month[8] = "September";
						month[9] = "October";
						month[10] = "November";
						month[11] = "December";
					var d = new Date(datetime);
					var n = month[d.getMonth()];
					return n;
					}
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){
			})
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
		
			$scope.openSalary = function(url, data){
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
			attendancedate:dataService.sqlDateFormate(),
				date:{date : $scope.currentDate},
				paysalary : {
					staff_id : data.staff_id,
					salary : data.salary,
					date : dataService.sqlDateFormate(),
					modified_date : dataService.sqlDateFormate(),
					user_id : $rootScope.userDetails.id,
					status:1
				},
				
				staffleavesParams : {
					where : {
						status : 1,
						user_id : $rootScope.userDetails.id,
						staff_id : data.staff_id,
						//type : "Unpaid" // staff_dr
						
					},
					cols : ["*"]
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
				payableDays : function(modalOptions){
					var obj = modalOptions.paysalary;
					console.log(obj.working_day, obj.paid_leaves, obj.unpaid_leaves);
					obj.payable_day = parseInt(obj.working_day) - parseInt(obj.unpaid_leaves);
					
					obj.cms = (parseFloat(obj.salary) / obj.working_day * obj.payable_day).toFixed(2);
					
					obj.basic=parseFloat(obj.cms)*0.3;
					console.log(obj.basic);
					
					obj.da=parseInt(obj.cms)*0.1;
					console.log(obj.da);
					
					obj.hra=parseFloat(obj.cms)*0.3;
					console.log(obj.hra);
					
					obj.cca=(parseFloat(obj.cms)*(30-(800*100/parseInt(obj.cms)))/100).toFixed(2);
					console.log(obj.cca);
					
					obj.conveyance=800;
					console.log(obj.conveyance);
					
					obj.total=(parseFloat(parseFloat(obj.basic)+parseFloat(obj.da)+parseFloat(obj.hra)+parseFloat(obj.cca)+parseFloat(obj.conveyance))).toFixed(2);
					console.log(obj.total);
					
					obj.pf=parseFloat(obj.basic)*0.12;
					console.log(obj.pf);
					
						if(obj.salary>=15000)
						{
							obj.esic=0;
								console.log(obj.esic);
						}
						else{
							obj.esic=(parseFloat(obj.cms)*0.0175).toFixed(2);
								console.log(obj.esic);
						}
						
						obj.pt=175;
						console.log(obj.pt);
						
						obj.td=(parseFloat(obj.pf)+parseFloat(obj.esic)+parseFloat(obj.pt)).toFixed(2);
						console.log(obj.td);
						
						obj.nsp=parseFloat(obj.total)-parseFloat(obj.td);
						obj.type="staff_Debit";
						obj.category="salary";
					console.log(obj.nsp);
				},
				getData:$scope.getData,	
				postData : function(table, input){
					console.log(table, input);
							$scope.transData  = {};
							$scope.transData.user_id=input.user_id;
							$scope.transData.modified_date=input.modified_date;
							$scope.transData.date=input.date;
							$scope.transData.balance=input.balance;
							$scope.transData.account_id=input.account_id;
							$scope.transData.debit_amount = input.nsp;
							$scope.transData.type=input.type;
							$scope.transData.reference_id=input.staff_id;
							$scope.transData.description={
								working_day:input.working_day,
								unpaid_leaves:input.unpaid_leaves,
								paid_leaves:input.paid_leaves,
								payable_day:input.payable_day,
								cms:input.cms,
								basic : input.basic,
								da :input.da,
								hra:input.hra,
								esic:input.esic,
								pf:input.pf,
								pt:input.pt,
								cca:input.cca,
								td:input.td,
								nsp:input.nsp,
								conveyance:input.conveyance,
								total:input.total,
							};
							console.log($scope.transData);
							$rootScope.postData("transactions", $scope.transData,function(response){
							});
						},
					
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){
				
			})
		}
		
		$scope.openViewattendance = function(url,data){
				var modalDefault = {
				templateUrl: url, // apply template to modal
				size : 'lg'
				};
			var modalOptions = {
				dataS :data,
				date : dataService.sqlDateFormate(),
				viewattendance:{
						user_id : $rootScope.userDetails.id,
						name:data.name,
						staff_id : data.staff_id,
						date : data.date,
						attendance_date:data.attendance_date,
						login_time:data.login_time,
						logout_time:data.logout_time
					},
					
				getData : $scope.getData,
					attendanceParams : {
						where : {
							status : 1,
							user_id : $rootScope.userDetails.id,
							staff_id:data.id
						},
						cols : ["*"]
					}
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){
			})
		}
		
			$scope.openViewleaves = function(url,data){
				var modalDefault = {
				templateUrl: url, // apply template to modal
				size : 'lg'
				};
			var modalOptions = {
				date : dataService.sqlDateFormate(),
			viewleaves:{
						user_id : $rootScope.userDetails.id,
						name:data.name,
						staff_id : data.staff_id,
						date : data.date,
						//debit_amount:data.debit_amount
					},
					
				getData : $scope.getData,
					leaveParams : {
						where : {
							status : 1,
							user_id : $rootScope.userDetails.id,
								staff_id:data.id
						
						},
						cols : ["*"]
					}
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
	hospitalstaffController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('hospitalstaffController', hospitalstaffController);
});
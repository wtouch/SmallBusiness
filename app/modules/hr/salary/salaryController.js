'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants','$http'];
    
    // This is controller for this view
	var salaryController= function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants,$http) {
		
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
				name : "Add Salary",
				path : "#/dashboard/hr/salary",
				events : {
				click : function(){
						return $scope.openSalary("modules/hr/salary/addsalary.html");
					}
				} 
			},	
		]
		
			$scope.staffsalary= {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{ name:'SrNo',
				  width:50,
				  enableSorting: false,
				  enableFiltering: false, 
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",
					filter: {
					}
				},
				{
				    name:'date',
					width:100,enableSorting: false,enableFiltering: false
                },
				{ name:'name',width:100,
				enableSorting: false,enableFiltering: false,
				},
				{ name:'type',width:100,
				enableSorting: false,enableFiltering: false,
				},
				{ name:'category',width:100,
				enableSorting: false,enableFiltering: false,
				},
				{ name:'description.working_day',width:100,
				enableSorting: false,enableFiltering: false,
				},
				{ name:'description.paid_leaves',width:200,
				enableSorting: false,enableFiltering: false,
				
				},
				{ name:'description.unpaid_leaves',width:100,
				enableSorting: false,enableFiltering: false,
				},
				{ name:'description.cms',width:100,
				enableSorting: false,enableFiltering: false,
				},
				{ name:'description.nsp',width:100,
				enableSorting: false,enableFiltering: false,
				},
			    { 
				 name:'Manage', width:200,
				 filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'transaction\', \'staffsalary\')" ng-model="status">'
							 +'<option value="" selected>--status--</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
				 filter: {
					   type: uiGridConstants.filter.SELECT,  
					  selectOptions: [ { value: '1', label: 'Active' }, { value: '0', label: 'Deleted' }
					  ]
					},
					cellTemplate :  
					'<a ng-click="grid.appScope.openPayslip(\'modules/hr/salary/viewpayslip.html\', row.entity)" class="btn btn-primary btn-sm btn btn-warning" type="button" tooltip-animation="true" tooltip="viewpayslip"> <span class="glyphicon glyphicon-eye-open" ></span></a>'
					+
					'<a type="button" tooltip="Delete salary" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'transaction\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
				} 
			]
		};	
		
	/*	$scope.getData1 = function(single, page, table, subobj, params, modalOptions){
			$rootScope.module = "inventory";
			$scope.post(jfkd,fjdk,fjdk,fjdk,function(){
				$rootScope.module = "hr";
			});*/
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "transaction", "staffsalary", $scope.staffsalaryParams);
			}
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
					//staff_id : data.staff_id,
					//salary : data.salary,
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					user_id : $rootScope.userDetails.id,
					status:1
				},
				
				staffsalaryParams : {
					where : {
						status : 1,
						user_id : $rootScope.userDetails.id,
						//staff_id : data.staff_id,
						type : 'staff_debit', // staff_dr
						category :'Salary',
						module_name:'inventory'
					},
						/* join: [
								{
									joinType : 'INNER JOIN',
									joinTable : "hr_staff",
									joinOn : {
										id : "t0.staff_id"
									},
									cols : ['name']
								}],  
			 */
					cols : ["*"]
				},
				staffParams : {
					where : {
						status : 1,
						user_id : $rootScope.userDetails.id,
						//staff_id : data.staff_id,
						//type : "Unpaid" // staff_dr
						//category:'salary'
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
				dataService.get(false,'transaction', accountParams).then(function(response) {
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
				$rootScope.module = "inventory";
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
							$scope.transData.category='salary';
							$scope.transData.payment_type=input.payment_type;
							$scope.transData.description={
								salary_date:input.salary_date,
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
							$rootScope.postData("transaction", $scope.transData,function(response){
								if(response.status == "success"){
									$rootScope.module = "hr";
								}
							});
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
							type : "staff_debit" ,
							module_name:'inventory'
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
	salaryController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('salaryController', salaryController);
});
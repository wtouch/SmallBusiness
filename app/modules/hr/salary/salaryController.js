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
		
		
		
		
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "staff", "staff", $scope.staffParams);
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
	salaryController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('salaryController', salaryController);
});
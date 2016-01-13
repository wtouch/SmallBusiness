'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants','$http'];
    
    // This is controller for this view
	var leavesController= function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants,$http) {
		
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
				name : "Leaves",
				path : "#/dashboard/hr/leaves",
				events : {
					click : function(){
						return $scope.openAddleaves("modules/hr/leaves/addleaves.html");
					}
				} 
			},
			
			
		]
		
		
		$scope.staffleaves= {
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
				    name:'leave_date',
					width:100,
					filterHeaderTemplate: '<input id="leave_date" class="form-control" ng-change="grid.appScope.filter(\'leave_date\', leave_date, \'staffleaves\', \'staffleaves\',true)" ng-model="leave_date" placeholder="leave_date">'
                },
				{
				    name:'name',
					width:100,
					filterHeaderTemplate: '<input id="name" class="form-control" ng-change="grid.appScope.filter(\'name\', name, \'staff\', \'staff\',true)" ng-model="name" placeholder="name">'
                },
				{
				    name:'approved_by',
					width:100,
					filterHeaderTemplate: '<input id="approved_by" class="form-control" ng-change="grid.appScope.filter(\'approved_by\', approved_by, \'staffleaves\', \'staffleaves\',true)" ng-model="approved_by" placeholder="approved_by">',
                },
				{
				    name:'reason',
					width:150,
					filterHeaderTemplate: '<input id="reason" class="form-control" ng-change="grid.appScope.filter(\'reason\', reason, \'staffleaves\', \'staffleaves\',true)" ng-model="reason" placeholder="reason">'
                },
				{
				    name:'leaves_for',
					width:150,
					filterHeaderTemplate: '<input id="leaves_for" class="form-control" ng-change="grid.appScope.filter(\'leaves_for\', leaves_for, \'staffleaves\', \'staffleaves\',true)" ng-model="leaves_for" placeholder="leaves_for">'
                },
				{
				    name:'type',
					width:150,
					filterHeaderTemplate: '<input id="type" class="form-control" ng-change="grid.appScope.filter(\'type\', type, \'staffleaves\', \'staffleaves\',true)" ng-model="type" placeholder="type">'
                },
				{
				    name:'leavestatus',
					width:150,
					filterHeaderTemplate: '<input id="leavestatus" class="form-control" ng-change="grid.appScope.filter(\'leavestatus\', leavestatus, \'staffleaves\', \'staffleaves\',true)" ng-model="leavestatus" placeholder="leavestatus">'
                },
			    { 
				 name:'Manage', width:300,
				 filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'staffleaves\', \'staffleaves\')" ng-model="status">'
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
					'<a ng-click="grid.appScope.openAddleaves(\'modules/hr/leaves/addleaves.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit leaves" > <span class="glyphicon glyphicon-pencil"></span></a>'
					+
					'<a ng-click="grid.appScope.openViewleaves(\'modules/hr/leaves/viewleaves.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view leaves"><span class="glyphicon glyphicon-eye-open"></span></a>'
					+
					'<a type="button" tooltip="Delete staffleaves" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'staffleaves\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
				} 
			]
		};	
		
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "staff", "staff", $scope.staffParams);
			}
		}
		
		$scope.staffParams = {
			where : {
				user_id : $rootScope.userDetails.id,
				status : 1
			},
			cols : ["*"]
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
	leavesController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('leavesController', leavesController);
});
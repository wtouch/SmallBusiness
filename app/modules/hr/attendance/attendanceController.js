'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants','$http'];
    
    // This is controller for this view
	var attendanceController= function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants,$http) {
		
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
	
			
		]
		
	
		$scope.staffattendance = {
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
				/* {
				    name:'name',
					width:100,
					filterHeaderTemplate: '<input id="name" class="form-control" ng-change="grid.appScope.filter(\'name\', name, \'staff\', \'staff\',true)" ng-model="name" placeholder="name">'
                }, */
				{ name:'name',enableSorting: false ,
				width:150,
				filterHeaderTemplate: '<select id="name" class="form-control" ng-change="grid.appScope.filter(\'staff_id\', staff_id, \'staffattendance\', \'staffattendance\',true,grid.appScope.staffattendanceParams)" ng-model="staff_id" ng-options="item.id as item.name for item in grid.appScope.staffParams">' 
							+'<option value="">Select staff</option>'
						+'</select>',
					},
				{
				    name:'attendance_date',
					width:100,
					filterHeaderTemplate: '<input id="attendance_date" class="form-control" ng-change="grid.appScope.filter(\'attendance_date\', attendance_date, \'staffattendance\', \'staffattendance\',true)" ng-model="attendance_date" placeholder="attendance_date">'
                },
				
				{
				    name:'login_time',
					width:100,
					filterHeaderTemplate: '<input id="login_time" class="form-control" ng-change="grid.appScope.filter(\'login_time\', login_time, \'staffattendance\', \'staffattendance\',true)" ng-model="login_time" placeholder="login_time">',
                },
				{
				    name:'logout_time',
					width:150,
					filterHeaderTemplate: '<input id="logout_time" class="form-control" ng-change="grid.appScope.filter(\'logout_time\', logout_time, \'staffattendance\', \'staffattendance\',true)" ng-model="logout_time" placeholder="logout_time">'
                },
			    { 
				 name:'Manage', width:300,
				 filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'staffattendance\', \'staffattendance\')" ng-model="status">'
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
					'<a ng-click="grid.appScope.openModal(\'modules/hr/attendance/staffattendance.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit staff" > <span class="glyphicon glyphicon-pencil"></span></a>'
					+
				
					'<a ng-click="grid.appScope.openViewattendance(\'modules/hr/attendance/view_attendence.html\',row.entity)" class="btn btn-primary btn-sm btn" type="button" tooltip-animation="true" tooltip="Attendence"><span class="glyphicon glyphicon-ok"></span></a>'
					
					+
					'<a type="button" tooltip="Delete staffattendance" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'staffattendance\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
				} 
			]
		};
		
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "staffattendance", "staffattendance", $scope.staffParams);
			}
		}
		
		
		$scope.staffattendanceParams = {
			where : {
				user_id : $rootScope.userDetails.id,
				status : 1
			},
			join: [
				{
					joinType : 'INNER JOIN',
					joinTable : "hr_staff",
					joinOn : {
						staff_id : "t0.staff_id"
					},
					cols : ['name']
				}],
			
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
	attendanceController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('attendanceController', attendanceController);
});
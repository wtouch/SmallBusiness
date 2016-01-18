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
		$scope.today = new Date();
		$scope.todayDt = $scope.today.getFullYear() + "-" + ($scope.today.getMonth() + 1) + "-" + $scope.today.getDate();
		$scope.duration = {start : $scope.todayDt};
		$scope.toDate = function(date){
			return new Date(date);
		}
		
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
				{
				    name:'attendance_date',
					width:200,
						enableSorting: false,enableFiltering: false,
                },
				{
				    name:'name',
					width:100,	enableSorting: false,enableFiltering: false,
					},
				{
				    name:'login_time',
					width:100,	enableSorting: false,enableFiltering: false,
                },
				{
				    name:'logout_time',
					width:150,	enableSorting: false,enableFiltering: false,
					
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
				'<a ng-click="grid.appScope.editData(row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit staff attendance"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+
				
					'<a type="button" tooltip="Delete staffattendance" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'staffattendance\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
				} 
			]
		};
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "staffattendance", "staffattendance", $scope.staffattendanceParams);
			}
		}
		$scope.editData = function(object){
			//$scope.isCollapsed = true;
			$scope.attendance = object;
		}
		$scope.attendance = ($scope.attendance)?
		$scope.attendance:{
			user_id : $rootScope.userDetails.id,
			date : dataService.sqlDateFormate(false,"datetime"),
			modified_date : dataService.sqlDateFormate(false,"datetime"),
		} 
		
		
		$scope.staffattendanceParams ={
			where : {
				user_id : $rootScope.userDetails.id,
				status : 1
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
		} ;
		 
		$scope.staffParams = {
			where : {
				user_id : $rootScope.userDetails.id,
				status : 1,
			},
			cols : ["*"]
		}  
			$scope.postData = function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'staffattendance','staffattendance',$scope.staffattendanceParams);
							$scope.attendance = {
								user_id : $rootScope.userDetails.id,
								date : dataService.sqlDateFormate(false,"datetime"),
								modified_date : dataService.sqlDateFormate(false,"datetime"),};
						}
					})
			},
		$scope.updateData = function(table, input, id){
					console.log(table, input, id);	
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){ 
							$scope.attendance = {
								user_id : $rootScope.userDetails.id,
								date : dataService.sqlDateFormate(false,"datetime"),
								modified_date : dataService.sqlDateFormate(false,"datetime")};
								$scope.getData(false, $scope.currentPage, 'staffattendance','staffattendance',$scope.staffattendanceParams);
						}
					})
				},
				
	/*$scope.setTransactionDate = function(transfer){
			$scope.staffattendanceParams.whereRaw = ["t0.date BETWEEN '"+dataService.sqlDateFormate(transfer.fromDate)+"' AND '" + dataService.sqlDateFormate(transfer.toDate)
			+"'"];
			$scope.getData(false, $scope.currentPage, "staffattendance", "staffattendance", $scope.staffattendanceParams);
		}
		
		 $scope.calcDuration = function(type, duration){
			var curDate = new Date();
			var dateS = new Date(duration.start);
				var dateE = new Date(duration.end);
				var startDt = dateS.getFullYear() + "-" + (dateS.getMonth() + 1) + "-" + dateS.getDate();
				var endtDt = dateE.getFullYear() + "-" + (dateE.getMonth() + 1) + "-" + (dateE.getDate() + 1 );
				var setDate={ "fromDate" : startDt,"toDate" : endtDt}
				$scope.setTransactionDate(setDate);
		} */ 
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
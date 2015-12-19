'use strict';

define(['app'], function (app) {
	var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService', 'uiGridConstants'];
    
   var roomController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService, uiGridConstants) {
		$rootScope.metaTitle = "campus";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.alerts = [];
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");
		$rootScope.serverApiV2 = true;
		$rootScope.module = "campus";
	   
	  $rootScope.moduleMenus = [
			{
				name : "Add Room",
				path : "#/dashboard/campus/department/room",
				SubTitle :"Room",
				events : {
					click : function(){
						return $scope.openModal("modules/campus/department/room/addroom.html");
					}
				}
			}
		]
		$scope.roomList = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{
					name:'SrNo', width:80,
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false,
					enableFiltering: false,	
				},
				{ 
					name:'room_no',width:150,
					enableSorting: false, enableFiltering: true,
					filterHeaderTemplate: '<input id="room_no" class="form-control" ng-change="grid.appScope.filter(\'room_no\', room_no, \'room\', \'roomList\',true,grid.appScope.roomParams)" ng-model="room_no" placeholder="Room No">',
				},
				{ 
					name:'build_id',width:150,
					enableSorting: false, enableFiltering: true,
					filterHeaderTemplate: '<input id="build_id" class="form-control" ng-change="grid.appScope.filter(\'build_id\', build_id, \'building\', \'buildingList\',true,grid.appScope.buildParams)" ng-model="build_id" placeholder="Building No">',
				},
				{ 
					name:'build_name',enableSorting: false, enableFiltering: true,
					filterHeaderTemplate: '<input id="build_name" class="form-control" ng-change="grid.appScope.filter(\'build_name\', build_name, \'building\', \'buildingList\',true,grid.appScope.buildParams)" ng-model="build_name" placeholder="Building Name">',
				},
				{ 
					name:'floor_no',width:150,
					filterHeaderTemplate: '<input id="floor_no" class="form-control" ng-change="grid.appScope.filter(\'floor_no\', floor_no, \'building\', \'buildingList\',true,grid.appScope.buildParams)" ng-model="floor_no" placeholder="Floor No">',
				},
				{
					name:'Manage', 
					enableSorting: false, 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'room\', \'roomList\',false,grid.appScope.roomParams)" ng-model="status">'
							+'<option value="" selected>Status</option>'
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					  options: [ { value: '1', label: 'Active' }, { value: '0', label: 'Delete' }]
					} ,
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/campus/department/room/addroom.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit Room"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete Room" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'room\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+'<a ng-click="grid.appScope.openModal(\'modules/campus/department/room/viewroom.html\',row.entity)" class="btn btn-info btn-sm" type="button" tooltip-animation="true" tooltip="View Room"> <span class="glyphicon glyphicon-eye-open"></span></a>'
				}
			]
		};
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "room", "roomList", $scope.roomParams);
			}
		}
		
		/* post And update data */
		$scope.openModal = function(url,data){
			var modalDefault = {
				templateUrl:url,	// apply template to modal
				size : 'lg'
			};
			console.log(data);
			var modalOptions = {
				date : $scope.currentDate,
				roomData : (data)?{
						id : data.id
					}:{},
					addRoom : (data) ? {
						id : data.id,
						user_id : data.user_id,
						build_id : data.build_id,
						room_id : data.room_id,
						room_no : data.room_no,
						modified_date : dataService.sqlDateFormate(false,"datetime"),
						description : data.description,
					} : {
						date : dataService.sqlDateFormate(false,"datetime"),
						modified_date : dataService.sqlDateFormate(false,"datetime"),
					},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'room','roomList',$scope.roomParams);
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'room','roomList',$scope.roomParams);
						}
					})
				},
				getData : $scope.getData
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){	
			})
		}
		
	   // For Get (Select Data from DB)
		/*get data */
		 $scope.getData = function(single, page, table, subobj, params, modalOptions) {
			$scope.params = (params) ? params : {
				where : {
					status : 1,
					user_id : $rootScope.userDetails.id,
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
	roomController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('roomController', roomController);
	
});
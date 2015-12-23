'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$location','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants'];
    
    // This is controller for this view
	var timetableController= function ($scope,$location,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
		//global scope objects
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.pageItems = 10;
		$scope.numPages = "";	
		$scope.currentPage = 1;
		/* $scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS"); */
		$rootScope.serverApiV2 = true;
		$rootScope.module = "campus";
		$scope.currentDate = dataService.currentDate;
		
		
		
		$rootScope.moduleMenus = [
			{
				name : "Add Timetable",
				SubTitle :"Add Timetable",
				events : {
					click : function(){
						return $scope.openModal("modules/campus/timetable/addtimetable.html");
					}
				}
			}
		]
		
		$scope.currentPath = $location.path();
		
		var dueDate = new Date();
		dueDate.setDate(dueDate.getDate() + 10);
		var dueMonth = dueDate.getMonth() + 1;
		dueMonth = (dueMonth <= 9) ? '0' + dueMonth : dueMonth;
		$scope.dueDate = dueDate.getFullYear() + "-" + dueMonth + "-" + dueDate.getDate();
		
		$scope.timetableList = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{
					name:'SrNo',width:50,
					enableSorting: false,
					enableFiltering: false, 
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>"
					
				},
				{ 
					name:'dept_name',enableSorting: false ,
					filterHeaderTemplate: '<select id="dept_name" class="form-control" ng-change="grid.appScope.filter(\'dept_name\', dept_name, \'timetable_view\', \'timetableList\',false, grid.appScope.timetableParams)" ng-model="dept_name" ng-options="item.dept_name as item.dept_name for item in grid.appScope.departmentList">'
				},
				{ 
					name:'class_name',enableSorting: false ,
					filterHeaderTemplate: '<select id="name" class="form-control" ng-change="grid.appScope.filter(\'class_id\', class_id, \'timetable_view\', \'timetableList\',true, grid.appScope.timetableParams)" ng-model="class_id" ng-options="item.id as item.class_name for item in grid.appScope.classList">' 
				},	
				{ 
					name:'division_name',enableSorting: false ,
					filterHeaderTemplate: '<select id="name" class="form-control" ng-change="grid.appScope.filter(\'div_id\', div_id, \'timetable_view\', \'timetableList\',true, grid.appScope.timetableParams)" ng-model="div_id" ng-options="item.id as item.class_name for item in grid.appScope.classList">' 
				},				
				 { name:'classRoom',enableSorting: false ,
				filterHeaderTemplate: '<select id="room_id" class="form-control" ng-change="grid.appScope.filter(\'room_id\', room_id, \'timetable_view\', \'timetableList\',true, grid.appScope.timetableParams)" ng-model="room_id" ng-options="item.id as item.room_no for item in grid.appScope.roomList">'
							+'<option value="" selected>Room No</option>'
						+'</select>',
				},
				
				{ name:'Staff_name',enableSorting: false ,
				filterHeaderTemplate: '<select id="staff_id" class="form-control" ng-change="grid.appScope.filter(\'staff_id\', staff_id, \'timetable_view\', \'timetableList\',true, grid.appScope.timetableParams)" ng-model="staff_id" ng-options="item.id as item.staff_name for item in grid.appScope.staffList">'
							+'<option value="" selected>Staff Name</option>'
						+'</select>',
				},
				
				{ name:'date',
				enableSorting: true, enableFiltering: false,
					filterHeaderTemplate: '<input id="date" class="form-control" ng-change="grid.appScope.filter(\'date\', date, \'timetable_view\', \'timetableList\',true, grid.appScope.timetableList)" ng-model="date" placeholder="date">',
				},
				{
					name:'day',
					enableSorting: false,
					filterHeaderTemplate: '<select id="day" class="form-control" ng-change="grid.appScope.filter(\'day\', day, \'timetable_view\', \'timetableList\',true, grid.appScope.timetableParams);grid.appScope.timetableday = grid.appScope.campusConfig[day]" ng-model="day">'
							+'<option value="" selected>day</option>'
							+'<option value="Sunday">Sunday</option>'
							+'<option value="Monday">Monday</option>'
							+'<option value="Tuesday">Tuesday</option>'
							+'<option value="Wendesday">Wendesday</option>'
							+'<option value="Thursday">Thursday</option>'
							+'<option value="Friday">Friday</option>'
							+'<option value="Saturday">Saturday</option>'
						+'</select>'
				},
				{ name:'timefrom',
					filterHeaderTemplate: '<input id="time" class="form-control" ng-change="grid.appScope.filter(\'time\', time, \'timetable_view\', \'timetableList\',true, grid.appScope.timetableList)" ng-model="timefrom" placeholder="timefrom">',
				},
				{ name:'timeto',
				
					filterHeaderTemplate: '<select id="timeto" class="form-control" ng-change="grid.appScope.filter(\'timeto\', timeto, \'timetable_view\', \'timetableList\',true, grid.appScope.timetableList)" ng-model="timeto" placeholder="timeto">',
				},
				,	 
				{ name:'Manage', 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'timetable_view\', \'timetableList\',false, grid.appScope.timetableParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>',
				
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/campus/timetable/addtimetable.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit timetable" > <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete record" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'timetable\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'+ '<a ng-click="grid.appScope.openModal(\'modules/campus/timetable/viewtimetable.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view  vendor" > <span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
					
				}
			]
		};
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				console.log($scope.timetableParams);
				$scope.getData(false, $scope.currentPage, "timetable_view", "timetableList", $scope.timetableParams);
			}
		}
		$scope.openModal = function(url,data){
				var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				date : $scope.currentDate,
				timetableData : (data)?{
						id : data.id
					}:{},
				addtimetable : (data) ? {
					id : data.id,
					user_id : data.user_id,
					timetable_id :data.timetable_id,
					dept_id:data.dept_id,
					class_id :data.class_id,
					div_id:data.div_id,
					day:data.day,
					date : data.date,
					timefrom:data.timefrom,
					timeto:data.timeto,
					room_id:data.room_id,
					staff_id:data.staff_id,
					
			} : {
					user_id : $rootScope.userDetails.user_id,
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					dept_id : 1,
				},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'timetable_view','timetableList',$scope.timetableParams);
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'timetable_view','timetableList',$scope.timetableParams);
						}
					})
				},
				getData : $scope.getData,
				classParams : {
					where : {
					user_id : $rootScope.userDetails.id,
					status:1,
				},
				cols : ["*"]
				}
			};
			
			modalService.showModal(modalDefault, modalOptions).then(function(){
				
			})
	}	
	$scope.getData = function(single, page, table, subobj, params, modalOptions) {
		console.log(params);
			$scope.params = (params) ? params : {
				where : {
					user_id : $rootScope.userDetails.id,
					status:1,
				},
				cols : ["*"]
			};
			if(page){
				dataService.extendDeep($scope.params, {
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
		/* filter  dynamic*/
		$scope.filter = function(col, value, table, subobj, search, params){
			value = (value) ? value : undefined;
			if(!params) params = {};
			$rootScope.filterData(col, value, search, function(response){
				dataService.extendDeep($scope.params, params, response);
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
	timetableController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('timetableController', timetableController);
});

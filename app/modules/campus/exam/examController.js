'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$location','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants'];
    
    // This is controller for this view
	var examController= function ($scope,$location,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
		//global scope objects
		$rootScope.metaTitle = "campus";
		$scope.maxSize = 5;
		$scope.alerts = [];
		$scope.currentPage = 1;
		$scope.pageItems = 20;
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");
		$rootScope.serverApiV2 = true;
		$rootScope.module = "campus";
		$rootScope.moduleMenus = [
			{
				name : "Add exam",
				SubTitle :"Add exam",
				events : {
					click : function(){
						return $scope.openModal("modules/campus/exam/addexam.html");
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
		
		$scope.examList = {
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
					name:'type',enableSorting: false,enableFiltering: true,
					filterHeaderTemplate: '<select id="type" class="form-control" ng-change="grid.appScope.filter(\'type\', type, \'exam\', \'examList\',true, grid.appScope.examParams)" ng-model="type">' 
							+'<option value="">Select Type</option>'
							  +'<option value="Unit Test">Unit Test</option>'
						      +'<option value="Semester">Semester</option>'
						      +'<option value="Annual">Annual</option>'
						+'</select>'
				},
				{ 
					name:'dept_name',enableSorting: false ,
					filterHeaderTemplate: '<select id="dept_name" class="form-control" ng-change="grid.appScope.filter(\'dept_id\', dept_id, \'exam\', \'examList\',true, grid.appScope.examParams)" ng-model="dept_id" ng-options="item.id as item.dept_name for item in grid.appScope.departmentList">'
					+'<option value="" selected>Dept Name</option>'
						+'</select>',
						//cellTemplate:'<span>{{row.entity.dept_name}}</span>'
				},
				{ 
					name:'class_name',enableSorting: false ,
					filterHeaderTemplate: '<select id="class_name" class="form-control" ng-change="grid.appScope.filter(\'class_id\', class_id, \'exam\', \'examList\',true, grid.appScope.examParams)" ng-model="class_id" ng-options="item.id as item.class_name for item in grid.appScope.classList">' 
					+'<option value="" selected>class Name</option>'
						+'</select>',
				},	
				
				{ name:'timefrom',enableSorting: false,
					filterHeaderTemplate: '<input id="timefrom" class="form-control" ng-model="timefrom" placeholder="timefrom">',
					
				}, 
				{ name:'timeto',enableSorting: false,
					filterHeaderTemplate: '<input id="timeto" class="form-control" ng-model="timeto" placeholder="timeto">',
					
				}, 
				
					 
				{ name:'manage',enableSorting: false,enableFiltering: true,
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'exam\', \'examList\',false,grid.appScope.examParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>',
				
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/campus/exam/addexam.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit exam" > <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete stock" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'exam\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+'<a ng-click="grid.appScope.openModal(\'modules/campus/exam/viewexam.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view  exam" ><span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
					
				}
			]
		};
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				console.log($scope.examParams);
				$scope.getData(false, $scope.currentPage, "exam", "examList", $scope.examParams);
			}
		}
		$scope.openModal = function(url,data){
				var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				date : $scope.currentDate,
				examData : (data)?{
						id : data.id
					}:{},
				addexam : (data) ? {
					id : data.id,
					user_id : data.user_id,
					exam_id :data.exam_id,
					type:data.type,
					dept_id : data.dept_id,
					class_id : data.class_id,
					timefrom:data.timefrom,
					timeto:data.timeto
					
			} : {
					user_id : $rootScope.userDetails.user_id,
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					dept_id : 1,
				},
				view : (data)?{
				type:data.type,
				dept_name :  data.dept_name,
				class_name: data.class_name,
				timefrom:data.timefrom,
				timeto:data.timeto,
					
			}:
			{
				
			},
			postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							
							$scope.getData(false, $scope.currentPage, 'exam','examList',$scope.examParams);
						}
					})
				},
				
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'exam','examList',$scope.examParams);
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
				},
				addToObject : function(object,data,modalOptions){
					$rootScope.addToObject(object,modalOptions[data]);
					modalOptions[data] = {};
				},
				
				removeObject : $rootScope.removeObject
			};
			
			modalService.showModal(modalDefault, modalOptions).then(function(){
				
			})
	}	
	$scope.getData = function(single, page, table, subobj, params, modalOptions) {
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
		$scope.examParams = {
				where : {
					user_id : $rootScope.userDetails.id,
					status:1,
				},
			join : [
				{
					joinType : 'INNER JOIN',
					joinTable : "campus_department",
					joinOn : {
						id : "t0.dept_id"
					},
					cols : ['dept_name']
				},
				{
					joinType : 'INNER JOIN',
					joinTable : "campus_class",
					joinOn : {
						id : "t0.class_id"
					},
					cols : ['class_name']
				},
			],
				cols : ["*"]
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
	examController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('examController', examController);
});

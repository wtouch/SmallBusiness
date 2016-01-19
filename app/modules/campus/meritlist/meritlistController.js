'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$location','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants'];
    
    // This is controller for this view
	var meritlistController= function ($scope,$location,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
		//global scope objects
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.pageItems = 10;
		$scope.currentPage = 1;
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");
		$rootScope.serverApiV2 = true;
		$rootScope.module = "campus";
		$rootScope.moduleMenus = [
			{
				name : "Registration",
				SubTitle :"Registration",
				events : {
					click : function(){
						return $scope.openModal("modules/campus/student/registeredstudent.html");
					}
				}
			},
			{
				name : "Registered List",
				path : "#/dashboard/campus/registration",
				SubTitle :"Registered List",
				
			},
			{
				name : "Merit List",
				SubTitle :"Merit List",
				path : "#/dashboard/campus/meritlist",
			},
			{
				name : "Student List",
				path : "#/dashboard/campus/student",
				SubTitle :"Student List",
				
			},
			{
				name : "+",
				events : {
					click : function(){
						$scope.isCollapsed = !$scope.isCollapsed;
						console.log($scope.isCollapsed);
					}
				}
			}]
		
		
		$scope.currentPath = $location.path();
		var dueDate = new Date();
		dueDate.setDate(dueDate.getDate() + 10);
		var dueMonth = dueDate.getMonth() + 1;
		dueMonth = (dueMonth <= 9) ? '0' + dueMonth : dueMonth;
		$scope.dueDate = dueDate.getFullYear() + "-" + dueMonth + "-" + dueDate.getDate();
		
			$scope.meritList = {
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
					name:'student_name',
					filterHeaderTemplate: '<input id="student_name" class="form-control" ng-change="grid.appScope.filter(\'student_name\', student_name, \'student_view\', \'meritList\',true,grid.appScope.regParams)" ng-model="student_name" placeholder="Student Name">',
					cellTemplate : "<span>{{row.entity.student_name| capitalize}} </span>"	
				},
				{ 
					name:'address',
					filterHeaderTemplate: '<input id="address" class="form-control" ng-change="grid.appScope.filter(\'address\', address, \'student_view\', \'meritList\',true,grid.appScope.studParams)" ng-model="address" placeholder="Address">'
				},
				{ 
					name:'email_id',width:120,
					filterHeaderTemplate: '<input id="email_id" class="form-control" ng-change="grid.appScope.filter(\'email_id\', email_id, \'student_view\', \'meritList\',true,grid.appScope.studParams)" ng-model="email_id" placeholder="Email ID">',
				},
				{ 
					name:'Marks',width:100,
					filterHeaderTemplate: '<input id="education" class="form-control" ng-change="grid.appScope.filter(\'education\', education, \'student_view\', \'meritList\',true,grid.appScope.studParams)" ng-model="education" placeholder="Marks">',
					cellTemplate : '<span>{{row.entity.education[0].marks}}</span>'
				},
				{ 
					name:'Percentage',width:120,
					filterHeaderTemplate: '<input id="education" class="form-control" ng-change="grid.appScope.filter(\'education\', education, \'student_view\', \'meritList\',true,grid.appScope.studParams)" ng-model="education" placeholder="Percentage">',
					cellTemplate : '<span>{{row.entity.education[0].percentage}}</span>'
				},
				
				{ 
					name:'class_name',enableSorting: false ,
					filterHeaderTemplate: '<select id="name" class="form-control" ng-change="grid.appScope.filter(\'class_id\', class_id, \'student_view\', \'meritList\',true, grid.appScope.studParams)" ng-model="class_id" >',
				
				},
				{ 
					name:'Percentage',width:120,
					filterHeaderTemplate: '<input id="education" class="form-control" ng-change="grid.appScope.filter(\'education\', education, \'student_view\', \'meritList\',true,grid.appScope.studParams)" ng-model="education" placeholder="Percentage">',
					cellTemplate : '<span>{{row.entity.education[0].percentage}}</span>'
				},
				{
					name:'Manage', 
					enableSorting: false, 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'student_view\', \'meritList\',false,grid.appScope.studParams)" ng-model="status">'
							+'<option value="" selected>Status</option>'
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					  options: [ { value: '1', label: 'Active' }, { value: '0', label: 'Delete' }]
					} ,
					cellTemplate : '<a ng-click="grid.appScope.openStudentModal(\'modules/campus/meritlist/admittedStudent.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit Student"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete Student" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'student\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+'<a ng-click="grid.appScope.openModal(\'modules/campus/meritlist/viewStudent.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="View Student"> <span class="glyphicon glyphicon-eye-open"></span></a>'
				}
			]
		};
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				console.log($scope.studParams);
				$scope.getData(false, $scope.currentPage, "student_view", "meritlist", $scope.studParams);
			}
		}
		$scope.classParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
			},
			cols : ["*"]
		};
		$scope.studParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
			}, 
			cols : ["*"]
		};
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
	meritlistController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('meritlistController', meritlistController);
});

'use strict';

define(['app'], function (app) {
	var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService', 'uiGridConstants'];
    
   var departmentsController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService, uiGridConstants) {
		$rootScope.metaTitle = "campus";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.alerts = [];
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");
		$rootScope.serverApiV2 = true;
		$rootScope.module = "campus";
	   
	    $scope.deptParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
			},
			cols : ["*"]
		}, 
	  $rootScope.moduleMenus = [
			{
				name : "Add department",
				SubTitle :"Department",
				events : {
					click : function(){
						return $scope.openModal("modules/campus/department/departments/adddepartments.html");
					}
				}
			}
		]
		$scope.departmentList = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{
					name:'SrNo', width:80,
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false,
					enableFiltering: false,	
				},
				{ 
					name:'dept_id',width:80,
					enableSorting: false, enableFiltering: true,
					filterHeaderTemplate: '<input id="dept_id" class="form-control" ng-change="grid.appScope.filter(\'dept_id\', dept_id, \'department\', \'departmentList\',true,grid.appScope.deptParams)" ng-model="dept_id" placeholder="Department No">',
				},
				{ 
					name:'dept_name',
					filterHeaderTemplate: '<input id="dept_name" class="form-control" ng-change="grid.appScope.filter(\'dept_name\', dept_name, \'department\', \'departmentList\',true,grid.appScope.deptParams)" ng-model="dept_name" placeholder="Department Name">',
				},
				{ 
					name:'hod',
					filterHeaderTemplate: '<input id="hod" class="form-control" ng-change="grid.appScope.filter(\'hod\', hod, \'department\', \'departmentList\',true,grid.appScope.deptParams)" ng-model="hod" placeholder="HOD">',
				},
				{ 
					name:'establishment_date',
					width:110, 
					enableSorting: false,
					filterHeaderTemplate: '<input id="establishment_date" class="form-control" ng-change="grid.appScope.filter(\'establishment_date\', establishment_date, \'department\', \'departmentList\',true, grid.appScope.deptParams)" ng-model="establishment_date" placeholder="Date">',
				},
				{ 
					name:'description',
					width:110, 
					enableSorting: false,
					filterHeaderTemplate: '<input id="description" class="form-control" ng-change="grid.appScope.filter(\'description\', description, \'department\', \'departmentList\',true, grid.appScope.deptParams)" ng-model="description" placeholder="Description">',
				},
				{
					name:'Manage', 
					enableSorting: false, 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'department\', \'departmentList\',false,grid.appScope.deptParams)" ng-model="status">'
							+'<option value="" selected>Status</option>'
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					  options: [ { value: '1', label: 'Active' }, { value: '0', label: 'Delete' }]
					} ,
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/campus/department/departments/adddepartments.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit Department"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete Department" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'department\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'+'<a ng-click="grid.appScope.openModal(\'modules/campus/department/departments/viewdepartment.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="View Department"> <span class="glyphicon glyphicon-eye-open"></span></a>'
				}
			]
		};
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "department", "departmentList", $scope.deptParams);
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
				departmentData : (data)?{
						id : data.id
					}:{},
					addDepartment : (data) ? {
						id : data.id,
						user_id : data.user_id,
						dept_id : data.dept_id,
						dept_name : data.dept_name,
						hod : data.hod,
						establishment_date :data.establishment_date,
						modified_date : dataService.sqlDateFormate(false,"datetime"),
						description : data.description,
					} : {
						user_id : $rootScope.userDetails.id,
						date : dataService.sqlDateFormate(false,"datetime"),
						modified_date : dataService.sqlDateFormate(false,"datetime"),
					},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'department','departmentList',$scope.deptParams);
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'department','departmentList',$scope.deptParams);
						}
					})
				},
				getData : $scope.getData,
				deptParams : {
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
	departmentsController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('departmentsController', departmentsController);
	
});
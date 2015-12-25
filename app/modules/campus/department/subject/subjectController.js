'use strict';

define(['app'], function (app) {
	var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService', 'uiGridConstants'];
    
   var subjectController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService, uiGridConstants) {
		$rootScope.metaTitle = "campus";
		$scope.maxSize = 5;
		$scope.alerts = [];
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");
		$rootScope.serverApiV2 = true;
		$rootScope.module = "campus";
	   
	     $scope.subParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
			},
			cols : ["*"]
		}
	  $rootScope.moduleMenus = [
			{
				name : "Add Subject",
				SubTitle :"Subject",
				events : {
					click : function(){
						return $scope.openModal("modules/campus/department/subject/addsubject.html");
					}
				}
			}
		]
		$scope.subjectList = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{
					name:'SrNo', 
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false,
					enableFiltering: false,	
				},
				{ 
					name:'dept_name',enableSorting: false ,
					filterHeaderTemplate: '<select id="dept_name" class="form-control" ng-change="grid.appScope.filter(\'dept_name\', dept_name, \'subjects_view\', \'subjectList\',false, grid.appScope.subParams)" ng-model="dept_name" ng-options="item.dept_name as item.dept_name for item in grid.appScope.departmentList">' 
				},	
				{ 
					name:'class_name',enableSorting: false ,
					filterHeaderTemplate: '<select id="class_name" class="form-control" ng-change="grid.appScope.filter(\'class_name\', class_name, \'subjects_view\', \'subjectList\',false, grid.appScope.subParams)" ng-model="class_name" ng-options="item.class_name as item.class_name for item in grid.appScope.classList">' 
				},	
				{ 
					name:'sub_no',
					filterHeaderTemplate: '<input id="sub_no" class="form-control" ng-change="grid.appScope.filter(\'sub_no\', sub_no, \'subjects_view\', \'subjectList\',true,grid.appScope.subParams)" ng-model="sub_no" placeholder="Subject No">',
				},
				{ 
					name:'sub_name',
					filterHeaderTemplate: '<input id="sub_name" class="form-control" ng-change="grid.appScope.filter(\'sub_name\', sub_name, \'subjects_view\', \'subjectList\',true,grid.appScope.subParams)" ng-model="sub_name" placeholder="Subject Name">',
				},
				{ 
					name:'description',
					filterHeaderTemplate: '<input id="description" class="form-control" ng-change="grid.appScope.filter(\'description\', description, \'subjects_view\', \'subjectList\',true,grid.appScope.subParams)" ng-model="description" placeholder="Description">',
				},
				{
					name:'Manage', 
					enableSorting: false, 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'subjects_view\', \'subjectList\',false,grid.appScope.subParams)" ng-model="status">'
							+'<option value="" selected>Status</option>'
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					  options: [ { value: '1', label: 'Active' }, { value: '0', label: 'Delete' }]
					} ,
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/campus/department/subject/addsubject.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit Subject"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete Subject" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'subjects\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+'<a ng-click="grid.appScope.openModal(\'modules/campus/department/subject/viewsubject.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="View Division"> <span class="glyphicon glyphicon-eye-open"></span></a>'
				}
			]
		};
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "subjects_view", "subjectList", $scope.subParams);
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
				subjectData : (data)?{
						id : data.id
					}:{},
					addSubject : (data) ? {
						id : data.id,
						user_id : data.user_id,
						dept_id : data.dept_id,
						class_id : data.class_id,
						div_id : data.div_id,
						staff_id : data.staff_id,
						sub_no : data.sub_no,
						sub_name : data.sub_name,
						syllabus : data.syllabus,
						description : data.description,
						modified_date : dataService.sqlDateFormate(false,"datetime"),
					} : {
						user_id : $rootScope.userDetails.id,
						date : dataService.sqlDateFormate(false,"datetime"),
						modified_date : dataService.sqlDateFormate(false,"datetime"),
					},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'subjects_view','subjectList',$scope.subParams);
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'subjects','subjectList',$scope.subParams);
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
	subjectController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('subjectController', subjectController);
	
});
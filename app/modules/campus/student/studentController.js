'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants','$http'];
    
    // This is controller for this view
	var studentController= function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants,$http) {
		
		//global scope objects
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.pageItems = 10;
		$scope.numPages = "";	
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");		
		$scope.currentPage = 1;
		$scope.currentDate = dataService.currentDate;
		$rootScope.serverApiV2 = true;
		$rootScope.module = "campus";	
	
			
		  $scope.regParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
			},
			cols : ["*"]
		}, 
		  $scope.studParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
			},
			cols : ["*"]
		} 
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
				name : "Merit Management",
				SubTitle :"Merit Management",
				path : "#/dashboard/campus/meritlist",
			},
			{
				name : "Registered List",
				path : "#/dashboard/campus/registration",
				SubTitle :"Registered List",
				
			},
			{
				name : "Student List",
				path : "#/dashboard/campus/student",
				SubTitle :"Student List",
				
			}
		]
		$scope.registrationList={
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{
					name:'SrNo', width:40,
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false,
					enableFiltering: false,	
				},
				{ 
					name:'student_name',
					filterHeaderTemplate: '<input id="student_name" class="form-control" ng-change="grid.appScope.filter(\'student_name\', student_name, \'registration_view\', \'registrationList\',true,grid.appScope.regParams)" ng-model="student_name" placeholder="Student Name">',
					cellTemplate : "<span>{{row.entity.student_name| capitalize}} </span>",
				},
				{ 
					name:'address',
					filterHeaderTemplate: '<input id="address" class="form-control" ng-change="grid.appScope.filter(\'address\', address, \'registration_view\', \'registrationList\',true,grid.appScope.regParams)" ng-model="address" placeholder="Address">'
				},
				{ 
					name:'email_id',width:120,
					filterHeaderTemplate: '<input id="email_id" class="form-control" ng-change="grid.appScope.filter(\'email_id\', email_id, \'registration_view\', \'registrationList\',true,grid.appScope.regParams)" ng-model="email_id" placeholder="Email ID">',
				},
				{ 
					name:'Marks',width:100,
					filterHeaderTemplate: '<input id="education" class="form-control" ng-change="grid.appScope.filter(\'education\', education, \'registration_view\', \'registrationList\',true,grid.appScope.regParams)" ng-model="education" placeholder="Marks">',
					cellTemplate : '<span>{{row.entity.education[0].marks}}</span>'
				},
				{ 
					name:'Percentage',width:120,
					filterHeaderTemplate: '<input id="education" class="form-control" ng-change="grid.appScope.filter(\'education\', education, \'registration_view\', \'registrationList\',true,grid.appScope.regParams)" ng-model="education" placeholder="Percentage">',
					cellTemplate : '<span>{{row.entity.education[0].percentage}}</span>'
				},
				{ 
					name:'dept_name',enableSorting: false ,
					filterHeaderTemplate: '<select id="dept_name" class="form-control" ng-change="grid.appScope.filter(\'dept_name\', dept_name, \'registration_view\', \'registrationList\',true, grid.appScope.regParams)" ng-model="dept_name" ng-options="item.dept_name as item.dept_name for item in grid.appScope.departmentList">',
					cellTemplate : "<span>{{row.entity.dept_name| capitalize}} </span>"	
				},
				{ 
					name:'class_name',enableSorting: false ,
					filterHeaderTemplate: '<select id="name" class="form-control" ng-change="grid.appScope.filter(\'class_id\', class_id, \'registration_view\', \'registrationList\',true, grid.appScope.regParams)" ng-model="class_id" ng-options="item.class_name as item.class_name for item in grid.appScope.classList">' ,
					cellTemplate : "<span>{{row.entity.class_name| capitalize}} </span>"	
				},
				{ 
					name:'Percentage',width:120,
					filterHeaderTemplate: '<input id="education" class="form-control" ng-change="grid.appScope.filter(\'education\', education, \'registration_view\', \'registrationList\',true,grid.appScope.regParams)" ng-model="education" placeholder="Percentage">',
					cellTemplate : '<span>{{row.entity.education[0].percentage}}</span>'
				},
				{
					name:'Manage', 
					enableSorting: false, 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'registration_view\', \'registrationList\',false,grid.appScope.regParams)" ng-model="status">'
							+'<option value="" selected>Status</option>'
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					  options: [ { value: '1', label: 'Active' }, { value: '0', label: 'Delete' }]
					} ,
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/campus/student/registeredstudent.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit Student"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete Student" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'registration\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+'<a ng-click="grid.appScope.openModal(\'modules/campus/student/viewStudent.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="View Student"> <span class="glyphicon glyphicon-eye-open"></span></a>'
				}
			],
			onRegisterApi: function( gridApi ) {
			  $scope.gridApi = gridApi;
				$scope.gridApi.core.on.filterChanged( $scope, function() {
					
				})
			}
		};
		
		$scope.studentList={
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{
					name:'SrNo', width:40,
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false,
					enableFiltering: false,	
				},
				{ 
					name:'student_name',
					filterHeaderTemplate: '<input id="student_name" class="form-control" ng-change="grid.appScope.filter(\'student_name\', student_name, \'student_view\', \'studentList\',true,grid.appScope.regParams)" ng-model="student_name" placeholder="Student Name">',
					cellTemplate : "<span>{{row.entity.student_name| capitalize}} </span>"	
				},
				{ 
					name:'address',
					filterHeaderTemplate: '<input id="address" class="form-control" ng-change="grid.appScope.filter(\'address\', address, \'student_view\', \'studentList\',true,grid.appScope.regParams)" ng-model="address" placeholder="Address">'
				},
				{ 
					name:'email_id',width:120,
					filterHeaderTemplate: '<input id="email_id" class="form-control" ng-change="grid.appScope.filter(\'email_id\', email_id, \'student_view\', \'studentList\',true,grid.appScope.regParams)" ng-model="email_id" placeholder="Email ID">',
				},
				{ 
					name:'Marks',width:100,
					filterHeaderTemplate: '<input id="education" class="form-control" ng-change="grid.appScope.filter(\'education\', education, \'student_view\', \'studentList\',true,grid.appScope.regParams)" ng-model="education" placeholder="Marks">',
					cellTemplate : '<span>{{row.entity.education[0].marks}}</span>'
				},
				{ 
					name:'Percentage',width:120,
					filterHeaderTemplate: '<input id="education" class="form-control" ng-change="grid.appScope.filter(\'education\', education, \'student_view\', \'studentList\',true,grid.appScope.regParams)" ng-model="education" placeholder="Percentage">',
					cellTemplate : '<span>{{row.entity.education[0].percentage}}</span>'
				},
				{ 
					name:'dept_name',enableSorting: false ,
					filterHeaderTemplate: '<select id="dept_name" class="form-control" ng-change="grid.appScope.filter(\'dept_name\', dept_name, \'student_view\', \'studentList\',true, grid.appScope.regParams)" ng-model="dept_name" ng-options="item.dept_name as item.dept_name for item in grid.appScope.departmentList">',
					cellTemplate : "<span>{{row.entity.dept_name| capitalize}} </span>"						
				},
				{ 
					name:'class_name',enableSorting: false ,
					filterHeaderTemplate: '<select id="name" class="form-control" ng-change="grid.appScope.filter(\'class_id\', class_id, \'student_view\', \'studentList\',true, grid.appScope.regParams)" ng-model="class_id" ng-options="item.class_name as item.class_name for item in grid.appScope.classList">',
					cellTemplate : "<span>{{row.entity.class_name| capitalize}} </span>"	
				},
				{ 
					name:'Percentage',width:120,
					filterHeaderTemplate: '<input id="education" class="form-control" ng-change="grid.appScope.filter(\'education\', education, \'student_view\', \'studentList\',true,grid.appScope.regParams)" ng-model="education" placeholder="Percentage">',
					cellTemplate : '<span>{{row.entity.education[0].percentage}}</span>'
				},
				{
					name:'Manage', 
					enableSorting: false, 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'student_view\', \'studentList\',false,grid.appScope.regParams)" ng-model="status">'
							+'<option value="" selected>Status</option>'
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					  options: [ { value: '1', label: 'Active' }, { value: '0', label: 'Delete' }]
					} ,
					cellTemplate : '<a ng-click="grid.appScope.openStudentModal(\'modules/campus/student/admittedStudent.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit Student"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete Student" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'student\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChangestud)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+'<a ng-click="grid.appScope.openModal(\'modules/campus/student/viewStudent.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="View Student"> <span class="glyphicon glyphicon-eye-open"></span></a>'
				}
			],
			onRegisterApi: function( gridApi ) {
			  $scope.gridApi = gridApi;
				$scope.gridApi.core.on.filterChanged( $scope, function() {
					
				})
			}
		};
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "registration_view", "registrationList", $scope.regParams);
			}
		}
		
		$scope.callbackColChangestud = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "student_view", "studentList", $scope.studParams);
			}
		}
		
		//add student details
		$scope.openModal = function(url,data){
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions ={
				addStudent:(data)?{
					id:data.id,
					user_id : data.user_id,
					dept_id : data.dept_id,
					class_id : data.class_id,
					student_name : data.student_name,
					email_id:data.email_id,
					contact_no:data.contact_no,
					address:data.address,
					city:data.city,
					state:data.state,
					country:data.country,
					dob : data.dob,
					age : data.age,		
					pincode:data.pincode,
					gender : data.gender,
					marital_status : data.marital_status,
					hobbies : data.hobbies,
					education:data.education,
					gardian : data.gardian,
					cast : data.cast,
					medical:data.medical,
					attachments : data.attachments,
					remark : data.remark,
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					
				}:{
					user_id:$rootScope.userDetails.id,
					date : dataService.sqlDateFormate(false,"datetime"),
						modified_date : dataService.sqlDateFormate(false,"datetime"),
				},
				postData : function(table, input){
						console.log(table, input);
						$rootScope.postData(table, input,function(response){
							if(response.status == "success"){
								$scope.getData(false, $scope.currentPage, 'registration_view','registrationList',$Scope.regParams);
							}
						})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'registration_view','registrationList',$scope.regParams);
						}
					})
				},
					formPart : 'personalDetails',
					showFormPart : function(formPart, modalOptions){
						console.log(formPart);
						modalOptions.formPart = formPart;
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
						console.log(object,data,modalOptions);
					$rootScope.addToObject(object,modalOptions[data]);
					modalOptions[data] = {};
					},
				
				removeObject : $rootScope.removeObject,
					
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){
				
			})
		}
		


		//for student update modal
		$scope.openStudentModal = function(url,data){
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions ={
				addStudent:(data)?{
					id:data.id,
					user_id : data.user_id,
					dept_id : data.dept_id,
					class_id : data.class_id,
					student_name : data.student_name,
					email_id :data.email_id,
					contact_no:data.contact_no,
					address:data.address,
					city:data.city,
					state:data.state,
					country:data.country,
					dob : data.dob,
					age : data.age,		
					pincode:data.pincode,
					gender : data.gender,
					marital_status : data.marital_status,
					hobbies : data.hobbies,
					education:data.education,
					gardian : data.gardian,
					cast : data.cast,
					medical:data.medical,
					attachments : data.attachments,
					remark : data.remark,
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					
				}:{
					user_id:$rootScope.userDetails.id,
					date : dataService.sqlDateFormate(false,"datetime"),
						modified_date : dataService.sqlDateFormate(false,"datetime"),
				},
				postData : function(table, input){
						console.log(table, input);
						$rootScope.postData(table, input,function(response){
							if(response.status == "success"){
								$scope.getData(false, $scope.currentPage, 'student_view','studentList',$Scope.studParams);
							}
						})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'student_view','studentList',$scope.studParams);
						}
					})
				},
					formPart : 'studentPersonalDetails',
					showFormPart : function(formPart, modalOptions){
						console.log(formPart);
						modalOptions.formPart = formPart;
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
						console.log(object,data,modalOptions);
					$rootScope.addToObject(object,modalOptions[data]);
					modalOptions[data] = {};
					},
				
				removeObject : $rootScope.removeObject,
					
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
		
	}		
	// Inject controller's dependencies
	studentController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('studentController', studentController);
});
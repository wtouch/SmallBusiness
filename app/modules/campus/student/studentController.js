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
				name : "Merit List",
				SubTitle :"Merit List",
				events : {
					click : function(){
						return $scope.openModal("modules/campus/student/meritlist.html");
					}
				}
			},
			{
				name : "Student List",
				SubTitle :"Student List",
				events : {
					click : function(){
						return $scope.openModal("modules/campus/student/studentlist.html");
					}
				}
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
					name:'student_name',width:100,
					filterHeaderTemplate: '<input id="student_name" class="form-control" ng-change="grid.appScope.filter(\'student_name\', student_name, \'registration\', \'registrationList\',true,grid.appScope.regParams)" ng-model="student_name" placeholder="Student Name">',
				},
				{ 
					name:'email',width:120,
					filterHeaderTemplate: '<input id="email" class="form-control" ng-change="grid.appScope.filter(\'email\', email, \'registration\', \'registrationList\',true,grid.appScope.regParams)" ng-model="email" placeholder="Email ID">',
				},
				{ 
					name:'address',width:110,
					filterHeaderTemplate: '<input id="address" class="form-control" ng-change="grid.appScope.filter(\'address\', address, \'registration\', \'registrationList\',true,grid.appScope.regParams)" ng-model="address" placeholder="Address">',
				},
				{
					name:'Manage', 
					enableSorting: false, 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'registration\', \'registrationList\',false,grid.appScope.regParams)" ng-model="status">'
							+'<option value="" selected>Status</option>'
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					  options: [ { value: '1', label: 'Active' }, { value: '0', label: 'Delete' }]
					} ,
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/campus/student/registeredstudent.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit Staff"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete Staff" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'staff\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+'<a ng-click="grid.appScope.openModal(\'modules/campus/staff/view_staff.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="View Staff"> <span class="glyphicon glyphicon-eye-open"></span></a>'
				}
			]
		};
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "registration", "registrationList", $scope.regParams);
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
								$scope.getData(false, $scope.currentPage, 'registration','registrationLIst',$Scope.regParams);
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
	}		
	// Inject controller's dependencies
	studentController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('studentController', studentController);
});
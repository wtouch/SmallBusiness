'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$location','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants'];
    
    // This is controller for this view
	var opdController= function ($scope,$location,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
		//global scope objects
		$scope.invoice = true;
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.pageItems = 10;
		$scope.numPages = "";	
		$scope.currentPage = 1;
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");
		$rootScope.serverApiV2 = true;
		$rootScope.module = "hospital";
		
		$rootScope.moduleMenus = [
			{
				name : "Add  Opd Patient",
				SubTitle :"Add opd Patient",
				events : {
					click : function(){
						return $scope.openModal("modules/hospital/opd/addopdpatient.html");
					}
				}
			},{
				name : "opd List",
				path : "#/dashboard/hospital/opd",
				SubTitle :"OPD List"
			}
		]
		$scope.opdList = {
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
				    name:'patient_name',
					filterHeaderTemplate: '<input id="patient_name" class="form-control" ng-change="grid.appScope.filter(\'patient_name\', patient_name, \'opd_view\', \'opdList\', true, grid.appScope.opdParams)" ng-model="patient_name" placeholder="search name">',
                },
				{
					name:'checkup_date',
					filterHeaderTemplate: '<input id="checkup_date" class="form-control" ng-change="grid.appScope.filter(\'checkup_date\', checkup_date, \'opd_view\', \'opd\',true, grid.appScope.patientParams)" ng-model="checkup_date" placeholder="search">'
                },
				{
					name:'emergency_contact',
					filterHeaderTemplate: '<input id="emergency_contact" class="form-control" ng-change="grid.appScope.filter(\'emergency_contact\', emergency_contact, \'opd\', \'opdList\',true, grid.appScope.opdParams)" ng-model="emergency_contact" placeholder="search">'
                },
				{ name:'Manage', 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'opd_view\', \'opdList\',false, grid.appScope.opdParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					   type: uiGridConstants.filter.SELECT,  
					  selectOptions: [ { value: '1', label: 'Active' }, { value: '0', label: 'Deleted' }
					  ]
					} ,
				
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/hospital/opd/addopdpatient.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit patient" > <span class="glyphicon glyphicon-pencil"></span></a>'
					+ 
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/opd/view_opdpatient.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view  patient" > <span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
					+
					'<a type="button" tooltip="Delete Patient details" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'opd_view\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
				}
			]
		};
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "opd_view", "opdList", $scope.opdParams);
			}
		}
		$scope.openModal = function(url,data){
			console.log(data);
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				date : $scope.currentDate,
				/* patientParams: $scope.patientParams, */
				checkup_date :$scope.currentDate,
				registered_date:dataService.sqlDateFormate(),
				date:{date : $scope.currentDate},
				addopdpatient : (data) ? {
					id : data.id,
					name : data.name,
					email : data.email,
					checkup_date :data.checkup_date ,
					mobile: data.mobile,
					emergency_contact:data.emergency_contact,
					ward_id :data.ward_id,
					patient_id:data.patient_id,
					bed_id :data.bed_id,
					patient_history:data.patient_history,
					patient_complaint:data.patient_complaint,
					general_examination :data.general_examination,
					staff_id :data.staff_id,
					type: data.type,
				
					emergency_contact :data.emergency_contact,
					patient_name : data.patient_name,
					address: data.address,
					gender : data.gender,
					dob : data.dob,
					blood_group : data.blood_group,
					age : data.age,
					location :data.location,
					area:data.area,
					city :data.city,
					state :data.state,
					country :data.country,
					pincode :data.pincode,
					//phone :data.phone,	
			} : {
					date : dataService.sqlDateFormate(),
					user_id : $rootScope.userDetails.id,
					checkup_date :$scope.currentDate,
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					
				},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'opd_view','opdList', $scope.opdParams);
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'opd_view','opdList', $scope.opdParams);
						}
					})
				},
				formPart :'opdpatientDetails',
				showFormPart : function(formPart,modalOptions){
					modalOptions.formPart = formPart;
					
				},
				getData : $scope.getData,
				addToObject : function(object,data,modalOptions){
					console.log(object,data,modalOptions);
					$rootScope.addToObject(object,modalOptions[data]);
					modalOptions[data] = {};
				},
				removeObject : $rootScope.removeObject
			};
			
			modalService.showModal(modalDefault, modalOptions).then(function(){
				
			})
			
		}
		$scope.opdParams = {
			where : {
				user_id : $rootScope.userDetails.id,
				status : 1
			},
			cols : ["*"]
		}
		$scope.patientParams = {
			where : {
				user_id : $rootScope.userDetails.id,
				status : 1
			},
			cols : ["*"]
		}
		/*get data */
		 $scope.getData = function(single, page, table, subobj, params, modalOptions) {
			$scope.params = (params) ? params : {
				where : {
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
				angular.extend($scope.params, params, response);
				console.log($scope.params);
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
	opdController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('opdController',opdController);
});
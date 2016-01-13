'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService', 'uiGridConstants'];
    
    // This is controller for this view
	var patientController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		//global scope objects
		$scope.invoice = true;
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");
		$rootScope.serverApiV2 = true;
		$rootScope.module = "hospital";
		console.log('Hello');
		//$scope.patientList = {};
		
		$rootScope.moduleMenus = [
			{
				name : "Add Patient",
				SubTitle :"Add Patient",
				events : {
					click : function(){
						return $scope.openModal("modules/hospital/patient/addpatient.html");
					}
				}
			},{
				name : "Patient List",
				path : "#/dashboard/hospital/patient",
				SubTitle :"Patient List"
			}
		]
		

		$scope.patient = {
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
					filterHeaderTemplate: '<input id="patient_name" class="form-control" ng-change="grid.appScope.filter(\'patient_name\', patient_name, \'patient\', \'patient\', true, grid.appScope.patientParams)" ng-model="patient_name" placeholder="Search by Name">',
                },
				{
					name:'email',
					filterHeaderTemplate: '<input id="email" class="form-control" ng-change="grid.appScope.filter(\'email\', email, \'patient\', \'patient\',true, grid.appScope.patientParams)" ng-model="email" placeholder="Search by Email">'
                },
				{
					name:'mobile',
					filterHeaderTemplate: '<input id="mobile" class="form-control" ng-change="grid.appScope.filter(\'mobile\', mobile, \'patient\', \'patient\',true, grid.appScope.patientParams)" ng-model="mobile" placeholder="Search by Mobile">'
                },
				{
				    name:'dob',
				    filterHeaderTemplate: '<input id="dob" class="form-control" ng-change="grid.appScope.filter(\'dob\', dob, \'patient\', \'patient\',true, grid.appScope.patientParams)" ng-model="dob" placeholder="Search Dob">', 
                },
			   {
				    name:'address',
					filterHeaderTemplate: '<input id="address" class="form-control" ng-change="grid.appScope.filter(\'address\', address, \'patient\', \'patient\',true, grid.appScope.patientParams)" ng-model="address" placeholder="Search by Address">',
                },
					
				{ name:'Manage', 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'patient\', \'patient\',false, grid.appScope.patientParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					   type: uiGridConstants.filter.SELECT,  
					  selectOptions: [ { value: '1', label: 'Active' }, { value: '0', label: 'Deleted' }
					  ]
					} ,
				
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/hospital/patient/addpatient.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit Patient Information"> <span class="glyphicon glyphicon-pencil"></span></a>'
				
					+ 
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/patient/view_patient.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="View Patient" > <span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
						+ 
					'<a type="button" tooltip="Delete Patient" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'patient\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
				}
			]
		};
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "patient", "patient",$scope.patientParams);
			}
		}
			$scope.openModal = function(url,data){
			var modalDefault = {
				templateUrl:url,	// apply template to modal
				size : 'lg'
			};
				var modalOptions = {
				date : $scope.currentDate,
				hostoryParams: $scope.hostoryParams,
				registered_date:$scope.currentDate,
				/* registered_date:dataService.sqlDateFormate(), */
				date:{date : $scope.currentDate},
				addpatient : (data) ? {
					id : data.id,
					user_id :data.user_id,
					patient_id:data.patient_id,
					user_id : $rootScope.userDetails.id,
					registered_date:data.registered_date,
					patient_name:data.patient_name,
					email : data.email,
					email2 : data.email,
					gender : data.gender,
					blood_group :data.blood_group,
					dob:data.dob,
					age:data.age,
					marital_status :data.marital_status,
					disability :data.disability,
					mobile: data.mobile,
					emergency_contact : data.emergency_contact,
					address: data.address,
					location: data.location,
					area: data.area,
					patient_history:data.patient_history,
					guardian_details:data.guardian_details,
					city: data.city,
					state: data.state,
					country: data.country,
					pincode: data.pincode,
					date : data.date,
					type: data.type,
					department: data.department,
			} : {
					date : dataService.sqlDateFormate(),
					user_id : $rootScope.userDetails.id,
					 registered_date:$scope.currentDate, 
					/* registered_date: dataService.sqlDateFormate(), */
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					
				},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'patient','patient',$scope.patientParams);
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'patient','patient',$scope.patientParams);
						}
					})
				},
				 formPart :'patientDetails',
				showFormPart : function(formPart,modalOptions){
					modalOptions.formPart = formPart;
					
				}, 
				getData : $scope.getData,
			};
			
			modalService.showModal(modalDefault, modalOptions).then(function(){
				
			})
			
		}
		$scope.patientParams = {
			where : {
				user_id : $rootScope.userDetails.id,
				status : 1
			},
			cols : ["*"]
		}
		$scope.historyParams ={
		 where : {
				user_id : $rootScope.userDetails.id,
				status : 1,
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
				dataService.extendDeep($scope.params, params, response);
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
	patientController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('patientController', patientController);
});
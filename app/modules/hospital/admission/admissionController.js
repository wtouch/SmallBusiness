'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$location','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants'];
    
    // This is controller for this view
	var admissionController= function ($scope,$location,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
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
				name : "Add admission",
				SubTitle :"Add admission",
				events : {
					click : function(){
						return $scope.openModal("modules/hospital/admission/addadmission.html");
					}
				}
			},{
				name : "admission List",
				path : "#/dashboard/hospital/admission",
				SubTitle :"admission List"
			}
		]
		
		$scope.admission = {
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
				    name:'patient_name',width:150,
					filterHeaderTemplate: '<input id="patient_name" class="form-control" ng-change="grid.appScope.filter(\'patient_name\', patient_name, \'patient\', \'patient\', true, grid.appScope.patientParams)" ng-model="patient_name" placeholder="search name">',
                },
				{
				    name:'patient_id',width:150,
					filterHeaderTemplate: '<input id="patient_name" class="form-control" ng-change="grid.appScope.filter(\'patient_name\', patient_name, \'patient\', \'patient\', true, grid.appScope.patientParams)" ng-model="patient_name" placeholder="search name">',
                },
				{
					name:'consultant_dr',width:150,
					filterHeaderTemplate: '<input id="consultant_dr" class="form-control" ng-change="grid.appScope.filter(\'consultant_dr\', consultant_dr, \'staff\', \'staff\',true, grid.appScope.staffParams)" ng-model="consultant_dr" placeholder="search">'
                },
				{
					name:'mobile',width:80,
					filterHeaderTemplate: '<input id="mobile" class="form-control" ng-change="grid.appScope.filter(\'mobile\', mobile, \'admission\', \'admission\',true, grid.appScope.admissionParams)" ng-model="mobile" placeholder="search">'
                },
				{
					name:'admission_date',width:80,
					filterHeaderTemplate: '<input id="admission_date" class="form-control" ng-change="grid.appScope.filter(\'admission_date\', admission_date, \'admission\', \'admission\',true, grid.appScope.admissionParams)" ng-model="admission_date" placeholder="search">'
                },
					
				{ name:'Manage', 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'admission\', \'admission\',true, grid.appScope.admissionParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					   type: uiGridConstants.filter.SELECT,  
					  selectOptions: [ { value: '1', label: 'Active' }, { value: '0', label: 'Deleted' }
					  ]
					} ,
				
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/hospital/admission/addadmission.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit  IPD patient" > <span class="glyphicon glyphicon-pencil"></span></a>'
					+ 
					'<a type="button" tooltip="Delete record" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'admission\', \'status\',row.entity.status, row.entity.id);$route.reload()" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'+
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/admission/view_ipdpatient.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view  IPDpatient" > <span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
					+
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/admission/casesheet.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view  Casesheet" > <span >CS</span></a>'			
					+
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/admission/view_drugsheet.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view Drugsheet" > <span >VD</span></a>'
					+
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/admission/diagnosticTest.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view diagnosticTest" > <span >DT</span></a>'
					+
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/admission/medicine_Prescribe.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view medicine_Prescribe" > <span>MP</span></a>'
					+
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/admission/assignEquipment.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view assignEquipment" > <span >AE</span></a>'
					
				}
			]
		};
		
		$scope.openModal = function(url,data){
			
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				date : $scope.currentDate,
				admission_date:$scope.currentDate,
				patientParams: $scope.patientParams,
				addadmission : (data) ? {
					id : data.id,
					admission_date : data.admission_date,
					patient_id:data.patient_id,
					mobile: data.mobile,
					emergency_contact:data.emergency_contact,
					email : data.email,
					deposit:data.deposit,
					ward_id :data.ward_id,
					bed_id :data.bed_id,
					patient_history:data.patient_history,
					complaints :data.complaints,
					general_examination :data.general_examination,
					staff_id :data.staff_id
					} 
					: {
					date : dataService.sqlDateFormate(),
					user_id : $rootScope.userDetails.id,
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					admission_date :$scope.currentDate,
					
				},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'admission','admission', $scope.admissionParams);
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'admission','admission', $scope.admissionParams);
						}
					})
				},
				formPart :'admissionDetails',
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
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "admission", "admission", $scope.admissionParams);
			}
		}
		$scope.patientParams ={
		 where : {
				user_id : $rootScope.userDetails.id,
				status : 1,
			},
			cols : ["*"]
		}
		$scope.staffParams ={
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
	admissionController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('admissionController', admissionController);
});
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
		
		$scope.printDiv = function(divName) {
			var printContents = document.getElementById(divName).innerHTML;
			var popupWin = window.open('', '_blank', 'width=1000,height=620');
			popupWin.document.open()
			popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/bootstrap.min.css" /><link rel="stylesheet" type="text/css" href="css/style.css" /></head><body onload="window.print()">' + printContents + '</html>');
			popupWin.document.close();
		}
		
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
					filterHeaderTemplate: '<input id="patient_name" class="form-control" ng-change="grid.appScope.filter(\'patient_name\', patient_name, \'admission_view\', \'admission\', true, grid.appScope.admissionParams)" ng-model="patient_name" placeholder="search name">',
                },
				{
					name:'name',width:150,
					filterHeaderTemplate: '<input id="name" class="form-control" ng-change="grid.appScope.filter(\'name\', name, \'admission_view\', \'admission\',true, grid.appScope.admissionParams)" ng-model="name" placeholder="search">'
                },
				{
					name:'mobile',width:140,
					filterHeaderTemplate: '<input id="mobile" class="form-control" ng-change="grid.appScope.filter(\'mobile\', mobile, \'admission_view\', \'admission\',true, grid.appScope.admissionParams)" ng-model="mobile" placeholder="search">'
                },
				{
					name:'admission_date',width:90,
					filterHeaderTemplate: '<input id="admission_date" class="form-control" ng-change="grid.appScope.filter(\'admission_date\', admission_date, \'admission_view\', \'admission\',true, grid.appScope.admissionParams)" ng-model="admission_date" placeholder="search">'
                },
					
				{ name:'Manage', width :500,
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'admission_view\', \'admission\',false, grid.appScope.admissionParams)" ng-model="status">'
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
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/admission/view_ipdpatient.html\',row.entity)" class="btn btn-warning btn-sm" type="button" tooltip-animation="true" tooltip="view  IPDpatient" > <span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
					+
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/admission/view_casesheet.html\',row.entity)" class="btn btn-info btn-sm" type="button" tooltip-animation="true" tooltip="view  Casesheet" > <span >CS</span></a>'			
					+
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/admission/view_drugsheet.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view Drugsheet" > <span >VD</span></a>'
					+
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/admission/diagnosticTest.html\',row.entity)" class="btn btn-success btn-sm" type="button" tooltip-animation="true" tooltip="view diagnosticTest" > <span >DT</span></a>'
					+
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/admission/assignEquipment.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view assignEquipment" > <span >AE</span></a>'	
					+
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/admission/releaseEquipment.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view assignEquipment" > <span >RE</span></a>'	
					+
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/admission/generate_bill.html\',row.entity)" class="btn btn-info btn-sm" type="button" tooltip-animation="true" tooltip="view generate_bill" > <span >GB</span></a>'	
					+
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/admission/dishcharge.html\',row.entity)" class="btn btn-success btn-sm" type="button" tooltip-animation="true" tooltip="view generate_bill" > <span>DisCharge</span></a>'
					+ 
					'<a type="button" tooltip="Delete admission" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'admission\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
				}
			]
		};
		var  date1 = "";
		var date2 = "";
		$scope.dateDifference = function(date1,date2){
			console.log(date1,date2)
			//var d1 = new Date(string1);
			//var d2 = new Date(string2);
			//var miliseconds = d2-d1;
			//var seconds = miliseconds/1000;
			//var minutes = seconds/60;
			//var hours = minutes/60;
			//var days = hours/24;
			//console.log(days);
		}  
	//	$scope.dateDifference(date1,date2);
		$scope.openModal = function(url,data){
			
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				date : $scope.currentDate,
				admission_date:$scope.currentDate,
				patientParams: $scope.patientParams,
				complaintParams :$scope.complaintParams,
				testParams :$scope.testParams,
				bedParams :$scope.bedParams,
				view_admission : (data) ? {
					id : data.id,
					user_id : data.user_id,
					name : data.name,
					email : data.email,
					admission_date :data.admission_date,
					discharge_date:data.discharge_date,
					discharge_details :data.discharge_details,
					mobile: data.mobile,
					emergency_contact:data.emergency_contact,
					ward_id :data.ward_id,
					ward_name:data.ward_name,
					fees:data.fees,
					ward_charges:data.ward_charges,
					equipement_charges:data.equipement_charges,
					bed_number:data.bed_number,
					//test_description :data.test_description,
					patient_id:data.patient_id,
					bed_id :data.bed_id,
					patient_history:data.patient_history,
					general_examination :data.general_examination,
					staff_id :data.staff_id,
					type: data.type,
					guardian_details :data.guardian_details,
					drug_sheet:data.drug_sheet,
					//patient_name : data.patient_name,
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
					deposit:data.deposit,
					complaints :data.complaints,
					equipment_sheet :data.equipment_sheet,
					equipment_name :data.equipment_name,
					equipment_charges :data.equipment_charges
					//phone :data.phone,	
			} : {
					date : dataService.sqlDateFormate(),
					user_id : $rootScope.userDetails.id,
					checkup_date :$scope.currentDate,
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					
				},
				addadmission : (data) ? {
					id : data.id,
					admission_date : data.admission_date,
					discharge_date :data.discharge_date,
					patient_id:data.patient_id,
					//patient_name:data.patient_name,
					mobile: data.mobile,
					emergency_contact:data.emergency_contact,
					email : data.email,
					deposit:data.deposit,
					ward_id :data.ward_id,
					bed_id :data.bed_id,
					patient_history:data.patient_history,
					complaints :data.complaints,
					general_examination :data.general_examination,
					staff_id :data.staff_id,
					type: data.type,
					drug_sheet:data.drug_sheet,
					diagnostic :data.diagnostic,
					case_sheet :data.case_sheet,
					medicine_prescribe :data.medicine_prescribe,
					equipment_sheet :data.equipment_sheet
					} 
					: {
					date : dataService.sqlDateFormate(),
					user_id : $rootScope.userDetails.id,
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					admission_date :$scope.currentDate	
				},
				dateDifference : function(date1,date2,bed_charges){
					console.log(date1,date2)
					var d1 = new Date(date1);
					var d2 = new Date(date2);
					var miliseconds = d2-d1;
					var seconds = miliseconds/1000;
					var minutes = seconds/60;
					var hours = minutes/60;
					var days = hours/24;
					console.log(days);
					var total = bed_charges*days;
					console.log(total);
					return total;
				},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							
						$scope.getData(false, $scope.currentPage, 'admission_view','admission', $scope.admissionParams);
						}
					})
				},
				getTypeaheadData : function(table, searchColumn, searchValue){
					var locationParams = {
						search : {},
						cols : ["*"]
					};
					locationParams.search[searchColumn] = searchValue;
					console.log(locationParams);
					return dataService.get(false, 'patient', locationParams).then(function(response){
						console.log(response);
						if(response.status == 'success'){
							return response.data;
						}else{
							return [];
						}
					}); 
				},
			
				assignData : function(object, formObject){
					formObject.patient_id = object.id;
					formObject.mobile = object.mobile;
					formObject.emergency_contact = object.emergency_contact;
					formObject.email = object.email;
					console.log(object);
				},
				
				getTypeaheadDatas : function(table, searchColumn, searchValue){
					var locationParams = {
						search : {},
						cols : ["*"]
					};
					locationParams.search[searchColumn] = searchValue;
					console.log(locationParams);
					return dataService.get(false, 'equipment', locationParams).then(function(response){
						console.log(response);
						if(response.status == 'success'){
							return response.data;
						}else{
							return [];
						}
					}); 
				},
			
				assignDatas : function(object, formObject){
					formObject.equipment_id = object.id;
					//formObject.equipment_name = object.equipment_name;
					formObject.emergency_contact = object.emergency_contact;
					formObject.equipment_charges = object.equipment_charges;
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
						 	$scope.equipmentData = {};
							 $scope.equipmentData.user_id =input.user_id;
							 $scope.equipmentData.patient_id = input.patient_id;
							if(input.date) $scope.equipmentData.date = input.date;
							 $scope.equipmentData.modified_date = input.modified_date;
							 $scope.equipmentData.assign_date = input.assign_date;
							  $scope.equipmentData.equipment_name = input.equipment_name;
							  $scope.equipmentData.equipment_charges = input.equipment_charges;
							 $scope.equipmentData.description = input.description;
							 $scope.equipmentData.equipment_id = input.equipment_id;
							 console.log($scope.equipmentData);
								$rootScope.postData("equipment_used", angular.copy($scope.equipmentData),function(response){
									
								});
								
							$scope.getData(false, $scope.currentPage, 'admission_view','admission', $scope.admissionParams);
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
				removeObject : $rootScope.removeObject,
				printDiv :$scope.printDiv,
			};
			
			modalService.showModal(modalDefault, modalOptions).then(function(){
			})	
		}
		
		
		
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "admission_view", "admission",$scope.patientParams);
			}
		}
		$scope.admissionParams ={
		 where : {
				user_id : $rootScope.userDetails.id,
				status : 1,
			},
			cols : ["*"]
		}
		$scope.medicine_usedParams ={
		 where : {
				user_id : $rootScope.userDetails.id,
				status : 1,
			},
			cols : ["*"]
		}
		$scope.medicineParams ={
		 where : {
				user_id : $rootScope.userDetails.id,
				status : 1,
			},
			cols : ["*"]
		}
			$scope.equipmentParams ={
		 where : {
				user_id : $rootScope.userDetails.id,
				status : 1,
			},
			cols : ["*"]
		}
		$scope.bedParams ={
		 where : {
				user_id : $rootScope.userDetails.id,
				status : 1,
			},
			cols : ["*"]
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
		$scope.testParams ={
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
					user_id : $rootScope.userDetails.id,
					status : 1
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
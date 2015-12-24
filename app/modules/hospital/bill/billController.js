'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService', 'uiGridConstants'];
    
   var billController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService, uiGridConstants) {
	
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.alerts = [];
		$scope.currentPage = 1;
		$scope.pageItems = 10;
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
				name : "Generate Bill",
				path : "#/dashboard/hospital/bill",
				events : {
					click : function(){
						return $scope.openModal("modules/hospital/bill/generate_bill.html");
					}
				}
			}
		]
		$scope.billList = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{ name:'Sr.No', width:60,
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false,
			enableFiltering: false,	
				},
				{
					name:'bill_id',width:300,
					filterHeaderTemplate: '<input id="bill_id" class="form-control" ng-change="grid.appScope.filter(\'bill_id\', bill_id, \'bill\', \'billList\',true, grid.appScope.billParams)" ng-model="bill_id" placeholder="Equipment Name">',
				},
				{
					name:'patient_name',width:300,
					filterHeaderTemplate: '<input id="patient_name" class="form-control" ng-change="grid.appScope.filter(\'patient_name\', patient_name, \'bill\', \'billList\',true, grid.appScope.billParams)" ng-model="patient_name" placeholder="Equipment Description">',
				},
				
				{ name:'paid_amount',width:100,enableSorting: false,enableFiltering: false,
				},
				{ name:'due_amount',width:100,enableSorting: false,enableFiltering: false,
				},
				
				{ name:'Manage', width:200,
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'bill\', \'billList\',false,grid.appScope.billParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					   type: uiGridConstants.filter.SELECT,  
					  selectOptions: [ { value: '1', label: 'Active' }, { value: '0', label: 'Deleted' }
					  ]
					} , 
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/hospital/general/equipment/addequipment.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit Equipment Information"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ 
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/general/equipment/equipmentview.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view  equipment" > <span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
					+ 
					 '<a type="button" tooltip="Delete equipment" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'equipment\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
				}
			]
		};
		
		$scope.openModal = function(url,data){
			var modalDefault = {
				templateUrl:url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				date : $scope.currentDate,
				//equipment_date:$scope.currentDate,
				modified_date:$scope.currentDate,
				date:$scope.currentDate,
				addequipment : (data) ? {
					id : data.id,
					user_id : data.user_id,
					user_id : $rootScope.userDetails.id,
					modified_date:data.modified_date,
					equipment_date : data.equipment_date,
					price:data.price,
					quantity:data.quantity,
					equipment_name:data.equipment_name,
					unit:data.unit,
					equipment_charges:data.equipment_charges,
					equipment_description:data.equipment_description
				} : {
					date : dataService.sqlDateFormate(false,"datetime"),
					user_id : $rootScope.userDetails.id,
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					equipment_date: dataService.sqlDateFormate()
				
				},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'equipment','equipmentList');
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'equipment','equipmentList');
						}
					})
				},
				getData : $scope.getData
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){	
			})
		}
		$scope.billParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
			},
			
			cols : ["*"]
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
		$scope.orderBy = function(col, value){
			if(!$scope.params.orderBy) $scope.params.orderBy = {};
			$scope.params.orderBy[col] = value;
			$scope.getData(false,$scope.currentPage, 'bill', 'billData', $scope.params);
		}
	};	
	// Inject controller's dependencies
	billController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('billController', billController);
});
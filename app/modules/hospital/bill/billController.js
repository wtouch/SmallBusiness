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
				name : "Admission Bill List",
				path : "#/dashboard/hospital/bill",
				SubTitle :"OPD Patient List"
			},
			{
				name : "OPD Bill List",
				path : "#/dashboard/hospital/opdbill",
				SubTitle :"OPD Patient List"
			},
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
					name:'bill_id',width:100,
					filterHeaderTemplate: '<input id="bill_id" class="form-control" ng-change="grid.appScope.filter(\'bill_id\', bill_id, \'bill\', \'billList\',true, grid.appScope.billParams)" ng-model="bill_id" placeholder="Bill Id">',
				},
				{
					name:'patient_name',width:150,
					filterHeaderTemplate: '<input id="patient_name" class="form-control" ng-change="grid.appScope.filter(\'patient_name\', patient_name, \'bill\', \'billList\',true, grid.appScope.billParams)" ng-model="patient_name" placeholder="Search">',
				}, 
				{
					name:'payment_status',width:150,
					filterHeaderTemplate: '<input id="payment_status" class="form-control" ng-change="grid.appScope.filter(\'payment_status\', payment_status, \'bill\', \'billList\',true, grid.appScope.billParams)" ng-model="payment_status" placeholder="Search">',
				}, 
				{
					name:'net_amount',width:150,
					filterHeaderTemplate: '<input id="net_amount" class="form-control" ng-change="grid.appScope.filter(\'net_amount\', net_amount, \'bill\', \'billList\',true, grid.appScope.billParams)" ng-model="net_amount" placeholder="Search">',
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
					cellTemplate : 
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/bill/viewipdbill.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view  bill" > <span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
					+ 
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/bill/paybill.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Pay bill" > <span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
					+
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/bill/reciptview.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="View Recipt" > <span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
					+
					 '<a type="button" tooltip="Delete bill" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'bill\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
				}
			]
		};
		
		
			$scope.opdbillList = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{ name:'Sr.No', width:60,
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false,
			enableFiltering: false,	
				},
				{
					name:'bill_id',width:100,
					filterHeaderTemplate: '<input id="bill_id" class="form-control" ng-change="grid.appScope.filter(\'bill_id\', bill_id, \'bill\', \'opdbillList\',true, grid.appScope.opdbillParams)" ng-model="bill_id" placeholder="Bill Id">',
				},
				{
					name:'opd_id',width:50,
					filterHeaderTemplate: '<input id="opd_id" class="form-control" ng-change="grid.appScope.filter(\'opd_id\', opd_id, \'bill\', \'opdbillList\',true, grid.appScope.opdbillParams)" ng-model="bill_id" placeholder="Bill Id">',
				},
				{
					name:'patient_name',width:150,
					filterHeaderTemplate: '<input id="patient_name" class="form-control" ng-change="grid.appScope.filter(\'patient_name\', patient_name, \'bill\', \'opdbillList\',true, grid.appScope.opdbillParams)" ng-model="patient_name" placeholder="Search">',
				}, 
				{
					name:'payment_status',width:150,
					filterHeaderTemplate: '<input id="payment_status" class="form-control" ng-change="grid.appScope.filter(\'payment_status\', payment_status, \'bill\', \'opdbillList\',true, grid.appScope.opdbillParams)" ng-model="payment_status" placeholder="Search">',
				}, 
				{
					name:'net_amount',width:150,
					filterHeaderTemplate: '<input id="net_amount" class="form-control" ng-change="grid.appScope.filter(\'net_amount\', net_amount, \'bill\', \'opdbillList\',true, grid.appScope.opdbillParams)" ng-model="net_amount" placeholder="Search">',
				}, 
				{ name:'paid_amount',width:100,enableSorting: false,enableFiltering: false,
				},
				{ name:'due_amount',width:100,enableSorting: false,enableFiltering: false,
				},
				
				{ name:'Manage', width:200,
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'bill\', \'opdbillList\',false,grid.appScope.opdbillParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					   type: uiGridConstants.filter.SELECT,  
					  selectOptions: [ { value: '1', label: 'Active' }, { value: '0', label: 'Deleted' }
					  ]
					} , 
					cellTemplate : 
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/bill/viewopdbill.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view  bill" > <span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
					+ 
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/bill/paybill.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Pay bill" > <span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
					+
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/bill/reciptview.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="View Recipt" > <span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
					
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
				bill : (data) ? {
					id : data.id,
					user_id : data.user_id,
					user_id : $rootScope.userDetails.id,
					modified_date:data.modified_date,
					
				} : {
					date : dataService.sqlDateFormate(false,"datetime"),
					user_id : $rootScope.userDetails.id,
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					bill_date: dataService.sqlDateFormate()
				
				},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'bill','billList');
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'bill','billList');
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
				user_id : $rootScope.userDetails.id,
				//patient_id : patient_id
				//type : ($routeParams.party == "vendor") ? "vendor" : "client"
			},
			
			cols : ["*"]
		}
		$scope.opdbillParams = {
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
			$scope.getData($scope.currentPage, table, subobj, $scope.params);
		}
	};	
	// Inject controller's dependencies
	billController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('billController', billController);
});
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
		$scope.billData = {
			enableSorting: true,
			enableFiltering: true,
			rowTemplate:rowtpl,
			columnDefs: [
				{ name:'SrNo', width:50,
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false, enableFiltering: false,
					
				},
				
				{ name:'bill_id', width:70,enableSorting: false, enableFiltering: true,
					filterHeaderTemplate: '<input id="bill_id" class="form-control" ng-change="grid.appScope.filter(\'bill_id\', bill_id, \'bill\', \'billData\',true,grid.appScope.billParams)" ng-model="bill_id" placeholder="Bill No">',
				},
				
			
				
				
				
				
				{
					name:'manage',width:200,enableSorting: false,enableFiltering: true,
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'bill\', \'billData\',false,grid.appScope.billParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>',
					
					
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/hospital/bill/generate_bill.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip=" Generate bill Information"> <span class="glyphicon glyphicon-pencil"></span></a>'
					
					+ '<a type="button" tooltip="Delete stock" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'bill\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
			'
					
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
				$scope.getData(false, $scope.currentPage, "bill", "billData", $scope.billParams);
			}
		}
		
		
		$scope.openModal = function(url,data){
				var modalDefault = {
				templateUrl: url, // apply template to modal
				size : 'lg'
				};
			var modalOptions = {
				date : dataService.sqlDateFormate(),
				addBill : (data) ? {
					id : data.id,
					bill_id :data.bill_id,
				
					modified_date : dataService.sqlDateFormate(false,"datetime")
				} : {
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					due_date : $scope.setDate(dataService.sqlDateFormate(), 10, "date"),
					status : 1,
					user_id : $rootScope.userDetails.id
				},
				
				getBalance : $scope.getBalance,
				calcBalance : $scope.calcBalance,
				receiptData : (data) ?{
					name : data.name
				}:{
					
				},
				receiptParams : (data) ?{
					where : {
						reference_id : data.id,
						type : "bill_payment",
						user_id : $rootScope.userDetails.id,
						status : 1
					},
					cols : ["*"]
				}:{

				},
				
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'bill','billData',$scope.billParams);
						}
					})
				},
				setDate : function(date, days){
					var dueDate = $scope.setDate(date, days, "date");
					modalOptions.addBill.due_date = dueDate;
				},
				sqlDateFormat : function(date, object){
					var sqlDate = dataService.sqlDateFormate(date,"date");
					object = sqlDate;
				},
				getData: $scope.getData,
				//addToObject : $rootScope.addToObject,
				addToObject : function(object,data,modalOptions){
					$rootScope.addToObject(object,modalOptions[data]);
					modalOptions[data] = {};
				},
				
				removeObject : $rootScope.removeObject
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
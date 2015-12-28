'use strict';

define(['app'], function (app) {
	var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService', 'uiGridConstants'];
    
   var feesController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService, uiGridConstants) {
		$rootScope.metaTitle = "campus";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.alerts = [];
		$scope.currentPage = 1;
		$scope.pageItems = 10;
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");
		$rootScope.serverApiV2 = true;
		$rootScope.module = "campus";
	   console.log($rootScope.userDetails);
	    $scope.feesParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
			},
			cols : ["*"]
		} 
	  $rootScope.moduleMenus = [
			{
				name : "Add Fees",
				SubTitle :"Fees",
				events : {
					click : function(){
						return $scope.openModal("modules/campus/accounting/fees/addfees.html");
					}
				}
			}
		]
		$scope.feesList = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{
					name:'SrNo', width:80,
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false,
					enableFiltering: false,	
				},
				{ 
					name:'dept_name',
					filterHeaderTemplate: '<input id="dept_name" class="form-control" ng-change="grid.appScope.filter(\'dept_name\', dept_name, \'fees_view\', \'feesList\',true,grid.appScope.deptParams)" ng-model="dept_name" placeholder="Department Name">',
				},
				{ 
					name:'class_name',
					filterHeaderTemplate: '<input id="class_name" class="form-control" ng-change="grid.appScope.filter(\'class_name\', class_name, \'fees_view\', \'feesList\',true,grid.appScope.classParams)" ng-model="class_name" placeholder="Class Name">',
				},
				{
					name:'Manage', 
					enableSorting: false, 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'fees_view\', \'feesList\',false,grid.appScope.feesParams)" ng-model="status">'
							+'<option value="" selected>Status</option>'
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					  options: [ { value: '1', label: 'Active' }, { value: '0', label: 'Delete' }]
					} ,
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/campus/accounting/fees/addfees.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit Fees"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete Fees" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'fees\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'+'<a ng-click="grid.appScope.openModal(\'modules/campus/accounting/fees/viewfees.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="View Department"> <span class="glyphicon glyphicon-eye-open"></span></a>'
				}
			]
		};
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "fees_view", "feesList", $scope.feesParams);
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
				feesList : (data)?{
						id : data.id
					}:{},
					addFees : (data) ? {
						id : data.id,
						user_id : data.user_id,
						dept_id : data.dept_id,
						class_id : data.class_id,
						fees : data.fees,
						modified_date : dataService.sqlDateFormate(false,"datetime"),
					} : {
						//distributions : $rootScope.userDetails.distributions,
						user_id : $rootScope.userDetails.id,
						date : dataService.sqlDateFormate(false,"datetime"),
						modified_date : dataService.sqlDateFormate(false,"datetime"),
					},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'fees_view','feesList',$scope.feesParams);
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'fees_view','feesList',$scope.feesParams);
						}
					})
				},
				
				getData : $scope.getData,
				deptParams : {
					where : {
					user_id : $rootScope.userDetails.id,
					status:1,
				},
				cols : ["*"]
				},
				classParams : {
					where : {
					user_id : $rootScope.userDetails.id,
					status:1,
				},
				cols : ["*"]
				},
				addToObject : function(object,data,modalOptions){
					$rootScope.addToObject(object,modalOptions[data]);
					modalOptions[data] = {};
				},
				removeObject : $rootScope.removeObject
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
	feesController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('feesController', feesController);
	
});
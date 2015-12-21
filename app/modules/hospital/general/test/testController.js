'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$location','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants'];
    
    // This is controller for this view
	var testController= function ($scope,$location,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
		//global scope objects
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
		
		$rootScope.moduleMenus = [
			{
				name : "Add Test",
				path : "#/dashboard/hospital/general/test",
				events : {
					click : function(){
						return $scope.openModal("modules/hospital/general/test/addtest.html");
					}
				}
			},{
				name : "Test List",
				path : "#/dashboard/hospital/general/test"
			}
		]

		$scope.testList = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{ name:'SrNo', 
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false,
			enableFiltering: false,	
				},
				{
					name:'test_name',
					filterHeaderTemplate: '<input id="test_name" class="form-control" ng-change="grid.appScope.filter(\'test_name\', test_name, \'test\', \'testList\',true, grid.appScope.testParams)" ng-model="test_name" placeholder="test_name">',
				},
					{
					name:'test_type',
					filterHeaderTemplate: '<input id="test_type" class="form-control" ng-change="grid.appScope.filter(\'test_type\', test_type, \'test\', \'testList\',true, grid.appScope.testParams)" ng-model="test_type" placeholder="test_type">',
				},
				{
					name:'test_description',
					filterHeaderTemplate: '<input id="test_description" class="form-control" ng-change="grid.appScope.filter(\'test_description\', test_description, \'test\', \'testList\',true, grid.appScope.testParams)" ng-model="test_description" placeholder="test_description">',
				},
				{ name:'Manage', 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'test\', \'testList\',false,grid.appScope.testParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					   type: uiGridConstants.filter.SELECT,  
					  selectOptions: [ { value: '1', label: 'Active' }, { value: '0', label: 'Deleted' }
					  ]
					} , 
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/hospital/general/test/addtest.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit test Information"> <span class="glyphicon glyphicon-pencil"></span></a>'
				
					+ 
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/general/test/testview.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view test" > <span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
						+ 
					'<a type="button" tooltip="Delete test" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'test\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
				}
			]
		};
		
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "test", "testList", $scope.testParams);
			}
		}
			$scope.openModal = function(url,data){
			var modalDefault = {
				templateUrl:url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				date : $scope.currentDate,
				test_date:$scope.currentDate,
				modified_date:$scope.currentDate,
				date:$scope.currentDate,
				addtest : (data) ? {
					id : data.id,
					user_id : data.user_id,
					user_id : $rootScope.userDetails.id,
					test_description: data.test_description,
					test_date:data.test_date,
					test_type:data.test_type,
					test_name:data.test_name,
					test_charges:data.test_charges,
					modified_date:data.modified_date,
					date : data.date,
				} : {
					date : dataService.sqlDateFormate(),
					user_id : $rootScope.userDetails.id,
					modified_date : dataService.sqlDateFormate(),
					test_date: dataService.sqlDateFormate()
				},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'test','testList');
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'test','testList');
						}
					})
				},
				getData : $scope.getData
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){	
			})
		}
		$scope.testParams = {
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
	testController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('testController', testController);
});
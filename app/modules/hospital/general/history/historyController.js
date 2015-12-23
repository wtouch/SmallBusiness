'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$location','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants'];
    
    // This is controller for this view
	var historyController= function ($scope,$location,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
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
				name : "Add History",
				path : "#/dashboard/hospital/general/history",
				events : {
					click : function(){
						return $scope.openModal("modules/hospital/general/history/addhistory.html");
					}
				}
			}
		]

		$scope.historyList = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{ name:'SrNo', 
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false,
			enableFiltering: false,	
				},{
					name:'history_title',
					filterHeaderTemplate: '<input id="history_title" class="form-control" ng-change="grid.appScope.filter(\'history_title\', history_title, \'history\', \'complaintList\',true, grid.appScope.historyParams)" ng-model="history_title" placeholder="History Title">',
				},
				{
					name:'category',
					filterHeaderTemplate: '<input id="category" class="form-control" ng-change="grid.appScope.filter(\'category\', category, \'history\', \'complaintList\',true, grid.appScope.historyParams)" ng-model="category" placeholder="Category">',
				},
				
				{
					name:'type',
					filterHeaderTemplate: '<input id="type" class="form-control" ng-change="grid.appScope.filter(\'type\', type, \'complaint\', \'complaintList\',true, grid.appScope.historyParams)" ng-model="type" placeholder="Type">',
				},
				
				{
					name:'history_description',
					filterHeaderTemplate: '<input id="history_description" class="form-control" ng-change="grid.appScope.filter(\'history_description\', history_description, \'history\', \'historyList\',true, grid.appScope.historyParams)" ng-model="history_description" placeholder="History Description">',
				},
				{ name:'Manage', 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'history\', \'historyList\',false,grid.appScope.historyParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					   type: uiGridConstants.filter.SELECT,  
					  selectOptions: [ { value: '1', label: 'Active' }, { value: '0', label: 'Deleted' }
					  ]
					} , 
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/hospital/general/history/addhistory.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit History Information"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ 
					'<a type="button" tooltip="Delete history" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'history\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+ 
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/general/history/historyview.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view  history" > <span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
				}
			]
		};
		
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "history", "historyList", $scope.historyParams);
			}
		}
			$scope.openModal = function(url,data){
			var modalDefault = {
				templateUrl:url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				date : $scope.currentDate,
				history_date:$scope.currentDate,
				modified_date:$scope.currentDate,
				date:$scope.currentDate,
				addhistory : (data) ? {
					id : data.id,
					user_id : data.user_id,
					user_id : $rootScope.userDetails.id,
					category:data.category,
					type:data.type,
					history_title: data.history_title,
					history_description: data.history_description,
					history_date:data.history_date,
					modified_date:data.modified_date,
					date : data.date,
				} : {
					date : dataService.sqlDateFormate(false,"datetime"),
					user_id : $rootScope.userDetails.id,
					modified_date : dataService.sqlDateFormate(false,"datetime"),
				history_date: dataService.sqlDateFormate()
				},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'history','historyList');
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'history','historyList');
						}
					})
				},
				getData : $scope.getData
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){	
			})
		}
		$scope.historyParams = {
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
	historyController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('historyController', historyController);
});
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$location','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants'];
    
    // This is controller for this view
	var complaintController= function ($scope,$location,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
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
				name : "Add Complaint",
				path : "#/dashboard/hospital/general/complaint",
				events : {
					click : function(){
						return $scope.openModal("modules/hospital/general/complaint/addcomplaint.html");
					}
				}
			}
		]

		$scope.complaintList = {
			enableSorting: true,
			enableFiltering: true,
			enableColumnResizing: true,
			columnDefs: [
				{ name:'SrNo',  width:60,
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false,
			enableFiltering: false,	
				},
				{
					name:'complaint_name',
					filterHeaderTemplate: '<input id="complaint_name" class="form-control" ng-change="grid.appScope.filter(\'complaint_name\', complaint_name, \'complaint\', \'complaintList\',true, grid.appScope.complaintParams)" ng-model="complaint_name" placeholder="Complaint Name">',
				},
				{
					name:'category',
					filterHeaderTemplate: '<input id="complaint_category" class="form-control" ng-change="grid.appScope.filter(\'category\', category, \'complaint\', \'complaintList\',true, grid.appScope.complaintParams)" ng-model="category" placeholder="Category">',
				},
				
				{
					name:'type',
					filterHeaderTemplate: '<input id="type" class="form-control" ng-change="grid.appScope.filter(\'type\', type, \'complaint\', \'complaintList\',true, grid.appScope.complaintParams)" ng-model="type" placeholder="Type">',
				},
				{
					name:'complaint_description',
					enableSorting: false,enableFiltering: false,
				},
				{ name:'Manage', 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'complaint\', \'complaintList\',false,grid.appScope.complaintParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					   type: uiGridConstants.filter.SELECT,  
					  selectOptions: [ { value: '1', label: 'Active' }, { value: '0', label: 'Deleted' }
					  ]
					} , 
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/hospital/general/complaint/addcomplaint.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit complaint Information"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ 
					'<a type="button" tooltip="Delete complaint" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'complaint\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+ 
					'<a ng-click="grid.appScope.openModal(\'modules/hospital/general/complaint/complaintview.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view complaint" > <span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
				}
			]
		};
		
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "complaint", "complaintList", $scope.complaintParams);
			}
		}
			$scope.openModal = function(url,data){
			var modalDefault = {
				templateUrl:url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				date : $scope.currentDate,
				complaint_date:$scope.currentDate,
				modified_date:$scope.currentDate,
				date:$scope.currentDate,
				addcomplaint : (data) ? {
					id : data.id,
					user_id : data.user_id,
					user_id : $rootScope.userDetails.id,
					category: data.category,
					type:data.type,
					complaint_name:data.complaint_name,
					complaint_description: data.complaint_description,
					complaint_date:data.complaint_date,
					modified_date:data.modified_date,
					date : data.date,
				} : {
					date : dataService.sqlDateFormate(),
					user_id : $rootScope.userDetails.id,
					modified_date : dataService.sqlDateFormate(),
					complaint_date: dataService.sqlDateFormate()
				},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'complaint','complaintList');
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'complaint','complaintList');
						}
					})
				},
				getData : $scope.getData
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){	
			})
		}
		$scope.complaintParams = {
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
					user_id : $rootScope.userDetails.id,
					staus:1
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
	complaintController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('complaintController', complaintController);
});
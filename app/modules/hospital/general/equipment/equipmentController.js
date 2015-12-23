'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$location','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants'];
    
    // This is controller for this view
	var equipmentController= function ($scope,$location,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
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
				name : "Add Equipment",
				path : "#/dashboard/hospital/general/equipment",
				events : {
					click : function(){
						return $scope.openModal("modules/hospital/general/equipment/addequipment.html");
					}
				}
			}
		]

		$scope.equipmentList = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{ name:'Sr.No', width:60,
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false,
			enableFiltering: false,	
				},
				{
					name:'equipment_name',width:300,
					filterHeaderTemplate: '<input id="equipment_name" class="form-control" ng-change="grid.appScope.filter(\'equipment_name\', equipment_name, \'equipment\', \'equipmentList\',true, grid.appScope.equipmentParams)" ng-model="equipment_name" placeholder="Equipment Name">',
				},
				{
					name:'equipment_description',width:300,
					filterHeaderTemplate: '<input id="equipment_description" class="form-control" ng-change="grid.appScope.filter(\'equipment_description\', equipment_description, \'equipment\', \'equipmentList\',true, grid.appScope.equipmentParams)" ng-model="equipment_description" placeholder="Equipment Description">',
				},
				
				{ name:'quantity',width:100,enableSorting: false,enableFiltering: false,
				},
				{ name:'price',width:100,enableSorting: false,enableFiltering: false,
				},
				
				{ name:'Manage', width:200,
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'equipment\', \'equipmentList\',false,grid.appScope.equipmentParams)" ng-model="status">'
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
		
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "equipment", "equipmentList", $scope.equipmentParams);
			}
		}
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
		$scope.equipmentParams = {
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
	equipmentController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('equipmentController', equipmentController);
});
'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$location','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants'];
    
    // This is controller for this view
	var equipmentController= function ($scope,$location,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
		//global scope objects
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.pageItems = 10;
		$scope.numPages = "";	
		$scope.currentPage = 1;
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");
		$rootScope.serverApiV2 = true;
		$rootScope.module = "hospital";
		console.log("This is Equipement Controller");
		$rootScope.moduleMenus = [
			{
				name : "Add Equipment",
				SubTitle :"Add Equipment",
				events : {
					click : function(){
						return $scope.openModal("modules/hospital/general/equipment/addequipment.html");
					}
				}
			},{
				name : "Equipment List",
				path : "#/dashboard/hospital/equipment",
				SubTitle :"Equipment List"
			}
		]
		
		$scope.equipment = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{
					name:'Sr.No',width:50,
					enableSorting: false,
					enableFiltering: false, 
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>"
					
				},
				{
				    name:'equipment name',
					filterHeaderTemplate: '<input id="equipment_name" class="form-control" ng-change="grid.appScope.filter(\'equipment_name\', equipment_name, \'equipment\', \'equipment\', true, grid.appScope.equipmentParams)" ng-model="equipment_name" placeholder="search">',
                },
				{
					name:'description',
					filterHeaderTemplate: '<input id="description" class="form-control" ng-change="grid.appScope.filter(\'description\', description, \'equipment\', \'equipment\',true, grid.appScope.equipmentParams)" ng-model="description" placeholder="search">'
                },
				{
					name:'quantity',
					filterHeaderTemplate: '<input id="phone" class="form-control"  ng-model="phone" placeholder="search">'
                },
				{
				    name:'price',
				    filterHeaderTemplate: '<input id="price" class="form-control"  ng-model="price" >', 
                },
			
				
				{ name:'Manage', 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'equipment\', \'equipment\',true, grid.appScope.equipmentParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					   type: uiGridConstants.filter.SELECT,  
					  selectOptions: [ { value: '1', label: 'Active' }, { value: '0', label: 'Deleted' }
					  ]
					} ,
				
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/hospital/general/equipment/addequipment.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit equipment" > <span class="glyphicon glyphicon-pencil"></span></a>'
					
					
					+ '<a ng-click="grid.appScope.openModal(\'modules/hospital/general/equipment/equipmentview.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view  equipment" > <span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
					
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
				addeuipment : (data) ? {
				
			
			
			
			} : {
					date : dataService.sqlDateFormate(),
					
				},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'equipment','equipment');
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'equipment','equipment');
						}
					})
				},
				formPart :'',
				showFormPart : function(formPart,modalOptions){
					modalOptions.formPart = formPart;
					
				},
				getData : $scope.getData,
			};
			
			modalService.showModal(modalDefault, modalOptions).then(function(){
				
			})
			
		}
		
		/*get data */
		 $scope.getData = function(single, page, table, subobj, params, modalOptions) {
			$scope.params = (params) ? params : {
				where : {
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
	equipmentController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('equipmentController', equipmentController);
});
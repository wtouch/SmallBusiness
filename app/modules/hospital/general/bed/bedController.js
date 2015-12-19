'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService', 'uiGridConstants'];
    
    // This is controller for this view
	var bedController = function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		//global scope objects
		$scope.invoice = true;
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
		//$scope.bedList = {};
		
		$rootScope.moduleMenus = [
			{
				name : "Add bed",
				path : "#/dashboard/hospital/general/bed",
				events : {
					click : function(){
						return $scope.openModal("modules/hospital/general/bed/addbed.html");
					}
				}
			},{
				name : "bed List",
				path : "#/dashboard/hospital/general/bed"
			}
		]

		$scope.bedList = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{ name:'SrNo', 
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false,
			enableFiltering: false,	
				},
				{ name:'ward_name',enableSorting: false ,
				filterHeaderTemplate: '<select id="ward_name" class="form-control" ng-change="grid.appScope.filter(\'ward_id\', ward_id, \'bed\', \'bedList\',true, grid.appScope.bedParams)" ng-model="ward_id" ng-options="item.ward_id as item.ward_name for item in grid.appScope.wardList">' 
							+'<option value="">Select Ward name</option>'
						+'</select>',
				},
				{
					name:'bed_number',
					filterHeaderTemplate: '<input id="bed_number" class="form-control" ng-change="grid.appScope.filter(\'bed_number\', bed_number, \'bed\', \'bedList\',true, grid.appScope.bedParams)" ng-model="bed_number" placeholder="bed_number">',
				},
				{
					name:'bed_description',
					filterHeaderTemplate: '<input id="bed_description" class="form-control" ng-change="grid.appScope.filter(\'bed_description\', bed_description, \'bed\', \'bedList\',true, grid.appScope.bedParams)" ng-model="bed_description" placeholder="bed_description">',
				},
				{ name:'Manage', 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'bed\', \'bedList\',false,grid.appScope.bedParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					   type: uiGridConstants.filter.SELECT,  
					  selectOptions: [ { value: '1', label: 'Active' }, { value: '0', label: 'Deleted' }
					  ]
					} , 
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/hospital/general/bed/addbed.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit bed Information"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete bed" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'bed\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
						
					+ '<a ng-click="grid.appScope.openModal(\'modules/hospital/general/bed/bedview.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view  Bed" > <span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
					
					
				}
			]
		};
		
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				$scope.getData(false, $scope.currentPage, "bed", "bedList", $scope.bedParams);
			}
		}
			$scope.openModal = function(url,data){
			var modalDefault = {
				templateUrl:url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				date : $scope.currentDate,
				wardParams : $scope.wardParams,
				bed_date:$scope.currentDate,
				modified_date:$scope.currentDate,
				date:$scope.currentDate,
				bed : (data) ? {
					id : data.id,
					user_id : data.user_id,
					ward_id:data.ward_id,
					user_id : $rootScope.userDetails.id,
					bed_number: data.bed_number,
					bed_description: data.bed_description,
					bed_date:data.bed_date,
					bed_charges:data.bed_charges,
					bed_room:data.bed_room,
					modified_date:data.modified_date,
					date : data.date,
				} : {
					date : dataService.sqlDateFormate(),
					user_id : $rootScope.userDetails.id,
					modified_date : dataService.sqlDateFormate(),
					bed_date: dataService.sqlDateFormate()
				},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'bed','bedList',$scope.bedParams);
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'bed','bedList',$scope.bedParams);
						}
					})
				},
				getData : $scope.getData
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){	
			})
		}
		$scope.bedParams = {
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
	bedController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('bedController', bedController);
});
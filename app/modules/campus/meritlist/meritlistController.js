'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$location','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants'];
    
    // This is controller for this view
	var meritlistController= function ($scope,$location,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
		//global scope objects
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.pageItems = 10;
		$scope.currentPage = 1;
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");
		$rootScope.serverApiV2 = true;
		$rootScope.module = "campus";
		$rootScope.moduleMenus = [
			{
				name : "Registration",
				SubTitle :"Registration",
				events : {
					click : function(){
						return $scope.openModal("modules/campus/student/registeredstudent.html");
					}
				}
			},
			{
				name : "Registered List",
				path : "#/dashboard/campus/registration",
				SubTitle :"Registered List",
				
			},
			{
				name : "Merit List",
				SubTitle :"Merit List",
				path : "#/dashboard/campus/meritlist",
			},
			{
				name : "Student List",
				path : "#/dashboard/campus/student",
				SubTitle :"Student List",
				
			},
			{
				name : "+",
				events : {
					click : function(){
						$scope.isCollapsed = !$scope.isCollapsed;
						console.log($scope.isCollapsed);
					}
				}
			}]
		
		
		$scope.currentPath = $location.path();
		var dueDate = new Date();
		dueDate.setDate(dueDate.getDate() + 10);
		var dueMonth = dueDate.getMonth() + 1;
		dueMonth = (dueMonth <= 9) ? '0' + dueMonth : dueMonth;
		$scope.dueDate = dueDate.getFullYear() + "-" + dueMonth + "-" + dueDate.getDate();
		
		$scope.meritList = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{
					name:'SrNo',width:50,
					enableSorting: false,
					enableFiltering: false, 
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>"
					
				},
				{
				    name:'student_name',
					filterHeaderTemplate: '<input id="name" class="form-control" ng-change="grid.appScope.filter(\'name\', name, \'vendor\', \'vendorlist\', true, grid.appScope.vendorParams)" ng-model="name" placeholder="search">',
                },
				{
				    name:'dept_name',
					filterHeaderTemplate: '<input id="name" class="form-control" ng-change="grid.appScope.filter(\'name\', name, \'vendor\', \'vendorlist\', true, grid.appScope.vendorParams)" ng-model="name" placeholder="search">',
                },
				{
				    name:'class_name',
					filterHeaderTemplate: '<input id="name" class="form-control" ng-change="grid.appScope.filter(\'name\', name, \'vendor\', \'vendorlist\', true, grid.appScope.vendorParams)" ng-model="name" placeholder="search">',
                },
				{
					name:'email_id',
					filterHeaderTemplate: '<input id="email" class="form-control" ng-change="grid.appScope.filter(\'email\', email, \'vendor\', \'vendorlist\',true, grid.appScope.vendorParams)" ng-model="email" placeholder="search">'
                },
				{
					name:'contact_no',
					filterHeaderTemplate: '<input id="phone" class="form-control" ng-change="grid.appScope.filter(\'phone\', phone, \'vendor\', \'vendorlist\',true, grid.appScope.vendorParams)" ng-model="phone" placeholder="search">'
                },
				{
					name:'cast',
					filterHeaderTemplate: '<input id="phone" class="form-control" ng-change="grid.appScope.filter(\'phone\', phone, \'vendor\', \'vendorlist\',true, grid.appScope.vendorParams)" ng-model="phone" placeholder="search">'
                },
			   {
				    name:'address',
					filterHeaderTemplate: '<input id="address" class="form-control" ng-change="grid.appScope.filter(\'address\', address, \'vendor\', \'vendorlist\',true, grid.appScope.vendorParams)" ng-model="address" placeholder="search">',
                },
				{
				    name:'city',
				    filterHeaderTemplate: '<input id="city" class="form-control" ng-change="grid.appScope.filter(\'city\', city, \'vendor\', \'vendorlist\',true, grid.appScope.vendorParams)" ng-model="city" placeholder="search">', 
                },
				{ name:'Manage',width:150,
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'vendor\', \'vendorlist\',false, grid.appScope.vendorParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>',
				
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/campus/vendor/addvendor.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit vendor" > <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete record" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'vendor\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'+ '<a ng-click="grid.appScope.openModal(\'modules/campus/vendor/viewvendor.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view  vendor" > <span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
					
				}
			]
		};
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				console.log($scope.vendorParams);
				$scope.getData(false, $scope.currentPage, "registration", "meritlist", $scope.vendorParams);
			}
		}
		$scope.classParams = {
				where : {
					status : 1,
					user_id : $rootScope.userDetails.id
				},
				cols : ["*"]
		};
	 $scope.getData = function(single, page, table, subobj, params, modalOptions) {
			$scope.params = (params) ? params : {
				where : {
					user_id : $rootScope.userDetails.id,
					status:1,
				},
				cols : ["*"]
			};
			if(page){
				dataService.extendDeep($scope.params, {
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
	meritlistController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('meritlistController', meritlistController);
});
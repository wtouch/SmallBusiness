'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants'];
    
    // This is controller for this view
	var partyController= function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
		//global scope objects
		$scope.invoice = true;
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.pageItems = 10;
		$scope.numPages = "";		
		$scope.currentPage = 1;
		$scope.currentDate = dataService.currentDate;
		$rootScope.serverApiV2 = true;
		$rootScope.module = "inventory";
		
		
		$scope.party = {
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{ name:'SrNo',enableSorting: false,
			enableFiltering: false, 
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",
					filter: {
					  //placeholder: 'ends with'
					}
				},
				
				{
				    name:'name',
					filterHeaderTemplate: '<input id="name" class="form-control" ng-change="grid.appScope.filter(\'name\', name, \'party\', \'party\')" ng-model="name" placeholder="search">',
                },
				
				
			/* 	{
				    name:'email',
					filterHeaderTemplate: '<input id="email" class="form-control" ng-change="grid.appScope.filter(\'email\', email, \'party\', \'party\')" ng-model="email" placeholder="search">',
                }, */
				   {
				    name:'email',
					filterHeaderTemplate: '<input id="email" class="form-control" ng-change="grid.appScope.filter(\'email\', email, \'party\', \'party\')" ng-model="email" placeholder="search">',
                },
				
			   {
				    name:'address',
					filterHeaderTemplate: '<input id="address" class="form-control" ng-change="grid.appScope.filter(\'address\', address, \'party\', \'party\')" ng-model="address" placeholder="search">',
                },
				
				
				{
				    name:'city',
				     filterHeaderTemplate: '<input id="city" class="form-control" ng-change="grid.appScope.filter(\'city\', city, \'party\', \'party\')" ng-model="city" placeholder="search">', 
                },
				
				{
				    name:'type',
					filterHeaderTemplate: '<select id="type" class="form-control" ng-change="grid.appScope.filter(\'type\', type, \'party\', \'party\')" ng-model="type">'
							+'<option value="" selected>Type</option>' 
							+'<option value="0">Client</option>'
							+'<option value="1">Vender</option>	'
							+'<option value="1">Employee</option>	'
						+'</select>', 
				 filter: {
					   type: uiGridConstants.filter.SELECT,  
					  selectOptions: [ { value: 'Client', label: 'Client' }, { value: 'Vender', label: 'Vender'},{ value: 'Employee', label: 'Employee' }]
					} 
                },
				{ name:'designation',
					enableSorting: false,
					enableFiltering: false,},
				{ name:'department',
					enableSorting: false,
					enableFiltering: false,},
				{ name:'salary',
					enableSorting: false,
					enableFiltering: false,},
				{ name:'status',
				filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'party\', \'party\')" ng-model="status">'
							/* +'<option value="" selected>Status</option>' */
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
				 filter: {
					   type: uiGridConstants.filter.SELECT,  
					  selectOptions: [ { value: '1', label: 'Active' }, { value: '0', label: 'Deleted' }
					  ]
					} 
				},
				
				{ name:'Manage', enableSorting: false, enableFiltering: false, 
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/inventory/party/addparty.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit party" > <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete record" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'party\', \'status\',row.entity.status, row.entity.id)" btn-checkbox="" btn-checkbox-true="1" btn-checkbox-false="0" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					
				}
			]
		};
		
		$scope.openModal = function(url,data){
			
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				
				adduserdate:{date : $scope.currentDate},
				adduser : (data) ? {
					id : data.id,
					name : data.name,
					email : data.email,
					phone: data.phone,
					address: data.address,
					location: data.location,
					area: data.area,
					city: data.city,
					state: data.state,
					country: data.country,
					pincode: data.pincode,
					date : data.date,					
					type: data.type,
					designation: data.designation,
					department: data.department,
					salary: data.salary,
			} : {
					date : dataService.sqlDateFormate()
				},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'party','party');
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'party','party');
						}
					})
				}
			};
			
			modalService.showModal(modalDefault, modalOptions).then(function(){
				
			})
			
		}
		
		// For Get (Select Data from DB)
		$scope.getData = function(single, page, table, subobj, params, modalOptions) {
			$scope.params = (params) ? params : {
				where : {
					status : 1
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
				console.log(response);
				if(response.status == 'success'){
					if(modalOptions != undefined){
						modalOptions[subobj].data = angular.copy(response.data);
						modalOptions.totalRecords = response.totalRecords;
					}else{
						($scope[subobj]) ? $scope[subobj].data = angular.copy(response.data) : $scope[subobj] = angular.copy(response.data) ;
						$scope.totalRecords = response.totalRecords;
					}
				}else{
					if(modalOptions != undefined){
						modalOptions[subobj].data = [];
						modalOptions.totalRecords = 0;
					}else{
						($scope[subobj]) ? $scope[subobj].data = [] : $scope[subobj] = [] ;
						$scope.totalRecords = 0;
					}
				}
			});
		}
		
		$scope.filter = function(col, value, table, subobj, search){
			value = (value) ? value : undefined;
			$rootScope.filterData(col, value, search, function(response){
				angular.extend($scope.params, response);
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
	partyController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('partyController', partyController);
});
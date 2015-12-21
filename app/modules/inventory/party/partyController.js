'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$location','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants'];
    
    // This is controller for this view
	var partyController= function ($scope,$location,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
		//global scope objects
		$scope.invoice = true;
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.pageItems = 10;
		$scope.numPages = "";	
		$scope.currentPage = 1;
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");
		$rootScope.serverApiV2 = true;
		$rootScope.module = "inventory";
		
		if(!$routeParams.party){
			$location.path("/dashboard/inventory/party/client");
		}
		$rootScope.moduleMenus = [
			{
				name : "Add Party",
				SubTitle :"Add Party",
				events : {
					click : function(){
						return $scope.openModal("modules/inventory/party/addparty.html");
					}
				}
			},{
				name : "Clients List",
				path : "#/dashboard/inventory/party/client",
				SubTitle :"Client List"
			},{
				name : "Vendors List",
				path : "#/dashboard/inventory/party/vendor",
				SubTitle :"Vendor List"
			}
		]
		$scope.currentPath = $location.path();
		
		var dueDate = new Date();
		dueDate.setDate(dueDate.getDate() + 10);
		var dueMonth = dueDate.getMonth() + 1;
		dueMonth = (dueMonth <= 9) ? '0' + dueMonth : dueMonth;
		$scope.dueDate = dueDate.getFullYear() + "-" + dueMonth + "-" + dueDate.getDate();
		
		$scope.party = {
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
				    name:'name',
					filterHeaderTemplate: '<input id="name" class="form-control" ng-change="grid.appScope.filter(\'name\', name, \'party\', \'party\', true, grid.appScope.partyParams)" ng-model="name" placeholder="search">',
                },
				{
					name:'email',
					filterHeaderTemplate: '<input id="email" class="form-control" ng-change="grid.appScope.filter(\'email\', email, \'party\', \'party\',true, grid.appScope.partyParams)" ng-model="email" placeholder="search">'
                },
				{
					name:'phone',
					filterHeaderTemplate: '<input id="phone" class="form-control" ng-change="grid.appScope.filter(\'phone\', phone, \'party\', \'party\',true, grid.appScope.partyParams)" ng-model="phone" placeholder="search">'
                },
			   {
				    name:'address',
					filterHeaderTemplate: '<input id="address" class="form-control" ng-change="grid.appScope.filter(\'address\', address, \'party\', \'party\',true, grid.appScope.partyParams)" ng-model="address" placeholder="search">',
                },
				{
				    name:'city',
				    filterHeaderTemplate: '<input id="city" class="form-control" ng-change="grid.appScope.filter(\'city\', city, \'party\', \'party\',true, grid.appScope.partyParams)" ng-model="city" placeholder="search">', 
                },
				{
				    name:'type',width:85,
					enableSorting: false,
					enableFiltering: false,
					cellTemplate : '<span ng-if="row.entity.type==\'client\'">Client</span><span ng-if="row.entity.type==\'vendor\'">Vendor</span>'
                },
				{ name:'Manage', 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'party\', \'party\',false, grid.appScope.partyParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>',
				
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/inventory/party/addparty.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit party" > <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete record" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'party\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'+ '<a ng-click="grid.appScope.openModal(\'modules/inventory/party/viewparty.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view  party" > <span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
					
				}
			]
		};
		
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				console.log($scope.partyParams);
				$scope.getData(false, $scope.currentPage, "party", "party", $scope.partyParams);
			}
		}
		
		$scope.openModal = function(url,data){
			
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				date : $scope.currentDate,
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
					partydate:data.partydate,
					type: data.type,
					department: data.department,
			} : {
					date : dataService.sqlDateFormate(),
					partydate: dataService.sqlDateFormate(),
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
				},
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'party','party',$scope.partyParams);
						}
					})
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'party','party',$scope.partyParams);
						}
					})
				}
			};
			
			modalService.showModal(modalDefault, modalOptions).then(function(){
				
			})
			
		}
		$scope.partyParams = {
			where : {
				user_id : $rootScope.userDetails.id,
				status : 1,
				type : ($routeParams.party == "vendor") ? "vendor" : "client"
			},
			cols : ["*"]
		},
		/*get data */
		 $scope.getData = function(single, page, table, subobj, params, modalOptions) {
			$scope.params = (params) ? params : {
				where : {
					user_id : $rootScope.userDetails.id,
					type : ($routeParams.party == "vendor") ? "vendor" : "client"
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
	partyController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('partyController', partyController);
});
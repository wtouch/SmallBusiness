'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$location','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants'];
    
    // This is controller for this view
	var vendorController= function ($scope,$location,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
		//global scope objects
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.pageItems = 10;
		$scope.numPages = "";	
		$scope.currentPage = 1;
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");
		$rootScope.serverApiV2 = true;
		$rootScope.module = "campus";
		
		$scope.vendorParams = {
			where : {
				status : 1,
				user_id : $rootScope.userDetails.id
			},
			cols : ["*"]
		}
		
		$rootScope.moduleMenus = [
			{
				name : "Add vendor",
				SubTitle :"Add vendor",
				events : {
					click : function(){
						return $scope.openModal("modules/campus/vendor/addvendor.html");
					}
				}
			}
		]
		
		
		$scope.vendor = {
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
					filterHeaderTemplate: '<input id="name" class="form-control" ng-change="grid.appScope.filter(\'name\', name, \'vendor\', \'vendor\', true, grid.appScope.vendorParams)" ng-model="name" placeholder="search">',
                },
				{
					name:'email',
					filterHeaderTemplate: '<input id="email" class="form-control" ng-change="grid.appScope.filter(\'email\', email, \'vendor\', \'vendor\',true, grid.appScope.vendorParams)" ng-model="email" placeholder="search">'
                },
				{
					name:'phone',
					filterHeaderTemplate: '<input id="phone" class="form-control" ng-change="grid.appScope.filter(\'phone\', phone, \'vendor\', \'vendor\',true, grid.appScope.vendorParams)" ng-model="phone" placeholder="search">'
                },
			   {
				    name:'address',
					filterHeaderTemplate: '<input id="address" class="form-control" ng-change="grid.appScope.filter(\'address\', address, \'vendor\', \'vendor\',true, grid.appScope.vendorParams)" ng-model="address" placeholder="search">',
                },
				{
				    name:'city',
				    filterHeaderTemplate: '<input id="city" class="form-control" ng-change="grid.appScope.filter(\'city\', city, \'vendor\', \'vendor\',true, grid.appScope.vendorParams)" ng-model="city" placeholder="search">', 
                },
				{ name:'Manage', 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'vendor\', \'vendor\',false, grid.appScope.vendorParams)" ng-model="status">'
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
				$scope.getData(false, $scope.currentPage, "vendor", "vendor", $scope.vendorParams);
			}
		}
		$scope.openModal = function(url,data){
			var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions ={
				addvendor:(data)?{
					id:data.id,
					name:data.name,
					
				}:{
					
				},
				postData : function(table, input){
						console.log(table, input);
						$rootScope.postData(table, input,function(response){
							if(response.status == "success"){
								$scope.getData(false, $scope.currentPage, 'vendor','vendor',$Scope.vendorParams);
							}
						})
					},
					formPart : 'vendorDetails',
					showFormPart : function(formPart, modalOptions){
						console.log(formPart);
						modalOptions.formPart = formPart;
					},
					getData : $scope.getData,
					
	 };
	 modalService.showModal(modalDefault, modalOptions).then(function(){
				
		})
	}
	}		
	// Inject controller's dependencies
	vendorController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('vendorController', vendorController);
});

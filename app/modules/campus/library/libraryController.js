'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants','$http'];
    
    // This is controller for this view
	var libraryController= function ($scope,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants,$http) {
		//global scope objects
		$scope.type = "year";
		$scope.maxSize = 5;
		$scope.pageItems = 10;	
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");		
		$scope.currentPage = 1;
		$scope.currentDate = dataService.currentDate;
		$rootScope.serverApiV2 = true;
		$rootScope.module = "campus";	
			

		$rootScope.moduleMenus = [
			{
				name : "+",
				events : {
					click : function(){
						$scope.isCollapsed = !$scope.isCollapsed;
						console.log($scope.isCollapsed);
					}
				}
			},{
				name : "Liabrary Stock",
				events : {
					click : function(){
						return $scope.openActualstock("modules/campus/library/addlibrarystock.html");
					}
				}
			},{
				name : "Actual Stock",
				events : {
					click : function(){
						return $scope.openActualstock("modules/campus/library/addActualstock.html");
					}
				}
			},{
				name : "Book Transaction",
				events : {
					click : function(){
						return $scope.openModal("modules/campus/library/booktransaction.html");
					}
				}
			}
			]
			$scope.book = ($scope.book)?
			$scope.book:{
				user_id : $rootScope.userDetails.id,
				date : dataService.sqlDateFormate(false,"datetime"),
				modified_date : dataService.sqlDateFormate(false,"datetime"),
			}
			$scope.bookParams = {
				where : {
					status : 1,
					user_id : $rootScope.userDetails.id
				},
				cols : ["*"]
			}
			
			$scope.bookList={
			enableSorting: true,
			enableFiltering: true,
			columnDefs: [
				{
					name:'SrNo', width:40,
					cellTemplate : "<span>{{ (grid.appScope.pageItems * (grid.appScope.currentPage - 1)) + rowRenderIndex + 1}}</span>",enableSorting: false,
					enableFiltering: false,	
				},{ 
					name:'book_name',width:130,
					enableSorting: false, enableFiltering: true,
					filterHeaderTemplate: '<input id="book_name" class="form-control" ng-change="grid.appScope.filter(\'book_name\', book_name, \'book\', \'bookList\',true,grid.appScope.bookParams)" ng-model="book_name" placeholder="Book Name">',
				},
				{ 
					name:'author',width:130,
					enableSorting: false, enableFiltering: true,
					filterHeaderTemplate: '<input id="author" class="form-control" ng-change="grid.appScope.filter(\'author\', author, \'book\', \'bookList\',true,grid.appScope.bookParams)" ng-model="author" placeholder="Author Name">',
				}, { 
					name:'publisher',width:140,
					enableSorting: false, enableFiltering: true,
					filterHeaderTemplate: '<input id="publisher" class="form-control" ng-change="grid.appScope.filter(\'publisher\', publisher, \'book\', \'bookList\',true,grid.appScope.bookParams)" ng-model="publisher" placeholder="Publisher Name">',
				},{ 
					name:'edition',width:130,
					enableSorting: false, enableFiltering: true,
					filterHeaderTemplate: '<input id="edition" class="form-control" ng-change="grid.appScope.filter(\'edition\',edition, \'book\', \'bookList\',true,grid.appScope.bookParams)" ng-model="edition" placeholder="Edition">',
				},{ 
					name:'price',width:130,
					enableSorting: false, enableFiltering: true,
					filterHeaderTemplate: '<input id="price" class="form-control" ng-change="grid.appScope.filter(\'price\', price,\'book\', \'bookList\',true,grid.appScope.bookParams)" ng-model="price" placeholder="Price">',
				},{
					name:'Manage',width:150, 
					enableSorting: false, 
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'book\', \'bookList\',false,grid.appScope.bookParams)" ng-model="status">'
							+'<option value="" selected>Status</option>'
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>', 
					filter: {
					  //type: uiGridConstants.filter.SELECT,
					  options: [ { value: '1', label: 'Active' }, { value: '0', label: 'Delete' }]
					} ,
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/campus/library/booktransaction.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit Book Transaction"> <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete Book Transaction" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'book_transaction\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+'<a ng-click="grid.appScope.openModal(\'modules/campus/library/view_book_transaction.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="View Book Transaction"> <span class="glyphicon glyphicon-eye-open"></span></a>'
				}
				]
			};
			$scope.callbackColChange = function(response){
			console.log(response);
				if(response.status == "success"){
					$scope.getData(false, $scope.currentPage, "book", "bookList", $scope.bookParams);
				}
			}
					/* add lib stock */											
		$scope.openLibrarystock=function(url,data){
			var modalDefault={
				templateUrl:url,// apply template to modal
				size:'lg'
			};
			var modalOptions={
				date : $scope.currentDate,
				addliabrarystock:(data)?{
					modified_date : dataService.sqlDateFormate(false,"datetime"),
				}:{
						user_id:$rootScope.userDetails.id,
						date : dataService.sqlDateFormate(false,"datetime"),
						modified_date : dataService.sqlDateFormate(false,"datetime"),
				},	
				getData:$scope.getData,
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'library_stock',$Scope.bookParams);
						}
					}) 
				},
				updateData : function(table, input, id){ 
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage,'library_stock',$scope.deptParams);
						}
					})
					},
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){
				
			})
		}		
		
							/* add lib Actual stock */											
		$scope.openActualstock=function(url,data){
			var modalDefault={
				templateUrl:url,// apply template to modal
				size:'lg'
			};
			var modalOptions={
				date : $scope.currentDate,
				addactualstock:(data)?{
					modified_date : dataService.sqlDateFormate(false,"datetime"),
				}:{
						user_id:$rootScope.userDetails.id,
						date : dataService.sqlDateFormate(false,"datetime"),
						modified_date : dataService.sqlDateFormate(false,"datetime"),
				},	
				getData:$scope.getData,
				postData : function(table, input){
					$rootScope.postData(table, input,function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'staff','staffList',$Scope.bookParams);
						}
					}) 
				},
				updateData : function(table, input, id){ 
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage,'staff','staffList',$scope.deptParams);
						}
					})
					},
			};
			modalService.showModal(modalDefault, modalOptions).then(function(){
				
			})
		}
					
					/* add liabrary */
		 $scope.openModal=function(url,data){
				var modalDefault={
					templateUrl:url,
					size:'lg'
				};
			var modalOptions={	
				date : $scope.currentDate,
				addbookTransaction:(data)?{
					id:data.id,
					user_id:data.user_id,
					student_id:data.student_id,
					book_transaction_id:data.book_transaction_id,
					issue_date:data.issue_date,
					due_date:data.due_date,
					return_date:data.return_date,
					book_fine:data.book_fine,
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					
				}:{
					user_id:$rootScope.userDetails.id,
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
				},
					postData : function(table, input){
						console.log(table, input);
						$rootScope.postData(table, input,function(response){
							if(response.status == "success"){
								$scope.getData(false, $scope.currentPage, 'book_transaction','bookList',$Scope.bookParams);
							}
						})
					},
					updateData : function(table, input, id){ 
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage,'book_transaction','bookList',$scope.deptParams);
						}
					})
					},
					getData : $scope.getData,
					addToObject : function(object,data,modalOptions){
						console.log(object,data,modalOptions);
					$rootScope.addToObject(object,modalOptions[data]);
					modalOptions[data] = {};
					},
					
				removeObject : $rootScope.removeObject,
					
			};
				modalService.showModal(modalDefault, modalOptions).then(function(){
				
				})
		}
		$scope.bookparams = {
				where : {
					status : 1,
					user_id : $rootScope.userDetails.id
				},
				cols : ["*"]
			}; 
		// For Get (Select Data from DB)
		$scope.getData = function(single, page, table, subobj, params, modalOptions) {
			$scope.params = (params) ? params : {
				where : {
					status : 1,
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
			dataService.get(single,table,$scope.params, subobj, params, modalOptions).then(function(response) {
				console.log(response);
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
	libraryController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('libraryController', libraryController);
});
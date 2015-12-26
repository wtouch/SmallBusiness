'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope','$location','$rootScope','$injector','modalService','$routeParams' ,'$notification', 'dataService','uiGridConstants'];
    
    // This is controller for this view
	var examController= function ($scope,$location,$rootScope,$injector,modalService, $routeParams,$notification,dataService,uiGridConstants) {
		
		//global scope objects
		$rootScope.metaTitle = "campus";
		$scope.maxSize = 5;
		$scope.alerts = [];
		$scope.currentPage = 1;
		$scope.pageItems = 20;
		$scope.currentDate = dataService.sqlDateFormate(false, "yyyy-MM-dd HH:MM:SS");
		$rootScope.serverApiV2 = true;
		$rootScope.module = "campus";
		$rootScope.moduleMenus = [
			{
				name : "Add exam",
				SubTitle :"Add exam",
				events : {
					click : function(){
						return $scope.openModal("modules/campus/exam/addexam.html");
					}
				}
			}
		]
		
		$scope.currentPath = $location.path();
		
		var dueDate = new Date();
		dueDate.setDate(dueDate.getDate() + 10);
		var dueMonth = dueDate.getMonth() + 1;
		dueMonth = (dueMonth <= 9) ? '0' + dueMonth : dueMonth;
		$scope.dueDate = dueDate.getFullYear() + "-" + dueMonth + "-" + dueDate.getDate();
		
		$scope.examList = {
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
					name:'dept_name',width:60,enableSorting: false ,
					filterHeaderTemplate: '<select id="dept_name" class="form-control" ng-change="grid.appScope.filter(\'dept_id\', dept_id, \'exam_view1\', \'examList\',true, grid.appScope.examParams)" ng-model="dept_id" ng-options="item.id as item.dept_name for item in grid.appScope.departmentList">'
					+'<option value="" selected>Dept Name</option>'
						+'</select>',
				},
				{ 
					name:'class_name',width:60,enableSorting: false ,
					filterHeaderTemplate: '<select id="class_name" class="form-control" ng-change="grid.appScope.filter(\'class_id\', class_id, \'exam_view1\', \'examList\',true, grid.appScope.examParams)" ng-model="class_id" ng-options="item.id as item.class_name for item in grid.appScope.classList">' 
					+'<option value="" selected>class Name</option>'
						+'</select>',
				},	
				{ 
					name:'division_name',width:50,enableSorting: false ,
					filterHeaderTemplate: '<select id="division_name" class="form-control" ng-change="grid.appScope.filter(\'div_id\', div_id, \'exam_view1\', \'examList\',true, grid.appScope.examParams)" ng-model="div_id" ng-options="item.id as item.division_name for item in grid.appScope.divisionList">' 
					+'<option value="" selected>div Name</option>'
						+'</select>',
						
				},	
				
				{ name:'room_no',width:50,enableSorting: false ,
				filterHeaderTemplate: '<select id="room_no" class="form-control" ng-change="grid.appScope.filter(\'room_id\', room_id, \'exam_view1\', \'examList\',true, grid.appScope.examParams)" ng-model="room_id" ng-options="item.id as item.room_no for item in grid.appScope.roomList">'
							+'<option value="" selected>Room No</option>'
						+'</select>',
					//cellTemplate:'<span>{{row.entity.multipleentries[0].room_id}}</span>'
				},
				
				{ name:'name',width:100,enableSorting: false ,
				filterHeaderTemplate: '<select id="name" class="form-control" ng-change="grid.appScope.filter(\'name\', name, \'exam_view1\', \'examList\',true, grid.appScope.examParams)" ng-model="name" ng-options="item.id as item.name for item in grid.appScope.staffList">'
							+'<option value="" selected>Staff Name</option>'
						+'</select>',
							//cellTemplate:'<span>{{row.entity.multipleentries[0].name}}</span>'
				},
				{ name:'sub_name',width:100,enableSorting: false ,
				filterHeaderTemplate: '<select id="sub_name" class="form-control" ng-change="grid.appScope.filter(\'sub_id\', sub_id, \'exam_view1\', \'examList\',true, grid.appScope.examParams)" ng-model="sub_name" ng-options="item.id as item.sub_name for item in grid.appScope.subjectList">'
							+'<option value="" selected>subject Name</option>'
						+'</select>',
						//cellTemplate:'<span>{{row.entity.multipleentries[0].sub_name}}</span>'
				},
				
				{  name:'date',width:130,
				enableSorting: true, enableFiltering: false,
					filterHeaderTemplate: '<input id="date" class="form-control" ng-change="grid.appScope.filter(\'date\', date, \'exam_view1\', \'examList\',true, grid.appScope.examList)" ng-model="date" placeholder="date">',
				},
				{
					name:'day',width:90,
					enableSorting: false,
					filterHeaderTemplate: '<select id="day" class="form-control" ng-change="grid.appScope.filter(\'day\', day, \'exam_view1\', \'examList\',true, grid.appScope.examParams);ng-model="day">'
							+'<option value="" selected>day</option>'
							+'<option value="Sunday">Sunday</option>'
							+'<option value="Monday">Monday</option>'
							+'<option value="Tuesday">Tuesday</option>'
							+'<option value="Wendesday">Wendesday</option>'
							+'<option value="Thursday">Thursday</option>'
							+'<option value="Friday">Friday</option>'
							+'<option value="Saturday">Saturday</option>'
						+'</select>',
					
				},
				{ name:'timefrom',width:130,	enableSorting: false,
					filterHeaderTemplate: '<input id="timefrom" class="form-control" ng-model="timefrom" placeholder="timefrom">',
					
				}, 
				{ name:'timeto',width:130,	enableSorting: false,
					filterHeaderTemplate: '<input id="timeto" class="form-control" ng-model="timeto" placeholder="timeto">',
					
				}, 
				
					 
				{ name:'manage',enableSorting: false,enableFiltering: true,
					filterHeaderTemplate: '<select id="status" class="form-control" ng-change="grid.appScope.filter(\'status\', status, \'exam_view1\', \'examList\',false,grid.appScope.stockParams)" ng-model="status">'
							 +'<option value="" selected>Status</option>' 
							+'<option value="0">Deleted</option>'
							+'<option value="1">Active</option>	'
						+'</select>',
				
					cellTemplate : '<a ng-click="grid.appScope.openModal(\'modules/campus/exam/addexam.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="Edit exam" > <span class="glyphicon glyphicon-pencil"></span></a>'
					+ '<a type="button" tooltip="Delete stock" ng-class="(row.entity.status==1) ? \'btn btn-success btn-sm\' : \'btn btn-danger btn-sm\'" ng-model="row.entity.status" ng-change="grid.appScope.changeCol(\'exam\', \'status\',row.entity.status, row.entity.id, grid.appScope.callbackColChange)" btn-checkbox="" btn-checkbox-true="\'1\'" btn-checkbox-false="\'0\'" class="ng-pristine ng-valid active btn btn-success btn-sm"><span class="glyphicon glyphicon-remove"></span></a>'
					+'<a ng-click="grid.appScope.openModal(\'modules/campus/exam/viewexam.html\',row.entity)" class="btn btn-primary btn-sm" type="button" tooltip-animation="true" tooltip="view  exam" ><span class="glyphicon glyphicon glyphicon-eye-open"></span></a>'
					
				}
			]
		};
		$scope.callbackColChange = function(response){
			console.log(response);
			if(response.status == "success"){
				console.log($scope.examParams);
				$scope.getData(false, $scope.currentPage, "exam_view1", "examList", $scope.examParams);
			}
		}
		$scope.openModal = function(url,data){
				var modalDefault = {
				templateUrl: url,	// apply template to modal
				size : 'lg'
			};
			var modalOptions = {
				date : $scope.currentDate,
				examData : (data)?{
						id : data.id
					}:{},
				addexam : (data) ? {
					id : data.id,
					user_id : data.user_id,
					exam_id :data.exam_id,
					dept_id : data.dept_id,
					class_id : data.class_id,
					div_id : data.dept_id,
					staff_id:data.staff_id,
					multipleentries:data.multipleentries,
					timefrom:data.timefrom,
					timeto:data.timeto,
					
			} : {
					user_id : $rootScope.userDetails.user_id,
					date : dataService.sqlDateFormate(false,"datetime"),
					modified_date : dataService.sqlDateFormate(false,"datetime"),
					dept_id : 1,
				},
			view : (data)?{
				dept_name :  data.dept_name,
				class_name: data.class_name,
				division_name: data.division_name,
				room_no: data.room_no,
				name: data.name,
				sub_name:data.sub_name,
				day:data.day,
				date:data.date,
				timefrom:data.timefrom,
				timeto:data.timeto,
					
			}:
			{
				
			},
			postData : function(table, input){
				
					$scope.examData = {};
					$scope.examData.user_id =input.user_id;
					$scope.examData.dept_id =input.dept_id;
					$scope.examData.class_id =input.class_id;
					$scope.examData.div_id =input.div_id;
					angular.forEach(input.multipleentries, function(value, key){
								$scope.examData.sub_id = value.sub_id;
								$scope.examData.room_id = value.room_id;
								$scope.examData.staff_id = value.staff_id;
								$scope.examData.day = value.day;
								$scope.examData.date = value.date;
								$scope.examData.timefrom = value.timefrom;
								$scope.examData.timeto = value.timeto;
								$rootScope.postData("exam", angular.copy($scope.examData),function(response){
									$scope.getData(false, $scope.currentPage, 'exam_view1','examList',$scope.examParams); 
								});
							})
						
				},
				updateData : function(table, input, id){
					$rootScope.updateData(table, input, id, function(response){
						if(response.status == "success"){
							$scope.getData(false, $scope.currentPage, 'exam_view1','examList',$scope.examParams);
						}
					})
				}, 
				getData : $scope.getData,
				classParams : {
					where : {
					user_id : $rootScope.userDetails.id,
					status:1,
				},
				cols : ["*"]
				},
				addToObject : function(object,data,modalOptions){
					$rootScope.addToObject(object,modalOptions[data]);
					modalOptions[data] = {};
				},
				
				removeObject : $rootScope.removeObject
			};
			
			modalService.showModal(modalDefault, modalOptions).then(function(){
				
			})
	}	
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
	examController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('examController', examController);
});

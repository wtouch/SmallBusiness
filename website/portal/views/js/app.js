'use strict';

define(['angular',
	'bootstrap',
	'services',
	'ngCookies',
	
], function (angular, ngCookies) {
    // Declare app level module which depends on views, and components
    var app = angular.module('apnasitePortal', ['ngRoute',
   'ui.bootstrap', 'customServices', 'ngCookies'
 ]);
	app.controller('TypeaheadCtrl', ['$scope','$http','dataService', function($scope, $http,dataService) {
		$scope.data = "vilas";
		$scope.getTypeaheadData = function(table, searchColumn, searchValue){
			var locationParams = {search : {}, groupBy : {}}
			locationParams.search[searchColumn] = searchValue;
			locationParams.groupBy[searchColumn] = searchValue;
			return dataService.config('locations', locationParams).then(function(response){
				return response;
			});
		}
		$scope.onItemClicked = function (item) {
			item.isVisible = true;
		};
		
	}]).controller('aboutController',['$scope','$http', '$route', '$location', function($scope,$http, $route, $location) {
		var s = $location.path();
		$scope.url = s.substr(1);
		$scope.makeActive = function(url){
			$scope.id = url;
		}
		$scope.makeActive($scope.url);
	}]).controller('enquiryController', ['$scope','$http','$route','$location', function($scope,http, $route, $location) {
			$scope.hostUrl = hostUrl;
			var today = new Date();
			var year = today.getFullYear();
			var month = today.getMonth() + 1;
			var date = today.getDate();
			var hour = today.getHours();
			var min = today.getMinutes();
			var sec = today.getSeconds();
			$scope.mailSent = false;
			$scope.enquiry = {
				subject : 'Website Enquiry',
				date : year + "-" + month + "-" + date + " " + hour + ":" + min + ":"+sec
			};
				console.log($scope.enquiry);
			$scope.postData = function(enquiry){
				dataService.post("../server-api/index.php/post/enquiry",$scope.enquiry).success(function(response) {
					$scope.mailSent = true;
					console.log(response);
				});
			};
		}]);	
    return app;
});

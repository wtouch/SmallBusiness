'use strict';

define(['angular',
	'bootstrap',
	'services',
	'ngCookies'
], function (angular, ngCookies) {
    // Declare app level module which depends on views, and components
    var app = angular.module('apnasitePortal', [
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
		
	}]).controller('RatingDemoCtrl', ['$scope','$http', function($scope, $http) {
	  $scope.rate = 7;
	  $scope.max = 10;
	  $scope.isReadonly = false;

	  $scope.hoveringOver = function(value) {
		$scope.overStar = value;
		$scope.percent = 100 * (value / $scope.max);
	  };

	  $scope.ratingStates = [
		{stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
		{stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
		{stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
		{stateOn: 'glyphicon-heart'},
		{stateOff: 'glyphicon-off'}
	  ];
	}]).controller('ModalDemoCtrl',[ '$scope', '$modal', '$logfunction' ,function($scope, $modal, $log) {
		$scope.open = function (size) {
			var modalInstance = $modal.open({
			  templateUrl: 'includes/search-location.html',
			  controller: 'ModalInstanceCtrl',
			  size: size,
			  resolve: {
				items: function () {
				  return $scope.items;
				}
			  }
			});
		};
	}]).controller('ModalInstanceCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
		 $scope.ok = function () {
			$modalInstance.close($scope.selected.item);
		  };

		  $scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		  };
	}]);	
    return app;
});

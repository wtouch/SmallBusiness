'use strict';

define(['angular',
	'bootstrap',
], function (angular) {
    // Declare app level module which depends on views, and components
    var app = angular.module('apnasitePortal', [
   'ui.bootstrap'
 ]);
	app.controller('TypeaheadCtrl', ['$scope','$http', function($scope, $http) {
		console.log("TypeaheadCtrl");
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
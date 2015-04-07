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
	}])
	
    return app;
});
'use strict';

require.config({
	paths: {
		angular: '../lib/angular/angular',
		jquery: '../lib/jquery/jquery',
		angularRoute: '../lib/angular/angular-route',
		angularMocks: '../lib/angular/angular-mocks',
		text: '../lib/requirejs-text/text',
		bootstrap: '../lib/bootstrap/ui-bootstrap',
		css: '../lib/css/css.min',
		modules: '../modules',
	},
	shim: {
		'angular' : {'exports' : 'angular'},
		'bootstrap': { "deps": ['jquery'] },
		'angularRoute': ['angular'],
		'angularMocks': {
			deps:['angular'],
			'exports':'angular.mock'
		}
	},
	priority: [
		"angular"
	],
	
	
});

require([
	'angular',
	'angularRoute',
	'app'
	], function(angular, angularRoute, app) {
		var $html = angular.element(document.getElementsByTagName('html')[0]);
		angular.element().ready(function() {
			// bootstrap the app manually
			angular.bootstrap(document, ['realEstate']);
		});
	}
);
'use strict';

require.config({
	paths: {
		angular: '../lib/angular/angular',
		jquery: '../lib/jquery/jquery',
		angularRoute: '../lib/angular/angular-route',
		angularMocks: '../lib/angular/angular-mocks',
		text: '../lib/requirejs-text/text',
		bootstrap: '../lib/bootstrap/bootstrap.min',
		css: '../lib/css.min'
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
function loadCss(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}

require([
	'angular',
	'app'
	], function(angular, app) {
		var $html = angular.element(document.getElementsByTagName('html')[0]);
		angular.element().ready(function() {
			// bootstrap the app manually
			angular.bootstrap(document, ['realEstate']);
		});
	}
);
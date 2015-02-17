'use strict';

// Directives goes here 

define(['app'], function (app) {
	
	var app =  angular.module('customDirectives', []);
	app.directive('goBack', function () 
	{
		return 
		{
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.on('click', function() {
					window.history.back();
				});
			}
		};
	});
	return app;

});
'use strict';

// Filters goes here
define([], function () {
	
	var app =  angular.module('customFilters', []);
	// Custom Filters goes here
	
	app.filter('capitalize', function() {
    return function(input, all) {
      var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
      return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  });
	
	
	return app;
});
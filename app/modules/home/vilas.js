'use strict';

define(['app'], function (app) {
    
	// This is service for this controller/view
	var HomeService = function () {
		this.value = 30;
    };
  
	// Register service to controller/module dynamically
	app.register.service('data', HomeService);
});

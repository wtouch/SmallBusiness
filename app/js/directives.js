'use strict';

// Directives goes here 

define(['app', 'tinymce'], function (app) {
	
	var app =  angular.module('customDirectives', []);
	app.directive('goBack', function () {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.on('click', function() {
					window.history.back();
				});
			}
		};
	});
	/* go-back directive ends here */
	
	app.directive('filePreview', ['$compile','upload',function ($compile,upload) {
		return {
			restrict: 'EA',
			require: "?ngModel",
			template: "<ul class='list-inline'><li ng-repeat='img in url'><img ng-src='{{img.dataUrl}}' class='img-thumbnail' width='50' ng-click='click(img)'><div class='progress'> <div class='progress-bar progress-bar-striped active' role='progressbar' aria-valuenow='{{img.progress}}' aria-valuemin='0' aria-valuemax='100' style='width: {{img.progress}}%'></div></div></li></ul>",
			scope: {
				url : "="
			},
			link: function(scope, element, attrs, ngModel) {
				scope.click = function(ind){
					console.log(ind);
				};
			},
			replace:true
			
		};
	}]);
	
	
	
	app.value('uiTinymceConfig', {});
	app.directive('uiTinymce', ['uiTinymceConfig', function (uiTinymceConfig) {
		uiTinymceConfig = uiTinymceConfig || {};
		var generatedIds = 0;
		return {
		  priority: 10,
		  require: 'ngModel',
		  link: function (scope, elm, attrs, ngModel) {
			var expression, options, tinyInstance,
			  updateView = function () {
				ngModel.$setViewValue(elm.val());
				if (!scope.$root.$$phase) {
				  scope.$apply();
				}
			  };

			// generate an ID if not present
			if (!attrs.id) {
			  attrs.$set('id', 'uiTinymce' + generatedIds++);
			}

			if (attrs.uiTinymce) {
			  expression = scope.$eval(attrs.uiTinymce);
			} else {
			  expression = {};
			}

			// make config'ed setup method available
			if (expression.setup) {
			  var configSetup = expression.setup;
			  delete expression.setup;
			}

			options = {
			  // Update model when calling setContent (such as from the source editor popup)
			  setup: function (ed) {
				var args;
				ed.on('init', function(args) {
				  ngModel.$render();
				  ngModel.$setPristine();
				});
				// Update model on button click
				ed.on('ExecCommand', function (e) {
				  ed.save();
				  updateView();
				});
				// Update model on keypress
				ed.on('KeyUp', function (e) {
				  ed.save();
				  updateView();
				});
				// Update model on change, i.e. copy/pasted text, plugins altering content
				ed.on('SetContent', function (e) {
				  if (!e.initial && ngModel.$viewValue !== e.content) {
					ed.save();
					updateView();
				  }
				});
				ed.on('blur', function(e) {
					elm.blur();
				});
				// Update model when an object has been resized (table, image)
				ed.on('ObjectResized', function (e) {
				  ed.save();
				  updateView();
				});
				if (configSetup) {
				  configSetup(ed);
				}
			  },
			  mode: 'exact',
			  theme: "modern",
			  plugins: [
					 "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
					 "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
					 "save table contextmenu directionality emoticons template paste textcolor"
			  ],
			  elements: attrs.id
			};
			// extend options with initial uiTinymceConfig and options from directive attribute value
			angular.extend(options, uiTinymceConfig, expression);
			setTimeout(function () {
			  tinymce.init(options);
			});

			ngModel.$render = function() {
			  if (!tinyInstance) {
				tinyInstance = tinymce.get(attrs.id);
			  }
			  if (tinyInstance) {
				tinyInstance.setContent(ngModel.$viewValue || '');
			  }
			};

			scope.$on('$destroy', function() {
			  if (!tinyInstance) { tinyInstance = tinymce.get(attrs.id); }
			  if (tinyInstance) {
				tinyInstance.remove();
				tinyInstance = null;
			  }
			});
		  }
		};
	}]);
	/* TinyMCE ends here*/

	return app;

});
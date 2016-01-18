'use strict';

// Services goes here

define(['app'], function (app) {
	var app =  angular.module('customServices', []);
	
	// ui Chart - jqPlot
	/* app.service('charting', ["$rootScope", function($rootScope){
		return {
			pieChartOptions: {
				seriesDefaults: {
					// Make this a pie chart.
					renderer: $.jqplot.PieRenderer,
					rendererOptions: {
					// Put data labels on the pie slices.
					// By default, labels show the percentage of the slice.
					showDataLabels: true
				  }
				},
				legend: { show:true, location: 'e' }
			}
		}
    }]); */
	
	app.service('modalService', ['$modal', function ($modal) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
			size : 'md',
            templateUrl: '../app/modules/component/modal.html'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');
                    };
                }
            }

            return $modal.open(tempModalDefaults).result;
        };

    }]);
	/******************************************************************************
	 * Modal Service Ends Here */
	
	app.factory('breadcrumbs', [
      '$rootScope',
      '$location',
      '$route',
      function ($rootScope, $location, $route) {
        var BreadcrumbService = {
          breadcrumbs: [],
          get: function(options) {
            this.options = options || this.options;
            if (this.options) {
              for (var key in this.options) {
                if (this.options.hasOwnProperty(key)) {
                  for (var index in this.breadcrumbs) {
                    if (this.breadcrumbs.hasOwnProperty(index)) {
                      var breadcrumb = this.breadcrumbs[index];
                      if (breadcrumb.label === key) {
                        breadcrumb.label = this.options[key];
                      }
                    }
                  }
                }
              }
            }
            return this.breadcrumbs;
          },
          generateBreadcrumbs: function() {
            var routes = $route.routes,
                _this = this,
                params,
                pathElements,
                pathObj = {},
                path = '',
                originalPath = '',
                param;

            if ($route && $route.current && $route.current.originalPath) {
              this.breadcrumbs = [];
              params = $route.current.params;
              pathElements = $route.current.originalPath.trim().split('/');

              // Necessary to get rid of of duplicate empty string on root path
              if (pathElements[1] === '') {
                pathElements.splice(1, 1);
              }

              angular.forEach(pathElements, function(pathElement, index) {
                param = pathElement[0] === ':' &&
                        typeof params[pathElement
                          .slice(1, pathElement.length)] !== 'undefined' ?
                        params[pathElement.slice(1, pathElement.length)] :
                        false;

                pathObj[index] = {
                  path: param || pathElement,
                  originalPath: pathElement
                };

                path = Object
                  .keys(pathObj)
                  .map(function(k) { return pathObj[k].path;  })
                  .join('/') || '/';

                originalPath = Object
                  .keys(pathObj)
                  .map(function(k) { return pathObj[k].originalPath;  })
                  .join('/') || '/';

                if (routes[originalPath] &&
                    (routes[originalPath].label || param) &&
                    !routes[originalPath].excludeBreadcrumb) {
                  _this.breadcrumbs.push({
                    path: path,
                    originalPath: originalPath,
                    label: routes[originalPath].label || param,
                    param: param
                  });
                }
              });
            }
          }
        };

        // We want to update breadcrumbs only when a route is actually changed
        // as $location.path() will get updated immediately (even if route
        // change fails!)
        $rootScope.$on('$routeChangeSuccess', function() {
          BreadcrumbService.generateBreadcrumbs();
        });

        $rootScope.$watch(
          function() { return BreadcrumbService.options; },
          function() {
            BreadcrumbService.generateBreadcrumbs();
          }
        );

        BreadcrumbService.generateBreadcrumbs();

        return BreadcrumbService;
      }
    ]);
	
	/* File Upload Service 
	**********************************************************************/
	app.factory('upload', [
      '$rootScope',
	  
      '$upload',
	  '$timeout',
      function ($rootScope, $upload, $timeout) {
		return {
			fileReaderSupported : window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false),
			upload : function (files,path,userinfo,success,error) {
				if (files && files.length) {
					var progressArr = {};
					for (var i = 0; i < files.length; i++) {
						var file = files[i];
						$upload.upload({
							url: '../server-api/index.php/upload',
							fields: {'path': 'uploads/'+path, 'userinfo': userinfo},
							file: file
						}).progress(function (evt) {
							var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
							//console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
							file.progress = progressPercentage;
							
						}).success(function (data, status, headers, config) {
							//console.log('file ' + config.file.name + 'uploaded. Response: ' + JSON.stringify(data));
							success(data, status, headers, config);
						}).error(function(err,err1,err2, err3){
							error(err,err1,err2,err3);
							//console.log(err3);
						});
					}
				}
			},
			generateThumb : function(file) {
				if (file != null) {
					if (this.fileReaderSupported && file.type.indexOf('image') > -1) {
						$timeout(function() {
							var fileReader = new FileReader();
							fileReader.readAsDataURL(file);
							fileReader.onload = function(e) {
								$timeout(function() {
									file.dataUrl = e.target.result;
								});
							}
						});
					}
				}
			},
			generateThumbs : function(files) {
				if (files && files.length) {
					for (var i = 0; i < files.length; i++) {
						var file = files[i];
						this.generateThumb(file);
					}
				}
			}
		}
	  }]);
	  
	  /* $HTTP Service for server request
	  *************************************************************************/
	  
	  app.service("dataService", ['$http', '$window','$rootScope', '$cookieStore', '$cookies', '$location','$timeout','$notification', '$q', 'dbHelper',
		function ($http, $window,$rootScope,$cookieStore,$cookies,$location,$timeout, $notification, $q, dbHelper) { // This service connects to our REST API

			var serviceBase = '../server-api/index.php/';
			var today = new Date();
			var year = today.getFullYear();
			var month = today.getMonth() + 1;
			var date = today.getDate();
			var hour = today.getHours();
			var min = today.getMinutes();
			var sec = today.getSeconds();
			var obj = {};
			$rootScope.minDate = today.setFullYear(year - 20);
			$rootScope.maxDate = today.setFullYear(year + 20);
			$rootScope.dateFormat = "dd-MM-yyyy";
			// this is for disable min / max date to select
			$rootScope.disabledDate = function(dt, mode) {
				return;
				console.log(mode);
				return ( mode === 'day' && ( dt.getDay() === 0 || dt.getDay() === 6 ));
			};
			obj.currentDate = year + "-" + month + "-" + date + " " + hour + ":" + min + ":"+sec;
			obj.sqlDateFormate = function(input, format){
				var dt = (input) ? new Date(input) : new Date();
				var sqlDate;
				var year = dt.getFullYear();
				var month = (dt.getMonth() < 9) ? "0" + (dt.getMonth() + 1) : (dt.getMonth() + 1);
				var day = (dt.getDate() < 10) ? "0" + dt.getDate() : dt.getDate();
				var hour = (dt.getHours() < 10) ? "0" + dt.getHours() : dt.getHours();
				var min = (dt.getMinutes() < 10) ? "0" + dt.getMinutes() : dt.getMinutes();
				var sec = (dt.getSeconds() < 10) ? "0" + dt.getSeconds() : dt.getSeconds();
				if(format && (format == "yyyy-MM-dd HH:MM:SS" || format == "datetime")){
						sqlDate = year + "-" + month + "-" + day+ " " + hour + ":" + min + ":"+sec;
				}else if(format && format == "date"){
						sqlDate = year + "-" + month + "-" + day;
				}else{
						sqlDate = year + "-" + month + "-" + day;
				}
				//console.log(sqlDate);
				input = sqlDate;
				return sqlDate;
			}
			obj.taxPayment = function(invoice_list, tax_payment){
				var tax = {};
				var totalTax = 0;
				angular.forEach(invoice_list, function(value, key){
					angular.forEach($rootScope.userDetails.config.inventory.taxData.tax, function(taxValue, taxKey){
						if(value.tax[taxValue.taxName] != undefined){
							if(!tax[taxValue.taxName]) tax[taxValue.taxName] = 0;
							tax[taxValue.taxName] += value.tax[taxValue.taxName];
							totalTax += value.tax[taxValue.taxName];
						}
					})
				})
				angular.forEach(tax_payment, function(value, key){
					tax[value.category] = tax[value.category] - parseFloat(value.tax_amount);
					totalTax -= value.tax_amount;
				})
				
				return {
					payableTax : tax,
					totalPayableTax : parseFloat(totalTax).toFixed(2)
				}
			}
			obj.serviceTax = function(amount){
				var st = amount * parseFloat($rootScope.userDetails.config.rentsetting.service_tax) / 100;
				//console.log(st, 'st');
				var pec = st * parseFloat($rootScope.userDetails.config.rentsetting.primary_edu_cess) / 100;
				//console.log(pec, 'pec');
				var sec = st * parseFloat($rootScope.userDetails.config.rentsetting.secondary_edu_cess) / 100;
				//console.log(sec, 'sec');
				return parseFloat(st + pec + sec);
			}
			
			obj.otherTax = function(amount){
				var ot = amount * parseFloat($rootScope.userDetails.config.rentsetting.other_tax) / 100;
				return parseFloat(ot);
			}
			
			obj.tdsCalculate = function(amount){
				if($rootScope.userDetails.config.rentsetting.tds == 0){ 
					return 0;
				}else{
					return amount * parseFloat($rootScope.userDetails.config.rentsetting.tds) / 100;
				}
			}
			
			obj.calculateTax = function(taxObject, amount, tax){
				var tax = (tax) ? tax : {service_tax:0,other_tax:0,tds:0};
				angular.forEach(taxObject, function(value, key) {
					if(value.name == "service_tax"){
						tax.service_tax += obj.serviceTax(amount);
					}
					if(value.name == "tds"){
						tax.tds += obj.tdsCalculate(amount);
					}
					if(value.name == "other_tax"){
						tax.other_tax += obj.otherTax(amount);
					}
				})
				return tax;
			}
			
			obj.serviceBase = serviceBase;
			
			obj.setBase = function(path){
				serviceBase = path;
				obj.serviceBase = path;
			};
			obj.checkAppMode = function(){
				var deferred = $q.defer();
				$http.get("app.json").success(function(response){
					$rootScope.module = response.app_name;
					var serialNumber = require('serial-number');
					serialNumber.preferUUID = true;
					serialNumber(function (err, value) {
						$rootScope.hardwareSerial = value;
						console.log($rootScope.hardwareSerial);
					});
					if(response.sqLiteDb){
						$rootScope.sqLite = response.sqLiteDb;
						$rootScope.standAlone = true;
						dbHelper.setDb(response.app_name, response.app_description, 1024 * 1024 * 1024);
						obj.setBase(response.server_api_path);
						console.log(serviceBase);
						if(!localStorage.sqLiteDb){
							$http.get("modules/" + response.app_name + "/" + response.app_name + ".sql").success(function(response){
								dbHelper.setDbStructure(response);
								deferred.resolve(true);
							})
						}else{
							deferred.resolve(true);
						}
					}
					
				}).error(function(response){
					console.log(response);
					deferred.resolve(response);
				})
				return deferred.promise;
			}
			obj.capitalize = function(string) {
				return string.charAt(0).toUpperCase() + string.slice(1);
			}
			obj.stringify = function(oldObj){
				var newObj = {};
				angular.forEach(oldObj, function(value, key) {
					if(key == "date"){
						this[key] = obj.sqlDateFormate(value);
					}else{
						this[key] = (angular.isObject(value)) ? JSON.stringify(value) : (value == null || value == "null") ? "" : value;
					}
				}, newObj);
				return newObj;
			}
			// this parse will parse within array or object of JSON string to object/array
			obj.parse = function(oldObj){
				if(angular.isArray(oldObj)){
					var newObj = [];
					for(var x in oldObj){
						var newArrObj = {};
						angular.forEach(oldObj[x], function(value, key) {
						  this[key] = (angular.isObject(value) || angular.isNumber(value) || value == null || value == 'true' || value == 'false') ? value :(value.slice(0, 1) == "{" || value.slice(0, 1) == "[" ) ? JSON.parse(value) : value;
						}, newArrObj);
						newObj.push(newArrObj);
					}
				}else{
					var newObj = {};
					angular.forEach(oldObj, function(value, key) {
					  this[key] = (angular.isObject(value) || angular.isNumber(value) || value == null || value == 'true' || value == 'false') ? value :(value.slice(0, 1) == "{" || value.slice(0, 1) == "[" ) ? JSON.parse(value) : value;
					}, newObj);
				}
				return newObj;
			}
			
			obj.extendDeep = function extendDeep(dst) {
			  angular.forEach(arguments, function(obj) {
				if (obj !== dst) {
				  angular.forEach(obj, function(value, key) {
					if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
					  extendDeep(dst[key], value);
					} else {
					  dst[key] = value;
					}     
				  });   
				}
			  });
			  return dst;
			};
			
			
			obj.rememberPass = function(remb){
				obj.setAuth(remb, 30);
			}
			obj.logout = function(){
				if($rootScope.standAlone) $rootScope.sqLite = false;
				console.log(obj.serviceBase);
				obj.get('/login/logout').then(function(response){
					$rootScope.LogoutMsg = response;
					obj.userDetails = null;
					obj.setAuth(false);
					obj.removeCookies($cookies);
					sessionStorage.clear();
					localStorage.clear();
					if($rootScope.standAlone) $rootScope.sqLite = true;
				});
			};
			obj.removeCookies = function(cookies){
				angular.forEach(cookies, function (v, k) {
					$cookieStore.remove(k);
				});
			}
			console.log($cookies.get("auth"));
			obj.auth = ($cookies.get("auth")) ? $cookies.get("auth") : false;
			
			obj.userDetails = (localStorage.userDetails) ? JSON.parse(localStorage.userDetails) : null;
			$timeout(function () {
				$rootScope.$watch(function() { return $cookies.get("auth"); }, function(newValue) {
					//console.log('Cookie string: ' + $cookies.get("auth"));
					if($cookies.get("auth") == undefined && obj.userDetails != null){
						obj.logout();
						$rootScope.userDetails = null;
						$notification.warning("Login", "Session Expired, Please login again!");
						$timeout(function () {
							$location.path("/login");
						}, 700);
					}
				});
			}, 1500);
			obj.setAuth = function (data, time) {
				var cookieExp = new Date();
				var expTime = (time) ? time * 60 * 24 : 15;
				cookieExp = new Date(cookieExp.setMinutes(cookieExp.getMinutes() + expTime));
				if($rootScope.sqLite){
					$cookies.put('auth',data,{expires : cookieExp});
				}else{
					$cookies.put('auth',data);
				}
				return obj.auth =  ($cookieStore.get('auth'));
			};
			obj.setUserDetails = function(data){
				if(data == (undefined || "")){
					//console.log("data undefined: "+data);
				}else{
					//localStorage.clear();
					localStorage.userDetails = angular.isObject(data) ?  JSON.stringify(data) : data;
					obj.userDetails = JSON.parse(localStorage.userDetails);
				}
			}
			obj.config = function(table, params){
				if(params == undefined) params = {};
				params.table = table;
				return $http({
					url: serviceBase +'getmultiple/config/1/1',
					method: "GET",
					params: params
				}).then(function (results) {
					if(results.data.status == 'success'){
						return obj.parse(results.data.data);
					}else{
						return obj.parse(results.data.data);
					}
					
					
				});
			};
			
			obj.progressSteps = function(key, value){
				$rootScope.userDetails.config[key] = value;
				obj.put('put/user/'+$rootScope.userDetails.id, {config : $rootScope.userDetails.config}).then(function(response){
					obj.setUserDetails(JSON.stringify($rootScope.userDetails));
					$rootScope.userDetails = obj.parse(obj.userDetails);
					if(response.status == "success"){
						if($rootScope.userDetails.config.addbusiness == false){
							$location.path("/dashboard/business/addbusiness");
						}else if($rootScope.userDetails.config.addbusinessDetails != true){
							$location.path("/dashboard/business/adddetails/"+$rootScope.userDetails.config.addbusinessDetails);
						}else if($rootScope.userDetails.config.addProducts != true){
							$location.path("/dashboard/business/products/"+$rootScope.userDetails.config.addProducts);
						}else if($rootScope.userDetails.config.chooseTemplate == false){
							$location.path("/dashboard/templates/listoftemplates");
						}else if($rootScope.userDetails.config.requestSite == false){
							$location.path("/dashboard/websites/requestnewsite");
						}else if($rootScope.userDetails.config.requestSite == true){
							$location.path("/dashboard");
						}
					}
				})
			}
			
			// Method for Insert Query
			obj.post = function (table, object, params) {
				$rootScope.loading = true;
				if($rootScope.sqLite){
					object = obj.stringify(object);
						return dbHelper.post(table, object).then(function(response){
						if(response.status != "success"){
							$notification[response.status](table, response.message);
						}
						$rootScope.loading = false;
						return response;
					})
				}else{
					if($rootScope.serverApiV2){
						console.log($rootScope.module, table);
						table = ($rootScope.module) ? $rootScope.module+"_"+table : table;
						console.log($rootScope.module, table);
						var reqParams = {
							table : table,
						}
						return $http({
							url:"../server-api/index1.php",
							method: "POST",
							data: object,
							params: reqParams
						}).then(function (results) {
							$rootScope.loading = false;
							
							if(results.data.status == undefined) results.data = {status : "error", title : "Unknown Error!", message : results.data.message};
							$notification[results.data.status](table, results.data.message);
							
							return results.data;
						});
					}else{
						return $http({
							url: serviceBase + table,
							method: "POST",
							data: object,
							params: params
						}).then(function (results) {
							$rootScope.loading = false;
							
							if(results.data.status == undefined) results.data = {status : "error", title : "Unknown Error!", message : results.data.message};
							$notification[results.data.status](table, results.data.message);
							
							return results.data;
						});
					}
				}
			};
			// Method for Update Query
			obj.put = function (table, object, params) {
				$rootScope.loading = true;
				if($rootScope.sqLite){
					object = obj.stringify(object);
					return dbHelper.put(table, object, params).then(function(response){
						if(response.status != "success"){
							$notification[response.status](table, response.message);
						}
						$rootScope.loading = false;
						return response;
					})
				}else{
					if($rootScope.serverApiV2){
						table = ($rootScope.module) ? $rootScope.module+"_"+table : table;
						var reqParams = {
							table : table,
							params: params
						}
						return $http({
							url:"../server-api/index1.php",
							method: "PUT",
							data: object,
							params: reqParams
						}).then(function (results) {
							$rootScope.loading = false;
							if(results.data.status == undefined) results.data = {status : "error", title : "Unknown Error!", message : results.data.message};
							$notification[results.data.status](table, results.data.message);
							return results.data;
						});
					}else{
						return $http({
							url: serviceBase + table,
							method: "PUT",
							data: object,
							params: params
						}).then(function (results) {
							$rootScope.loading = false;
							if(results.data.status == undefined) results.data = {status : "error", title : "Unknown Error!", message : results.data.message};
							$notification[results.data.status](table, results.data.message);
							return results.data;
						});
					}
				}
			};
			
			obj.get = function (single, table, params) {
				$rootScope.loading = true;
				if($rootScope.sqLite){
					return dbHelper.selectData(table, single, params).then(function(response){
						if(response.status != "success"){
							$notification[response.status](table, response.message);
						}
						$rootScope.loading = false;
						response = obj.parse(response);
						return response;
					})
				}else{
					if($rootScope.serverApiV2){
						table = ($rootScope.module) ? $rootScope.module+"_"+table : table;
						var reqParams = {
							table : table,
							params : params,
							single : single
						}
						return $http({
							url: '../server-api/index1.php',
							method: "GET",
							params: reqParams
							
						}).then(function (results) {
							$rootScope.loading = false;
							if(results.data.status != "success"){
								if(results.data.status == undefined) results.data = {status : "error", title : "Unknown Error!", message : results.data.message};
								$notification[results.data.status](table, results.data.message);
							}
							return results.data;
							
						});
					}else{
						return $http({
							url: serviceBase + single, // old parameter was q
							method: "GET",
							params: table // old parameter was params
						}).then(function (results) {
							$rootScope.loading = false;
							if(results.data.status != "success"){
								if(results.data.status == undefined) results.data = {status : "error", title : "Unknown Error!", message : results.data.message};
								$notification[results.data.status](table, results.data.message);
							}
							return results.data;
							
						});
					}
				}
			};
			// Global Functions
			// For Post (Insert Data into DB)
			$rootScope.postData = function(table, input, callback) {
				obj.post(table, input).then(function(response) {
					if(callback){
						callback(response);
					}
				});
			}
			
			// For Put (Update Data into DB)
			$rootScope.updateData = function(table, input, id, callback) {
				var params = {};
				params.where = {
					id : (id) ? id : input.id
				}
				if(input.id) delete input.id;
				obj.put(table, input, params).then(function(response) {
					callback(response);
				});
			}
			$rootScope.changeCol = function(table, colName, colValue, id, callback){
				$rootScope.changeStatus = {};
				$rootScope.changeStatus[colName] = colValue;
				obj.put(table,$rootScope.changeStatus,{where : { id : id}})
				.then(function(response) {
					callback(response);
				});
			}
			
			// For Filter by columns
			$rootScope.filterData = function(col, value, search, callback){
				if(value == "") value = undefined;
				$rootScope.filterParams = ($rootScope.filterParams) ? $rootScope.filterParams : {};
				if(search == true){
					if(value == "" || value == undefined){
						delete $rootScope.filterParams.search[col];
					}else{
						if(!$rootScope.filterParams.search) $rootScope.filterParams.search = {};
						$rootScope.filterParams.search[col] = value;
					}
				}else{
					if(value == "" || value == undefined){
						delete $rootScope.filterParams.where[col];
					}else{
						if(!$rootScope.filterParams.where) $rootScope.filterParams.where = {};
						$rootScope.filterParams.where[col] = value;
					}
				}
				callback($rootScope.filterParams);
			} 
			
			$rootScope.addToObject = function(object, data){
				object.push(angular.copy(data));
				data = {};
			}
			
			$rootScope.removeObject = function(object, index){
				object.splice(index, 1);
			}
			$rootScope.inWords = function(totalRent){
				var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
				var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
				var num = totalRent;
				
				if ((num = num.toString()).length > 9) return 'overflow';
				var n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
				if (!n) return; var str = '';
				str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
				str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
				str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
				str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
				str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only! ' : '';
				return str;
			}
			return obj;
	}]);
	
	app.service("dbHelper", ['$http', '$window','$rootScope', '$cookieStore', '$cookies', '$location','$timeout','$notification', '$q', '$rootElement',
		function ($http, $window,$rootScope,$cookieStore,$cookies,$location,$timeout, $notification, $q, $rootElement) {
			
			var db = null;
			function setDb(dbName, dbDescription, dbSize){
				if(dbName && dbDescription && dbSize){
					db = openDatabase(dbName, '1.0', dbDescription, parseInt(dbSize) * 1024);
				}else{
					var dbName = "webTouch";
					var dbDescription = "webTouch";
					db = openDatabase(dbName, '1.0', dbDescription, 2 * 1024 * 1024 * 1024);
				}
				return db;
			}
			var parse = function(oldObj){
				if(angular.isArray(oldObj)){
					var newObj = [];
					for(var x in oldObj){
						var newArrObj = {};
						angular.forEach(oldObj[x], function(value, key) {
						  this[key] = (angular.isObject(value) || angular.isNumber(value) || value == null || value == 'true' || value == 'false') ? value :(value.slice(0, 1) == "{" || value.slice(0, 1) == "[" ) ? JSON.parse(value) : value;
						}, newArrObj);
						newObj.push(newArrObj);
					}
				}else{
					var newObj = {};
					angular.forEach(oldObj, function(value, key) {
					  this[key] = (angular.isObject(value) || angular.isNumber(value) || value == null || value == 'true' || value == 'false') ? value :(value.slice(0, 1) == "{" || value.slice(0, 1) == "[" ) ? JSON.parse(value) : value;
					}, newObj);
				}
				return newObj;
			}
			function selectDbData(table, single, params){
				
				var obj = this;
				obj.queryDetails = {table : table, params : params, single : single};
				
				obj.colString = "";
				obj.tablesJoined = 0;
				obj.table = null;
				obj.whereClause = "";
				obj.limitClause = "";
				obj.joinClause = "";
				obj.db = (db) ? db : setDb();
				
				
				this.resetQueryString = function(){
					obj.colString = "";
					obj.tablesJoined = 0;
					obj.table = null;
					obj.whereClause = "";
					obj.limitClause = "";
					obj.joinClause = "";
				}
				this.setTable = function(tableName){
					var tableAlias = "t"+obj.tablesJoined;
					obj.table = tableName + " as " + tableAlias;
					return tableAlias;
				};
				this.setColumns = function(params, table, raw){
					obj.colString = (obj.colString) ? obj.colString : "";
					if(!params) return;
					if(params.cols != undefined){
						if(angular.isArray(params.cols)){
							angular.forEach(params.cols, function(value, key) {
								obj.colString += (raw) ? value + ", "  : table + "." + value + ", ";
							});
						}else{
							angular.forEach(params.cols, function(value, key) {
								obj.colString += " " +  table+"."+key + " as " + value + ", ";
							});
						}
						
					}
					if(params.rawCols != undefined){
						if(angular.isArray(params.rawCols)){
							angular.forEach(params.rawCols, function(value, key) {
								obj.colString += value + ", ";
							});
						}
					}
					return obj.colString;
				}
				this.setWhere = function(params, table){
					obj.whereClause = " WHERE 1 = 1 ";
					if(params){
						// Set WHERE clause
						if(params.where != undefined && table != undefined){
							angular.forEach(params.where, function(value, key) {
								obj.whereClause += " AND " +  table+"."+key + " = '" + value + "'";
							});
						}
						if(params.where != undefined && table == undefined){
							angular.forEach(params.where, function(value, key) {
								obj.whereClause += " AND " + key + " = '" + value + "'";
							});
						}
						if(params.whereRaw != undefined){
							angular.forEach(params.whereRaw, function(value, key) {
								obj.whereClause += " AND " + value;
							});
						}
						
						// For search LIKE clause
						if(params.search != undefined){
							angular.forEach(params.search, function(value, key) {
								obj.whereClause += " AND " +  table+"."+key + " LIKE '%" + value + "%'";
							});
						}
						
						// For GroupBy clause
						if(params.groupBy != undefined){
							var groupBy = " GROUP BY ";
							angular.forEach(params.groupBy, function(value, key) {
								groupBy +=  table+"."+key + ",";
							});
							groupBy = groupBy.slice(0,-1);
							obj.whereClause += groupBy;
						}
						
						// For OrderBy clause
						if(params.orderBy != undefined){
							var orderBy = " ORDER BY ";
							angular.forEach(params.orderBy, function(value, key) {
								orderBy += table+"."+key + " " + value;
							});
							obj.whereClause += orderBy;
						}
						
					}
					return obj.whereClause;
				};
				
				//code for join clause
				this.setJoin = function(joinType,joinTable,joinOn){
					if((joinType != undefined)&&(joinTable!=undefined)&&(joinOn!=undefined)){
						obj.joinClause = (obj.joinClause) ? " " + obj.joinClause : " ";
						obj.tablesJoined = (obj.tablesJoined==undefined)? 1 :(obj.tablesJoined) + 1;
						obj.joinClause += " " + joinType + " ";
						angular.forEach(joinOn, function(value, key) {
							obj.joinClause += " " +joinTable + " As t" + obj.tablesJoined +" ON t" + obj.tablesJoined + "." +key +" = " + value;
						});
						return "t"+ obj.tablesJoined;
					}
				};
				
				this.setLimit = function(params){
					if(!params || !params.limit){
						return "";
					}else{
						var page = (params.limit.page - 1) * params.limit.records;
						obj.limitClause = " LIMIT " + page + ", " + params.limit.records;
					}				
					return obj.limitClause;
				};
				this.getQueryString = function(checkTotalRecords){
					var params = obj.queryDetails.params;
					var table = obj.setTable(obj.queryDetails.table);
					var whereClause = obj.setWhere(params, table);
					var limitClause = obj.setLimit(params);
					var colString = obj.setColumns(params, table);
					var joinString = "";
					if(params.join){
						if(angular.isArray(params.join)){
							angular.forEach(params.join,function(value, key) {
								var joinClause = obj.setJoin(value.joinType, value.joinTable, value.joinOn);
								if(value.cols) colString = (obj.setColumns(value, joinClause));
							});
						}else{
							var joinClause = obj.setJoin(params.join.joinType, params.join.joinTable, params.join.joinOn);
							if(params.join.cols){
								colString = (obj.setColumns(params.join, joinClause));
							}
						}
						joinString = obj.joinClause;
						
					}
					var colString = obj.colString.slice(0,-2);
					var QueryString = {};
					
						QueryString.queryString = 'SELECT '+colString+' FROM ' + obj.table + " " + joinString + " " + obj.whereClause + limitClause;
					
						QueryString.queryStringTotalRecords = 'SELECT '+colString+' FROM ' + obj.table + " " + joinString + " " + obj.whereClause;
					
					//console.log(QueryString);
					return QueryString;
				}
			}
			
			
// ***************************************************************************************
			// Select Query here
			return {
				setDb : setDb,
				selectData : function(table, single, params){
					//console.log(single, tableName, params);
					table = ($rootScope.module) ? $rootScope.module+"_"+table : table;
					var obj = new selectDbData(table, single, params);
					var db = obj.db;
					var qs = obj.getQueryString();
					var queryString = qs.queryString;
					var queryStringTotalRecords =qs.queryStringTotalRecords;
					
					var deferred = $q.defer();
					var data = {data : [], status : "success", message : "Data Selected!"};
					
					
					db.transaction(function (tx) {
					  tx.executeSql(queryString, [], function (tx, results) {
						var len = results.rows.length, i;
						if(len == 1 && single == true){
							data.data = results.rows.item(0);
						}else{
							for (i = 0; i < len; i++) {
								var row = results.rows.item(i);
								var newData = parse(row);
							  data.data.push(newData);
							}
						}
						tx.executeSql(queryStringTotalRecords, [], function (tx, results) {
							data.totalRecords = results.rows.length;
							if( len >= 1){
									deferred.resolve(data);
									obj.resetQueryString();
							}else{
								data.data = queryString;
								data.status = 'warning';
								data.message = "Data not found!";
								console.warn(data);
								deferred.resolve(data);
								obj.resetQueryString();
							}
						})
					  },function(error, er1){
							data.status = 'error';
							data.message = er1.message;
							data.data = queryString;
							console.error(data);
							deferred.resolve(data);
							obj.resetQueryString();
					  });
					});
					return deferred.promise;
				},
				setDbStructure : function(structure){
					var queryString = structure.replace(/^.*COMMIT TRANSACTION.*$/mg, "").replace(/^.*BEGIN TRANSACTION.*$/mg, "").replace(/^.*PRAGMA.*$/mg, "").replace(/^.*--.*$/mg, "").replace(/(\r\n|\n|\r)/gm,'');
					var queryArray = queryString.split(";");
					var data = {};
					var setDbStructureResult;
					var deferred = $q.defer();
					db.transaction(function (tx) {
					  tx.executeSql("SELECT * FROM sqlite_master WHERE type='table';", [], function (tx, results) {
						  var len = results.rows.length, i;
						  if(len<=2){
							  angular.forEach(queryArray,function(value,key){
								db.transaction(function (tx) {
								  tx.executeSql(value, [], function (tx, results) {
									//console.log(tx, results);
								  },function(error, er1){
									  //console.log(error, er1);
										data.status = 'error';
										data.message = er1.message;
										data.data = queryString;
										//console.error(data);
										deferred.resolve(data);
										obj.resetQueryString();
								  });
								});
							})
							data.status = "success";
							data.message = "Data Structure Created Successfully";
							data.data = null;
							deferred.resolve(data);
						  }else{
							  console.warn("Database Already Created!");
						  }
						
					  },function(error, er1){
							data.status = 'error';
							data.message = er1.message;
							data.data = queryString;
							console.error(data);
							deferred.resolve(data);
							obj.resetQueryString();
							setDbStructureResult = false;
					  });
					});
					
					return deferred.promise;
				},
				put : function(table, data, params){
					table = ($rootScope.module) ? $rootScope.module+"_"+table : table;
					var obj = new selectDbData(table,false,params);
					var deferred = $q.defer();
					var queryString="";
					var i = 0;
					angular.forEach(data, function(value, key) {
						queryString += "" + key + " = " + ((angular.isObject(value)) ? "'" + JSON.stringify(value) + "'," : "'" + value + "',");
					});
					queryString = queryString.slice(0,-1);
					
					var whereString = obj.setWhere(params);
					
					// Execute SQL
					db.transaction(function (tx) {
					  tx.executeSql("UPDATE "+table+" SET "+queryString+ whereString);
					}, error, success);
					// Success Handler
					function success(){
						var data = {
							status : "success",
							message : "Record updated successfully!",
							data : null
						};
						$notification.success(table, data.message);
						deferred.resolve(data);
					};
					// Error Handler
					function error(t, e) {
						var data = {
							status : "error",
							message : t,
							data : null
						};
						$notification.error(table, data.message);
						deferred.resolve(data);;
					};
					return deferred.promise;
				},
				post : function(table, data){
					
					table = ($rootScope.module) ? $rootScope.module+"_"+table : table;
					$rootScope.loading = true;
					var obj = new selectDbData(table,false);
					var deferred = $q.defer();
					var colName = "";
					var colValue = "";
					var i = 0;
					angular.forEach(data, function(value, key) {
						i++;
						colName += "'" + key + "',";
						colValue += (angular.isObject(value)) ? "'" + JSON.stringify(value) + "'," : "'" + value + "',";
					});
					colName = colName.slice(0,-1);
					colValue = colValue.slice(0,-1);
					
					db.transaction(function (tx) {
					  tx.executeSql("INSERT INTO "+table+" ("+colName+") VALUES ("+colValue+")");
					}, error, success);
					// Success Handler
					function success(){
						var data = {
							status : "success",
							message : "Record Inserted successfully!",
							data : null
						};
						$notification.success(table, data.message);
						deferred.resolve(data);;
					};
					// Error Handler
					function error(t, e) {
						var data = {
							status : "error",
							message : t,
							data : null
						};
						$notification.error(table, data.message);
						deferred.resolve(data);;
					};
					return deferred.promise;
				}
			}
	}]);

	app.factory('$notification', ['$timeout',function($timeout){
		var notifications = JSON.parse(localStorage.getItem('$notifications')) || [],
			queue = [];

		var settings = {
		  info: { duration: 2500, enabled: true },
		  warning: { duration: 2500, enabled: true },
		  error: { duration: 3000, enabled: true },
		  success: { duration: 2500, enabled: true },
		  progress: { duration: 2000, enabled: true },
		  custom: { duration: 2000, enabled: true },
		  details: true,
		  localStorage: false,
		  html5Mode: false,
		  html5DefaultIcon: 'icon.png'
		};

		function html5Notify(icon, title, content, ondisplay, onclose){
		  if(window.webkitNotifications.checkPermission() === 0){
			if(!icon){
			  icon = 'favicon.ico';
			}
			var noti = window.webkitNotifications.createNotification(icon, title, content);
			if(typeof ondisplay === 'function'){
			  noti.ondisplay = ondisplay;
			}
			if(typeof onclose === 'function'){
			  noti.onclose = onclose;
			}
			noti.show();
		  }
		  else {
			settings.html5Mode = false;
		  }
		}


		return {

		  /* ========== SETTINGS RELATED METHODS =============*/

		  disableHtml5Mode: function(){
			settings.html5Mode = false;
		  },

		  disableType: function(notificationType){
			settings[notificationType].enabled = false;
		  },

		  enableHtml5Mode: function(){
			// settings.html5Mode = true;
			settings.html5Mode = this.requestHtml5ModePermissions();
		  },

		  enableType: function(notificationType){
			settings[notificationType].enabled = true;
		  },

		  getSettings: function(){
			return settings;
		  },

		  toggleType: function(notificationType){
			settings[notificationType].enabled = !settings[notificationType].enabled;
		  },

		  toggleHtml5Mode: function(){
			settings.html5Mode = !settings.html5Mode;
		  },

		  requestHtml5ModePermissions: function(){
			if (window.webkitNotifications){
			  if (window.webkitNotifications.checkPermission() === 0) {
				return true;
			  }
			  else{
				window.webkitNotifications.requestPermission(function(){
				  if(window.webkitNotifications.checkPermission() === 0){
					settings.html5Mode = true;
				  }
				  else{
					settings.html5Mode = false;
				  }
				});
				return false;
			  }
			}
			else{
			  return false;
			}
		  },


		  /* ============ QUERYING RELATED METHODS ============*/

		  getAll: function(){
			// Returns all notifications that are currently stored
			return notifications;
		  },

		  getQueue: function(){
			return queue;
		  },

		  /* ============== NOTIFICATION METHODS ==============*/

		  info: function(title, content, userData){
			return this.awesomeNotify('info','info-sign', title, content, userData);
		  },

		  error: function(title, content, userData){
			return this.awesomeNotify('error', 'remove', title, content, userData);
		  },

		  success: function(title, content, userData){
			return this.awesomeNotify('success', 'ok', title, content, userData);
		  },

		  warning: function(title, content, userData){
			return this.awesomeNotify('warning', 'exclamation-sign', title, content, userData);
		  },

		  awesomeNotify: function(type, icon, title, content, userData){
			/**
			 * Supposed to wrap the makeNotification method for drawing icons using font-awesome
			 * rather than an image.
			 *
			 * Need to find out how I'm going to make the API take either an image
			 * resource, or a font-awesome icon and then display either of them.
			 * Also should probably provide some bits of color, could do the coloring
			 * through classes.
			 */
			// image = '<i class="icon-' + image + '"></i>';
			return this.makeNotification(type, false, icon, title, content, userData);
		  },

		  notify: function(image, title, content, userData){
			// Wraps the makeNotification method for displaying notifications with images
			// rather than icons
			return this.makeNotification('custom', image, true, title, content, userData);
		  },

		  makeNotification: function(type, image, icon, title, content, userData){
			var notification = {
			  'type': type,
			  'image': image,
			  'icon': icon,
			  'title': title,
			  'content': content,
			  'timestamp': +new Date(),
			  'userData': userData
			};
			if(notification.type == "error" || notification.type == "warning"){
				notifications = [];
			}
			notifications.push(notification);
			if(settings.html5Mode){
			  html5Notify(image, title, content, function(){
			  }, function(){
			  });
			}
			else{
				//if(notification.type == "error" || notification.type == "warning"){
					queue.splice(0, queue.length);
				//}
				queue.push(notification);
				$timeout(function removeFromQueueTimeout(){
					queue.splice(queue.indexOf(notification), 1);
				}, settings[type].duration);

			}

			this.save();
			return notification;
		  },


		  /* ============ PERSISTENCE METHODS ============ */

		  save: function(){
			// Save all the notifications into localStorage
			// console.log(JSON);
			if(settings.localStorage){
			  localStorage.setItem('$notifications', JSON.stringify(notifications));
			}
			// console.log(localStorage.getItem('$notifications'));
		  },

		  restore: function(){
			// Load all notifications from localStorage
		  },

		  clear: function(){
			notifications = [];
			this.save();
		  }

		};
	}])
  
	return app;
});
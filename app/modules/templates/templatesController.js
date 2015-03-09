'use strict';

define(['app'], function (app) {
    var injectParams = ['$scope', '$injector','$location','$routeParams','dataService','upload'];
    
    // This is controller for this view
	var templatesController = function ($scope,$injector,$location,$routeParams,dataService,upload) {
		//for display form parts
		$scope.tempPart = $routeParams.tempPart;
		// all $scope object goes here
		$scope.maxSize = 5;
		$scope.totalRecords = "";
		$scope.tempListCurrentPage = 1;
		$scope.myTempCurrentPage = 1;
		$scope.customTempCurrentPage = 1;
		$scope.pageItems = 5;
		$scope.numPages = "";
		$scope.user_id = {user_id : 2}; // these are URL parameters
		// All $scope methods
		//$scope.template_type = {template_type: public};
		$scope.pageChanged = function(page) { // Pagination page changed
		angular.extend(where, $scope.user_id);
			dataService.get("/getmultiple/template/"+page+"/"+$scope.pageItems, where)
			.then(function(response) {  //function for templatelist response
				$scope.templates = response.data;
				//console.log($scope.properties);
			});
		};
		
		/*For display by default templatelist page {trupti}*/
		if(!$routeParams.tempPart) {
			$location.path('/dashboard/templates/listoftemplates');
		}
		
		//Upload Function for uploading files {Vilas}
		$scope.reqtemp={}; // this is form object
		$scope.userinfo = {userId:1, name:"vilas"}; // this is for uploading credentials
		$scope.path = "template/"; // path to store images on server
		$scope.reqtemp.scrible  = []; // uploaded images will store in this array
		$scope.upload = function(files,path,userinfo){ // this function for uploading files
			upload.upload(files,path,userinfo,function(data){
				if(data.status !== 'error'){
					$scope.reqtemp.scrible.push(JSON.stringify(data.details));
					console.log(data.message);
				}else{
					alert(data.message);
				}
				
			});
		};
		$scope.generateThumb = function(files){  // this function will generate thumbnails of images
			upload.generateThumbs(files);
		};// End upload function
		
		// switch functions
		var listoftemplates = function(){
			//$scope.status = {status : 1};
			//angular.extend($scope.status, $scope.user_id);
			dataService.get("/getmultiple/template/"+$scope.tempListCurrentPage+"/"+$scope.pageItems, $scope.user_id)
				.then(function(response) {  //function for templatelist response
				$scope.totalRecords = response.totalRecords;
				$scope.templates = response.data;
			});//end of by default templist
		};
		
		var mytemplates = function(){
			//function for mytemplate{trupti}
			dataService.get("/getmultiple/template/"+$scope.myTempCurrentPage+"/"+$scope.pageItems, $scope.user_id)
			.then(function(response) {  //function for my templates response
				$scope.templates = response.data;
			});
		};
		
		var custometemplates = function(){
			//for custom templtae
			dataService.get("/getmultiple/template/"+$scope.customTempCurrentPage+"/"+$scope.pageItems, $scope.user_id)
			.then(function(response) {  //function for templatelist response
				$scope.totalRecords = response.totalRecords;
				$scope.templates = response.data;
				
			});
		}
		
		var requestcustomtemplates = function(){
			//reset function{trupti}
			$scope.reset = function() {
				$scope.reqtemp = {};
			};
			//post method for insert data in request template form{trupti}
			$scope.postData = function(reqtemp) { 
				dataService.post("/post/template",reqtemp)
				.then(function(response) {  //function for response of request temp
					$scope.reqtemp = response.data;
					console.log(response);
					$scope.reset();
				});
			}//end of post method{trupti}
		}
		switch($scope.tempPart) {
			case 'listoftemplates':
				listoftemplates();
				break;
			case 'mytemplates':
				mytemplates();
				break;
			case 'custometemplates':
				custometemplates();
				break;
			case 'requestcustomtemplates':
				requestcustomtemplates();
				break;	
			default:
				listoftemplates();
		};

    };
	
	// Inject controller's dependencies
	templatesController.$inject = injectParams;
	// Register/apply controller dynamically
    app.register.controller('templatesController', templatesController);
});

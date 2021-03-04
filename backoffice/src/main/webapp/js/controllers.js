/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

'use strict';

/* Controllers */

var appControllers = angular.module('backoffice.controllers', []);

appControllers.controller('GlobalCtrl', [ '$scope', "$route",'info','$location', '$translate', 'localStorageService', '$window', '$modal',
                                          function($scope, $route, info, $location, $translate, localStorageService, $window,$modal) {
	$scope.$route = $route;
	
	$scope._origin = $window.location.origin;
	$scope._contextPath = $window.location.pathname.substring(0, window.location.pathname.indexOf("/",2));
	$scope._baseUrl = $scope._origin + $scope._contextPath;
	



	$scope.isAuthorized = function(operation){
		var authorized = info.isAuthorized(operation);
		return authorized;
	};
	
	$scope.activetab = "stream";
	$scope.$on("$routeChangeSuccess", function(event, current, previous){
		console.log("$routeChangeSuccess.current",current);
		if(typeof current.$$route != 'undefined')
			$scope.activetab = current.$$route.activetab;
	 });
	
//	
//	fabricAPIservice.getInfo().success(function(result) {
//		info.setInfo(result);
//		$scope.activeTenantCode = info.getActiveTenantCode();
//
//		$scope.user = result.user;
//	});

	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};


	$scope.isHomepage = function() {
		if($location.path().substring(0, 5) === "/dashboard"){
			return true;
		}	
		return false;
	};

	var scrollTo  = $location.search().scrollTo;
	console.debug(" scrollTo",  scrollTo);
	if(scrollTo){
		Helpers.util.scrollTo(scrollTo);
	}
	
	
	$scope.showMessage = function (type, title, message, detail) {
	    $modal.open({
	      animation: true,
	      templateUrl: 'messageDialog.html',
	      controller: 'MessageDialogCtrl',
	      //size: 'lg',
	      resolve: {
	    	  message: function () {
	          return {"type":type, "title":title, "message":message, "detail":detail};
	        }
	      }
	    });
	}


} ]);


appControllers.controller('MessageDialogCtrl', [ '$scope', '$modalInstance', 'message', function ($scope, $modalInstance, message) {
	console.log("MessageDialogCtrl - message", message)
	$scope.message = message;

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
	


}]);

appControllers.controller('FabricInstallLogCtrl', [ '$scope', '$modalInstance', 'row' , 'fabricBuildService', function ($scope, $modalInstance, row, fabricBuildService) {
	$scope.row = row;
	$scope.logLevels = {"DEBUG":{"level":"Debug", "show": false},
			"INFO":{"level":"Info", "show": true},
			"WARNING":{"level":"Warning", "show": true},
			"ERROR":{"level":"Error", "show": true}
			};
	
	$scope.toggleLevel = function(level){
		console.log("level", level);
		$scope.logLevels[level].show = !$scope.logLevels[level].show;
	};
	
	$scope.isLevelVisible = function(level){
		console.log("level visible", level);
		return $scope.logLevels[level].show;
	};
	
	$scope.close = function () {
	    $modalInstance.dismiss('cancel');
		};
	}
]);
//appControllers.controller('HomeCtrl', [ '$scope', "$route", '$filter', 'info', '$location', 
//                                        function($scope, $route, $filter, info,$location) {
//	$scope.$route = $route;
//
//	$scope.tenant = "";
//
//	var $translate = $filter('translate');
//
//
//	$scope.isHomepage = function() {
//		return true;
//	};
//
//} ]);


/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

'use strict';

/* Controllers */

var appControllers = angular.module('userportal.controllers', []);

appControllers.controller('GlobalCtrl', [ '$scope', "$route", '$modal', 'info','$location', '$translate', 'upService', 'localStorageService', 'storeAPIservice','$window', '$rootScope', 'idleTimer', 'YUCCA_HOME_PAGE','version','ENABLE_PERSONAL','ENABLE_TRIAL', 'YUCCA_PORTAL','YUCCA_INTRO_URL',
                                          function($scope, $route, $modal, info, $location, $translate, upService, localStorageService,storeAPIservice,$window,$rootScope, idleTimer,YUCCA_HOME_PAGE, version, ENABLE_PERSONAL, ENABLE_TRIAL,YUCCA_PORTAL,YUCCA_INTRO_URL) {
	$scope.$route = $route;
	
	$scope.currentLang = function(){return $translate.use();};
	
	
	console.debug("$location", $location);
	
	$scope._origin = $window.location.origin;
	$scope._contextPath = $window.location.pathname.substring(0, window.location.pathname.indexOf("/",2));
	$scope._baseUrl = $scope._origin + $scope._contextPath;
	
	
	$scope.$on("$routeChangeSuccess", function(event, current, previous){
		console.debug("$routeChangeSuccess.current",current);
		if(typeof current.$$route != 'undefined')
			$scope.isHomepage = current.$$route.isHomepage;
	     console.debug("isHomepage", $scope.isHomepage, current.activetab);
	 });

	$scope.yuccaIntroUrl = YUCCA_INTRO_URL;

	$scope.enablePersonal = ENABLE_PERSONAL;
	$scope.enableTrial = ENABLE_TRIAL;
	$scope.yuccaHomeUrl = YUCCA_HOME_PAGE;
	$scope.yucca_portal = YUCCA_PORTAL;
	$scope.storeUrl = '/store/';	
	console.debug("storeUrl",$scope.storeUrl);
	
	$scope.DEFAULT_DATASET_ICON = Constants.DEFAULT_DATASET_ICON + "_" + $scope.yucca_portal +".png";
	$scope.DEFAULT_STREAM_ICON = Constants.DEFAULT_STREAM_ICON + "_" + $scope.yucca_portal +".png";

	var supportedLanguages = ['it', 'en'];

	var langParam = $location.search().lang;
	if(typeof langParam != 'undefined' && supportedLanguages.indexOf(langParam)>=0){
		$translate.use(langParam);
	}
	else {
		var savedLang = localStorageService.get("currentLang");
		if(typeof savedLang != 'undefined' && supportedLanguages.indexOf(savedLang)>=0)
			$translate.use(savedLang);

	}

	
	$scope.isAuthorized = function(operation){
		var authorized = info.isAuthorized(operation);
		return authorized;
	};
	
	$scope.canManageStream= function(){
		return info.canManageStream();
	};
	
	$scope.isCsiTenant = function(){
		return info.isCsiTenant();
	};
	
	$scope.userTenants = null;
	
	var checkTermCondition = function(){ 
		$scope.activeTenantType = info.getActiveTenantType();
		if (($scope.activeTenantCode != 'sandbox') && ($scope.activeTenantCode != null)){
			if(typeof $scope.user.acceptTermConditionTenants == 'undefined')
				$scope.user.acceptTermConditionTenants = [];
			
			if($scope.user.acceptTermConditionTenants.indexOf($scope.activeTenantCode)<0){
				var modalAcceptTermConditionInstance = $modal.open({
					animation : $scope.animationsEnabled,
					templateUrl : 'termAndConditionModal.html',
					controller : 'TermAndConditionModalCtrl',
					backdrop  : 'static',
					keyboard : false,
					size : 0,
				      resolve: {
				    	  activeTenantType: function () {
				            return $scope.activeTenantType;
				          }
				        }
				});
	
				modalAcceptTermConditionInstance.result.then(function() {
					console.log("modalAcceptTermConditionInstance ok");
				}, function() {
					console.debug("Not accepted term and conditions");
					$location.path("/userportal/api/authorize?logout={{user.username}}&returnUrl=%23%2Fhome%3F");
					console.log("path", $location.path());
				});
			}
		}
	};
	
	var lastActiveTenant = localStorageService.get("lastActiveTenant")==null?null: {tenantcode:localStorageService.get("lastActiveTenant")};
	
	upService.getInfo(false,lastActiveTenant).success(function(result) {
		info.setInfo(result);
		
		console.log("info", info);

		
		$scope.activeTenantCode = info.getActiveTenantCode();

		
		
		//$scope.userTenants = info.getInfo().user.tenants;
		$scope.userTenantsToActivate = new Array();
		$scope.managementUrl = '#/management/virtualentities/'+info.getActiveTenantCode();
		$scope.user = result.user; 
		$scope.user.haveTrialTenant = false;
		//$scope.user.haveTrialTenantToActivate = false;
		$scope.user.havePersonalTenant = false;
		//$scope.user.havePersonalTenantToActivate = false;
		angular.forEach($scope.user.tenants, function(value, key) {
			console.debug("value", value)
			if (value.tenantType.tenanttypecode == "trial")
				$scope.user.haveTrialTenant = true;
			});
		angular.forEach($scope.user.tenants, function(value, key) {
			if (value.tenantType.tenanttypecode == "personal")
				$scope.user.havePersonalTenant = true;
			});

		$scope.user.canChangePassword = false;
		try {
			if($scope.user.username.indexOf("_AT_") === -1 && !Helpers.util.isItalianCF($scope.user.username)){
				$scope.user.canChangePassword = true;
			}
		} catch (e) {
			console.error("Error while check if user can change password", user,  e);
			$scope.user.canChangePassword = false;
		}
		
		
		
		try{
			$scope.BuildInfo.timestamp = BuildInfo.timestamp;
		} catch (e) {
			if(typeof $scope.BuildInfo == 'undefined')
				$scope.BuildInfo = {};
			$scope.BuildInfo.timestamp = new Date().getMilliseconds();
		}
		
		
		checkTermCondition();

		console.debug('info', info);
		console.debug('activeTenantCode', $scope.activeTenantCode);
		console.debug('userTenants', $scope.user.tenants);
		console.debug('userTenantsToActivate', $scope.userTenantsToActivate);
		console.debug('managementUrl', $scope.managementUrl);
		console.debug('user', $scope.user);
		$scope.info = info.getInfo();
		if ($scope.user.loggedIn)
			gestModalWindow();
		
		//console.log("showcurrentversion", result.version);
		//showCurrentVersionLog(result.version);
	});
	
	var gestModalWindow = function(){ 

			$scope.user.authType = $scope.user.authType || "local";
			if (!$scope.user.isStrongUser){  //Compare la modale perchè non hai credenziali strong!
				$scope.openForceLogout();
				$scope.user.authType = "notStrong";
			} else if ($scope.user.isTechnicalUser){
				$scope.openForceLogout();
				$scope.user.authType = "tecnical";
			} else if ($scope.user.tenants == 'undefined' || $scope.user.tenants.length == 0 ){
					if ($scope.user.isSocialUser &&  typeof info.getInfo().trialTenantToActivated == 'undefined'){
						$scope.user.authType = "social";
						$scope.openRequestTenant('trial', true);
					} else if(!$scope.user.isSocialUser && typeof info.getInfo().personalTenantToActivated == 'undefined'){
						$scope.openRequestTenant('pesonal', true);
					}
			} else {
				//Tutto ok! NO MODAL
			}
			
			if ($scope.user.isSocialUser)
				$scope.user.authType = "social";
			
			console.debug("user.authType", $scope.user.authType);
	
	};
	
	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
		localStorageService.set("currentLang",langKey);
		refreshMainNews(langKey);
	};
	
	var refreshMainNews  = function(langKey){
		if(typeof home_news!= 'undefined'){
			if(home_news[langKey] && home_news[langKey].title != "")
				$scope.mainNews = home_news[langKey];
			else if(home_news["it"] && home_news["it"].title != "")
				$scope.mainNews = home_news[langKey];
			else
				delete $scope.mainNews;
		}
		else
			delete $scope.mainNews;
	};
	
	refreshMainNews("it");

	$scope.changeActiveTenant = function(newTenant){
		upService.getInfo(false, newTenant).success(function(result) {
			info.setInfo(result);
			$scope.activeTenantCode = info.getActiveTenantCode();
    		localStorageService.set("lastActiveTenant",info.getActiveTenantCode());

			$scope.managementUrl = '#/management/virtualentities/'+info.getActiveTenantCode();
			$location.path("#/");
			checkTermCondition();
		});
	};

	$scope.isHomepage = function() {
		if($location.path().substring(0, 5) === "/home"){
			return true;
		}	
		return false;
	};

	$scope.showCookieMessage = false;
	console.debug("acceptedCookies",acceptedCookies);

	var acceptedCookies = localStorageService.get("acceptedCookies");
	if(acceptedCookies == null)
		acceptedCookies = localStorageService.cookie.get("acceptedCookies");

	if(acceptedCookies != "yes")
		$scope.showCookieMessage = true;

	$scope.acceptCookie = function(){
		console.debug("acceptCookie");
		//$cookies.acceptedCookies = "yes";
		if(localStorageService.isSupported) {
			localStorageService.set("acceptedCookies", "yes");
		}
		else{
			localStorageService.cookie.set("acceptedCookies", "yes");
		}
		$scope.showCookieMessage = false;
	};
		
	console.debug('location', $location.$$url);
	$scope.openRequestTenant = function(tenantType, hasNoTenant){
		var modalInstance = $modal.open({
			animation : $scope.animationsEnabled,
			templateUrl : 'requestTenant.html',
			controller : 'RequestTenantCtrl',
			size : 0,
			backdrop  : 'static',
			keyboard  : false,
			resolve: { 
				tenantType: function () {
					return tenantType;
				},
				user: function () {
					return $scope.user;
				},
				hasNoTenant: function () {
					return hasNoTenant;
				}
			}
		});

		modalInstance.result.then(function() {
			console.debug("result -> ");
			upService.getInfo(true).success(function(result) {
				info.setInfo(result);
				$scope.info = info.getInfo();

			}).error(function(result) {
				console.error("refresh tenants ERROR", response);
			});
		}, function() {
		});
	};
	
	$scope.openForceLogout = function(){
		var modalInstance = $modal.open({
			animation : $scope.animationsEnabled,
			templateUrl : 'forceLogout.html',
			controller : 'ForceLogoutCtrl',
			size : 0,
			backdrop  : 'static',
			keyboard  : false,
			resolve: { 
				user: function () {
					return $scope.user;
				}
			}
		});

		modalInstance.result.then(function() {
		}, function() {
		});
	};
	
	//$scope.openForceLogout();

	
	$rootScope.$on('sessionExpiring', function (event) {
		console.log("sessionExpiring");
		idleTimer.stopTimer();
		var modalInstance = $modal.open({
			animation : true,
			templateUrl : 'confirmDialog.html',
			controller : 'ConfirmDialogCtrl',
			backdrop  : 'static',
			resolve: { 
				question: function () {
					return {"title":"SESSION_EXPIRING_DIALOG_TITLE","message":"SESSION_EXPIRING_DIALOG_MESSAGE"};
				}
			}
		});

		modalInstance.result.then(function() {
			console.log("confirm Update");
			upService.getInfo(false).success(function(result) {console.log("refresh session");});
		}, function() {
		});

		
		
	});
	
	var showVersionLog = function(currentVersion, lang){
		
		upService.loadReleasenotes(currentVersion, lang).success(function(result) {
			console.log("loadReleasenotes", result);
			if(typeof result != undefined && result!=null && result!= ""){
				
				var modalAcceptTermConditionInstance = $modal.open({
					animation : $scope.animationsEnabled,
					templateUrl : 'currentVersionLog.html',
					controller : 'CurrentVersionLogCtrl',
					backdrop  : 'static',
					keyboard : false,
					resolve: {
						releasenotes: function () {
							return result;
						}
					}
				});
				
				
			}
		}).error(function(result) {
			console.warn("showVersionLog not found", result);
		});
		
	};
	
	
	
	var showCurrentReleaseNotes = function(){
		console.log("sss",localStorageService.get("relasenotes_" + version + "_readed") );
		if(!localStorageService.get("relasenotes_" + version + "_readed") )
			showVersionLog(version, $scope.currentLang());		
	};
	
	showCurrentReleaseNotes();
	
	$scope.showReleasenotes = function(){
		upService.loadReleasenotesList().success(function(result) {
			console.log("loadReleasenotes", result);
			if(typeof result != undefined && result!=null && result!= ""){
				
				$modal.open({
					animation : $scope.animationsEnabled,
					templateUrl : 'releasenotesList.html',
					controller : 'ReleasenotesListCtrl',
					backdrop  : 'static',
					keyboard : false,
					resolve: {
						rnList: function() {return result.reverse();}, 
						lang: function(){return $scope.currentLang()}
					}
				});
			}
		}).error(function(result) {
			console.warn("showReleasenotes not found", result);
		});
	};
	
	
}]);


var initCtrlInfoPromise = null;

appControllers.factory("initCtrl", function(upService, info, $q, localStorageService,YUCCA_HOME_PAGE) {
    return {
    	"getInfo": function() {
    		var lastActiveTenant = localStorageService.get("lastActiveTenant");
    		if(initCtrlInfoPromise == null){
	    		initCtrlInfoPromise = upService.getInfo(false,lastActiveTenant);
	    		initCtrlInfoPromise.success(function(result) {
		    		info.setInfo(result);
		    		console.debug("result", result);
		    		console.debug("info", info);
		    		//if(!result.user.loggedIn)
		    		//	window.location = YUCCA_HOME_PAGE;
		    	});
	    		
    		}
	        return initCtrlInfoPromise;
    	}
    };
});

appControllers.controller('NavigationCtrl', [ '$scope', "$route", '$translate','webSocketService', '$modal', 'info', '$location', 
                                              function($scope, $route, $translate, webSocketService, $modal, info, $location) {
	$scope.$route = $route;
	//$scope.managementUrl = null;
	$scope.currentUrl = function() {
		return encodeURIComponent("#"+$location.path());
	};

	$scope.$on('$locationChangeStart', function(event) {
		console.debug("::::: $locationChangeStart ::::");
		if(WebsocketStompSingleton.getInstance()){			
			console.debug(":::::WebsocketStompSingleton.getInstance().cancelAllSubscriptions() ::::");
			WebsocketStompSingleton.getInstance().cancelAllSubscriptions();
		}
		if(webSocketService()){
			console.debug("::: webSocketService :::",webSocketService());
			webSocketService().unsubscribeAll();
		}
	});

	$scope.isUserLoggedIn = function() {
		return $route.current.isHomepage;
	};
	
	$scope.requestTT = function(tenantType){
		$scope.openRequestTenant('trial', false);
	};
	
	$scope.requestTP = function(tenantType){
		$scope.openRequestTenant('pesonal', false);
	};

}]);

appControllers.controller('HomeCtrl', [ '$scope', '$route', '$http', '$filter', 'odataAPIservice', '$modal', 'info', '$location', 
                                        function($scope, $route, $http, $filter, odataAPIservice, $modal, info, $location) {
	
	$scope.$route = $route;
	$scope.tenant = "";
	var $translate = $filter('translate');
	//showMap();

	$scope.isHomepage = function() {
		return true;
	};
	
	$scope.statistics = {};

	
	odataAPIservice.loadDataStatistics().success(function(response) {
		console.info("statistics", response);	
		$scope.statistics.total_tenants = response.totalOrganizations;
		$scope.statistics.total_streams = response.totalStreams;
		$scope.statistics.total_smart_objects = response.totalSmartobjects;

		$scope.statistics.total_data = response.totalData;
		$scope.statistics.total_measures = response.totalMeasures;
		$scope.statistics.today_data = response.yesterdayMeasures;
		if(typeof response.lastUpdateMillis != 'undefined' && response.lastUpdateMillis >0)
			$scope.statistics.lastupdate = new Date(response.lastUpdateMillis);

		//$scope.domainChartData = response.domains;
		var domains= [];
		for (var domain in response.domains) {
			if (response.domains.hasOwnProperty(domain)) {
				domains.push({key: $translate(domain), y:response.domains[domain]});
		    }
		}
		$scope.domainChartData = domains;
	}).error(function(response){
		console.error("statistics error", response);	
	});
	
 


	$scope.xDomainChartFunction = function(){
		return function(d) {
			return d.key;
		};
	};
	$scope.yDomainChartFunction = function(){
		return function(d) {
			return d.y;
		};
	};

	$scope.domainChartColors = ["#00521F","#006627","#007A2F","#008F37","#00973A","#00B846","#00CC4E","#00E056", "#00F55E"];

	
	$scope.animationsEnabled = true;
	 
} ]);


appControllers.controller('RequestTenantCtrl', [ '$scope', '$modalInstance', 'info', 'adminAPIservice', 'upService',  'tenantType', 'hasNoTenant', 'user',
                                                 function($scope, $modalInstance, info, adminAPIservice, upService, tenantType, hasNoTenant, user) {
	
	console.debug("--->info = ", info);
	console.debug("--->user = ", user);
	$scope.status = 'start';
	$scope.modalTitle = tenantType == 'trial'? 'REQUEST_TENANT_TRIAL_TITLE':'REQUEST_TENANT_PERSONAL_TITLE';
	$scope.modalIntro = tenantType == 'trial'? 'REQUEST_TENANT_TRAIL_INFO':'REQUEST_TENANT_PERSONAL_INFO';
	$scope.missingEmail = typeof user.email == 'undefined' || user.email == null || user.email == "";
	$scope.hasNoTenant = hasNoTenant;
	
	$scope.isValidEmai = function(){
		return Helpers.util.isValidEmail($scope.installationTenantRequest.useremail);
	};
	
	$scope.installationTenantRequest = {
			  "idTenantType": tenantType=='trial'?Constants.TENANT_TYPE_TRIAL_ID:Constants.TENANT_TYPE_PERSONAL_ID,
			  "useremail": user.email,
			  "userfirstname":  user.firstname,
			  "userlastname": user.lastname,
			  "username":user.username,
			  "usertypeauth":  tenantType=='trial'?'social':'default'
			  //"usertypeauth": info.getActiveTenant().usertypeauth
			};
	
	$scope.validationError = {};
	$scope.requestTenant = function(){
		console.debug("requestTenant - installationTenantRequest", $scope.installationTenantRequest);
		$scope.validationError = {};
		if(!Helpers.util.isValidEmail($scope.installationTenantRequest.useremail)){
			$scope.validationError.message = 'REQUEST_TENANT_EMAIL_ERROR';
			//$scope.validationError.detail = 'REQUEST_TENANT_EMAIL_ERROR';
			$scope.validationError.type='warning';
		}
		else{
			$scope.status = 'sending';
			adminAPIservice.createTenant($scope.installationTenantRequest).success(function(response) {
				console.debug("createTenant SUCCESS", response);
				$scope.status = 'finish';
				$scope.requestResponse = {};
				$scope.requestResponse.message=response.errorName;
				$scope.requestResponse.code=response.errorCode;
				$scope.requestResponse.detail=response.description;
				$scope.requestResponse.type='success';
				response;
			}).error(function(response){
				console.error("createTenant ERROR", response);
				$scope.status = 'finish';
				$scope.requestTenantError = {};
				$scope.requestTenantError.message=response.errorName;
				$scope.requestTenantError.errorCode=response.errorCode;
				$scope.requestTenantError.detail=response.description;
				$scope.requestTenantError.type='danger';
				

	
			});
		}
	};
	
	$scope.cancel = function () {
		if($scope.status == 'finish')
			$modalInstance.close();
		else
			$modalInstance.dismiss('cancel');
			
	};
	
}]);



appControllers.controller('ForceLogoutCtrl', [ '$scope', '$modalInstance', 'user', '$translate',
                                                 function($scope, $modalInstance, user, $translate) {
	console.log("--->user = ", user);
    $scope.modalIntro = !user.isStrongUser? $translate.instant('HOME_LOGGED_NOT_STRONG_AUTHENTICATION'):$translate.instant('HOME_LOGGED_TECHNICAL_AUTHENTICATION');	
}]);

appControllers.controller('ConfirmDialogCtrl', [ '$scope', '$modalInstance', 'question',
    function($scope, $modalInstance, question) {
	
		$scope.question = question;
	
		$scope.yes = function () {
		    $modalInstance.close("yes");
		};
	
		$scope.no = function () {
		    $modalInstance.dismiss('cancel');
		};
}]);


appControllers.controller('CurrentVersionLogCtrl', [ '$scope', '$modalInstance', 'localStorageService', 'version', 'releasenotes',
    function($scope, $modalInstance, localStorageService,version, releasenotes) { 
		console.log("CurrentVersionLogCtrl ", version, releasenotes);
		$scope.version = version;
		$scope.releasenotes = releasenotes;
		$scope.cancel  = function () {
			localStorageService.set("relasenotes_" + version+"_readed", true); 
			$modalInstance.dismiss('cancel');
		};
		
		$scope.fullRefresh = function(){
			localStorageService.set("relasenotes_" + version+"_readed", true); 
			location.reload(true);
		}
}]);


appControllers.controller('ReleasenotesListCtrl', [ '$scope', '$modalInstance', 'upService', 'version', 'rnList', 'lang',
    function($scope, $modalInstance, upService, version, rnList, lang) { 
		console.log("ReleasenotesListCtrl ", rnList);
		$scope.rnList = rnList;
		$scope.feedback = null;
		$scope.showReleasenotes = function(v){
			$scope.feedback = {type: 'loading'};
			upService.loadReleasenotes(v, lang).success(function(result) {
				console.log("loadReleasenotes", result);
				$scope.feedback = {type: 'ok'};
				$scope.releasenotes = result;
			}).error(function(result) {
				console.error("loadReleasenotes ERRORE ", result);
				$scope.feedback = {type: 'error', detail:result};
			})
			
		}
		
		$scope.showReleasenotes(version);
		$scope.cancel  = function () {
			$modalInstance.dismiss('cancel');
		};
}]);

appControllers.controller('HelpDialogCtrl', [ '$scope', '$modalInstance', 'help','$translate',
    function($scope, $modalInstance, help,$translate) {
	
		console.log("HelpDialogCtrl", help)
		$scope.help = help;
		$scope.currentLang = function(){return $translate.use();};
		$scope.yes = function () {
		    $modalInstance.close("yes");
		};
	
}]);

appControllers.controller('TermAndConditionModalCtrl', [ '$scope', '$routeParams', '$location', '$modalInstance', 'info', 'upService', 'activeTenantType','$translate',
                                                 function($scope, $routeParams, $location, $modalInstance, info, upService , activeTenantType,$translate) {

	if(typeof activeTenantType == 'undefined' || activeTenantType == null)
		activeTenantType = 'default';
	if(activeTenantType!='trial')
		activeTenantType = 'default';
	$scope.showLoading = false;
	$scope.termConditionContent = 'partials/common/termCondition/termCondition_'+activeTenantType+'_'+$translate.use() +".html";
	$scope.acceptTermAndCondition = function () {
		$scope.showLoading = true;
		upService.acceptTermConditionForTenant(info.getActiveTenantCode()).success(function(info){
			console.log("acceptTermConditionForTenant a", info);
			$scope.showLoading = false;
			$modalInstance.close();
		}).error(function(e){
			console.log("error",e);
			$scope.showLoading = false;
			$location.path("/userportal/api/authorize?logout={{user.username}}&returnUrl=%23%2Fhome%3F");
		});
		
	};

	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
		$location.path("/userportal/api/authorize?logout={{user.username}}&returnUrl=%23%2Fhome%3F");
	};
}]);

appControllers.controller('HtmlPopoverCtrl', [ '$scope', '$modalInstance', 'title', 'htmlContent', 'htmlFooter', function($scope, $modalInstance, title, htmlContent, htmlFooter) {
	console.log("HtmlPopoverCtrl", title, htmlContent, htmlFooter);
	$scope.title = title;
	$scope.htmlContent = htmlContent;
	$scope.htmlFooter = htmlFooter;
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
}]);

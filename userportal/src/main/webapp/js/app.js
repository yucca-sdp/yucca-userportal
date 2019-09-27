/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */

'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('userportal', [
  'ngRoute',
  'ngSanitize',
  'userportal.config',
  'userportal.filters',
  'userportal.services',
  'userportal.directives',
  'userportal.controllers',
  'pascalprecht.translate',
  'ui.bootstrap',
  'ngPrettyJson',
  'nvd3ChartDirectives',
  'angularFileUpload',
  'ngDraggable',
  'ui.codemirror',
  'LocalStorageModule'
  //'ngIdle'
  //'akoenig.deckgrid'
  //'ngCookies'
  //'ngDragDrop'
]);


app.config(['$routeProvider','YUCCA_HOME_PAGE', 'YUCCA_PORTAL', function($routeProvider,YUCCA_HOME_PAGE, YUCCA_PORTAL) {
	
	//$routeProvider.when('/home-old', {pageTitle: 'PAGE_TITLE_HOME',templateUrl: 'partials/common/home.html?t='+BuildInfo.timestamp, isHomepage: true});
	$routeProvider.when('/landing', {pageTitle: 'PAGE_TITLE_HOME',templateUrl: 'partials/common/home/home.html?t='+BuildInfo.timestamp, isHomepage: true});
	$routeProvider.when('/home', {redirectTo: function(routeParams) {window.location = YUCCA_HOME_PAGE;}});

//	$routeProvider.when('/home-family-identity', {templateUrl: 'partials/common/home-family-identity.html?t='+BuildInfo.timestamp, isHomepage: true});
//	$routeProvider.when('/dashboard', {templateUrl: 'partials/dashboard/main.html?t='+BuildInfo.timestamp, activetab: 'dashboard'});
//	$routeProvider.when('/dashboard/main/:dashboard', {templateUrl: 'partials/dashboard/main.html?t='+BuildInfo.timestamp, activetab: 'dashboard'});
//	$routeProvider.when('/dashboard/streams', {templateUrl: 'partials/dashboard/streams.html?t='+BuildInfo.timestamp, activetab: 'dashboard'});
	$routeProvider.when('/dashboard/stream/:tenant_code/:virtualentity_code/:stream_code', 
			{pageTitle: 'PAGE_TITLE_DASHBOARD',templateUrl: 'partials/dashboard/stream-data.html?t='+BuildInfo.timestamp, activetab: 'dashboard', resolve: {info: function(initCtrl) {return initCtrl.getInfo();}}});
	$routeProvider.when('/dashboard/streamstats/:tenant_code/:virtualentity_code/:stream_code', 
			{tpageTitle: 'PAGE_TITLE_DASHBOARD',emplateUrl: 'partials/dashboard/stream-data.html?t='+BuildInfo.timestamp, activetab: 'dashboard', resolve: {info: function(initCtrl) {return initCtrl.getInfo();}}});
	//$routeProvider.when('/dashboard/error_log', {templateUrl: 'partials/dashboard/error-log.html?t='+BuildInfo.timestamp, activetab: 'dashboard'});

	$routeProvider.when('/management', 
			{pageTitle: 'PAGE_TITLE_MANAGEMENT', templateUrl: 'partials/management/choose_tenant.html?t='+BuildInfo.timestamp, controller: 'ManagementCtrl', activetab: 'management', resolve: {info: function(initCtrl) {return initCtrl.getInfo();}}});
	$routeProvider.when('/management/:managementTab', 
			{pageTitle: 'PAGE_TITLE_MANAGEMENT', templateUrl: 'partials/management/choose_tenant.html?t='+BuildInfo.timestamp, activetab: 'management', resolve: {info: function(initCtrl) {return initCtrl.getInfo();}}});
	$routeProvider.when('/management/:managementTab/:tenant_code', 
			{pageTitle: 'PAGE_TITLE_MANAGEMENT', templateUrl: 'partials/management/index.html?t='+BuildInfo.timestamp, activetab: 'management', resolve: {info: function(initCtrl) {return initCtrl.getInfo();}}});
	//$routeProvider.when('/management/:managementTab/:tenant_code/:entity_code', {templateUrl: 'partials/management/index.html?t='+BuildInfo.timestamp,  activetab: 'management', resolve: {info: function(initCtrl) {return initCtrl.getInfo();}}});
//	$routeProvider.when('/management/:managementTab/:tenant_code/:entity_code/:id_dataset', {templateUrl: 'partials/management/index.html?t='+BuildInfo.timestamp,  activetab: 'management', resolve: {info: function(initCtrl) {return initCtrl.getInfo();}}});
//	$routeProvider.when('/management/:managementTab/:tenant_code/:entity_code/:stream_code/:id_stream', {templateUrl: 'partials/management/index.html?t='+BuildInfo.timestamp, activetab: 'management', resolve: {info: function(initCtrl) {return initCtrl.getInfo();}}});
	$routeProvider.when('/management/:managementTab/:tenant_code/:entity_code', 
			{pageTitle: 'PAGE_TITLE_MANAGEMENT',templateUrl: 'partials/management/index.html?t='+BuildInfo.timestamp,  activetab: 'management', resolve: {info: function(initCtrl) {return initCtrl.getInfo();}}});
	$routeProvider.when('/management/:managementTab/:entity_type/:tenant_code/:entity_code/:id_datasource', 
			{pageTitle: 'PAGE_TITLE_MANAGEMENT',templateUrl: 'partials/management/index.html?t='+BuildInfo.timestamp,  activetab: 'management', resolve: {info: function(initCtrl) {return initCtrl.getInfo();}}});

	$routeProvider.when('/dataexplorer/search', 
			{pageTitle: 'PAGE_TITLE_SEARCH',templateUrl: 'partials/dataexplorer/datasearch/search.html?t='+BuildInfo.timestamp,  activetab: 'dataexplorer', resolve: {info: function(initCtrl) {return initCtrl.getInfo();}}});
	$routeProvider.when('/dataexplorer/searchresults', 
			{pageTitle: 'PAGE_TITLE_SEARCH_RESULT',templateUrl: 'partials/dataexplorer/datasearch/results.html?t='+BuildInfo.timestamp,  activetab: 'dataexplorer', resolve: {info: function(initCtrl) {return initCtrl.getInfo();}}});
	$routeProvider.when('/dataexplorer/:tenant_code/:entity_code', 
			{pageTitle: 'PAGE_TITLE_SEARCH_DETAIL',templateUrl: 'partials/dataexplorer/dataExplorer.html?t='+BuildInfo.timestamp,  activetab: 'dataexplorer', resolve: {info: function(initCtrl) {return initCtrl.getInfo();}}});
	$routeProvider.when('/dataexplorer/detail/:tenant_code/:virtualentity_code/:stream_code', 
			{pageTitle: 'PAGE_TITLE_SEARCH_DETAIL',templateUrl: 'partials/dataexplorer/detail.html?t='+BuildInfo.timestamp,  activetab: 'dataexplorer', dataset_type: 'stream', resolve: {info: function(initCtrl) {return initCtrl.getInfo();}}});
	
	$routeProvider.when('/dataexplorer/detail/:tenant_code/:entity_code', 
			{pageTitle: 'PAGE_TITLE_SEARCH_DETAIL',templateUrl: 'partials/dataexplorer/detail.html?t='+BuildInfo.timestamp,  activetab: 'dataexplorer', dataset_type: 'dataset', resolve: {info: function(initCtrl) {return initCtrl.getInfo();}}});
	
	$routeProvider.when('/dataexplorer/subscriptions', 
			{pageTitle: 'PAGE_TITLE_SUBSCRIPTIONS',templateUrl: 'partials/dataexplorer/dataSubscriptions.html?t='+BuildInfo.timestamp,  activetab: 'subscriptions', resolve: {info: function(initCtrl) {return initCtrl.getInfo();}}});
	
	$routeProvider.when('/dataexplorer/browsedata', 
			{pageTitle: 'PAGE_TITLE_BROWSE_DATA',templateUrl: 'partials/dataexplorer/dataBrowser.html?t='+BuildInfo.timestamp,  activetab: 'dataexplorer', resolve: {info: function(initCtrl) {return initCtrl.getInfo();}}});

	//$routeProvider.when('/market', {templateUrl: 'partials/market/index.html?t='+BuildInfo.timestamp, controller: 'MarketCtrl', activetab: 'market'});
	//$routeProvider.when('/store', {templateUrl: 'partials/store/index.html?t='+BuildInfo.timestamp, controller: 'StoreCtrl', activetab: 'store'});
	$routeProvider.when('/info', 
			{pageTitle: 'PAGE_TITLE_INFO',templateUrl: 'partials/info/info.html?t='+BuildInfo.timestamp, activetab: 'info', resolve: {info: function(initCtrl) {return initCtrl.getInfo();}}});
  
	$routeProvider.when('/info/cookiepolicy', 
			{pageTitle: 'PAGE_TITLE_INFO',templateUrl: 'partials/info/cookiePolicy_'+YUCCA_PORTAL+'.html?t='+BuildInfo.timestamp, activetab: 'info', resolve: {info: function(initCtrl) {return initCtrl.getInfo();}}});
	
	// demo
	$routeProvider.when('/dataexplorer/search_demo', {templateUrl: 'partials/dataexplorer/datasearch/demo/search.html?t='+BuildInfo.timestamp,  activetab: 'dataexplorer'});

	$routeProvider.otherwise({pageTitle: 'PAGE_TITLE_HOME', redirectTo: '/home'});
 // $locationProvider.html5Mode(true).hashPrefix('!');
}]);


app.config(['$translateProvider', function ($translateProvider) {
	// add translation table
	$translateProvider
	.translations('en', translations_en)
	.translations('it', translations_it)
	.preferredLanguage('it');
	
	$translateProvider.useSanitizeValueStrategy();
}]);

app.config(['$httpProvider', function($httpProvider) {
//    $httpProvider.defaults.useXDomain = true;
//    delete $httpProvider.defaults.headers.common['X-Requested-With'];
	$httpProvider.interceptors.push(function($q, idleTimer,info) {
		return {
			'request': function(config) {
				if(config.url.includes("/userportal/api/proxy/") && info.getActiveTenantCode()!= null && info.getActiveTenantCode() != 'sandbox'){
					console.log("resetTimer", info.getActiveTenantCode() );  
					idleTimer.resetTimer();
				}
				return config;
			},
			'response': function(response) { return response;}
		};
	});

}]);



app.run(['$rootScope','info','$location', 'YUCCA_HOME_PAGE', 'ENABLE_ANALYTICS','YUCCA_PORTAL', 
	function($rootScope, info, $location,YUCCA_HOME_PAGE,ENABLE_ANALYTICS, YUCCA_PORTAL) {
	$rootScope.yuccaPortal = YUCCA_PORTAL;
	$rootScope.enableAnalitycs = ENABLE_ANALYTICS && ENABLE_ANALYTICS=='true';
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
    	console.log("$routeChangeSuccess");
    	//var path = current.$$route.originalPath;
    	//console.log("p", path, YUCCA_HOME_PAGE);
    	//if (path.startsWith("/management")  && (!info || !info.getInfo() || !info.getInfo().user.loggedIn)) {
    	//if (info && info.getInfo() && info.getInfo().user && !info.getInfo().user.loggedIn && path !=("home") && path !=("home2") && path != YUCCA_HOME_PAGE.replace("#/","")) {
       // if (info && info.getInfo() && info.getInfo().user && !info.getInfo().user.loggedIn) {
    	var path = current.$$route.originalPath;
        if (!path.startsWith("/info") && info && info.getInfo() && info.getInfo().user && !info.getInfo().user.loggedIn) {
    		console.log('DENY : Redirecting to Login');
    		event.preventDefault();
    		//$location.path('home');
    		window.location = YUCCA_HOME_PAGE;
    	}
    	else {
    		console.log('ALLOW');
    	}
    	if(current.$$route)
    		$rootScope.pageTitle = current.$$route.pageTitle;
    });
}]);


//app.run(['$rootScope', '$location', 'info',function($rootScope, $location, info) {
//    $rootScope.$on('$routeChangeStart', function (event) {
//    	console.log('infoaa', info.info.user.loggedIn);
//    });
//}]);
var infoUser = {};
app.factory('info',  function() {
    var info = {};
    var infoService = {};
    
    infoService.getInfo = function() {
        return this.info;
    };

    infoService.setInfo = function(info) {
        this.info = info;
    //    this.infoService.setActiveTenantCode(this.info.user.tenants[0]);
    };
    
    infoService.setActiveTenantCode = function(activeTenantCode) {
    	this.info.activeTenantCode = activeTenantCode;
    };
    
    infoService.canManageStream= function() {
    	var activeTenant = this.getActiveTenant();
    	return activeTenant!=null && activeTenant.bundles.maxstreamsnum!=0;
    };    
    infoService.getActiveTenantCode = function(){
    	if(this.info && this.info.activeTenantCode)
    		return this.info.activeTenantCode;
    	else if(this.info && this.info.user && this.info.user.activeTenant)
    		return this.info.user.activeTenant;
    	else if(this.info && this.info.user && this.info.user.tenants && this.info.user.tenants !=null && this.info.user.tenants.length>0)
    		return this.info.user.tenants[0].tenantcode;
    	return null;
    };
    
    infoService.getActiveTenantType = function(){
    	var activeTenantType = "none";
    	if(this.info && this.info.user && this.info.user.tenants && this.info.user.tenants !=null && this.info.user.tenants.length>0){
    		for (var i = 0; i < this.info.user.tenants.length; i++) {
				if(this.info.user.tenants[i].tenantcode == this.getActiveTenantCode()){
					activeTenantType = this.info.user.tenants[i].tenantType.tenanttypecode; 
					break;
				}
			}
    	}
    		
    	return activeTenantType;
    };
    
    infoService.getActiveShareInformationType = function(){
    	var shareInformationType = "none";
    	if(this.info && this.info.user && this.info.user.tenants && this.info.user.tenants !=null && this.info.user.tenants.length>0){
    		for (var i = 0; i < this.info.user.tenants.length; i++) {
				if(this.info.user.tenants[i].tenantcode == this.getActiveTenantCode()){
					shareInformationType = this.info.user.tenants[i].shareType.description; 
					break;
				}
			}
    	}
    		
    	return shareInformationType;
    };
    
    
    
    infoService.getActiveTenant = function() {
    	if(this.info && this.info.activeTenant)
    		return this.info.activeTenant;
    	else if(this.info && this.info.user && this.info.user.tenants && this.info.user.tenants !=null && this.info.user.tenants.length>0 && this.getActiveTenantCode()!=null){
    		for (var i = 0; i < this.info.user.tenants.length; i++) {
				if(this.info.user.tenants[i].tenantcode == this.getActiveTenantCode()){
					this.info.activeTenant = this.info.user.tenants[i]; 
					return this.info.activeTenant;
					break;
				}
			}
    	}
    	else
    		return null;
    };
    
    infoService.isCsiTenant = function(){
    	//Helpers.util.has(info.getActiveTenant(), "bundles.zeppelin") &&  info.getActiveTenant().bundles.zeppelin!="" )
    	if(this.info && Helpers.util.has(this.info, "activeTenant.bundles.zeppelin") &&  this.info.activeTenant.bundles.zeppelin!=""){
    		return true;
    	}
    	else{
    		return false;
    	}
    };
    
    infoService.isOwner = function(tenantCode){
    	var result  = false;
    	if(tenantCode){
    		for (var int = 0; int < this.info.user.tenants.length; int++) {
				if(this.info.user.tenants[int].tenantcode == tenantCode){
					result = true;
					break;
				}
			}
    		//return infoService.getTenantCode() == tenantCode;
    	}
    	return result;
    };
    
    infoService.isAuthorized = function(operation){
    	var authorized = false;
    	if(this.info && this.info!=null && this.info.user && this.info.user!=null && this.info.user.permissions && this.info.user.permissions!=null ){
    		var permissions = this.info.user.permissions;
    		var base_path  = Constants.RBAC_BASE_PERMISSION_PATH;     		

    		var operationSplitted = operation.split("/");
    		//console.log("operation",operation);
    		var operationComplete = base_path;
    		operationLoop:
    		for (var counterOperation = 0; counterOperation < operationSplitted.length; counterOperation++) {
    			operationComplete = operationComplete + "/" + operationSplitted[counterOperation];
    			//console.log("operationComplete", operationComplete);
    			for (var counterPermission = 0; counterPermission < permissions.length; counterPermission++) {
    				if(operationSplitted[counterOperation] == "*"){
    					if(permissions[counterPermission].lastIndexOf(operationComplete.substring(0, operationComplete.length-2), 0) === 0){
    						authorized = true;
    						break operationLoop;
    					};	
    				}			// start with
    				else{
    					if(permissions[counterPermission] == operationComplete){
    						authorized = true;
    						break operationLoop;
    					};
    				}
    			};
    		}
    		//console.log("operation " + operation + "authorized",authorized);
    		
    	}
    	return authorized;
    	
    };
    
    infoService.setStoreToken = function(storeToken){
    	this.storeToken = storeToken;
    };
    
    infoService.getStoreToken = function(){
    	return this.storeToken;
    };
    
    infoUser=infoService;
    return infoService;
});


/*

app.factory('info',  function() {
    var info = {};
    var infoService = {};
    
    infoService.getInfo = function() {
        return info;
    };

    infoService.setInfo = function(info) {
    	console.log("info.setInfo info ", info);
        this.info = info;
    };
    
    infoService.getTenantCode = function(){
    	console.log("info.getTenantCode info ", this.info);

    	return this.info.tenantCode;
    };
    
    infoService.isOwner = function(tenantCode){
    	console.log("info.isOwner tenantCode", tenantCode);
    	console.log("info.isOwner infoService", this.infoService);
    	console.log("info.isOwner infoService.getTenantCode()", this.infoService.getTenantCode());
    	if(tenantCode)
    		return this.infoService.getTenantCode() == tenantCode;
    	return false;
    };

    return infoService;
});
*/
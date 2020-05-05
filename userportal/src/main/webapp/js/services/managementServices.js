/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */

//appServices.factory('fabricAPImanagement', function($http, $q, info) {
//
//	var fabricAPI = {};
//
//	fabricAPI.getInfo = function() {
//		return $http({
//			method : 'JSONP',
//			url : Constants.API_INFO_URL + '?callback=JSON_CALLBACK'
//		});
//	};
//
//	fabricAPI.getDatasets = function(tenant_code) {
//		return $http({
//			method : 'JSONP',
//			url : Constants.API_MANAGEMENT_DATASET_LIST_URL + tenant_code + '?callback=JSON_CALLBACK'
//		});
//	};
//	
//	fabricAPI.getDataset = function(tenant_code, dataset_id) {
//		
//		var deferred = $q.defer();
//		
//		fabricAPI.getInfo().success(function(infoData){
//			var visible= "?visibleFrom=sandbox";
//			var tenantForRequest = "";
//			var streamsUrl = Constants.API_MANAGEMENT_DATASET_LIST_URL + tenant_code + '/' + dataset_id + '/';
//			
//			if(infoData.user.tenantsTokens != undefined){
//				angular.forEach(info.info.user.tenantsTokens, function(value, key) {
//					tenantForRequest += key + "|";
//					console.log("tenantForRequest", tenantForRequest);
//				});
//				
//				console.log('tokenForRequest in getStreamDataMultiToken', tenantForRequest);
//				visible = "?visibleFrom=" + tenantForRequest.substr(0, tenantForRequest.length - 1);	
//			} else if(infoData.user.activeTenant != undefined)
//				visible = "?visibleFrom=" + infoData.user.activeTenant;		
//			
//			console.log("getDataset", streamsUrl + visible + '&callback=JSON_CALLBACK');
//			return $http({
//				method : 'JSONP',
//				url : streamsUrl + visible + '&callback=JSON_CALLBACK'
//			}).success(function(responseData) {
//				deferred.resolve(responseData);
//			}).error(function(responseData, responseStatus) {
//				resultData = {status: "ko - "+responseStatus, data: responseData};
//				deferred.reject(resultData);
//			});			
//		});
//		
//		return deferred.promise;
//	};
//	
////	fabricAPI.requestUnistallDataset = function(tenant, idDataset){
////		var deferred = $q.defer();
////		var resultData = null;
////		
////		var requestUnistallURL = Constants.API_MANAGEMENT_DATASET_REQUEST_UNISTALL_URL + tenant + '/' + idDataset + '/?callback=JSON_CALLBACK';
////		
////		$http.delete(requestUnistallURL, {}).success(function(responseData) {
////			console.log("deleteDataset - response OK", responseData);
////			resultData = {status: "OK - ", data: responseData};
////			deferred.resolve(resultData);
////		}).error(function(responseData, responseStatus) {
////			console.log("deleteDataset - response KO", responseData);
////			resultData = {status: "KO - "+responseStatus, data: responseData};
////			deferred.reject(resultData);
////		});
////
////		console.log("deleteDataset - deferred", deferred);
////		return deferred.promise;
////	};
//
//	fabricAPI.deleteDataset = function(tenant_code, dataset_id, dataset_version) {
//		var deferred = $q.defer();
//		var resultData = null;
//		
//		//var deleteURL = Constants.API_MANAGEMENT_DATASET_DELETE_URL + tenant_code + '/' + dataset_id + '/' + dataset_version + '/?callback=JSON_CALLBACK';
//		var deleteURL = Constants.API_MANAGEMENT_DATASET_DELETE_URL + tenant_code + '/' + dataset_id + '/?callback=JSON_CALLBACK';
//
//		console.log("deleteDataset", deleteURL);
//		$http.delete(deleteURL, {}).success(function(responseData) {
//			console.log("deleteDataset - response OK", responseData);
//			resultData = {status: "ok", data: responseData};
//			deferred.resolve(resultData);
//		}).error(function(responseData, responseStatus) {
//			console.log("deleteDataset - response KO", responseData);
//			resultData = {status: "ko - "+responseStatus, data: responseData};
//			deferred.reject(resultData);
//		});
//
//		console.log("deleteDataset - deferred", deferred);
//		return deferred.promise;
//	};
//
//	fabricAPI.createDataset = function(tenant_code, dataset) {
//		var deferred = $q.defer();
//		var resultData = null;
//		console.debug("Dataset", dataset);
//		$http.post(Constants.API_MANAGEMENT_DATASET_URL + tenant_code + '/', dataset).success(function(responseData) {
//			resultData = {status: "ok", data: responseData};
//			deferred.resolve(resultData);
//		}).error(function(responseData, responseStatus) {
//			resultData = {status: "ko - "+responseStatus, data: responseData};
//			deferred.reject(resultData);
//		});
//		return deferred.promise;
//	};
//	
//	fabricAPI.importDatabase = function(importConfig) {
//		var url = Constants.API_MANAGEMENT_DATASET_IMPORT_DATABASE_URL + '?callback=JSON_CALLBACK';
//		url += "&dbType="+ importConfig.dbType;
//		url += "&jdbc_dbname="+ importConfig.jdbc_dbname;
//		url += "&jdbc_hostname="+ importConfig.jdbc_hostname;
//		url += "&jdbc_username="+ importConfig.jdbc_username;
//		url += "&jdbc_password="+ importConfig.jdbc_password;
//		url += "&sourceType="+ importConfig.sourceType;
//			
//		return $http({
//			method : 'JSONP',
//			url : url
//		});
//	};
//	
//	
//
//	fabricAPI.updateDataset = function(tenant_code, dataset_id, dataset) {
//		var deferred = $q.defer();
//		var resultData = null;
//
//		$http.put(Constants.API_MANAGEMENT_DATASET_LIST_URL+ tenant_code + '/' + dataset_id, dataset).success(function(responseData) {
//			resultData = {status: "ok", data: responseData};
//			deferred.resolve(resultData);
//		}).error(function(responseData, responseStatus) {
//			resultData = {status: "ko - "+responseStatus, data: responseData};
//			deferred.reject(resultData);
//		});
//		return deferred.promise;
//	};
//	
//
//	fabricAPI.loadDataStatistics = function() {
//		return $http({
//			method : 'JSONP',
//			url : Constants.API_PROXY_DATA_STATISTICS_URL +'getLatest/?callback=JSON_CALLBACK'
//		});
//	};
//	
//	fabricAPI.getDataset = function(tenant_code, dataset_id) {
//		
//		var deferred = $q.defer();
//		
//		fabricAPI.getInfo().success(function(infoData){
//			var visible= "?visibleFrom=sandbox";
//			var tenantForRequest = "";
//			var streamsUrl = Constants.API_MANAGEMENT_DATASET_LIST_URL + tenant_code + '/' + dataset_id + '/';
//			
//			if(infoData.user.tenantsTokens != undefined){
//				angular.forEach(info.info.user.tenantsTokens, function(value, key) {
//					tenantForRequest += key + "|";
//					console.log("tenantForRequest", tenantForRequest);
//				});
//				
//				console.log('tokenForRequest in getStreamDataMultiToken', tenantForRequest);
//				visible = "?visibleFrom=" + tenantForRequest.substr(0, tenantForRequest.length - 1);	
//			} else if(infoData.user.activeTenant != undefined)
//				visible = "?visibleFrom=" + infoData.user.activeTenant;		
//			
//			console.log("getDataset", streamsUrl + visible + '&callback=JSON_CALLBACK');
//			return $http({
//				method : 'JSONP',
//				url : streamsUrl + visible + '&callback=JSON_CALLBACK'
//			}).success(function(responseData) {
//				deferred.resolve(responseData);
//			}).error(function(responseData, responseStatus) {
//				resultData = {status: "ko - "+responseStatus, data: responseData};
//				deferred.reject(resultData);
//			});			
//		});
//		
//		return deferred.promise;
//	};
//	
//	fabricAPI.loadStreamDetail = function(tenant_code, virtualentity_code, stream_code){
//		
//		var deferred = $q.defer();
//		
//		fabricAPI.getInfo().success(function(infoData){
//			tenantForRequest = "";
//			if(infoData.user.tenantsTokens != undefined){
//				angular.forEach(info.info.user.tenantsTokens, function(value, key) {
//					tenantForRequest += key + "|";
//					console.log("tenantForRequest", tenantForRequest);
//				});
//				
//				console.log('tokenForRequest in getStreamDataMultiToken', tenantForRequest);
//				visible = "?visibleFrom=" + tenantForRequest.substr(0, tenantForRequest.length - 1);	
//			} else if(infoData.user.activeTenant != undefined)
//				visible = "?visibleFrom=" + infoData.user.activeTenant;		
//			
//			var URLBaseQuery = Constants.API_MANAGEMENT_DATASET_LIST_URL + tenant_code + '/' + virtualentity_code + '/' + stream_code + visible;
//			console.debug("dataDiscovery.loadStreamDetail URL : ",URLBaseQuery);
//			return $http({
//				method : 'GET',
//				url:URLBaseQuery
//			}).success(function(responseData) {
//				deferred.resolve(responseData);
//			}).error(function(responseData, responseStatus) {
//				resultData = {status: "ko - "+responseStatus, data: responseData};
//				deferred.reject(resultData);
//			});			
//		});
//		
//		return deferred.promise;
//	};
//	
//	
//	return fabricAPI;
//});



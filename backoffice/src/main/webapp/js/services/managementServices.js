/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

appServices.factory('fabricAPImanagement', function($http, $q) {

	var fabricAPI = {};

	fabricAPI.getDatasets = function(tenant_code) {
		return $http({
			method : 'JSONP',
			url : Constants.API_MANAGEMENT_DATASET_LIST_URL + tenant_code + '?callback=JSON_CALLBACK'
		});
	};

	fabricAPI.getDataset = function(tenant_code, dataset_id) {
		return $http({
			method : 'JSONP',
			url : Constants.API_MANAGEMENT_DATASET_URL+ tenant_code + '/' + dataset_id + '/?callback=JSON_CALLBACK'
		});
	};



	fabricAPI.createDataset = function(tenant_code, dataset) {
		var deferred = $q.defer();
		var resultData = null;
		console.debug("Dataset", dataset);
		$http.post(Constants.API_MANAGEMENT_DATASET_URL + tenant_code + '/', dataset).success(function(responseData) {
			resultData = {status: "ok", data: responseData};
			deferred.resolve(resultData);
		}).error(function(responseData, responseStatus) {
			resultData = {status: "ko - "+responseStatus, data: responseData};
			deferred.reject(resultData);
		});
		return deferred.promise;
	};

	fabricAPI.updateDataset = function(tenant_code, dataset_id, dataset) {
		var deferred = $q.defer();
		var resultData = null;

		$http.put(Constants.API_MANAGEMENT_DATASET_URL+ tenant_code + '/' + dataset_id, dataset).success(function(responseData) {
			resultData = {status: "ok", data: responseData};
			deferred.resolve(resultData);
		}).error(function(responseData, responseStatus) {
			resultData = {status: "ko - "+responseStatus, data: responseData};
			deferred.reject(resultData);
		});
		return deferred.promise;
	};
	
	fabricAPI.loadDataStatistics = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_PROXY_DATA_STATISTICS_URL +'getLatest/?callback=JSON_CALLBACK'
		});
	};
	
	
	return fabricAPI;
});



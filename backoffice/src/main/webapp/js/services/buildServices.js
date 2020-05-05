/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */

appServices.factory('fabricBuildService',["$http","$q","info", function($http, $q,info) {

	var fabricBuild = {};
	
	function appendTransform(defaults, transform) {

		  // We can't guarantee that the default transformation is an array
		  defaults = angular.isArray(defaults) ? defaults : [defaults];

		  // Append the new transformation to the defaults
		  return defaults.concat(transform);
	}

	fabricBuild.execAction = function(operations) {
		console.log("execAction - operations", operations);
		
		return $http({
			method : 'POST',
			data:operations,
			url : Constants.API_DEPLOY_PROXY_URL
		});
	};

	fabricBuild.getLogs = function(urlParams) {
		return $http({
			method : 'GET',
			url : Constants.API_FABRIC_PROXY_URL + urlParams,
			transformResponse: function(value) {return value;}
		});
	};

	return fabricBuild;
}]);


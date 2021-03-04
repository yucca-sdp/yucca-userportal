/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

//20171023 - Nuova js per chiamata alle nuove url delle API

appServices.factory('adminAPIservice', [ "$http", "$q", "info", function($http, $q, info) {

	var adminAPI = {};

	adminAPI.loadTenants = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_TENANTS_URL + '?callback=JSON_CALLBACK'
		});
	};
	
	
	
	
	adminAPI.loadOrganizations = function() {
		return $http({method : 'JSONP',
			url : Constants.API_ADMIN_ORGANIZATIONS_URL + '/' + '?ecosystemCode=SDNET&callback=JSON_CALLBACK'
		});
	};	
	
	adminAPI.loadDomains = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DOMAINS_URL + '/?ecosystemCode=SDNET&callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadSubdomains = function(domain) {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_SUBDOMAINS_URL + '/?domainCode=' + domain + '&callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadTags = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_TAGS_URL + '/?ecosystemCode=SDNET&callback=JSON_CALLBACK'
		});
	};

	
	adminAPI.loadTenantTypes = function() {
		return $http({method : 'JSONP',
			url : Constants.API_ADMIN_TENANTTYPES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};	
	
	adminAPI.createTenant = function(tenant) {
		var deferred = $q.defer();
		var resultData = null;
		console.debug("Tenant", tenant);
		return $http.post(Constants.API_ADMIN_TENANTS_URL , tenant);
	};
	
	adminAPI.execAction = function(operations,tenantCode) {
		console.log("execAction - operations", operations,tenantCode);
		
		return $http({
			method : 'PUT',
			data:operations,
			url : Constants.API_ADMIN_TENANTS_URL+"/"+tenantCode+"/action"
		});
	};

	adminAPI.loadSOCategories = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_SO_CATEGORIES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadSOTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_SO_TYPES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadDomains = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DOMAINS_URL + '/' + '?ecosystemCode=SDNET&callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadSubDomains = function(domain) {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_SUBDOMAINS_URL + '/' + '?domainCode=' + domain + '&callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadTags = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_TAGS_URL + '/' + '?ecosystemCode=SDNET&callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadPhenomenons = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_PHENOMENONS_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadMeasureUnits = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_MEASURE_UNITS_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadDataTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DATA_TYPES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadDatasetSubtypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DATASET_SUBTYPES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadDatasetTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DATASET_TYPES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadEcosystems = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_ECOSYSTEMS_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadExposureTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_EXPOSURE_TYPES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadLicenses = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_LICENSES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadLocationTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_LOCATION_TYPES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};
	

	adminAPI.loadSupplyTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_SUPPLY_TYPES_URL + '/' + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.getVirtualentity = function(tenant_code, virtualentity_code) {
		return $http({
			method : 'JSONP',
			url : Constants.API_SERVICES_VIRTUALENTITY_URL + tenant_code + '/' + virtualentity_code + '/' + '?callback=JSON_CALLBACK'
		});
	};
	
	adminAPI.loadStreams = function() {
		console.log("loadStreams", Constants.API_ADMIN_STREAMS_URL );
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_STREAMS_URL + '?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadDatasets = function(tenantcode) {
		console.log("loadDatasets", Constants.API_ADMIN_DATASETS_URL );
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DATASETS_URL + '/tenantCode=' + tenantcode + '?callback=JSON_CALLBACK'
		});
		
	};
	
	adminAPI.loadGroups = function(tenant,organizationCode) {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DATASOURCEGROUPS_URL.replace(new RegExp('{organizationCode}', 'gi'), organizationCode) + "?tenantCodeManager=" + tenant+ "&callback=JSON_CALLBACK"
		});
	};
	
	adminAPI.loadDatasetsByGroups = function(groupId,groupVersion) {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DATASETS_BY_GROUPS_URL.replace(new RegExp('{groupid}', 'gi'), groupId).replace(new RegExp('{groupVersion}', 'gi'), groupVersion) + "?callback=JSON_CALLBACK"
		});
	};


//	adminAPI.loadDatasets = function(tenantcode) {
//		console.log("loadDatasets", Constants.API_ADMIN_DATASETS_URL );
//		var url  = Constants.API_ADMIN_DATASETS_URL + '/?slim=true&callback=JSON_CALLBACK';
//		if(typeof tenantcode != 'undefined' && tenantcode!=null)
//			url += '&tenantcode='+tenantcode;
//		return $http({
//			method : 'JSONP',
//			url : url
//		});
//	};
	

	adminAPI.uninstallDataset = function(dataset) {
		var urlWithParam = Constants.API_ADMIN_DATASETS_URL + '/' + dataset.iddataset;
		return $http.delete(urlWithParam, dataset);
	};

	
	adminAPI.deleteDataFromDataset = function(dataset) {
		var urlWithParam = Constants.API_ADMIN_DATASETS_URL + '/' + dataset.iddataset + '/deleteData';
		return $http.delete(urlWithParam, dataset);
	};
	
	adminAPI.loadStream = function(idstream) {
		var urlWithParam = Constants.API_ADMIN_STREAM_URL + '/' +idstream+ '/?callback=JSON_CALLBACK'; 
		return $http({
			method : 'JSONP',
			url : urlWithParam
		});
	};
	
	adminAPI.execStreamAction = function(operations,idStream) {
		console.log("execAction - operations", operations,idStream);
		
		return $http({
			method : 'PUT',
			data:operations,
			url : Constants.API_ADMIN_STREAMS_URL+"/"+idStream+"/action"
		});
	};

	adminAPI.updateStreamStatus = function(idStream, idStatus) {
		console.log("execAction - idStream, idStatus", idStream,idStatus);
		return $http({
			method : 'PUT',
			url : Constants.API_ADMIN_STREAMS_URL+"/"+idStream+"/status/"+ idStatus
		});
	};
	

	
	
	adminAPI.loadTenantInstallationMail = function(tenant_code) {
		var urlCreatiomail = Constants.API_ADMIN_TENANT_MAIL_URL +"/"+ tenant_code + '?callback=JSON_CALLBACK';
 		return $http({
			method : 'JSONP',
			url : urlCreatiomail
		});
	};
	

	adminAPI.updateTenantStatus = function(tenantcode, idStatus) {
		console.log("execAction - tenantcode, idStatus", tenantcode,idStatus);
		return $http({
			method : 'PUT',
			url : Constants.API_ADMIN_TENANTS_URL+"/"+tenantcode+"/status/"+ idStatus
		});
	};
	
	adminAPI.updateDatasetHiveparams = function(idDataset,version,request) {
		console.log("updateDataset", request);
		return $http({
			method : 'PUT',
			data:request,
			url : Constants.API_ADMIN_DATASETS_URL+"/"+idDataset+"/version/"+ version+"/hiveparams"
		});
	};
	
	adminAPI.updateDatasets = function(request) {
		console.log("updateDatasets", request);
		return $http({
			method : 'PUT',
			data:request,
			url : Constants.API_ADMIN_DATASETS_URL+"/hiveparams"
		});
	};
	
	
	adminAPI.importMetadata = function(ImportMetadataDatasetRequest,organizationCode) {
		var urlWithParam = Constants.API_ADMIN_ORGANIZATIONS_IMPORT_URL + "/" + organizationCode + "/datasets/importMetadata"; 
		return $http.post(urlWithParam, ImportMetadataDatasetRequest);


	};
	
	adminAPI.createDataset = function(organizationCode, dataset) {
		var urlWithParam = Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), organizationCode);
		return $http.post(urlWithParam, dataset);
	};
	
	adminAPI.updateDataset = function(organizationCode, dataset) {
		console.log("updateDataset", organizationCode, dataset);
		var urlWithParam = Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), organizationCode) + '/' + dataset.iddataset;
		return $http.put(urlWithParam,dataset);
	};
	

	adminAPI.updateStreamLight = function(organizationCode, soCode, stream) {
		console.log("stream",stream);
		var urlWithParam = Constants.API_ADMIN_STREAM_UPDATE_URL.replace(new RegExp('{organizationCode}', 'gi'), organizationCode).replace(new RegExp('{soCode}', 'gi'), soCode) + '/' + stream.idstream + '/light';
		return $http.put(urlWithParam,stream);
	};
	
	adminAPI.callOoziePromotion = function(actionOozierequest) {
		return $http.post(Constants.API_ADMIN_ACTION_ON_OOZIE_URL , actionOozierequest);
	};
	
	adminAPI.callOozieInfo = function(oozieProcessId) {
		//var url = Constants.API_ADMIN_INFO_ON_OOZIE_URL.replace(new RegExp('{oozieProcessId}', 'gi'), oozieProcessId);
		
		var url = Constants.API_ADMIN_INFO_ON_OOZIE_URL +"/"+ oozieProcessId;
		
		console.log("oozieInfo-url",url);
		return $http.get(url);
		//return $http({method : 'JSONP',
		//	url : url+ '?callback=JSON_CALLBACK'
		
		//});
	};

	
	adminAPI.loadDataset = function(datasetCode) {
		console.log("admin-dscode",datasetCode);
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DATASETS_URL + "/datasetCode="+ datasetCode + "?onlyInstalled=false&callback=JSON_CALLBACK"
		});
	};
	
	
	return adminAPI;
} ]);

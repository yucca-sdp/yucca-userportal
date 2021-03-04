/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

appServices.factory('adminAPIservice', [ "$http", "$upload", "$q", "info", function($http, $upload, $q, info) {

	var adminAPI = {};

	adminAPI.loadSOCategories = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_SO_CATEGORIES_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadSOTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_SO_TYPES_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadDomains = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DOMAINS_URL + '/?ecosystemCode=SDNET&callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadSubDomains = function(domain) {
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

	adminAPI.loadPhenomenons = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_PHENOMENONS_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadMeasureUnits = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_MEASURE_UNITS_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadDataTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DATA_TYPES_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadDatasetSubtypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DATASET_SUBTYPES_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadDatasetTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_DATASET_TYPES_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadEcosystems = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_ECOSYSTEMS_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadExposureTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_EXPOSURE_TYPES_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadLicenses = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_LICENSES_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadLocationTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_LOCATION_TYPES_URL + '/?callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadOrganizations = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_ORGANIZATIONS_URL + '/?ecosystemCode=SDNET&callback=JSON_CALLBACK'
		});
	};

	adminAPI.loadSupplyTypes = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_SUPPLY_TYPES_URL + '/?callback=JSON_CALLBACK'
		});
	};


	
	/**
	 * TENANTS
	 */
	adminAPI.loadTenants = function() {
		return $http({
			method : 'JSONP',
			url : Constants.API_ADMIN_TENANTS_URL + '?callback=JSON_CALLBACK'
		});
	};
	
	adminAPI.createTenant = function(installationTenantRequest) {
		var urlWithParam = Constants.API_ADMIN_TENANTS_URL;
		return $http.post(urlWithParam, installationTenantRequest);
	};
	
	/**
	 * SMART OBJECTS
	 */
	adminAPI.loadSmartobjectsOfOrganization = function(activeTenant) {
		var urlWithParam = Constants.API_ADMIN_SMARTOBJECTS_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/?callback=JSON_CALLBACK'; 
		return $http({
			method : 'JSONP',
			url : urlWithParam
		});
	};

	adminAPI.loadSmartobjects = function(activeTenant) {
		var urlWithParam = Constants.API_ADMIN_SMARTOBJECTS_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/?tenantCode='+activeTenant.tenantcode+'&callback=JSON_CALLBACK'; 
		return $http({
			method : 'JSONP',
			url : urlWithParam
		});
	};

	adminAPI.loadSmartobject = function(activeTenant, soode) {
		var urlWithParam = Constants.API_ADMIN_SMARTOBJECTS_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/' +soode + '/?callback=JSON_CALLBACK'; 
		return $http({
			method : 'JSONP',
			url : urlWithParam
		});
	};
	
	adminAPI.createSmartobject = function(activeTenant, so) {
		var urlWithParam = Constants.API_ADMIN_SMARTOBJECTS_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode);
		return $http.post(urlWithParam, so);
	};

	adminAPI.updateSmartobject = function(activeTenant, so) {
		var urlWithParam = Constants.API_ADMIN_SMARTOBJECTS_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/' +so.socode;
		return $http.put(urlWithParam, so);
	};

	
	/**
	 * STREAMS
	 */
	adminAPI.loadStreams = function(activeTenant, tenantCodeManager, includeShared) {
		var urlWithParam = Constants.API_ADMIN_STREAM_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/?tenantCodeManager='+activeTenant.tenantcode;//+'&callback=JSON_CALLBACK'; 
		if(tenantCodeManager && tenantCodeManager!=null && tenantCodeManager!= "")
			urlWithParam += "&tenantCodeManager" + tenantCodeManager;
		if(includeShared && includeShared!=null && includeShared!= "")
			urlWithParam += "&includeShared=" + includeShared;
		return $http({
			method : 'GET',
			url : urlWithParam
		});
	};
	
	adminAPI.loadStream = function(activeTenant, idstream) {
		var urlWithParam = Constants.API_ADMIN_STREAM_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/' +idstream+ '/?callback=JSON_CALLBACK'; 
		return $http({
			method : 'JSONP',
			url : urlWithParam
		});
	};
	

	adminAPI.createStream = function(activeTenant, soCode, stream) {
		var urlWithParam = Constants.API_ADMIN_STREAM_UPDATE_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode).replace(new RegExp('{soCode}', 'gi'), soCode);
		return $http.post(urlWithParam, stream);
	};
	
	adminAPI.updateStream = function(activeTenant, soCode, stream) {
		var urlWithParam = Constants.API_ADMIN_STREAM_UPDATE_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode).replace(new RegExp('{soCode}', 'gi'), soCode) + '/' + stream.idstream;
		return $http.put(urlWithParam,stream);
	};
	
	
	adminAPI.lifecycleStream = function(action, stream,activeTenant) {
		var lifecyclerequest = {"action":action};
		var urlWithParam = Constants.API_ADMIN_STREAM_LIFECYCLE_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode).replace(new RegExp('{soCode}', 'gi'), stream.smartobject.socode).replace(new RegExp('{idStream}', 'gi'), stream.idstream);
		return $http.put(urlWithParam, lifecyclerequest);
		
	};
	
	/**
	 * DATASETS
	 */
	adminAPI.loadDatasets = function(activeTenant, tenantCodeManager, includeShared) {
		var urlWithParam = Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/?';//+'&callback=JSON_CALLBACK'; 
		if(activeTenant.tenantcode && activeTenant.tenantcode!=null && activeTenant.tenantcode!= "")
			urlWithParam += "&tenantCodeManager="+activeTenant.tenantcode;
		if(includeShared && includeShared!=null && includeShared!= "")
			urlWithParam += "&includeShared=" + includeShared;
		return $http({
			method : 'GET',
			url : urlWithParam
		});
	};
	
//	adminAPI.loadDataset = function(activeTenant, iddataset) {
//		var urlWithParam = Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/' +iddataset+ '/?callback=JSON_CALLBACK'; 
//		return $http({
//			method : 'JSONP',
//			url : urlWithParam
//		});
//	};

	adminAPI.loadDatasource = function(datasourceType, activeTenant, iddatasource) {
		var baseUrl  = datasourceType == Constants.DATASOURCE_TYPE_STREAM? Constants.API_ADMIN_STREAM_URL: Constants.API_ADMIN_DATASET_URL;
		var urlWithParam = baseUrl.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/' +iddatasource+ '/?callback=JSON_CALLBACK'; 
		return $http({
			method : 'JSONP',
			url : urlWithParam
		});
	};

	
	adminAPI.createDataset = function(activeTenant, dataset) {
		var urlWithParam = Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode);
		return $http.post(urlWithParam, dataset);
	};
	
	adminAPI.updateDataset = function(activeTenant, dataset) {
		var urlWithParam = Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/' + dataset.iddataset;
		return $http.put(urlWithParam,dataset);
	};
	
	adminAPI.uninstallDataset = function(activeTenant, dataset) {
		var urlWithParam = Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/' + dataset.iddataset;
		return $http.delete(urlWithParam, dataset);
	};
	

	
	adminAPI.addDataToDataset = function(activeTenant, dataset, csvInfo,componentInfoRequests) {
		console.log("addDataToDataset",activeTenant, dataset, csvInfo,componentInfoRequests);
		var urlWithParam = Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/' +dataset.iddataset+ '/addData'; 

		var postData = {tenantCodeManager: activeTenant.tenantcode, 
						skipFirstRow: csvInfo.skipFirstRow,
						encoding: csvInfo.fileEncoding,
						csvSeparator: csvInfo.separator,
						componentInfoRequests: componentInfoRequests
					   };
		
		return $upload.upload({
			url: urlWithParam,
			method: 'POST',
			data: postData,
			file: csvInfo.selectedFile
		});
		
		
	};
	adminAPI.clearDataset = function(activeTenant, dataset) {
		console.log("clearDataset",activeTenant, dataset);
		var urlWithParam = Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + 
			'/' +dataset.iddataset + '/deleteData?tenantCodeManager='+activeTenant.tenantcode; 
		return $http.delete(urlWithParam, dataset);
	};

	
	adminAPI.updateHiveExternalTable = function(activeTenant, dataset, tableName) {
		console.log("updateHiveExternalTable",activeTenant, dataset, tableName);
		var urlWithParam = Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/' +dataset.iddataset+ '/hiveExternalTable'; 

		//var postData = {tenantCodeManager: activeTenant.tenantcode, tableName: tableName};

		return $http.post(urlWithParam, tableName);
	};
	
	adminAPI.listHdfsFiles = function(activeTenant, dataset) {
		var urlWithParam = Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/' +dataset.iddataset+ '/hdfsFiles'; 
		return $http({
			method : 'GET',
			url : urlWithParam
		});
	};
	
	adminAPI.listRangerPolicyGroup = function(activeTenant, dataset) {
		var urlWithParam = Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/' +dataset.iddataset+ '/rangerpolicy'; 
		return $http({
			method : 'GET',
			url : urlWithParam
		});
	};
	
	adminAPI.createRangerPolicy = function(activeTenant, dataset) {
		var urlWithParam = Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/' +dataset.iddataset+ '/createrangerpolicy'; 
		return $http({
			method : 'GET',
			url : urlWithParam
		});
	};
	
	adminAPI.updateRangerPolicy = function(activeTenant, dataset) {
		var urlWithParam = Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/' +dataset.iddataset+ '/updaterangerpolicy'; 
		return $http({
			method : 'GET',
			url : urlWithParam
		});
	};
	
	adminAPI.forceDownloadCsv = function(activeTenant, dataset) {
		var urlWithParam = Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/' +dataset.iddataset+ '/forceDownloadCsv'; 
		return $http({
			method : 'GET',
			url : urlWithParam
		});
	};
	
	
	adminAPI.importMetadata = function(activeTenant,ImportMetadataDatasetRequest) {
		var urlWithParam = Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/importMetadata'; 
		return $http.post(urlWithParam, ImportMetadataDatasetRequest);

		
//		return $upload.upload({
//			url: urlWithParam,
//			method: 'POST',
//			ImportMetadataDatasetRequest: importConfig,
//			file: importConfig.sqlSourcefile
//
//		});
		
	};
	
	adminAPI.validateSiddhiQuery = function(queryToValidate) {
		console.log("validateSiddhiQuery", queryToValidate)
		var urlWithParam = Constants.API_ADMIN_VALIDATION_INTERNAL_STREAM_QUERY_URL;
		console.log("validateSiddhiQuery", urlWithParam);
		return $http.post(urlWithParam, queryToValidate);
	};
	
	/*DATASET GROUPS*/
	adminAPI.loadDatasetGroups = function(activeTenant) {
		var urlWithParam = Constants.API_ADMIN_DATASET_GROUP_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/?'; 
		if(activeTenant.tenantcode && activeTenant.tenantcode!=null && activeTenant.tenantcode!= "")
			urlWithParam += "tenantCodeManager="+activeTenant.tenantcode;
		return $http({
			method : 'GET',
			url : urlWithParam
		});
	};
	
	adminAPI.createGroup = function(activeTenant, group) {
		var urlWithParam = Constants.API_ADMIN_DATASET_GROUP_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode); 
		return $http.post(urlWithParam, group);
	};
	
	adminAPI.editGroup = function(activeTenant, group) {
		var urlWithParam = Constants.API_ADMIN_DATASET_GROUP_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode)+"/"+group.idDatasourcegroup; 
		return $http.put(urlWithParam,group);
	};
	
	
	adminAPI.deleteGroup = function(activeTenant, idDatasourceGroup) {
		var urlWithParam = Constants.API_ADMIN_DATASET_GROUP_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/' +idDatasourceGroup+ '/?'; 
		if(activeTenant.tenantcode && activeTenant.tenantcode!=null && activeTenant.tenantcode!= "")
			urlWithParam += "tenantCodeManager="+activeTenant.tenantcode;
		return $http({
			method : 'DELETE',
			url : urlWithParam
		});
	};
	
	adminAPI.actionOnGroup = function(activeTenant, idDatasourceGroup,action) {
		var urlWithParam = Constants.API_ADMIN_DATASET_GROUP_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/' +idDatasourceGroup+ '/action/?'; 
		if(activeTenant.tenantcode && activeTenant.tenantcode!=null && activeTenant.tenantcode!= "")
			urlWithParam += "tenantCodeManager="+activeTenant.tenantcode;
		return $http.put(urlWithParam,action);
	};
	
//	adminAPI.newVersionGroup = function(activeTenant, idDatasourceGroup,action) {
//		var urlWithParam = Constants.API_ADMIN_DATASET_GROUP_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/' +idDatasourceGroup+ '/action/?'; 
//		if(activeTenant.tenantcode && activeTenant.tenantcode!=null && activeTenant.tenantcode!= "")
//			urlWithParam += "tenantCodeManager="+activeTenant.tenantcode;
//		return $http.put(urlWithParam,action);
//	};
//	
//	adminAPI.consolidateGroup = function(activeTenant, idDatasetGroup,action) {
//		var urlWithParam = Constants.API_ADMIN_DATASET_GROUP_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/' +idDatasetGroup+ '/action/?'; 
//		if(activeTenant.tenantcode && activeTenant.tenantcode!=null && activeTenant.tenantcode!= "")
//			urlWithParam += "tenantCodeManager="+activeTenant.tenantcode;
//		return $http.put(urlWithParam,action);
//	};
//	
	adminAPI.addDatasetsToGroup = function(isStream, activeTenant, request) {
		var baseUrl = Constants.API_ADMIN_DATASET_GROUP_DATASET_URL;
		if(isStream)
			baseUrl = Constants.API_ADMIN_DATASET_GROUP_STREAM_URL;
		console.log("url",baseUrl);
		var urlWithParam = baseUrl.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/?'; 
		if(activeTenant.tenantcode && activeTenant.tenantcode!=null && activeTenant.tenantcode!= "")
		urlWithParam += "tenantCodeManager="+activeTenant.tenantcode;
		return $http.post(urlWithParam,request);
	};
	
	adminAPI.deleteDatasourcesFromGroup = function(isStream, activeTenant, request) {
		var baseUrl = Constants.API_ADMIN_DATASET_GROUP_DATASET_URL;
		if(isStream)
			baseUrl = Constants.API_ADMIN_DATASET_GROUP_STREAM_URL;
		console.log("url",baseUrl);
		var urlWithParam = baseUrl.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/?'; 
		if(activeTenant.tenantcode && activeTenant.tenantcode!=null && activeTenant.tenantcode!= "")
		urlWithParam += "tenantCodeManager="+activeTenant.tenantcode;
		return $http.put(urlWithParam,request);
	};
	
	
	
	adminAPI.loadDatasetsFromGroup = function(isStream, activeTenant, groupId, groupversion) {
		var urlWithParam = Constants.API_ADMIN_DATASET_GROUP_URL.replace(new RegExp('{organizationCode}', 'gi'), activeTenant.organization.organizationcode) + '/' + groupId + '/';

		if(isStream)
			urlWithParam += 'streams/?';
		else
			urlWithParam += 'datasets/?';
			
		if(activeTenant.tenantcode && activeTenant.tenantcode!=null && activeTenant.tenantcode!= "")
			urlWithParam += "&tenantCodeManager="+activeTenant.tenantcode;

		if(groupversion && groupversion!=null && groupversion!= "")
			urlWithParam += "&datasetGroupVersion="+groupversion;
		
		return $http({
			method : 'GET',
			url : urlWithParam
		});
	};
	
	adminAPI.loadDatasourceGroupType = function() {
		return $http({
			method : 'GET',
			url : Constants.API_ADMIN_DATASET_GROUP_TYPES_URL
		});
	};
	 
	return adminAPI;
} ]);

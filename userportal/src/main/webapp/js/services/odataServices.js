/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */

appServices.factory('odataAPIservice', function($http, $q,info) {

	var odataAPIservice = {};
	
	odataAPIservice.getStreamData = function(stream_code, filter, skip, top, orderby, collection) {
		if(!collection || collection == null)
			collection = 'Measures';
		//http://int-api.smartdatanet.it/odata/SmartDataOdataService.svc/ds_Provapositio_28/Measures?$format=json&$top=19&$skip=0&$orderby=time
		var streamDataUrl = Constants.API_ODATA_URL+stream_code+"/"+collection+"?$format=json";
		if(filter && filter!=null)
			streamDataUrl += '&$filter='+filter;
		if(skip && skip!=null)
			streamDataUrl += '&$skip='+skip;
		if(top && top!=null)
			streamDataUrl += '&$top='+top;
		if(orderby && orderby!=null)
			streamDataUrl += '&$orderby='+orderby;

		var user = "Bearer "+info.info.user.token;
		return $http({
			method : 'GET',
			url : streamDataUrl,
			headers: {
				'Authorization': user
				},
			withCredentials : true
		});
	}; 
	
	odataAPIservice.getStreamDataMultiToken = function(stream_code, filter, skip, top, orderby, collection, dstenantactive, dstenantsharing) {
		if(!collection || collection == null)
			collection = 'Measures';
		//http://int-api.smartdatanet.it/odata/SmartDataOdataService.svc/ds_Provapositio_28/Measures?$format=json&$top=19&$skip=0&$orderby=time
		var streamDataUrl = Constants.API_ODATA_URL+stream_code+"/"+collection+"?$format=json";
		if(filter && filter!=null)
			streamDataUrl += '&$filter='+filter;
		if(skip && skip!=null)
			streamDataUrl += '&$skip='+skip;
		if(top && top!=null)
			streamDataUrl += '&$top='+top;
		if(orderby && orderby!=null)
			streamDataUrl += '&$orderby='+orderby;
		
		var tokenForRequest = null;
		
		if(typeof info.info.user.tenantsTokens != 'undefined' && info.info.user.tenantsTokens!=null){
			angular.forEach(info.info.user.tenantsTokens, function(value, key) {
				if (dstenantactive == key)
					tokenForRequest = value;
			});
		}
		
		if (tokenForRequest == null && typeof dstenantsharing != 'undefined' && dstenantsharing!=null){
			//var dstenantsharingArr = dstenantsharing.split(',');
			//var dstenantsharingArr = dstenantsharing.tenantsharing;
			angular.forEach(info.info.user.tenantsTokens, function(value, key) {
//				angular.forEach(dstenantsharingArr, function(dstsValue, dstsKey) {
//					if (dstsValue.tenantCode == key)
//						tokenForRequest = value;
//				});
				for (var i = 0; i < dstenantsharing.length; i++) {
					if (dstenantsharing[i] == key)
						tokenForRequest = value;
				}
			});
		}
		
		if (tokenForRequest == null){
			tokenForRequest = info.info.user.token;
		}
		console.log('tokenForRequest in getStreamDataMultiToken', tokenForRequest);

		var user = "Bearer " + tokenForRequest;
		console.log('user', user);
		console.log('streamDataUrl in getStreamDataMultiToken', streamDataUrl);
		return $http({
			method : 'GET',
			url : streamDataUrl,
			headers: {
				'Authorization': user
				},
			withCredentials : true
		});
	};

	odataAPIservice.getStreamDataLastHour = function(stream_code, skip, top, orderby , collection ) {
		if(!collection || collection == null)
			collection = 'Measures';

		//http://int-api.smartdatanet.it/odata/SmartDataOdataService.svc/ds_Provapositio_28/Measures?$format=json&$top=19&$skip=0&$orderby=time
		var streamDataUrl = Constants.API_ODATA_URL+stream_code+"/"+collection+"$format=json";
		if(skip && skip!=null)
			streamDataUrl += '&$skip='+skip;
		if(top && top!=null)
			streamDataUrl += '&$top='+top;
		if(orderby && orderby!=null)
			streamDataUrl += '&$orderby='+orderby;
		
		var d = new Date();
		var sMonth = d.getUTCMonth()+1;
		if (sMonth.toString().length<2) { sMonth = "0"+sMonth;};
		var sDay = d.getUTCDate();
		if (sDay.toString().length<2) { sDay = "0"+sDay;};
		var sHour = d.getUTCHours();
		sHour=sHour-1;
		if (sHour.toString().length<2) { sHour = "0"+sHour;};
		var sMin = d.getUTCMinutes();
		if (sMin.toString().length<2) { sMin = "0"+sMin;};
		var sSec = d.getUTCSeconds();
		if (sSec.toString().length<2) { sSec = "0"+sSec;};
		 
		var sDate = d.getUTCFullYear()+"-"+sMonth+"-"+sDay+"T"+sHour+":"+sMin+":"+sSec+"+00:00";
		
		streamDataUrl += "&$filter=time ge datetimeoffset'"+sDate+"'";
		
		var user = "Bearer "+info.info.user.token;
		return $http({
			method : 'GET',
			url : streamDataUrl,
			headers: {
				'Authorization': user
				},
			withCredentials : true
		});
	};

	odataAPIservice.getMetadata  = function(stream_code) {
		// https://int-api.smartdatanet.it/api/ds_Contgreciaon_201/$metadata
		var metadataUrl = Constants.API_ODATA_URL+stream_code+"/$metadata";

		var user = "Bearer "+info.info.user.token;
		return $http({
			method : 'GET',
			url : metadataUrl,
			headers: {
				'Authorization': user
				},
			withCredentials : true
		});
	};

	odataAPIservice.getMetadataMultiToken  = function(stream_code, dstenantactive, dstenantsharing) {
		// https://int-api.smartdatanet.it/api/ds_Contgreciaon_201/$metadata
		var metadataUrl = Constants.API_ODATA_URL+stream_code+"/$metadata";
		var tokenForRequest = null;
		
		angular.forEach(info.info.user.tenantsTokens, function(value, key) {
			if (dstenantactive == key)
				tokenForRequest = value;
		});
		
		if (tokenForRequest == null){
			var dstenantsharingArr = dstenantsharing.split(',');
			angular.forEach(info.info.user.tenantsTokens, function(value, key) {
				angular.forEach(dstenantsharingArr, function(dstsValue, dstsKey) {
					if (dstsValue == key)
						tokenForRequest = value;
				});
			});
		}
		console.log('tokenForRequest in getMetadataMultiToken', tokenForRequest);
		console.log('metadataUrl in getMetadataMultiToken', metadataUrl);

		var user = "Bearer " + tokenForRequest;
		console.log('user', user);
		return $http({
			method : 'GET',
			url : metadataUrl,
			headers: {
				'Authorization': user
				},
			withCredentials : true
		});
	};
	
	
	odataAPIservice.getBinaryAttachData = function(baseUrl, binaryCode){
		//http://int-api.smartdatanet.it/odata/SmartDataOdataService.svc/Binariomerco_154/DataEntities('5625124873454fcbf9829960')/Binaries?$filter=idBinary%20eq%20%27provaDav2%27&$format=json
		var binaryUrl = Constants.API_ODATA_URL+baseUrl+"?$filter=idBinary eq '"+binaryCode+"'&$format=json";

		var user = "Bearer "+info.info.user.token;
		return $http({
			method : 'GET',
			url : binaryUrl,
			headers: {
				'Authorization': user
				},
			withCredentials : true
		});
	};
	
	odataAPIservice.loadDataStatistics = function() {
		return $http({
			method : 'GET',
			url : Constants.API_STATISTICS_URL + '?'
		});
	};
	return odataAPIservice;
});


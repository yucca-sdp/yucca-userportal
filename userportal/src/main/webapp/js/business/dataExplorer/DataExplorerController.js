/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */

appControllers.controller('DataExplorerCtrl', [ '$scope', '$routeParams', 'odataAPIservice',  'metadataapiAPIservice', '$filter', 'info', '$location', '$modal', 'localStorageService',
                                                     function($scope, $routeParams, odataAPIservice,  metadataapiAPIservice, $filter, info, $location, $modal, localStorageService) {
	$scope.tenantCode = $routeParams.tenant_code;
	$scope.datasetCode = $routeParams.entity_code;

	var getEnvirorment  = function(){
		var host = $location.host();
		var env = host.substring(0,host.indexOf("userportal.smartdatanet.it"));
		return env;
	};

	$scope.currentSidebar = 'none';
	
	$scope.metadata = null;
	//$scope.stream = null;
	$scope.errors = [];
	
	$scope.columnsForFilter = [];

	var operators_date = [{"value":"eq", "label":"=", "valueDelimiter": "", "isFunction": false, "isDate": true},
			              {"value":"ne", "label":"!=", "valueDelimiter": "", "isFunction": false, "isDate": true},
		                  {"value":"ge", "label":">=", "valueDelimiter": "", "isFunction": false, "isDate": true},
		                  {"value":"gt", "label":">", "valueDelimiter": "", "isFunction": false, "isDate": true},
			              {"value":"lt", "label":"<", "valueDelimiter": "", "isFunction": false, "isDate": true},
			              {"value":"le", "label":"<=", "valueDelimiter": "", "isFunction": false, "isDate": true}];

	var operators_number = [{"value":"eq", "label":"=", "valueDelimiter": "", "isFunction": false, "isDate": false},
			                {"value":"ne", "label":"!=", "valueDelimiter": "", "isFunction": false, "isDate": false},
		                    {"value":"ge", "label":">=", "valueDelimiter": "", "isFunction": false, "isDate": false},
		                    {"value":"gt", "label":">", "valueDelimiter": "", "isFunction": false, "isDate": false},
			                {"value":"lt", "label":"<", "valueDelimiter": "", "isFunction": false, "isDate": false},
			                {"value":"le", "label":"<=", "valueDelimiter": "", "isFunction": false, "isDate": false}];

	var operators_string = [{"value":"eq", "label":"equals", "valueDelimiter": "'", "isFunction": false, "isDate": false},
	                        {"value":"ne", "label":"not equals", "valueDelimiter": "'", "isFunction": false, "isDate": false},
	                        {"value":"startswith", "label":"start with", "valueDelimiter": "'", "isFunction": true, "isDate": false},
	                        {"value":"endswith", "label":"end with", "valueDelimiter": "'", "isFunction": true, "isDate": false},
	                        {"value":"substringof", "label":"contains", "valueDelimiter": "'", "isFunction": true, "isDate": false}];

	var operators_boolean = [{"value":"eq", "label":"=", "isFunction": false, "isDate": false}];

	var datasetType = "";
	var defaultOrderByColumn = "internalId";

	$scope.queryOdataLink = "-";
	$scope.decimalSeparator = "";
	if (localStorageService.get("downloadCSvDecimalSeparator")==null)
		$scope.decimalSeparator = 'COMMA';
	else $scope.decimalSeparator = localStorageService.get("downloadCSvDecimalSeparator");
	//$scope.decimalSeparatorSelected = 'COMMA';
	
	$scope.loadMetadata = function(){
		console.log("loadMetadata",$scope.metadata);
		if ($scope.metadata!=null){
			
			console.log("dataset.code", $scope.metadata.dataset.code);
			console.log("tenantCode", $scope.metadata.tenantCode);
			console.log("dataset.tenantsharing", $scope.metadata.tenantDelegateCodes);

			if ($scope.metadata.stream == null) {
				$scope.downloadCsvUrl = Constants.API_ODATA_URL + $scope.metadata.dataset.code + "/download/" + $scope.metadata.dataset.datasetId + "/all?decimalSeparator=";
			} else {
				$scope.downloadCsvUrl = Constants.API_ODATA_URL + $scope.metadata.dataset.code + "/download/" + $scope.metadata.dataset.datasetId + "/current?decimalSeparator=";  
			}

			
			var tenantsSharingList = "";
			if(typeof $scope.metadata.tenantDelegateCodes!= 'undefined')
				tenantsSharingList = $scope.metadata.tenantDelegateCodes.join(",");

				//	var tenantsSharingList = $scope.dataset.info.tenantssharing.tenantsharing.map(function(elem){
				//	    return elem.tenantCode;
				//	}).join(",");
			
			odataAPIservice.getMetadataMultiToken($scope.metadata.dataset.code, $scope.tenantCode, tenantsSharingList).success(function(response) {
				console.log("odataAPIservice.getMetadata - xml", response);
				var x2js = new X2JS();
				var metadataJson =  x2js.xml_str2json(response);
				console.log("odataAPIservice.getMetadata - json", metadataJson);
		
			
				if(Helpers.util.has(metadataJson, "Edmx.DataServices.Schema.EntityType")){
					var entityType = metadataJson.Edmx.DataServices.Schema.EntityType;
					if(entityType!=null && entityType.constructor === Array)
						measuresMetadata = metadataJson.Edmx.DataServices.Schema.EntityType[0];		
					else
						measuresMetadata = metadataJson.Edmx.DataServices.Schema.EntityType;		
					
					console.log("odataAPIservice.getMetadata - metadata", metadataJson);
					var entitySet = metadataJson.Edmx.DataServices.Schema.EntityContainer.EntitySet;
					
					
					if(entitySet !=null && entitySet.constructor === Array)
						datasetType = metadataJson.Edmx.DataServices.Schema.EntityContainer.EntitySet[0]._Name;
					else
						datasetType = metadataJson.Edmx.DataServices.Schema.EntityContainer.EntitySet._Name;
			
					defaultOrderByColumn = "internalId";
			
					for (var k = 0; k < measuresMetadata.Property.length; k++) {
						var prop = measuresMetadata.Property[k];
						var dataType = Helpers.odata.decodeDataType(prop["_Type"]);
						var operators = operators_number;
						switch (dataType) {
						case "string":
							operators = operators_string;					
							break;
						case "boolean":
							operators = operators_boolean;					
							break;
						case "date":
							operators = operators_date;					
							break;
						default:
							operators = operators_number;
							break;
						}
						
						if (prop["_Name"] != "internalId"){
							$scope.columnsForFilter.push({"label": prop["_Name"], "operators": operators, "dataType":dataType});
						}
						if(prop["_Name"] == "time"){
							defaultOrderByColumn = "time";
						}
						$scope.orderBy.column = defaultOrderByColumn;
					}
					
					console.log("$scope.columnsForFilter", $scope.columnsForFilter);
					$scope.queryOdataLink = "/userportal/api/proxy/odata/" + $scope.datasetCode + "/Measures?$format=json&$top=15&$orderby=time%20desc";
					$scope.queryOdataCsvLink = "/userportal/api/proxy/odata/" + $scope.datasetCode + "/Measures?$format=csv&$top=15&$orderby=time%20desc";
	
					console.log("$scope.queryOdataLink", $scope.queryOdataLink);
					console.log("$scope.queryOdataCsvLink", $scope.queryOdataCsvLink);
			
					$scope.loadData();
				}
				else{
					var error = {"message":"Cannot load metadatadata","detail":""};
					$scope.errors.push(error);
				}
			}).error(function(response) {
				console.log("loadData Error: ", response);
				$scope.showLoading = false;
		
				var detail = "";
				var error = {"message":"Cannot load metadatadata","detail":detail};
				$scope.errors.push(error);
			}); 
		} else {
			var detail = "NOT FOUND";
			console.log("loadData Error: ", detail);
			$scope.showLoading = false;
			var error = {"message":"Cannot load metadatadata","detail":detail};
			$scope.errors.push(error);
		}
	};
	
	$scope.loadDataset = function(){ 
		$scope.errors = [];
		metadataapiAPIservice.detailDataset(null, $scope.datasetCode).success(function(response) {
			console.log("loadDataset", response);
			$scope.metadata = response;
			$scope.loadMetadata();
			
		}).error(function(response) {
			console.error("loadDataset", response);
			$scope.errors.push({"message": "Cannot load dataset", "detail": "Error while loading dataset " + $scope.datasetCode});
		});

	};
	
	$scope.loadDataset();

	var dataForPage = 15;
	$scope.showLoading = true;

	$scope.totalFound = null;
	$scope.usedFilter = "-";
	$scope.dataList = [];
	$scope.columns = [];
	$scope.pagination = {"currentPage" : 1};
	//$scope.currentPage = 1;

	$scope.orderBy = {"column":"internalId", "order": "desc"};
	$scope.addFilterError = null;

	$scope.filters = [];
	
	$scope.selectPage = function() {
		$scope.loadData();
	};	
	
	

	$scope.orderResult = function(column, order) {
		console.log("orderResult",column, order);
		if(order && order!='none')
			$scope.orderBy = {"column":column, "order": order};
		else
			$scope.orderBy = {"column":defaultOrderByColumn, "order": "desc"};

		$scope.loadData();
	};	

	$scope.removeFilter = function($index){
		$scope.addFilterError = null;
		console.log("removeFilter", $index);
		$scope.filters.splice($index,1);
	};
	
	$scope.newFilter = {column:null, operator:null, value: null};
	
	$scope.addFilter = function(){
		$scope.addFilterError = null;
		if($scope.newFilter.column && $scope.newFilter.column!=null && $scope.newFilter.column.label!=null && $scope.newFilter.column.label!='' &&
			$scope.newFilter.operator!=null && $scope.newFilter.operator!=''  &&
			$scope.newFilter.value!=null && ($scope.newFilter.value==0 || $scope.newFilter.value!='')){
				$scope.filters.push({"column": $scope.newFilter.column.label, "operator": $scope.newFilter.operator, "value": $scope.newFilter.value});
				$scope.newFilter.column = null;
				$scope.newFilter.operator = null;
				$scope.newFilter.value = null;
		}
		else{
			$scope.addFilterError = "DATA_EXPLORER_FILTER_ADD_FILTER_ERROR_MISSING_FIELDS";
		}
	};
	
	$scope.loadData = function(){
		
		// call oData service to retrieve  the last 30 data
		$scope.errors = [];

		var start = ($scope.pagination.currentPage - 1) * dataForPage;
		$scope.dataList = [];
		$scope.columns = [];
		$scope.csv = [];
		
		$scope.showLoading = true;
		
		var sort = $scope.orderBy.column + "%20" + $scope.orderBy.order;
		console.log("defaultOrderByColumn", defaultOrderByColumn);
		if($scope.orderBy.order == 'none')
			sort = defaultOrderByColumn +"%20desc";
		
		console.log("loadData", $scope.datasetCode, start, dataForPage, sort, datasetType);
		
		var filterParam = null;
		$scope.usedFilter = "-";
		if($scope.filters!=null && $scope.filters.length>0){
			$scope.usedFilter = "";
			filterParam = ""; //time ge datetimeoffset'2014-12-01T07:00:00+01:00' and time lt datetimeoffset'2014-12-01T07:15:00+01:00'
			for (var j = 0; j < $scope.filters.length; j++) {
				var filter = $scope.filters[j];
				console.log("filter", filter);
				
				if(filter.operator.isDate){ // time ge datetimeoffset'2014-08-01T07:00:00+01:00'
					var d = new Date(filter.value);
					var dateToParam =  d.getFullYear() + "-"+ (d.getMonth()+1) + "-" + d.getDate() + 'T' + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() +"%2B00:00";
					filterParam += filter.column + " " + filter.operator.value + " datetimeoffset'"+ dateToParam + "'";
				}else if(filter.operator.value == "substringof"){  // filter=substringof(Name, 'urn')
					filterParam += "(" + filter.operator.value + "(" +filter.operator.valueDelimiter +  filter.value + filter.operator.valueDelimiter+ "," +filter.column  +") eq true)";
				}
				else if(filter.operator.isFunction){  
					filterParam += filter.operator.value + "(" +filter.column + "," + filter.operator.valueDelimiter +  filter.value + filter.operator.valueDelimiter+")";
				}
				else if(filter.operator.value == "eq"){
					filterParam +=  filter.operator.valueDelimiter +  filter.value + filter.operator.valueDelimiter + " " + filter.operator.value + " " +filter.column;
				}
				else{//filter= Entry_No gt 610
					filterParam += filter.column + " " + filter.operator.value + " " +filter.operator.valueDelimiter +  filter.value + filter.operator.valueDelimiter;
				}
				
				$scope.usedFilter += filter.column + " " + filter.operator.label + " " + filter.value;
				if(j < $scope.filters.length-1){
					$scope.usedFilter += "<span class=' panel-dataexplorer-topbar-separator'>-</span>";
					filterParam += " and ";
				}
			}
		}
		
		console.log("filterParam", filterParam);
		$scope.queryOdataLink = createQueryOdata($scope.datasetCode, filterParam, start, dataForPage, sort, datasetType, 'json');
		$scope.queryOdataCsvLink = createQueryOdata($scope.datasetCode, filterParam, start, dataForPage, sort, datasetType, 'csv');
		
		console.log("queryOdataLink", $scope.queryOdataLink);
		odataAPIservice.getStreamDataMultiToken($scope.datasetCode, filterParam, start, dataForPage, sort, datasetType, $scope.tenantCode, $scope.metadata.tenantDelegateCodes).success(function(response) {
			console.log("odataAPIservice.getStreamData",response, datasetType);
			$scope.totalFound = response.d.__count;
			var oDataResultList = response.d.results;
			
			$scope.showLoading = false;
			if(oDataResultList.length >0){
				var firstRow = true;
		
				for (var oDataIndex = 0; oDataIndex < oDataResultList.length; oDataIndex++) {
					var oDataResult = oDataResultList[oDataIndex];
					var data = {};
					var baseBinaryUrl = "";
					var rowCsv= [];		
					var firstRowCsv = [];
					
					if(typeof oDataResult["Binaries"] !== 'undefined' && oDataResult["Binaries"]!=null){
						baseBinaryUrl = $scope.datasetCode + "/DataEntities('"+oDataResult["internalId"]+"')/Binaries";// oDataResult["Binaries"].__deferred.uri;
					}

					for (var property in oDataResult) {
						if(property!="__metadata" && property!="Binaries" && property!="streamCode" && property!="sensor" && property!="internalId" && property!="datasetVersion" && property!="idDataset"){
							var value = oDataResult[property];
							var isBinary = false; 
							//Decimali
							var isDecimal = $scope.isDecimal(property);
							if (isDecimal && value!=null) {								
								value = value.replace(".",",");
							}
							if(value && value!=null && value.toString().lastIndexOf("/Date", 0) === 0 ){
								var d = $filter('date')(new Date(Helpers.mongo.date2millis(value)), 'dd/MM/yyyy HH:mm:ss');
								data[property] =  {"value":d, "isBinary": false};
							} else if(value && value!=null  && typeof value["idBinary"] !== 'undefined' && value["idBinary"]!=null){
								data[property] = {"value":value["idBinary"], "isBinary": true, "binaryBaseUrl": baseBinaryUrl};
								isBinary = true;
							} else
								data[property] = {"value":value, "isBinary": false};
							

						    if(firstRow){
						    	var order = 'none';
						    	
						    	var showOrderButton = $scope.totalFound<Constants.ODATA_MAX_RESULT_SORTABLE?true:false;
						    	if(isBinary)
						    		showOrderButton = false;
						    	else if(property == defaultOrderByColumn)
						    		showOrderButton = true;
						    	
						    	if($scope.orderBy.column == property)
						    		order = $scope.orderBy.order;
						    	var column = {"label":property, "order": order, "showOrderButton": showOrderButton, "showBinaryIcon": isBinary, "isSpecial":false};//, "operators": field.operators, "dataType":field.dataType};
						    	$scope.columns.push(column);
						    	firstRowCsv.push(column.label);
						    }		
						    rowCsv.push(data[property].value);						   
						}						
					}


					for (var property in oDataResult) {
						if((property!="__metadata" && property!="Binaries")  && (property=="streamCode" || property=="sensor" || property=="internalId" || property=="datasetVersion" || property=="idDataset")){
							var value = oDataResult[property];
							var isBinary = false;
							//Decimali
							var isDecimal = $scope.isDecimal(property);
							if (isDecimal && value!=null) {
								value = value.replace(".",",");
							}
							if(value && value!=null && value.toString().lastIndexOf("/Date", 0) === 0 ){
								var d = $filter('date')(new Date(Helpers.mongo.date2millis(value)), 'dd/MM/yyyy HH:mm:ss');
								data[property] =  {"value":d, "isBinary": false};
							} else if(value && value!=null  && typeof value["idBinary"] !== 'undefined' && value["idBinary"]!=null){
								data[property] = {"value":value["idBinary"], "isBinary": true, "binaryBaseUrl": baseBinaryUrl};
								isBinary = true;
							} else
								data[property] = {"value":value, "isBinary": false};
							

						    if(firstRow){
						    	var order = 'none';
						    	
						    	var showOrderButton = $scope.totalFound<Constants.ODATA_MAX_RESULT_SORTABLE?true:false;
						    	if(isBinary)
						    		showOrderButton = false;
						    	else if(property == defaultOrderByColumn)
						    		showOrderButton = true;
						    	
						    	if($scope.orderBy.column == property)
						    		order = $scope.orderBy.order;
						    	var column = {"label":property, "order": order, "showOrderButton": showOrderButton, "showBinaryIcon":isBinary, "isSpecial":true};//, "operators": field.operators, "dataType":field.dataType};
						    	$scope.columns.push(column);
						    	firstRowCsv.push(column.label);
						   
						    } 
						    rowCsv.push(data[property].value);						    
						}					
					}	
					if(firstRow){
						$scope.csv.push(firstRowCsv.join(";"));  
					}
					$scope.csv.push(rowCsv.join(";"));  
			    	firstRow=false;		
					$scope.dataList.push(data);	
					
				};
				
			};
		}).error(function(response) {
			console.log("loadData Error: ", response);
			$scope.showLoading = false;

			var detail = "";
			if(response.error &&  response.error.message &&  response.error.message.value)
				detail = ""+ response.error.code + " - " + response.error.message.value;
			var error = {"message":"Cannot load data","detail":detail};
			$scope.errors.push(error);

		});
	};
	
	var createQueryOdata = function(stream_code, filter, skip, top, orderby, collection, format){
		
		var host = $location.host();
		var env = host.substring(0,host.indexOf("userportal.smartdatanet.it"));
		if (host == "localhost"){
			env = "int-";
		}

		var streamDataUrl = "http://"+env+"api.smartdatanet.it/api/"+stream_code+"/"+collection+"?$format="+format;
		if(filter && filter!=null)
			streamDataUrl += '&$filter='+filter;
		if(skip && skip!=null)
			streamDataUrl += '&$skip='+skip;
		if(top && top!=null)
			streamDataUrl += '&$top='+top;
		if(orderby && orderby!=null)
			streamDataUrl += '&$orderby='+orderby;
		return streamDataUrl;
	};
	
	$scope.loadBinaryDetail = function(rowNum, column){
		console.log("loadBinaryDetail",rowNum,  column, $scope.dataList[rowNum][column]);
		$scope.dataList[rowNum][column].showBinaryDetail = true;
		$scope.dataList[rowNum][column].loadingBinaryDetail = true;
		odataAPIservice.getBinaryAttachData($scope.dataList[rowNum][column].binaryBaseUrl,$scope.dataList[rowNum][column].value).success(function(response) {
			console.log("getBinaryAttachData",response);
			$scope.dataList[rowNum][column].loadingBinaryDetail = false;
			if(response.d.results.length>0){
				$scope.dataList[rowNum][column].binaryDetail = response.d.results[0];
				if(typeof $scope.dataList[rowNum][column].binaryDetail.urlDownloadBinary !== 'undefined' && $scope.dataList[rowNum][column].binaryDetail.urlDownloadBinary!=null &&
					$scope.dataList[rowNum][column].binaryDetail.urlDownloadBinary.length>4){
					// urlDownloadBinary -> /api/Binariomerco_154/attachment/153/1/provaDav remove /api
					$scope.dataList[rowNum][column].binaryDetail.absoluteUrlDownloadBinary =   Constants.API_ODATA_URL + $scope.dataList[rowNum][column].binaryDetail.urlDownloadBinary.substring(5);
					console.log("absoluteUrlDownloadBinary",$scope.dataList[rowNum][column].binaryDetail.absoluteUrlDownloadBinary);
				}
			}
			else{
				$scope.dataList[rowNum][column].noBinaryFound =true;
			}
		});
				
	};
	
	$scope.hasBinaryPreview = function(contentTypeBinary){
		var mediaType = Helpers.util.getMediaTypeFromContentType(contentTypeBinary);
		return mediaType == 'image' || mediaType == 'video' || mediaType == 'audio'; 
	};
	
	$scope.previewBinary = function(binary, type){
		console.log("previewBinary",binary);
	    var modalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'dataexplorerPreviewBinary.html',
	      controller: 'DataExplorerPreviewBinaryCtrl',
	      size: 'lg',
	      resolve: {
	    	  binaryPreview: function () {
	    		  return binary;
	    	  }, 
	    	  previewType : function(){
	        	return type;
	    	  }
	      }
	    });
	};
	
	$scope.detailModal = function(metadata){
		console.log("ds", metadata);
	    var detailModalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'dataexplorerDetailModal.html',
	      controller: 'DataExplorerDetailModalCtrl',
	      size: 'lg',
	      resolve: {
	    	  metadata : function(){
	        	return metadata;
	    	  }
	      }
	    });
	};
	
	$scope.chooseDecimalSeparator = function(){
		var decimalSeparatorChooseDialogInstance = $modal.open({
			templateUrl : 'partials/dataexplorer/decimalSeparatorChooseDialog.html',
  	      	controller: 'DecimalSeparatorChooseDialogCtrl',
    	    resolve: {
    	    	decimalSeparator: function () {return $scope.decimalSeparator;},
    	    }

		});
		
		decimalSeparatorChooseDialogInstance.result.then(function (decimalSeparator) {
		    	console.log('DecimalSeparatorChooseDialog - decimalSeparator', decimalSeparator);
		    	localStorageService.set("downloadCSvDecimalSeparator",decimalSeparator);
		    	$scope.decimalSeparator = decimalSeparator;
		      	}, function () {console.log('DecimalSeparatorChooseDialog - decimalSeparator dismissed ');
		      });
	};
	
	// Download CSV file
	$scope.exportTableToCSV = function(){	   
		var filename = $scope.metadata.tenantName + "_" + $scope.metadata.dataset.code + "_" + $scope.metadata.dataset.datasetId + "_" + $scope.metadata.version + "_CurrentPage.csv";
	    Helpers.util.downloadCSV($scope.csv.join("\n"), filename);
	}
	
	$scope.isDecimal = function(columnName){
		for(var index = 0; index< $scope.metadata.components.length; index++){
			if($scope.metadata.components[index].name === columnName){
				if($scope.metadata.components[index].datatype==='double' || $scope.metadata.components[index].datatype==='float' || $scope.metadata.components[index].datatype==='latitude' || $scope.metadata.components[index].datatype==='longitude')
					return true;
				else return false;
			}
		}
		
	}

} ]);

appControllers.controller('DataExplorerDetailModalCtrl', [ '$scope', '$modalInstance', 'metadata', function ($scope, $modalInstance, metadata) {
		console.log("DataExplorerDetailModalCtrl - metadata", metadata);
		
		$scope.metadata = metadata;
		
		$scope.close = function () {
			$modalInstance.dismiss('cancel');
		};
	}
]);


appControllers.controller('DataExplorerPreviewBinaryCtrl', [ '$scope', '$modalInstance', 'binaryPreview','previewType', function ($scope, $modalInstance, binaryPreview, previewType) {
	console.log("DataExplorerPreviewBinaryCtrl - binaryPreview", binaryPreview, previewType);
	$scope.binaryPreview = binaryPreview;	
	var mediaType = Helpers.util.getMediaTypeFromContentType(binaryPreview.contentTypeBinary);
	console.log("mediaType",mediaType);
	$scope.isImage = function(){
		return previewType!='metadata' && mediaType == 'image'; 
	};
	
	$scope.isVideo = function(){
		return previewType!='metadata' && mediaType == 'video'; 
	};

	$scope.isAudio = function(){
		var isAudio = previewType!='metadata' && mediaType == 'audio';
		console.log("isAudio",isAudio);
		return previewType!='metadata' && mediaType == 'audio'; 
	};
	
	$scope.isHtml = function(){
		return previewType!='metadata' && binaryPreview.contentTypeBinary == 'text/html'; 
	};
	
	$scope.isXml = function(){
		return previewType!='metadata' && (binaryPreview.contentTypeBinary == 'text/xml' || binaryPreview.contentTypeBinary == 'application/xml') ; 
	};

	$scope.isTxt = function(){
		return previewType!='metadata' && mediaType == 'text' ; 
	};

	$scope.isPdf = function(){
		return previewType!='metadata' && (binaryPreview.contentTypeBinary == 'application/pdf' || binaryPreview.contentTypeBinary == 'application/xml') ; 
	};

	
	$scope.showInIFrame = function(){
		return $scope.isXml() || $scope.isXml() || $scope.isHtml() || $scope.isPdf() || $scope.isTxt();
	};


	$scope.isMetadata = function(){
		return previewType=='metadata';
	};
	
	$scope.close = function () {
	    $modalInstance.dismiss('cancel');
		};
	}
]);

// TODO start Browse
appControllers.controller('DataBrowserCtrl', [ '$scope', '$routeParams', 'adminAPIservice',  '$location', '$filter', '$http',  'info', 'dataexplorerBrowseData', 'metadataapiAPIservice','$translate',
                                                function($scope, $routeParams,  adminAPIservice,  $location, $filter,  $http, info,dataexplorerBrowseData, metadataapiAPIservice,$translate) {
	
	$scope.currentStep = 'domains';
	$scope.browseSteps = [{'name':'domains', 'style':''},
	                      {'name':'tags', 'style':''},
	                      {'name':'results', 'style':''}];
	
	$scope.stepTitle='DATABROWSER_CHOOSE_DOMAIN_TITLE';
	
	//var internalNavigation = {isInternal: false, lastSteps: [], lastPages: []};
	
	$scope.goToChooseDomains  = function(){ 
		//internalNavigation.isInternal = true;
		//$scope.selectedDomain = null;
		//$scope.selectedTags = [];  
		$scope.metadataSearchInput = {query:'',filter:{}, start:0, rows: 10};
		dataexplorerBrowseData.setSearchResult(null);
		$scope.metadataSearchOutput.datasetList = [];
		fromBackButton = false;
		$scope.currentStep = 'domains'; 
		$scope.stepTitle='DATABROWSER_CHOOSE_DOMAIN_TITLE';
	};

	
	$scope.goToResults  = function(){ 

			$scope.currentStep = 'results';
			
			$scope.stepTitle='DATABROWSER_RESULTS_TITLE';
			dataexplorerBrowseData.setSearchResult(null);
			fromBackButton = false;
			$scope.metadataSearchInput.currentPage = 1;
			$scope.search();
	};

	var domainList = {};
	$scope.domainList = [];
//	$scope.selectedDomains = [];
	adminAPIservice.loadDomains().success(function(response) {

		var domainListPagination = {"start": "0", "rows":"0"};
		var domainListFacet = {"field":"domainCode"};
		
		
		for (var int = 0; int < response.length; int++) {
			domainList[response[int].domaincode] = {"domain":response[int].domaincode,"count":0};
		}
		
		metadataapiAPIservice.search(null,null, null, domainListPagination,null, null, domainListFacet).success(function(response) {
			console.log("metadataapiAPIservice.search_ response", response);
			var domainFacets = response.facetCount.facetFields.domainCode.facetItems;
			for (var domainFacet in domainFacets) {
				if (domainFacets.hasOwnProperty(domainFacet)) {
					if(typeof domainList[domainFacet.toUpperCase()] != 'undefined')
						domainList[domainFacet.toUpperCase()] = {"domain":domainFacet.toUpperCase(),"count":domainFacets[domainFacet]};
					//$scope.domainList.push({"domain":domainFacet.toUpperCase(), "count":domainFacets[domainFacet]});
				}
			}
			for (var d in domainList) {
				if (domainList.hasOwnProperty(d)) {
					$scope.domainList.push(domainList[d]);
				}
			}
			
			$scope.domainList.sort(
				function(a,b) {
					if (a.domain < b.domain)
						return -1;
					if (a.domain > b.domain)
						return 1;
					return 0;
				});
		});
		
		$scope.domainList.sort();
	}).error(function(response) {
		Console.error("adminAPIservice.loadDomains() ",response );
	});
	

	
	$scope.selectDomain = function(domain){
		$scope.metadataSearchInput.filter.domainCode = [domain];
		$scope.metadataSearchOutput.datasetList = [];
		$scope.goToResults();
	};
	
	
	$scope.addFilter = function(facetName, facetValue){
		if(typeof $scope.metadataSearchInput.filter[facetName] == 'undefined'){
			$scope.metadataSearchInput.filter[facetName] = [facetValue];
			$scope.goToResults();
		}
		else{
			if($scope.metadataSearchInput.filter[facetName].indexOf(facetValue)< 0){
				$scope.metadataSearchInput.filter[facetName].push(facetValue);
				$scope.goToResults();
			}
		}
	};
	
	$scope.removeFilter = function(facetName, facetValue){
		if(typeof $scope.metadataSearchInput.filter[facetName] != 'undefined'){
			for(var i = $scope.metadataSearchInput.filter[facetName].length - 1; i >= 0; i--) {
			    if($scope.metadataSearchInput.filter[facetName][i] === facetValue) {
			    	$scope.metadataSearchInput.filter[facetName].splice(i, 1);
			    }
			}
			
			if($scope.metadataSearchInput.filter[facetName].length==0)
				delete $scope.metadataSearchInput.filter[facetName];
		}
		
		$scope.goToResults();
	};
	
	$scope.showSearchLoading = false;

	$scope.resultViewType = 'list'; //'box';



	var fromBackButton = false;
	

	$scope.columns = [];
	var order = 'none';
	
	$scope.columns.push({"label":"DATABROWSER_ENTITY", "order": order, "showOrderButton": true});
	$scope.columns.push({"label":"DATASET_FIELD_METADATA_DATADOMAIN", "order": order, "showOrderButton": true});
	$scope.columns.push({"label":"DATASET_FIELD_METADATA_TAGS", "order": order, "showOrderButton": false});
	$scope.columns.push({"label":"DATASET_FIELD_CONFIGDATA_TENANT", "order": order, "showOrderButton": true});
	$scope.columns.push({"label":"DATASET_FIELD_METADATA_LICENSE", "order": order, "showOrderButton": false});

	var getEnvirorment  = function(){
		var host = $location.host();
		var env = host.substring(0,host.indexOf("userportal.smartdatanet.it"));
		if(host=='localhost')
			env = "int-";
		return env;
	};
	

	var cleanMetadata = function(data){
		if(typeof data["description"] === "undefined" || data["description"]==null)
			data["description"] = "";
		
		if(typeof data["license"] === "undefined" || data["license"]==null)
			data["license"] = "";
		
		if(typeof data["disclaimer"] === "undefined" || data["disclaimer"]==null)
			data["disclaimer"] = null;
		
		if(typeof data["copyright"] === "undefined" || data["copyright"]==null)
			data["copyright"] = null;

    	return data;
	};
	
	var createCard = function(datasetData){
		var now = new Date().getTime();
		var card = {
             template : "partials/dataexplorer/databrowser/card-template.html",
             tabs : ["home", "work"],
             data : datasetData,
             added : now,
           };
		return card;
	};
	
	$scope.errors = [];

	
	$scope.exploreData = function(data){
		console.log("exploreData", data);
	//	internalNavigation.isInternal = false;
		$location.path('dataexplorer/'+data.tenantCode+'/'+data.dataset.code);

	};
	
	$scope.openStreamDashboard = function(data){
		console.log("openStreamDashboard", data);
//		internalNavigation.isInternal = false;
		$location.path('dashboard/stream/'+data.tenantCode+'/'+data.stream.smartobject.code+'/'+data.stream.code);

	};
	
//	var getDetailPath = function(data){
//		console.log("exploreData", data);
//		var path = 'dataexplorer/detail/' + data.tenantCode+'/';
//		if(data.datasetCode!=null)
//			path += data.datasetCode;
//		else
//			path += data.virtualentityCode + '/' + data.streamCode;
//		return path;
//	};
	
	$scope.openDetail = function(data){
		console.log("exploreData", data);
		$location.path(data.detailPath);
	};
	
//	var searchStart = 0;
//	var searchPage = 12;
	
	$scope.noMoreSearchData = false;
	$scope.metadataSearchInput = {query:'',filter:{}, start:0, rows: 10};
	
	var metadataSearchFacet = {"field": "entityType,visibility,domainCode,subdomainCode,organizationCode,tenantCode,tagCode"};
	var metadataSearchFacetOrder = {"entityType": 0,"domainCode": 1,"subdomainCode": 2,"tagCode": 3,"organizationCode": 4,"tenantCode": 5,"visibility": 6};
	
	
//	if(typeof filter.tenant != 'undefined' && filter.tenant!=null) 
//		metadataapiUrl += '&tenant='+filter.tenant;
//	if(typeof filter.organization != 'undefined' && filter.organization!=null) 
//		metadataapiUrl += '&organization='+filter.organization;
//	if(typeof filter.domain != 'undefined' && filter.domain!=null) 
//		metadataapiUrl += '&domain='+filter.domain;
//	if(typeof filter.subdomain != 'undefined' && filter.subdomain!=null) 
//		metadataapiUrl += '&subdomain='+filter.subdomain;
//	if(typeof filter.opendata != 'undefined' && filter.opendata!=null) 
//		metadataapiUrl += '&opendata='+filter.opendata;
	
	$scope.layoutInfo = {"sideMenu": "facet",
						 "totalFound":0
						};
	
	
	
	$scope.metadataSearchOutput = {datasetList: [],
			facetList: []
	};
	
	var parseSearchMetadataResult = function(dataFromSearch){
		var data = {};
		
		//data.datasetCode = dataFromSearch.name;
		data.name = dataFromSearch.name;
		
		
		data.description = dataFromSearch.description;
		data.domainCode = dataFromSearch.domainCode;
		
		data.tags = dataFromSearch.tags;
		data.tagCodes = dataFromSearch.tagCodes;
		data.tenantCode = dataFromSearch.tenantCode;
		
		data.license = dataFromSearch.license;
		data.copyright = dataFromSearch.copyright;
		data.disclaimer = dataFromSearch.disclaimer;
		
		var baseDetailPath = 'dataexplorer/detail/' + data.tenantCode+'/';
		
		data.type=dataFromSearch.type.join("_"); 
		data.icon = dataFromSearch.icon;
		
		if(dataFromSearch.dataset!=null){
			data.dataset = {};
			data.dataset.code = dataFromSearch.dataset.code;
			data.showDataexplorerButton = true;
			data.detailPath  = baseDetailPath + data.dataset.code;
		}

		if(dataFromSearch.stream!=null){
			data.stream = {};
			data.stream.code = dataFromSearch.stream.code;
			if(dataFromSearch.stream.smartobject!=null){
				data.stream.smartobject= {};
				data.stream.smartobject.code = dataFromSearch.stream.smartobject.code;
				data.stream.smartobject.description = dataFromSearch.stream.smartobject.description;
			}
			data.showDashboardButton = true;
			data.detailPath  = baseDetailPath + data.stream.smartobject.code + '/' + data.stream.code;
		}
		
		return data;
	};

	$scope.facetCompactLimit = 4;
	
	var facetComparator = function(a,b) {
		var res = 0;
		if (a.count> b.count)
			res = -1;
		else if (a.count < b.count)
			res = 1;
		else if (a.label < b.label)
			res = -1;
		else if (a.label > b.label)
			res = 1;
		return res;
	};
	
	$scope.selectPage = function(){
		$scope.search();
	};
	
	$scope.search = function(){
		
		console.log("search", $scope.metadataSearchInput.query);
		$scope.showSearchLoading = true;
		$scope.errors = [];
		$scope.metadataSearchOutput.facetList = [];
		$scope.metadataSearchOutput.datasetList = [];

		$scope.metadataSearchInput.start=($scope.metadataSearchInput.currentPage-1)*$scope.metadataSearchInput.rows;
		var metadataSearchPagination = {"start": $scope.metadataSearchInput.start, "rows": $scope.metadataSearchInput.rows};
		console.log("metadataSearchPagination",metadataSearchPagination);
		
		// search(apiVersion,q, lang, pagination,filter, geolocalization, facet)
		metadataapiAPIservice.search(null, $scope.metadataSearchInput.query, null, metadataSearchPagination,$scope.metadataSearchInput.filter, null, metadataSearchFacet).success(function(response) {
			console.log("metadataapiAPIservice.search response", response);
			//$scope.noMoreSearchData = true;
			$scope.showSearchLoading = false;
			//$scope.totalFound = response.totalCount;
			$scope.metadataSearchOutput.totalFound = response.totalCount;
			$scope.metadataSearchOutput.totalPages = response.totalCount;
			$scope.metadataSearchOutput.start = response.start;
			
			var facets = response.facetCount.facetFields;
			console.log("facets", facets);
			for (var facetKey in facets) {
			    if (facets.hasOwnProperty(facetKey)) {
			    	var facetFirstItems = [];
			    	var facetItems = [];
					for (var facetItemKey in facets[facetKey].facetItems) {
						if(facets[facetKey].facetItems[facetItemKey] != 0){
							if(facetKey == 'domainCode' || facetKey == 'subdomainCode' || facetKey == 'tagCode' ){
								facetItems.push({"name": facetItemKey.toUpperCase(), "label": $translate.instant(facetItemKey.toUpperCase()),"count": facets[facetKey].facetItems[facetItemKey]});
							}
							else{
								facetItems.push({"name": facetItemKey, "label": facetItemKey, "count": facets[facetKey].facetItems[facetItemKey]});
							}
						}
					}
					if(facetItems.length>0){
						facetItems.sort(function(a,b) {
								return facetComparator(a,b);
							});
						
						for (var facetIndex = 0; facetIndex < facetItems.length; facetIndex++) {
							if(facetIndex>=$scope.facetCompactLimit)
								break;
							facetFirstItems.push(facetItems[facetIndex]);
						}

						$scope.metadataSearchOutput.facetList.push({"facet":facetKey, "label":  $translate.instant("FACET_"+facetKey), "items": facetItems, "firstItems": facetFirstItems, "compact" : true, "order": metadataSearchFacetOrder[facetKey]});
					}
			    }
			}
			
			$scope.metadataSearchOutput.facetList.sort(
					function(a,b) {
						if (a.order < b.order)
							return -1;
						if (a.order > b.order)
							return 1;
						return 0;
					});
			
			if(response.count>0){
				for (var datasetIndex = 0; datasetIndex < response.metadata.length; datasetIndex++) {
					var dataFromSearch = response.metadata[datasetIndex];
					var data = parseSearchMetadataResult(dataFromSearch);
					$scope.metadataSearchOutput.datasetList.push(cleanMetadata(data));
				}
			}
			
			var searchResult = {};
			searchResult.metadataSearchInput = $scope.metadataSearchInput;
			searchResult.metadataSearchOutput = $scope.metadataSearchOutput;
			
			dataexplorerBrowseData.setSearchResult(searchResult);			

		}).error(function(response) {
			console.log("search response error", response);
			errors.push({"messagge":"Search error", "detail":response});
			$scope.showSearchLoading = false;

		});
	};
	
	if(dataexplorerBrowseData.getSearchResult()!=null){
		var searchResult = dataexplorerBrowseData.getSearchResult();

		$scope.metadataSearchInput = searchResult.metadataSearchInput;
		$scope.metadataSearchOutput = searchResult.metadataSearchOutput;

		fromBackButton = true;
		$scope.currentStep = 'results';
		$scope.stepTitle='DATABROWSER_RESULTS_TITLE';
	}

	// https://int-userportal.smartdatanet.it/store/site/blocks/search/api-search/ajax/search.jag -d 'action=searchAPIs&query=grecia&start=0&end=10'
}]);

//TODO end Browse

appControllers.controller('DatepickerCtrl', [ '$scope', '$routeParams', 'odataAPIservice', '$filter', 'info', '$location', '$modal', 
                                                function($scope, $routeParams, odataAPIservice,  $filter, info, $location, $modal) {
	
	  $scope.today = function() {
		  $scope.dt = new Date();
	  };
	  $scope.today();

	  $scope.clear = function () {
		  $scope.dt = null;
	  };

	  // Disable weekend selection
	  $scope.disabled = function(date, mode) {
		  return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	  };

	  $scope.toggleMin = function() {
		  $scope.minDate = $scope.minDate ? null : new Date();
	  };
	  $scope.toggleMin();

	  $scope.open = function($event) {
		   $event.preventDefault();
		   $event.stopPropagation();

		   $scope.opened = true;
	  };

	  $scope.dateOptions = {
		   formatYear: 'yy',
		   startingDay: 1
	  };

	  $scope.formats = [ 'dd/MM/yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	  $scope.format = $scope.formats[0];
	  
	
	}]);

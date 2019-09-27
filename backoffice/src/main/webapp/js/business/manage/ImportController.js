/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */

appControllers.controller('ImportCtrl', [ '$scope', "$route", 'adminAPIservice', 'fabricBuildService', '$translate', '$modal', '$timeout' , '$q',
                                           function($scope, $route, adminAPIservice, fabricBuildService, $translate, $modal,$timeout, $q) {
	
	/*
	 * IMPORT METADATA
	 */

	$scope.allOrganizations = new Array();
	$scope.allTenants = new Array();
	$scope.allTenantsMap = new Array();
	$scope.allTags = new Array();
	$scope.allTagsMap = new Array();
	$scope.allDomains = new Array();
	$scope.allDomainsMap = new Array();
	$scope.allSubdomains = new Array();
	$scope.allSubdomainsMap = new Array();

	$scope.initFeedback = "wait";
	var initError = false;
	
	


	
	
	var init = function(){
//			function(response){console.log("organization ok",response); $scope.allOrganizations = response.data;}, 
//			function(response){console.log("organization ko",response); initError =true;}
//		);

		var loadTenants = adminAPIservice.loadTenants().then(
				function(response){
					console.log("tenant ok",response); 
					$scope.allTenants= new Array();
					$scope.allTenantsMap = new Array();
					for (var int = 0; int < response.data.length; int++) {
						var tenantLabel = $translate.use()=='it'?response.data[int].langit:response.data[int].langen;
						$scope.allTenants.push({"idTenant": response.data[int].idTenant, "tenantcode":response.data[int].tenantcode} );
						$scope.allTenantsMap[response.data[int].tenantcode]={"idTenant": response.data[int].idTenant, "tenantcode":response.data[int].tenantcode} ;
					}
					console.log("allTenants", $scope.allTenants);
					$scope.allTenants.sort(function(a, b) { 
					    return ((a.tenantcode < b.tenantcode) ? -1 : ((a.tenantcode > b.tenantcode) ? 1 : 0));
					});
				}, 
				function(response){console.log("tenant ko",response); initError =true;}
			);

			var loadTags = adminAPIservice.loadTags().then(
				function(response){
					console.log("tag ok",response); 
					$scope.allTags= new Array();
					$scope.allTagsMap = new Array();

					for (var int = 0; int < response.data.length; int++) {
						var tagLabel = $translate.use()=='it'?response.data[int].langit:response.data[int].langen;
						$scope.allTags.push({"idTag": response.data[int].idTag, "tagCode":response.data[int].tagcode, "tagLabel":tagLabel} );
						$scope.allTagsMap[response.data[int].idTag]={"idTag": response.data[int].idTag, "tagCode":response.data[int].tagcode, "tagLabel":tagLabel} ;
					}
					console.log("allTags", $scope.allTags);
					$scope.allTags.sort(function(a, b) { 
					    return ((a.tagLabel < b.tagLabel) ? -1 : ((a.tagLabel > b.tagLabel) ? 1 : 0));
					});
				}, 
				function(response){console.log("tag ko",response); initError =true;}
			);
			

			var loadDomains = adminAPIservice.loadDomains().then(
				function(response){
					console.log("domain ok",response); 
					$scope.allDomains= new Array();
					$scope.allDomainsMap = new Array();

					for (var int = 0; int < response.data.length; int++) {
						//var domainLabel = $translate.use()=='it'?response.data[int].langit:response.data[int].langen;
						$scope.allDomains.push({"idDomain": response.data[int].idDomain, "domaincode":response.data[int].domaincode} );
						$scope.allDomainsMap[response.data[int].idDomain]={"idDomain": response.data[int].idDomain, "domaincode":response.data[int].domaincode} ;
					}
					$scope.allDomains.push({"idDomain": -1, "domaincode":"MULTI"} );
					console.log("allDomains", $scope.allDomains);
					$scope.allDomains.sort(function(a, b) { 
					    return ((a.domaincode < b.domaincode) ? -1 : ((a.domaincode > b.domaincode) ? 1 : 0));
					});
				}, 
				function(response){console.log("domain ko",response); initError =true;}
			);
		
		$q.all([loadTenants, loadTags, loadDomains]).then(function(){
			console.log("initAll ok");
			$scope.initFeedback = "ok";
		})
	};
	
	

	init();
	
	$scope.lastDbUsed = null;
	
	$scope.defaultMetadata = {tags: new Array()};
	
	$scope.tablesWithUpdate = false;

	$scope.importMetadata = function(){
		$scope.isLoadingDB = true;
		$scope.tables = new Array();
		$scope.importConfig = {};
		$scope.tablesWithUpdate = false;
		
		var organizationCode = $scope.organizationCode;
		if(!$scope.domain || !$scope.subdomain || !$scope.organizationCode || !$scope.tenantCode)
			$scope.$parent.showMessage("warning", "WARNING", "DASHBOARD_IMPORTMETATADA_LOADTABLE_PARAMS_WARNING","");
		else{

			
			$scope.importConfig.domain = $scope.domain;
			$scope.importConfig.subdomain = $scope.subdomain;
			$scope.importConfig.tenantCode = $scope.tenantCode;
			$scope.importConfig.dbType = 'HIVE';
			
			$scope.defaultMetadata.domain = $scope.domain;
			if($scope.domain=='MULTI')
				$scope.defaultMetadata.subdomain = {subdomaincode:$scope.subdomain};
			$scope.defaultMetadata.tenantCode = $scope.tenantCode;
			
			$scope.lastDbUsed = $scope.organizationCode + "_" +$scope.domain+"_" + $scope.subdomain;
			
			console.log("importMetadata - request ", $scope.importConfig);
			$scope.showLoading = true;

			adminAPIservice.importMetadata($scope.importConfig,organizationCode).success(function(response) {
				console.log("importMetadata - response",response);
				
				$scope.showLoading = false;
	
				$scope.tables = response;
				$scope.selectTablesFlag = true;
				if($scope.tables.length==0){
					$scope.$parent.showMessage("info", "INFO", "DASHBOARD_IMPORTMETATADA_LOADTABLE_NO_TABLES_INFO", "");
					$scope.lastDbUsed = null;
				}
				else{
					for (var tableIndex = 0; tableIndex < $scope.tables.length; tableIndex++) {
						if(typeof $scope.tables[tableIndex].warnings != 'undefined' && $scope.tables[tableIndex].warnings!=null && $scope.tables[tableIndex].warnings.length>0)
							$scope.tables[tableIndex].importTable = false;	
						else
							$scope.tables[tableIndex].importTable = true;
						$scope.tables[tableIndex].index = tableIndex;
						$scope.tables[tableIndex].customized = {"name":false,"domain":false,"visibility":false, "dcat":false, "columns":false};
						var completeDatasource =  angular.copy($scope.tables[tableIndex].dataset);
						$scope.tables[tableIndex].dataset = {};
						$scope.tables[tableIndex].dataset =  Helpers.yucca.prepareDatasourceForUpdate(Constants.DATASOURCE_TYPE_DATASET,completeDatasource);
		
						if($scope.tables[tableIndex].status == 'new'){
							for (var columnIndex = 0; columnIndex < $scope.tables[tableIndex].dataset.components.length; columnIndex++) {
								$scope.tables[tableIndex].dataset.components[columnIndex].isNewField = true;
								$scope.tables[tableIndex].dataset.components[columnIndex].required = true;
							}
						}
						else if($scope.tables[tableIndex].status == 'existing'){
							$scope.tablesWithUpdate = true;
							if(typeof $scope.tables[tableIndex].newFields != 'undefined' &&  $scope.tables[tableIndex].newFields.length>0 && 
									$scope.tables[tableIndex].dataset.components && $scope.tables[tableIndex].dataset.components.length>0){
								for (var columnIndex = 0; columnIndex < $scope.tables[tableIndex].dataset.components.length; columnIndex++) {
									if(isNewField($scope.tables[tableIndex].dataset.components[columnIndex], $scope.tables[tableIndex].newFields)){
										$scope.tables[tableIndex].dataset.components[columnIndex].isNewField = true;
										$scope.tables[tableIndex].dataset.components[columnIndex].skipColumn = true;
									}
									
								}
							}
							
						}
						$scope.tables[tableIndex].dataset.domain = $scope.domain;
						$scope.tables[tableIndex].dataset.subdomain = $scope.subdomain;
						
					}
					//$scope.refreshSelectedTableCount();
				}
	
		
			}).error(function(response) {
				console.log("importMetadata - error",response);
				$scope.$parent.showMessage("danger", "UNEXPECTED_ERROR", "UNEXPECTED_ERROR_MESSAGE", "Detail: "+response);
				$scope.showLoading = false;
				$scope.lastDbUsed = null;
			});
		}
	};

	
	$scope.filter = {};
	
	$scope.searchDatasetnameFilter = function(table) {
		var keyword = new RegExp($scope.filter.datasetname, 'i');
		return !$scope.filter.datasetname || (table.dataset.datasetname && keyword.test(table.dataset.datasetname));
	};

	$scope.searchTablenameFilter = function(table) {
		var keyword = new RegExp($scope.filter.tablename, 'i');
		return !$scope.filter.tablename || (table.tablename && keyword.test(table.tablename));
	};
	
	$scope.onTenantSelect = function($item, $model, $label){
 		console.log("onTenantSelect",$item, $model, $label);
 		if($item.tenantcode!=null){
// 			$scope.defaultMetadata.subdomain = $item;
 			$scope.tenantCode = $item.tenantcode;
 		}
 	};
 	
	$scope.onDomainSelect = function($item, $model, $label){
 		console.log("onDomainSelect",$item, $model, $label);
 		if($item.domaincode!=null){
 			$scope.defaultMetadata.domain = $item;
 			$scope.domain = $item.domaincode;
 			if($item.domaincode != 'MULTI')
 				loadSubdomains($item.domaincode);
 			else{
				$scope.allSubdomains= new Array();
				$scope.allSubdomainsMap = new Array();
 			}
 				
 			
 		}
 	};
 	
 	var loadSubdomains = function(domaincode){
 		adminAPIservice.loadSubdomains(domaincode).then(
 			function(response){
				console.log("subdomain ok",response); 
				$scope.allSubdomains= new Array();
				$scope.allSubdomainsMap = new Array();

				for (var int = 0; int < response.data.length; int++) {
					$scope.allSubdomains.push({"idSubdomain": response.data[int].idSubdomain, "subdomaincode":response.data[int].subdomaincode} );
					$scope.allSubdomainsMap[response.data[int].subdomaincode]={"idSubdomain": response.data[int].idSubdomain, "subdomaincode":response.data[int].subdomaincode} ;
				}
				console.log("allSubdomains", $scope.allSubdomains);
				$scope.allSubdomains.sort(function(a, b) { 
				    return ((a.subdomaincode < b.subdomaincode) ? -1 : ((a.subdomaincode > b.subdomaincode) ? 1 : 0));
				});
			}, 
			function(response){console.log("domain ko",response); initError =true;}
		);
 	};

	$scope.onSubdomainSelect = function($item, $model, $label){
 		console.log("onSubdomainSelect",$item, $model, $label);
 		if($item.subdomaincode!=null){
 			$scope.defaultMetadata.subdomain = $item; 
 			$scope.subdomain = $item.subdomaincode;
 		}
 	};

	$scope.onTagSelect = function($item, $model, $label){
 		console.log("onTagSelect",$item, $model, $label);
 		if($item.tagCode!=null)
 			addTag($item);
 	};
	
 	$scope.newTag = {value:null};
	var addTag = function(newTag){
 		console.log("addTag ", newTag);
 		if(newTag){
 			var found = false;	
 			for (var int = 0; int < $scope.defaultMetadata.tags.length; int++) {
 				var existingTag = $scope.defaultMetadata.tags[int];
 				if(existingTag == newTag.idTag){
 					found = true;
 					break;
 				}

 			}
 			if(!found){
 				$scope.defaultMetadata.tags.push(newTag.idTag);
 				if(typeof $scope.defaultMetadata.taglabels == 'undefined')
 					$scope.defaultMetadata.taglabels = new Array();
				$scope.defaultMetadata.taglabels.push(newTag.tagLabel);
	    	}
 			$scope.newTag.value = null;
 		}
 		
 		return false;
 	};

 	
 	$scope.removeTag = function(index){
 		$scope.defaultMetadata.tags.splice(index,1);
 		return false;
 	};
 	
	
	$scope.selectTables = function(selectionType){
		if($scope.tables && $scope.tables.length>0){
			for (var tableIndex = 0; tableIndex < $scope.tables.length; tableIndex++) {
				if(selectionType == 'all'){
					$scope.tables[tableIndex].importTable = true;
					$scope.selectAllTableFlag = true;
				}
				else if(selectionType == 'none'){
					$scope.tables[tableIndex].importTable = false;
					$scope.selectAllTableFlag = false;
				}
				else if(selectionType == 'invert'){
					$scope.tables[tableIndex].importTable = !$scope.tables[tableIndex].importTable;
					$scope.selectAllTableFlag = false;
				}
				else if(selectionType == 'filtered'){
					$scope.tables[tableIndex].importTable = $scope.isInFiltered($scope.tables[tableIndex].dataset.datasetname);
					$scope.selectAllTableFlag = false;
				}
				else if(selectionType == 'new'){
					$scope.tables[tableIndex].importTable = $scope.tables[tableIndex].status == 'new';
					$scope.selectAllTableFlag = false;
				}
				else if(selectionType == 'existing'){
					$scope.tables[tableIndex].importTable = $scope.tables[tableIndex].status == 'existing';
					$scope.selectAllTableFlag = false;
				}
				else if(selectionType == 'tableType_table'){
					$scope.tables[tableIndex].tableType == 'TABLE';
					$scope.selectAllTableFlag = false;
				}
				else if(selectionType == 'tableType_view'){
					$scope.tables[tableIndex].tableType == 'VIEW';
					$scope.selectAllTableFlag = false;
				}
				else if(selectionType == 'tableType_synonym'){
					$scope.tables[tableIndex].tableType == 'SYNONYM';
					$scope.selectAllTableFlag = false;
				}
			}
			//$scope.refreshSelectedTableCount();
		}
	};
	
	//$scope.selectedTablesCount = 0;
	$scope.selectedTablesCount = function(){
		var count = 0;
		for (var tableIndex = 0; tableIndex < $scope.tables.length; tableIndex++) {
			if($scope.tables[tableIndex].importTable === true)
				count++;
		}
		return count;
	}
	
	$scope.filter.filteredTables={};
	$scope.isInFiltered = function(datasetname){
		var count = 0;
		for (var tableIndex = 0; tableIndex < $scope.filter.filteredTables.length; tableIndex++) {
			if($scope.filter.filteredTables[tableIndex].dataset.datasetname === datasetname)
				return true;
		}
		return false;
	}
	
	
	
	
	$scope.notVisibleSelectedDataset = function(){
		console.log("$scope.tables",$scope.tables);
		if ( $scope.tables !=undefined) {
			var filteredDataset = [];
			for (var filterIndex = 0; filterIndex < $scope.filter.filteredTables.length; filterIndex++) {
						filteredDataset.push($scope.filter.filteredTables[filterIndex].dataset.datasetname);
			}
			var tableDataset = [];
			for (var tableIndex = 0; tableIndex <$scope.tables.length; tableIndex++) {
				if ($scope.tables[tableIndex].importTable == true)
					tableDataset.push($scope.tables[tableIndex].dataset.datasetname);
			}
			
			for (var index = 0; index <tableDataset.length; index++) {
				if(filteredDataset.indexOf(tableDataset[index])== -1)
					return true;
			}
		}
	}
	
	$scope.isLowerCase = function(word){
		if(word != 'undefined' && word != '' && word != null) {
			if(word == word.toLowerCase())
				return true;
		}
	}
	
	$scope.confirmImport= function(){
		if($scope.notVisibleSelectedDataset()){
			console.log("modaldialog", "modale");
			var modalInstance  = $modal.open({
				templateUrl: 'confirmImportMetadataDialog.html',
				controller: 'confirmImportMetadataDialogCtrl',
				windowClass: 'app-modal-window',
			});
			
			modalInstance.result.then(function() {
			    //  $scope.selected = selectedItem;
					$scope.startCreateDataset();
			  }, function () {
			      $log.info('Modal dismissed at: ' + new Date());
			  });
		}
		else 
			$scope.startCreateDataset();
}
	
	
	
	

//	$scope.onBlurjdbcdbName = function(defaultValue){
//		for (var i = 0; i < $scope.tables.length; i++) {
//			//console.log("fieldStr",$scope[fieldStr]);
//			if( $scope.tables[i].dataset.jdbcdbName == 'undefined' || $scope.tables[i].dataset.jdbcdbName =="" || $scope.tables[i].dataset.jdbcdbName == null ){
//				$scope.tables[i].dataset.jdbcdbName = defaultValue;
//			}
//		}
//		
//	};
//	
//	$scope.onBlurjdbcnativetype = function(defaultValue){
//		for (var i = 0; i < $scope.tables.length; i++) {
//			//console.log("fieldStr",$scope[fieldStr]);
//			if( $scope.tables[i].dataset.jdbcnativetype == 'undefined' || $scope.tables[i].dataset.jdbcnativetype =="" || $scope.tables[i].dataset.jdbcnativetype == null ){
//				$scope.tables[i].dataset.jdbcnativetype = defaultValue;
//			}
//		}
//		
//	};
//	
//	$scope.onBlurjdbcjdbcdbschema = function(defaultValue){
//		for (var i = 0; i < $scope.tables.length; i++) {
//			//console.log("fieldStr",$scope[fieldStr]);
//			if( $scope.tables[i].dataset.jdbcdbschema == 'undefined' || $scope.tables[i].dataset.jdbcdbschema =="" || $scope.tables[i].dataset.jdbcdbschema == null ){
//				$scope.tables[i].dataset.jdbcdbschema = defaultValue;
//			}
//		}
//		
//	};
//	
//	$scope.onBlurjdbctablename = function(defaultValue){
//		for (var i = 0; i < $scope.tables.length; i++) {
//			//console.log("fieldStr",$scope[fieldStr]);
//			if( $scope.tables[i].dataset.jdbctablename == 'undefined' || $scope.tables[i].dataset.jdbctablename =="" || $scope.tables[i].dataset.jdbctablename == null ){
//				$scope.tables[i].dataset.jdbctablename = defaultValue;
//			}
//		}
//		
//	};
//	
//	$scope.onBlurjdbcdburl = function(defaultValue){
//		for (var i = 0; i < $scope.tables.length; i++) {
//			//console.log("fieldStr",$scope[fieldStr]);
//			if( $scope.tables[i].dataset.jdbcdburl == 'undefined' || $scope.tables[i].dataset.jdbcdburl =="" || $scope.tables[i].dataset.jdbcdburl == null ){
//				$scope.tables[i].dataset.jdbcdburl = defaultValue;
//			}
//		}
//		
//	};
	


	$scope.status = "ready";
	$scope.dbImport = {};
	$scope.dbImport.total = 0; 
	$scope.dbImport.totalOk = 0;
	$scope.dbImport.totalUpdate = 0;
	$scope.dbImport.totalCreate = 0;
	$scope.dbImport.totalKo = 0;
	$scope.dbImport.datasetCreated = [],
	$scope.dbImport.datasetUpdated = [],
	$scope.dbImport.datasetWithError = [], 
	$scope.dbImport.currentError = null, 
	$scope.dbImport.datasetList = [], 
	$scope.dbImport.delta = 1;
	$scope.dbImport.currentDatasetName =  ""; 
	
	$scope.startCreateDataset = function(){
	
		
		disableTables(true);

		$scope.status = "running";
		$scope.dbImport.total = 0; 
		$scope.dbImport.totalOk = 0;
		$scope.dbImport.totalUpdate = 0;
		$scope.dbImport.totalCreate = 0;
		$scope.dbImport.totalKo = 0;
		$scope.dbImport.datasetCreated = [],
		$scope.dbImport.datasetUpdated = [],
		$scope.dbImport.datasetWithError = [], 
		$scope.dbImport.currentError = null, 
		$scope.dbImport.datasetList = [], 
		$scope.dbImport.delta = 1;
		$scope.dbImport.currentDatasetName =  ""; 
		var validationsError = "";
		
		//$scope.refreshSelectedTableCount();
		if($scope.selectedTablesCount()==0)
			validationsError = "<li><strong>" + $translate.instant("DASHBOARD_IMPORTMETADATA_VALIDATION_NOTABLE")+"</strong></li>" ;
		if(!$scope.defaultMetadata.domain)
			validationsError += "<li>" + $translate.instant("DASHBOARD_IMPORTMETADATA_VALIDATION_DOMAIN")+"</li>" ;
		if(!$scope.defaultMetadata.subdomain)
			validationsError += "<li>" + $translate.instant("DASHBOARD_IMPORTMETADATA_VALIDATION_SUBDOMAIN")+"</li>" ;
		if(!$scope.defaultMetadata.tenantCode)
			validationsError += "<li>" + $translate.instant("DASHBOARD_IMPORTMETADATA_VALIDATION_TENANTCODE")+"</li>" ;
		
		if(!$scope.defaultMetadata.requestername)
			validationsError += "<li>" + $translate.instant("DASHBOARD_IMPORTMETADATA_VALIDATION_REQUESTERNAME")+"</li>" ;
		if(!$scope.defaultMetadata.requestersurname)
			validationsError += "<li>" + $translate.instant("DASHBOARD_IMPORTMETADATA_VALIDATION_REQUESTERSURNAME")+"</li>" ;
		if(!$scope.defaultMetadata.requesteremail)
			validationsError += "<li>" + $translate.instant("DASHBOARD_IMPORTMETADATA_VALIDATION_REQUESTEREMAIL")+"</li>" ;
		
//		if(!$scope.defaultMetadata.jdbcdbname)
//			validationsError += "<li>" + $translate.instant("DASHBOARD_IMPORTMETADATA_VALIDATION_JDBCDBNAME")+"</li>" ;
		if(!$scope.defaultMetadata.jdbcdbtype)
			validationsError += "<li>" + $translate.instant("DASHBOARD_IMPORTMETADATA_VALIDATION_JDBCDBTYPE")+"</li>" ;
		if(!$scope.defaultMetadata.jdbcdbschema)
			validationsError += "<li>" + $translate.instant("DASHBOARD_IMPORTMETADATA_VALIDATION_JDBCDBSCHEMA")+"</li>" ;
//		if(!$scope.defaultMetadata.jdbcdburl)
//			validationsError += "<li>" + $translate.instant("DASHBOARD_IMPORTMETADATA_VALIDATION_JDBCDBURL")+"</li>" ;

		if(!$scope.defaultMetadata.tags || $scope.defaultMetadata.tags.length<1)
			validationsError += "<li>" + $translate.instant("DASHBOARD_IMPORTMETADATA_VALIDATION_TAG")+"</li>" ;
		
		if(validationsError.length>0){
			$scope.$parent.showMessage("warning", "WARNING", "DASHBOARD_IMPORTMETATADA_CREATEDATASET_PARAMS_WARNING","<ul>"+ validationsError + "</ul>");
			$scope.status = 'ready';
			disableTables(false);

		}
		else
			createDataset();
		
	};
	
	$scope.continueCreateDataset = function(){	
		disableTables(true);
		createDataset();
	};

	$scope.stopCreateDataset = function(){		
		disableTables(false);
		$scope.status = 'stopped';
	};

	var prepareDataset = function(dataset){
		//var dataset = angular.copy(datasetIn);
		dataset.visibility = 'private';
		dataset.unpublished = 'true';	
		
		delete dataset['license'];
		delete dataset['opendata'];
		delete dataset['dcat'];
		
		for (var int = 0; int < dataset.components.length; int++) {
			if (dataset.components[int].alias == null || dataset.components[int].alias == '')
				dataset.components[int].alias=dataset.components[int].name;
		}
		
		console.log("tenantCode", $scope.defaultMetadata.tenantCode);
		dataset.idTenant = $scope.allTenantsMap[$scope.defaultMetadata.tenantCode].idTenant;//21;
		
		if($scope.defaultMetadata.domain.toUpperCase() == "MULTI")
			dataset.multiSubdomain = $scope.defaultMetadata.subdomain.subdomaincode;
		else
			dataset.idSubdomain = $scope.allSubdomainsMap[$scope.defaultMetadata.subdomain.subdomaincode].idSubdomain;
		
		dataset.requestername = $scope.defaultMetadata.requestername;
		dataset.requestersurname = $scope.defaultMetadata.requestersurname;
		dataset.requesteremail = $scope.defaultMetadata.requesteremail;
		dataset.jdbcdbname = $scope.defaultMetadata.jdbcdbname;
		dataset.jdbcdbtype = $scope.defaultMetadata.jdbcdbtype;
		dataset.jdbcdbschema = $scope.defaultMetadata.jdbcdbschema;
		dataset.jdbcdburl = $scope.defaultMetadata.jdbcdburl;
		
		dataset.tags = $scope.defaultMetadata.tags;
		dataset.availablehive = "true";
		return dataset;
	};

	var disableTables  = function(disabled){
		for (var tableIndex = 0; tableIndex < $scope.tables.length; tableIndex++) {
			$scope.tables[tableIndex].disabled = disabled; 
		}
	};


	
	var createDataset = function() {
		var tableIndex = $scope.tables.length;
		$scope.status="running";

		var foundDatasetToUpdate= false;
		for (var tableIndex = 0; tableIndex < $scope.tables.length; tableIndex++) {
			if($scope.tables[tableIndex].importTable === true){
				$scope.tables[tableIndex].importTable = false;
				foundDatasetToUpdate = true;
				var dataset = prepareDataset($scope.tables[tableIndex].dataset);
				$scope.dbImport.currentDatasetName = dataset.datasetname;
				
				console.log("dataset", dataset);
				if($scope.tables[tableIndex].status=="new"){
					adminAPIservice.createDataset($scope.organizationCode, dataset).success(function(response) {
					//adminAPIservice.createDataset("CSI", dataset).success(function(response) {
						console.log("createDataset SUCCESS", response);
						$scope.dbImport.totalOk++;
						$scope.dbImport.totalCreate++;
						$scope.dbImport.datasetCreated.push({"datasetcode": response.datasetcode,"iddataset": response.iddataset});
						$scope.tables[tableIndex].statusfeedback='import-ok';
						$scope.tables[tableIndex].statusmessage='Create success - idDataset: ' + response.iddataset + ' Datasetcode: ' + response.datasetcode;
						createDataset();
					}).error(function(response){
						console.error("createDataset ERROR: ", response);
						$scope.tables[tableIndex].statusfeedback='import-ko';
						if(response && response.errorName)
							$scope.dbImport.currentError= response.errorName;
						else if(response && response.errorCode)
							$scope.dbImport.currentError= response.errorCode;
	
						$scope.tables[tableIndex].statusmessage='Create failed - Error: ' + $scope.dbImport.currentError;
	
						
						//dbImport.currentError=err;
						$scope.dbImport.datasetWithError.push($scope.dbImport.currentDatasetName);
						$scope.status="pause";
						$scope.dbImport.totalKo++;
					});			
				}
				else{
					//adminAPIservice.updateDataset($scope.organizationCode, dataset).success(function(response) {
					adminAPIservice.updateDataset($scope.organizationCode, dataset).success(function(response) {
						console.log("updateDataset SUCCESS", response);
						$scope.dbImport.totalOk++;
						$scope.dbImport.totalUpdate++;
						$scope.dbImport.datasetUpdated.push({"datasetcode": response.datasetcode,"iddataset": response.iddataset});
						$scope.tables[tableIndex].statusfeedback='import-ok';
						$scope.tables[tableIndex].statusmessage='Updat success - idDataset: ' + response.iddataset + ' Datasetcode: ' + response.datasetcode;
						createDataset();

					}).error(function(response){
						console.error("updateDataset ERROR", response);
						$scope.tables[tableIndex].statusfeedback='import-ko';
						if(response && response.errorName)
							$scope.dbImport.currentError= response.errorName;
						else if(response && response.errorCode)
							$scope.dbImport.currentError= response.errorCode;
						
						$scope.tables[tableIndex].statusmessage='Update failed - Error: ' + $scope.dbImport.currentError;

						$scope.dbImport.datasetWithError.push($scope.dbImport.currentDatasetName);
						$scope.dbImport.status="pause";
						$scope.dbImport.totalKo++;
					});
				}
				
				
//				if($scope.dbImport.totalOk == 5){
//					$scope.tables[tableIndex].status='import-ko';
//					$scope.tables[tableIndex].statusmessage='Import failed - Error: errore';
//					$scope.dbImport.totalKo++;
//					$scope.status="pause";
//					$scope.dbImport.currentError = "Messaggio di errore";
//				}
//				else{
//					$scope.dbImport.totalOk++;
//					$scope.tables[tableIndex].status='import-ok';
//					$scope.tables[tableIndex].statusmessage='Import success - Datasetcode: ciao';
//					createDataset();
//				}
				
				break;
			}
			if(!foundDatasetToUpdate){
				$scope.status = "finish"; 
				disableTables(false);
				$scope.dbImport.currentDatasetName ="-";
			}
		}
		
		
//		while (tableIndex--) {
//		    if($scope.tables[tableIndex].importTable){
//		    	var dataset = $scope.tables.slice(tableIndex,tableIndex+1)[0].dataset;
//		    	dataset.importStatus = $scope.tables[tableIndex].status;
//		    	$scope.dbImport.datasetList.push(dataset);
//		     }
//		}
//		console.log("createDataset", $scope.dbImport.datasetList);
//		if($scope.dbImport.datasetList.length==0){
//			$scope.dbImport.status = "finish";
//			$scope.dbImport.currentDatasetName ="";
//		}
//		else{
//			$scope.status="running";
//			var dataset = $scope.dbImport.datasetList.pop();
//			if(typeof dataset.components != 'undefined' && dataset.components.length>0){
//				for(var componentIndex = dataset.components.length -1; componentIndex >= 0 ; componentIndex--){
//		    	    if(dataset.components[componentIndex].skipColumn){
//		    	        dataset.components.splice(componentIndex, 1);
//		    	    }
//				}
//			}
//			
//			$scope.dbImport.currentDatasetName = dataset.datasetname;
//
//			if(dataset.opendata && !(dataset.opendata.opendataupdatedate || dataset.opendata.opendataexternalreference || 
//					dataset.opendata.lastupdate || dataset.opendata.opendataauthor || dataset.opendata.opendatalanguage))
//				delete dataset['openData'];
//		
//			if(dataset.license && dataset.license.description==null && dataset.license.licesecode==null)
//				delete dataset['license'];
//			
//			/*valori fissi - rivedere */
//			dataset.visibility = 'private';
//			dataset.unpublished = 'true';	
//			
//			delete dataset['license'];
//			delete dataset['opendata'];
//			dataset.tags[0] = '330';
//
//			for (var int = 0; int < dataset.components.length; int++) {
//				if (dataset.components[int].alias == null || dataset.components[int].alias == '')
//				dataset.components[int].alias=dataset.components[int].name;
//			}
//			
//			console.log("create - dataset", dataset);
//			
//			$scope.admin_response = {};
//				adminAPIservice.createDataset($scope.organizationCode, dataset).success(function(response) {
//					console.log("createDataset SUCCESS", response);
//					$scope.dbImport.totalOk++;
//					$scope.dbImport.totalCreate++;
//					$scope.dbImport.datasetCreated.push({"datasetcode": response.datasetcode,"iddataset": response.iddataset});
//					if($scope.dbImport.datasetList.length==0){
//						console.log("finish!");
//						$scope.dbImport.status = "finish";
//						$scope.dbImport.currentDatasetName ="";
//					}
//					else{
//						console.log("continue");
//						if($scope.dbImport.status=="running")
//							createDataset(datasetList);
//					}
//				}).error(function(response){
//					console.error("createDataset ERROR: ", response);
//					if(response && response.errorName)
//						$scope.dbImport.currentError= response.errorName;
//					else if(response && response.errorCode)
//						$scope.dbImport.currentError= response.errorCode;
//
//					
//					//dbImport.currentError=err;
//					$scope.dbImport.datasetWithError.push($scope.dbImport.currentDatasetName);
//					$scope.dbImport.status="pause";
//					$scope.dbImport.totalKo++;
//				});
//		}
	};
	

	$scope.selectAllTableFlag = true;
	$scope.toggleSelectTables = function(selectAllTableFlag){
		if($scope.tables && $scope.tables.length>0){
			for (var tableIndex = 0; tableIndex < $scope.tables.length; tableIndex++) {
				$scope.tables[tableIndex].importTable = !selectAllTableFlag;
			}
		}
	};
}]);

appControllers.controller('confirmImportMetadataDialogCtrl', [ '$scope',  '$modalInstance',
    function($scope, $modalInstance) {
	
	 $scope.ok = function () {$modalInstance.close();};

	 $scope.cancel = function () {$modalInstance.dismiss('cancel');};
	
	
}]);




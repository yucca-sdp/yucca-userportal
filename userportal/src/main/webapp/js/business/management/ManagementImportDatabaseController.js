/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */

appControllers.controller('ManagemenImportDatabasetWizardCtrl', [ '$scope', '$route', '$location', 'adminAPIservice' ,'readFilePreview','info', '$upload', '$translate','$modal', 'devService',
                                                              function($scope, $route, $location, adminAPIservice, readFilePreview, info, $upload, $translate, $modal, devService) {
	$scope.tenantCode = $route.current.params.tenant_code;
	
	$scope.validationPatternSubdomain = Constants.VALIDATION_PATTERN_NO_SPACE;


	$scope.currentStep = 'start';
	$scope.wizardSteps = [{'name':'start', 'style':''},
	                      {'name':'requestor', 'style':''},
	                      {'name':'metadata', 'style':''},
	                      {'name':'database', 'style':''},
	                      {'name':'tables', 'style':''},
	                      {'name':'customize', 'style':''},
	                      ];

	var refreshWizardToolbar = function(){
		var style = 'step-done';
		for (var int = 0; int < $scope.wizardSteps.length; int++) {
			$scope.wizardSteps[int].style = style;
			if($scope.wizardSteps[int].name == $scope.currentStep)
				style = '';
		};
	};
	
	refreshWizardToolbar();

	
	$scope.OPENDATA_LANGUAGES = Constants.OPENDATA_LANGUAGES;
	
	$scope.importConfig = {};
	
	$scope.defaultMetadata = {"datasourceType": Constants.DATASOURCE_TYPE_DATASET,tags: new Array(), groups: new Array(), unpublished: false, visibility: 'private', idTenant:info.getActiveTenant().idTenant};
	//REMOVE
	$scope.datasetReady = true;
	
	$scope.chooseSourceType  = function(sourceType){
		$scope.importConfig.sourceType = sourceType;
		$scope.goToDatabase();
	};
	

	$scope.importConfig.sqlSourcefile;
	$scope.alert = {admin_response:{}};
	
	$scope.onSqlSourceSelect = function($files) {
		$scope.alert.admin_response = {};

		if( $files[0] !=null &&  $files[0].size>Constants.DATABASE_IMPORT_SOURCEFILE_MAX_FILE_SIZE){
			$scope.alert.admin_response.type = 'warning';
			$scope.alert.admin_response.message = 'MANAGEMENT_IMPORT_DATABASE_SOURCEFILE_TOOBIG_WARNING';
			$scope.importConfig.sqlSourcefile = null;
		}
		else{
			$scope.importConfig.sqlSourcefile = $files[0];
		}
	};

	
	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};
	
	
	$scope.canCreatePublicDataset = function(){
		return info.getActiveShareInformationType() == "public" &&  $scope.defaultMetadata.unpublished!=1;
	}; 

	$scope.canShareDataset = function(){
		return info.getActiveShareInformationType() == "public";
	}; 

	
	$scope.checkTag = function(){ 
		return !(typeof $scope.defaultMetadata.tags != "undefined" && $scope.defaultMetadata.tags.length > 0);
	};




	
	$scope.user = info.getInfo().user;
	if($scope.user!=undefined && $scope.user.loggedIn==true){
		$scope.defaultMetadata.requestername=$scope.user.firstname;
		$scope.defaultMetadata.requestersurname=$scope.user.lastname;
		$scope.defaultMetadata.requestermail=$scope.user.email;
	}
	$scope.checkDcatFields = function(table){
		var isOk = false;
		if(typeof table != 'undefined' && table !=null && 
		   typeof table.dataset != 'undefined' && table.dataset !=null){
			if( table.dataset.unpublished)
				isOk = true;
			else{
				isOk =  typeof table.dataset.dcat !=  'undefined'  && table.dataset.dcat !=null && 
					typeof table.dataset.dcat.dcatrightsholdername !=  'undefined' && table.dataset.dcat.dcatrightsholdername !=null &&table.dataset.dcat.dcatrightsholdername !='' &&
					typeof table.dataset.dcat.dcatnomeorg !=  'undefined' && table.dataset.dcat.dcatnomeorg !=null &&table.dataset.dcat.dcatnomeorg !='' &&
					typeof table.dataset.dcat.dcatemailorg !=  'undefined' && table.dataset.dcat.dcatemailorg !=null &&table.dataset.dcat.dcatemailorg !='';
			}
			
		} 
		
		return isOk;
	};
	
	$scope.checkAllDcatFields = function(){
		var allOk = true;
		for (var tableIndex = 0; tableIndex < $scope.tables.length; tableIndex++) {
			if($scope.tables[tableIndex].importTable && !$scope.checkDcatFields($scope.tables[tableIndex])){
				allOk = false;
				break;
			}
		}
		return allOk;
	};

	$scope.saveError = null;
	$scope.saveErrors = null;


	
	$scope.cancel = function(){
		$location.path('management/datasets/'+$scope.tenantCode);
	};

	$scope.tables = [];
	
	
	$scope.goToStart  = function(){ 
		$scope.importConfig = {};

		$scope.defaultMetadata= {"info":{
			"visibility":"private",
			"tenantssharing":{"tenantsharing": new Array()},
			"tags": new Array()}
		}; 

		if($scope.user!=undefined && $scope.user.loggedIn==true){
			$scope.defaultMetadata.requestername=$scope.user.firstname;
			$scope.defaultMetadata.requestersurname=$scope.user.lastname;
			$scope.defaultMetadata.requestermail=$scope.user.email;
		}
		
		
		
		$scope.dbImport.currentDatasetName =  ""; 
		$scope.dbImport.status = "ready"; 
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
		$scope.newTenantSharing = false;

		$scope.currentStep = 'start'; refreshWizardToolbar();
	};
	
	$scope.goToRequestor  = function(){ 
		$scope.alert.admin_response = {};
		var oneSelected = false;
		for (var tableIndex = 0; tableIndex < $scope.tables.length; tableIndex++) {
			if($scope.tables[tableIndex].importTable){
				oneSelected = true;
				break;
			}
		}
		if(!oneSelected){
			$scope.alert.admin_response = {'type': 'warning','message':'MANAGEMENT_IMPORT_DATABASE_TABLES_ZERO_SELECTED_WARNING'};
		}
		else
			$scope.currentStep = 'requestor';refreshWizardToolbar();
	};
	
	$scope.goToMetadata  = function(){ $scope.currentStep = 'metadata';refreshWizardToolbar();};
	$scope.goToDatabase  = function(){ $scope.currentStep = 'database';refreshWizardToolbar();};
	
	var isNewField = function(field, newFields){
		var res = false;
		for (var newIndex = 0; newIndex < newFields.length; newIndex++) {
			if(field.sourcecolumnname == newFields[newIndex].sourcecolumnname){
				res = true;
				break;
			}
		}
		
		return res;
	};
	

	
	$scope.loadTables = function(){
		$scope.alert.admin_response = {};
		if($scope.importConfig.dbType == "" || $scope.importConfig.dbType == null)
			$scope.alert.admin_response = {'type': 'warning','message':'MANAGEMENT_IMPORT_DATABASE_DBTYPE_NULL_WARNING'};
		
		if($scope.importConfig.sourceType == "database"){
			if($scope.importConfig.dbType!='HIVE' && 
			    ($scope.importConfig.jdbcHostname == null || $scope.importConfig.jdbcHostname == "" ||
				 $scope.importConfig.jdbcDbname == null || $scope.importConfig.jdbcDbname == ""  ||
				 $scope.importConfig.jdbcUsername == null || $scope.importConfig.jdbcUsername == "" ||
				 $scope.importConfig.jdbcPassword == null || $scope.importConfig.jdbcPassword == "")){
				$scope.alert.admin_response = {'type': 'warning','message':'MANAGEMENT_IMPORT_DATABASE_JDBC_PARAMS_WARNING'};
			}

		}
		else if($scope.importConfig.sourceType == "database"){
			if($scope.importConfig.sqlSourcefile==null){
				$scope.alert.admin_response = {'type': 'warning','message':'MANAGEMENT_IMPORT_DATABASE_SOURCEFILE_NULL_WARNING'};
			}
		}
		
		$scope.importConfig.organizationCode = info.getActiveTenant().organization.organizationcode;
		$scope.importConfig.tenantCode = info.getActiveTenant().tenantcode;

		if(typeof $scope.alert.admin_response.message!='undefined')
			return;
		$scope.isLoadingDB = true;
		
		adminAPIservice.importMetadata(info.getActiveTenant(),$scope.importConfig).success(function(response, status, headers, config) {
			console.log("importDatabase", response);
			$scope.isLoadingDB = false;

			$scope.tables = response;
			$scope.selectTablesFlag = true;
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
			}

			$scope.goToTables();

		}).error(function(response, status) {
			console.error("importDatabase error", response);
			$scope.isLoadingDB = false;
			$scope.alert.admin_response.type = 'danger';
			$scope.alert.admin_response.message = 'MANAGEMENT_IMPORT_DATABASE_ERROR_CONNECTION';
			

		});
	};
	
	$scope.goToTables  = function(){ $scope.currentStep = 'tables';refreshWizardToolbar();};
	
	
	
	$scope.showTablesColumns = function(tableIndex){
		$modal.open({
	      templateUrl: 'importDatabaseTablesColumns.html',
	      controller: 'ManagementDatasetImportTablesColumnsCtrl',
	      size: 'lg',
	      scope: $scope,
	      resolve: {
	    	  selectedTableIndex: function () {return tableIndex;}
	      	}
    	});
	};
	
	
	$scope.showTablesWarnings = function(tableIndex){
		$modal.open({
	      templateUrl: 'importDatabaseTablesWarnings.html',
	      controller: 'ManagementDatasetImportTablesWarningsCtrl',
	      size: 'lg',
	      scope: $scope,
	      resolve: {
	    	  selectedTableIndex: function () {return tableIndex;},
	      	}
    	});
	};
	
	
	$scope.goToCustomize  = function(){
		console.log("defaultMetadata", $scope.defaultMetadata);
		for (var tableIndex = 0; tableIndex < $scope.tables.length; tableIndex++) {
			
			if($scope.tables[tableIndex].importTable && !$scope.isTableCustomized(tableIndex) && $scope.tables[tableIndex].status == 'new'){
//				$scope.tables[tableIndex].dataset = angular.copy($scope.defaultMetadata);
				for (var infoProp in $scope.defaultMetadata) {
					
				    if ($scope.defaultMetadata.hasOwnProperty(infoProp) && infoProp != 'datasetname' && infoProp != 'description' && infoProp != 'components'  && infoProp != 'dcat' && infoProp != 'license'
				    	&& infoProp != 'openData'&& infoProp != 'sharingTenants' && infoProp != 'tags') {
				    	$scope.tables[tableIndex].dataset[infoProp] = $scope.defaultMetadata[infoProp];
				    }
				    $scope.tables[tableIndex].dataset.dcat = angular.copy($scope.defaultMetadata.dcat);
				    $scope.tables[tableIndex].dataset.license = angular.copy($scope.defaultMetadata.license);
				    $scope.tables[tableIndex].dataset.openData = angular.copy($scope.defaultMetadata.openData);
				    $scope.tables[tableIndex].dataset.sharingTenants = angular.copy($scope.defaultMetadata.sharingTenants);
				    $scope.tables[tableIndex].dataset.tags = angular.copy($scope.defaultMetadata.tags);

				}
			}
		}

		$scope.currentStep = 'customize';refreshWizardToolbar();
	
	};
	var datasetList = [];
	
	
	$scope.dbImport = {"progressBar":function(){return this.delta*(this.total-this.datasetList.length);}, 
			"currentDatasetName": "", 
			"status": "ready", 
			"percent": function(){return this.total==0?0:Math.round((this.total-this.datasetList.length)*100/this.total);}, 
			"currentIndex":function(){return this.total-this.datasetList.length;}, 
			"total": 0, 
			"totalOk": 0,
			"totalUpdate": 0,
			"totalCreate": 0,
			"totalKo": 0,
			"datasetCreated":[],
			"datasetUpdated": [],
			"datasetWithError":[], 
			"currentError": null, 
			"datasetList": [], 
			"delta":1};

	
	$scope.goToFinish  = function(){
		$scope.currentStep = 'finish';
		refreshWizardToolbar();
		var tableIndex = $scope.tables.length;
		$scope.dbImport.datasetList = new Array();
		while (tableIndex--) {
		    if($scope.tables[tableIndex].importTable){
		    	//var dataset = $scope.tables.splice(tableIndex,1)[0].dataset;
		    	var dataset = $scope.tables.slice(tableIndex,tableIndex+1)[0].dataset;
		    	dataset.importStatus = $scope.tables[tableIndex].status;
		    	$scope.dbImport.datasetList.push(dataset);
		     }
		}
		$scope.dbImport.delta = 100/$scope.dbImport.datasetList.length;
		$scope.dbImport.total = $scope.dbImport.datasetList.length;

		//createDataset(datasetList);
	};
	
	$scope.isTableCustomized = function(tableIndex){
		return $scope.tables[tableIndex].customized.name ||
			$scope.tables[tableIndex].customized.publishStore ||
			$scope.tables[tableIndex].customized.visibility ||
			$scope.tables[tableIndex].customized.dcat ||
			$scope.tables[tableIndex].customized.columns;
	};


	$scope.selectAllTableFlag = true;
	$scope.toggleSelectTables = function(selectAllTableFlag){
		if($scope.tables && $scope.tables.length>0){
			for (var tableIndex = 0; tableIndex < $scope.tables.length; tableIndex++) {
				$scope.tables[tableIndex].importTable = !selectAllTableFlag;
			}
		}
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
		}
	};
	
	$scope.editDatasetName = function(tableIndex){
		$modal.open({
	      templateUrl: 'importDatabaseEditDatasetName.html',
	      controller: 'ManagementDatasetImportDatabaseEditDatasetNameCtrl',
	      scope: $scope,
	      resolve: {
	    	  selectedTableIndex: function () {return tableIndex;},
	      	}
    	});
	};
	
	$scope.editDatasetPublishStore = function(tableIndex){
		
		$modal.open({
	      templateUrl: 'importDatabaseEditDatasetPublisStore.html',
	      controller: 'ManagementDatasetImportDatabaseEditPublishStoreCtrl',
	      scope: $scope,
	      size: 'lg',
	      resolve: {
	    	  selectedTableIndex: function () {return tableIndex;},
	    	  
	      	}
    	});

	};
	
	
	
	$scope.editDatasetDCat = function(tableIndex){
		
		$modal.open({
	      templateUrl: 'importDatabaseEditDCat.html',
	      controller: 'ManagementDatasetImportDatabaseEditDCatCtrl',
	      scope: $scope,
	      resolve: {
	    	  selectedTableIndex: function () {return tableIndex;},
	    	  
	      	}
    	});
	};
	
	$scope.editDatasetColumns = function(tableIndex){
		
		$modal.open({
	      templateUrl: 'importDatabaseEditColumns.html',
	      controller: 'ManagementDatasetImportDatabaseEditColumnsCtrl',
	      size: 'lg',
	      scope: $scope,
	      resolve: {
	    	  selectedTableIndex: function () {return tableIndex;},
	    	  
	      	}
    	});
	};
	
	$scope.createDatasets = function(){
		createDataset($scope.tables);
	};
	
	


	
	var createDataset = function() {
		console.log("createDataset", $scope.dbImport.datasetList);
		if($scope.dbImport.datasetList.length==0){
			$scope.dbImport.status = "finish";
			$scope.dbImport.currentDatasetName ="";
		}
		else{
			$scope.dbImport.status="running";
			var dataset = $scope.dbImport.datasetList.pop();
			if(typeof dataset.components != 'undefined' && dataset.components.length>0){
				for(var componentIndex = dataset.components.length -1; componentIndex >= 0 ; componentIndex--){
		    	    if(dataset.components[componentIndex].skipColumn){
		    	        dataset.components.splice(componentIndex, 1);
		    	    }
				}
			}
			
			$scope.dbImport.currentDatasetName = dataset.datasetname;

			if(dataset.opendata && !(dataset.opendata.opendataupdatedate || dataset.opendata.opendataexternalreference || 
					dataset.opendata.lastupdate || dataset.opendata.opendataauthor || dataset.opendata.opendatalanguage))
				delete dataset['openData'];
		
			if(dataset.license && dataset.license.description==null && dataset.license.licesecode==null)
				delete dataset['license'];

			if(dataset.visibility == 'public')
				delete dataset['sharingTenants'];
			if(dataset.visibility != 'private') 
				delete dataset['copyright'];				
			else
			{
				delete dataset['license'];
				delete dataset['opendata'];
			}
			
			for (var int = 0; int < dataset.components.length; int++) {
				if (dataset.components[int].alias == null || dataset.components[int].alias == '')
				dataset.components[int].alias=dataset.components[int].name;
			}
			
			console.log("crate - dataset", dataset);
			$scope.admin_response = {};

			
			if(dataset.importStatus == 'new'){
		
				adminAPIservice.createDataset(info.getActiveTenant(), dataset).success(function(response) {
					console.log("createDataset SUCCESS", response);
					$scope.dbImport.totalOk++;
					$scope.dbImport.totalCreate++;
					$scope.dbImport.datasetCreated.push({"datasetcode": response.datasetcode,"iddataset": response.iddataset});
					if($scope.dbImport.datasetList.length==0){
						console.log("finish!");
						$scope.dbImport.status = "finish";
						$scope.dbImport.currentDatasetName ="";
					}
					else{
						console.log("continue");
						if($scope.dbImport.status=="running")
							createDataset(datasetList);
					}
				}).error(function(response){
					console.error("createDataset ERROR: ", response);
					if(response && response.errorName)
						$scope.dbImport.currentError= response.errorName;
					else if(response && response.errorCode)
						$scope.dbImport.currentError= response.errorCode;

					
					//$scope.dbImport.currentError=err;
					$scope.dbImport.datasetWithError.push($scope.dbImport.currentDatasetName);
					$scope.dbImport.status="pause";
					$scope.dbImport.totalKo++;
				});
				
				
		
			
			}
			else{

				adminAPIservice.updateDataset(info.getActiveTenant(), dataset).success(function(response) {
					console.log("updateDataset SUCCESS", response);
					$scope.dbImport.totalOk++;
					$scope.dbImport.totalUpdate++;
					$scope.dbImport.datasetUpdated.push({"datasetcode": response.datasetcode,"iddataset": response.iddataset});
					if($scope.dbImport.datasetList.length==0){
						console.log("fine!");
						$scope.dbImport.status = "finish";
						$scope.dbImport.currentDatasetName ="";
					}
					else{
						console.log("ancora");
						if($scope.dbImport.status=="running")
							createDataset(datasetList);
					}

				}).error(function(response){
					console.error("updateDataset ERROR", response);
					console.error("createDataset ERROR: ", response);
					if(response && response.errorName)
						$scope.dbImport.currentError= response.errorName;
					else if(response && response.errorCode)
						$scope.dbImport.currentError= response.errorCode;

					$scope.dbImport.datasetWithError.push($scope.dbImport.currentDatasetName);
					$scope.dbImport.status="pause";
					$scope.dbImport.totalKo++;
				});
			}
			
		}
	};
	
	$scope.breakCreateDataset = function(){
		$scope.dbImport.status = "finish";
	};
	
	$scope.continueCreateDataset = function(){
		$scope.dbImport.status = "running";
		createDataset();
	};
	
} ]);


appControllers.controller('ManagementDatasetImportTablesWarningsCtrl', [ '$scope', '$modalInstance',  'selectedTableIndex', '$translate',
                                                                        function($scope, $modalInstance, selectedTableIndex,$translate) {
	$scope.table = $scope.tables[selectedTableIndex];
	var warnings  = $scope.tables[selectedTableIndex].warnings;
	$scope.warningsList = "No warning found";
	if(warnings && warnings.length>0){

		var warningsList = "<ul class='import-database-customize-table-warnings'>";
		for (var warningIndex = 0; warningIndex < warnings.length; warningIndex++) {
			warningsList += "<li>" + warnings[warningIndex] + "</li>";
		}
		warningsList += "</ul>";
		
		$scope.warningsList = warningsList;
}

$scope.cancel = function () {$modalInstance.dismiss('cancel');};
}]);


appControllers.controller('ManagementDatasetImportTablesColumnsCtrl', [ '$scope', '$modalInstance',  'selectedTableIndex', '$translate', 'adminAPIservice',
                                                                                  function($scope, $modalInstance, selectedTableIndex,$translate, adminAPIservice) {
	$scope.table = $scope.tables[selectedTableIndex];
	columns  = $scope.tables[selectedTableIndex].dataset.components;
	$scope.columnsTable = "No column found";
	var dataTypeList = {};
	adminAPIservice.loadDataTypes().success(function(response) {
		console.log("ManagementDatasetImportTablesColumnsCtrl - loadDataTypes",response);
		for (var dtIndex = 0; dtIndex < response.length; dtIndex++) {
			if(response[dtIndex].idDataType != Constants.COMPONENT_DATA_TYPE_BINARY)
				dataTypeList[response.idDataType]=response.datatypecode;
		}
	});
	if(columns && columns.length>0){
		
		var columnsTable = "<div><table class='table table-supercondensed import-database-customize-table-columns text-left	'><thead><tr><th>Column</th><th>Name</th><th>Type</th><th>Alias</th><th>Keys</th><tr></thead><tbody>";
		for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
			var newBadge = "";
			if(columns[columnIndex].isNewField)
				newBadge="<span class='import-database-column-new' title='"+$translate.instant('MANAGEMENT_IMPORT_DATABASE_TABLES_NEW_COLUMNS_HINT')+"'>"+$translate.instant('MANAGEMENT_IMPORT_DATABASE_TABLES_NEW_COLUMNS')+"</span>&nbsp;&nbsp;";
			columnsTable += "<tr class='import-database-column-row'><td>" +newBadge + columns[columnIndex].sourcecolumnname + "</td><td>" + columns[columnIndex].name + "</td><td>" + columns[columnIndex].dataType.datatypecode + "</td><td>" + columns[columnIndex].alias + "</td><td>";
			if(columns[columnIndex].iskey == 1){
				columnsTable += "<i class='fa fa-key primary-key'  title='Primary key'></i> &nbsp;&nbsp;";
				if(typeof columns[columnIndex].foreignkey != 'undefined' && columns[columnIndex].foreignkey != null && columns[columnIndex].foreignkey != "null")
					columnsTable += columns[columnIndex].foreignkey;
			}
			else if(typeof columns[columnIndex].foreignkey != 'undefined' && columns[columnIndex].foreignkey != null && columns[columnIndex].foreignkey != "null"){
				columnsTable += "<i class='fa fa-key foreign-key' title='Foreign key'></i> &nbsp;&nbsp;"+columns[columnIndex].foreignkey;
			}
			else
				columnsTable += "&nbsp;";
			columnsTable += "</td></tr>";
		}
		columnsTable += "</tbody></table></div>";
		$scope.columnsTable = columnsTable;
	}
	
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
}]);


appControllers.controller('ManagementDatasetImportDatabaseEditDatasetNameCtrl', [ '$scope', '$modalInstance',  'selectedTableIndex',
                                                                                  function($scope, $modalInstance, selectedTableIndex) {
	$scope.table = $scope.tables[selectedTableIndex];
	$scope.datasetname = $scope.tables[selectedTableIndex].dataset.datasetname;
	$scope.description = $scope.tables[selectedTableIndex].dataset.description;
	//$scope.externalReference = $scope.tables[selectedTableIndex].dataset.info.externalReference;
	
	$scope.ok = function(){
		$scope.tables[selectedTableIndex].customized.name = true;
		
		$scope.tables[selectedTableIndex].dataset.datasetName = $scope.datasetname;
		$scope.tables[selectedTableIndex].dataset.description= $scope.description;
		//$scope.tables[selectedTableIndex].dataset.info.externalReference = $scope.externalReference;
		$modalInstance.close();
	};
	
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
}]);


appControllers.controller('ManagementDatasetImportDatabaseEditPublishStoreCtrl', [ '$scope', '$modalInstance', '$modal', 'info', 'selectedTableIndex',
                                                                                    function($scope, $modalInstance, $modal, info, selectedTableIndex) {
	$scope.table = $scope.tables[selectedTableIndex];
	
	$scope.dataset = angular.copy($scope.tables[selectedTableIndex].dataset);



	$scope.ok = function(){
		$scope.tables[selectedTableIndex].customized.publishStore = true;
		
		$scope.tables[selectedTableIndex].dataset.copyright = $scope.dataset.copyright;
		$scope.tables[selectedTableIndex].dataset.disclaimer = $scope.dataset.disclaimer;
		$scope.tables[selectedTableIndex].dataset.externalreference = $scope.dataset.externalreference;
		$scope.tables[selectedTableIndex].dataset.idSubdomain = $scope.dataset.idSubdomain;
		$scope.tables[selectedTableIndex].dataset.multiSubdomain = $scope.dataset.multiSubdomain;
		$scope.tables[selectedTableIndex].dataset.unpublished = $scope.dataset.unpublished;
		$scope.tables[selectedTableIndex].dataset.visibility = $scope.dataset.visibility;
		$scope.tables[selectedTableIndex].license = angular.copy($scope.dataset.license);
		$scope.tables[selectedTableIndex].openData = angular.copy($scope.dataset.openData);
		$scope.tables[selectedTableIndex].sharingTenants = angular.copy($scope.dataset.sharingTenants);
		$scope.tables[selectedTableIndex].license = angular.copy($scope.dataset.license);
		$scope.tables[selectedTableIndex].tags = angular.copy($scope.dataset.tags);
		
		$modalInstance.close();
	};
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
	

}]);



appControllers.controller('ManagementDatasetImportDatabaseEditDCatCtrl', [ '$scope', '$modalInstance', 'selectedTableIndex',
                                                                                    function($scope, $modalInstance, selectedTableIndex) {
	$scope.table = $scope.tables[selectedTableIndex];
		
	$scope.dataset = angular.copy($scope.tables[selectedTableIndex].dataset);

	$scope.ok = function(){
		$scope.tables[selectedTableIndex].customized.dcat = true;
		$scope.tables[selectedTableIndex].dataset.dcat = angular.copy($scope.dataset.dcat);
		$modalInstance.close();
	};
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};


	
	
}]);


appControllers.controller('ManagementDatasetImportDatabaseEditColumnsCtrl', [ '$scope', '$modalInstance', 'selectedTableIndex',
                                                                           function($scope, $modalInstance, selectedTableIndex) {
	$scope.table = $scope.tables[selectedTableIndex];
	$scope.dataset = angular.copy($scope.tables[selectedTableIndex].dataset);

	$scope.preview= {components:new Array(),"type":"importDatabase"};
	$scope.datasetReady = false;
	
	
	for (var cIndex = 0; cIndex < $scope.dataset.components.length; cIndex++) {
		$scope.preview.components.push($scope.dataset.components[cIndex]);
	}
	$scope.datasetReady = true;
	
	$scope.ok = function(){
		$scope.tables[selectedTableIndex].customized.columns = true;
		$scope.tables[selectedTableIndex].dataset.components = angular.copy($scope.dataset.components);

		$modalInstance.close();
	};
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
	
	}]);



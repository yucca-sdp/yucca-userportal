/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */

appControllers.controller('BulkCtrl', [ '$scope', "$route", 'adminAPIservice', '$translate', '$modal', '$timeout' ,
                                           function($scope, $route, adminAPIservice, $translate, $modal,$timeout) {
	console.log("$modal", $modal);
		
	$scope.datasetsList = [];
	$scope.filteredDatasetsList = [];
	$scope.filter = {};
	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.datasetsList.length;
	$scope.predicate = '';
	$scope.showLoading = false;
	
	var errors = "";
	
	$scope.actions = Constants.STREAM_ACTIONS;
	$scope.lastTenantUsed = null;
	
	$scope.allTenants = [];
    var loadTenants = function(){
		
		adminAPIservice.loadTenants().success(function(response) {
			console.info("loadTenants - response",response);	
    		response.sort(function(a, b) { 
    		    return ((a.tenantcode < b.tenantcode) ? -1 : ((a.tenantcode > b.tenantcode) ? 1 : 0));
    		});

			
			$scope.allTenants = response;
			
		}).error(function(response) {
			console.error("loadTenants ERROR ",response);	
		});
	}
	
	loadTenants();
	
	$scope.getTenant = function(tenantcode){
		console.log("getTenant - selected tenant",tenantcode);
		for(index = 0; index < $scope.allTenants.length; index++){
			if($scope.allTenants[index].tenantcode == tenantcode) return $scope.allTenants[index];
	
		}
	}
	
	$scope.allGroups = [];
   $scope.loadGroups = function(tenant){
		console.log("loadGroups - selected tenant",tenant);
		adminAPIservice.loadGroups(tenant.tenantcode,tenant.organization.organizationcode).success(function(response) {
			console.info("loadGroups - response",response);	
    		response.sort(function(a, b) { 
    		    return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
    		});

			
			$scope.allGroups = response;
			
		}).error(function(response) {
			console.error("loadGroups ERROR ",response);	
		});
	}
	
	
	/*
	 * LOAD DATASETS
	 */
   
   $scope.loadDatasets = function(){
	   console.log("loadDatasets",$scope.datasourcegroup);
	   if( typeof $scope.datasourcegroup == 'undefined' || $scope.datasourcegroup == null || $scope.datasourcegroup == '') 
		   $scope.loadDatasetsWithoutGroup();
	   else 
		   $scope.loadDatasetsFilteredByGroup();
   }
	$scope.bigMessage = {};
	
	$scope.versionRequired = function(){		
		if ($scope.datasourcegroup != null || $scope.datasourcegroup!='undefined') return true;
		else return false;
	}
	
	$scope.loadDatasetsWithoutGroup = function(){
		$scope.datasetsList = [];
		$scope.lastTenantUsed = $scope.tenantForDataset;

		$scope.showLoading = true;
		console.log("loadDatasets - tenantForDataset",$scope.tenantForDataset)
		adminAPIservice.loadDatasets($scope.tenantForDataset).success(function(response) {
			$scope.showLoading = false;
			$scope.bigMessage.style = "text-info";
			console.log("loadDatasets - response",response);
			var rowIndex = 0;
			for (var i = 0; i < response.length; i++) {
//				if(response[i].dataset.datasetSubtype.datasetSubtype=='bulkDataset'){
					var row = initRow(response[i]);
					row.rowIndex = rowIndex;
					$scope.datasetsList.push(row);				
					rowIndex++;
//				}
			}
			console.log("totale dataset ", $scope.datasetsList.length)
			$scope.totalItems = $scope.datasetsList.length;
		}).error(function(response) {
			console.log("loadDatasets - error",response);
			$scope.$parent.showMessage("danger", "UNEXPECTED_ERROR", "UNEXPECTED_ERROR_MESSAGE", "Detail: "+response);
			$scope.showLoading = false;
			$scope.lastTenantUsed = null;
		});
	};
	
	$scope.loadDatasetsFilteredByGroup = function(){
		$scope.datasetsList = [];
		$scope.lastTenantUsed = $scope.tenantForDataset;
		if(typeof $scope.datasourcegroupversion == 'undefined' || $scope.datasourcegroupversion == null || $scope.datasourcegroupversion==''){
			$scope.$parent.showMessage("warning", "WARNING", "DASHBOARD_BULK_WARNING_FILTER_GROUP_NO_VERSION");
		}
		else{
			$scope.showLoading = true;
			console.log("loadDatasetsFilteredByGroup - tenantForDataset",$scope.datasourcegroup)
			adminAPIservice.loadDatasetsByGroups($scope.datasourcegroup,$scope.datasourcegroupversion).success(function(response) {
				$scope.showLoading = false;
				$scope.bigMessage.style = "text-info";
				console.log("loadDatasets - response",response);
				var rowIndex = 0;
				for (var i = 0; i < response.length; i++) {
	//				if(response[i].dataset.datasetSubtype.datasetSubtype=='bulkDataset'){
						var row = initRow(response[i]);
						row.rowIndex = rowIndex;
						$scope.datasetsList.push(row);				
						rowIndex++;
	//				}
				}
				console.log("totale dataset ", $scope.datasetsList.length)
				$scope.totalItems = $scope.datasetsList.length;
			}).error(function(response) {
				console.log("loadDatasets - error",response);
				$scope.$parent.showMessage("danger", "UNEXPECTED_ERROR", "UNEXPECTED_ERROR_MESSAGE", "Detail: "+response);
				$scope.showLoading = false;
				$scope.lastTenantUsed = null;
			});
		}
	};
	
	
	var initRow = function(datasetIn){
		var row = {};
		row.dataset = datasetIn.dataset;
		row.dataset.visibility = datasetIn.visibility; 
		row.dataset.status = datasetIn.status; 
		row.dataset.tenantManager = datasetIn.tenantManager; 
		row.statusIcon = Helpers.stream.statusIcon(datasetIn);
		row.deploymentStatusCodeTranslated =  $translate.instant(datasetIn.status.statuscode);
		row.deploymentStatusCodeBullet =  ($translate.instant(datasetIn.status.statuscode)).substring(0,2);
		row.deploymentStatusCode =  datasetIn.status.statuscode;
		row.isSelected = false;
		row.isUpdating = false;
		row.updated = false;
		//row.ellipseNameLimit = 34-row.dataset.datasetcode.length;
		row.ellipseNameLimit = 15;
		row.version=datasetIn.version;
		row.domain=datasetIn.domain;
		row.subdomain=datasetIn.subdomain;
		row.organization=datasetIn.organization;
		row.groups = datasetIn.groups;
		return row;
	}
	
	/*$scope.datasetIconUrl= function(organizationCode, idstream){	
		return Constants.API_ADMIN_STREAMS_URL+"/"+idstream+"/icon?organizationCode="+organizationCode;
	};*/
		
	$scope.searchCodeFilter = function(row) {
		var keyword = new RegExp($scope.filter.codeFilter, 'i');
		return !$scope.filter.codeFilter || keyword.test(row.dataset.datasetcode);
	};

	$scope.$watch('filter.codeFilter', function(newCode) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
	});

	
	$scope.searchNameFilter = function(row) {
		var keyword = new RegExp($scope.filter.nameFilter, 'i');
		return !$scope.filter.nameFilter || keyword.test(row.dataset.datasetname);
	};

	$scope.$watch('filter.nameFilter', function(newName) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
	});
	
	$scope.searchGroupFilter = function(row) {
		var keyword = new RegExp($scope.filter.groupFilter, 'i');
		var result = false;
		for (i = 0; i<row.groups.length; i++) {
			 if (!$scope.filter.groupFilter || keyword.test(row.groups[i].name)) result = true;	
			
		}
		return result;
	};

	$scope.$watch('filter.groupFilter', function(newGroup) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
	});
	
	$scope.searchVersionFilter = function(row) {
		var keyword = new RegExp($scope.filter.versionFilter, 'i');
		var result = false;
		for (i = 0; i<row.groups.length; i++) {
			 if (!$scope.filter.groupFilter || keyword.test(row.groups[i].datasourcegroupversion)) result = true;	
			
		}
		return result;
	};

	$scope.$watch('filter.versionFilter', function(newVersion) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
	});
	
	$scope.searchDomainFilter = function(row) {
		var keyword = new RegExp($scope.filter.domainFilter, 'i');
		return !$scope.filter.domainFilter || keyword.test(row.domain.domaincode);
	};

	$scope.$watch('filter.domainFilter', function(newDomain) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
	});
	
	$scope.searchSubdomainFilter = function(row) {
		var keyword = new RegExp($scope.filter.subdomainFilter, 'i');
		return !$scope.filter.subdomainFilter || keyword.test(row.subdomain.subdomaincode);
	};

	$scope.$watch('filter.subdomainFilter', function(newSubdomain) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
	});

	
	$scope.viewUnistalledCheck = false;
	$scope.viewUnistalledFilter = function(row) {
		if(!$scope.viewUnistalledCheck){
			return (row.dataset.status && row.dataset.status.statuscode && row.dataset.status.statuscode!='uninst');
		}
		else
			return true;
	};



	$scope.updateSelection = function($event, rowIndex) {
		$scope.datasetsList[rowIndex].updated = false;
	};	
	
	$scope.clearSelection = function(){
		if($scope.datasetsList && $scope.datasetsList!=null){
			for (var i = 0; i < $scope.datasetsList.length; i++) {
				$scope.datasetsList[i].isSelected=false;
			}
		}
		
	}
	
	var getPageOfRow = function(row){
		var page = 1;
		for (var k = 0; k < $scope.filteredDatasetsList.length; k++) {
			if(row.rowIndex == $scope.filteredDatasetsList[k].rowIndex){
				page=Math.trunc(page/pageSize)+1;
				break; 
			}
		}
		return page;
	}
	
	$scope.selectAll = function($event){
		console.log("selectAll", $event)
		$scope.clearSelection();
		var checkbox = $event.target;
		console.log("checkbox.checked", checkbox.checked)

		if(checkbox.checked){
			console.log("checkbox.checked in", checkbox.checked)

			if($scope.filter.filteredDatasets && $scope.filter.filteredDatasets!=null){
				

				for (var i = 0; i < $scope.filter.filteredDatasets.length; i++) {
					console.log("$scope.filter.filteredDatasets[i].isSelected", $scope.filter.filteredDatasets[i].isSelected)

					$scope.filter.filteredDatasets[i].isSelected=true;
				}
			}
		}
	}

	
	$scope.openDataset = function(row) {
		  $modal.open({
			animation : true,
			//size: scope.size,
			templateUrl : 'detailDialog.html',
			controller : 'DetailDialogCtrl',
			backdrop  : 'static',
			resolve: { 
				row: function () {
					return row;
				}
			}
		});
	 };
	 
	 $scope.dbType  = Constants.BULK_DB_TYPE;
	 
	 $scope.jdbcdscode  = Constants.BULK_JDBC_DSCODE;
	 
	 $scope.flagHive = {availableHiveDefault:false,availableSpeedDefault:false,isTransformedDefault:false}
	 $scope.defaultWarning = null;
	 $scope.saveDefault = function(dbTypeSelect,jdbcdscodeSelect,defaultPrefix,defaultSuffix){
	 if (typeof defaultPrefix == 'undefined') {
			 defaultPrefix ='';
		 }
		 
		 if (typeof defaultSuffix == 'undefined') {
			 defaultSuffix ='';
		 }
		 $scope.originalDatasets = JSON.stringify($scope.datasetsList);
		 console.log("originalDatasets",$scope.originalDatasets);
		 var selectedDatasetCount = 0;
		 for (var i = 0; i < $scope.datasetsList.length; i++) {
			if($scope.datasetsList[i].isSelected) {
				//Imposto flag
				 selectedDatasetCount++;
				 $scope.datasetsList[i].dataset.availablehive = $scope.flagHive.availableHiveDefault;
				 $scope.datasetsList[i].dataset.availablespeed = $scope.flagHive.availableSpeedDefault;
				 $scope.datasetsList[i].dataset.istransformed = $scope.flagHive.isTransformedDefault;
				 
				 //Imposto HiveSchema
				 if (dbTypeSelect != null && dbTypeSelect != 'undefined') {
					 if (dbTypeSelect == 'ing')
						$scope.datasetsList[i].dataset.dbhiveschema = ('db_'+$scope.datasetsList[i].organization.organizationcode+'_'+$scope.datasetsList[i].domain.domaincode+'_'+$scope.datasetsList[i].subdomain.subdomaincode).toLowerCase();
					 else
						$scope.datasetsList[i].dataset.dbhiveschema = ('transf_'+$scope.datasetsList[i].organization.organizationcode+'_'+$scope.datasetsList[i].domain.domaincode+'_'+$scope.datasetsList[i].subdomain.subdomaincode).toLowerCase();
				 }
				 if (jdbcdscodeSelect != null && jdbcdscodeSelect != 'undefined') {
					i //Imposto HiveTable
					 if (jdbcdscodeSelect == 'jdbc') 				 
					 	$scope.datasetsList[i].dataset.dbhivetable = defaultPrefix + $scope.datasetsList[i].dataset.jdbctablename + defaultSuffix;
					 	else
						 $scope.datasetsList[i].dataset.dbhivetable = defaultPrefix + $scope.datasetsList[i].dataset.datasetcode + defaultSuffix;
				 }
				 $scope.datasetsList[i].isModified=true;
			}
		}	
		if(selectedDatasetCount==0)
			$scope.defaultWarning = {message:'DASHBOARD_BULK_DEFAULT_WARNING_NO_SELECTION'};
	 }
	 
	 $scope.cancelDefault = function() {
		 console.log("$scope.datasetsList",$scope.originalDatasets);
		 $scope.datasetsList = JSON.parse($scope.originalDatasets); 		 
	 }
	 
	 $scope.updateDatasets = function () {
				console.log("updateDatasets");
			
				datasetsToUpdate = new Array();
				for (var i = 0; i < $scope.datasetsList.length; i++) {
					var newDataset =  $scope.datasetsList[i].dataset;
					if($scope.datasetsList[i].isSelected ){
						newDataset.currentDataSourceVersion = $scope.datasetsList[i].version;
						datasetsToUpdate.push(newDataset);
					}
				}
				console.log("datasetsToUpdate",datasetsToUpdate);
				
			adminAPIservice.updateDatasets(datasetsToUpdate).success(function(response) {
				console.info("updateDatasets - response",response);
			}).error(function(response) {
				console.error("updateDatasets ERROR ",response);	
			});
		};
	     
} ]);

appControllers.controller('DetailDialogCtrl', [ '$scope', '$modalInstance', '$translate', 'row',
    function($scope, $modalInstance,$translate,row) {
	
		$scope.datasetname = row.dataset.datasetname;
		$scope.iddataset = row.dataset.iddataset;
		$scope.version = row.version;
		$scope.status = row.deploymentStatusCodeTranslated;
		$scope.description = row.dataset.description;
		$scope.jdbctable = row.dataset.jdbctablename;
		$scope.jdbcdbname = row.dataset.jdbcdbname;
		$scope.jdbcdbschema= row.dataset.jdbcdbschema;
		$scope.domain = row.domain.langit;
		$scope.subdomain = row.subdomain.langIt;
		$scope.yes = function () {
		    $modalInstance.close("yes");
		};
	
}]);

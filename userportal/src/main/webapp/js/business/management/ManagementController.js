/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */

/* Controllers */
appControllers.controller('ManagementCtrl', [ '$scope', '$route','info','$modal', 'adminAPIservice', '$translate', function($scope, $route, info, $modal, adminAPIservice, $translate) {
	$scope.$route = $route;
	if(!info.canManageStream() && ($scope.managementTab == 'streams' || $scope.managementTab == 'editStream' || $scope.managementTab == 'viewStream' || $scope.managementTab == 'newStream'|| $scope.managementTab == 'newStreamInternal' ||
			$scope.managementTab == 'virtualentities' || $scope.managementTab == 'editVirtualentity' || $scope.managementTab == 'viewVirtualentity' || $scope.managementTab == 'newVirtualentity'))
		$scope.managementTab = 'datasets';
	else
		$scope.managementTab = $route.current.params.managementTab;
	
	$scope.tenant = $route.current.params.tenant_code;

	$scope.buildTimestamp = BuildInfo.timestamp;

	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};
	
	$scope.isMenuActive= function(menuItem){

		var result = false;
		switch (menuItem){
		case 'dashboard':
			result =  ($scope.managementTab == 'dashboard');
			break;
		case 'streams':
			result =  ($scope.managementTab == 'streams' || $scope.managementTab == 'editStream' || $scope.managementTab == 'viewStream' || $scope.managementTab == 'newStream'|| $scope.managementTab == 'newStreamInternal');
			break;
		case 'virtualentities':
			result =  ($scope.managementTab == 'virtualentities' || $scope.managementTab == 'editVirtualentity' || $scope.managementTab == 'viewVirtualentity' || $scope.managementTab == 'newVirtualentity');
			break;
		case 'datasets':
			result =  ($scope.managementTab == 'datasets' || $scope.managementTab == 'editDataset' || $scope.managementTab == 'viewDataset' || $scope.managementTab == 'newDataset' ||  $scope.managementTab == 'uploadDataset');
			break;
		default:
			break;
		}
		return result;
	};
	
	$scope.streamIconUrl= function(organizationCode, idstream){
		return Constants.API_ADMIN_STREAM_URL.replace(new RegExp('{organizationCode}', 'gi'), organizationCode)+"/"+idstream+"/icon";
	};

	$scope.datasetIconUrl= function(organizationCode, iddataset){
		return Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), organizationCode)+"/"+iddataset+"/icon";
	};
	

}]);

appControllers.controller('ManagementDetailCtrl', [ '$scope', '$route', '$location', '$routeParams','adminAPIservice', 'info', '$modal', '$translate', 'sharedAdminResponse', 'sharedDatasource','$filter','localStorageService',
                                                           function($scope, $route, $location,$routeParams,adminAPIservice, info, $modal, $translate, sharedAdminResponse, sharedDatasource, $filter,localStorageService) {
  	$scope.tenantCode = $route.current.params.tenant_code;
  	console.log("ManagementDetailCtrl " , $route.current.params);
  	console.log("ManagementDetailCtrl tenantCode" , $scope.tenantCode);
  	$scope.showLoading = true;
  	$scope.apiMetdataUrl = "api.smartdatanet.it:80/api/";
  	$scope.apiMetdataSecureUrl = "api.smartdatanet.it:443/api/";
  	
  	$scope.admin_response = sharedAdminResponse.getResponse();
  	sharedAdminResponse.setResponse(null);

  	$scope.datasourceReady = false;
	$scope.updateHiveExternalTableStatus = 'loading';
	
	$scope.decimalSeparator = "COMMA";
	if (localStorageService.get("downloadCSvDecimalSeparator")!=null)
		$scope.decimalSeparator = localStorageService.get("downloadCSvDecimalSeparator");


  	adminAPIservice.loadDatasource($routeParams.entity_type,info.getActiveTenant(),$routeParams.id_datasource).success(function(response) {
  		console.log("loadDatasource", response);
  		$scope.showLoading = false;
  	  	$scope.datasourceReady = true;
  		$scope.updateHiveExternalTableStatus = 'ready';


  		try{
			if(response && response.externalReference)
				response.externalreference = response.externalReference;

  			$scope.datasource = response;
  			$scope.dataset = response.dataset;
  			$scope.stream = response.stream;
  			if(typeof $scope.dataset != 'undefined')
  	  			$scope.topic = $scope.dataset.datasetcode;
  			if(typeof $scope.stream != 'undefined'){
  				$scope.datasource.stream.wsUrl = Helpers.stream.wsOutputUrl($scope.datasource);
  				if(typeof $scope.stream.twitterInfo != 'undefined')
  					$scope.stream.twitterInfo.pollingInterval = $scope.stream.smartobject.twtmaxstreams*5+1;

  			}
  			
  			$scope.VIRTUALENTITY_TYPE_TWITTER_ID = Constants.VIRTUALENTITY_TYPE_TWITTER_ID;
  			
  			if(typeof $scope.dataset!= 'undefined' && typeof $scope.dataset.iddataset != 'undefined' && $scope.dataset.iddataset !=null){
  				$scope.downloadCsvUrl = Constants.API_ODATA_URL+$scope.dataset.datasetcode+"/download/"+$scope.dataset.iddataset+ "/current?decimalSeparator=";  
				  if (typeof $scope.stream == 'undefined' ||  $scope.stream == null) 
	  				$scope.downloadCsvUrl = Constants.API_ODATA_URL+$scope.dataset.datasetcode+"/download/"+$scope.dataset.iddataset+ "/all?decimalSeparator=";
	  			
  			}
  			if($scope.canManageStageArea()){
  				$scope.loadHdfsFileList();
  				$scope.loadRangerPolicy();
  			}
  			

  		} catch (e) {
  			console.error("loadDataset ERROR", e);
  		}
  	}).error(function(data,status){
  		$scope.showLoading = false;

  		console.error("loadDataset ERROR", data,status);
  		$scope.admin_response.type = 'danger';
  		if(status==404)
  			$scope.admin_response.message = 'MANAGEMENT_VIEW_DATASET_ERROR_NOT_FOUND';
  		else
  			$scope.admin_response.message = 'UNEXPECTED_ERROR';
  	});

  	
  	$scope.isStream = function(){
  		return typeof $scope.stream != 'undefined';
  	};
  	
  	$scope.editDatasourceUrl  = function(){
  		var editUrl  = "#/management";
  		
  		if($scope.stream){
  			editUrl += "/editStream/stream/"+$scope.tenantCode+"/"+$scope.stream.streamcode +"/" + $scope.stream.idstream;
  		}
  		else if($scope.dataset){
  			editUrl += "/editDataset/dataset/"+$scope.tenantCode+"/"+$scope.dataset.datasetcode +"/" + $scope.dataset.iddataset;
  		}
  		return editUrl;
  	};
  	
  	$scope.canEdit = function() {
  		if($scope.stream){
	  		return ($scope.datasource.status.statuscode == Constants.STREAM_STATUS_DRAFT);
  		}	
	  	else{
	  		return ($scope.dataset && 
	  				$scope.dataset.datasetType && $scope.dataset.datasetType.datasetType == "dataset" && 
	  				$scope.dataset.datasetSubtype && $scope.dataset.datasetSubtype.datasetSubtype == "bulkDataset");
	  	}
  	};

  	
  	$scope.canDownload = function() {
  		return typeof $scope.datasource != 'undefined' && !$scope.datasource.unpublished && ($scope.datasource.version>1 || ($scope.datasource.version==1 && $scope.datasource.status.statuscode == Constants.STREAM_STATUS_INST ));
  	};

  	$scope.canExploreData = function() {
  		return typeof $scope.datasource != 'undefined' && !$scope.datasource.unpublished && ($scope.datasource.version>1 || ($scope.datasource.version==1 && $scope.datasource.status.statuscode == Constants.STREAM_STATUS_INST ));
  	};

  	
  	$scope.canAddData = function() {
  		return ($scope.dataset && 
  				$scope.dataset.datasetType && $scope.dataset.datasetType.datasetType == "dataset" && 
  				$scope.dataset.datasetSubtype && $scope.dataset.datasetSubtype.datasetSubtype == "bulkDataset");
  	};
  	
  	$scope.canManageStageArea  = function() {
  		//return ($scope.dataset && Helpers.util.has(info.getActiveTenant(), "bundles.zeppelin") &&  info.getActiveTenant().bundles.zeppelin!="" );
  		return ($scope.dataset && info.isCsiTenant());
  	};

  	$scope.isOwner = function(){
  		if($scope.datasource)
  			return info.isOwner( $scope.datasource.tenantManager.tenantcode);
  		else
  			return false;
  	};
  	
	$scope.tenantOwner= function(tenantcode){
		console.log("isOwner",info.isOwner( tenantcode));
  		return info.isOwner( tenantcode);
  	};

  	$scope.canDelete = function() {
  		return ($scope.dataset && 
  				$scope.dataset.datasetType && $scope.dataset.datasetType.datasetType == "dataset" && 
  				$scope.dataset.datasetSubtype &&
  					($scope.dataset.datasetSubtype.datasetSubtype == "bulkDataset" ||
  					 $scope.dataset.datasetSubtype.datasetSubtype == "streamDataset" ||
  					 $scope.dataset.datasetSubtype.datasetSubtype == "socialDataset"
  						)
  					
  				);
  	};
  	
  	$scope.canUnistall = function() {
  		if($scope.stream){
  			return $scope.datasource.status && $scope.datasource.status.statuscode == Constants.STREAM_STATUS_INST;
  		}
  		else
	  		return ($scope.dataset && 
	  				$scope.dataset.datasetType && $scope.dataset.datasetType.datasetType == "dataset" && 
	  				$scope.dataset.datasetSubtype && $scope.dataset.datasetSubtype.datasetSubtype == "bulkDataset" && 
	  				$scope.datasource.deleted!=1
	  			);
  	};
  	
  	
	$scope.canInstall = function() {
		if($scope.stream && $scope.datasource.status && $scope.datasource.status.statuscode == Constants.STREAM_STATUS_DRAFT)
			return true;
		return false;
	};

	
	$scope.canCreateNewVersion = function() {
		if($scope.stream && $scope.datasource.status && $scope.datasource.status.statuscode == Constants.STREAM_STATUS_INST)
			return true;
		return false;
	};
	

  	
  	
	$scope.cloneDatasource = function(){
		$scope.datasource.organization = info.getActiveTenant().organization;
		sharedDatasource.setDatasource($scope.datasource);
		if($scope.stream){
			$location.path('management/newStream/'+info.getActiveTenant().tenantcode);
		}
		else{
			$location.path('management/newDataset/'+info.getActiveTenant().tenantcode);
		}
	};

	console.log("info", info);
	info.isAuthorized("management/streams/req_disinst");
	
	$scope.requestInstallation = function(){
		var action = Constants.LIFECYCLE_STREAM_REQ_INST;
		console.log("updateLifecycle stream", $scope.stream);
		console.log("updateLifecycle action", action);
		updateLifecycle(action,$scope.stream);
	};
	$scope.requestUnistallation = function(){
		var action = Constants.LIFECYCLE_STREAM_REQ_UNINST;
		console.log("updateLifecycle stream", $scope.stream);
		console.log("updateLifecycle action", action);
		updateLifecycle(action,$scope.stream);
	};
	
	$scope.createNewVersion = function(){
		var action = Constants.LIFECYCLE_STREAM_NEW_VERSION;
		console.log("updateLifecycle stream", $scope.stream);
		console.log("updateLifecycle action", action);
		updateLifecycle(action,$scope.stream);
	};
	
	
	var updateLifecycle = function(action,stream){
			adminAPIservice.lifecycleStream(action,stream,info.getActiveTenant()).success(function(response) {
			console.log("result updateLifecycle ", response);	
			$route.reload();
		}).error(function(data,status){
			$scope.showLoading = false;
	  		console.error("updateLifecycle ERROR", data,status);
	  		$scope.admin_response.message = 'UNEXPECTED_ERROR';
	  		
	  	});
	};
	
	$scope.openUninstalDatasetModal = function(){
		console.log("openUninstalDatasetModal",$scope.datasource);
	    var uninstallDatasetModalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'unistallDatasetModal.html',
	      controller: 'ManagementDatasetUninstallModalCtrl',
	      scope: $scope,
	      //size: 'sm',
	      resolve: {
	    	  datasource : function(){
	    		  return $scope.datasource;
	    	  }
	      }
	    });
	    
	    uninstallDatasetModalInstance.result.then(function (unistalled) {
	    	console.log('unistalled', unistalled);
	      }, function (unistalled) {
	    	  console.log('Modal dismissed unistalled: ' + unistalled);
	    	  if(unistalled)
	    		  $location.path('management/datasets/'+$scope.tenantCode);
	      });
	};

	$scope.openDeleteDataDatasetModal = function(){
		console.log("openDeleteDataDatasetModal",$scope.datasource);
	    var uninstallDatasetModalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'deleteDataDatasetModal.html',
	      controller: 'ManagementDatasetDeleteDatalModalCtrl',
	      scope: $scope,
	      //size: 'sm',
	      resolve: {
	    	  datasource : function(){
	    		  return $scope.datasource;
	    	  }
	      }
	    });
	    
//	    uninstallDatasetModalInstance.result.then(function (unistalled) {
//	    	console.log('unistalled', unistalled);
//	      }, function (unistalled) {
//	    	  console.log('Modal dismissed unistalled: ' + unistalled);
//	    	  if(unistalled)
//	    		  $location.path('management/datasets/'+$scope.tenantCode);
//	      });
	};

	$scope.updateHiveExternalTableResponse = {};
	$scope.updateHiveExternalTable = function(){
		$scope.updateHiveExternalTableResponse = {};
		$scope.updateHiveExternalTableStatus = 'progress';
		console.log("$scope.dataset", $scope.dataset);
		adminAPIservice.updateHiveExternalTable(info.getActiveTenant(),$scope.dataset, $scope.hiveExternalTableName()).success(function(response) {
			$scope.updateHiveExternalTableStatus = 'ready';
			console.log("data loaded", response);
			if(response && response!=null &&  response.toLowerCase().startsWith('ok')){
				$scope.updateHiveExternalTableResponse.type = 'success';
				$scope.updateHiveExternalTableResponse.message = 'MANAGEMENT_STAGE_AREA_EXTERNAL_HIVE_TABLE_OK';
			}
			else{
				$scope.updateHiveExternalTableResponse.type = 'warning';
				$scope.updateHiveExternalTableResponse.message = response;
			}
				
			$scope.updateHiveExternalTableResponse.detail = response.errorName;

		}).error(function(response){
			console.log("updateHiveExternalTable error", response);
			$scope.updateHiveExternalTableStatus = 'ready';
			$scope.updateHiveExternalTableResponse.type = 'danger';
			$scope.updateHiveExternalTableResponse.message = 'MANAGEMENT_STAGE_AREA_EXTERNAL_HIVE_TABLE_KO';
			if(response && response.errorName)
				$scope.updateHiveExternalTableResponse.detail = response.errorName;
		});
		
		
	};
	
	$scope.hiveExternalTableName  = function(){
		if($scope.datasourceReady){
			return "EXT_"+$scope.dataset.datasetcode.toUpperCase();
		}
	}

	
	$scope.hiveStageArea  = function(){
		if($scope.datasourceReady){
			return ("stg_" + $scope.datasource.organization.organizationcode + "_" + $scope.datasource.tenantManager.tenantcode.replace("-", "_")).toLowerCase();
		}
	}
	
	
	$scope.hdfsFileList = null;
	$scope.hdfsFileListResponse = {};
	$scope.hdfsFileListStatus = null;
	$scope.hdfsFileLastRun = null;
    $scope.loadHdfsFileList = function(){
    	$scope.hdfsFileListStatus = 'LOADING';
		adminAPIservice.listHdfsFiles(info.getActiveTenant(),$scope.dataset).success(function(response) {
			console.log("loadHdfsFileList success", response);
			$scope.hdfsFileListStatus = null;
			if(Helpers.util.has(response, "FileStatuses.FileStatus") && response.FileStatuses.FileStatus!=null){
				$scope.hdfsFileList = new Array();
				$scope.hdfsFileLastRun = 0;
				for (var fIndex = 0; fIndex < response.FileStatuses.FileStatus.length; fIndex++) {
					if(response.FileStatuses.FileStatus[fIndex].type == "FILE"){
						$scope.hdfsFileList.push(response.FileStatuses.FileStatus[fIndex]);
						if($scope.hdfsFileLastRun<response.FileStatuses.FileStatus[fIndex].modificationTime)
							$scope.hdfsFileLastRun = response.FileStatuses.FileStatus[fIndex].modificationTime;
					}
				}
				if($scope.hdfsFileLastRun == 0)
					$scope.hdfsFileLastRun = null;
				
			}
		}).error(function(response){
			if(response && response.errorCode == 'E17'){
				$scope.hdfsFileListStatus = 'MANAGEMENT_HDFS_FILELIST_NO_FILES';
			}
			else{
				$scope.hdfsFileListStatus = 'Error';
				$scope.hdfsFileListResponse.type = 'danger';
				$scope.hdfsFileListResponse.message = 'MANAGEMENT_HDFS_FILELIST_KO';
				if(response && response.errorName)
					$scope.hdfsFileListResponse.detail = response.errorName;
			}
			console.log("loadHdfsFileList error", response);
		});
    };
    
	
	$scope.locationStageArea  = function(){
		console.log("locationStageArea $scope.datasource", $scope.datasource);
		if($scope.datasourceReady){
			var stageArea = "/datalake/" + $scope.datasource.organization.organizationcode.toUpperCase() + "/rawdata/" +  $scope.datasource.domain.domaincode.toUpperCase() + "/";
				
			if ($scope.dataset.datasetSubtype.datasetSubtype == "bulkDataset")
				stageArea += "db_" + $scope.datasource.subdomain.subdomaincode.toUpperCase() + "/" + $scope.dataset.datasetcode;	
			else
				stageArea += "so_" +$scope.stream.smartobject.slug + "/" + $scope.stream.streamcode;
			
			return stageArea;
		}
	};

	
	$scope.forceDownloadCsvStatus = null;
	
	$scope.forceDownloadCsv = function(){
		console.log("forceDownloadCsv");
		$scope.forceDownloadCsvStatus = "progress";
		adminAPIservice.forceDownloadCsv(info.getActiveTenant(),$scope.dataset).success(function(response) {
			console.log("forceDownloadCsv success", response);
			$scope.hdfsFileListResponse.type = 'success';
			$scope.hdfsFileListResponse.message = $translate.instant('MANAGEMENT_HDFS_FORCEDOWNLOADCSV_OK') + ' ' + $filter('date')(new Date(), "H:mm:ss");
			$scope.forceDownloadCsvStatus = null;
		}).error(function(response){
			$scope.forceDownloadCsvStatus = 'Error';
			$scope.hdfsFileListResponse.type = 'danger';
			$scope.hdfsFileListResponse.message = 'MANAGEMENT_HDFS_FORCEDOWNLOADCSV_KO';

			if(response && response.errorName)
				$scope.hdfsFileListResponse.detail = response.errorName;
			console.log("forceDownloadCsv error", response);
		});
	};
	
	$scope.loadRangerPolicy = function(){
    	$scope.hdfsRangerPolicyStatus = null;
    	$scope.rangerStatus =true;
		adminAPIservice.listRangerPolicyGroup(info.getActiveTenant(),$scope.dataset).success(function(response) {
			console.log("loadRangerPolicy success", response);
			$scope.rangerPolicyGroupList = null;
				$scope.rangerPolicyGroupList = new Array();
				for (var fIndex = 0; fIndex < response.policyItems[0].groups.length; fIndex++) {
						$scope.rangerPolicyGroupList.push(response.policyItems[0].groups[fIndex]);
				}
				console.log("rangerPolicyGroupList", $scope.rangerPolicyGroupList);
				$scope.policyFound = true;
				$scope.initRangerStatus();
		    	console.log("initRangerStatus - rangerStatus", $scope.rangerStatus);
			
		}).error(function(response){ //gestire errori
			console.log("loadRangerPolicy error", response);
			if(response && response.errorCode == 'E04'){
				$scope.hdfsRangerPolicyStatus = 'MANAGEMENT_HDFS_RANGER_NO_POLICY';
				$scope.policyFound = false;
				$scope.rangerStatus = false;
			}
			else{
				$scope.hdfsRangerPolicyStatus = 'Error';
				$scope.hdfsRangerPolicyResponse.type = 'danger';
				$scope.hdfsRangerPolicyResponse.message = 'MANAGEMENT_HDFS_RANGERPOLICY_KO';
				if(response && response.errorName)
					$scope.hdfsRangerPolicyResponse.detail = response.errorName;
			}
			console.log("loadRangerPolicy error", response);
		});
    };
    
	$scope.initRangerStatus = function(){
    	
    	var listTenantSharing = [];
    	for (var index = 0; index < $scope.datasource.sharingTenants.length; index++) {
    		listTenantSharing.push($scope.datasource.sharingTenants[index].tenantcode);
    	}
	listTenantSharing.push($scope.datasource.tenantManager.tenantcode);



    	console.log("listTenantSharing",listTenantSharing);
    	
    	for (var Tindex = 0; Tindex < $scope.rangerPolicyGroupList.length; Tindex++) {
    		if (!(listTenantSharing.indexOf($scope.rangerPolicyGroupList[Tindex]) > -1)){
    			return $scope.rangerStatus = false;
    		}
    	}

    	for (var Rindex = 0; Rindex < $scope.datasource.sharingTenants.length; Rindex++) {
    		if (!($scope.rangerPolicyGroupList.indexOf($scope.datasource.sharingTenants[Rindex].tenantcode) > -1)){
    			console.log("IndexOf error", $scope.rangerPolicyGroupList.indexOf($scope.datasource.sharingTenants[Rindex].tenantcode));
    			console.log("tenantNotFound error", $scope.datasource.sharingTenants[Rindex].tenantcode);
    			return $scope.rangerStatus = false;
    		}
    	}
    	
    	return $scope.rangerStatus = true;
    	   	 	
    }
    
    $scope.propagaPolicy = function(){
    	if (!$scope.policyFound) $scope.createRangerPolicy();
    	else $scope.updateRangerPolicy();
    };
    

    $scope.createRangerPolicy = function(){    	
    	
		adminAPIservice.createRangerPolicy(info.getActiveTenant(),$scope.dataset).success(function(response) {
			console.log("createRangerPolicy - CREATE success", response);
			console.log("locationstageArea", "management/manageStageArea/dataset/"+$scope.datasource.tenantManager.tenantcode+"/"+$scope.datasource.dataset.datasetcode+"/"+$scope.datasource.dataset.iddataset);
			$route.reload();
		}).error(function(response){ //gestire errori
			console.log("createRangerPolicy error", response);
			if(response && response.errorCode == 'E04'){
				$scope.hdfsRangerPolicyStatus = 'MANAGEMENT_HDFS_RANGER_NO_POLICY';
			}
			else{
				$scope.hdfsRangerPolicyStatus = 'Error';
				$scope.hdfsRangerPolicyResponse.type = 'danger';
				$scope.hdfsRangerPolicyResponse.message = 'MANAGEMENT_HDFS_RANGERPOLICY_KO';
				if(response && response.errorName)
					$scope.hdfsRangerPolicyResponse.detail = response.errorName;
			}
			console.log("createRangerPolicy error", response);
		});
    };
    
    $scope.updateRangerPolicy = function(){    	
		
		adminAPIservice.updateRangerPolicy(info.getActiveTenant(),$scope.dataset).success(function(response) {
			console.log("updateRangerPolicy - update success", response);
			$route.reload();
			
		}).error(function(response){ 
				$scope.hdfsRangerPolicyStatus = 'Error';
				$scope.hdfsRangerPolicyResponse.type = 'danger';
				$scope.hdfsRangerPolicyResponse.message = 'MANAGEMENT_HDFS_UPDATEPOLICY_KO';
				if(response && response.errorName)
					$scope.hdfsRangerPolicyResponse.detail = response.errorName;
				console.log("updatePolicy error", response);
			});

	};
	
	$scope.chooseGroup= function(){
		
		var chooseGroupChooseDialogInstance = $modal.open({
    		templateUrl: 'ChooseDatasetGroupDialog.html',
  	      	controller: 'ChooseDatasetGroupDialogCtrl',
  	      	windowClass: 'app-modal-window',
	  	      resolve: {
		    	  datasourceList: function(){ return [$scope.datasource];},
				  isStream: function(){return typeof $scope.datasource.stream != 'undefined';}
	  	      }


		});
		
		chooseGroupChooseDialogInstance.result.then(function (message) {
			console.log("selectedGroups",message);
		});
//		chooseGroupChooseDialogInstance.result.then(function (newGroup) {
//		      	}, function () {console.log('chooseGroupChooseDialogInstance - chooseGroupChooseDialogInstance dismissed ');
//		});
		
	}


}]);



appControllers.controller('ManagementEditCtrl', [ '$scope', '$modal', 'adminAPIservice', '$translate',  function($scope, $modal,adminAPIservice, $translate) {

	$scope.isLicenseVisible = function(datasource){
		var returnValue = true;
		if (datasource && datasource.license){
			if ((datasource.license.licensecode == Constants.STREAM_FIELD_METADATA_LICENSE_CCBY) || (datasource.license.licensecode == Constants.STREAM_FIELD_METADATA_LICENSE_CC0))
				returnValue = false;
		}
		
		return returnValue;
	};
	

	$scope.checkTag = function(datasource){
		return Helpers.yucca.checkTag(datasource);
//		var rslt = true;
//		if (typeof datasource !='undefined' && datasource!=null && datasource.tags && datasource.tags.length > 0){
//			rslt = false;
//		};
//		
//		return rslt;
	};
	
//	$scope.checkDcat = function(datasource){
//		var rslt = true;
//		if(!dataset.unpublished){
//			if(!Helpers.util.has(datasource, "dcat.dcatrightsholdername") ||
//				!Helpers.util.has(datasource, "dcat.dcatemailorg") ||
//				!Helpers.util.has(datasource, "dcat.dcatemailorg"))
//			rslt = false;
//		};
//		
//		return rslt;
//	};
//	
//	
//	$scope.showHint = function(datasource){
//		var showHint = false;
//		if(checkTag(datasource) && checkDcat(datasource) && Helpers.util.has(datasource, "domaincode") && Helpers.util.has(datasource, "idSubdomain") )
//			showHint = true;
//		return showHint;
//	};
	

}]);


appControllers.controller('ManagementChooseTagCtrl', [ '$scope', '$modalInstance', 'tagList',
                                                                        function($scope, $modalInstance, tagList) {
	
	$scope.tagMap = {};
	var firstLetter = null;
	for (var i = 0; i < tagList.length; i++) {
		if(firstLetter != tagList[i].tagLabel.substring(0,1)){
			firstLetter = tagList[i].tagLabel.substring(0,1);
			$scope.tagMap[firstLetter] = new Array();
		}
		$scope.tagMap[firstLetter].push(tagList[i]);
	}
	
	
	$scope.chooseTag = function(choosenTag){
		console.log("chooseTag",choosenTag);
		$modalInstance.close(choosenTag);
	};
	
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
}]);


appControllers.controller('ManagementChooseTenantCtrl', [ '$scope', '$modalInstance', 'tenantsList',
                                                                           function($scope, $modalInstance, tenantsList) {
   	console.log("ManagementChooseTenantCtrl",tenantsList);
   	
   	$scope.tenantsList = tenantsList;

   	$scope.chooseTenant = function(choosenTenant){
   		console.log("choosenTenant",choosenTenant);
   		$modalInstance.close(choosenTenant);
   	};
   	
   	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
 }]);


appControllers.controller('DateFormatHintCtrl', [ '$scope', '$modalInstance', function($scope, $modalInstance) {
	$scope.dataFormatHintTable = Constants.HELP_HINT_DATE_FORMAT_TABLE;
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
}]);

appControllers.controller('DecimalSeparatorChooseDialogCtrl', [ '$scope', '$modalInstance', 'decimalSeparator',
    function($scope, $modalInstance, decimalSeparator) {

	$scope.decimalSeparator = decimalSeparator;
	$scope.ok = function(){
		$modalInstance.close($scope.decimalSeparator);
	};
	
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
}]);



appControllers.controller('ChooseDatasetGroupDialogCtrl', [ '$scope', '$modalInstance','info', 'adminAPIservice', 'datasourceList','isStream','groups', 'createOnSave',
	function($scope, $modalInstance, info, adminAPIservice, datasourceList, isStream, groups, createOnSave) {	
	
		console.log("ChooseDatasetGroupDialogCtrl",  datasourceList, isStream, groups, createOnSave);
		var loadGroups = function(){
			$scope.admin_response = {};
			$scope.showLoading = false;
		 //$scope.groupList = [{"idTenant": 1,"datasourcegroupversion": 1,"name": "prova 2","idDatasourcegroup": 27,"color": "#ff0000","type": {"idDatasourcegroupType": 2,"name": "B","description": "userdefined"}, "status":"bozza"},{"idTenant": 1,"datasourcegroupversion": 1,"name": "prova 3","idDatasourcegroup": 28,"color": "#004080","type": {"idDatasourcegroupType": 1,"name": "A","description": "special"},"status":"consolidato"},{"idTenant": 1,"datasourcegroupversion": 3,"name": "GRUPPO PROOVA 1","idDatasourcegroup": 16,"color": "#00ff00","type": {"idDatasourcegroupType": 1,"name": "A","description": "special"},"status":"bozza"}];
			 adminAPIservice.loadDatasetGroups(info.getActiveTenant()).success(function(response) {
				console.log("loadGroups SUCCESS", response);
				$scope.showLoading = false;
				$scope.groupList = new Array();
				if(datasourceList.length==1){
					for (var i = 0; i < response.length; i++) {
						if(!hasGroup(datasourceList[0], response[i]) && response[i].status=='DRAFT')
							$scope.groupList.push(response[i]);
					}
				}
				else{
	    			if(response)
	    				for (var i = 0; i < response.length; i++) {
	    					if(response[i].status=='DRAFT')
	    						$scope.groupList.push(response[i]);
						}

				}
				$scope.totalItems = $scope.groupList.length;
				
				if($scope.groupList.length==0){
					$scope.admin_response.type = 'info';
					$scope.admin_response.message = 'MANAGEMENT_GROUP_LIST_RESULT_EMPTY_ADD_DATASET';
				}
				if($scope.groupList.length==1){
					$scope.selectedGroup.index = 0;
				}
				else{
					$scope.groupList.sort(function(a, b) { 
					    return ((a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((a.name.toUpperCase() < b.name.toUpperCase()) ? -1 : 0));
					});
				}
			}).error(function(response){
				console.error("loadGroups ERROR", response);
				$scope.showLoading = false;
				if(response && response.errorCode && response.errorCode == 'E02'){
					$scope.admin_response.type = 'info';
					$scope.admin_response.message = 'MANAGEMENT_GROUP_LIST_RESULT_EMPTY';
				}
				else {
					$scope.admin_response.type = 'danger';
					$scope.admin_response.message = 'UNEXPECTED_ERROR';
						if(response && response.errorName)
							$scope.admin_response.detail= response.errorName;
						if(response && response.errorCode)
							$scope.admin_response.code= response.errorCode;
				}
			});
		};
		
		
		$scope.isCsiTenant = function(){
			return info.isCsiTenant();
		};
		
		$scope.loadDatasourceGroupType = function() {
			adminAPIservice.loadDatasourceGroupType().success(function(response) {			
					console.log("loadDatasetGroupTypes SUCCESS", response);
					response.sort(function(a, b) { 
					    return ((a.description > b.description) ? 1 : ((a.description < b.description) ? -1 : 0));
					});
					$scope.DATASET_GROUP_TYPE = response;
					console.log("loadDatasetGroupTypes SUCCESS", $scope.DATASET_GROUP_TYPE);
				}).error(function(response){ 
					console.error("loadDatasourceGroupType ERROR", response);
					$scope.admin_response = {type: "danger", message: "ERROR_TITLE"};
					if(response && response.errorName)
						$scope.admin_response.detail= response.errorName;
					if(response && response.errorCode)
						$scope.admin_response.code= response.errorCode;
					$scope.newGroup.show = 0;
					$scope.newGroup.group = {};
				});
		};
		
		$scope.loadDatasourceGroupType();
		
		var hasGroup = function(datasource, group){
			if(typeof datasource.groups != 'undefined' && datasource.groups!=null){
				var found = false;
				for (var i = 0; i < datasource.groups .length; i++) {
					if(group.idDatasourcegroup == datasource.groups[i].idDatasourcegroup && group.datasourcegroupversion == datasource.groups[i].datasourcegroupversion){
						found = true;
						break;
					}
				}
				return found;
			}
		};
		
		
		 if(typeof groups == undefined || groups==null || groups.length==0)
			 loadGroups();
		 else
			 $scope.groupList = groups;
		
		 $scope.chooseTypeChanged = function(){
			 if(typeof Constants.DATASOURCE_GROUP_SPECIAL_TYPE[$scope.newGroup.group.idDatasourcegroupType] != 'undefined')
				 $scope.newGroup.group.color = Constants.DATASOURCE_GROUP_SPECIAL_TYPE[$scope.newGroup.group.idDatasourcegroupType].color;
		 }

		$scope.selectedGroup = {index: -1};
		
		$scope.newGroup = {show:0};
		
		$scope.createDatasourceGroup = function(){
			console.log("createDatasourceGroup", $scope.newGroup);
			$scope.newGroup.group.idTenant = info.getActiveTenant().idTenant;
			adminAPIservice.createGroup(info.getActiveTenant(),$scope.newGroup.group).success(function(response) {			
					console.log("createGroup SUCCESS", response);
					loadGroups();
					$scope.newGroup.show = 0;
					$scope.newGroup.group = {};
				}).error(function(response){
					console.error("createGroup ERROR", response);
					$scope.admin_response = {type: "danger", message: "ERROR_TITLE"};
					if(response && response.errorName)
						$scope.admin_response.detail= response.errorName;
					if(response && response.errorCode)
						$scope.admin_response.code= response.errorCode;
					$scope.newGroup.show = 0;
					$scope.newGroup.group = {};
				});
		};
		
		var updatedDatasources = false;
		
		$scope.ok = function(){  
			if(createOnSave){
				var datasourceListParam = new Array();
				for (index=0; index<datasourceList.length;index++){
					if(isStream)
						datasourceListParam.push({"idStream":(datasourceList[index].stream?datasourceList[index].stream.idstream:datasourceList[index].idstream),"datasourceversion":datasourceList[index].version});
					else
						datasourceListParam.push({"idDataset":(datasourceList[index].dataset?datasourceList[index].dataset.iddataset:datasourceList[index].iddataset),"datasourceversion":datasourceList[index].version});
	
				}
				console.log("datasourcesForGroup",datasourceListParam);
				var reqDatasetsToGroup = {
						"idDatasourceGroup":$scope.groupList[$scope.selectedGroup.index].idDatasourcegroup,
						"datasourcegroupversion":$scope.groupList[$scope.selectedGroup.index].datasourcegroupversion,
						"datasources":datasourceListParam
						
				};
				console.log("reqDatasetsToGroup",reqDatasetsToGroup);
				$scope.admin_response = {};
				$scope.showLoading = true;
				adminAPIservice.addDatasetsToGroup(isStream, info.getActiveTenant(),reqDatasetsToGroup).success(function(response) {
					console.log("loadGroups", response);
					$scope.showLoading = false;
					$scope.admin_response = {type: "success", message: "SUCCESS_TITLE"};
					$scope.groupList.splice($scope.selectedGroup.index,1);
					$scope.selectedGroup = {index: -1};
					
					updatedDatasources = true;
					//loadGroups();
				}).error(function(response){
					console.error("loadGroups ERROR", response);
					$scope.showLoading = false;
					$scope.admin_response.type = 'danger';
					$scope.admin_response.message = 'UNEXPECTED_ERROR';
					if(response && response.errorName)
						$scope.admin_response.detail= response.errorName;
					if(response && response.errorCode)
						$scope.admin_response.code= response.errorCode;
				});
			}
			else{
				$modalInstance.close($scope.groupList[$scope.selectedGroup.index]);
			}

		};
		
		$scope.cancel = function () {
			if(updatedDatasources)
				$modalInstance.close();
			else
				$modalInstance.dismiss('cancel');
		};
}]);

appControllers.controller('ManageDatasetGroupDialogCtrl', [ '$scope', '$modalInstance','info','adminAPIservice', 'group',
	function($scope, $modalInstance, info, adminAPIservice, group) {	

	console.log("ManageDatasetGroupDialogCtrl",info.getActiveTenant(), group);
	$scope.admin_response = {};

	if(typeof group != 'undefined' && group!=null){
		$scope.group = angular.copy(group);
		$scope.group.idDatasourcegroupType = $scope.group.type.idDatasourcegroupType;
		console.log(".group",group);

		console.log("$scope.group",$scope.group);
	}
	else
		$scope.group = {};
	$scope.createDatasourceGroup = function(){
		console.log("createDatasourceGroup", $scope.group);
		$scope.group.idTenant = info.getActiveTenant().idTenant;
		adminAPIservice.createGroup(info.getActiveTenant(),$scope.group).success(function(response) {			
				console.log("createGroup SUCCESS", response);
				$modalInstance.close();
				//$location.path('management/datasetGroups/'+ info.getActiveTenant().tenantCode);
			}).error(function(response){
				console.error("createGroup ERROR", response);
				$scope.admin_response = {type: "danger", message: "ERROR_TITLE"};
				if(response && response.errorName)
					$scope.admin_response.detail= response.errorName;
				if(response && response.errorCode)
					$scope.admin_response.code= response.errorCode;
			});
	};
	
	$scope.isCsiTenant = function(){
		return info.isCsiTenant();
	};
	
	$scope.loadDatasourceGroupType = function() {
		adminAPIservice.loadDatasourceGroupType().success(function(response) {			
				console.log("loadDatasetGroupTypes SUCCESS", response);
				response.sort(function(a, b) { 
				    return ((a.description > b.description) ? 1 : ((a.description < b.description) ? -1 : 0));
				});
				$scope.DATASET_GROUP_TYPE = response;
			}).error(function(response){ 
				console.error("loadDatasourceGroupType ERROR", response);
				$scope.admin_response = {type: "danger", message: "ERROR_TITLE"};
				if(response && response.errorName)
					$scope.admin_response.detail= response.errorName;
				if(response && response.errorCode)
					$scope.admin_response.code= response.errorCode;
				$scope.newGroup.show = 0;
				$scope.newGroup.group = {};
			});
	};
	
	 $scope.chooseTypeChanged = function(){
		 console.log("chooseTypeChanged",$scope.group);
		 if(typeof Constants.DATASOURCE_GROUP_SPECIAL_TYPE[$scope.group.idDatasourcegroupType] != 'undefined')
			 $scope.group.color = Constants.DATASOURCE_GROUP_SPECIAL_TYPE[$scope.group.idDatasourcegroupType].color;
	 }
	
	$scope.loadDatasourceGroupType();
	
	$scope.modifyDatasourceGroup = function(){
		 adminAPIservice.editGroup(info.getActiveTenant(),$scope.group).success(function(response) {			
				console.log("modifyGroup SUCCESS", response);
				$modalInstance.close();
			}).error(function(response){
				console.error("createGroup ERROR", response);
				$scope.admin_response = {type: "danger", message: "ERROR_TITLE"};
				if(response && response.errorName)
					$scope.admin_response.detail= response.errorName;
				if(response && response.errorCode)
					$scope.admin_response.code= response.errorCode;
			});
		};
		
	
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
 }]);

appControllers.controller('DeleteDatasetFromGroupDialogCtrl', [ '$scope', '$modalInstance','$location', 'info', 'adminAPIservice', '$translate', 'group', 'isStream', 
                                                        	function($scope, $modalInstance, $location, info, adminAPIservice, $translate, group, isStream) {	

	$scope.isStream = isStream;
	$scope.group = group;
	$scope.admin_response = {};
	
	
	 $scope.goToDatasourceList = function(){
		 $modalInstance.dismiss('goToDatasourceList');
		if(isStream)
  			$location.path('management/streams/'+ info.getActiveTenant().tenantcode).search({datasetGroup : group.name});
  		else
  			$location.path('management/datasets/'+ info.getActiveTenant().tenantcode).search({datasetGroup : group.name});

	 };
	 
	 $scope.goToDatasourceDetail = function(dataset){
		 var datasourceDetailUrl = "management/viewDatasource/dataset/"+ dataset.tenantManager.tenantcode + "/" + dataset.datasetcode +"/" + dataset.iddataset;
	     console.log("goToDatasourceDetail",datasourceDetailUrl);
	     $location.path(datasourceDetailUrl);
		 $modalInstance.dismiss('goToDatasourceDetail');
	 };
	 
	 $scope.datasetIconUrl= function(organizationCode, iddataset){
			return Constants.API_ADMIN_DATASET_URL.replace(new RegExp('{organizationCode}', 'gi'), organizationCode)+"/"+iddataset+"/icon";
		};
		
	
	var loadDatasetsFromGroup = function(){
		 $scope.showLoading = true;
		 $scope.datasetGroupList  = [];
		 adminAPIservice.loadDatasetsFromGroup(isStream, info.getActiveTenant(),group.idDatasourcegroup, group.datasourcegroupversion).success(function(response) {
			
			$scope.showLoading = false;
			$scope.datasetGroupList = new Array();
			for (var i = 0; i < response.length; i++) {
				if(typeof response[i].iddataset!='undefined' && !isStream)
					$scope.datasetGroupList.push(response[i]);
				else if(typeof response[i].idstream!='undefined' && isStream)
					$scope.datasetGroupList.push(response[i]);

			}
			console.log("loadDatasetsFromGroup SUCCESS", $scope.datasetGroupList);
			if($scope.datasetGroupList.length==0){
				$scope.admin_response.type = 'info';
				$scope.admin_response.message = isStream?'DATASET_DELETE_FROM_GROUP_DIALOG_RESULT_EMPTY_STREAM':'DATASET_DELETE_FROM_GROUP_DIALOG_RESULT_EMPTY_DATASET';
				$scope.admin_response.detail = $translate.instant(isStream?'DATASET_DELETE_FROM_GROUP_DIALOG_RESULT_EMPTY_DETAIL_STREAM':'DATASET_DELETE_FROM_GROUP_DIALOG_RESULT_EMPTY_DETAIL_DATASET');
			}
			else{
				$scope.datasetGroupList.sort(function(a, b) { 
				    return ((a.datasetname.toUpperCase() > b.datasetname.toUpperCase()) ? 1 : ((a.datasetname.toUpperCase() < b.datasetname.toUpperCase()) ? -1 : 0));
				});
			}
		}).error(function(response){
			console.error("loadDatasetsFromGroup ERROR", response);
			$scope.showLoading = false;
			if(response && response.errorCode && response.errorCode == 'E02'){
				$scope.admin_response.type = 'info';
				$scope.admin_response.message = 'MANAGEMENT_DATASET_LIST_RESULT_EMPTY';
			}
			else {
				$scope.admin_response.type = 'danger';
				$scope.admin_response.message = 'UNEXPECTED_ERROR';
					if(response && response.errorName)
						$scope.admin_response.detail= response.errorName;
					if(response && response.errorCode)
						$scope.admin_response.code= response.errorCode;
			}
		});
	};


	loadDatasetsFromGroup();

	$scope.ok = function(){  
		console.log("$scope.selectedDatasourceGroup",$scope.selectedDatasourceGroup);
		var datasourceListParam = new Array();
		for (index=0; index<$scope.datasetGroupList.length;index++){
			if($scope.datasetGroupList[index].isDeleted){
				console.log("m",$scope.datasetGroupList[index]);
				if(isStream)
					datasourceListParam.push({"idStream":($scope.datasetGroupList[index].stream?$scope.datasetGroupList[index].stream.idstream:$scope.datasetGroupList[index].idstream),"datasourceversion":$scope.datasetGroupList[index].version});
				else
					datasourceListParam.push({"idDataset":($scope.datasetGroupList[index].dataset?$scope.datasetGroupList[index].dataset.iddataset:$scope.datasetGroupList[index].iddataset),"datasourceversion":$scope.datasetGroupList[index].version});
			}
		}
		console.log("datasourcesFromGroup",datasourceListParam);
		
		var reqDatasetsFromGroup = {
				"idDatasourceGroup":group.idDatasourcegroup,
				"datasourcegroupversion":group.datasourcegroupversion,
				"datasources":datasourceListParam
				
		};
		console.log("reqDatasetsFromGroup",reqDatasetsFromGroup);
		$scope.admin_response = {};
		$scope.showLoading = true;
		adminAPIservice.deleteDatasourcesFromGroup(isStream, info.getActiveTenant(),reqDatasetsFromGroup).success(function(response) {
			console.log("deleteDatasourceFromGroup", response);
			$scope.showLoading = false;
			var detail  = isStream?$translate.instant("DATASET_DELETE_FROM_GROUP_DIALOG_RESULT_COUNT_STREAM")+ " " +response:$translate.instant("DATASET_DELETE_FROM_GROUP_DIALOG_RESULT_COUNT_DATASET")+ " " +response;
			$scope.admin_response = {type: "success", message: "SUCCESS_TITLE", detail: detail};
			//$scope.selectedDatasourceGroup = {};
			loadDatasetsFromGroup();
			//loadGroups();
		}).error(function(response){
			console.error("deleteDatasourceFromGroup ERROR", response);
			$scope.showLoading = false;
			$scope.admin_response.type = 'danger';
			$scope.admin_response.message = 'UNEXPECTED_ERROR';
			if(response && response.errorName)
				$scope.admin_response.detail= response.errorName;
			if(response && response.errorCode)
				$scope.admin_response.code= response.errorCode;
		});
	
	};
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);


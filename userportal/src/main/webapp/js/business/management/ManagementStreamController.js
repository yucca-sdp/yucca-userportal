/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

appControllers.controller('ManagementStreamListCtrl', [ '$scope', '$route', '$location', 'adminAPIservice', 'sharedAdminResponse', 'info', '$translate', '$modal', 
                                                        function($scope, $route, $location, adminAPIservice, sharedAdminResponse, info,  $translate, $modal) {
	$scope.tenantCode = $route.current.params.tenant_code;

	$scope.streamsList = [];
	$scope.filteredStreamsList = [];
	$scope.codeFilter = null;
	$scope.nameFilter = null;
	$scope.statusFilter = null;
	$scope.domainFilter = null;
	$scope.showLoading = true;
	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.streamsList.length;
	$scope.predicate = '';
	
	console.log("isOwner", info.isOwner( $scope.tenantCode));

	$scope.organizationCode = info.getActiveTenant().organization.organizationcode;
	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};

	
	
	$scope.admin_response = {};
	
	console.log("ManagementStreamListCtrl - info", info.getActiveTenant());
	
	$scope.domainsFilter = {};
	$scope.tenantsFilter = {};

	$scope.unpublishedCount = 0;
	$scope.deletedCount = 0;

	
	adminAPIservice.loadStreams(info.getActiveTenant(), info.getActiveTenant().tenantCode, true).success(function(response) {
		console.log("loadStreams SUCCESS", response);
		$scope.streamsList = response;
		$scope.showLoading = false;
		for (var i = 0; i <response.length; i++) {
			
			if(response[i].unpublished){
				$scope.unpublishedCount++;
			}
			if(response[i].status && (response[i].status.idStatus==5 || response[i].status.idStatus==4)){
				$scope.deletedCount++;
			}

			var domainkey = $translate.instant(response[i].domain.domaincode);
			if(typeof $scope.domainsFilter[domainkey] == 'undefined')
				$scope.domainsFilter[domainkey] = {"key":response[i].domain.domaincode, "checked": true, "count": 1};
			else
				$scope.domainsFilter[domainkey].count++;

			if(typeof $scope.tenantsFilter[response[i].tenantManager.tenantcode] == 'undefined')
				$scope.tenantsFilter[response[i].tenantManager.tenantcode] = {"tenant":response[i].tenantManager, "checked": response[i].tenantManager.tenantcode == $scope.tenant, "count": 1};
			else
				$scope.tenantsFilter[response[i].tenantManager.tenantcode].count++;
			
		}

		$scope.admin_response = {};
	}).error(function(response){
		console.error("loadStreams ERROR", response);
		$scope.showLoading = false;
		if(response && response.errorCode && response.errorCode == 'E02'){
			$scope.admin_response.type = 'info';
			$scope.admin_response.message = 'MANAGEMENT_STREAM_LIST_RESULT_EMPTY';
		}
		else{
			$scope.admin_response.type = 'danger';
			$scope.admin_response.message = 'UNEXPECTED_ERROR';
			if(response && response.errorName)
				$scope.admin_response.detail= response.errorName;
			if(response && response.errorCode)
				$scope.admin_response.code= response.errorCode;
		}

	});
	
	$scope.searchCodeFilter = function(stream) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(stream.streamcode);
	};
	
	$scope.searchNameFilter = function(stream) {
		var keyword = new RegExp($scope.nameFilter, 'i');
		return !$scope.nameFilter || keyword.test(stream.streamname);
	};

	$scope.searchStatusFilter = function(stream) {
		var keyword = new RegExp($scope.statusFilter, 'i');
		return !$scope.statusFilter || keyword.test($translate.instant(stream.status.statuscode));
	};
	
	$scope.searchDomainFilter = function(stream) {
		return $scope.domainsFilter[$translate.instant(stream.domain.domaincode)].checked;
	};

	$scope.searchTenantFilter = function(stream) {
		return $scope.tenantsFilter[stream.tenantManager.tenantcode].checked;
	};
	
//	$scope.searchDomainFilter = function(stream) {
//		var keyword = new RegExp($scope.domainFilter, 'i');
//		return !$scope.domainFilter || keyword.test($translate.instant(stream.domain.domaincode));
//	};

	$scope.viewUnistalledFilter = function(stream) {
		if(!$scope.viewUnistalledCheck){
			var keyword = new RegExp(Constants.STREAM_STATUS_UNINST, 'i');
			return !keyword.test(stream.status.statuscode);
		} else
			return true;
	};
	
	$scope.viewUnpublishedCheck = false;
	$scope.viewUnpublishedFilter = function(stream) {
		if(!$scope.viewUnpublishedCheck){
			return (!stream.unpublished);
		}
		else
			return true;
	};

	
	$scope.$watch('viewUnistalledCheck', function(newCode) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});

	$scope.$watch('codeFilter', function(newCode) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});
	
	$scope.$watch('nameFilter', function(newName) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});
	
	$scope.$watch('statusFilter', function(newStatus) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});
	
	$scope.$watch('domainFilter', function(newDomain) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});

	$scope.selectedStreams = [];

	$scope.isSelected = function(stream) {
		return $scope.selectedStreams.indexOf(stream) >= 0;
	};

	$scope.updateSelection = function($event, stream) {
		var checkbox = $event.target;
		var action = (checkbox.checked ? 'add' : 'remove');
		updateSelected(action, stream);
	};
	
	$scope.selectDomainsFilter = function(type){
		console.log("selectDomainsFilter", type);
		for (var key in $scope.domainsFilter) {
		    if ($scope.domainsFilter.hasOwnProperty(key)) {
		    	$scope.domainsFilter[key].checked = type == 'all'? true: type == 'none'? false: !$scope.domainsFilter[key].checked;
		    }
		}
	};

	$scope.selectTenantsFilter = function(type){
		console.log("selectTenantsFilter", type);
		for (var key in $scope.tenantsFilter) {
		    if ($scope.tenantsFilter.hasOwnProperty(key)) {
		    	$scope.tenantsFilter[key].checked = type == 'all'? true: type == 'none'? false: !$scope.tenantsFilter[key].checked;
		    }
		}
	};
	var updateSelected = function(action, stream) {
		if (action === 'add' && $scope.selectedStreams.indexOf(stream) === -1) {
			$scope.selectedStreams.push(stream);
		}
		else if (action === 'remove' && $scope.selectedStreams.indexOf(stream) !== -1) {
			$scope.selectedStreams.splice($scope.selectedStreams.indexOf(stream), 1);
		}
	};

	$scope.canEdit = function() {
		if($scope.selectedStreams.length==1 && $scope.selectedStreams[0].status && $scope.selectedStreams[0].status.statuscode == Constants.STREAM_STATUS_DRAFT){
			return true;
		}
		return false;
	};
	
  	$scope.editStream  = function(){
  		var editUrl = "";
  		if(typeof $scope.selectedStreams != 'undefined' && $scope.selectedStreams.length>0)
  			editUrl = "#/management/editStream/stream/"+$scope.selectedStreams[0].tenantManager.tenantcode+"/"+$scope.selectedStreams[0].streamcode +"/" + $scope.selectedStreams[0].idstream;
  		return editUrl;
  	};
  	
	$scope.canMultiInstall = function() {
		var canMultiInstall = false;
		if($scope.selectedStreams){
			for (var multiInstallIndex = 0; multiInstallIndex < $scope.selectedStreams.length; multiInstallIndex++) {
				if($scope.selectedStreams[multiInstallIndex].status && $scope.selectedStreams[multiInstallIndex].status.statuscode == Constants.STREAM_STATUS_DRAFT){
					canMultiInstall = true;
					break;
				}
			}
		}
		return canMultiInstall;
	};
	
	
	
	$scope.multiInstall  = function(){
		var multiInstallModal = $modal.open({
			animation : true,
			templateUrl : 'multiUnistallDatasetModal.html',
			controller : 'MultiUnistallDatasetModalCtrl',
			backdrop  : 'static',
			size: 'lg',
			resolve: { 
				selectedStreams: function () {
					return $scope.selectedStreams;
				}, 
				activeTenant: function () {
					return info.getActiveTenant();
				}
			}
		});
	};
	
	
	$scope.deleteStream = function(){
		//alert("Funzionalita non ancora abilitata!");
		if($scope.selectedStreams.length>0){
			//$location.path('management/editStream/'+$scope.selectedStreams[0].codiceTenant +'/'+$scope.selectedStreams[0].codiceVirtualEntity+'/'+$scope.selectedStreams[0].streamcode);
		}
		else{
			// FIXME error message...
		}
	};
	
} ]);

appControllers.controller('MultiUnistallDatasetModalCtrl', [ '$scope', '$modalInstance', 'adminAPIservice', 'selectedStreams', 'activeTenant',
    function($scope, $modalInstance, adminAPIservice, selectedStreams, activeTenant) {
		console.log("MultiUnistallDatasetModalCtrl", selectedStreams);
		$scope.selectedStreams = selectedStreams;
		$scope.totalStream = selectedStreams.length;
		$scope.multiinstall_response = {};
		$scope.notDraftStream = [];
		$scope.updatedStream = [];
		$scope.errorStream = [];

		$scope.update = {loading:true};
		var requestInstall = function(){
			if($scope.selectedStreams && $scope.selectedStreams.length>0){
				var selectedStream = $scope.selectedStreams.pop();
				if(selectedStream.status.statuscode == Constants.STREAM_STATUS_DRAFT){
					
					adminAPIservice.lifecycleStream(Constants.LIFECYCLE_STREAM_REQ_INST,selectedStream,activeTenant).success(function(response) {
						console.log("result updateLifecycle ", response);	
						$scope.updatedStream.push(selectedStream);
						selectedStream.status.statuscode = Constants.STREAM_STATUS_REQ_INST;
					}).error(function(data,status){
				  		console.error("updateLifecycle ERROR", data,status);
				  		$scope.errorStream.push(selectedStream);
				  		
				  	});
				}
				else{
					$scope.notDraftStream.push(selectedStream);
				}
				requestInstall();
			}
			else{
				$scope.update = {loading:false};
				if($scope.errorStream.length>0){
					$scope.multiinstall_response.type = 'danger';
					$scope.multiinstall_response.message = 'MANAGEMENT_STREAM_MULTI_INSTALL_STREAM_ERROR';
					
				}
				else if($scope.notDraftStream.length>0){
					$scope.multiinstall_response.type = 'warning';
					$scope.multiinstall_response.message = 'MANAGEMENT_STREAM_MULTI_INSTALL_NO_DRAFT_STREAM_WARNING';
					
				}
				else{
					$scope.multiinstall_response.type = 'info';
					$scope.multiinstall_response.message = 'MANAGEMENT_STREAM_MULTI_INSTALL_STREAMS_OK';
				}
				
			}
			
		};
		
		requestInstall();

		$scope.close = function () {
		    $modalInstance.dismiss('cancel');
		};
	
	
}]);


appControllers.controller('ManagementStreamCtrl', [ '$scope', '$routeParams', 'adminAPIservice', 'sharedAdminResponse', 'info', '$timeout', "$filter", 'readFilePreview', '$location', 'sharedDatasource', '$translate',
                                                    function($scope, $routeParams, adminAPIservice, sharedAdminResponse, info, $timeout, $filter, readFilePreview, $location, sharedDatasource, $translate) {
	$scope.tenantCode = $routeParams.tenant_code;

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};
	
	$scope.errorMsg="Errore";
	$scope.successMsg="Successo";
	$scope.updateInfo = null;
	$scope.updateWarning = null;
	$scope.updateError = null;

	$scope.warningMessages = [];
	
	$scope.forms = {};
	
	$scope.user = info.getInfo().user;

	$scope.currentStep = 'register';
	$scope.wizardSteps = [{'name':'register', 'style':''},
	                      {'name':'requestor', 'style':''},
	                      {'name':'detail', 'style':''},
	                      {'name':'components', 'style':''},
	                      {'name':'tweetdata', 'style':''},
	                      {'name':'share', 'style':''}];

	var refreshWizardToolbar = function(){
		var style = 'step-done';
		for (var int = 0; int < $scope.wizardSteps.length; int++) {
			$scope.wizardSteps[int].style = style;
			if($scope.wizardSteps[int].name == $scope.currentStep)
				style = '';
		};
	};
	
	$scope.provaDire = function(){
		console.log("Stream", $scope.stream);
	};

	$scope.extra = {selectedSo:null};
	var isTwitter = function(){
		return $scope.extra.selectedSo !=null && $scope.extra.selectedSo.soType.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID;
	};


	$scope.admin_response = {};
	
	refreshWizardToolbar();
	$scope.componentsVisible = false;
	$scope.goToRegister  = function(){ $scope.currentStep = 'register'; refreshWizardToolbar();};
	$scope.goToRequestor  = function(){ $scope.currentStep = 'requestor';refreshWizardToolbar();};
	$scope.goToDetail  = function(){ $scope.currentStep = 'detail';refreshWizardToolbar();};
	$scope.goToComponents  = function(){
		console.log("goToComponents",$scope.extra.selectedSo);
		console.log("ISTWITTER",isTwitter());
		
		if(isTwitter()){
			$scope.currentStep = 'tweetdata';
		}
		else{
			$scope.currentStep = 'components';
			$scope.componentsVisible = true;
		}
		refreshWizardToolbar();
	};
	
	$scope.goToShare  = function(){
		if($scope.extra.selectedSo !=null && $scope.extra.selectedSo.soType.idSoType != Constants.VIRTUALENTITY_TYPE_TWITTER_ID 
				&& (!$scope.stream.components || $scope.stream.components.length==0)){
			$scope.admin_response.type = 'warning';
			$scope.admin_response.message = 'MANAGEMENT_EDIT_STREAM_WARNING_NO_COMPONENTS';
		}
		else{
			
		$scope.currentStep = 'share';
			refreshWizardToolbar();
		}

	};
	
	$scope.canCreatePublicStream = function(){
		//return info.getActiveTenantType() != 'trial';
		return info.getActiveShareInformationType() == "public";
	}; 
	
	
	$scope.canShareStream = function(){
		//return info.getActiveTenantType() != 'trial';
		return info.getActiveShareInformationType() == "public";
	}; 

	$scope.extra.isInternal = false;

	
	var cleanStreamBeforeUpdate = function(){
		if(Helpers.util.has($scope.stream, 'opendata') && !$scope.stream.opendata.isOpenData)
			delete $scope.stream['opendata'];
		else{
			if(Helpers.util.has($scope.stream, 'opendata.opendataupdatedate') )	{	
					var date =  new Date( $scope.stream.opendata.opendataupdatedate);	
					var year = (date.getFullYear()).toString();
					var month = ((date.getMonth()+1) < 10) ? "0" + (date.getMonth()+1) :(date.getMonth()+1);
					var day = ((date.getDate() < 10) ? "0" + date.getDate() :date.getDate()).toString();
					$scope.stream.opendata.opendataupdatedate= year+month+day;	
			}
		}
	
		if($scope.stream.license && $scope.stream.license.idLicense==null && $scope.stream.license.description==null && $scope.stream.license.licensecode==null)
			delete $scope.stream['license'];

		if($scope.stream.visibility == 'public')
			delete $scope.stream['sharingTenants'];
		if($scope.stream.visibility != 'private')
			delete $scope.stream['copyright'];
		else
			delete $scope.stream['license'];
		
		if($scope.stream.groups){
			for (var i = 0; i < $scope.stream.groups.length; i++) {
				$scope.stream.groups[i].idDatasourcegroupType = $scope.stream.groups[i].type.idDatasourcegroupType;				
			}
		}

		
		if (isTwitter()) delete $scope.stream['components'];
	};
	
	$scope.stream = {};
	
	$scope.isNewStream = false;
	if(!$routeParams.entity_code || $routeParams.entity_code == null || $routeParams.entity_code === undefined ||!$routeParams.id_datasource || $routeParams.id_datasource == null || $routeParams.id_datasource === undefined )
		$scope.isNewStream = true;
	
	
	console.log("isNewStream",$scope.isNewStream);

	$scope.preview= {components:new Array(),"type":"stream"};
	

	/*
	 * LOAD STREAM
	 */
	var loadedStream = null;
	$scope.loadStream = function(){
		console.log("loadStream START");
		console.log("getActiveTenant",info.getActiveTenant());
		console.log("organizationCode = ",info.getActiveTenant().organization.organizationcode);
		if(!$scope.isNewStream){
			$scope.admin_response = {};
			adminAPIservice.loadDatasource(Constants.DATASOURCE_TYPE_STREAM,  info.getActiveTenant(),$routeParams.id_datasource).success(function(response) {
				console.log("loadDatasource", response);
				
				try{
					$scope.inputDatasource = response;
					if(response && response.externalReference)
						response.externalreference = response.externalReference;
					loadedStream = response;
					$scope.stream = Helpers.yucca.prepareDatasourceForUpdate(Constants.DATASOURCE_TYPE_STREAM,response);
					$scope.streamDomain = $scope.inputDatasource.domain['lang'+$translate.use()];
					$scope.streamSubdomain = $scope.inputDatasource.subdomain['lang'+$translate.use()];
					$scope.extra.selectedSo = $scope.inputDatasource.stream.smartobject;

					for (var cIndex = 0; cIndex < $scope.stream.components.length; cIndex++) {
						if(typeof $scope.stream.components[cIndex].isgroupable == 'undefined')
							$scope.stream.components[cIndex].isgroupable = false;
						$scope.preview.components.push($scope.stream.components[cIndex]);
					}
					
		  			if(typeof $scope.inputDatasource.stream != 'undefined')
		  				$scope.inputDatasource.stream.wsUrl = Helpers.stream.wsOutputUrl($scope.inputDatasource);

					
					
					
					$scope.newComponent = {sourcecolumn: $scope.preview.components.length+1};
					console.log("LoadDataset prepared", $scope.stream);
					$scope.VIRTUALENTITY_TYPE_TWITTER_ID = Constants.VIRTUALENTITY_TYPE_TWITTER_ID;
					//FIXME serve?
					$scope.newField = {sourcecolumn: $scope.stream.components.length+1};
					
					if($scope.user!=undefined && $scope.user.loggedIn==true){
						$scope.stream.requestername=$scope.user.firstname;
						$scope.stream.requestersurname=$scope.user.lastname;
						$scope.stream.requestermail=$scope.user.email;
					}

					$scope.extra.isInternal = $scope.stream.isInternal;

					$scope.datasourceReady = true;
					

					
				} catch (e) {
					console.error("loadDataset ERROR", e);
				}
			}).error(function(data,status){
				console.error("loadDataset ERROR", data,status);
				$scope.admin_response.type = 'danger';
				if(status==404)
					$scope.admin_response.message = 'MANAGEMENT_VIEW_DATASET_ERROR_NOT_FOUND';
				else
					$scope.admin_response.message = 'UNEXPECTED_ERROR';
			});

		} else {
			$scope.datasourceReady = true;
			var streamClone = sharedDatasource.getDatasource();
			if(streamClone==null){
				$scope.stream  = {"datasourceType": Constants.DATASOURCE_TYPE_STREAM};
				//if($scope.canCreatePublicStream())
				//	$scope.stream.visibility = 'public';
				//else
				$scope.stream.visibility = 'private';
				//$scope.stream.icon  = "img/stream-icon-default.png";
				$scope.stream.tags = [];
				$scope.stream.groups = [];
				$scope.stream.components = [];
				$scope.stream.savedata = true;
				$scope.stream.unpublished = false;
				$scope.stream.opendata = {"isOpenData":false};
				$scope.datasourceReady = true;
			} 
			else {
				console.log("streamClone", streamClone);

				$scope.stream = Helpers.yucca.prepareDatasourceForUpdate(Constants.DATASOURCE_TYPE_STREAM,streamClone);
				

				$scope.streamDomain = $scope.stream.domaincode;

				delete $scope.stream.currentDataSourceVersion;
				delete $scope.stream.streamname;
				delete $scope.stream.streamcode;
				delete $scope.stream.idstream;
				if(Helpers.util.has($scope.stream, "dcat.idDcat"))
					delete $scope.stream.dcat.idDcat;
				
				delete $scope.stream.datasetcode;
				delete $scope.stream.datasetname;

				
				cleanStreamBeforeUpdate();
				if(typeof $scope.stream.opendata == 'undefined')
					$scope.stream.opendata = {"isOpenData":false};
				console.log("LoadStream prepared", $scope.stream);
				for (var cIndex = 0; cIndex < $scope.stream.components.length; cIndex++) {
					delete $scope.stream.components[cIndex].idComponent;
					$scope.preview.components.push($scope.stream.components[cIndex]);
				}
				
				$scope.extra.selectedSo = streamClone.stream.smartobject;
				if(Helpers.util.has(streamClone, "stream.internalStreams.length") && streamClone.stream.internalStreams.length>0){
					$scope.extra.isInternal = true;
//					$scope.stream.internalStreamsCreate  = new Array();
//					for (var internalStreamIndex = 0; internalStreamIndex < streamClone.stream.internalStreams.length; internalStreamIndex++) {
//						$scope.stream.internalStreamsCreate.push(streamClone.stream.internalStreams[internalStreamIndex]);
//						
//					}
				}
				
				$scope.streamReady = true;

			
//
//				if(streamClone.smartobject.socode == "internal"){
//					//$scope.extra.inputTypeStream = 0;
//					$scope.internalStreams = $scope.stream.stream.internalStreams;//.streamChildren;
//					$scope.streamSiddhiQuery = $scope.stream.stream.internalquery;
//				}

				sharedDatasource.setDatasource(null);
			}
			if($scope.user!=undefined && $scope.user.loggedIn==true){
				$scope.stream.requestername=$scope.user.firstname;
				$scope.stream.requestersurname=$scope.user.lastname;
				$scope.stream.requestermail=$scope.user.email;
			}


		}
	};
	
	
	$scope.loadStream();
	
	$scope.viewStream  = function(){
			var viewUrl = "#/management/viewDatasource/stream/"+$scope.tenantCode+"/"+$scope.stream.streamcode +"/" + $scope.stream.idstream;
			return viewUrl;
	};


	$scope.canInstall = function() {
		if($scope.stream && $scope.stream.status && $scope.stream.status.statuscode == Constants.STREAM_STATUS_DRAFT)
			return true;
		return false;
	};

	$scope.canUnistall = function() {
		if($scope.stream && $scope.stream.status && $scope.stream.status.statuscode == Constants.STREAM_STATUS_INST)
			return true;
		return false;
	};

	$scope.canEdit = function() {
	
		if($scope.stream && $scope.stream.status && $scope.stream.status.statuscode == Constants.STREAM_STATUS_DRAFT)
			return true;
		return false;
	};
	

	$scope.canCreateNewVersion = function() {
		if($scope.stream && $scope.stream.status && $scope.stream.status.statuscode == Constants.STREAM_STATUS_INST)
			return true;
		return false;
	};

	
	$scope.save = function(){
		console.log("save stream", $scope.stream);
		if($scope.isNewStream)
			$scope.createStream($scope.stream);
		else
			$scope.updateStream($scope.stream);
	};
	
	$scope.cancel = function(){    
		$location.path('management/streams/'+$scope.tenantCode);
	};
		
	/*
	 * UPDATE STREAM
	 */
	$scope.updateStream = function() {
		
		$scope.stream.name=$scope.stream.streamname;

		//Ciclo per rivalorizzazione dell'array dei tag (l'API di update richiede un array di IdTag)
		//Old tag --> tag precedentemente inseriti in fase di creazione dello stream
		$scope.stream.oldTags= [];
		if ($scope.stream.tags && $scope.stream.tags.length >0 ) {
			for (var int = 0; int < $scope.stream.tags.length; int++)  {
				if ($scope.stream.tags[int].hasOwnProperty('idTag')){
					$scope.stream.oldTags.push($scope.stream.tags[int].idTag);
					$scope.removeTag(int);
					$scope.stream.tags.splice( int, 0, $scope.stream.oldTags[int] );
				}
			}
		}
			
		if(!$scope.stream.isSiddhiQueryValid && $scope.extra.isInternal){
			$scope.errorMsg='STREAM_SIDDHI_PLEASE_VALIDATE';
			$scope.validationRes=1;
			Helpers.util.scrollTo();
			//Helpers.util.scrollTo("validateMsg");
		}
		else{	
			$scope.validationRes=2;
			$scope.updateInfo = null;
			$scope.updateWarning = null;
			$scope.warningMessages = [];
			$scope.updateError = null;
	
			
			if ($scope.stream.internalStreamsCreate) {
				$scope.stream.internalStreams = [];
				for (var int = 0; int < $scope.stream.internalStreamsCreate.length; int++) {
					$scope.stream.internalStreams.push({
						"streamAlias":"input"+int,
						"idStream": $scope.stream.internalStreamsCreate[int].stream.idstream
					});
				}
			}
			
			if(typeof $scope.stream.internalStreams != undefined && $scope.stream.internalStreams!=null){
				for(var i = 0; i< $scope.stream.internalStreams.length; i++){
					$scope.stream.internalStreams[i].streamAlias = "input"+i;
//				newStream.stream.streamInternalChildren.streamChildren.push({
//					"aliasChildStream":"input"+i,
//					"idChildStream": $scope.internalStreams[i].idStream
//				});
				}
			}
			
			if(!$scope.stream.components || $scope.stream.components.length==0){
				$scope.updateWarning = true;
				$scope.warningMessages.push("MANAGEMENT_EDIT_STREAM_WARNING_NO_COMPONENTS");
			}

			cleanStreamBeforeUpdate();
			if(loadedStream!=null && Helpers.yucca.deleteDcatId(loadedStream.dcat, $scope.stream.dcat))
				delete $scope.stream.dcat.idDcat;

//			if(!$scope.stream.opendata.isOpenData){
//				delete $scope.stream['openData'];
//			} else {
//				if(Helpers.util.has($scope.stream, 'opendata.opendataupdatedate') )	{				
//					//$scope.stream.opendata.opendataupdatedate =  new Date($scope.stream.opendata.opendataupdatedate).getTime();
//						var date =  new Date( $scope.stream.opendata.opendataupdatedate);	
//						var year = (date.getFullYear()).toString();
//						var month = ((date.getMonth()+1) < 10) ? "0" + (date.getMonth()+1) :(date.getMonth()+1);
//						var day = ((date.getDate() < 10) ? "0" + date.getDate() :date.getDate()).toString();
//						 $scope.stream.opendata.opendataupdatedate= year+month+day;	
//				}
//			}
//			
			
//			if($scope.stream.license && $scope.stream.license.description==null && $scope.stream.license.licesecode==null)
//				delete $scope.stream['license'];

//			if($scope.stream.visibility == 'public')
//				delete $scope.stream['sharingTenants'];
//			if($scope.stream.visibility != 'private')
//				delete $scope.stream['copyright'];
			
	
			console.log("stream ready", $scope.stream );
			console.log("stream selectedSo", $scope.extra.selectedSo.socode );
			adminAPIservice.updateStream(info.getActiveTenant(), $scope.extra.selectedSo.socode,$scope.stream).success(function(response) {
				console.log("updateStream SUCCESS", response);
				Helpers.util.scrollTo();
				$scope.admin_response.type = 'success';
				$scope.admin_response.message = 'MANAGEMENT_EDIT_STREAM_DATA_SAVED_INFO';
				sharedAdminResponse.setResponse($scope.admin_response);
				$scope.isUpdating = false;
				//$location.path('management/viewStream/'+$scope.tenantCode +'/'+stream.codiceVirtualEntity+'/'+newStream.stream.streamcode);
	
			}).error(function(response){
				console.error("updateStream ERROR", response);
				Helpers.util.scrollTo();
				$scope.isUpdating = false;
				$scope.admin_response.type = 'danger';
				$scope.admin_response.message = 'MANAGEMENT_EDIT_STREAM_SAVE_ERROR';
				if(response && response.errorName)
					$scope.admin_response.detail= response.errorName;
				if(response && response.errorCode)
					$scope.admin_response.code= response.errorCode;
			});
		}
	};
	

	$scope.requestInstallation = function(){
		updateLifecycle(Constants.LIFECYCLE_STREAM_REQ_INST);
	};

	$scope.requestUnistallation = function(){
		updateLifecycle(Constants.LIFECYCLE_STREAM_REQ_UNINST);
	};

	/*($scope.createNewVersion = function(){
		updateLifecycle(Constants.LIFECYCLE_STREAM_NEW_VERSION);
	};*/
	
	$scope.soList = [];
	//$scope.extra.inputTypeStream = 1;

	adminAPIservice.loadSmartobjects(info.getActiveTenant(), info.getActiveTenant().tenantCode).success(function(response) {
		console.log(response);
		for (var int = 0; int < response.length; int++) {
			var so = response[int];
			if(so.soType.idSoType != Constants.VIRTUALENTITY_TYPE_INTERNAL_ID){
				$scope.soList.push(so);
			}else{
				soInternal=so;
			}

		}
	});
	
	
	/*
	 * CREATE STREAM
	 */
	$scope.createStream = function(){

		console.log("createStream", $scope.stream);
		//$scope.stream.privacyacceptance=$scope.privacyAcceptance & $scope.responsabilityAcceptance;
		$scope.stream.name=$scope.stream.streamname;
		
		if($scope.validationRes!=0 && $scope.stream.codiceVirtualEntity=="internal"){
			$scope.errorMsg='STREAM_SIDDHI_PLEASE_VALIDATE';
			$scope.validationRes=1;
			$scope.goToComponents();
			//Helpers.util.scrollTo("validateMsg");
		}else{	
				if (!Helpers.util.has($scope.stream,"opendata.isOpenData")  || !$scope.stream.opendata.isOpenData){
					delete $scope.stream['opendata'];
				} else {
					if(Helpers.util.has($scope.stream, 'openData.opendataupdatedate') )	{				
					
						var date =  new Date($scope.stream.openData.opendataupdatedate);	
						var year = (date.getFullYear()).toString();
						var month = ((date.getMonth()+1) < 10) ? "0" + (date.getMonth()+1) :(date.getMonth()+1);
						var day = ((date.getDate() < 10) ? "0" + date.getDate() :date.getDate()).toString();
						$scope.stream.openData.opendataupdatedate= year+month+day;	
					}
				}
	
			$scope.isUpdating = true;
			
			//Valorizzazione parametri obbligatori richiesti dall'API
			$scope.stream.idTenant = info.getActiveTenant().idTenant;
			for (var int = 0; int < $scope.stream.components.length; int++) {
				$scope.stream.components[int].alias=$scope.stream.components[int].name;
				$scope.stream.components[int].inorder=int;
			}
			
			$scope.stream.internalStreams = new Array();
			if ($scope.stream.internalStreamsCreate) {
				for (var int = 0; int < $scope.stream.internalStreamsCreate.length; int++) {
					$scope.stream.internalStreams.push({
						"streamAlias":"input"+int,
						"idStream": $scope.stream.internalStreamsCreate[int].stream.idstream
					});
				}
			}
			
			if (isTwitter()) delete $scope.stream['components'];
			if ($scope.stream.visibility == 'private') delete $scope.stream['license'];
			
			
	
			console.log("createStream - stream", $scope.stream);
			console.log("createStream - selectedSo", $scope.extra.selectedSo);
			
			

			cleanStreamBeforeUpdate();
			adminAPIservice.createStream(info.getActiveTenant(), $scope.extra.selectedSo.socode,$scope.stream).success(function(response) {
				console.log("createStream SUCCESS", response);
				$scope.admin_response.type = 'success';
				$scope.admin_response.message = 'MANAGEMENT_EDIT_STREAM_SAVED_INFO';
				sharedAdminResponse.setResponse($scope.admin_response);
				$scope.isUpdating = false;
				$location.path('management/viewDatasource/stream/'+info.getActiveTenant().tenantcode +'/'+response.streamcode+'/'+response.idStream);
			}).error(function(response){
				console.error("createStream ERROR", response);
				$scope.isUpdating = false;
				$scope.admin_response.type = 'danger';
				$scope.admin_response.message = 'MANAGEMENT_EDIT_STREAM_SAVE_ERROR';
				if(response && response.errorName)
					$scope.admin_response.detail= response.errorName;
				if(response && response.errorCode)
					$scope.admin_response.code= response.errorCode;
				Helpers.util.scrollTo();

			});

		}
	
	};

	$scope.cloneStream = function(){
		console.log("cloneStream");
		sharedStream.setStream($scope.stream);
		$location.path('management/newStream/'+$scope.tenantCode);
	};

	console.log("Stream - ", $scope.stream);
} ]);


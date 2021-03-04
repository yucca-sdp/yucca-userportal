/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

appControllers.controller('ManagementVirtualentityListCtrl', [ '$scope', '$route', '$location', 'adminAPIservice', 'info', 
                                                               function($scope, $route, $location, adminAPIservice, info, filterFilter) {
	$scope.tenantCode = $route.current.params.tenant_code;
	$scope.showLoading = true;


	console.log("info.isOwner( $scope.tenantCode);", info.isOwner( $scope.tenantCode));
	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};


	$scope.soList = [];
	$scope.filteredSoList = [];
	$scope.codeFilter = null;
	$scope.statusFilter = null;

	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.soList.length;
	$scope.predicate = '';

	
	
	adminAPIservice.loadSmartobjects(info.getActiveTenant()).success(function(response) {
		$scope.unexpectedError = false;
		$scope.showLoading = false;
		console.log("response", response);
		if(response==null)
			response = {};
		$scope.soList = response;
		$scope.totalItems = $scope.soList.length;
	}).error(function(response) {
		console.error("loadSmartobjects ERROR",response);
		$scope.unexpectedError = true;
	});


	$scope.searchCodeFilter = function(so) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(so.socode);
	};


	$scope.$watch('codeFilter', function(newCode) {
		$scope.currentPage = 1;
	});

	$scope.$watch('statusFilter', function(newStatus) {
		$scope.currentPage = 1;
	});

	$scope.selectedSo = [];

	$scope.isSelected = function(so) {
		return $scope.selectedSo.indexOf(so) >= 0;
	};

	$scope.isInternal = function(so) {
		return so.idSoType == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;
	};

	$scope.updateSelection = function($event, so) {
		var checkbox = $event.target;
		var action = (checkbox.checked ? 'add' : 'remove');
		updateSelected(action, so);
	};	
	var updateSelected = function(action, so) {
		if (action === 'add' && $scope.selectedSo.indexOf(so) === -1) {
			$scope.selectedSo.push(so);
		}
		if (action === 'remove' && $scope.selectedSo.indexOf(so) !== -1) {
			$scope.selectedSo.splice($scope.selectedSo.indexOf(so), 1);
		}
	};

	$scope.editSo = function(){
		if($scope.selectedSo.length===1){
			$location.path('management/editVirtualentity/'+$scope.selectedSo[0].organization.organizationcode +'/'+ $scope.selectedSo[0].socode );
		}
		else{
			// FIXME error message...
		}
	};

} ]);


appControllers.controller('ManagementVirtualentityWizardCtrl', [ '$scope', function($scope) {
	$scope.currentStep = 'register';
	$scope.wizardSteps = [{'name':'register', 'style':''},
	                      {'name':'position', 'style':''},
	                      {'name':'detail', 'style':''},
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
	$scope.goToRegister  = function(){ $scope.currentStep = 'register'; refreshWizardToolbar();};
	$scope.goToPosition  = function(){ $scope.currentStep = 'position';refreshWizardToolbar();};
	$scope.goToDetail  = function(){ $scope.currentStep = 'detail';refreshWizardToolbar();};
	

} ]);

appControllers.controller('ManagementVirtualentityCtrl', [ '$scope', '$routeParams', 'adminAPIservice', 'sharedAdminResponse', 'info', '$location', 'upService', 
                                                           function($scope, $routeParams, adminAPIservice, sharedAdminResponse, info, $location, upService) {
	$scope.tenantCode = $routeParams.tenant_code;
	$scope.organizationCode = info.getActiveTenant().organization.organizationcode;

	$scope.changeTwitterUser = false;

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};

	$scope.so_categoriesList = [];
	adminAPIservice.loadSOCategories().success(function(response) {
		console.log("loadSOCategories", response);
		$scope.so_categoriesList = response;
	});

	$scope.so_typesList = [];
	adminAPIservice.loadSOTypes().success(function(response) {
		for (var int = 0; int < response.length; int++) {

			if(response[int].idSoType != Constants.VIRTUALENTITY_TYPE_INTERNAL_ID)
				$scope.so_typesList.push(response[int]);
		};
	});
	
	$scope.locationTypeList = [];
	adminAPIservice.loadLocationTypes().success(function(response) {
		$scope.locationTypeList = response;
	});
	
	$scope.supplyTypeList = [];
	adminAPIservice.loadSupplyTypes().success(function(response) {
		$scope.supplyTypeList = response;
	});
	
	$scope.exposureTypeList = [];
	adminAPIservice.loadExposureTypes().success(function(response) {
		$scope.exposureTypeList = response;
	});
	
	
	$scope.admin_response = sharedAdminResponse.getResponse();
	
	
	$scope.generateUUID = function(virtualentity){
		console.log("ui");
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x7|0x8)).toString(16);
		});
		$scope.so.socode= uuid;
	};
		
	$scope.slugDisabled = function(e){
		var rtnBool = false;
		if((typeof $scope.so.name) == 'undefined'){
			rtnBool = true;
		} else {
			if ($scope.so.name.length < 1){
				rtnBool = true;
			}
		}
		if (rtnBool){
			$scope.so.slug = '';
		}
		return rtnBool;	
	};
	
	$scope.isValidSlug = false;
	
	
	$scope.checkSlug = function(slugInput){
		  var validChars = /[^a-zA-Z0-9]/g;
		  if (validChars.test(slugInput)) {
			$scope.isValidSlug = false;
		    return true;
		  } else {
			  $scope.isValidSlug = true;
			  return false;
		  }
	};
	
	var soList = null;
	$scope.clearSlug = function(slugInput){
		$scope.isValidSlug = false;
		var d = new Date().getTime();

		var firstSlug = slugInput.replace(/[^a-zA-Z0-9]/g, '');
		
		var rtnBool = false;
		adminAPIservice.loadSmartobjectsOfOrganization(info.getActiveTenant()).success(function(response) {
			console.debug("response", response);
			soList = response;
			soList.forEach(function(item) {
			    if (firstSlug == item.slug){
			    	rtnBool = true;
			    }
			});
	
			if (rtnBool){
				var slug = firstSlug+'xxx'.replace(/[xy]/g, function(c) {
					var r = (d + Math.random()*16)%16 | 0;
					d = Math.floor(d/16);
					return (c=='x' ? r : (r&0x7|0x8)).toString(16);
				});
				var rtnBool2 = false;
				if ($scope.so.name.length >= 1){
					soList.forEach(function(item) {
					    if (slug == item.slug){
					    	rtnBool2 = true;
					    }
					});
					if (!rtnBool2){
						$scope.so.slug = slug;
					} else {
						console.error("rtnBool2",rtnBool2);
					}
				}
			} else {
				$scope.isValidSlug = true;
				$scope.so.slug = firstSlug;
			}
		
		}).error(function(response) {
			console.error("loadSmartobjects ERROR",response);
		});
		
	};
	
	$scope.generateSLUG = function(){
		if(typeof $scope.so.name!='undefined')
			$scope.clearSlug($scope.so.name);
	};


	findDuplicateSlug = function(tenantCode, slugTest){
		var rtn = false;
		if(soList==null){
		
			adminAPIservice.loadSmartobjectsOfOrganization(info.getActiveTenant()).success(function(response) {
				soList.forEach(function(item) {
				    console.log(item.virtualEntitySlug);
				    if (slugTest == item.virtualEntitySlug){
				    	rtn = true;
				    }
				});
				return rtn;
			}).error(function(response) {
				console.error("loadSmartobjects ERROR",response);
			});
		}
		else{
			soList.forEach(function(item) {
			    console.log(item.virtualEntitySlug);
			    if (slugTest == item.virtualEntitySlug){
			    	rtn = true;
			    }
			});
			return rtn;
		}
	};

	//$scope.validationPatternUUID = Constants.VALIDATION_PATTERN_UUID;
	$scope.validationPatternUUID = (function() {
		return {
			test: function(value) {
				if($scope.so.idSoType != Constants.VIRTUALENTITY_TYPE_DEVICE_ID ){
					return Constants.VALIDATION_PATTERN_CODE_VIRTUALENTITY.test(value);
				}
				else {
					return Constants.VALIDATION_PATTERN_UUID.test(value);
				}
			}
		};
	})();

	$scope.validationCodeTooltip = function(){
		if($scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID )
			return 'VALIDATION_PATTERN_UUID_TOOLTIP';
		return 'VALIDATION_PATTERN_CODE_VIRTUALENTITY_TOOLTIP';
	};
	
	$scope.isDevice = function() {
		if(!$scope.so || $scope.so.idSoType == null)
			return false;
		return $scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
	};

	$scope.isTwitter = function() {
		if(!$scope.so || $scope.so.idSoType == null)
			return false;
		return $scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID;
	};

	$scope.isCodeRequired = function() {
		return !$scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID ||  !$scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID;
	};

	$scope.enableCodeGeneateButton = function() {
		if(!$scope.so || $scope.so.idSoType==null){
			return false;
		}
		return $scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_DEVICE_ID ;
	};

	$scope.isCategoryRequired= function() {
		if(!$scope.so || $scope.so.idSoType==null){
			return false;
		}
		return true;
	};


	var loadTwitterCredential = function(){
		console.log("loadTwitterCredential");
		$scope.twitterCredentialLoading = true;
		$scope.twitterError = null;
		upService.loadTwitterCredential().success(function(response) {
			console.log("result qui ", response);
			$scope.twitterCredentialLoading = false;
			console.log("[loadTwitterCredential] - result.data", response.result);
			if(response.result=="OK"){
				$scope.twitterCredentialFound = true;
				$scope.so.twtusername = response.twitterUser.twtUsername;
				$scope.so.twtusertoken = response.twitterUser.twtUsertoken;
				$scope.so.twttokensecret = response.twitterUser.twtTokenSecret;
				$scope.so.twtname = response.twitterUser.twtName;
				$scope.so.twtuserid = response.twitterUser.twtIdUser;
				$scope.twtMiniProfileImageURLHttps = response.twitterUser.twtMiniProfileImageURLHttps;
			}
			else{
				console.log("non autenticato ", response);
				$scope.twitterCredentialFound = false;
				$scope.so.twtusername = null;
				$scope.so.twtusertoken = null;
				$scope.so.twttokensecret = null;
				$scope.so.twtname = null;
				$scope.so.twtuserid = null;
				$scope.twtMiniProfileImageURLHttps = null;
			}
			console.log("[loadTwitterCredential] - isTwitter", $scope.isTwitter());

		}).error(function(data, status, headers, config) {
			$scope.twitterCredentialLoading = false;
			$scope.twitterError = data.message;
		});
		
		console.log("[loadTwitterCredential] - tenant 1 = ", $routeParams.tenant_code);
		console.log("[loadTwitterCredential] - tenant 2 = ", $scope.tenantCode);
	};
	
	$scope.selectTypeChange = function(selectTypeChange) {
		if($scope.wizardSteps && $scope.wizardSteps!=null){
			if(selectTypeChange != Constants.VIRTUALENTITY_TYPE_DEVICE_ID){
				$scope.wizardSteps[1].style = "step-disabled";
				$scope.wizardSteps[2].style = "step-disabled";
			}
			else{
				$scope.wizardSteps[1].style = "";
				$scope.wizardSteps[2].style = "";
			}
		}
		$scope.so.idSoType = selectTypeChange;
		$scope.so.socode= "";
		$scope.so.idSoCategory = null;
		if($scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
			$scope.so.idSoCategory = Constants.VIRTUALENTITY_CATEGORY_NONE;
			$scope.so.twtmaxstreams = 5;
			loadTwitterCredential();
		}
		else{
			delete $scope.so.twtmaxstreams;
			delete $scope.so.twtname;
			delete $scope.so.twttokensecret;
			delete $scope.so.twtuserid;
			delete $scope.so.twtusername;
			delete $scope.so.twtusertoken;
		}
		$scope.so.slug = '';
		return true;
	};


	var isTwitterOk = function(){
		console.log("isTwitterOk",$scope.so.idSoType);
		console.log("isTwitterOk",$scope.so.twtusername);
		console.log("isTwitterOk",$scope.so.twtusertoken);
		console.log("isTwitterOk",$scope.so.twttokensecret);
		if($scope.so && $scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
			if($scope.so.twtusername && $scope.so.twtusername != null && $scope.so.twtusername != "" &&
					$scope.so.twtusertoken && $scope.so.twtusertoken != null && $scope.so.twtusertoken != "" &&
					$scope.so.twttokensecret && $scope.so.twttokensecret != null && $scope.so.twttokensecret != "")
				return true;
			else
				return false;
		}
		return true;
	};



	

	$scope.validationPatternFloat = Constants.VALIDATION_PATTERN_FLOAT;
	$scope.validationPatternInteger = Constants.VALIDATION_PATTERN_INTEGER;

	$scope.isNewSo = false;
	if(!$routeParams.entity_code || $routeParams.entity_code == null || $routeParams.entity_code === undefined )
		$scope.isNewSo = true;
	
	var loadSo = function(){
		if(!$scope.isNewSo){
			
			var editSo = $location.search().virtualEntityInSession;
			
			if(editSo && editSo!=null){
				$scope.so  = JSON.parse(decodeURI(editSo));
				if($scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
					console.log("loadTwitterCredential",loadTwitterCredential);
					loadTwitterCredential();
				}
				$scope.changeTwitterUser =  true;

			}
			else{
				$scope.admin_response = {};		
				sharedAdminResponse.setResponse($scope.admin_response); 
				adminAPIservice.loadSmartobject(info.getActiveTenant(), $routeParams.entity_code).success(function(response) {
					console.log("loadSmartobject", response);
					$scope.so = response;
					if(Helpers.util.has($scope.so, 'exposureType.idExposureType'))
						$scope.so.idExposureType = response.exposureType.idExposureType;
					if(Helpers.util.has($scope.so, 'locationType.idLocationType'))
						$scope.so.idLocationType = response.locationType.idLocationType;
					if(Helpers.util.has($scope.so, 'soType.idSoType'))
						$scope.so.idSoType = response.soType.idSoType;
					if(Helpers.util.has($scope.so, 'soCategory.idSoCategory'))
						$scope.so.idSoCategory = response.soCategory.idSoCategory;
					if(Helpers.util.has($scope.so, 'supplyType.idSupplyType'))
						$scope.so.idSupplyType = response.supplyType.idSupplyType;
					// idTenant ????
					
				}).error(function(response) {
					console.error("loadSo ERROR", response);
					$scope.admin_response.type = 'danger';
					$scope.admin_response.message = 'Smartobject not loaded';
					if(response && response.errorName)
						$scope.admin_response.detail= response.errorName;
					if(response && response.errorCode)
						$scope.admin_response.code= response.errorCode;
				});
			}
		}
		else {
			var newSo = $location.search().virtualEntityInSession;
			console.log("newSo", newSo);
			if(newSo && newSo!=null){
				$scope.so  = JSON.parse(decodeURI(newSo));
				if($scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
					console.log("loadTwitterCredential",loadTwitterCredential);
					loadTwitterCredential();
				}
			}
			else{
				$scope.so = {};
			}

		};
	};
	
	loadSo();


	$scope.initDate = new Date();
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];


	$scope.isInternal = function() {
		console.log("So", $scope.so);
		var isInternal = undefined;
		if(Helpers.util.has($scope, "so.soType.idSoType"))
			isInternal = $scope.so.soType.idSoType == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;
		else if(Helpers.util.has($scope, "so.idSoType"))
			isInternal = $scope.so.idSoType == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;

		return isInternal;
		//return $scope.so && $scope.so.soType && $scope.so.soType.idSoType && $scope.so.soType.idSoType == Constants.VIRTUALENTITY_TYPE_INTERNAL_ID;
	};

	
	$scope.save = function(){
		if(!isTwitterOk()){
			$scope.admin_response.type = 'warning';
			$scope.admin_response.message = 'MANAGEMENT_NEW_VIRTUALENTITY_TWITTER_NOTLOGGED_ERROR';
		}
		else{
			if($scope.isNewSo){
				$scope.createSo();
			}
			else
				$scope.updateSo();
		}
	};

	$scope.cancel = function(){    
		$location.path('management/virtualentities/'+$scope.tenantCode);
	};
	

	$scope.createSo  = function(){
		console.log("createSo", $scope.so);
		$scope.so.idTenant  = info.getActiveTenant().idTenant;
		$scope.admin_response = {};
		sharedAdminResponse.setResponse($scope.admin_response); 

		$scope.isUpdating = true;
		adminAPIservice.createSmartobject(info.getActiveTenant(), $scope.so).success(function(response) {
			console.log("createSo SUCCESS", response);
			$scope.admin_response.type = 'success';
			$scope.admin_response.message = 'MANAGEMENT_EDIT_VIRTUALENTITY_DATA_SAVED_INFO';
			sharedAdminResponse.setResponse($scope.admin_response);
			$scope.isUpdating = false;
			$location.path('management/viewVirtualentity/'+$scope.tenantCode +'/'+response.socode);
		}).error(function(response){
			console.error("createSo ERROR", response);
			$scope.isUpdating = false;
			$scope.admin_response.type = 'danger';
			$scope.admin_response.message = 'MANAGEMENT_NEW_VIRTUALENTITY_ERROR_MESSAGE';
			if(response && response.errorName)
				$scope.admin_response.detail= response.errorName;
			if(response && response.errorCode)
				$scope.admin_response.code= response.errorCode;

		});
	};
	
	$scope.updateSo  = function(){
		console.log("updateSo", $scope.so);
		$scope.admin_response = {};
		sharedAdminResponse.setResponse($scope.admin_response); 
		$scope.isUpdating = true;
		adminAPIservice.updateSmartobject(info.getActiveTenant(), $scope.so).success(function(response) {
			console.log("updateSo SUCCESS", response);
			$scope.isUpdating = false;
			$scope.admin_response.type = 'success';
			$scope.admin_response.message = 'MANAGEMENT_EDIT_VIRTUALENTITY_DATA_SAVED_INFO';
			sharedAdminResponse.setResponse($scope.admin_response);
			$location.path('management/editVirtualentity/'+$scope.tenantCode +'/'+response.socode);
			Helpers.util.scrollTo("topForm");
			if($scope.changeTwitterUser ){
				$scope.loadStreams();
			}
			else
				$scope.changeTwitterUser = false;

		}).error(function(response){
			console.error("updateSo ERROR", response);
			$scope.isUpdating = false;
			$scope.admin_response.type = 'danger';
			$scope.admin_response.message = 'MANAGEMENT_NEW_VIRTUALENTITY_ERROR_MESSAGE';
			if(response && response.errorName)
				$scope.admin_response.detail= response.errorName;
			if(response && response.errorCode)
				$scope.admin_response.code= response.errorCode;
			Helpers.util.scrollTo("topForm");
		});
	};


	$scope.twitterAuthUrl =  function() {
		var soAction = "new";
		var soCode = "";
		if(!$scope.isNewSo){
			soAction = "edit";
			soCode = $routeParams.entity_code;
		}
		
		return Constants.API_SERVICES_TWITTER_AUTH_URL+"?vitualEntityAction="+ soAction +"&tenant=" + $scope.tenantCode + "&virtualentityCode=" + soCode  +
				"&virtualEntityInSession="+encodeURI(JSON.stringify($scope.so));
	};
	
	$scope.twitterError = null;
	$scope.twitterCredentialLoading = false;
	$scope.twitterCredentialFound = false;


	
	$scope.clearTwitterCredential = function(){
		console.log("clearTwitterCredential");
		$scope.twitterCredentialLoading = true;
		$scope.twitterError = null;
		upService.clearTwitterCredential().success(function(response) {
			$scope.twitterCredentialLoading = false;
			loadTwitterCredential();
		}).error(function(data, status, headers, config) {
			$scope.twitterCredentialLoading = false;
			$scope.twitterError = data.message;
		});
	};
	
	$scope.streamsToReinstall = null;

	$scope.STREAM_STATUS_INST = Constants.STREAM_STATUS_INST;
	

	$scope.loadStreams = function(){
		$scope.showLoadingStreams = true;
		$scope.streamsToReinstall = [];
		
		adminAPIservice.loadStreams(info.getActiveTenant(), info.getActiveTenant().tenantcode).success(function(response) {
			
			console.log("loadStreams SUCCESS", response);
			$scope.showLoadingStreams = false;
			$scope.admin_response = {};
			for (var i = 0; i < response.length; i++) {
				if(response[i].status.statuscode == Constants.STREAM_STATUS_INST)
					console.warn("s",   $routeParams.entity_code, response[i].smartobject.socode);

				if(response[i].status && response[i].status.statuscode && 
						response[i].status.statuscode == Constants.STREAM_STATUS_INST  && 
						response[i].smartobject.socode ==  $routeParams.entity_code){
					var streamRow = {};
					streamRow.stream = response[i];
					streamRow.rowIndex = $scope.streamsToReinstall.length;
					streamRow.updateOk = false;
					streamRow.updateKo = false;
					streamRow.isUpdating = false;
					$scope.streamsToReinstall.push(streamRow);					
				}				
			}
		}).error(function(response){
			console.error("loadStreams ERROR", response);
			$scope.showLoadingStreams = false;
			$scope.admin_response.type = 'danger';
			$scope.admin_response.message = 'UNEXPECTED_ERROR';
			if(response && response.errorName)
				$scope.admin_response.detail= response.errorName;
			if(response && response.errorCode)
				$scope.admin_response.code= response.errorCode;

		});
		
	};
	
	//$scope.loadStreams();
	
	$scope.unInstallStream = function(streamRow){
		updateLifecycle(Constants.LIFECYCLE_STREAM_REQ_UNINST,streamRow);
	};

	$scope.reinstallStream = function(streamRow){
		updateLifecycle(Constants.LIFECYCLE_STREAM_NEW_VERSION,streamRow);
	};
	
	var updateLifecycle = function(action,streamRow) {
		console.log("updateLifecycle stream", streamRow);
		console.log("updateLifecycle action", action);
		streamRow.isUpdating = true;
		
		adminAPIservice.lifecycleStream(action,streamRow.stream,info.getActiveTenant()).success(function(response) {
			console.log("result updateLifecycle ", response);	
			streamRow.updateOk=true;
			streamRow.updateKo = false;
			streamRow.isUpdating = false;
			$scope.refreshStream(streamRow, action == Constants.LIFECYCLE_STREAM_NEW_VERSION);
		}).error(function(data,status){
			$scope.showLoading = false;
	  		console.error("updateLifecycle ERROR", data,status);
	  		$scope.admin_response.message = 'UNEXPECTED_ERROR';
			streamRow.updateOk=false;
			streamRow.updateKo = true;
			streamRow.isUpdating = false;
			$scope.refreshStream(streamRow);
	  		
	  	});
		
//		var promise   = fabricAPIservice.lifecycleStream(action, streamRow.stream);
//		promise.then(function(result) {
//			console.log("result updateLifecycle ", result);
//			$scope.updateInfo = {status: result.status};
//			streamRow.updateOk=true;
//			streamRow.updateKo = false;
//			streamRow.isUpdating = false;
//			$scope.refreshStream(streamRow, install);
//			
//		}, function(result) {
//			console.log("result error ", result);
//
//			streamRow.updateOk=false;
//			streamRow.updateKo = true;
//			streamRow.isUpdating = false;
//			$scope.refreshStream(streamRow);
//		}, function(result) {
//			console.log('Got notification: ' + result);
//		});
	};
//	
//	var updateLifecycle = function(action,stream, install){
//			adminAPIservice.lifecycleStream(action,stream,info.getActiveTenant()).success(function(response) {
//			console.log("result updateLifecycle ", response);	
//			$route.reload();
//		}).error(function(data,status){
//			$scope.showLoading = false;
//	  		console.error("updateLifecycle ERROR", data,status);
//	  		$scope.admin_response.message = 'UNEXPECTED_ERROR';
//	  		
//	  	});
//	};
	
	
	
	$scope.refreshStream = function(streamRow, install){
		console.log("refreshStream", streamRow);
		streamRow.isUpdating = true;
	  	adminAPIservice.loadDatasource(Constants.DATASOURCE_TYPE_STREAM, info.getActiveTenant(),streamRow.stream.idstream).success(function(response) {
	  		console.log("loadDatasource", response);
	  		$scope.streamsToReinstall[streamRow.rowIndex].isUpdating = false;
	  		$scope.streamsToReinstall[streamRow.rowIndex].stream =  Helpers.yucca.prepareDatasourceForUpdate(Constants.DATASOURCE_TYPE_STREAM,response);
	  		$scope.streamsToReinstall[streamRow.rowIndex].stream.status = response.status;
	  		$scope.streamsToReinstall[streamRow.rowIndex].stream.smartobject = response.stream.smartobject;
	  		
	  		console.log("$scope.streamsToReinstall[streamRow.rowIndex].stream ", $scope.streamsToReinstall[streamRow.rowIndex].stream );
	  		$scope.streamsToReinstall[streamRow.rowIndex].updateOk = true;
	  		$scope.streamsToReinstall[streamRow.rowIndex].updateKo = false;
			if(install)
				updateLifecycle(Constants.STREAM_STATUS_REQ_INST, $scope.streamsToReinstall[streamRow.rowIndex]);			


	  	}).error(function(data,status){
	  		$scope.isUpdating = false;
	  		$scope.streamsToReinstall[streamRow.rowIndex].updateOk = false;
	  		$scope.streamsToReinstall[streamRow.rowIndex].updateKo = true;

	  		console.error("loadDataset ERROR", data,status);
	  		$scope.admin_response.type = 'danger';
	  		if(status==404)
	  			$scope.admin_response.message = 'MANAGEMENT_VIEW_DATASET_ERROR_NOT_FOUND';
	  		else
	  			$scope.admin_response.message = 'UNEXPECTED_ERROR';
	  	});
		
		
		
		
		
		
//			fabricAPIservice.getStream(streamRow.stream.codiceTenant, streamRow.stream.codiceVirtualEntity, streamRow.stream.codiceStream).then(function(response) {
//				console.log("loadStream",response.streams.stream);
//				
//				if(! response.streams.stream.streamIcon ||  response.streams.stream.streamIcon == null)
//					 response.streams.stream.streamIcon  = "img/stream-icon-default.png";
//	
//				if(! response.streams.stream.deploymentStatusCode ||  response.streams.stream.deploymentStatusCode == null)
//					 response.streams.stream.deploymentStatusCode = Constants.STREAM_STATUS_DRAFT;
//				response.streams.stream.statusIcon = Helpers.stream.statusIcon(response.streams.stream);
//
//				streamRow.stream = response.streams.stream;
//				$scope.streamsToReinstall[streamRow.rowIndex] =  streamRow;
//				if(install)
//					updateLifecycle(Constants.LIFECYCLE_STREAM_REQ_INST,streamRow, false);
//			});
	};

}]);

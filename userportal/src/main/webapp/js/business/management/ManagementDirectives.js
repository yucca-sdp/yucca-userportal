/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

'use strict';

/* Directives */

/* new dataset */
appDirectives.directive('newDatasetWizardStart', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/dataset/new-dataset-start.html?t='+BuildInfo.timestamp,
	};
});

appDirectives.directive('newDatasetWizardRequestor', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/dataset/new-dataset-requestor.html?t='+BuildInfo.timestamp,
	};
});

appDirectives.directive('newDatasetWizardMetadata', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/dataset/new-dataset-metadata.html?t='+BuildInfo.timestamp,
	};
});

appDirectives.directive('newDatasetWizardChoosetype', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/dataset/new-dataset-choose-type.html?t='+BuildInfo.timestamp,
	};
});

//appDirectives.directive('newDatasetWizardUpload', function() {
//	return {
//		restrict : 'E',
//		templateUrl : 'partials/management/wizard/dataset/new-dataset-upload.html?t='+BuildInfo.timestamp,
//	};
//});

appDirectives.directive('newDatasetWizardColumns', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/dataset/new-dataset-columns.html?t='+BuildInfo.timestamp,
	};
});

/* stream */
appDirectives.directive('newStreamWizardRegister', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/stream/new-stream-register.html?t='+BuildInfo.timestamp,
	};
});
appDirectives.directive('newStreamWizardRequestor', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/stream/new-stream-requestor.html?t='+BuildInfo.timestamp,
	};
});
appDirectives.directive('newStreamWizardDetail', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/stream/new-stream-detail.html?t='+BuildInfo.timestamp,
	};
});
appDirectives.directive('newStreamWizardComponents', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/stream/new-stream-components.html?t='+BuildInfo.timestamp,
	};
});
appDirectives.directive('newStreamWizardTweetdata', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/stream/new-stream-tweetdata.html?t='+BuildInfo.timestamp,
	};
});
appDirectives.directive('newStreamWizardShare', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/stream/new-stream-share.html?t='+BuildInfo.timestamp,
	};
});

/* virtual entity */
appDirectives.directive('newVirtualentityWizardRegister', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/virtualentity/new-virtualentity-register.html?t='+BuildInfo.timestamp,
	};
});
appDirectives.directive('newVirtualentityWizardPosition', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/virtualentity/new-virtualentity-position.html?t='+BuildInfo.timestamp,
	};
});
appDirectives.directive('newVirtualentityWizardDetail', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/virtualentity/new-virtualentity-detail.html?t='+BuildInfo.timestamp,
	};
});

/* import database */

appDirectives.directive('importDatabaseWizardStart', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/importDatabase/import-database-start.html?t='+BuildInfo.timestamp,
	};
});

appDirectives.directive('importDatabaseWizardDatabase', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/importDatabase/import-database-database.html?t='+BuildInfo.timestamp,
	};
});

appDirectives.directive('importDatabaseWizardTables', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/importDatabase/import-database-tables.html?t='+BuildInfo.timestamp,
	};
});

appDirectives.directive('importDatabaseWizardRequestor', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/importDatabase/import-database-requestor.html?t='+BuildInfo.timestamp,
	};
});

appDirectives.directive('importDatabaseWizardMetadata', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/importDatabase/import-database-metadata.html?t='+BuildInfo.timestamp,
	};
});


appDirectives.directive('importDatabaseWizardCustomize', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/importDatabase/import-database-customize.html?t='+BuildInfo.timestamp,
	};
});

appDirectives.directive('importDatabaseWizardFinish', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/management/wizard/importDatabase/import-database-finish.html?t='+BuildInfo.timestamp,
	};
});

app.directive('datasourceIntro', function() {
	return {
	    restrict: 'E',
	    scope: {datasource: '=',},
	    templateUrl : 'partials/management/forms/datasourceIntro.html?t='+BuildInfo.timestamp
	};
});


app.directive('datasourceMainInfo', function(adminAPIservice, info,$translate,ENABLE_CEP) {
	return {
	    restrict: 'E',
	    scope: {datasource: '=', extra: '=', datasourceDomain: '@', datasourceSubdomain: '@', operation: '@'},
	    templateUrl : 'partials/management/forms/mainInfo.html?t='+BuildInfo.timestamp,
	    link: function(scope, elem, attrs) {
	    	console.info("datasourceMainInfo.link datasource", scope.datasource);
	    	console.info("datasourceMainInfo.link operation", scope.operation);
	    	console.info("datasourceMainInfo.link extra", scope.extra);
	    	
	    	if(scope.operation == 'create' || scope.operation == 'importDatabase' ){
	    		scope.datasource.apiOdataEnabled = true;
	    		scope.datasource.apiOdata = 'odata';
	    	}

	    	if (scope.datasource.apiContexts) {
		    	if(scope.datasource.apiContexts.includes('odata')) {
		    		scope.datasource.apiOdataEnabled = true;
		    		scope.datasource.apiOdata = "odata";
		    	}
	
		    	if(scope.datasource.apiContexts.includes('odatarupar')) {
		    		scope.datasource.apiOdataEnabled = true;
		    		scope.datasource.apiOdata = "odatarupar";
		    	}
		    	
		     	if(scope.datasource.apiContexts.includes('search')) {
		    		scope.datasource.apiSearchEnabled = true;
		    		scope.datasource.apiSearch = "search";
		    	}
		     	
		    	if(scope.datasource.apiContexts.includes('searchrupar')) {
		    		scope.datasource.apiSearchEnabled = true;
		    		scope.datasource.apiSearch = "searchrupar";
		    	}

	    	}
	    	
	    	scope.validationPatternStreamCode = Constants.VALIDATION_PATTERN_CODE_STREAM;
	    	scope.validationPatternSubdomain = Constants.VALIDATION_PATTERN_NO_SPACE;

	    	scope.isStream = function(){
	    		return scope.datasource.datasourceType == Constants.DATASOURCE_TYPE_STREAM;
	    	};
	    	scope.enableCEP = ENABLE_CEP;

	    	var soInternal = null;

	    	if(scope.isStream()){
	    		scope.soList = [];
	    	
	    		adminAPIservice.loadSmartobjects(info.getActiveTenant(), info.getActiveTenant().tenantCode).success(function(response) {
	    			console.log(response);
	    			for (var int = 0; int < response.length; int++) {
	    				var so = response[int];
	    				if(so.soType.idSoType != Constants.VIRTUALENTITY_TYPE_INTERNAL_ID){
	    					scope.soList.push(so);
	    				}else{
	    					soInternal=so;
	    				}

	    			}
	    		});
	    	}
	    	
	    	
	    	//scope.domainList = scope.$parent.domainList;
	    	//scope.subdomainList = scope.$parent.subdomainList;
	    	
//	    	scope.checkSubdomain = function(input){
//	    		console.log("checkSubdomain", input);
//	    		if(typeof input != 'undefined' && input!=null && input!="")
//	    			return scope.validationPatternSubdomain.test(input);
//	    		return true;
//	    	};
	    		
	    	scope.useDomainMulti  = function(useDomainMultiFlag){
	    		console.log("useDomainMulti", useDomainMultiFlag);
	    		if(useDomainMultiFlag){
	    			scope.selectedDomain = 'MULTI';
	    			scope.datasource.visibility = 'private';
	    		}
	    		else
	    			scope.selectedDomain = null;
	    		
	    		//scope.datasource.visibility = null;
	    	};
	    	
	    	
	    	scope.domainList = [];
	    	var loadDomains = function(){
		    	adminAPIservice.loadDomains().success(function(response) {
		    		console.debug("loadDomains", response);
		    		response.sort(function(a, b) { 
		    		    return ((a.langit < b.langit) ? -1 : ((a.langit > b.langit) ? 1 : 0));
		    		});
		    		for (var int = 0; int < response.length; int++) {
	    				var domain = response[int];
	    				domain.domainLabel = $translate.use()=='it'?response[int].langit:response[int].langen;
		    			scope.domainList.push(domain);
		    		}
		    		
		    		if((scope.operation == 'create' || scope.operation == 'importDatabase' ) && typeof scope.datasource.domaincode != 'undefined' && scope.datasource.domaincode != null){
		    			scope.selectedDomain = scope.datasource.domaincode;
		    			scope.selectSubdomain(scope.selectedDomain);
		    		}

		    	});
	    	};
	    	
	    	if(scope.operation == 'create' || scope.operation == 'importDatabase' )
	    		loadDomains();
	    		
	    	scope.subdomainList = [];
	    	scope.selectSubdomain = function(domain){
	    		if(scope.operation=='importDatabase' ||scope.operation=='create')
	    			scope.datasource.domaincode = domain;
	    		scope.subdomainList = [];
	    		if(typeof domain != 'undefined' && domain!=null && domain!=''){
		    		adminAPIservice.loadSubDomains(domain).success(function(response) {
		    			console.log("loadSubDomains", domain, response);
		    			response.sort(function(a, b) { 
		    			    return ((a.langIt < b.langIt) ? -1 : ((a.langIt > b.langIt) ? 1 : 0));
		    			});
		    			for (var int = 0; int < response.length; int++) {
		    				var subdomain = response[int];
		    				subdomain.subdomainLabel = $translate.use()=='it'?response[int].langIt:response[int].langEn;

		    				scope.subdomainList.push(subdomain);
		    			}
		    		});
	    		}
	    	};
	    	
	    	scope.onSelectSubdomain = function(idSubdomain){
	    		if(scope.operation=='importDatabase'){
	    			console.log("onSelectSubdomain", idSubdomain);
	    			for (var subdomainIndex = 0; subdomainIndex < scope.subdomainList.length; subdomainIndex++) {
	    				if(scope.subdomainList[subdomainIndex].idSubdomain == idSubdomain){
	    					scope.datasource.subdomaincode = scope.subdomainList[subdomainIndex].subdomaincode;
	    					break;
	    				}
						
					}
	    		}

	    	};
	    	
	    	if((scope.operation=='importDatabase' ||scope.operation=='create')  && typeof scope.datasourceDomain != 'undefined' && scope.datasourceDomain != null){
	    		scope.selectedDomain = scope.datasourceDomain;
	    		scope.selectSubdomain(scope.selectedDomain);
	    	}
	    	

	    	
	    	scope.selectSoInternal = function(isInternal){
	    		console.log("selectSoInternal", scope.extra.isInternal, isInternal);
	    		if(isInternal){
	    			scope.extra.selectedSo = soInternal;
	    		}
	    		else{
	    			scope.extra.selectedSo = null;
	    		}
	    		scope.extra.isInternal = isInternal;
	    		console.log("extra.selectedSo", scope.extra.isInternal, scope.extra.selectedSo );	
	    	};

	    	var checkMaxTweetofStream = function(streamsList){
    			scope.twitterPollingInterval  = scope.extra.selectedSo.twtmaxstreams*5+1;
    			var totalStream  = 0;
				for (var streamIndex = 0; streamIndex < scope.streamsList.length; streamIndex++) {
					if(scope.streamsList[streamIndex].smartobject.socode == scope.extra.selectedSo.socode)
						totalStream++;
				}
    	    	scope.maxTweetError = totalStream>= scope.extra.selectedSo.twtmaxstreams;
    	    	console.log("scope.maxTweetError", totalStream);
    	    	console.log("scope.scope.extra.selectedSo.twtmaxstreams", scope.extra.selectedSo.twtmaxstreams);
	    		
	    	};
	    	
	    	scope.maxTweetError = false;
	    	scope.selectSoChange =  function(){
	    		console.log("selectSoChange", this.extra);
		    	scope.maxTweetError = false;
	    		if(Helpers.util.has(this.extra.selectedSo, 'soType.idSoType') && this.extra.selectedSo.soType.idSoType == Constants.VIRTUALENTITY_TYPE_TWITTER_ID){
	    			scope.datasource.twitterInfo =  {
	    					"twtratepercentage": 100,
	    					"twtlang": "it"
	    			};
	    			
	    			if(scope.streamsList)
	    				checkMaxTweetofStream(scope.streamsList);
	    			else{
	    				adminAPIservice.loadStreams(info.getActiveTenant()).success(function(response) {
	    		    		console.log("loadStreams SUCCESS", response);
	    		    		scope.streamsList = response;
		    				checkMaxTweetofStream(scope.streamsList);
	    		    	}).error(function(response){
	    		    		console.error("loadStreams ERROR", response);
	    		    		scope.admin_response_add_stream.type = 'danger';
	    		    		scope.admin_response_add_stream.message = 'UNEXPECTED_ERROR';
	    		    		if(response && response.errorName)
	    		    			scope.admin_response_add_stream.detail= response.errorName;
	    		    		if(response && response.errorCode)
	    		    			scope.admin_response_add_stream.code= response.errorCode;

	    		    	});    				
	    			}
		    			
//	    			
//	    			
//	    			scope.twitterPollingInterval  = extra.selectedSo.twtmaxstreams*5+1;
//	    			var totalStream  = 0;
//	    			if(scope.streamsList){
//	    				for (var streamIndex = 0; streamIndex < scope.streamsList.length; streamIndex++) {
//	    					if(scope.streamsList[streamIndex].smartobject.socode == this.extra.selectedSo.socode)
//	    						totalStream++;
//	    				}
//	    				
//	    			}
//	    	    	scope.maxTweetError = totalStream>= scope.extra.selectedSo.twtmaxstreams;
//	    	    	console.log("scope.maxTweetError", totalStream);
//	    	    	console.log("scope.scope.extra.selectedSo.twtmaxstreams", scope.extra.selectedSo.twtmaxstreams);
//	    			if(totalStream>= scope.extra.selectedSo.twtmaxstreams) 
//	    				scope.forms.registerStreamForm.inputSo.$setValidity("streamCount", false);
//	    			else
//	    				scope.forms.registerStreamForm.inputSo.$setValidity("streamCount", true);
	    		
	    		}
	    		else if(scope.datasource){
	    			delete scope.datasource["twitterInfo"];
	    		}
	    	};
	    }
	};
});

app.directive('datasourceTermConditions', function(YUCCA_PORTAL) {
	return {
	    restrict: 'E',
	    scope: {datasource: '=',},
	    templateUrl : 'partials/management/forms/termConditions.html?t='+BuildInfo.timestamp,
	    link: function(scope, elem, attrs) {
	    	console.debug("datasourceMainInfo.link", scope.datasource);
	    	console.log("termConditions", YUCCA_PORTAL);
	    	scope.yuccaPortal = YUCCA_PORTAL;
	    	scope.privacyacceptance = 0;
	    	scope.responsabilityAcceptance = 0;
	    	
	    	scope.changePrivacy = function(newPrivacy){
	    		scope.datasource.privacyacceptance = newPrivacy & scope.responsabilityAcceptance;
	    	};

	    	scope.changeResponsabilty = function(newResponsabilty){
	    		scope.datasource.privacyacceptance = newResponsabilty & scope.privacyAcceptance;
	    	};

	    	
	    }
	    
	    
	    
	};
});

app.directive('datasourceDetailInfo', function($modal, readFilePreview, adminAPIservice, $translate, info, YUCCA_PORTAL) {
	return {
	    restrict: 'E',
	    scope: {datasource: '='},
	    templateUrl : 'partials/management/forms/detailInfo.html?t='+BuildInfo.timestamp,
	    link: function(scope, elem, attrs) {
	    	
	    	console.debug("datasourceMainInfo.link", scope.datasource);
	    	scope.yuccaPortal = YUCCA_PORTAL;
	    	scope.DEFAULT_DATASET_ICON = Constants.DEFAULT_DATASET_ICON + "_" + scope.yuccaPortal+".png";
	    	scope.DEFAULT_STREAM_ICON = Constants.DEFAULT_STREAM_ICON + "_" + scope.yuccaPortal+".png";
	    	scope.isStream = function(){
	    		return scope.datasource.datasourceType == Constants.DATASOURCE_TYPE_STREAM;
	    	};

	    	scope.validationPatternFloat = Constants.VALIDATION_PATTERN_FLOAT;
	    	
	    	// tag
	    	scope.tagList = [];
	    	scope.tagMap = [];
	    	var loadTags = function(){
	    		adminAPIservice.loadTags().success(function(response) {
	    			console.debug("loadTags", response);
	    			for (var int = 0; int < response.length; int++) {
	    				var tagLabel = $translate.use()=='it'?response[int].langit:response[int].langen;
	    				scope.tagList.push({"idTag": response[int].idTag, "tagCode":response[int].tagcode, "tagLabel":tagLabel} );
	    				scope.tagMap[response[int].idTag]={"idTag": response[int].idTag, "tagCode":response[int].tagcode, "tagLabel":tagLabel} ;

	    			}
	    			
	    			scope.tagList.sort(function(a, b) { 
	    			    return ((a.tagLabel < b.tagLabel) ? -1 : ((a.tagLabel > b.tagLabel) ? 1 : 0));
	    			});
	    			
	    		});
	    	};
	    	
	    	if(scope.tagList.length==0)
	    		loadTags();
	    	//scope.tagMap = scope.$parent.tagMap;
	    	//scope.tagList = scope.$parent.tagList;
	    	
	    	scope.showChooseTagTable = function(){
	    		var chooseTagDialog = $modal.open({
	    		  templateUrl: 'tagChooerDialog.html',
	    	      controller: 'ManagementChooseTagCtrl',
	    	      size: 'lg',
	    	      scope: scope,
	    	      resolve: {
	    	    	  tagList: function () {return scope.tagList;},
	    	      	}
	        	});
	    		
	    		chooseTagDialog.result.then(function (selectedTag) {
	    			//scope.$broadcast ('addTag', selectedTag);
	    			addTag(selectedTag);
	    	    }, function () {});
	    	};
	    	
	    	scope.$on('addTag', function(e, selectedTag) {  
	 	       console.log("addTag child", e, selectedTag);  
	 	       addTag(selectedTag);
	 	    });
	 		
		 	scope.newTag = {};
		 	var addTag = function(newTag){
		 		console.log("addTag ", newTag);
		 		if(newTag){
		 			var found = false;	
		 			for (var int = 0; int < scope.datasource.tags.length; int++) {
		 				var existingTag = scope.datasource.tags[int];
		 				if(existingTag == newTag.idTag){
		 					found = true;
		 					break;
		 				}
	
		 			}
		 			if(!found){
		 				scope.datasource.tags.push(newTag.idTag);
		 				if(typeof scope.datasource.taglabels == 'undefined')
		 					scope.datasource.taglabels = new Array();
		 				scope.datasource.taglabels.push(newTag.tagLabel);
	 		    	}
		 			scope.newTag.value = null;
		 		}
		 		
		 		return false;
		 	};
		 	
		 	scope.onTagSelect = function($item, $model, $label){
		 		console.log("onTagSelect",$item, $model, $label);
		 		if($item.tagCode!=null)
		 			addTag($item);
		 	};
	
		 	scope.removeTag = function(index){
		 		scope.datasource.tags.splice(index,1);
		 		return false;
		 	};
		 	
		 	
		 	// groups
	    	scope.groupList = new Array();
	    	var loadGroups = function(){
		    	scope.groupList = new Array();
	    		adminAPIservice.loadDatasetGroups(info.getActiveTenant()).success(function(response) {
	    			console.info("loadGroups", response);
	    			if(response)
	    				for (var i = 0; i < response.length; i++) {
	    					if(response[i].status=='DRAFT')
	    						scope.groupList.push(response[i]);
						}
	    			scope.groupList.sort(function(a, b) { 
	    			    return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
	    			});
	    			
	    		});
	    	};
	    	
	    	if(scope.groupList.length==0)
	    		loadGroups();
	    	
	    	scope.showChooseGroup = function(){
	    		var chooseGroupChooseDialogInstance = $modal.open({
	        		templateUrl: 'ChooseDatasetGroupDialog.html',
	      	      	controller: 'ChooseDatasetGroupDialogCtrl',
	      	      	windowClass: 'app-modal-window',
	    	  	      resolve: {
	    		    	  datasourceList: function(){ return [scope.datasource];},
	    				  isStream: function(){return typeof scope.datasource.stream != 'undefined';},
	    		    	  groups: function(){return scope.groupList;},
	    		    	  createOnSave: function(){return false;}
	    	  	      }


	    		});
	    		
	    		chooseGroupChooseDialogInstance.result.then(function (selectedGroup) {
	    			console.log("selectedGroups",selectedGroup);
	    			addGroup(selectedGroup);
	    		});
	    	};
	    	
	    	scope.$on('addGroup', function(e, selectedGroup) {  
	 	       console.log("addGroup child", e, selectedGroup);  
	 	       addGroup(selectedGroup);
	 	    });
	 		
		 	scope.newGroup = {};
		 	var addGroup = function(newGroup){
		 		console.log("addGroup ", newGroup);
		 		if(newGroup){
		 			var found = false;	
		 			for (var int = 0; int < scope.datasource.groups.length; int++) {
		 				var existingGroup = scope.datasource.groups[int];
		 				if(existingGroup.idDatasourcegroup == newGroup.idDatasourcegroup){
		 					found = true;
		 					break;
		 				}
	
		 			}
		 			if(!found){
		 				scope.datasource.groups.push(newGroup);
	 		    	}
		 			scope.newGroup.value = null;
		 		}
		 		
		 		return false;
		 	};
		 	
		 	scope.onGroupSelect = function($item, $model, $label){
		 		console.log("onGroupSelect",$item, $model, $label);
		 		if($item.name!=null)
		 			addGroup($item);
		 	};
	
		 	scope.removeGroup = function(index){
		 		scope.datasource.groups.splice(index,1);
		 		return false;
		 	};
		 	
		 	
		 	// icon
			scope.selectedIcon;
			scope.onIconSelect = function($files) {
				scope.selectedIcon = $files[0];
				if(scope.selectedIcon !=null && scope.selectedIcon.size>Constants.DATASET_ICON_MAX_FILE_SIZE){
					scope.choosenIconSize = scope.selectedIcon.size; 
					scope.updateWarning = true;
					scope.selectedIcon = null;
				}
				else{
					readFilePreview.readImageFile(scope.selectedIcon).then(
						function(contents){
							console.log("contents" , contents);
							scope.datasource.icon = contents;
						}, 
						function(error){
							scope.uploadDatasetError = {error_message: error, error_detail: ""};
							Helpers.util.scrollTo();
						}
					);					
				}
			};

	    }
	};
});

app.directive('datasourceLegalInfo', function() {
	return {
	    restrict: 'E',
	    scope: {datasource: '=',},
	    templateUrl : 'partials/management/forms/legalInfo.html?t='+BuildInfo.timestamp,
	    link: function(scope, elem, attrs) {
	    	console.debug("datasourceLegalInfo.link", scope.datasource);
	    	
	    	scope.selectedLicenseType = "OTHER";
	    	if(scope.datasource.license && scope.datasource.license.idLicense == Constants.LICENSE_CC0_ID)
		    	scope.selectedLicenseType = "CC0";
	    	else if(scope.datasource.license && scope.datasource.license.idLicense == Constants.LICENSE_CCBY_ID)
		    	scope.selectedLicenseType = "CCBY";

	    	// {"idLicense":42,"licensecode":"CC-BY 3.0","description":"CC-BY 3.0"}
	    	scope.selectLicense = function(value){
	    		console.log("selectLicense", value);
	    		if(scope.selectedLicenseType == "CC0")
	    			scope.datasource.license = {"idLicense":Constants.LICENSE_CC0_ID};
	    		else if(scope.selectedLicenseType == "CCBY")
	    			scope.datasource.license = {"idLicense":Constants.LICENSE_CCBY_ID};
	    		else
	    			scope.datasource.license = {};
	    	};
	    }
	    
	};
});

app.directive('datasourceSharing', function($modal, info, adminAPIservice) {
	return {
	    restrict: 'E',
	    scope: {datasource: '=',},
	    templateUrl : 'partials/management/forms/sharing.html?t='+BuildInfo.timestamp,
	    link: function(scope, elem, attrs) {
	    	console.error("datasourceSharing.link", scope.datasource);
	    	scope.OPENDATA_LANGUAGES = Constants.OPENDATA_LANGUAGES;
	    	scope.OPENDATA_UPDATE_FREQUENCY = Constants.OPENDATA_UPDATE_FREQUENCY;
	    	//scope.tenantsList = scope.$parent.tenantsList;
	    	
	    	scope.tenantsList = [];
	    	var loadTenants = function(){
	    		adminAPIservice.loadTenants().success(function(response) {
	    			console.debug("loadTenants", response);
	    			try{
	    				scope.tenantsList = [];
	    				for (var int = 0; int <  response.length; int++) {
	    					var t = response[int];
	    					if(t.tenantcode!=scope.tenant)
	    						scope.tenantsList.push(t);
	    				}
	    				
	    				scope.tenantsList.sort(function(a, b) { 
	    				    return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
	    				});
	    	
	    			}
	    			catch (e) {
	    				log.error("loadTenants ERROR",e);
	    			}
	    			
	    		}).error(function(response) {
	    			console.error("loadTenants error", response);
	    		});
	    	};
	    	
	    	if(scope.tenantsList.length==0)
	    		loadTenants();
	    	
	    	
	    	scope.canCreatePublicDataset = function(){
	    		return info.getActiveShareInformationType() == "public" && scope.datasource && scope.datasource.unpublished!=1;
	    	}; 

	    	scope.canShareDataset = function(){
	    		return info.getActiveShareInformationType() == "public";
	    	}; 
	    	
	    	// Opendata
	    	scope.formatOpendataUpdateDate = function(dataUpdateDate){
	    		if(typeof dataUpdateDate != 'undefined' && dataUpdateDate != null){
		    		var date =  new Date(dataUpdateDate);	
					var year = (date.getFullYear()).toString();
					var month = ((date.getMonth()+1) < 10) ? "0" + (date.getMonth()+1) :(date.getMonth()+1);
					var day = ((date.getDate() < 10) ? "0" + date.getDate() :date.getDate()).toString();
					if(typeof scope.datasource.opendata == 'undefined')
						scope.datasource.opendata =  {};
					scope.datasource.opendata.opendataupdatedate= year+month+day;	
	    		}
	    	};
	    	
	    	scope.setOpenData = function(visibility){
	    		console.log("setOpenData", scope.datasource);
	    		if(visibility == 'public')
	    			scope.datasource.opendata.isOpenData= true;
	    		else 
	    			scope.datasource.opendata.isOpenData= false;
	    		
	 
	    	};
	    		    	
	    	// tenant sharing
	    	scope.showChooseTenantTable = function(){
	    		var chooseTenantDialog = $modal.open({
	    	      templateUrl: 'tenantChooerDialog.html',
	    	      controller: 'ManagementChooseTenantCtrl',
	    	      size: 'lg',
	    	      scope: scope,
	    	      resolve: {
	    	    	  tenantsList: function () {return scope.tenantsList;},
	    	      	}
	        	});
	    		
	    		chooseTenantDialog.result.then(function (selectedTenant) {
	    			scope.$broadcast ('addTenant', selectedTenant);
	    	    }, function () {});
	    		
	    	};
	    	
	    	scope.$on('addTenant', function(e, selectedTenant) {  
			       console.log("addTenant child", e, selectedTenant);  
			       addTenantSharing(selectedTenant);
			 });
			
			scope.newTenantSharing = {};
			scope.onTenantSharingSelect = function($item, $model, $label){
				console.log("onTenantSharingSelect",$item, $model, $label);
				addTenantSharing($item);
				scope.newTenantSharing.value = null;
			};


			
			var addTenantSharing = function(newTenantSharing){
				console.log("addTenantSharing ",newTenantSharing);
				if(newTenantSharing){
					var found = false;	
					if(typeof scope.datasource.sharingTenants == 'undefined' || scope.datasource.sharingTenants == null){
						scope.datasource.sharingTenants = [];
					}
					
					for (var int = 0; int < scope.datasource.sharingTenants.length; int++) {
						var existingTenantSharing = scope.datasource.sharingTenants[int];
						console.log("existing",existingTenantSharing);
						if(existingTenantSharing.idTenant == newTenantSharing.idTenant){
							console.log("found");
							found = true;
							break;
						}

					}
					if(!found){
						scope.datasource.sharingTenants.push({idTenant:newTenantSharing.idTenant, name: newTenantSharing.name});
						console.log("added",scope.datasource.sharingTenants);
					}
				}

				return false;
			};

			scope.removeTenantSharing = function(index){
				scope.datasource.sharingTenants.splice(index,1);
				return false;
			};
	    	
	    }

	};
});

app.directive('datasourceDcat', function() {
	return {
	    restrict: 'E',
	    scope: {datasource: '=',},
	    templateUrl : 'partials/management/forms/dcat.html?t='+BuildInfo.timestamp
	};
});


app.directive('uploadDataCsv', function(readFilePreview, adminAPIservice, localStorageService, $modal) {
	return {
	    restrict: 'E',
	    scope: {datasource: '=', csvInfo : '=', preview : '=', componentInfoRequests : '=', action: '@'},
	    templateUrl : 'partials/management/forms/uploadDataCsv.html?t='+BuildInfo.timestamp,
	    link: function(scope, elem, attrs) {
	    	console.log("uploadDataCsv.link", scope.datasource);
	    	scope.formatList = ["csv"];

	    	scope.choosenFileSize = null;
	    	scope.maxFileSize = Constants.BULK_DATASET_MAX_FILE_SIZE;

	    	
	    	
	    	scope.dataTypeList = new Array();
	    	adminAPIservice.loadDataTypes().success(function(response) {
	    		console.debug("loadDataTypes",response);
	    		for (var dtIndex = 0; dtIndex < response.length; dtIndex++) {
					if(response[dtIndex].idDataType != Constants.COMPONENT_DATA_TYPE_BINARY)
						scope.dataTypeList.push(response[dtIndex]);
				}
	    	});
	    	
	    	
	
	    	scope.readPreview = function(csvSeparator){
	    		scope.uploadDatasetError = null;
	    		scope.uploadMessage = null;
	    		readFilePreview.readTextFile(scope.csvInfo.selectedFile, 100000, scope.fileEncoding).then(
	    				function(contents){
	    					var lines = contents.split(/\r\n|\n|\r/g);
	    					console.log("nr righe", lines.length);
	    					//console.log(lines);
	    					var firstRows = lines.slice(0, 5);
	    					scope.previewLines = new Array();
	    					console.log("(firstRows.join",firstRows.join("\n"));
	    					console.log("CSVtoArrayAll",Helpers.util.CSVtoArray(firstRows.join("\n"),csvSeparator));

	    					scope.previewLines = Helpers.util.CSVtoArray(firstRows.join("\n"),csvSeparator);
	    					console.log("scope.previewLines",scope.previewLines);

	    					//scope.datasource.components  = new Array();
	    					scope.preview.columns = new Array();
	    					scope.preview.components = new Array();
	    					
	    					// clean name
	    					var usedNames = {};
	    					if(scope.previewLines.length>0){
	    						for (var int = 0; int < scope.previewLines[0].length; int++) {
	    							var name = scope.previewLines[0][int].replace(/[^A-Za-z0-9]/g, '');
	    							var warning = name != scope.previewLines[0][int].trim();
	    							if(typeof usedNames[name] == 'undefined'){
	    								usedNames[name] = 0;
	    							}
	    							else{
	    								usedNames[name]++;
	    								name += usedNames[name];
	    								warning = true;
	    							}
	    							
	    							
	    							scope.preview.components.push(
	    									{index: int, 
	    										sourcecolumn: int+1, 
	    										name: name,//scope.previewLines[0][int].replace(/^"(.*)"$/, '$1'), 
	    										alias: scope.previewLines[0][int].replace(/^"(.*)"$/, '$1'),
	    										dataType: {idDataType: Constants.COMPONENT_DEFAULT_DATA_TYPE},
	    										idDataType: Constants.COMPONENT_DEFAULT_DATA_TYPE,
	    										iskey: false, 
	    										idMeasureUnit: null,
	    										skipColumn: false,
	    										required: true,
	    										warning: warning});
	    						}
	    					}
	    					
							console.log(" scope.datasource.components",  scope.datasource.components);
							console.log(" scope.preview.components",  scope.preview.components);
							
							scope.componentInfoRequests.info  =new Array();

							if(scope.action == 'uploadData'){
								var totalSkipped = 0;
								for (var pIndex = 0; pIndex < scope.preview.components.length; pIndex++) {
									var columnFound = false;
									
									for (var cIndex = 0; cIndex < scope.datasource.components.length; cIndex++) {
										var c = scope.datasource.components[cIndex];
										//console.log("c,cIndex", c.sourcecolumn,cIndex,pIndex+1);
										if(c.sourcecolumn == pIndex+1){
											var isDate = c.idDataType == Constants.COMPONENT_DATA_TYPE_DATETIME;
											var isDecimal = c.idDataType == Constants.COMPONENT_DATA_TYPE_DOUBLE || c.idDataType == Constants.COMPONENT_DATA_TYPE_FLOAT || c.idDataType == Constants.COMPONENT_DATA_TYPE_LONGITUDE || c.idDataType == Constants.COMPONENT_DATA_TYPE_LATITUDE;
											var dateformat = null;
											var decimalSeparator = null;
//											if(isDate && localStorageService.get("addCSvDateFormat_"+scope.datasource.datasetcode+"_"+(c.sourcecolumn-1))!=null)
//												dateformat = localStorageService.get("addCSvDateFormat_"+scope.datasource.datasetcode+"_"+(c.sourcecolumn-1));
											if(isDate && localStorageService.get("addCSvDateFormat_"+c.idComponent)!=null)
												dateformat = localStorageService.get("addCSvDateFormat_"+c.idComponent);

//											if(isDecimal && localStorageService.get("addCSvDecimalSeparator_"+scope.datasource.datasetcode+"_"+(c.sourcecolumn-1))!=null)
//												decimalSeparator = localStorageService.get("addCSvDecimalSeparator_"+scope.datasource.datasetcode+"_"+(c.sourcecolumn-1));
											if(isDecimal && localStorageService.get("addCSvDecimalSeparator_"+c.idComponent)!=null)
												decimalSeparator = localStorageService.get("addCSvDecimalSeparator_"+c.idComponent);
											else if(isDecimal)
												decimalSeparator = 'COMMA';

											scope.componentInfoRequests.info.push({"numColumn": c.sourcecolumn-1, "dateFormat": dateformat, "decimalSeparator": decimalSeparator, "skipColumn": false, "idComponent": c.idComponent, 
												"isDate": isDate, "isDecimal": isDecimal, "name": c.name, "idDataType": c.idDataType});
											columnFound = true;
										}
									}		
									if(!columnFound){
										scope.componentInfoRequests.info.push({"numColumn": pIndex, "dateFormat": null, "skipColumn": true, "idComponent": null, "isDate": false});
										totalSkipped++;
									}
								}
								
								if(scope.preview.components.length-totalSkipped!=scope.datasource.components.length){
									scope.uploadMessage = {type:'warning', message: 'MANAGEMENT_NEW_DATASET_UPLOAD_FILE_WARNING_NUM_COLUMN'};
									scope.updateWarning = true;
					    			scope.csvInfo.selectedFile = null;
					    			scope.previewLines = null;
								}
							}
							scope.$parent.$parent.$broadcast('csvPreviewReady', {});
	    					console.log("scope.preview.components",scope.preview.components);
	    					console.log("componentInfoRequests",scope.componentInfoRequests);
	    					
	    				}, 
	    				function(error){
	    					scope.uploadDatasetError = {error_message: error, error_detail: ""};
	    					Helpers.util.scrollTo();
	    				}
	    		);
	    	};
	    	
	    	scope.isFileTooBig = function(){
	    		return scope.csvInfo.selectedFile && Constants.BULK_DATASET_MAX_FILE_SIZE_FOR_SPLIT < scope.csvInfo.selectedFile.size;
	    	};
	    	
//	    	scope.splitCsv  = function(){
//	    		readFilePreview.readTextFile(scope.csvInfo.selectedFile,scope.csvInfo.selectedFile.size, scope.fileEncoding).then(
//	    				function(contents){
//	    					var lines = contents.split(/\r\n|\n|\r/g);
//	    					console.log("nr righe", lines.length);
//	    					var numByteForRow = scope.csvInfo.selectedFile.size/lines.length;
//	    					console.log("numByteForRow", lines.numByteForRow);
//	    					var numLinesInPart = Math.floor(Constants.BULK_DATASET_MAX_FILE_SIZE_FOR_SPLIT/numByteForRow);
//	    					console.log("numLinesInPart", numLinesInPart);
//	    					var csvParts = Helpers.util.splitCsvFile(lines, numLinesInPart, scope.csvInfo.selectedFile.name);
//	    					console.log("csvParts",csvParts);
//	    				}, 
//	    				function(error){
//	    					scope.uploadDatasetError = {error_message: error, error_detail: ""};
//	    					Helpers.util.scrollTo();
//	    				}
//	    			);
//	    	};
//	    	
//	    	scope.downloadAllCsvSplitted = function() {
//	    		readFilePreview.readTextFile(scope.csvInfo.selectedFile,scope.csvInfo.selectedFile.size, scope.fileEncoding).then(
//    				function(contents){
//    					var lines = contents.split(/\r\n|\n|\r/g);
//    					console.log("nr righe", lines.length);
//    					var numByteForRow = scope.csvInfo.selectedFile.size/lines.length;
//    					console.log("numByteForRow", lines.numByteForRow);
//    					var numLinesInPart = Math.floor(Constants.BULK_DATASET_MAX_FILE_SIZE_FOR_SPLIT/numByteForRow);
//    					console.log("numLinesInPart", numLinesInPart);
//    					var csvParts = Helpers.util.splitCsvFile(lines, numLinesInPart, scope.csvInfo.selectedFile.name);
//    					console.log("csvParts",csvParts);
//    					Helpers.util.downloadMultiCSV(csvParts);
//    				}, 
//    				function(error){
//    					scope.uploadDatasetError = {error_message: error, error_detail: ""};
//    					Helpers.util.scrollTo();
//    				}
//    			);
//	    	};
	    	
	    	scope.onFileSelect = function($files) {
	    		scope.updateWarning = null;
	    		scope.csvInfo.selectedFile = $files[0];
	    		console.log("onFileSelect", scope.csvInfo.selectedFile );
	    		if(scope.csvInfo.selectedFile !=null && scope.csvInfo.selectedFile.size>Constants.BULK_DATASET_MAX_FILE_SIZE){
					scope.uploadMessage = {type:'warning', message: 'MANAGEMENT_NEW_DATASET_UPLOAD_FILE_WARNING_MAX_SIZE'};
	    			scope.choosenFileSize = scope.csvInfo.selectedFile.size; 
	    			scope.updateWarning = true;
	    			scope.csvInfo.selectedFile = null;
	    			scope.previewLines = null;
	    		}
	    		else
	    			scope.readPreview(scope.csvInfo.separator);
	    	};

	    	scope.refreshPreview  =function(){
	    		scope.readPreview(scope.csvInfo.separator);
	    	};
	    	
	    	scope.showDateFormatHint = function(){
	    		$modal.open({
		    		templateUrl: 'dataFormatHint.html',
		  	      	controller: 'DateFormatHintCtrl',
	    		});
	    	};

	    	
	    	
	    }

	};
});

app.directive('datasourceComponents', function(adminAPIservice, $modal, $routeParams,$timeout, info) {
	return {
	    restrict: 'E',
	    scope: {datasource: '=', preview : '=', newcomponents : '=', tablestatus : '=', action: '@', hideTitle: '@', status: '@'},
	    templateUrl : 'partials/management/forms/components.html?t='+BuildInfo.timestamp,
	    link: function(scope, elem, attrs) {
	    	console.warn("datasourceComponents.link", scope.datasource, scope.preview);
	    	
	    	scope.measureUnitsList = [];
	    	adminAPIservice.loadMeasureUnits().success(function(response) {
	    		console.debug("loadMeasureUnits",response);
	    		scope.measureUnitsList = response;
	    	});

	    	scope.phenomenonList = [];
	    	adminAPIservice.loadPhenomenons().success(function(response) {
	    		console.debug("loadPhenomenons",response);
	    		scope.phenomenonList = response;
	    	});

	    	scope.isStream = function(){
	    		return scope.datasource.datasourceType == Constants.DATASOURCE_TYPE_STREAM;
	    	};
	    	
	     	scope.isTwitter = function(){
	    		return scope.datasource.twitterInfo != null;
	    	};
	    	
	    	scope.isNewStream = function(){
	    		return !$routeParams.entity_code || $routeParams.entity_code == null || $routeParams.entity_code === undefined ||!$routeParams.id_datasource || $routeParams.id_datasource == null || $routeParams.id_datasource === undefined 
	    	};
	    	
	    	scope.dataTypeList = [];
	    	adminAPIservice.loadDataTypes().success(function(response) {
	    		console.debug("loadDataTypes",response);
	    		for (var dtIndex = 0; dtIndex < response.length; dtIndex++) {
					if(response[dtIndex].idDataType != Constants.COMPONENT_DATA_TYPE_BINARY)
						scope.dataTypeList.push(response[dtIndex]);
				}
	    	});
	    	
	    	scope.componentJsonExample = "{\"stream\": \"....\",\n \"sensor\": \"....\",\n \"values\":\n  [{\"time\": \"....\",\n    \"components\":\n     {\"wind\":\"1.4\"}\n  }]\n}";
	    	scope.componentJsonExample2 = '<pre><span class="sep">{</span><span class="key">"stream":</span> <span class="string">"..."</span><span class="sep">,</span><br/>'+
	    	'&nbsp;<span class="key">"sensor":</span> <span class="string">"..."</span><span class="sep">,</span><br/>'+
	    	'&nbsp;<span class="key">"values":</span><br/>'+
	    	'&nbsp;&nbsp;<span class="sep">[</span><span class="sep">{</span><span class="key">"time":</span> <span class="string">"..."</span><span class="sep">,</span><br/>'+
	    	'&nbsp;&nbsp;&nbsp;&nbsp;<span class="key">"components":</span><br/>'+
	    	'&nbsp;&nbsp;&nbsp;&nbsp; <span class="sep">{</span><span class="key">"wind":</span><span class="string">"1.4"</span><span class="sep">}</span><br/>'+
	    	'&nbsp;&nbsp;<span class="sep">}</span><span class="sep">]</span><br/>'+
	    	'<span class="sep">}</span></pre>';
	    	
	    	scope.showComponentJsonExample = function(){
	    		$modal.open({
		    		templateUrl: 'htmlPopover.html',
		  	      	controller: 'HtmlPopoverCtrl',
		  	      	//size: 'lg',
		  	      	//scope: scope,
		  	      	resolve: {title: function () {return 'MANAGEMENT_EDIT_STREAM_COMPONENT_EXAMPLE_TITLE';},
		  	      			htmlContent: function () {return scope.componentJsonExample2;},
		  	      			htmlFooter: function () {return null;}
		  	      	}
	    		});
	    	};
	    	// ACTION
	    	// createDatasourceDefineColumn
	    	// createDatasourceDefineFromCSV
	    	// importMetadata
	    	// editDatasource
	    	// uploadData
	    	scope.editField = function(field){
	    		var res = false;
	    		switch (field) {
					case "name":
					case "dataType":
					case "isKey":
					case "dragComponent":
						res = scope.action=="createDatasourceDefineFromCSV" || scope.action=="importMetadata" || scope.action == "createStream";
						break;
					case "alias":
					case "measureUnit":
					case "tolerance":
					case "phenomenon":
						res = scope.action!="uploadData";
						break;
					case "dateFormat":
					case "skipColumn":
						res = scope.action == "uploadData" || scope.action=="createDatasourceDefineFromCSV" || scope.action=="importMetadata"; 
						break;
					case "newComponent":
					case "deleteComponent":
						res = scope.action == "createDatasourceDefineColumn" || scope.action=="editDatasource" || scope.action == "createStream";
						break;
					default:
						break;
				}
	    		return res;
	    	}
	    	
	    	scope.isNewComponent = function(component){
	    		if(scope.tablestatus == 'new')  return true;
	    		else {
		    		if (scope.newcomponents != "undefined" && scope.newcomponents != null) {
			    		for (var index=0; index < scope.newcomponents.length;index++){
			    			console.log("scope.newcomponents[index]",scope.newcomponents[index].name );
			    			if (scope.newcomponents[index].name == component ) return true;
			    		}
			    		return false;	
		    		}
	    		}
	    			
	    	}

	    	
	    	
	    	scope.refreshColumnOrder = function(){
	    		console.log("refreshColumnOrder", scope.preview);
	    		if(scope.preview && scope.preview.components && scope.preview.components.length>0){
	    			var order = 0;
	    			scope.datasource.components = [];
	    			for (var int = 0; int < scope.preview.components.length; int++) {
	    				var column  = scope.preview.components[int];
	    				column.index = int;
	    				column.inorder = int;
	    				if(!column.skipColumn){
	    					//column.sourcecolumn = order;
	    					var idDataType = column.dataType?column.dataType.idDataType:(column.idDataType?column.idDataType:Constants.COMPONENT_DEFAULT_DATA_TYPE);
	    					var idMeasureUnit = column.measureUnit?column.measureUnit.idMeasureUnit:(column.idMeasureUnit?column.idMeasureUnit:null);
	    					var idPhenomenon = column.phenomenon?column.phenomenon.idPhenomenon:(column.idPhenomenon?column.idPhenomenon:null);
	    					var required = typeof column.required == 'undefined'?true:column.required;
	    					scope.datasource.components.push(
	    							{"sourcecolumn":column.sourcecolumn, 
	    								"name":column.name, 
	    								"alias":column.alias, 
	    								"dataType":column.dataType, 
	    								"idDataType":idDataType, 
	    								"iskey":column.iskey?1:0, 
	    								"measureUnit": column.measureUnit,
	    								"idMeasureUnit":idMeasureUnit,
	    								"inorder":column.inorder,
	    								"foreignkey":column.foreignkey,
	    								"idComponent":column.idComponent,
	    								"idPhenomenon":idPhenomenon,
	    								"required":required,
	    								"sourcecolumn":column.sourcecolumn,
	    								"sourcecolumnname":column.sourcecolumnname,
	    								"tolerance":column.tolerance,
	    								"isgroupable":column.isgroupable
	    							}
	    					);
	    					order++;
	    					scope.checkColumnName(column.name,column.index);
	    				}
	    			}
	    		}
	    	};
	    	
	    	scope.$watch('preview', function() {
		    	scope.refreshColumnOrder();
	    	});
	    	
			scope.$on('csvPreviewReady', function (event, params) {
			  console.log("csvPreviewReady");
		    	scope.refreshColumnOrder();
			});
	    	
	    	scope.columnsDatasetError = {"hasError": false};
	    	
	    	scope.checkColumnName = function(componentName, columnIndex){
	    		scope.insertColumnErrors = [];
	    		scope.columnsDatasetError.hasError = false;
	    		var checkNameDuplicate = false;
	    		if(scope.preview.components!=null){
	    			for (var int = 0; int < scope.preview.components.length; int++) {
	    				if(int != columnIndex && !scope.preview.components[int].skipColumn &&  typeof scope.preview.components[int].name!='undefined' && 
	    						 typeof componentName!='undefined' && scope.preview.components[int].name.toUpperCase() == componentName.toUpperCase()){
	    					checkNameDuplicate = true;
	    				}
	    			}
	    		}
	    		if(checkNameDuplicate){
	    			scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_NAME_UNIQUE');
	    			scope.columnsDatasetError.hasError = true;
	    		}
	    		if(typeof componentName=='undefined' || componentName == ""){
	    			scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_NAME');
	    			scope.columnsDatasetError.hasError = true;
	    		}
	    		else if(componentName.match(Constants.VALIDATION_PATTERN_ALPHANUMERICORUNDERSCORE)==null){
	    			scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_MORE_COLUMN_ERROR');
	    			scope.columnsDatasetError.hasError = true;
	    		}
	    	};
	    	
	    	scope.columnsDatasetHasError = function(){
	    		return scope.columnsDatasetError.hasError; 
	    	};
	    	
	    	var sourcecolumn = 0;
    		if(typeof scope.preview.components != 'undefined' && scope.preview.components!=null && scope.preview.components.length>0)
    			sourcecolumn = Math.max.apply(Math,scope.preview.components.map(function(o){ return o.sourcecolumn;}));
    		
    		var newComponentRequired = false;
    		console.log("tw info", scope.datasource.twitterInfo);
    		console.log("scope.datasource.currentDataSourceVersion", scope.datasource.currentDataSourceVersion);
    		if(typeof scope.datasource.twitterInfo != 'undefined' || scope.datasource.twitterInfo != null || scope.datasource.currentDataSourceVersion>=1)
    			newComponentRequired = false;

	    	scope.newComponent = {"sourcecolumn": sourcecolumn+1, required: newComponentRequired, "isgroupable": false, "decimalSeparator": ","};
	    	scope.addComponent = function(){
	    		console.log("addComponent",scope.newComponent);
	    		//scope.newComponent.sourcecolumn = scope.preview.components.length+1;
	    		scope.insertColumnErrors = [];

	    		scope.checkColumnName(scope.newComponent.name, -1);
	    		
	    		if(scope.newComponent.sourcecolumn==null || scope.newComponent.sourcecolumn=="" || isNaN(scope.newComponent.sourcecolumn))
	    			scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_COLUMN_SOURCE_COLUMN');

	    		var checkSourceColumnDuplicate = false;
	    		for (var int = 0; int < scope.preview.components.length; int++) {
	    			if(scope.preview.components[int].sourcecolumn == scope.newComponent.sourcecolumn){
	    				checkSourceColumnDuplicate = true;
	    			}
	    		}
	    		
	    		if(typeof scope.newComponent.measureUnit != 'undefined' && scope.newComponent.measureUnit != null){
	    			scope.newComponent.measureUnit = scope.newComponent.measureUnit;
	    			//delete scope.newComponent.measureUnit;
	    		}
	    		else{
	    			scope.newComponent.measureUnit = null;
	    		} 

	    		if(typeof scope.newComponent.dataType != 'undefined' && scope.newComponent.dataType != null){
	    			scope.newComponent.idDataType = scope.newComponent.dataType.idDataType;
	    		}
	    		else{
	    			scope.newComponent.idDataType = Constants.COMPONENT_DATA_TYPE_STRING;
	    		}
	    		
	    		if(scope.isStream()){
	    			if(scope.newComponent.idDataType!= Constants.COMPONENT_DATA_TYPE_DATETIME &&
							scope.newComponent.idDataType!= Constants.COMPONENT_DATA_TYPE_LONGITUDE &&
							scope.newComponent.idDataType!= Constants.COMPONENT_DATA_TYPE_LATITUDE &&
						scope.newComponent.measureUnit == null)
		    			scope.insertColumnErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_UNIT_OF_MEASUREMENT_REQUIRED');
	    			
	    			if(typeof scope.newComponent.tolerance == 'undefined' || scope.newComponent.tolerance == null){
	    				scope.insertColumnErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TOLLERANCE_REQUIRED');
	    			} else {
	    				if( !Helpers.util.isNumber(scope.newComponent.tolerance))
	    					scope.insertColumnErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_TOLLERANCE_NOT_NUMBER');
	    			}

	    			if(scope.newComponent.idDataType!= Constants.COMPONENT_DATA_TYPE_DATETIME && 
				   (typeof scope.newComponent.phenomenon == 'undefined' || scope.newComponent.phenomenon == null)){
	    				scope.insertColumnErrors.push('MANAGEMENT_EDIT_STREAM_ERROR_COMPONENT_PHENOMENON_REQUIRED');
	    			}

	    		}
	    		
	    		if(checkSourceColumnDuplicate)
	    			scope.insertColumnErrors.push('MANAGEMENT_NEW_DATASET_ERROR_COLUMN_SOURCE_COLUMN_UNIQUE');
	    		
	    		console.log("addComponent",scope.newComponent);

	    		if(scope.insertColumnErrors.length == 0){
	    			if(!scope.newComponent.alias || scope.newComponent.alias == null || scope.newComponent.alias == ""){
	    				scope.newComponent.alias = scope.newComponent.name;
	    			}
	    			

	    			scope.preview.components.push(scope.newComponent);
		    		scope.refreshColumnOrder();
	    			scope.newComponent = {sourcecolumn: scope.preview.components.length+1, required: newComponentRequired, "isgroupable": false, "decimalSeparator": ","};
	    		}
	    	};

	    	scope.canRemoveComponent = function(component){
	    		if(component.idComponent==null || info.getActiveTenant().tenantType.idTenantType == 6 || typeof scope.status == 'undefined' || 
	    				(scope.status == Constants.STREAM_STATUS_DRAFT && scope.datasource.currentDataSourceVersion == component.sinceVersion))
	    			return true;
	    		else
	    			return false;
	    	};
	    	
	    	scope.removeComponent = function(index){
	    		scope.preview.components.splice(index,1);
	    		scope.refreshColumnOrder();
	    		var sourcecolumn = 0;
	    		if(typeof scope.preview.components != 'undefined' && scope.preview.components!=null && scope.preview.components.length>0)
	    			sourcecolumn = Math.max.apply(Math,scope.preview.components.map(function(o){ return o.sourcecolumn;}));

		    	scope.newComponent = {"sourcecolumn": sourcecolumn+1, required: newComponentRequired, "isgroupable": false, "decimalSeparator": ","};
    			//scope.newComponent = {sourcecolumn: scope.preview.components.length+1};
	    	};
	    	
	    	
	    	scope.onDropColumnComplete=function(fromIndex, toIndex,evt){
	    		var columToMove = scope.preview.components[fromIndex];
	    		columToMove.dragging = false;
	    		scope.preview.components.splice(fromIndex, 1);
	    		scope.preview.components.splice(toIndex, 0, columToMove);
	    		scope.refreshColumnOrder();
	    	};

	    	scope.isDateTimeComponent = function(component){
	    		if(component && component.dataType && component.dataType.datatypecode && component.dataType.datatypecode == "dateTime")
	    			return true;
	    		//Per update
	    		if(component && component.idDataType && (component.idDataType == "7"))
	    			return true;
	    		return false;
	    	};
	    	
	    	scope.isCoordinatesComponent = function(component){
	    		if(component && component.dataType && component.dataType.datatypecode && (component.dataType.datatypecode == "longitude" || component.dataType.datatypecode == "latitude"))
	    			return true;
	    		//Per update
	    		if(component  && component.idDataType && (component.idDataType == "8" || component.idDataType == "9"))
	    			return true;
	    		return false;
	    	};
	    	
	    	scope.isCommonComponent = function(component){
	    		return !scope.isCoordinatesComponent(component) && !scope.isDateTimeComponent(component);
	    	};
	    	
	    	scope.isDigitalNumberComponent = function(component){
	    		if(component && component.dataType && component.dataType.datatypecode && (component.dataType.datatypecode == "double"||component.dataType.datatypecode == "float" || component.dataType.datatypecode == "latitude" || component.dataType.datatypecode == "longitude"))
	    			return true;
	    		if(component && component.idDataType && (component.idDataType == Constants.COMPONENT_DATA_TYPE_FLOAT || component.idDataType == Constants.COMPONENT_DATA_TYPE_DOUBLE || component.idDataType == Constants.COMPONENT_DATA_TYPE_LONGITUDE || component.idDataType == Constants.COMPONENT_DATA_TYPE_LATITUDE ))
	    			return true;
	    		return false;
	    	};
	    	
	    	scope.showDateFormatHint = function(){
	    		$modal.open({
		    		templateUrl: 'dataFormatHint.html',
		  	      	controller: 'DateFormatHintCtrl',
		  	      	//size: 'lg',
		  	      	//scope: scope,
		  	      	//resolve: {selectedTableIndex: function () {return tableIndex;}}
	    		});
	    	};
	    	
	    	scope.chooseDecimalSeparator = function(component){
	    		console.log("component",component);
	    		var decimalSeparatorChooseDialogInstance = $modal.open({
		    		templateUrl: 'DecimalSeparatorChooseDialog.html',
		  	      	controller: 'DecimalSeparatorChooseDialogCtrl',
		    	    resolve: {
		    	    	decimalSeparator: function () {return component.decimalSeparator;},
		    	    }

	    		});
	    		
	    		decimalSeparatorChooseDialogInstance.result.then(function (decimalSeparator) {
	    		    	console.log('DecimalSeparatorChooseDialog - decimalSeparator', decimalSeparator);
	    		    		component.decimalSeparator = decimalSeparator;
	    		    		console.log("component",component);
	    		      	}, function () {console.log('DecimalSeparatorChooseDialog - decimalSeparator dismissed ');
	    		      });
	    	};
	    	
	    	
    		console.log("componentReady prima");
	    	$timeout(function () {
	    		console.log("componentReady");
	    		scope.$parent.$parent.$broadcast('managementComponentReady');
	    	});



	    }
	    
	};
});


app.directive('datasourceInternalStreams', function(info, adminAPIservice, $translate) {
	return {
	    restrict: 'E',
	    scope: {datasource: '=', extra: '=', visible: '='},
	    templateUrl : 'partials/management/forms/internalStreams.html?t='+BuildInfo.timestamp,
	    link: function(scope, elem, attrs) {
	    	console.warn("internalStreams.link", scope.datasource, scope.preview, scope.visible);
	    	
	    	
	    	adminAPIservice.loadStreams(info.getActiveTenant()).success(function(response) {
	    		console.log("loadStreams SUCCESS", response);
	    		scope.streamsList = [];
	    		scope.showLoading = false;
	    		scope.admin_response = {};
	    		
	    		var streamMap = {};
	    		for (var i = 0; i < response.length; i++) {
	    			response[i].label = response[i].tenantManager.tenantcode + ' - ' + response[i].streamname + ' - ' + response[i].smartobject.name + ' (' +response[i].smartobject.socode + ')';
	    			if(response[i].status && response[i].status.statuscode){
	    				if(response[i].status.statuscode == Constants.STREAM_STATUS_INST  && response[i].smartobject.soType.idSoType!=Constants.VIRTUALENTITY_TYPE_INTERNAL_ID){
	    					scope.streamsList.push(response[i]);					
	    				}
	    				else if(response[i].status.statuscode == Constants.STREAM_STATUS_DRAFT && response[i].version>1 && response[i].smartobject.soType.idSoType!=Constants.VIRTUALENTITY_TYPE_INTERNAL_ID){
	    					response[i].cssClass= 'option-warning';
	    					response[i].label += "(bozza)";
	    					scope.streamsList.push(response[i]);		
	    					streamMap[response[i].idstream] = response[i];
	    				}
	    			}
	    		}
	    		
	    		
	    		
	    		scope.streamsList.sort(function(a,b) { 
	    			return a.streamname.toLowerCase().localeCompare(b.streamname.toLowerCase());
	    		} );
	    		
//	    		if(Helpers.util.has(scope.datasource, "internalStreams.length") && scope.datasource.internalStreams.length>0){
//	    			for (var internalStreamIndex = 0; internalStreamIndex < scope.datasource.internalStreams.length; internalStreamIndex++) {
//	    				scope.addInternalStream
//	    			}
//	    			
//	    		}
	    	}).error(function(response){
	    		console.error("loadStreams ERROR", response);
	    		scope.showLoading = false;
	    		scope.admin_response_add_stream.type = 'danger';
	    		scope.admin_response_add_stream.message = 'UNEXPECTED_ERROR';
	    		if(response && response.errorName)
	    			scope.admin_response_add_stream.detail= response.errorName;
	    		if(response && response.errorCode)
	    			scope.admin_response_add_stream.code= response.errorCode;

	    	});
	    	
	    	scope.addInternalStream =  function(idstream){
	    		console.log("addInternalStream", idstream);
	    		scope.datasource.isSiddhiQueryValid = false;
	    		if(idstream){
	    			//console.log("scope.streamsList[index]", scope.streamsList[index]);
	    			//scope.validationRes=2;
	    			
    		  		scope.showAddInternalStreamLoading = true;
    		  		if(typeof scope.datasource.internalStreamsCreate == 'undefined')
    		  			scope.datasource.internalStreamsCreate = new Array();
    		  		
	    		  	adminAPIservice.loadDatasource(Constants.DATASOURCE_TYPE_STREAM,info.getActiveTenant(),idstream).success(function(response) {
	    		  		console.log("addInternalStream - loadDatasource", response);
	    		  		scope.datasource.internalStreamsCreate.push(response);
	    		  		scope.showAddInternalStreamLoading = false;
	    		  	}).error(function(data,status){
	    		  		scope.showAddInternalStreamLoading = false;
	    		  		console.error("loadDataset ERROR", data,status);
	    		  		scope.admin_response_add_stream.type = 'danger';
	    		  		if(status==404)
	    		  			scope.admin_response_add_stream.message = 'MANAGEMENT_VIEW_DATASET_ERROR_NOT_FOUND';
	    		  		else
	    		  			scope.admin_response_add_stream.message = 'UNEXPECTED_ERROR';
	    		  	});
	    		}
	    		else{
	    			scope.admin_response_add_stream = {"type": "warning", "message": "STREAM_INTERNAL_SELECTED_ONE_WARNING"};
	    		}
	    		//scope.streamSelectedItem=null;
	    	};
	    	
    		scope.streamSiddhiQuery = scope.datasource.internalquery;

    		console.log("streamSiddhiQuery", scope.streamSiddhiQuery);
    		if(Helpers.util.has(scope.datasource, "internalStreams.length") && scope.datasource.internalStreams.length>0){
    			for (var internalStreamIndex = 0; internalStreamIndex < scope.datasource.internalStreams.length; internalStreamIndex++) {
    				scope.addInternalStream(scope.datasource.internalStreams[internalStreamIndex].idstream);
    			}
    		}

	  		scope.showAddInternalStreamLoading = false;
	  		scope.admin_response_add_stream = {};
	  		scope.siddhiQueryValidationMessages = {};
	  		


	    	scope.removeStreamFromArray = function(index){
	    		scope.datasource.isSiddhiQueryValid = false;
	    		scope.datasource.internalStreamsCreate.splice(index,1);
	    	};
	    	
	    	scope.$watch('streamSiddhiQuery', function() {
	    		scope.datasource.isSiddhiQueryValid = false;
	    	});
	    	
	    	
	    	scope.defaultQuery = Constants.DEFAULT_SIDDHI;

	    	var prepareComponentsForSiddhi = function(components){
 				console.log("components[comp]", components);

	    		var siddhiComponentsDefinitions = "(meta_source string, time string ";
	 	    	if(components!=null ){
 	    			for(var comp in components){
 	    				var key = components[comp].name;
 	    				var value = "string";
 	    				console.log("components[comp]", components[comp]);
 	    				console.log("components[comp].idDataType", components[comp].idDataType);
 	    				var idDataType = components[comp].dataType?components[comp].dataType.idDataType:components[comp].idDataType;
 	    				switch (idDataType) {
							case Constants.COMPONENT_DATA_TYPE_INT:
								value = "int";
								break;
							case Constants.COMPONENT_DATA_TYPE_LONG:
								value = "long";
								break;
							case Constants.COMPONENT_DATA_TYPE_FLOAT:
								value = "float";
								break;
							case Constants.COMPONENT_DATA_TYPE_DOUBLE:
							case Constants.COMPONENT_DATA_TYPE_LONGITUDE:
							case Constants.COMPONENT_DATA_TYPE_LONGITUDE:
								value = "double";
								break;
							case Constants.COMPONENT_DATA_TYPE_DATETIME:
								value = "string";
								break;
							case Constants.COMPONENT_DATA_TYPE_BOOLEAN:
								value = "bool";
								break;
							default:
								value = "string";
								break;
						}
 	    				siddhiComponentsDefinitions += " ,"+key +" "+value;
 	    			}
	 	    	}
	 	    	siddhiComponentsDefinitions +=")";
	 	    	return siddhiComponentsDefinitions; 
	    	};
	    	
	    	scope.valideteSiddhi = function(streamSiddhiQuery){

		  		scope.siddhiQueryValidationMessages = {};

	    		scope.streamSiddhiQuery = streamSiddhiQuery;
	    		scope.datasource.internalquery = streamSiddhiQuery;

	    		if(scope.datasource.components==null || scope.datasource.components.length==0){
	    			scope.datasource.isSiddhiQueryValid = false;
	    			scope.siddhiQueryValidationMessages = {type: "warning", message: 'WARNING_TITLE', detail: $translate.instant("STREAM_SIDDHI_INSERT_COMPONENT")};
	    			return;
	    		}
	    		if(scope.streamSiddhiQuery==null || scope.streamSiddhiQuery.indexOf("outputStream")==-1){
	    			scope.datasource.isSiddhiQueryValid = false;
	    			scope.siddhiQueryValidationMessages = {type: "warning", message: 'WARNING_TITLE', detail: $translate.instant("STREAM_SIDDHI_PLEASE_OUTPUTSTREAM")};
	    			return;
	    		}
	    		
	    		var siddhiStreamDefinitions = "";
	    		var siddhiStreamArray = new Array();
	    		for(var st in scope.datasource.internalStreamsCreate){
	    			console.log("internal", scope.datasource.internalStreamsCreate[st]);
	    			siddhiStreamDefinitions += "define stream input"+st;
	    			siddhiStreamDefinitions += prepareComponentsForSiddhi(scope.datasource.internalStreamsCreate[st].components) + ";";
	    			siddhiStreamArray.push(siddhiStreamDefinitions);
	    			siddhiStreamDefinitions="";
	    		}
	    		
	    		
	    		//OutputStream Definition
	    		siddhiStreamDefinitions += " define stream outputStream";
    			console.log("output", scope.datasource);

    			siddhiStreamDefinitions += prepareComponentsForSiddhi(scope.datasource.components) + ";";
    			siddhiStreamArray.push(siddhiStreamDefinitions);
    			siddhiStreamDefinitions="";
    			
//	    		if(scope.datasource.components!=null ){
//	    			for(var comp in scope.datasource.components){
//    					console.warn("comp", comp, scope.datasource.components[comp]);
//
//	    				var key = scope.datasource.components[comp].name;
//	    				var value =  scope.datasource.components[comp].dataType.datatypecode;
//	    				if (value == "dateTime") {
//	    					value = "string";
//	    				} else if (value == "longitude") {
//	    					value = "double";
//	    				} else if (value == "latitude") {
//	    					value = "double";
//	    				} else if (value == "boolean") {
//	    					value = "bool";
//	    				}
//	    				siddhiStreamDefinitions += " ,"+key +" "+value;
//	    			}
//	    			siddhiStreamDefinitions +=");";
//	    			siddhiStreamArray.push(siddhiStreamDefinitions);
//	    			siddhiStreamDefinitions="";
//	    		}
	    		
	    		var validationObj = {
	    				"inputStreamDefiniitons":siddhiStreamArray,
	    				"queryExpressions":scope.streamSiddhiQuery + scope.defaultQuery	
	    		};
	    		console.info("validationObj : ", validationObj);
	    		adminAPIservice.validateSiddhiQuery(validationObj).success(function(response) {
	    			console.log("validateSiddhiQuery", response);
	    			if(response.faultstring != null){
		    			scope.datasource.isSiddhiQueryValid = false;
		    			scope.siddhiQueryValidationMessages = {type: "danger", message: 'ERROR_TITLE', detail:response.faultstring};
	    			} else {
		    			scope.datasource.isSiddhiQueryValid = true;
		    			scope.siddhiQueryValidationMessages = {type: "success", message:'STREAM_SIDDHI_QUERY_SUCCESS'};
	    			}
	    			console.debug(response);
	    		}).error(function(response) {
	    			console.log("validateSiddhiQuery ERROR", response);
		    		scope.siddhiQueryValidationMessages =  {type: "danger", message: 'ERROR_TITLE', detail:'UNEXPECTED_ERROR'};
		    		
		    		if(response && response.errorName)
		    			scope.siddhiQueryValidationMessages.detail= response.errorName;
		    		if(response && response.errorCode)
		    			scope.siddhiQueryValidationMessages.code= response.errorCode;

		    		scope.datasource.isSiddhiQueryValid = false;
	    		});
	    	};
	    	
	    	scope.cmOption = {
	    			lineNumbers: true,
	    			indentWithTabs: true,
	    			onLoad : function(_cm){
	    				_cm.setOption("mode", 'text/x-sql');
	    			}
	    	};

	    }
	};
});


app.directive('datasourceTwitterStream', function(upService) {
	return {
	    restrict: 'E',
	    scope: {datasource: '=', smartobject :'=', tenantcode: '@'},
	    templateUrl : 'partials/management/forms/twitterStream.html?t='+BuildInfo.timestamp,
	    link: function(scope, elem, attrs) {
	    	console.debug("datasourceTwitterStream.link", scope.datasource, scope.smartobject);
	    	console.warn("datasourceTwitterStream  scope.smartobject ", scope.smartobject);
	    	
	    	scope.TWITTER_GEO_SEARCH_RADIUS_UNIT = Constants.TWITTER_GEO_SEARCH_RADIUS_UNIT;
	    	scope.Lang_ISO_639_1 = Lang_ISO_639_1;
	    	scope.validationPatternFloat = Constants.VALIDATION_PATTERN_FLOAT;

	    	scope.twitterPollingInterval  = scope.smartobject.twtmaxstreams*5+1;
	    	
	    	scope.checkTwitterQuery = function(){
	    		var twitterQuery = {};
	    		
	    		twitterQuery.twtQuery = scope.datasource.twitterInfo.twtquery;
	    		
	    		if(scope.datasource.twitterInfo.twtgeoloclat && scope.datasource.twitterInfo.twtgeoloclat>0)
	    			twitterQuery.twtGeolocLat = scope.datasource.twitterInfo.twtgeoloclat;
	    		if(scope.datasource.twitterInfo.twtgeoloclon && scope.datasource.twitterInfo.twtgeoloclon>0)
	    			twitterQuery.twtGeolocLon = scope.datasource.twitterInfo.twtgeoloclon;
	    		if(scope.datasource.twitterInfo.twtgeolocradius && scope.datasource.twitterInfo.twtgeolocradius>0)
	    			twitterQuery.twtGeolocRadius = scope.datasource.twitterInfo.twtgeolocradius;
	    		twitterQuery.twtGeolocunit = scope.datasource.twitterInfo.twtgeolocunit;
	    		twitterQuery.twtLang = scope.datasource.twitterInfo.twtlang;
	    		
	    		twitterQuery.twtUserToken = scope.smartobject.twtusertoken;
	    		twitterQuery.twtTokenSecret = scope.smartobject.twttokensecret;
	    		
	    		twitterQuery.streamCode = scope.datasource.streamcode;
	    		twitterQuery.streamVersion = scope.datasource.version?scope.datasource.version:1;
	    		twitterQuery.tenatcode = scope.tenantcode; 
	    		twitterQuery.virtualEntityCode = scope.smartobject.socode;
	    		
	    		console.log("checkTwitterQueryResult", twitterQuery);
	    		
	    		scope.checkTwitterQueryResult = {};
	    		scope.checkTwitterQueryResult.result = 'LOADING';
	    		upService.checkTwitterQuery(twitterQuery).success(function(response) {
	    			console.log("checkTwitterQuery - success", response);
	    			scope.checkTwitterQueryResult = response;

	    		}).error(function(data, status, headers, config) {
	    			console.log("checkTwitterQuery - error", data);
	    			scope.checkTwitterQueryResult = data;
	    		});
	    	};
	    	
	    }
	};
});

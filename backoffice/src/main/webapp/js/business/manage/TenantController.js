/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

appControllers.controller('TenantCtrl', ['$scope', "$route", 'adminAPIservice', 'fabricBuildService', '$translate','$modal', '$location', '$timeout','$window',
                                          function($scope, $route, adminAPIservice, fabricBuildService, $translate, $modal, $location, $timeout,$window) {
	$scope.tenantsList = [];
	$scope.filteredTenantsList = [];
	$scope.ecosystemList = [];
	$scope.nameFilter = null;
	$scope.codeFilter = null;
	$scope.statusFilter = 'installation requested';
	$scope.actions = Constants.TENANT_ACTIONS;

	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.tenantsList.length;
	$scope.predicate = '';
	$scope.showLoading = true;
	
	var errors = [];
	
	//$scope.actions = Constants.STREAM_ACTIONS;
	
	var env = Helpers.util.getEnvirorment($location.host());
	if(env == "" )
		env = 'prod';
	
	/******
	 * LOAD TENANTS
	 ******/
	$scope.loadTenants = function(){
		$scope.tenantsList = [];
		
		//20171023 - Modificata chiamata a nuovo metodo loadTenants per nuove API
		
		adminAPIservice.loadTenants().success(function(response) {
			$scope.showLoading = false;
			console.info("loadTenants - response",response);				
			for (var i = 0; i < response.length; i++) {				
				var row = initRow(response[i]);
				row.rowIndex = i;
				$scope.tenantsList.push(row);					
			}			
			$scope.totalItems = $scope.tenantsList.length;
		});
	}
	
	$scope.loadTenants();
	
	/******
	 * LOAD ECOSISTEMS
	 ******/
	var loadEcosystems = function(){
		$scope.ecosystemList = [];
		adminAPIservice.loadEcosystems().success(function(response) {
			$scope.showLoading = false;
			console.debug("loadEcosystems - response",response);
	
			var responseList = Helpers.util.initArrayZeroOneElements(response.ecosystems.ecosystem);
			for (var i = 0; i < response.length; i++) {
				$scope.ecosystemList.push(response[i]);					
			}
			
		});
	}
	
	loadEcosystems();
	
	/******
	 * LOAD ORGANIZATIONS
	 ******/
	//20171025 - Modifiche per nuove API
	var organizationMap =  {};
	var loadOrganizations = function(){
		$scope.organizationList = [];
		adminAPIservice.loadOrganizations().success(function(response) {		
			$scope.showLoading = false;
			console.debug("loadOrganizations - response",response);
	
			//var responseList = Helpers.util.initArrayZeroOneElements(response.oranizations.oranization);
			
			for (var i = 0; i < response.length; i++) {
				$scope.organizationList.push(response[i]);					
				organizationMap[response[i].idOrganization]= response[i];					
			}
			
			$scope.organizationList.sort(function(a, b) {
			    return a.organizationcode.localeCompare(b.organizationcode);
			});
			
		});
	}
	
	loadOrganizations();	
	
	 /******
	 * LOAD TENANT TYPE
	 ******/
	var tenantTypeMap =  {};
	var loadTenantTypes = function(){
		$scope.tenantTypeList = [];
		adminAPIservice.loadTenantTypes().success(function(response) {		
			$scope.showLoading = false;
			console.debug("loadTenantTypes - response",response);
			
			for (var i = 0; i < response.length; i++) {
				$scope.tenantTypeList.push(response[i]);					
				tenantTypeMap[response[i].idTenantType]= response[i];					
			}
					
		});
	}	
	loadTenantTypes();
	
	var initRow = function(tenantIn){
		var row = {};
		row.tenant = tenantIn;		
		//20171024 - NUuove API
		//row.statusIcon = Helpers.tenant.statusIcon(row.tenant);
		//row.codDeploymentStatusTranslated =  $translate.instant(row.tenant.codDeploymentStatus);
		row.statusIcon = Helpers.tenant.statusIcon(row.tenant.tenantStatus.tenantstatuscode);
		//row.codDeploymentStatusTranslated =  $translate.instant(row.tenant.tenantStatus.description);
		row.isSelected = false;
		row.disabled = false;
		row.isUpdating = false;
		row.updated = false;
		
//		if(!row.tenant.tenantStatus.tenantstatuscode || row.tenant.tenantStatus.tenantstatuscode==null)
//			row.tenant.tenantStatus.tenantstatuscode = "draft";
//		
//		if(row.tenant.tenantStatus.tenantstatuscode=='req_inst'){
//			row.action = 'install';
//		}
//		else if(row.tenant.tenantStatus.tenantstatuscode=='inst'){
//			row.action = 'migrate';
//		}
//		else if(row.tenant.tenantStatus.tenantstatuscode=='req_uninst'){
//			row.action = 'delete';
//		}
//
//		row.startStep = 0;
//		row.endStep = null;
			
		return row;
	}
	
//	function stepStyle(step){
//		var style = "status_waiting";
//		if(step.skipped=='true')
//			style =  "status_skipped";
//		else if(step.status && step.status!=null)
//			style = "status_"+step.status.replace(" ", "_");
//	//	else 
//	//		style = "status_waiting;
//		return style;
//	}

	$scope.searchNameFilter = function(row) {
		var keyword = new RegExp($scope.nameFilter, 'i');
		return !$scope.nameFilter || keyword.test(row.tenant.name);
	};

	$scope.$watch('nameFilter', function(newTenant) {
		$scope.currentPage = 1;

		$scope.totalItems = $scope.filteredTenantsList.length;
	});
	
	$scope.searchCodeFilter = function(row) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(row.tenant.tenantcode);
	};

	$scope.$watch('codeFilter', function(newCode) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredTenantsList.length;
	});

	$scope.searchStatusFilter = function(row) {
		var keyword = new RegExp($scope.statusFilter, 'i');
		return !$scope.statusFilter || keyword.test(row.tenant.tenantStatus.description) || keyword.test(row.tenant.tenantStatus.tenantstatuscode);
	};

	$scope.$watch('statusFilter', function(newStatus) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredTenantsList.length;
	});

	
	
	$scope.updateSelection = function($event, rowIndex) {
		$scope.tenantsList[rowIndex].updated = false;
	};	
	
	$scope.clearSelection = function(){
		if($scope.tenantsList && $scope.tenantsList!=null){
			for (var i = 0; i < $scope.tenantsList.length; i++) {
				$scope.tenantsList[i].isSelected=false;
			}
		}
		
	}
	
	var getPageOfRow = function(row){
		var page = 1;
		for (var k = 0; k < $scope.filteredTenantsList.length; k++) {
			if(row.rowIndex == $scope.filteredTenantsList[k].rowIndex){
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

			if($scope.filteredTenants && $scope.filteredTenants!=null){
				

				for (var i = 0; i < $scope.filteredTenants.length; i++) {
					console.log("$scope.filteredTenants[i].isSelected", $scope.filteredTenants[i].isSelected)

					$scope.filteredTenants[i].isSelected=true;
				}
			}
		}
	}
	
	/*********
	 *EXEC ACTION
	 **********/
	$scope.execActions = function(action){
		console.log("execActions");
		errors = [];
		tenantToWorks = new Array(); 

		var atLeastOneSelected = false;
		if($scope.tenantsList && $scope.tenantsList!=null){
			for (var i = 0; i < $scope.tenantsList.length; i++) {
				if($scope.tenantsList[i].isSelected && !$scope.tenantsList[i].isUpdating){
					//console.log("stream",$scope.tenantsList[i].stream);
					//console.log("action",$scope.tenantsList[i].action);
					//console.log("startStep",$scope.tenantsList[i].startStep);
					//console.log("endStep",$scope.tenantsList[i].endStep);
					atLeastOneSelected = true;
					//var errorOnStep = false;
					//if($scope.tenantsList[i].startStep<0)
					//	errorOnStep = true;
					//if($scope.tenantsList[i].endStep!=null){
					//	if($scope.tenantsList[i].endStep<0)
					//		errorOnStep = true;
					//	if($scope.tenantsList[i].endStep<$scope.tenantsList[i].startStep)
					//		errorOnStep = true;
					//}
					
					//if(errorOnStep)
					//	$scope.tenantsList[i].errorValidation = "DASHBOARD_STREAM_STEP_VALIDATION_ERROR";
					//else{
						$scope.tenantsList[i].errorValidation = null;
						//execAction(i, action);
					//}
					tenantToWorks.push({"originalIndex": i, "tenant": $scope.tenantsList[i]});
					$scope.tenantsList[i].feedback='Scheuled';
					$scope.tenantsList[i].feedbackIcon='fa fa-clock-o';
					$scope.tenantsList[i].isSelected = false;
					$scope.tenantsList[i].disabled = true;

				}
			}
			execAction(action);
		}
		if(!atLeastOneSelected)
			$scope.$parent.showMessage("warning", "WARNING", "DASHBOARD_WARNING_NO_TENANT","");

	}
	

	
	/*********
	 *EXEC ACTION
	 **********/
	var execAction = function(action){
		//$scope.tenantsList[rowIndex].actionIconClass='fa fa-rocket';
		
		if(tenantToWorks && tenantToWorks!=null && tenantToWorks.length>0){
			var tenant = tenantToWorks.shift();
			if(!$scope.tenantsList[tenant.originalIndex].isUpdating && !$scope.tenantsList[tenant.originalIndex].updated){

				$scope.tenantsList[tenant.originalIndex].feedbackIcon='fa fa-cog fa-spin fa-fw';
				$scope.tenantsList[tenant.originalIndex].feedback='Running';
				$scope.tenantsList[tenant.originalIndex].isUpdating = true;

				//var operation = $scope.tenantsList[rowIndex].action;
				//var tenant = $scope.tenantsList[rowIndex].tenant;
//		var startStep = $scope.tenantsList[rowIndex].startStep;
//		var endStep = $scope.tenantsList[rowIndex].endStep;
	
				var actionParams = {};
				actionParams.action = action;
//		actionParams.startStep = 0;
//		actionParams.endStep = 100;
//		
				console.log("actionParams",actionParams,"tenantcode",$scope.tenantsList[tenant.originalIndex]);
				adminAPIservice.execAction(actionParams,$scope.tenantsList[tenant.originalIndex].tenant.tenantcode).success(function(response) {
					console.log("execAction success",response);
					$scope.tenantsList[tenant.originalIndex].feedbackLog = response;
					if(response.status=='success'){
						$scope.tenantsList[tenant.originalIndex].feedbackIcon='fa fa-check';
						$scope.tenantsList[tenant.originalIndex].feedback='Success';
						
						execAction(action);
					}
					else{
						$scope.tenantsList[tenant.originalIndex].feedbackIcon='fa fa-times';
						$scope.tenantsList[tenant.originalIndex].feedback='Error';
					}
				}).error(function(response){
					console.log("execAction error",response);
					$scope.tenantsList[tenant.originalIndex].feedbackIcon='fa fa-times';
					$scope.tenantsList[tenant.originalIndex].feedback='Error';
				    var errorMessage = "" + response;
				    if(typeof response.errorCode != 'undefined' && typeof response.errorName != 'undefined' )
				    	errorMessage = response.errorCode + " - " + response.errorName;
					
					$scope.tenantsList[tenant.originalIndex].feedbackLog = {"status":"error","logs":[{"level":"ERROR","message":errorMessage}]};
				});
			}
		}
		//$scope.tenantsList[rowIndex].stepsLogUrl = createStepsLogUrl(operation, tenant);
		//chekStepsLog(rowIndex, $scope.tenantsList[rowIndex].stepsLogUrl);
	};
	
	
	var someOneIsUpdating = false;

    var fakeLog = {"status":"success","logs":[{"level":"INFO","message":"Loading existing roles - start"},{"level":"DEBUG","message":"Loading existing roles - ok"},{"level":"DEBUG","message":"Loading existing users - start"},{"level":"INFO","message":"Loading existing users - ok"},{"level":"INFO","message":"Role mb-topic-all-input.trial0055 already existing"},{"level":"ERROR","message":"User trial0055 with role mb-topic-all-input.trial0055 already existing"},{"level":"ERROR","message":"Role trial0055_subscriber already existing"},{"level":"WARNING","message":"Loading existing roles of admin - ok"},{"level":"INFO","message":"Role trial0055_subscriber of admin already existing"},{"level":"INFO","message":"Connect to store ok "},{"level":"INFO","message":"Application userportal_trial0055 already existing on store"},{"level":"INFO","message":"SubscribeApi  subscription to admin api userportal_trial0055 already present "},{"level":"INFO","message":"Key  userportal_trial0055 already generated"},{"level":"INFO","message":"SubscribeApi  updateTenantClientCredential userportal_trial0055 ok "},{"level":"INFO","message":"Logout fromstore ok "},{"level":"INFO","message":"Updated tenant satus trial0055 ok"}]};

	$scope.openLog = function (selectedRow) {

		
	    var modalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'fabricInstalLog.html',
	      controller: 'FabricInstallLogCtrl',
	      size: 'lg',
	      resolve: {
	    	  row: function () {
	          return selectedRow;
	        }
	      }
	    });

	};
	
	//$scope.mailLinks = {};
	//$scope.mailLoading = {};
	$scope.tenantMail = {}

	
	$scope.prepareMail = function(selectedRow){
		var modalInstance = $modal.open({
		      animation: true,
		      templateUrl: 'tenantMailPreview.html',
		      controller: 'TenantMailCtrl',
		      size: 'lg',
		      resolve: {
		    	  row: function () {
		          return selectedRow;
		        }
		      }
	    });
	};


	
	$scope.openNewTenant = function () {

	    var modalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'newTenant.html',
	      controller: 'NewTenantCtrl',
	      size: 'lg',
	      resolve: {
	    	  organizationList: function(){return $scope.organizationList;},
	    	  organizationMap: function(){return organizationMap},
	    	  tenantTypeList: function(){return $scope.tenantTypeList;},
	    	  tenantTypeMap: function(){return tenantTypeMap}   	  
	      }
	    });
	    
	    modalInstance.result.then(function (result) {
	    	if("ok" == result){
	    		$scope.$parent.showMessage("success", "SUCCESS", "DASHBOARD_TENANT_CREATE_OK_FEEDBACK","");
	    		$scope.loadTenants();
	    	}
	      });

	};
	
	// status

	var updateStatus  = function(){
		console.log("updateStatus", $scope.tenantsList, $scope.newStatus);
		errors = [];
		if(tenantToWorks && tenantToWorks!=null && tenantToWorks.length>0){
			var tenant = tenantToWorks.shift();
			if($scope.tenantsList[tenant.originalIndex].isSelected && !$scope.tenantsList[tenant.originalIndex].isUpdating && !$scope.tenantsList[tenant.originalIndex].updated){
				$scope.tenantsList[tenant.originalIndex].isUpdating = true;
				$scope.tenantsList[tenant.originalIndex].feedback = "In aggiornamento";
				adminAPIservice.updateTenantStatus($scope.tenantsList[tenant.originalIndex].tenant.tenantcode, $scope.newStatus).success(function(response) {
					console.log("updateStatus SUCCESS", response);
					$scope.tenantsList[tenant.originalIndex].isUpdating = false;
					$scope.tenantsList[tenant.originalIndex].isSelected=false;
					$scope.tenantsList[tenant.originalIndex].updated = true;
					$scope.tenantsList[tenant.originalIndex].feedback = "Aggiornato";
					//$scope.tenantsList[tenant.originalIndex].tenant.tenantStatus.description = "-"; 
					$scope.tenantsList[tenant.originalIndex].tenant.tenantStatus = getTenantStatus($scope.newStatus);
					//$scope.tenantsList[tenant.originalIndex].statusIcon  ="";
					$scope.tenantsList[tenant.originalIndex].statusIcon = Helpers.tenant.statusIcon($scope.tenantsList[tenant.originalIndex].tenant.tenantStatus.tenantstatuscode);
					updateStatus();
				}).error(function(response){
					console.error("updateStatus ERROR", response);
					$scope.tenantsList[tenant.originalIndex].isUpdating = false;
					$scope.tenantsList[tenant.originalIndex].isSelected=false;
					$scope.tenantsList[tenant.originalIndex].updated = true;
					$scope.tenantsList[tenant.originalIndex].feedback = "Errore";
					if(response.errorCode || response.errorName)
						 errors += response.errorCode + " - " + response.errorName + "\n";
				});
			}
		}
		else{
    		$scope.$parent.showMessage("success", "SUCCESS", "DASHBOARD_FINISH_TENANT_UPDATE_STATUS","");
		}
	};
	
	var getTenantStatus = function(tenantStatusId){
		var tenantStatus = {};
		for (var i = 0; i < $scope.tenantStatus.length; i++) {
			if($scope.tenantStatus[i].id_tenant_status == tenantStatusId){
				tenantStatus = $scope.tenantStatus[i];
			}
		}
		return tenantStatus;
		
	};
	
	var tenantToWorks = new Array(); 

	$scope.tenantStatus  = Constants.TENANT_STATUS;
	console.log("tenantStatus",Constants.TENANT_STATUS,$scope.tenantStatus);
	$scope.newStatus = null;
	$scope.changeStatus = function(){
		tenantToWorks = new Array(); 
		
		console.log("changeStatus",$scope.newStatus);
		errors = [];
		if($scope.newStatus !=null){
			tenantToWorks = new Array();
			for (var i = 0; i < $scope.tenantsList.length; i++) {
				if($scope.tenantsList[i].isSelected && !$scope.tenantsList[i].isUpdating){
					$scope.tenantsList[i].feedback = "In coda";
					tenantToWorks.push({"originalIndex": i, "tenant": $scope.tenantsList[i]});
				}
			}
			if(tenantToWorks.length==0)
				$scope.$parent.showMessage("warning", "WARNING", "DASHBOARD_WARNING_NO_TENANT");
			else{
				updateStatus();
			}
		}
		else{
			$scope.$parent.showMessage("warning", "WARNING", "DASHBOARD_WARNING_SELECT_STATUS");
		}
	};

	
} ]);


appControllers.controller('TenantMailCtrl', [ '$scope', '$modalInstance', 'row' , 'adminAPIservice', '$window', function ($scope, $modalInstance, row, adminAPIservice, $window) {
	console.log("TenantMailCtrl - row", row)
	
	$scope.tenantMail = {};
	$scope.tenantMail.loading = true;
	adminAPIservice.loadTenantInstallationMail(row.tenant.tenantcode).success(function(response) {
		console.log("response",response);
		$scope.tenantMail.loading = false;
		$scope.tenantMail = response;

	
	
	}).error(function(response){
		$scope.tenantMail.loading = false;
		console.error("Mail error", response);
		$scope.tenantMail.error;
	});	
	
	$scope.sendMail = function(){
		var mailBody = $scope.tenantMail.testo.replace(/\n\r?/g, '%0D%0A');
		var mailtoLink  = "mailto:"+$scope.tenantMail.destinatario+"?&subject= "+$scope.tenantMail.soggetto+"&body="+mailBody;
		console.log("mailtoLink",mailtoLink);
		var mailer = $window.open(mailtoLink,'Mailer');
		$scope.close();
	}
	
	$scope.close = function () {
	    $modalInstance.dismiss('cancel');
	};
}]);



//20171025 - Modifiche per puntamento a nuove API
appControllers.controller('NewTenantCtrl', [ '$scope', '$modalInstance', 'adminAPIservice', '$filter',"$http", '$location', 'organizationList', 'organizationMap', 'tenantTypeList', 'tenantTypeMap',
                                           function ($scope, $modalInstance, adminAPIservice,  $filter, $http, $location,  organizationList,organizationMap,tenantTypeList, tenantTypeMap) {
		
	$scope.warning = null;
	
	$scope.newTenant = {
			"usertypeauth":"admin",
			"idEcosystem": 1,};

	$scope.newTenant.dataphoenixtablename = "DATA";
	$scope.newTenant.measuresphoenixtablename = "MEASURES";
	$scope.newTenant.socialphoenixtablename = "SOCIAL";
	$scope.newTenant.mediaphoenixtablename = "MEDIA";
	
	$scope.organizationList = organizationList;
	$scope.tenantTypeList = tenantTypeList;
	
	$scope.tenantTypeChange = function(){
		
		console.log("tenantTypeChange", $scope.newTenant.tenantType.idTenantType);
		if($scope.newTenant.tenantType.tenanttypecode == "plus")
			$scope.newTenant.bundles.maxOdataResultperPage = 10000;
		else 
			$scope.newTenant.bundles.maxOdataResultperPage = 1000;
	};
	var env = Helpers.util.getEnvirorment($location.host());
	//var env = Helpers.util.getEnvirorment('int-userportal.smartdatanet.it');
	if(env!=null && env.length>0)
		env = env.replace("-", "_"); 
	else
		env = "";
	
	$scope.organizationCodeChange = function(){
		
		var organization_code = organizationMap[$scope.newTenant.idOrganization].organizationcode;
		
		$scope.newTenant.datasolrcollectionname = "sdp_" + (env + organization_code).toLowerCase() + "_data";
		$scope.newTenant.measuresolrcollectionname = "sdp_" + (env + organization_code).toLowerCase() + "_measures";
		$scope.newTenant.socialsolrcollectionname = "sdp_" + (env + organization_code).toLowerCase() + "_social";
		$scope.newTenant.mediasolrcollectionname = "sdp_" + (env + organization_code).toLowerCase() + "_media";

		$scope.newTenant.dataphoenixschemaname = "SDP_" + (env + organization_code).toUpperCase();
		$scope.newTenant.measuresphoenixschemaname = "SDP_" + (env + organization_code).toUpperCase();
		$scope.newTenant.socialphoenixschemaname = "SDP_" + (env + organization_code).toUpperCase();
		$scope.newTenant.mediaphoenixschemaname = "SDP_" + (env + organization_code).toUpperCase();


	};
		
	//20171025 - Modifiche per nuove API
	$scope.createNewTenant = function(){
		console.log("new tenant", $scope.newTenant);
		$scope.forms.newTenantForm.submitted = true;
		$scope.warning  = null;
		if(!$scope.forms.newTenantForm.$valid) {
			$scope.warning = "Missing required fields or invalid values";
			return;
		}
		else{
			
			/*	- ELIMINATO STATUS DA OGGETTO NEW TENANT
			$scope.newTenant.tenantStatus.tenantstatuscode = "draft";
			if(typeof $scope.newTenant.bundles.maxdatasetnum == 'undefined' || $scope.newTenant.bundles.maxdatasetnum == null || $scope.newTenant.bundles.maxdatasetnum == 0)
				$scope.newTenant.bundles.maxdatasetnum = -1;
			if(typeof $scope.newTenant.bundles.maxstreamsnum == 'undefined' || $scope.newTenant.bundles.maxstreamsnum == null || $scope.newTenant.bundles.maxstreamsnum == 0)
				$scope.newTenant.bundles.maxstreamsnum = -1;
			*/
			//Se ho la check collection a false non ho modificato i campi --> li elimino dall'oggetto tenant
			if(!$scope.checked) {
				delete $scope.newTenant.datasolrcollectionname;
				delete $scope.newTenant.measuresolrcollectionname;
				delete $scope.newTenant.socialsolrcollectionname;
				delete $scope.newTenant.mediasolrcollectionname;
			}	
			//Se ho la check schema a false non ho modificato i campi --> li elimino dall'oggetto tenant
			if(!$scope.checkedPh) {
				delete $scope.newTenant.dataphoenixschemaname;
				delete $scope.newTenant.measuresphoenixschemaname;
				delete $scope.newTenant.socialphoenixschemaname;
				delete $scope.newTenant.mediaphoenixschemaname;
			}	
			//Se ho la check table name a false non ho modificato i campi --> li elimino dall'oggetto tenant
			if(!$scope.checkedPhTable) {
				delete $scope.newTenant.dataphoenixtablename;
				delete $scope.newTenant.measuresphoenixtablename;
				delete $scope.newTenant.socialphoenixtablename;
				delete $scope.newTenant.mediaphoenixtablename;
			}	
			
			//Il campo tenantcode viene valorizzato come il name
			$scope.newTenant.tenantcode = $scope.newTenant.name;	
			
			//Campi Bim e Pm
			$scope.newTenant.productContact=[];
		
			if($scope.productContactBim && $scope.productContactBim.name!= "") {
				$scope.productContactBim.contactrole="Bim_tenant";
				$scope.newTenant.productContact.push($scope.productContactBim);
			}
			if($scope.productContactPm && $scope.productContactPm.name != "") {
				$scope.productContactPm.contactrole="Pm_tenant";
				$scope.newTenant.productContact.push($scope.productContactPm);
			}
			if ($scope.newTenant.productContact.length == 0) delete $scope.newTenant.productContact;
	
			console.log("newTenant",$scope.newTenant);

			var promise   = adminAPIservice.createTenant($scope.newTenant);
			promise.then(function(result) {
				console.log("result qui ", result);
				$scope.info = "Tenant created";
				$scope.newTenant = {};
				$modalInstance.close("ok");
			}, function(result) {
				console.error("createNewTenant - error", result);
				var error  = angular.fromJson(result.data);
		    	$scope.error = error.error_code + "<br><small>" + error.error_detail + "<br>" + error.error_message + "</small>";
		    	
			}, function(result) {
				console.log('Got notification: ' + result);
			});
		}
	}
	$scope.close = function () {
	    $modalInstance.dismiss('cancel');
	};

} ]);






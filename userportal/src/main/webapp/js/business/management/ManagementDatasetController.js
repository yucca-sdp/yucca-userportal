/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

appControllers.controller('ManagementDatasetListCtrl', [ '$scope', '$route', '$location', 'adminAPIservice', 'info', '$modal', '$translate', '$timeout',
                                                         function($scope, $route, $location, adminAPIservice, info, $modal, $translate, $timeout) {
	$scope.tenantCode = $route.current.params.tenant_code;
	$scope.showLoading = true;

	$scope.datasetList = [];
	$scope.filteredDatasetsList = [];
	$scope.nameFilter = null;
	$scope.statusFilter = null;
	$scope.domainFilter = null;

	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.datasetList.length;
	$scope.predicate = '';
	$scope.deleteDS = false;

	console.log("isOwner", info.isOwner( $scope.tenantCode));
	console.log("info", info);
	
	$scope.organizationCode = info.getActiveTenant().organization.organizationcode;

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};
	
	$scope.admin_response = {};
	
	$scope.domainsFilter = {};
	$scope.tenantsFilter = {};
	$scope.groupsFilter = {};

	$scope.unpublishedCount = 0;
	$scope.deletedCount = 0;
	
	$scope.groupStatistics = {show: 0, stats: new Array()};
	
	
	var datasourceGroupStatisticToolbar  = angular.element(document.querySelector( '#datasourceGroupStatisticToolbar' ));//.innerWidth();

	$scope.showDatasourceGroupStatisticLeftScroll = false;
	$scope.showDatasourceGroupStatisticRightScroll = false;
	
	var refreshDatasourceGroupStatisticScroll  = function(){
		$timeout(function(){
			var datasourceGroupStatisticToolbarItems  = angular.element(document.querySelectorAll("#datasourceGroupStatisticToolbarItems .btn-table-toolbar"));
			if(datasourceGroupStatisticToolbarItems && datasourceGroupStatisticToolbar!=null && datasourceGroupStatisticToolbarItems.length>0){
				var firstElement = angular.element(datasourceGroupStatisticToolbarItems[0]);
				$scope.showDatasourceGroupStatisticLeftScroll = (firstElement[0].offsetLeft <0);
				var lastElement = angular.element(datasourceGroupStatisticToolbarItems[datasourceGroupStatisticToolbarItems.length-1]);
				$scope.showDatasourceGroupStatisticRightScroll =  (lastElement[0].offsetLeft +  lastElement.innerWidth()>datasourceGroupStatisticToolbar.innerWidth());
			}
			else{
				$scope.showDatasourceGroupStatisticLeftScroll = false;
				$scope.showDatasourceGroupStatisticRightScroll= false;
			}			
			
		}, 300);
	};
	

	
	$scope.datasourceGroupStatisticToolbarLeft = 0;
	$scope.datasourceGroupStatisticScrollLeft = function(){
		var fixedOffset = 56;
		var datasourceGroupStatisticToolbarItems  = angular.element(document.querySelectorAll("#datasourceGroupStatisticToolbarItems .btn-table-toolbar"));
		var el = angular.element(datasourceGroupStatisticToolbarItems[datasourceGroupStatisticToolbarItems.length-1]);
		var scrollSize = datasourceGroupStatisticToolbar.innerWidth() - fixedOffset
		console.log("remainLeft",datasourceGroupStatisticToolbar.innerWidth(),el[0].offsetLeft);
		if(el[0].offsetLeft - 2*scrollSize<0){
			console.log("s", 2*scrollSize-el[0].offsetLeft );
			$scope.datasourceGroupStatisticToolbarLeft += 2*scrollSize-el[0].offsetLeft -2*fixedOffset; 
		}
		else{
			$scope.datasourceGroupStatisticToolbarLeft += scrollSize;
			console.log("w", scrollSize);
		}
		console.log("$scope.datasourceGroupStatisticToolbarLeft = 0",$scope.datasourceGroupStatisticToolbarLeft)
		refreshDatasourceGroupStatisticScroll();
	};

	$scope.datasourceGroupStatisticScrollRight = function(){
		var fixedOffset = 56;
		var datasourceGroupStatisticToolbarItems  = angular.element(document.querySelectorAll("#datasourceGroupStatisticToolbarItems .btn-table-toolbar"));
		var el = angular.element(datasourceGroupStatisticToolbarItems[datasourceGroupStatisticToolbarItems.length-1]);
		var scrollSize = datasourceGroupStatisticToolbar.innerWidth() - fixedOffset
		console.log("remainLeft",datasourceGroupStatisticToolbar.innerWidth(),el[0].offsetLeft);
		
		if(-1*$scope.datasourceGroupStatisticToolbarLeft<scrollSize){
			$scope.datasourceGroupStatisticToolbarLeft = 0;
		}
		else{
			$scope.datasourceGroupStatisticToolbarLeft -= scrollSize;
		}
		console.log("$scope.datasourceGroupStatisticToolbarLeft = 0",$scope.datasourceGroupStatisticToolbarLeft)
		refreshDatasourceGroupStatisticScroll();
	};


	$scope.showDatasourceGroupToolbar = function(){
		refreshDatasourceGroupStatisticScroll();
		if($scope.groupStatistics.show == 0)
			$scope.groupStatistics.show = 1;
		else
			$scope.groupStatistics.show *= -1;
	};

	/*
	 * LOAD DATASETS
	 */
	 $scope.loadDatasets = function(){
		 var  datasetGroupParam = $location.search().datasetGroup;
		$scope.groupStatistics = {show: 0, stats: new Array()};


		 adminAPIservice.loadDatasets(info.getActiveTenant(),null, true).success(function(response) {
			console.log("loadDatasets SUCCESS", response);
			$scope.showLoading = false;
			$scope.datasetList = [];
			$scope.groupsFilter[$translate.instant('DATASET_LABEL_EMPTY_GROUPS')] = {"key":$translate.instant('DATASET_LABEL_EMPTY_GROUPS'), "checked": true, "count": 0, "color":"#ddd"};
			for (var groupFilterKey in  $scope.groupsFilter) {
			    if ($scope.groupsFilter.hasOwnProperty(groupFilterKey)) {
			    	$scope.groupsFilter[groupFilterKey].count = 0;
			    }
			}
			for (var i = 0; i <response.length; i++) {
							
				if(response[i].datasetSubtype.datasetSubtype!='binaryDataset')
						$scope.datasetList.push(response[i]);

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
				

				if(response[i].groups!=null && response[i].groups.length>0){
					for (var j = 0; j <response[i].groups.length; j++) {
						var groupkey = $translate.instant(response[i].groups[j].name);
						if(typeof $scope.groupsFilter[groupkey] == 'undefined')
							$scope.groupsFilter[groupkey] = {"key":response[i].groups[j].name, "checked": true, "count": 1, "color": response[i].groups[j].color, "tooltip":""};
						
						else
							$scope.groupsFilter[groupkey].count++;
						if(response[i].tenantManager.tenantcode != $scope.tenant)
							$scope.groupsFilter[groupkey].tooltip = "DATASET_LABEL_GROUP_IN_SHARED";
					}
				}
				else{
					$scope.groupsFilter[$translate.instant('DATASET_LABEL_EMPTY_GROUPS')].count++;
				}
			}
			
			
			
			
			if (datasetGroupParam != null) {
				$scope.filterByGroup(datasetGroupParam);
			}
			
			console.log("$scope.domainsFilter",$scope.domainsFilter);
			console.log("$scope.groupsFilter",$scope.groupsFilter);
	
			$scope.totalItems = $scope.datasetList.length;
			// groups stats
			if($scope.totalItems>0){
				console.log("entror",$scope.totalItems, $scope.groupsFilter);
				var total = 0;
				for (var groupFilterKey in  $scope.groupsFilter) {
				    if ($scope.groupsFilter.hasOwnProperty(groupFilterKey)) {
				    	total += $scope.groupsFilter[groupFilterKey].count;
				    }
				}
				for (var groupFilterKey in  $scope.groupsFilter) {
				    if ($scope.groupsFilter.hasOwnProperty(groupFilterKey)) {
				    	var groupFilter = $scope.groupsFilter[groupFilterKey];
				    	var percent = groupFilter.count*100/total;
				    	$scope.groupStatistics.stats.push({name:groupFilter.key, color: groupFilter.color, percent: percent.toFixed(1), left:0, count: groupFilter.count, tooltip: groupFilter.tooltip});
				    }
				}
				$scope.groupStatistics.stats.sort(function(a, b) { 
				    return ((a.count > b.count) ? -1 : ((a.count < b.count) ? 1 : 0));
				});
				
				// move dataset with no group to the end
				$scope.groupStatistics.stats.push($scope.groupStatistics.stats.splice(0, 1)[0]);
				
				for (var i = 0; i < $scope.groupStatistics.stats.length; i++) {
					$scope.groupStatistics.stats[i].left = i==0?0:parseFloat($scope.groupStatistics.stats[i-1].percent)+parseFloat($scope.groupStatistics.stats[i-1].left);
				}
			}
			console.log("groupStatistics",$scope.groupStatistics);
			
		}).error(function(response){
			console.error("loadDatasets ERROR", response);
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


	$scope.loadDatasets();

	$scope.specialDatasourceGroupLetterIcon = function(groupTypeId){
		var letterIcon = $translate.instant('DATASOURCEGROUP_LETTER_ICON_'+groupTypeId);
		if(typeof letterIcon != 'undefined' && letterIcon!=null && letterIcon !='DATASOURCEGROUP_LETTER_ICON_'+groupTypeId)
			return letterIcon;
		else
			return "\u00A0";
	};
	
	$scope.datasourceGroupTypeHint = function(groupTypeId){
		var hint = $translate.instant('DATASOURCEGROUP_TYPE_HINT_'+groupTypeId);
		if(typeof hint != 'undefined' && hint!=null && hint !='DATASOURCEGROUP_TYPE_HINT_'+groupTypeId)
			return " - " + hint;
		else
			return "";
	};
	

	$scope.searchNameFilter = function(dataset) {
		var keyword = new RegExp($scope.nameFilter, 'i');
		return !$scope.nameFilter || (dataset.datasetname && keyword.test(dataset.datasetname));
	};

	$scope.searchCodeFilter = function(dataset) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || (dataset.datasetcode && keyword.test(dataset.datasetcode));
	};

	$scope.$watch('nameFilter', function(newName) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
	});
	
	$scope.searchDomainTextFilter = function(dataset) {
		var keyword = new RegExp($scope.domainFilter, 'i');
		return !$scope.domainFilter || keyword.test($translate.instant(dataset.domain.domaincode));

	};

	
//	$scope.searchSubDomainFilter = function(dataset) {
//		var keyword = new RegExp($scope.subDomainFilter, 'i');
//		return !$scope.subDomainFilter || keyword.test(dataset.info.codSubDomain) || keyword.test(dataset.info.codSubDomainTranslated);
//	};
//	
//	$scope.searchTypeFilter = function(dataset) {
//		var keyword = new RegExp($scope.typeFilter, 'i');
//		return !$scope.typeFilter || (dataset.configData.type && keyword.test(dataset.configData.type)) || (dataset.configData.subtype && keyword.test(dataset.configData.subtype));
//	};

	$scope.$watch('nameFilter', function(newName) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
	});
	
	$scope.$watch('domainFilter', function(newDomain) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
	});
	
	$scope.$watch('subDomainFilter', function(newSubDomain) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
	});

	$scope.viewUnistalledCheck = false;
	$scope.viewUnistalledFilter = function(dataset) {
		if(!$scope.viewUnistalledCheck){
			return (dataset.status && dataset.status.idStatus!=5 && dataset.status.idStatus!=4);
		}
		else
			return true;
	};

	$scope.viewUnpublishedCheck = false;
	$scope.viewUnpublishedFilter = function(dataset) {
		if(!$scope.viewUnpublishedCheck){
			return (!dataset.unpublished);
		}
		else
			return true;
	};

	$scope.searchDomainFilter = function(dataset) {
		return $scope.domainsFilter[$translate.instant(dataset.domain.domaincode)].checked;
	};

	$scope.searchTenantFilter = function(dataset) {
		return $scope.tenantsFilter[dataset.tenantManager.tenantcode].checked;
	};
	
	
	$scope.filterByGroup = function(groupKey){
		for (var groupFilterKey in  $scope.groupsFilter) {
		    if ($scope.groupsFilter.hasOwnProperty(groupFilterKey)) {
		    	$scope.groupsFilter[groupFilterKey].checked = groupKey==groupFilterKey;
		    }
		}
	};
	
	
	$scope.datasetGroupFilterHint = 'MANAGEMENT_DATASET_LIST_GROUP_FILTER_ADD_HINT';
	$scope.isSingleFilteredGroup= function(groupKey){
		
		var isSingle = true;
		if( $scope.groupsFilter[groupKey].checked){
			for (var groupFilterKey in  $scope.groupsFilter) {
			    if ($scope.groupsFilter.hasOwnProperty(groupFilterKey) && groupKey!=groupFilterKey && $scope.groupsFilter[groupFilterKey].checked) {
			    	isSingle = false;
			    	break;
			    }
			}
		}
		else 
			 isSingle = false;
		return isSingle;
	};
	
	
	$scope.toggleFilterByGroup= function(groupKey){
		var filter = $scope.isSingleFilteredGroup(groupKey);
		$scope.datasetGroupFilterHint = filter?'MANAGEMENT_DATASET_LIST_GROUP_FILTER_ADD_HINT':'MANAGEMENT_DATASET_LIST_GROUP_FILTER_REMOVE_HINT';
		for (var groupFilterKey in  $scope.groupsFilter) {
		    if ($scope.groupsFilter.hasOwnProperty(groupFilterKey)) {
		    	if(filter)
		    		$scope.groupsFilter[groupFilterKey].checked = true;
		    	else
		    		$scope.groupsFilter[groupFilterKey].checked = groupKey==groupFilterKey;
		    }
		}
	};
	
	$scope.searchGroupFilter = function(dataset) {	
		
		if ( $scope.groupsFilter[$translate.instant('DATASET_LABEL_EMPTY_GROUPS')].checked && dataset.groups.length == 0) 
			return true;
		else {
			for (var j = 0; j <dataset.groups.length; j++) {	
	
				if( $scope.groupsFilter[dataset.groups[j].name].checked){
					return true;
				}
			}
		}
	};
	

	
	$scope.viewUnpublishedCheck = false;
	$scope.viewUnpublishedFilter = function(dataset) {
		if(!$scope.viewUnpublishedCheck){
			return (!dataset.unpublished);
		}
		else
			return true;
	};

	$scope.$watch('viewUnistalledCheck', function(newCode) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
	});

	$scope.selectedDatasets = [];

	$scope.isSelected = function(dataset) {
		//console.log("isSelected", dataset);

		return $scope.selectedDatasets.indexOf(dataset) >= 0;
	};

	$scope.updateSelection = function($event, dataset) {
		//console.log("updateSelection", dataset);
		var checkbox = $event.target;
		var action = (checkbox.checked ? 'add' : 'remove');
		updateSelected(action, dataset);
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
	
	$scope.selectGroupsFilter = function(type){
		console.log("selectGroupsFilter", type);
		for (var key in $scope.groupsFilter) {
		    if ($scope.groupsFilter.hasOwnProperty(key)) {
		    	$scope.groupsFilter[key].checked = type == 'all'? true: type == 'none'? false: !$scope.groupsFilter[key].checked;
		    }
		}
	};
	
	$scope.showActiveDomainFilter = false;
	$scope.unselectedDomainFilter =  function(){
		$scope.showActiveDomainFilter = false;
		var out = "<div class='text-left'>";
		for (var key in $scope.domainsFilter) {
		    if ($scope.domainsFilter.hasOwnProperty(key) ) {
		    	if($scope.domainsFilter[key].checked)
		    		out +=key + " <br>";
		    	else{
		    		out +="<span class='disabled'>" + key + "</span> <br>";
		    		$scope.showActiveDomainFilter = true;

		    	}

		    }
		}
		out += "<br>"+ $translate.instant('MANAGEMENT_ACTIVE_FILTER_RESET') +"</div>";
		return out;
	}

	$scope.showActiveTenantFilter = false;
	$scope.unselectedTenantFilter =  function(){
		$scope.showActiveTenantFilter = false;
		var out = "<div class='text-left'>";
		for (var key in $scope.tenantsFilter) {
		    if ($scope.tenantsFilter.hasOwnProperty(key) ) {
		    	if($scope.tenantsFilter[key].checked)
		    		out +=key + " <br>";
		    	else{
		    		out +="<span class='disabled'>" + key + "</span> <br>";
		    		$scope.showActiveTenantFilter = true;

		    	}

		    }
		}
		out += "<br>"+ $translate.instant('MANAGEMENT_ACTIVE_FILTER_RESET') +"</div>";
		return out;
	}

	$scope.showActiveGroupFilter = false;
	$scope.unselectedGroupFilter =  function(){
		$scope.showActiveGroupFilter = false;
		var out = "<div class='text-left'>";
		for (var key in $scope.groupsFilter) {
		    if ($scope.groupsFilter.hasOwnProperty(key) ) {
		    	if($scope.groupsFilter[key].checked)
		    		out +=key + " <br>";
		    	else{
		    		out +="<span class='disabled'>" + key + "</span> <br>";
		    		$scope.showActiveGroupFilter = true;
		    	}

		    }
		}
		out += "<br>"+ $translate.instant('MANAGEMENT_ACTIVE_FILTER_RESET') +"</div>";
		return out;
	}
	var updateSelected = function(action, dataset) {
		//console.log("updateSelected", action, dataset);
		if (action === 'add' && $scope.selectedDatasets.indexOf(dataset) === -1) {
			$scope.selectedDatasets.push(dataset);
		}
		if (action === 'remove' && $scope.selectedDatasets.indexOf(dataset) !== -1) {
			$scope.selectedDatasets.splice($scope.selectedDatasets.indexOf(dataset), 1);
		}
	};

	$scope.canEdit = function() {
		if($scope.selectedDatasets.length==1 && 
				($scope.selectedDatasets[0].datasetType && $scope.selectedDatasets[0].datasetType.datasetType == "dataset" && 
						$scope.selectedDatasets[0].datasetSubtype &&	$scope.selectedDatasets[0].datasetSubtype.datasetSubtype == "bulkDataset")){
			return true;
		}
		return false;
	};

	$scope.canDelete = function() {
		if($scope.selectedDatasets.length==1 && 
				($scope.selectedDatasets[0].datasetType && $scope.selectedDatasets[0].datasetType.datasetType == "dataset" && 
						$scope.selectedDatasets[0].datasetSubtype && $scope.selectedDatasets[0].datasetSubtype.datasetSubtype == "bulkDataset")){
			$scope.deleteDS = true;
			return true;
		}
		return false;
	};

	$scope.editDataset = function(){
		if($scope.selectedDatasets.length===1){
			$location.path('management/editDataset/dataset/'+$scope.tenantCode +'/'+$scope.selectedDatasets[0].datasetcode+"/"+$scope.selectedDatasets[0].iddataset);
		} 
	};
	
	$scope.chooseGroup= function(){
		if($scope.selectedDatasets.length>0){
		var chooseGroupChooseDialogInstance = $modal.open({
    		templateUrl: 'ChooseDatasetGroupDialog.html',
  	      	controller: 'ChooseDatasetGroupDialogCtrl',
  	      	windowClass: 'app-modal-window',
  	      resolve: {
	    	  datasourceList: function(){ return $scope.selectedDatasets;},
			  isStream: function(){return false;},
	    	  groups: function(){return null;},
	    	  createOnSave: function(){return true;}
			  
  	      }


		});
		chooseGroupChooseDialogInstance.result.then(function (selectedGroup) {
			console.log("selectedGroups",selectedGroup);
			$scope.loadDatasets();
			$scope.selectedDatasets = new Array();
//			console.log("selectedDatasets",$scope.selectedDatasets);
//			var datasources = [];
//			for (index=0; index<$scope.selectedDatasets.length;index++){
//				//datasources[index]={"idDatasource":$scope.selectedDatasets[index].iddataset,"datasourceversion":$scope.selectedDatasets[index].version};				
//				datasources[index]={"idDatasource":41531,"datasourceversion":$scope.selectedDatasets[index].version};
//			}
//			console.log("datasourcesForGroup",datasources);
//			var reqDatasetsToGroup = {"idDatasourceGroup":selectedGroup[0].idDatasourcegroup,"datasourcegroupversion":selectedGroup[0].datasourcegroupversion,"datasources":datasources};
//			console.log("reqDatasetsToGroup",reqDatasetsToGroup);
//			adminAPIservice.addDatasetsToGroup(info.getActiveTenant(),reqDatasetsToGroup);
//			});
//			chooseGroupChooseDialogInstance.result.then(function (newGroup) {
//		      	}, function () {console.log('chooseGroupChooseDialogInstance - chooseGroupChooseDialogInstance dismissed ');
		      });
		}
};

/*
 * ADD DATASETS TO GROUP
 */
 $scope.addDatasetsToGroup = function(datasources){
	 adminAPIservice.addDatasetsToGroup(info.getActiveTenant(),datasources).success(function(response) {			
		console.log("addDatasetToGroup SUCCESS", response);
		$scope.loadDatasets();
	}).error(function(response){
		console.error("addDatasetToGroup ERROR", response);
				if(response && response.errorName)
					$scope.admin_response.detail= response.errorName;
				if(response && response.errorCode)
					$scope.admin_response.code= response.errorCode;
	});
};




}]);



appControllers.controller('ManagementDatasetUninstallModalCtrl', [ '$scope', '$location', '$modalInstance', 'adminAPIservice', 'datasource', 'info', 
                                                                   function($scope, $location, $modalInstance, adminAPIservice, datasource, info) {

	console.log("ManagementDatasetUninstallModalCtrl", datasource);
	console.log("ManagementDatasetUninstallModalCtrl", info);
	$scope.ds = datasource; 
	$scope.update = {"loading":false, "status":"", };
	
	$scope.ok = function(){
			
		$scope.update.loading = true;
		
		adminAPIservice.uninstallDataset(info.getActiveTenant(), $scope.dataset).success(function(response) {
			console.log("uninstallDataset SUCCESS", response);
			Helpers.util.scrollTo();
			$scope.admin_response.type = 'success';
			$scope.admin_response.message = 'MANAGEMENT_EDIT_DATASET_DELETE_RESULT_OK';
			$scope.update.loading = false;
			//sharedAdminResponse.setResponse($scope.admin_response);
		}).error(function(response){
			console.error("uninstallDataset ERROR", response);
			$scope.admin_response.type = 'danger';
			$scope.admin_response.message = 'MANAGEMENT_EDIT_DATASET_DELETE_RESULT_KO';
			if(response && response.errorName)
				$scope.admin_response.detail= response.errorName;
			if(response && response.errorCode)
				$scope.admin_response.code= response.errorCode;
			$scope.update.loading = false;
		});
		
	};
	
	$scope.cancel = function () {
	    $modalInstance.dismiss(false);
	};
	$scope.close = function () {
	    $modalInstance.dismiss(true);
	};
}]);


appControllers.controller('ManagementDatasetDeleteDatalModalCtrl', [ '$scope', '$location', '$modalInstance', 'adminAPIservice', 'datasource', 'info', 
    function($scope, $location, $modalInstance, adminAPIservice, datasource, info) {
		console.log("ManagementDatasetDeleteDatalModalCtrl", datasource);
		console.log("ManagementDatasetDeleteDatalModalCtrl", info);
		$scope.ds = datasource; 
		$scope.update = {"loading":false, "status":"", };
		$scope.showDeleteButton = true;
		
		$scope.ok = function(){
		$scope.update.loading = true;
		adminAPIservice.clearDataset(info.getActiveTenant(), $scope.dataset).success(function(response) {
				console.log("clearDataset SUCCESS", response);
				Helpers.util.scrollTo();
				$scope.admin_response.type = 'success';
				$scope.admin_response.message = 'MANAGEMENT_DATASET_MODAL_DELETE_OKMSG';
				//sharedAdminResponse.setResponse($scope.admin_response);
				$scope.update.loading = false;
				$scope.showDeleteButton = false;
			}).error(function(response){
				console.error("clearDataset ERROR", response);
				$scope.admin_response.type = 'danger';
				$scope.admin_response.message = 'MANAGEMENT_DATASET_MODAL_DELETE_KOMSG';
				if(response && response.errorName)
					$scope.admin_response.detail= response.errorName;
				if(response && response.errorCode)
					$scope.admin_response.code= response.errorCode;
				$scope.update.loading = false;
			});
		};
		
		$scope.cancel = function () {
			$modalInstance.dismiss(false);
		};
}]);



appControllers.controller('ManagementDatasetCtrl', [ '$scope', '$route', '$routeParams', '$location', 'adminAPIservice', 'readFilePreview','info', 'sharedDatasource', '$translate','$modal', 'sharedUploadBulkErrors', 'sharedAdminResponse', '$timeout','localStorageService',
             function($scope, $route, $routeParams, $location, adminAPIservice, readFilePreview, info, sharedDatasource,$translate,$modal,sharedUploadBulkErrors,sharedAdminResponse,$timeout,localStorageService) {
	$scope.tenantCode = $route.current.params.tenant_code;
	$scope.currentStep = 'start';
	$scope.wizardSteps = [{'name':'start', 'style':''},
	                      {'name':'requestor', 'style':''},
	                      {'name':'metadata', 'style':''},
	                      {'name':'choosetype', 'style':''},
	                     // {'name':'upload', 'style':''},
	                      {'name':'columns', 'style':''},
	                      ];


	var refreshWizardToolbar = function(){
		var style = 'step-done';
		for (var int = 0; int < $scope.wizardSteps.length; int++) {
			$scope.wizardSteps[int].style = style;
			if($scope.wizardSteps[int].name == $scope.currentStep)
				style = '';
		};
	};

	$scope.admin_response = {};
	$scope.choosenDatasetType='bulk_upload';

	refreshWizardToolbar();

	$scope.columnDefinitionType = "import";
	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};
	
	$scope.isNewDataset = false;
	if($routeParams.entity_code == null || typeof $routeParams.entity_code == 'undefined' || $routeParams.id_datasource == null || typeof $routeParams.id_datasource  == 'undefined' )
		$scope.isNewDataset = true;
	

	$scope.previewLines = [];
	$scope.preview= {components:new Array(),"type":"csv"};
	$scope.previewBinaries = [];
		
	$scope.showUploadButton = true;
	$scope.loadMoreData = function(){
		$scope.showUploadButton = true;
	};
	$scope.VIRTUALENTITY_TYPE_TWITTER_ID = Constants.VIRTUALENTITY_TYPE_TWITTER_ID;

	$scope.admin_response = {};
	var loadedDataset =  null;
	
	var loadDatasource = function(){
		adminAPIservice.loadDatasource(Constants.DATASOURCE_TYPE_DATASET,  info.getActiveTenant(),$routeParams.id_datasource).success(function(response) {
			console.log("LoadDataset", response);
			try{
				$scope.inputDatasource = response;
				if(response && response.externalReference)
					response.externalreference = response.externalReference;
				
				loadedDataset = response;
				$scope.dataset = Helpers.yucca.prepareDatasourceForUpdate(Constants.DATASOURCE_TYPE_DATASET,response);
				$scope.datasetDomain = $scope.inputDatasource.domain['lang'+$translate.use()];
				if (response.apiContexts && response.apiContexts.length>0) {
			    	if(response.apiContexts.includes('odata')) {
			    		$scope.dataset.apiOdataEnabled = true;
			    		$scope.dataset.apiOdata = "odata";
			    	}
		
			    	if(response.apiContexts.includes('odatarupar')) {
			    		$scope.dataset.apiOdataEnabled = true;
			    		$scope.dataset.apiOdata = "odatarupar";
			    	}
			    	
			     	if(response.apiContexts.includes('search')) {
			    		$scope.dataset.apiSearchEnabled = true;
			    		$scope.dataset.apiSearch = "search";
			    	}
			     	
			    	if(response.apiContexts.includes('searchrupar')) {
			    		$scope.dataset.apiSearchEnabled = true;
			    		$scope.dataset.apiSearch = "searchrupar";
			    	}
				}
				
				for (var property in $scope.inputDatasource.subdomain) {
				    if ($scope.inputDatasource.subdomain.hasOwnProperty(property)) {
				        if(property.toLowerCase() == "lang"+$translate.use()){
				        	$scope.datasetSubdomain = $scope.inputDatasource.subdomain[property];
				        	break;
				        }
				    }
				}
				
				//$scope.datasetSubdomain = $scope.inputDatasource.subdomain['lang'+$translate.use()];

				for (var cIndex = 0; cIndex < $scope.dataset.components.length; cIndex++) {
					if(typeof $scope.dataset.components[cIndex].isgroupable == 'undefined')
						$scope.dataset.components[cIndex].isgroupable = false;
					$scope.preview.components.push($scope.dataset.components[cIndex]);
				}
				$scope.newComponent = {sourcecolumn: $scope.preview.components.length+1};
				console.log("LoadDataset prepared", $scope.dataset);
				if(typeof $scope.dataset.idDataset != 'undefined' && $scope.dataset.idDataset !=null)
					$scope.downloadCsvUrl = Constants.API_ODATA_URL+$scope.datasetCode+"/download/"+$scope.dataset.idDataset+ "/all";  
				
				if($scope.user!=undefined && $scope.user.loggedIn==true){
					$scope.dataset.requestername=$scope.user.firstname;
					$scope.dataset.requestersurname=$scope.user.lastname;
					$scope.dataset.requestermail=$scope.user.email;
				}
				//$scope.newField = {sourcecolumn: $scope.dataset.components.length+1};
				console.warn("prima", Helpers.yucca.checkDatasource($scope.dataset));
				if(Helpers.yucca.checkDatasource($scope.dataset)){
					$scope.showHint = true;
					$scope.admin_response.type = 'warning';
					$scope.admin_response.message = 'MANAGEMENT_VIEW_DATASET_WARNING_EDIT_MANDATORY';
				}
					
				console.warn("dopo", $scope.showHint)
				
				

				$scope.originalDataset = JSON.stringify($scope.dataset);
				$scope.datasetReady = true;
				$scope.updateStatus = 'ready';

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
	};
	

	$scope.$on('managementComponentReady', function(e) {  
       $scope.originalDataset = JSON.stringify($scope.dataset);
	 });
	
	var cleanDatasetBeforeUpdate = function(){
		if(Helpers.util.has($scope.dataset, 'opendata') && !$scope.dataset.opendata.isOpenData)
			delete $scope.dataset['opendata'];
		else{
			if(Helpers.util.has($scope.dataset, 'opendata.opendataupdatedate') )	{	
					var date =  new Date( $scope.dataset.opendata.opendataupdatedate);	
					var year = (date.getFullYear()).toString();
					var month = ((date.getMonth()+1) < 10) ? "0" + (date.getMonth()+1) :(date.getMonth()+1);
					var day = ((date.getDate() < 10) ? "0" + date.getDate() :date.getDate()).toString();
					$scope.dataset.opendata.opendataupdatedate= year+month+day;	
			}
		}
		
		
//		if($scope.dataset.opendata && !($scope.dataset.opendata.opendataupdatedate || $scope.dataset.opendata.opendataexternalreference || 
//				$scope.dataset.opendata.lastupdate || $scope.dataset.opendata.opendataauthor || $scope.dataset.opendata.opendatalanguage))
//			delete $scope.dataset['openData'];
//	
		if($scope.dataset.license && $scope.dataset.license.idLicense==null && $scope.dataset.license.description==null && $scope.dataset.license.licensecode==null)
			delete $scope.dataset['license'];

		if($scope.dataset.visibility == 'public')
			delete $scope.dataset['sharingTenants'];
		if($scope.dataset.visibility != 'private')
			delete $scope.dataset['copyright'];
		else
			delete $scope.dataset['license'];
		
		if($scope.dataset.unpublished)
			delete $scope.dataset['dcat'];

		if($scope.dataset.groups){
			for (var i = 0; i < $scope.dataset.groups.length; i++) {
				$scope.dataset.groups[i].idDatasourcegroupType = $scope.dataset.groups[i].type.idDatasourcegroupType;				
			}
		}
			
	};

	$scope.user = info.getInfo().user;

	$scope.datasetReady = false;
	var isClone = false;
	if(!$scope.isNewDataset){
		loadDatasource();
	}
	else{
		var datasourceClone = sharedDatasource.getDatasource();
		if(datasourceClone==null){				
			isClone = false;			
			$scope.dataset = {"datasourceType": Constants.DATASOURCE_TYPE_DATASET,tags: new Array(), groups: new Array(), unpublished: false,visibility: 'private', idTenant:info.getActiveTenant().idTenant};
			$scope.dataset.opendata = {"isOpenData":false};
			console.log("new Dataset start", $scope.dataset);
			$scope.datasetReady = true;
		}
		else{
			isClone = true;
			$scope.dataset = Helpers.yucca.prepareDatasourceForUpdate(Constants.DATASOURCE_TYPE_DATASET,datasourceClone);
			$scope.datasetDomain = $scope.dataset.domaincode;
			delete $scope.dataset.currentDataSourceVersion;
			delete $scope.dataset.datasetname;
			delete $scope.dataset.datasetcode;
			delete $scope.dataset.iddataset;
			if(Helpers.util.has($scope.dataset, "dcat.idDcat"))
				delete $scope.dataset.dcat.idDcat;
			
			cleanDatasetBeforeUpdate();
			if(typeof $scope.dataset.opendata == 'undefined')
				$scope.dataset.opendata = {"isOpenData":false};

			console.log("LoadDataset prepared", $scope.dataset);
			for (var cIndex = 0; cIndex < $scope.dataset.components.length; cIndex++) {
				delete $scope.dataset.components[cIndex].idComponent;
				$scope.preview.components.push($scope.dataset.components[cIndex]);
			}
			$scope.datasetReady = true;
			sharedDatasource.setDatasource(null);

		}
		if($scope.user!=undefined && $scope.user.loggedIn==true){
			$scope.dataset.requestername=$scope.user.firstname;
			$scope.dataset.requestersurname=$scope.user.lastname;
			$scope.dataset.requestermail=$scope.user.email;
		}
	}
	
	

	
	$scope.showHint = false;
	$scope.showHintToggle = function(){
		$scope.showHint = !$scope.showHint;
	};
	

	$scope.provaDire = function(){
		console.log("Dataset", $scope.dataset);
	};
	
	$scope.newBinaryDefinition = {sourceBinary: $scope.previewBinaries.length+1};
	$scope.addBinaryDefinition = function(){
		console.log("addBinaryDefinition",$scope.newBinaryDefinition);
		$scope.insertBinaryErrors = [];

		if($scope.newBinaryDefinition.name==null || $scope.newBinaryDefinition.name=="")
				$scope.insertBinaryErrors.push('MANAGEMENT_NEW_DATASET_ERROR_BINARY_NAME');

		var checkNameDuplicate = false;

		for (var int = 0; int < $scope.previewBinaries.length; int++) {
			if($scope.previewBinaries[int].name == $scope.newBinaryDefinition.name){
				checkNameDuplicate = true;
			}
	}
		
		if(checkNameDuplicate)
			$scope.insertBinaryErrors.push('MANAGEMENT_NEW_DATASET_ERROR_BINARY_NAME_UNIQUE');
		
		if($scope.insertBinaryErrors.length == 0){
			if(!$scope.newBinaryDefinition.alias || $scope.newBinaryDefinition.alias == null || $scope.newBinaryDefinition.alias == ""){
				$scope.newBinaryDefinition.alias = $scope.newBinaryDefinition.name;
			}
			

			$scope.previewBinaries.push($scope.newBinaryDefinition);
			$scope.newBinaryDefinition = {sourceBinary: $scope.previewBinaries.length+1};
		}
	};
	
	$scope.removeBinaryDefinition = function(index){
		$scope.previewBinaries.splice(index,1);
	};
	$scope.cancel = function(){
		$location.path('management/datasets/'+$scope.tenantCode);
	};

	$scope.htmlTooltip = Constants.HELP_HINT_DATE_FORMAT_TABLE;

	$scope.csvInfo = {"separator":";","fileEncoding":"UTF-8","fileType":"csv", selectedFile: null, skipFirstRow:true};

	
	$scope.goToStart  = function(){$scope.currentStep = 'start'; refreshWizardToolbar();};
	$scope.goToRequestor  = function(){ $scope.currentStep = 'requestor';refreshWizardToolbar();};
	$scope.goToMetadata  = function(){ $scope.currentStep = 'metadata';refreshWizardToolbar();};
	$scope.goToChooseType  = function(){
		$scope.csvInfo.selectedFile = null;
		$scope.previewLines = [];
		if(isClone)
			isClone = false;
		else{
			$scope.preview.components = [];
			$scope.previewBinaries = [];
		}
		$scope.dataset.components = [];
		
		
		$scope.currentStep = 'choosetype';refreshWizardToolbar();
	};
	
	$scope.goToColumns  = function(){

		$scope.columnDefinitionType = "import";  
		$scope.isImportDataset = true;
		$scope.currentStep = 'columns';
		refreshWizardToolbar();
	};
	
	$scope.setCsvSkipFirstRow = function(csvSkipFirstRow){
		console.log("setCsvSkipFirstRow",csvSkipFirstRow);
		$scope.csvSkipFirstRow = !csvSkipFirstRow;
	};
	
	$scope.goToCreateColumns  = function(choosen){
		$scope.choosenDatasetType = choosen;
		$scope.columnDefinitionType = "create"; 
		$scope.isImportDataset = false;
		$scope.currentStep = 'columns';
		refreshWizardToolbar();
	};

	 
	var choosenDatasetTypeVar = "";
	
	$scope.chooseDatasetType = function(choosen){
		console.log("choosen",choosen);
		$scope.choosenDatasetType = choosen;

		console.log("$scope.choosenDatasetType",$scope.choosenDatasetType);
		choosenDatasetTypeVar = choosen;
		console.log("$scope.choosenDatasetTypeVar",choosenDatasetTypeVar);

		if(choosen == 'bulk_upload')
			$scope.goToColumns();
		else if(choosen == 'bulk_no_upload'){
			$scope.previewBinaries = [];
			$scope.goToCreateColumns(choosen);
		}
		else{ //if(choosen == 'bulk_no_upload' || choosen == 'binary_no_upload')
			$scope.goToCreateColumns(choosen);
		}
		
	};
	

	$scope.uploadData = function(){
		addData($scope.inputDatasource);
	};
	
	$scope.uploadMultiCsv = function(){
		console.log("$scope.dataset", $scope.dataset)
    	var multiCsvDialogInstance= $modal.open({
	    		templateUrl: 'MultipleUploadCsvDialog.html',
	  	      	controller: 'MultipleUploadCsvDialogCtrl',
	    	    resolve: {
	    	    	csvInfo: function () {return $scope.csvInfo;},
	    	    	loadedDatasource: function () {return $scope.inputDatasource;},
	    	    	componentInfoRequests: function () {return prepareComponentInfoRequests($scope.inputDatasource);},
	    	    	importedfiles: function () {return  $scope.dataset.importedfiles},
	    	    	isNew:  function () {return false;}
	    	    }

    		});
		
		multiCsvDialogInstance.result.then(function() {
			console.log("multiCsvDialogInstance.result")
		}, function() {
			console.log("multiCsvDialogInstance.result 2")
		});
	};
	
	$scope.componentInfoRequests = {"info":new Array()};
	
	$scope.debu = function(){
		console.log("componentInfoRequests", $scope.componentInfoRequests)
		console.log("csvInfo", $scope.csvInfo)
	};
	
	var addData = function(loadedDatasource){
		console.log("addData", loadedDatasource);
		console.log("componentInfoRequests", $scope.componentInfoRequests);
		$scope.updateStatus = 'upload';
		var componentInfoRequests = prepareComponentInfoRequests(loadedDatasource);
			
		adminAPIservice.addDataToDataset(info.getActiveTenant(),loadedDatasource.dataset, $scope.csvInfo,componentInfoRequests).progress(function(evt) {
			console.debug(evt);
			console.debug('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
		}).success(function(data, status, headers, config) {
			$scope.updateStatus = 'finish';
			console.log("data loaded", data);
			//$scope.admin_response.type = 'success';
			//$scope.admin_response.message = 'MANAGEMENT_EDIT_DATASET_ADD_DATA_SAVED_INFO';
			console.log("iiii "+"management/viewDatasource/dataset/"+$scope.tenantCode+"/"+loadedDatasource.dataset.datasetcode +"/" + loadedDatasource.dataset.iddataset);
			if($scope.isNewDataset){
				sharedAdminResponse.setResponse({type:'success', message: 'MANAGEMENT_EDIT_DATASET_ADD_DATA_SAVED_INFO'});
				$location.path("management/viewDatasource/dataset/"+$scope.tenantCode+"/"+loadedDatasource.dataset.datasetcode +"/" + loadedDatasource.dataset.iddataset);
			}
			else{
				$scope.admin_response.type = 'success';
				$scope.admin_response.message = 'MANAGEMENT_EDIT_DATASET_ADD_DATA_SAVED_INFO';
				$scope.admin_response.details = null;
				Helpers.util.scrollTo();
			}
		}).error(function(response){
			$scope.updateStatus = 'ready';
			console.error("addDataToDataset ERROR", response);
			if($scope.isNewDataset){
				sharedAdminResponse.setResponse({type:'danger', message: 'MANAGEMENT_EDIT_DATASET_SAVED_OK_ADD_DATA_FAILED', details: response.args});
				console.warn("redirect to -> " +  "#/management/viewDatasource/dataset/"+$scope.tenantCode+"/"+loadedDatasource.dataset.datasetcode +"/" + loadedDatasource.dataset.iddataset);
				$location.path("management/viewDatasource/dataset/"+$scope.tenantCode+"/"+loadedDatasource.dataset.datasetcode +"/" + loadedDatasource.dataset.iddataset);
			} else{
				$scope.admin_response.type = 'danger';
				$scope.admin_response.message = 'MANAGEMENT_EDIT_DATASET_ADD_DATA_ERROR';
				$scope.admin_response.details =  response.args;
				if(response && response.errorName)
					$scope.admin_response.detail= response.errorName;
				if(response && response.errorCode)
					$scope.admin_response.code= response.errorCode;
				Helpers.util.scrollTo();
			}

		});
		
	};
	
	var prepareComponentInfoRequests = function(loadedDatasource){
		var componentInfoRequests  = new Array(); 
		if($scope.componentInfoRequests.info.length==0){  // new dataset
			for (var cIndex = 0; cIndex < loadedDatasource.components.length; cIndex++) {
				for (var pIndex = 0; pIndex < $scope.preview.components.length; pIndex++) {
					var c = loadedDatasource.components[cIndex];
					var p = $scope.preview.components[pIndex];
					if(p.name == c.name){
						componentInfoRequests.push({"numColumn": p.sourcecolumn-1, "dateFormat": p.dateTimeFormat,"decimalSeparator": p.decimalSeparator, "skipColumn": p.skipColumn, "idComponent": c.idComponent});
						if(Helpers.util.has(p, "dateTimeFormat"))
							localStorageService.set("addCSvDateFormat_"+c.idComponent, p.dateTimeFormat);

						if(Helpers.util.has(p, "decimalSeparator"))
							localStorageService.set("addCSvDecimalSeparator_"+c.idComponent, p.decimalSeparator);
						//var isDate = c.idDataType == Constants.COMPONENT_DATA_TYPE_DATETIME;
						//$scope.componentInfoRequests.info.push({"numColumn": p.sourcecolumn-1, "dateFormat": p.dateTimeFormat, "skipColumn": p.skipColumn, "idComponent": c.idComponent,  "isDate": isDate, "name": c.name, "idDataType": c.idDataType});
						break;
					}
				}
			}
		}
		else{ // add data
			for (var cIndex = 0; cIndex < $scope.componentInfoRequests.info.length; cIndex++) {
				var c = $scope.componentInfoRequests.info[cIndex];
				componentInfoRequests.push({"numColumn": c.numColumn, "dateFormat":  c.dateFormat, "decimalSeparator": c.decimalSeparator, "skipColumn": c.skipColumn, "idComponent": c.idComponent});
//				if(Helpers.util.has(c, "dateFormat") && c.dateFormat!=null)
//					localStorageService.set("addCSvDateFormat_"+loadedDatasource.dataset.datasetcode+"_"+c.numColumn, c.dateFormat);
//				if(Helpers.util.has(c, "decimalSeparator"))
//					localStorageService.set("addCSvDecimalSeparator_"+loadedDatasource.dataset.datasetcode+"_"+c.numColumn, p.decimalSeparator);
				if(Helpers.util.has(c, "dateFormat") && c.dateFormat!=null)
					localStorageService.set("addCSvDateFormat_"+c.idComponent, c.dateFormat);
				if(Helpers.util.has(c, "decimalSeparator"))
					localStorageService.set("addCSvDecimalSeparator_"+c.idComponent, c.decimalSeparator);
			}
		}
		
		return componentInfoRequests;
	};
	
	$scope.isMultiUpload= function(){
		return $scope.csvInfo.selectedFile && Constants.BULK_DATASET_MAX_FILE_SIZE_FOR_SPLIT < $scope.csvInfo.selectedFile.size;
	};
	
	$scope.downloadCsvParts = function() {
		readFilePreview.readTextFile($scope.csvInfo.selectedFile,$scope.csvInfo.selectedFile.size, $scope.fileEncoding).then(
			function(contents){
				var lines = contents.split(/\r\n|\n|\r/g);
				console.log("nr righe", lines.length);
				var numByteForRow = $scope.csvInfo.selectedFile.size/lines.length;
				console.log("numByteForRow", lines.numByteForRow);
				var numLinesInPart = Math.floor(Constants.BULK_DATASET_MAX_FILE_SIZE_FOR_SPLIT/numByteForRow);
				console.log("numLinesInPart", numLinesInPart);
				var csvParts = Helpers.util.splitCsvFile(lines, numLinesInPart, $scope.csvInfo.selectedFile.name);
				console.log("csvParts",csvParts);
				Helpers.util.downloadMultiCSV(csvParts);
			}, 
			function(error){
				$scope.uploadDatasetError = {error_message: error, error_detail: ""};
				Helpers.util.scrollTo();
			}
		);
	};
	
	$scope.updateStatus = 'ready';

	$scope.admin_response = {details: new Array()};
	


	$scope.createDataset = function() {
		console.log("create", $scope.dataset);
		$scope.admin_response = {details: new Array()};

		var hasErrors = false;
		
		if(!$scope.dataset.components || $scope.dataset.components==null || $scope.dataset.components == 0){
			$scope.admin_response.type = 'warning';
			$scope.admin_response.message = 'MANAGEMENT_NEW_DATASET_WARNING_TITLE';
			$scope.admin_response.details.push('MANAGEMENT_NEW_DATASET_WARNING_NO_COLUMN');

			$scope.dataset.components = [];
			hasErrors =true;
		}
		console.log("$scope.choosenDatasetType ",$scope.choosenDatasetType );
		console.log("$scope.previewBinaries ",$scope.previewBinaries );
		console.log("$scope.previewBinaries.length ",$scope.previewBinaries.length );
		if($scope.choosenDatasetType == 'binary_no_upload' && $scope.previewBinaries.length==0){
			$scope.admin_response.type = 'warning';
			$scope.admin_response.message = 'MANAGEMENT_NEW_DATASET_WARNING_TITLE';
			$scope.admin_response.details.push('MANAGEMENT_NEW_DATASET_WARNING_NO_BINARY');
			hasErrors =true;
		}
		
		var startSourceColumn = $scope.dataset.components.length +1;
		for (var i = 0; i < $scope.previewBinaries.length; i++) {
			var fileDef = $scope.previewBinaries[i];
			$scope.dataset.components.push(
					{"sourcecolumn":(startSourceColumn + i), 
						"name":fileDef.name, 
						"alias":fileDef.alias, 
						"idDataType": Constants.COMPONENT_DATA_TYPE_BINARY, 
						"iskey":0, 
						"inorder":(startSourceColumn + i -1)}
					);
		}
		
		cleanDatasetBeforeUpdate();
		
		console.log("dataset dopo binary ", $scope.dataset);
		$scope.dataset.apiContexts = [];
		if($scope.dataset.apiOdataEnabled)
			$scope.dataset.apiContexts.push($scope.dataset.apiOdata);
		if($scope.dataset.apiSearchEnabled)
			$scope.dataset.apiContexts.push($scope.dataset.apiSearch);
		console.log("dataset ready", $scope.dataset);
		if(!hasErrors){
			$scope.updateStatus = 'update';
			adminAPIservice.createDataset(info.getActiveTenant(), $scope.dataset).success(function(response) {
				console.log("createDataset SUCCESS", response);
				$scope.dataset.iddataset=response.iddataset;
				$scope.dataset.datasetcode=response.datasetcode;
				$scope.dataset.datasetname=response.datasetname;

				$scope.admin_response= {};
				$scope.admin_response.type = 'success';
				$scope.admin_response.message = 'MANAGEMENT_EDIT_DATASET_SAVED_INFO';
				if($scope.columnDefinitionType == "import"){
					console.log("adding data");
					$scope.updateStatus = 'upload'; 

					adminAPIservice.loadDatasource(Constants.DATASOURCE_TYPE_DATASET, info.getActiveTenant(),$scope.dataset.iddataset).success(function(response2) {
						var multiCsvDialogInstance= $modal.open({
				    		templateUrl: 'MultipleUploadCsvDialog.html',
				  	      	controller: 'MultipleUploadCsvDialogCtrl',
				    	    resolve: {
				    	    	csvInfo: function () {return $scope.csvInfo;},
				    	    	loadedDatasource: function () {return response2},
				    	    	componentInfoRequests: function () {return prepareComponentInfoRequests(response2);},
				    	    	importedfiles: function () {return  null},
				    	    	isNew: function(){return true;}
				    	    }

			    		});
						
						multiCsvDialogInstance.result.then(function() {
							console.log("multiCsvDialogInstance.result",'/management/viewDatasource/dataset/'+$scope.tenantCode+"/"+response.datasetcode+"/"+response.iddataset)
							$location.path('/management/viewDatasource/dataset/'+$scope.tenantCode+"/"+response.datasetcode+"/"+response.iddataset);
						}, function() {
							console.log("multiCsvDialogInstance.result 2",'/management/viewDatasource/dataset/'+$scope.tenantCode+"/"+response.datasetcode+"/"+response.iddataset)
							$location.path('/management/viewDatasource/dataset/'+$scope.tenantCode+"/"+response.datasetcode+"/"+response.iddataset);
						});

						//addData(response2);
					}).error(function(result){
						console.error("addData - loadDataset ",result);
						sharedAdminResponse.setResponse({type:'danger', message: 'MANAGEMENT_EDIT_DATASET_SAVED_OK_ADD_DATA_FAILED'});
						$location.path('/management/viewDatasource/dataset/'+$scope.tenantCode+"/"+response.datasetcode+"/"+response.iddataset);
					});
				}
				else{
					sharedAdminResponse.setResponse($scope.admin_response);
					$location.path('/management/viewDatasource/dataset/'+$scope.tenantCode+"/"+response.datasetcode+"/"+response.iddataset);

					$scope.updateStatus = 'update';
				}
				Helpers.util.scrollTo();

			}).error(function(response){
				$scope.updateStatus = 'ready';
				console.error("createDataset ERROR", response);
				$scope.admin_response.type = 'danger';
				$scope.admin_response.message = 'MANAGEMENT_EDIT_DATASET_SAVE_ERROR';
				if(response && response.errorName)
					$scope.admin_response.detail= response.errorName;
				if(response && response.errorCode)
					$scope.admin_response.code= response.errorCode;
				Helpers.util.scrollTo();

			});

			
		}
		else{
			$scope.updateStatus = 'ready';
			Helpers.util.scrollTo();
		}

	};	
	
	/*
	 * UPDATE DATASET
	 */
	$scope.updateDataset = function() {
		
		if(!$scope.dataset.components || $scope.dataset.components.length==0){
			$scope.updateWarning = true;
			$scope.warningMessages.push("MANAGEMENT_EDIT_STREAM_WARNING_NO_COMPONENTS");
		}
		
		
		console.debug("---------- original -----------------");
		console.debug($scope.originalDataset);
		console.debug("---------- new -----------------");
		console.debug(JSON.stringify($scope.dataset));

		if($scope.originalDataset == JSON.stringify($scope.dataset)){
			console.log("uguali");
			console.log("updateDataset - no change");
			var modalInstance = $modal.open({
				animation : true,
				templateUrl : 'confirmDialog.html',
				controller : 'ConfirmDialogCtrl',
				backdrop  : 'static',
				resolve: { 
					question: function () {
						return {"title":"MANAGEMENT_EDIT_DATASOURCE_NO_CHANGE_CONFIRM_TITLE","message":"MANAGEMENT_EDIT_DATASOURCE_NO_CHANGE_CONFIRM_MESSAGE"};
					}
				}
			});

			modalInstance.result.then(function() {
				console.log("confirm Update");
				confirmUpdateDataset();
			}, function() {
			});
		}		
		else{
			console.log("diversi");
			confirmUpdateDataset();
		}
		
//		if($scope.originalDataset == JSON.stringify($scope.dataset)){
//			console.log("updateDataset - no change");
//				$scope.openConfirmDialog = function(){
//				var modalInstance = $modal.open({
//					animation : $scope.animationsEnabled,
//					templateUrl : 'confirmDialog.html',
//					controller : 'ConfirmDialogCtrl',
//					backdrop  : 'static',
//					resolve: { 
//						question: function () {
//							return {"title":"Sicuro","message":"ciao"};
//						}
//					}
//				});
//
//				modalInstance.result.then(function() {
//					console.log("confirm Update");
//					confirmUpdateDataset();
//				}, function() {
//				});
//			};
//			
//		}
//		else{
//			confirmUpdateDataset();
//		}
		
	};
	
	var confirmUpdateDataset = function(){
		$scope.dataset.name=$scope.dataset.datasetname;
		
		$scope.dataset.apiContexts = [];
		if($scope.dataset.apiOdataEnabled)
			$scope.dataset.apiContexts.push($scope.dataset.apiOdata);
		if($scope.dataset.apiSearchEnabled)
		$scope.dataset.apiContexts.push($scope.dataset.apiSearch);
		
		cleanDatasetBeforeUpdate();
		if(loadedDataset != null && Helpers.yucca.deleteDcatId(loadedDataset.dcat, $scope.dataset.dcat))
			delete $scope.dataset.dcat.idDcat;
		
//		if($scope.dataset.opendata && !($scope.dataset.opendata.opendataupdatedate || $scope.dataset.opendata.opendataexternalreference || 
//				$scope.dataset.opendata.lastupdate || $scope.dataset.opendata.opendataauthor || $scope.dataset.opendata.opendatalanguage))
//			delete $scope.dataset['openData'];
//	
//		if($scope.dataset.license && $scope.dataset.license.description==null && $scope.dataset.license.licesecode==null)
//			delete $scope.dataset['license'];
//
//		if($scope.dataset.visibility == 'public')
//			delete $scope.dataset['sharingTenants'];
//		if($scope.dataset.visibility != 'private')
//			delete $scope.dataset['copyright'];
//		else
//			delete $scope.dataset['license'];
		
		console.log("updateDataset - dataset", $scope.dataset);
		
		$scope.admin_response = {};
		$scope.updateStatus = 'update';
		adminAPIservice.updateDataset(info.getActiveTenant(), $scope.dataset).success(function(response) {
			console.log("updateDataset SUCCESS", response);
			Helpers.util.scrollTo();
			//$scope.updateStatus = 'finish';
			$scope.admin_response.type = 'success';
			$scope.admin_response.message = 'MANAGEMENT_EDIT_DATASET_DATA_SAVED_INFO';
			sharedAdminResponse.setResponse($scope.admin_response);
			$scope.preview.components = [];
			$scope.previewBinaries = [];
			loadDatasource();

		}).error(function(response){
			console.error("updateDataset ERROR", response);
			$scope.updateStatus = 'start';

			Helpers.util.scrollTo();
			$scope.admin_response.type = 'danger';
			$scope.admin_response.message = 'MANAGEMENT_EDIT_DATASET_SAVE_ERROR';
			if(response && response.errorName)
				$scope.admin_response.detail= response.errorName;
			if(response && response.errorCode)
				$scope.admin_response.code= response.errorCode;
		});
	}
	
} 
]);

appControllers.controller('ManagementDatasetGroupsListCtrl', [ '$scope', '$route', '$location', 'adminAPIservice', 'info', '$modal', '$translate','YUCCA_PORTAL',
                                                         function($scope, $route, $location, adminAPIservice, info, $modal, $translate, YUCCA_PORTAL) {
	$scope.tenantCode = $route.current.params.tenant_code;
	$scope.showLoading = true;

	$scope.groupList = [];
	$scope.filteredGroupsList = [];
	$scope.nameFilter = null;
	$scope.typeFilter = null;

	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.groupList.length;
	$scope.predicate = '';

	console.log("isOwner", info.isOwner( $scope.tenantCode));
	console.log("info", info);
	
	$scope.organizationCode = info.getActiveTenant().organization.organizationcode;
	
	$scope.yuccaPortal = YUCCA_PORTAL;
	
	

	$scope.isOwner = function(){
		return info.isOwner( $scope.tenantCode);
	};
	
	$scope.admin_response = {};

	
	/*
	 * LOAD GROUPS
	 */
	 $scope.loadGroups = function(){
		 $scope.showLoading = false;
		 $scope.admin_response = {};
		 $scope.groupList = new Array();
		 adminAPIservice.loadDatasetGroups(info.getActiveTenant()).success(function(response) {
			console.log("loadGroups SUCCESS", response);
			$scope.showLoading = false;
			
			for (var i = 0; i <response.length; i++) {				
				$scope.groupList.push(response[i]);	
			}			
	
			$scope.totalItems = $scope.groupList.length;
			$scope.groupList.sort(function(a, b) { 
			    return ((a.name > b.name) ? 1 : ((a.name < b.name) ? -1 : 0));
			});
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


	$scope.loadGroups();

	$scope.searchNameFilter = function(datasetGroup) {
		var keyword = new RegExp($scope.nameFilter, 'i');
		return !$scope.nameFilter || (datasetGroup.name && keyword.test(datasetGroup.name));
	};

	$scope.searchTypeFilter = function(datasetGroup) {
		var keyword = new RegExp($scope.typeFilter, 'i');
		return !$scope.typeFilter || (datasetGroup.type.description && keyword.test(datasetGroup.type.description));
	};

	
	$scope.newGroup= function(){
		var newGroupChooseDialogInstance = $modal.open({
    		templateUrl: 'DatasetGroupDialog.html',
  	      	controller: 'ManageDatasetGroupDialogCtrl',
  	      	size: 'sm',
    	    resolve: {
    	    	group: function () {return null;},
    	    }

		});
		newGroupChooseDialogInstance.result.then(function () {
				console.log("group created");
				$scope.loadGroups();
	      	}, function () {console.log('newGroupChooseDialog - newGroupChoose dismissed ');
	      });
	};

	$scope.editGroup= function(group){
		var editGroupChooseDialogInstance = $modal.open({
    		templateUrl: 'DatasetGroupDialog.html',
  	      	controller: 'ManageDatasetGroupDialogCtrl',
  	      	size: 'sm',
    	    resolve: {
    	    	group: function () {return group},
    	    }

		});
		
		editGroupChooseDialogInstance.result.then(function (editGroup) {
					console.log("group modified");
					$scope.loadGroups();
		      	}, function () {console.log('editGroupChooseDialog - editGroupChoose dismissed ');
		      });
	};
	
	$scope.deleteDatasetsFromGroup= function(group, isStream){
		var deleteDatasetsChooseDialogInstance = $modal.open({
    		templateUrl: 'ChooseDatasetsDialog.html',
  	      	controller: 'DeleteDatasetFromGroupDialogCtrl',
  	      	size: 'lg',
    	    resolve: {
    	    	group: function () {return group},
    	  	  	isStream: function(){return isStream;}
    	    }

		});
	
		deleteDatasetsChooseDialogInstance.result.then(function (editGroup) {
					console.log("datasets deleted");
					//$scope.loadGroups();
		      	}, 
		      	function (result) {
		      		console.log('editGroupChooseDialog - editGroupChoose dismissed ', result);
//		      		if(result == 'goToDatasourceList'){
//		      			console.log(".. ", '#/management/streams/'+ info.getActiveTenant().tenantcode);
//		      			if(isStream)
//		      				$location.path('management/streams/'+ info.getActiveTenant().tenantcode).search({datasetGroup : group.name});
//		      			else
//		      				$location.path('management/datasets/'+ info.getActiveTenant().tenantcode).search({datasetGroup : group.name});
//		      		}
//		      		else if(result == 'datasourceDetailUrl'){
//		      			console.log(".. ", url);
//		      			$location.path(url);
//		      		}
		      	});
	};
	
	$scope.specialDatasourceGroupLetterIcon = function(groupTypeId){
		var letterIcon = $translate.instant('DATASOURCEGROUP_LETTER_ICON_'+groupTypeId);
		if(typeof letterIcon != 'undefined' && letterIcon!=null && letterIcon !='DATASOURCEGROUP_LETTER_ICON_'+groupTypeId)
			return letterIcon;
		else
			return "\u00A0";
	};

	/*
	 * DELETE GROUP
	 */
	 $scope.deleteGroup = function(group){
		 $scope.admin_response={};
		 adminAPIservice.deleteGroup(info.getActiveTenant(),group.idDatasourcegroup).success(function(response) {			
			console.log("deleteGroup SUCCESS", response);
			console.log("deleteGroupActive",info.getActiveTenant());
			$scope.loadGroups();
		}).error(function(response){
			console.error("deleteGroup ERROR", response);
			$scope.admin_response = {type: "danger", message: "ERROR_TITLE"};
			if(response && response.errorName)
				$scope.admin_response.detail= response.errorName;
			if(response && response.errorCode)
				$scope.admin_response.code= response.errorCode;
		});
	};
	
	/*
	 * ACTION ON GROUP
	 */
	 $scope.actionOnGroup = function(group, action){
		 var action = {"action":action};
		 $scope.admin_response={};
		 adminAPIservice.actionOnGroup(info.getActiveTenant(),group.idDatasourcegroup,action).success(function(response) {			
			console.log("actionOnGroup SUCCESS", response);
			$scope.loadGroups();
		}).error(function(response){
			console.error("actionOnGroup ERROR", response);
			$scope.admin_response = {type: "danger", message: "ERROR_TITLE"};
			if(response && response.errorName)
				$scope.admin_response.detail= response.errorName;
			if(response && response.errorCode)
				$scope.admin_response.code= response.errorCode;
		});
	};
	
	
//	/*
//	 * NEW VERSION GROUP
//	 */
//	 $scope.newVersionGroup = function(group){
//		 var action = {"action":"new_version"};
//		 $scope.admin_response={};
//		 adminAPIservice.newVersionGroup(info.getActiveTenant(),group.idDatasourcegroup,action).success(function(response) {			
//			console.log("newVersionGroup SUCCESS", response);
//			$scope.loadGroups();
//		}).error(function(response){
//			console.error("newVersionGroup ERROR", response);
//			$scope.admin_response = {type: "danger", message: "ERROR_TITLE"};
//			if(response && response.errorName)
//				$scope.admin_response.detail= response.errorName;
//			if(response && response.errorCode)
//				$scope.admin_response.code= response.errorCode;
//		});
//	};
//	
//	/*
//	 * CONSOLIDATE GROUP
//	 */
//	 $scope.consolidateGroup = function(group){
//		console.log("consolidateGroup",group);
//		$scope.admin_response={};
//		 var action = {"action":"consolidate"};
//		 adminAPIservice.consolidateGroup(info.getActiveTenant(),group.idDatasourcegroup,action).success(function(response) {			
//			console.log("consolidateGroup SUCCESS", response);
//			$scope.loadGroups();
//		}).error(function(response){
//			$scope.admin_response = {type: "danger", message: "ERROR_TITLE"};
//			console.error("consolidateGroup ERROR", response);
//			if(response && response.errorName)
//				$scope.admin_response.detail= response.errorName;
//			if(response && response.errorCode)
//				$scope.admin_response.code= response.errorCode;
//		});
//	};
//	
	/*
	 * VIEW DATASET GROUP
	 */
//	 $scope.viewDatasetGroup = function(group){
//		console.log("viewDatasetGroup",group);		
//		$location.path('management/datasets/'+ info.getActiveTenant().tenantcode).search({datasetGroup : group.name});
//		
//	};
}]);





appControllers.controller('MultipleUploadCsvDialogCtrl', [ '$scope', '$modalInstance', 'readFilePreview',  'adminAPIservice', 'info', 'csvInfo', 'loadedDatasource','componentInfoRequests', 'importedfiles', 'isNew',
    function($scope, $modalInstance, readFilePreview, adminAPIservice, info, csvInfo, loadedDatasource,componentInfoRequests, importedfiles, isNew) {

	//$scope.csvInfo = csvInfo;
	$scope.admin_multiple_response = {};
	$scope.updateMultipleStatus = 'loading';
	$scope.isNew = isNew;
	console.log("isNew", isNew);
	
	var files;
	readFilePreview.readTextFile(csvInfo.selectedFile,csvInfo.selectedFile.size, csvInfo.fileEncoding).then(
			function(contents){
				var lines = contents.split(/\r\n|\n|\r/g);
				var numByteForRow = csvInfo.selectedFile.size/lines.length;
				var numLinesInPart = Math.floor(Constants.BULK_DATASET_MAX_FILE_SIZE_FOR_SPLIT/numByteForRow);
				files = Helpers.util.splitCsvFile(lines, numLinesInPart, csvInfo.selectedFile.name);
				if(files.length==1){
					files[0].name = files[0].name.replace("_part000","");
				}
				$scope.csvParts = new Array();
				for (var i = 0; i < files.length; i++) {
					var status = getStatus(files[i].name);
					$scope.csvParts.push({
						"status": status, 
						"info":{skipFirstRow: (i==0?csvInfo.skipFirstRow:false),
								fileEncoding: csvInfo.fileEncoding,
								separator: csvInfo.separator,
								selectedFile:  files[i]
							}
					});
				}
				console.log("$scope.csvParts", $scope.csvParts);
				$scope.updateMultipleStatus = 'ready';
			}, 
			function(error){
				$scope.admin_multiple_response = {error_message: error, error_detail: ""};
			}
		);

	var getStatus = function(filename){
		var status = "ready";
		if(typeof importedfiles != 'undefined' && importedfiles!=null && importedfiles.length>0){
			for (var i = 0; i < importedfiles.length; i++) {
				if(importedfiles[i] == filename){
					status = "imported";
					break;
				}
			}
		}
		return status;
	}
	
	
	var csvPartsToUpload = new Array();
	
	$scope.downloadCsvParts  = function(){
		if(files)
			Helpers.util.downloadMultiCSV(files);
	}
	
	$scope.uploadAll = function(){
		console.log("updateAll");
		csvPartsToUpload = new Array();
		$scope.onefailed = false;
		for (var i = 0; i < $scope.csvParts.length; i++) {
			if($scope.csvParts[i].status == 'ready' || $scope.csvParts[i].status == 'failed' || $scope.csvParts[i].status == 'imported'){
				$scope.csvParts[i].status = "pending";
				csvPartsToUpload.push({"index":i, csvPart:$scope.csvParts[i]});
			}
		}
		if(csvPartsToUpload.length== 0)
			$scope.admin_multiple_response = {"type":"warning", "message": "MANAGEMENT_UPLOAD_CSV_MULTIPLE_NO_PARTS_TO_UPLOAD"};
		else
			uploadPart();
	};
	
	$scope.uploadSingle = function(index){

		console.log("uploadSingle", index);
		$scope.onefailed = false;
		csvPartsToUpload = new Array();
		csvPartsToUpload.push({"index":index, csvPart:$scope.csvParts[index]});
		uploadPart();
	}
	
	$scope.onefailed = false;
	
	var uploadPart = function(){
		$scope.admin_multiple_response = {};
		$scope.updateMultipleStatus = 'uploading';
		if(csvPartsToUpload.length>0){
			var csvPart  = csvPartsToUpload.shift();
			
			$scope.csvParts[csvPart.index].status = "uploading";
			adminAPIservice.addDataToDataset(info.getActiveTenant(),loadedDatasource.dataset,csvPart.csvPart.info,componentInfoRequests).success(function(data, status, headers, config) {
				console.log("data loaded", data);
				$scope.updateMultipleStatus = 'ready';
				$scope.csvParts[csvPart.index].status = "success";
				uploadPart();
			}).error(function(response){
				$scope.onefailed = true;

				$scope.updateMultipleStatus = 'ready';
				$scope.csvParts[csvPart.index].status = "failed";
				for (var i = csvPart.index+1; i < $scope.csvParts.length; i++) {
					$scope.csvParts[i].status = getStatus($scope.csvParts[i].info.selectedFile.name);
				}
				console.error("addDataToDataset ERROR", response);
				$scope.admin_multiple_response.type = 'danger';
				$scope.admin_multiple_response.message = 'MANAGEMENT_EDIT_DATASET_ADD_DATA_ERROR';
				if(response.args && response.args.length>0){
					$scope.admin_multiple_response.details = response.args.slice(0, 5);
					
				}
				
			});
		}
};
	
	$scope.cancel = function () {$modalInstance.dismiss('cancel');};
}]);

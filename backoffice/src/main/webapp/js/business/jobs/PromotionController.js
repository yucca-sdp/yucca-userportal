/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */

appControllers.controller('PromotionCtrl', [ '$scope', "$route", 'adminAPIservice', '$translate', '$interval' , '$timeout',
                                           function($scope, $route, adminAPIservice, $translate, $interval, $timeout) {
		
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
	
	/*
	 * LOAD DATASETS
	 */
	$scope.bigMessage = {};
	
	
	
	$scope.loadDatasets = function(){
		
		var datasets = $scope.datasetsStr.split(",").map(Number);
		console.log("Datasets",datasets);
		
		$scope.datasetsList = [];
		$scope.lastTenantUsed = $scope.tenantForDataset;
		$scope.datasetListFiltered = [];

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
			$scope.totalItems = $scope.datasetsList.length;
			
			for(index = 0; index < $scope.datasetsList.length; index++){
				if	(datasets.indexOf($scope.datasetsList[index].dataset.iddataset) > -1){
					$scope.datasetListFiltered.push($scope.datasetsList[index])
				}
			}
			console.log("DatasetsFiltered",$scope.datasetListFiltered);
			
		}).error(function(response) {
			console.log("loadDatasets - error",response);
			$scope.$parent.showMessage("danger", "UNEXPECTED_ERROR", "UNEXPECTED_ERROR_MESSAGE", "Detail: "+response);
			$scope.showLoading = false;
			$scope.lastTenantUsed = null;
		});
	};
	
	var warningAvailableHiveIsTransformed = function(dataset){
		if (!dataset.availablehive && dataset.istransformed) return true;
		else return false;
	}
	
	var warningHiveDbHiveTable = function(dataset){
		if (!dataset.dbhivetable && !dataset.dbhiveschema) return true;
		else return false;
	}
	
	
	var initRow = function(datasetIn){
		var row = {};
		row.dataset = datasetIn.dataset;
		row.dataset.visibility = datasetIn.visibility; 
		row.dataset.status = datasetIn.status; 
		row.dataset.tenantManager = datasetIn.tenantManager; 
		row.statusIcon = Helpers.stream.statusIcon(datasetIn);
		row.deploymentStatusCodeTranslated =  $translate.instant(datasetIn.status.statuscode);
		row.isSelected = false;
		row.isUpdating = false;
		row.updated = false;
		//row.ellipseNameLimit = 34-row.dataset.datasetcode.length;
		row.ellipseNameLimit = 15;
		row.version=datasetIn.version;
		return row;
	}
	
	$scope.datasetIconUrl= function(organizationCode, idstream){	
		return Constants.API_ADMIN_STREAMS_URL+"/"+idstream+"/icon?organizationCode="+organizationCode;
	};
		
	$scope.searchCodeFilter = function(row) {
		var keyword = new RegExp($scope.filter.codeFilter, 'i');
		return !$scope.filter.codeFilter || keyword.test(row.dataset.datasetcode);
	};

	$scope.$watch('filter.codeFilter', function(newCode) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
	});

	
	$scope.searchNameFilter = function(row) {
		var keyword = new RegExp($scope.nameFilter, 'i');
		return !$scope.nameFilter || keyword.test(row.dataset.datasetname);
	};

	$scope.$watch('nameFilter', function(newName) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
	});

	
	$scope.searchStatusFilter = function(row) {
		var keyword = new RegExp($scope.filter.statusFilter, 'i');
		return !$scope.filter.statusFilter || keyword.test(row.dataset.status.statuscode) || keyword.test(row.deploymentStatusCodeTranslated);
	};

	$scope.$watch('filter.statusFilter', function(newStatus) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredDatasetsList.length;
	});
	

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
	
	$scope.enableExecuteButton = function(){
		
		return( "result", $scope.tenantForDataset && $scope.projectCode && $scope.operationCode && $scope.datasetsStr);
	}
	
	$scope.infoBda = true;
	$scope.addBdaUniqueId = true;
	
	
	
		
	
	$scope.datasetsToUpdateStr = null;
	
	
	$scope. callOoziePromotion = function(){
		

		var datasetsToUpdate = new Array();		
		for (var i = 0; i < $scope.datasetsList.length; i++) {
			if($scope.datasetsList[i].isSelected ){
				datasetsToUpdate.push($scope.datasetsList[i].dataset.iddataset);
			}
		}
		$scope.datasetsToUpdateStr = datasetsToUpdate.join();
			
			
		  var tenant =  $scope.tenantForDataset;
			var operationCode = $scope.operationCode;
			var eleIds =  $scope.datasetsToUpdateStr;
			var addBdaInfo = $scope.infoBda;
			var addBdaUniqueId = $scope.addBdaUniqueId;
			var prjName  = $scope.projectCode;		
			
			var actionOozieRequest = {
				"action": "promotion",
				"tenantCode":tenant ,
				"operationCode":operationCode ,
				"eleIds":eleIds ,
				"addBdaInfo":addBdaInfo ,
				"addBdaUniqueId":addBdaUniqueId ,
				"prjName":prjName 
				
			}
			
			console.log("actionOozieRequest",actionOozieRequest);
			
			adminAPIservice.callOoziePromotion(actionOozieRequest).success(function(response) {
				console.info("callOoziePromotion - response",response);	
				
				var oozieProcessId = response.id;
				
							
				$scope.idInterval = $interval( function(){ $scope.callOozieInfo(oozieProcessId); }, 5000);
							
			}).error(function(response) {
				console.error("callOoziePromotion ERROR ",response);	
			});
		}
	
	
	
		$scope. callOozieInfo = function(OozieProcessId){
			adminAPIservice.callOozieInfo(OozieProcessId).success(function(response) {
				console.info("callOozieInfo - response",response);
				
				$scope.oozieInfo = response;
				$scope.oozieConnect = 'ok';
				$scope.pingpongStyle  = "pulse";	
				$timeout(function(){$scope.pingpongStyle  = "";},1000);
				
				if(!$scope.$$phase) {
					$scope.$apply();
				}
				
				
				console.log("callOozieInfo - status",$scope.oozieInfo.status);
				
				if($scope.oozieInfo.status == Constants.OOZIE_STATUS_SUCCESS || $scope.oozieInfo.status == Constants.OOZIE_STATUS_FAILED  ||  $scope.oozieInfo.status == Constants.OOZIE_STATUS_KILLED ) {
					$interval.cancel($scope.idInterval);
					//$scope.oozieConnect  = "finish";
					$scope.pingpongStyle  = "";
				}
				
				
			}).error(function(response) {
				console.error("callOozieInfo ERROR ",response);	
			});
			
			
		}
		


} ]);


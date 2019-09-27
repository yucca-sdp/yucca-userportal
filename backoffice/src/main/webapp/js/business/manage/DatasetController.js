/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */

appControllers.controller('DatasetCtrl', [ '$scope', "$route", 'adminAPIservice', '$translate', '$modal', '$timeout' ,
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
		
		//20171023 - Modificata chiamata a nuovo metodo loadTenants per nuove API
		
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
	 * LOAD STREAMS
	 */
	$scope.bigMessage = {};
	
	$scope.loadDatasets = function(){
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

	var datasetToWorks = new Array(); 

	$scope.uninstallAll = function(){
		console.log("uninstallAll");
		datasetToWorks = new Array();
		for (var i = 0; i < $scope.datasetsList.length; i++) {
			if($scope.datasetsList[i].isSelected && !$scope.datasetsList[i].isUpdating && !$scope.datasetsList[i].updated){
				if($scope.datasetsList[i].dataset.datasetSubtype.datasetSubtype=='bulkDataset'){
					$scope.datasetsList[i].feedback = "In coda";
					datasetToWorks.push({"originalIndex": i, "dataset": $scope.datasetsList[i]});
				}
				else
					$scope.datasetsList[i].feedback = "Stream dataset, usare il pannello stream";
			}
		}
		uninstallDataset();
		
	};

	$scope.uninstallSingle = function(datasetIndex){
		console.log("uninstallSingle", datasetIndex);
		$scope.clearSelection();
		$scope.datasetsList[datasetIndex].isSelected=true;
		$scope.datasetsList[datasetIndex].feedback = "In coda";
		datasetToWorks = new Array();
		datasetToWorks.push({"originalIndex": datasetIndex, "dataset": $scope.datasetsList[datasetIndex]});
		uninstallDataset();
		
	};

	var uninstallDataset = function(){
		console.log("uninstallDataset");
		errors = "";
		if(datasetToWorks && datasetToWorks!=null && datasetToWorks.length>0){
			var dataset = datasetToWorks.shift();
			if($scope.datasetsList[dataset.originalIndex].isSelected && !$scope.datasetsList[dataset.originalIndex].isUpdating && !$scope.datasetsList[dataset.originalIndex].updated){
				$scope.datasetsList[dataset.originalIndex].isUpdating = true;
				$scope.datasetsList[dataset.originalIndex].feedback = "In aggiornamento";
				adminAPIservice.uninstallDataset(dataset.dataset.dataset).success(function(response) {
					console.log("uninstallDataset SUCCESS", response);
					$scope.datasetsList[dataset.originalIndex].isUpdating = false;
					$scope.datasetsList[dataset.originalIndex].isSelected=false;
					$scope.datasetsList[dataset.originalIndex].updated = true;
					$scope.datasetsList[dataset.originalIndex].feedback = "Aggiornato";
					uninstallDataset();
				}).error(function(response){
					console.error("uninstallDataset ERROR", response);
					$scope.datasetsList[dataset.originalIndex].isUpdating = false;
					$scope.datasetsList[dataset.originalIndex].isSelected=false;
					$scope.datasetsList[dataset.originalIndex].updated = true;
					$scope.datasetsList[dataset.originalIndex].feedback = "Errore";
					if(response.errorCode || response.errorName)
						errors +=response.errorCode  + " - " + response.errorName + "\n";
				});
			}
		}
		else{
			if(errors.length>0){
				$scope.$parent.showMessage("danger", "ERROR", "ERROR_IN_LOOP",errors);
			}
			else
				$scope.$parent.showMessage("info", "INFO", "DASHBOARD_FINISH_DATASET","");
		}

	}
	
	$scope.deleteDataAll = function(){
		console.log("deleteDataAll");
		datasetToWorks = new Array();
		for (var i = 0; i < $scope.datasetsList.length; i++) {
			if($scope.datasetsList[i].isSelected && !$scope.datasetsList[i].isUpdating && !$scope.datasetsList[i].updated){
				$scope.datasetsList[i].feedback = "In coda";
				datasetToWorks.push({"originalIndex": i, "dataset": $scope.datasetsList[i]});
			}
		}
		deleteData();
		
	};

	$scope.deleteDataSingle = function(datasetIndex){
		console.log("deleteDataSingle", datasetIndex);
		$scope.clearSelection();
		$scope.datasetsList[datasetIndex].isSelected=true;
		$scope.datasetsList[datasetIndex].feedback = "In coda";
		datasetToWorks = new Array();
		datasetToWorks.push({"originalIndex": datasetIndex, "dataset": $scope.datasetsList[datasetIndex]});
		deleteData();
		
	};

	var deleteData = function(){
		console.log("deleteData");
		errors = "";
		if(datasetToWorks && datasetToWorks!=null && datasetToWorks.length>0){
			var dataset = datasetToWorks.shift();
			if($scope.datasetsList[dataset.originalIndex].isSelected && !$scope.datasetsList[dataset.originalIndex].isUpdating && !$scope.datasetsList[dataset.originalIndex].updated){
				$scope.datasetsList[dataset.originalIndex].isUpdating = true;
				$scope.datasetsList[dataset.originalIndex].feedback = "In aggiornamento";
				adminAPIservice.deleteDataFromDataset(dataset.dataset.dataset).success(function(response) {
					console.log("deleteDataFromDataset SUCCESS", response);
					$scope.datasetsList[dataset.originalIndex].isUpdating = false;
					$scope.datasetsList[dataset.originalIndex].isSelected=false;
					$scope.datasetsList[dataset.originalIndex].updated = true;
					$scope.datasetsList[dataset.originalIndex].feedback = "Dati aggiornati";
					deleteData();
				}).error(function(response){
					console.error("deleteDataFromDataset ERROR", response);
					$scope.datasetsList[dataset.originalIndex].isUpdating = false;
					$scope.datasetsList[dataset.originalIndex].isSelected=false;
					$scope.datasetsList[dataset.originalIndex].updated = true;
					$scope.datasetsList[dataset.originalIndex].feedback = "Errore";
					if(response.errorCode || response.errorName)
						errors +=response.errorCode  + " - " + response.errorName + "\n";
				});
			}
		}
		else{
			if(errors.length>0){
				$scope.$parent.showMessage("danger", "ERROR", "ERROR_IN_LOOP",errors);
			}
			else
				$scope.$parent.showMessage("info", "INFO", "DASHBOARD_FINISH_DATASET","");
		}

	}	
	$scope.defaultValue=null;
	
	$scope.refreshParameter = function (selectedRow) {
	    var modalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'refreshParameter.html',
	      controller: 'DatasetRefreshParameterCtrl',
	      resolve: {
	    	  row: function () {
	    		  return selectedRow;
	    	  },
	    	  defaultValue:function() { 
	    		  return $scope.defaultValue;
	    	  }
	      }
	    });
	    modalInstance.result.then(function (selectedItem) {
	        $scope.defaultValue = selectedItem;
	    	  console.log('selectedItem: ' + $scope.defaultValue);

	      }, function () {
	    	  console.log('Modal dismissed at: ' + new Date());
	      });
	}
	
    
} ]);

appControllers.controller('DatasetRefreshParameterCtrl', [ '$scope', '$modalInstance', 'row' , 'adminAPIservice','defaultValue', function ($scope, $modalInstance, row, adminAPIservice,defaultValue) {
	console.log("DatasetRefreshParameterCtrl - row", defaultValue, row)
	
	$scope.showNotSavedWarning = false;
	if (defaultValue != null) {
		$scope.saveAsDefault = false;
	}
	else 
		$scope.saveAsDefault = true;
	

	$scope.dbValorized = null;

	if (row.dataset.availablehive != null || row.dataset.availablespeed != null || row.dataset.istransformed != null || row.dataset.dbhiveschema != null )
		$scope.dbValorized =  true;
	else 
		$scope.dbValorized =  false;
	
	console.log("dbValorized",$scope.dbValorized);
	
	$scope.default = null;
	
	 if (defaultValue != null) 
		 $scope.default = true;
	 else $scope.default = false;
	
	if (defaultValue != null && !$scope.dbValorized) {
		$scope.hiveSchema = defaultValue.hiveSchema;
		$scope.datasetName = row.dataset.datasetcode ;
		$scope.checkboxModel = {
				availableHive : defaultValue.availableHive,
				availableSpeed :defaultValue.availableSpeed ,
				isTransformed : defaultValue.isTransformed
		};
	}
	else {
		$scope.hiveSchema = row.dataset.dbhiveschema;
		$scope.hiveTable = row.dataset.dbhivetable;
		$scope.datasetName = row.dataset.datasetcode ;
		
		$scope.checkboxModel = {
				availableHive : row.dataset.availablehive,
				availableSpeed : row.dataset.availablespeed ,
				isTransformed : row.dataset.istransformed
		};

	}
	
	$scope.refreshParameter = function (saveAsDefault) {
		console.log("saveAsDefault:",saveAsDefault);
		
		var newDataset =  row.dataset;
		newDataset.availablespeed = $scope.checkboxModel.availableSpeed;
		newDataset.availablehive = $scope.checkboxModel.availableHive;
		newDataset.istransformed = $scope.checkboxModel.isTransformed;
		newDataset.dbhiveschema = $scope.hiveSchema;
		newDataset.dbhivetable = $scope.hiveTable;
		console.log("DatasetRefreshParameterCtrl - newDataset", newDataset)
		adminAPIservice.updateDatasetHiveparams(row.dataset.iddataset,row.version,newDataset).success(function(response) {
			console.info("updateDatasetHiveparams - response",response);
			if($scope.saveAsDefault)
			{
				$modalInstance.close({"hiveSchema":$scope.hiveSchema,"availableSpeed":$scope.checkboxModel.availableSpeed,"availableHive":$scope.checkboxModel.availableHive,"isTransformed":$scope.checkboxModel.isTransformed});
			}
			$modalInstance.dismiss('cancel');
		}).error(function(response) {
			console.error("updateDatasetHiveparams ERROR ",response);	
		});
	};
		
	$scope.close = function () {
		$modalInstance.dismiss('cancel');
	};
	
	
	
	$scope.replaceWithDefault = function () {
		console.log("replaceWithDefault-defaultValue",defaultValue);
		$scope.hiveSchema = defaultValue.hiveSchema;
		$scope.datasetName = row.dataset.datasetcode ;
		$scope.checkboxModel = {
				availableHive : defaultValue.availableHive,
				availableSpeed :defaultValue.availableSpeed ,
				isTransformed : defaultValue.isTransformed
		};
		$scope.showNotSavedWarning =true;
	};
}]);
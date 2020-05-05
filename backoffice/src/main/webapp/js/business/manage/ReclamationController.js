/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */


/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */

appControllers.controller('ReclamationCtrl', [ '$scope', "$route", 'adminAPIservice', 'fabricBuildService', 'readFilePreview', '$translate', '$modal', '$timeout' , '$q',
                                           function($scope, $route, adminAPIservice, fabricBuildService, readFilePreview, $translate, $modal,$timeout, $q) {
	
	$scope.csvInfo = {};
	$scope.csvInfo.separator = ';'
	$scope.onFileSelect = function($files) {
		$scope.updateWarning = null;
		$scope.csvInfo.selectedFile = $files[0];
		console.log("onFileSelect", $scope.csvInfo.selectedFile );
		if($scope.csvInfo.selectedFile !=null && $scope.csvInfo.selectedFile.size>Constants.BULK_DATASET_MAX_FILE_SIZE){
			$scope.uploadMessage = {type:'warning', message: 'MANAGEMENT_NEW_DATASET_UPLOAD_FILE_WARNING_MAX_SIZE'};
			$scope.choosenFileSize = scope.csvInfo.selectedFile.size; 
			$scope.updateWarning = true;
			$scope.csvInfo.selectedFile = null;
			$scope.previewLines = null;
		}
		else
			$scope.readPreview($scope.csvInfo.separator);
	};
	
	$scope.preview = {};
	$scope.datasource = {};
	$scope.componentInfoRequests={};
	$scope.reclamationColumns = Constants.RECLAMATION_COLUMNS;
	$scope.datasetAggiornati = 0;
	//$scope.datasetdaAggiornare = 0;	
	$scope.numDatasets = 0;
	$scope.datasetdaAggiornare =$scope.numDatasets - $scope.datasetAggiornati;
	
	console.log("reclamationColumns",$scope.reclamationColumns);
	$scope.readPreview = function(csvSeparator){
		$scope.uploadDatasetError = null;
		$scope.uploadMessage = null;
		
		readFilePreview.readTextFile($scope.csvInfo.selectedFile, 100000, $scope.fileEncoding).then(
				function(contents){
					//var lines = contents.split(/\r\n|\n|\r/g);
					var lines = contents.split(/\r\n/g);
					console.log("nr righe", lines.length);
					console.log("lines",lines);
					
				
					
					$scope.previewLines = new Array();
					$scope.CSVtoArrayAll = new Array();					
					
					$scope.CSVtoArrayAll = Helpers.util.CSVtoArray(lines.join("\r\n"),csvSeparator).splice(1);
					console.log("CSVtoArrayAll",$scope.CSVtoArrayAll);
					$scope.numDatasets = $scope.CSVtoArrayAll.length;
					$scope.datasetdaAggiornare = $scope.numDatasets - $scope.datasetAggiornati;

					//** esponiamo a video solo le prime 5 righe
					$scope.previewLines = Helpers.util.CSVtoArray(lines.join("\r\n"),csvSeparator).slice(0, 6);
					console.log("$scope.previewLines",$scope.previewLines);

					$scope.preview.columns = new Array();
					$scope.preview.components = new Array();
					
				}, 
				function(error){
					$scope.uploadDatasetError = {error_message: error, error_detail: ""};
					Helpers.util.scrollTo();
				}
		);
	};
	
	
	
	$scope.reclamationColumnsSelected = [];
	
	  $scope.toggleReclamationColumns = function(column){
		 
	       if(($scope.reclamationColumnsSelected.indexOf(column.name) == -1) && (column.checked)){
	          $scope.reclamationColumnsSelected.push(column.name);
	        } 
	       else{
	           $scope.reclamationColumnsSelected.splice($scope.reclamationColumnsSelected.indexOf(column.name),1);
	         }
	       console.log("reclamationColumnsSelected",$scope.reclamationColumnsSelected);
	  };
	  
	  
	  $scope.reclamationColumnsIndexCsv = [];
	  $scope.firstRow = null;
	  
	  $scope.finished = false;
	  $scope.executeReclamation = function(){
		  $scope.executeOn = true;
		  
		  //salvo gli indici delle colonne da bonificare
		  firstRow = $scope.previewLines[0];
		  console.log("firstRow", firstRow);
		  for(index = 0; index<firstRow.length; index++) {
			  if($scope.reclamationColumnsSelected.indexOf(firstRow[index]) >-1) {
				  var col = {"index":index,"columnName":firstRow[index]}
				  $scope.reclamationColumnsIndexCsv.push(col);			
			  }
		  }
		  console.log("reclamationColumnsIndexCsv",$scope.reclamationColumnsIndexCsv);
		  
		  if($scope.reclamationColumnsIndexCsv.length <= 0) {
			  $scope.$parent.showMessage("danger", "ERROR", "CSV NON CONFORME", "Detail:Il csv non è corretto. Verificare le colonne da aggiornare");
			  exit;
		  }
		  
		  loadDatasetAndUpdate();
		  /*$scope.isUpdating=false;
		  $scope.finished = true;*/
		  
	  }
	  
	  var updateDataset = function(organizationCode,datasetForUpdate){
		  $scope.isUpdating=true;
		  adminAPIservice.updateDataset(organizationCode,datasetForUpdate).success(function(response) {			 
			  console.log("responseUpdate",response);
			  $scope.datasetAggiornati = $scope.datasetAggiornati +1;
			  $scope.datasetdaAggiornare =$scope.numDatasets - $scope.datasetAggiornati;
			  $scope.CSVtoArrayAll.shift();
			  console.log("CSVtoArrayAll - dopo shift",$scope.CSVtoArrayAll);
			  if($scope.CSVtoArrayAll.length>0)
				  loadDatasetAndUpdate();
			  else {
				  $scope.isUpdating=false;
				  $scope.finished = true;
			  }
			  
		  }).error(function(response) {
				console.log("loadDatasetReclamationUpdate - error",response);
				$scope.$parent.showMessage("danger", "UNEXPECTED_ERROR", "UNEXPECTED_ERROR_MESSAGE", "Detail: "+response);
		  });
		  
	  }
	  
	  var updateStreamLight = function(organizationCode,soCode,datasetForUpdate){
		  $scope.isUpdating=true;
		  adminAPIservice.updateStreamLight(organizationCode,soCode,datasetForUpdate).success(function(response) {			 
			  console.log("responseUpdate",response);
			  $scope.datasetAggiornati = $scope.datasetAggiornati +1;
			  $scope.datasetdaAggiornare =$scope.numDatasets - $scope.datasetAggiornati;
			  $scope.CSVtoArrayAll.shift();
			  console.log("CSVtoArrayAll - dopo shift",$scope.CSVtoArrayAll);
			  if($scope.CSVtoArrayAll.length>0)
				  loadDatasetAndUpdate();
			  else {
				  $scope.isUpdating=false;
				  $scope.finished = true;
			  }
			  
		  }).error(function(response) {
				console.log("loadDatasetReclamationUpdate - error",response);
				$scope.$parent.showMessage("danger", "UNEXPECTED_ERROR", "UNEXPECTED_ERROR_MESSAGE", "Detail: "+response);
		  });
		  
	  }
	  
	  var loadDatasetAndUpdate = function(){
		  var indexDs = firstRow.indexOf("datasetcode");
		  var dsCode = $scope.CSVtoArrayAll[0][indexDs];
		  console.log("dsCodeinElab",dsCode);
		  var row = $scope.CSVtoArrayAll[0];		
		//load dataset by datasetCode
		  adminAPIservice.loadDataset(dsCode).success(function(response) {
			  console.log("loadDataset - reclamation", response);
			  
			  var organizationCode = response.organization.organizationcode;
			  if (response.stream)
				  var socode= response.stream.smartobject.socode;
			  
			  $scope.datasetForUpdate =  Helpers.yucca.prepareDatasourceForUpdate(Constants.DATASOURCE_TYPE_DATASET, response);
			   
			  console.log("row",row);
			  for ( j = 0; j<$scope.reclamationColumnsIndexCsv.length; j++){
				  var columnName = $scope.reclamationColumnsIndexCsv[j].columnName;
				  var columnIndex =  $scope.reclamationColumnsIndexCsv[j].index;
				  $scope.datasetForUpdate[columnName]= row[columnIndex];					
			  }
			  			  			  
			  
			  cleanDatasetBeforeUpdate();
			  
			  console.log("datasetForUpdate",$scope.datasetForUpdate);	
			  
			  if ($scope.datasetForUpdate.idstream || $scope.datasetForUpdate.idstream!= null){
				//updateStreamLight
				  updateStreamLight(organizationCode,socode,$scope.datasetForUpdate);
			  }
			  //update Dataset
			  else updateDataset(organizationCode,$scope.datasetForUpdate);				  
			  
			
			}).error(function(response) {
				console.log("loadDatasetReclamation - error",response);
				$scope.isAborted = true;
				$scope.isUpdating=false;
				$scope.$parent.showMessage("danger", "UNEXPECTED_ERROR", "UNEXPECTED_ERROR_MESSAGE", "Detail: "+response);
			});
		  
	  }
	  
	 var cleanDatasetBeforeUpdate = function(){
			if(Helpers.util.has($scope.datasetForUpdate, 'opendata') && !$scope.datasetForUpdate.opendata.isOpenData)
				delete $scope.datasetForUpdate['opendata'];
			else{
				if(Helpers.util.has($scope.datasetForUpdate, 'opendata.opendataupdatedate') )	{	
						var date =  new Date( $scope.datasetForUpdate.opendata.opendataupdatedate);	
						var year = (date.getFullYear()).toString();
						var month = ((date.getMonth()+1) < 10) ? "0" + (date.getMonth()+1) :(date.getMonth()+1);
						var day = ((date.getDate() < 10) ? "0" + date.getDate() :date.getDate()).toString();
						$scope.datasetForUpdate.opendata.opendataupdatedate= year+month+day;	
				}
			}
			
				
			if($scope.datasetForUpdate.license && $scope.datasetForUpdate.license.idLicense==null && $scope.datasetForUpdate.license.description==null && $scope.datasetForUpdate.license.licensecode==null)
				delete $scope.datasetForUpdate['license'];

			if($scope.datasetForUpdate.visibility == 'public')
				delete $scope.datasetForUpdate['sharingTenants'];
			if($scope.datasetForUpdate.visibility != 'private')
				delete $scope.datasetForUpdate['copyright'];
			else
				delete $scope.datasetForUpdate['license'];
			
			if($scope.datasetForUpdate.unpublished)
				delete $scope.datasetForUpdate['dcat'];

			if($scope.datasetForUpdate.groups){
				for (var i = 0; i < $scope.datasetForUpdate.groups.length; i++) {
					$scope.datasetForUpdate.groups[i].idDatasourcegroupType = $scope.datasetForUpdate.groups[i].type.idDatasourcegroupType;				
				}
			}
				
		};
	  
	  $scope.reclamationProgress = {"progressBar":function(){return this.delta*(this.total-this.CSVtoArrayAll.length);}, 
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
	
	
}]);




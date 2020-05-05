/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */

appControllers.controller('StreamCtrl', [ '$scope', "$route", 'adminAPIservice', 'fabricBuildService', '$translate', '$modal', '$timeout' ,
                                           function($scope, $route, adminAPIservice, fabricBuildService, $translate, $modal,$timeout) {
	console.log("$modal", $modal);
		
	$scope.streamsList = new Array();
	$scope.filteredStreamsList = [];
	$scope.tenantsFilter = null;
	$scope.codeFilter = null;
	$scope.statusFilter = 'Richiesta';
	$scope.virtualentityFilter = null;
	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.totalItems = $scope.streamsList.length;
	$scope.predicate = '';
	$scope.showLoading = true;
	
	var errors = "";
	
	$scope.actions = Constants.STREAM_ACTIONS;
	
	
	/*
	 * LOAD STREAMS
	 */
	$scope.loadStreams = function(){
		$scope.streamsList = new Array();
		$scope.showLoading = true;

		adminAPIservice.loadStreams().success(function(response) {
			$scope.showLoading = false;
			console.log("loadStreams - response",response);
	
			var responseList = Helpers.util.initArrayZeroOneElements(response);
			for (var i = 0; i < responseList.length; i++) {
				
				var row = initRow(responseList[i]);
				row.rowIndex = i;
				$scope.streamsList.push(row);					
			}
			$scope.totalItems = $scope.streamsList.length;
		}).error(function(response) {
			console.log("loadStreams - error",response);
		});
	};
	
	$scope.loadStreams();
	var initRow = function(streamIn){
		var row = {};
		row.stream = streamIn;
		row.statusIcon = Helpers.stream.statusIcon(row.stream);
		row.deploymentStatusCodeTranslated =  $translate.instant(row.stream.status.statuscode);
		row.isSelected = false;
		row.isUpdating = false;
		row.updated = false;
		//row.ellipseNameLimit = 34-row.stream.streamcode.length;
		row.ellipseNameLimit = 15;
		if(!row.stream.status.statuscode || row.stream.status.statuscode==null)
			row.stream.status.statuscode = "draft";
		
		if(row.stream.status.statuscode=='req_inst'){
			if(row.stream.version === 1)
				row.action = 'install';
			else
				row.action = 'upgrade';
		}
		else if(row.stream.status.statuscode=='inst'){
			row.action = 'migrate';
		}
		else if(row.stream.status.statuscode=='req_uninst'){
			row.action = 'delete';
		}

		row.startStep = 0;
		row.endStep = null;
		
		/*if(!row.stream.streamIcon || row.stream.streamIcon == null)
			row.stream.streamIcon  = "img/stream-icon-default.png";*/
	
		return row;
	}
	
	$scope.streamIconUrl= function(organizationCode, idstream){	
		return Constants.API_ADMIN_STREAMS_URL+"/"+idstream+"/icon?organizationCode="+organizationCode;
	};
	
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

	$scope.searchTenantsFilter = function(row) {
		var keyword = new RegExp($scope.tenantsFilter, 'i');
		return !$scope.tenantsFilter || keyword.test(row.stream.tenantManager.tenantcode);
	};

	$scope.$watch('tenantsFilter', function(newTenant) {
		$scope.currentPage = 1;

		$scope.totalItems = $scope.filteredStreamsList.length;
	});
	
	$scope.searchCodeFilter = function(row) {
		var keyword = new RegExp($scope.codeFilter, 'i');
		return !$scope.codeFilter || keyword.test(row.stream.streamcode)|| keyword.test(row.stream.streamname);
	};

	$scope.$watch('codeFilter', function(newCode) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});

	$scope.searchStatusFilter = function(row) {
		var keyword = new RegExp($scope.statusFilter, 'i');
		return !$scope.statusFilter || keyword.test(row.stream.status.statuscode) || keyword.test(row.deploymentStatusCodeTranslated);
	};

	$scope.$watch('statusFilter', function(newStatus) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});


	$scope.searchVirtualentityFilter = function(row) {
		var keyword = new RegExp($scope.virtualentityFilter, 'i');
		return !$scope.virtualentityFilter || keyword.test(row.stream.smartobject.socode);
	};

	$scope.$watch('virtualentityFilter', function(newVirtualentity) {
		$scope.currentPage = 1;
		$scope.totalItems = $scope.filteredStreamsList.length;
	});
	
	
	$scope.updateSelection = function($event, rowIndex) {
		$scope.streamsList[rowIndex].updated = false;
//		var checkbox = $event.target;
//		if(checkbox.checked){
//			$scope.streamsList[rowIndex].isSelected=true;
//			$scope.streamsList[rowIndex].updated = false;
//		}
//		else{
//			$scope.streamsList[rowIndex].isSelected=false;
//		}

	};	
	
	$scope.clearSelection = function(){
		if($scope.streamsList && $scope.streamsList!=null){
			for (var i = 0; i < $scope.streamsList.length; i++) {
				$scope.streamsList[i].isSelected=false;
			}
		}
		
	}
	
	var getPageOfRow = function(row){
		var page = 1;
		for (var k = 0; k < $scope.filteredStreamsList.length; k++) {
			if(row.rowIndex == $scope.filteredStreamsList[k].rowIndex){
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

			if($scope.filteredStreams && $scope.filteredStreams!=null){
				

				for (var i = 0; i < $scope.filteredStreams.length; i++) {
					console.log("$scope.filteredStreams[i].isSelected", $scope.filteredStreams[i].isSelected)

					$scope.filteredStreams[i].isSelected=true;
				}
			}
		}
	}
	var streamToWorks = new Array(); 

	$scope.execActions = function(action){
		console.log("execActions", action);
		errors = "";
		streamToWorks = new Array(); 
		
		var atLeastOneSelected = false;
		if($scope.streamsList && $scope.streamsList!=null){
			for (var i = 0; i < $scope.streamsList.length; i++) {
				if($scope.streamsList[i].isSelected && !$scope.streamsList[i].isUpdating){
					
					atLeastOneSelected = true;
//					var errorOnStep = false;
//					if($scope.streamsList[i].startStep<0)
//						errorOnStep = true;
//					if($scope.streamsList[i].endStep!=null){
//						if($scope.streamsList[i].endStep<0)
//							errorOnStep = true;
//						if($scope.streamsList[i].endStep<$scope.streamsList[i].startStep)
//							errorOnStep = true;
//					}
//					
//					if(errorOnStep)
//						$scope.streamsList[i].errorValidation = "DASHBOARD_STREAM_STEP_VALIDATION_ERROR";
//					else{
						$scope.streamsList[i].errorValidation = null;
//						execAction(i);
//					}
					streamToWorks.push({"originalIndex": i, "stream": $scope.streamsList[i]});
					$scope.streamsList[i].feedback='Scheuled';
					$scope.streamsList[i].feedbackIcon='fa fa-clock-o';
					$scope.streamsList[i].isSelected = false;
					$scope.streamsList[i].disabled = true;

				}
			}
			execAction(action);
		}
		if(!atLeastOneSelected)
			$scope.$parent.showMessage("warning", "WARNING", "DASHBOARD_WARNING_NO_STREAM", "");

	}
	
	/*********
	 *EXEC ACTION
	 **********/
	var execAction = function(action){
		//$scope.streamsList[rowIndex].actionIconClass='fa fa-rocket';

		if(streamToWorks && streamToWorks!=null && streamToWorks.length>0){
			var stream = streamToWorks.shift();
			console.log("stream", $scope.streamsList[stream.originalIndex].stream);
			if(!$scope.streamsList[stream.originalIndex].isUpdating && !$scope.streamsList[stream.originalIndex].updated){

				$scope.streamsList[stream.originalIndex].feedbackIcon='fa fa-cog fa-spin fa-fw';
				$scope.streamsList[stream.originalIndex].feedback='Running';
				$scope.streamsList[stream.originalIndex].isUpdating = true;

				var actionParams = {};
				actionParams.action = action;
				
				console.log("actionParams",actionParams);
				adminAPIservice.execStreamAction(actionParams,$scope.streamsList[stream.originalIndex].stream.idstream).success(function(response) {
					console.log("execAction success",response);
					$scope.streamsList[stream.originalIndex].feedbackLog = response;
					if(response.status=='success'){
						$scope.streamsList[stream.originalIndex].feedbackIcon='fa fa-check';
						$scope.streamsList[stream.originalIndex].feedback='Success';
						
						execAction(action);
					}
					else{
						$scope.streamsList[stream.originalIndex].feedbackIcon='fa fa-times';
						$scope.streamsList[stream.originalIndex].feedback='Error';
					}
				}).error(function(response){
					console.log("execAction error",response);
					$scope.streamsList[stream.originalIndex].feedbackIcon='fa fa-times';
					$scope.streamsList[stream.originalIndex].feedback='Error';
				    var errorMessage = "" + response;
				    if(typeof response.errorCode != 'undefined' && typeof response.errorName != 'undefined' )
				    	errorMessage = response.errorCode + " - " + response.errorName;
					
					$scope.streamsList[stream.originalIndex].feedbackLog = {"status":"error","logs":[{"level":"ERROR","message":errorMessage}]};
				});
			}
		}
	};
	
	var someOneIsUpdating = false;
	
    
    var refreshStream = function(row){
    	adminAPI.loadStream(row.stream.idStream).success(function(response) {
    		console.log("refreshStream - response",response);
    		row.stream = response;
    	});
    }
    
   
   
   function createActionParams(operation, stream, startStep, endStep ){
		var steps = startStep;
		if(endStep && endStep!=null)
			steps +=":"+endStep;
		return operation + "|stream|" + stream.codiceTenant + "|" + stream.codiceVirtualEntity + "|" + stream.codiceStream+ "|" + steps; 
	}
	
   
	function createStepsLogUrl(operation, stream){
		return "installer_" + operation + "_stream_" + stream.idstream+ ".json"; 
	}
	
    
	$scope.openLog = function (selectedRow) {

	    var modalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'streamInstalLog.html',
	      controller: 'StreamInstallLogCtrl',
	      size: 'lg',
	      resolve: {
	    	  row: function () {
	          return selectedRow;
	        }
	      }
	    });

	}
	
	$scope.openTest = function (selectedStream) {

	    var modalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'streamTest.html',
	      controller: 'StreamTestCtrl',
	      size: 'lg',
	      resolve: {
	    	  stream: function () {
	          return selectedStream;
	        }
	      }
	    });

	}
	
	
	// status

	var updateStatus  = function(){
		console.log("uninstallDataset", $scope.streamsList);
		errors = "";
		if(streamToWorks && streamToWorks!=null && streamToWorks.length>0){
			var stream = streamToWorks.shift();
			if($scope.streamsList[stream.originalIndex].isSelected && !$scope.streamsList[stream.originalIndex].isUpdating && !$scope.streamsList[stream.originalIndex].updated){
				$scope.streamsList[stream.originalIndex].isUpdating = true;
				$scope.streamsList[stream.originalIndex].update_feedback = "In aggiornamento";
				adminAPIservice.updateStreamStatus($scope.streamsList[stream.originalIndex].stream.idstream, $scope.newStatus).success(function(response) {
					console.log("uninstallDataset SUCCESS", response);
					$scope.streamsList[stream.originalIndex].isUpdating = false;
					$scope.streamsList[stream.originalIndex].isSelected=false;
					$scope.streamsList[stream.originalIndex].updated = true;
					$scope.streamsList[stream.originalIndex].update_feedback = "Aggiornato";
					$scope.streamsList[stream.originalIndex].deploymentStatusCodeTranslated = "-"; 
					updateStatus();
				}).error(function(response){
					console.error("uninstallDataset ERROR", response);
					$scope.streamsList[stream.originalIndex].isUpdating = false;
					$scope.streamsList[stream.originalIndex].isSelected=false;
					$scope.streamsList[stream.originalIndex].updated = true;
					$scope.streamsList[stream.originalIndex].update_feedback = "Errore";
					if(response.errorCode || response.errorName)
						errors += response.errorCode + " - " + response.errorName;
				});
			}
		}
		else{
			if(errors.length>0){
				$scope.$parent.showMessage("danger", "ERROR", "ERROR_IN_LOOP",errors);
			}
			else
				$scope.$parent.showMessage("success", "SUCCESS", "DASHBOARD_FINISH_STREAM_UPDATE_STATUS","");
		}
	};
	
	var streamToWorks = new Array(); 

	$scope.datasourceStatus  = Constants.DATASOURCE_STATUS;
	$scope.newStatus = null;
	$scope.changeStatus = function(){
		
		console.log("changeStatus",$scope.newStatus);
		errors = "";
		if($scope.newStatus !=null){
			streamToWorks = new Array();
			for (var i = 0; i < $scope.streamsList.length; i++) {
				if($scope.streamsList[i].isSelected && !$scope.streamsList[i].isUpdating){
					$scope.streamsList[i].update_feedback = "In coda";
					streamToWorks.push({"originalIndex": i, "stream": $scope.streamsList[i]});
				}
			}
			if(streamToWorks.length==0)
				$scope.$parent.showMessage("warning", "WARNING", "DASHBOARD_WARNING_NO_STREAM", "");
			else{
				updateStatus();
			}
		}
		else{
			$scope.$parent.showMessage("warning", "WARNING", "DASHBOARD_WARNING_SELECT_STATUS", "");
		}
	};

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
} ]);

//appControllers.controller('StreamInstallLogCtrl', [ '$scope', '$modalInstance', 'row' , 'fabricBuildService', function ($scope, $modalInstance, row, fabricBuildService) {
//	$scope.extendedLog = null;
//	$scope.extendedLogUrl = null;
//	console.log("StreamInstallLogCtrl - row", row)
//	$scope.streamName = row.stream.streamcode + " - " + row.stream.streamname;
//	$scope.actions = Constants.STREAM_ACTIONS;
//	$scope.error = null;
//	// format log
//	var formatLog = function(log){
//	    var lines = log.split('\n');
//	    var formattedLog = "";
//	    if(lines!=null && lines.length>0){
//	         for(var k = 0; k < lines.length; k++){
//	            var lineSplit = lines[k].split(" - ");
//	            if(lineSplit && lineSplit!=null && lineSplit.length>1) {
//		            var date = "<span class='logDate'>"+lineSplit[0]+"</span>";
//		            var level = "<span class='logLevel logLevel"+lineSplit[1]+"'>"+lineSplit[1]+"</span>";
//		            var remainingLine = lineSplit.slice(2).join(" - ");
//		            var content  = Helpers.render.safeTags(remainingLine);
//		            content =  Helpers.render.removeImage(content);
//		            content = Helpers.render.linkify(content);
//		            content = Helpers.render.colorize(content);
//		            formattedLog += "<p class='logLine'>"+date+level+content+"</p>"; 
//	            }
//	            else
//	            	formattedLog += Helpers.render.safeTags(lines[k]);
//	        }
//	    }
//	    return formattedLog
//	    //$("#log").html(formattedLog)
//	}
//	
//
//	$scope.showLog = function(action){
//		$scope.showLoading = true;
//		var urlParams = createActionLogUrl(row.stream, action);
//		$scope.extendedLogUrl = Constants.API_FABRIC_PROXY_URL + urlParams;
//			
//			
//		$scope.extendedLog = null;
//		$scope.error = null;
//		fabricBuildService.getLogs(urlParams).success(function(response) {
//			console.log("response",response);
//			$scope.showLoading = false;
//			$scope.error = null;
//			$scope.extendedLog = formatLog(response);
//		}).error(function(response) {
//			console.log("response - error",response);
//			$scope.showLoading = false;
//			$scope.error = response;
//			$scope.extendedLog = null;
//		});
//	};
//	
//	if(row.action!=null){
//		$scope.logAction =row.action;
//		$scope.showLog(row.action);
//	}
//
//	function createActionLogUrl(stream, operation){
//		return operation + "_stream_" + stream.idstream+ ".log"; 
//	}
//
//	
//	$scope.close = function () {
//	    $modalInstance.dismiss('cancel');
//		};
//	}
//]);

/*
appControllers.controller('StreamTestCtrl', [ '$scope', '$modalInstance', 'stream' ,  'STREAM_API_INPUT_URL', '$filter',"$http",  'localStorageService',
                                              function ($scope, $modalInstance, stream, STREAM_API_INPUT_URL, $filter, $http, localStorageService ) {
	$scope.streamName = stream.codiceStream + " - " + stream.nomeStream;
	$scope.error = null;
	$scope.stream = null;
	$scope.user = null;
	$scope.components = [];
	$scope.password = null;
	$scope.showLoading = true;
	
	
	$scope.testUrl = STREAM_API_INPUT_URL;
	$scope.paramsJson = "";

	//ADEGUARE
	fabricAPIservice.getStream(stream.codiceTenant, stream.codiceVirtualEntity, stream.codiceStream).success(function(response) {
		$scope.showLoading = false;
		console.log("response",response.streams);
		$scope.stream = response.streams.stream;
		$scope.user = response.streams.stream.codiceTenant;
		$scope.password  = localStorageService.get(response.streams.stream.codiceTenant + "-api-input-pwd");
		$scope.warning = null;
		
		if(isValidStream()){
			$scope.createParamsJson();
			$scope.createTestUrl();
		}else{
			var message  = "<h4>Invalid stream</h4>"
			if(!stream || stream== null){
				message +='<div><i class="fa fa-times"></i> stream: <strong>null</strong></div>';
			}
			else{
				message += createWarningMessage('codiceStream', $scope.stream.codiceStream);
				message += createWarningMessage('codiceTenant', $scope.stream.codiceTenant);
				message += createWarningMessage('codiceVirtualEntity', $scope.stream.codiceVirtualEntity);
				
				if($scope.stream.componenti && $scope.stream.componenti!=null){
					message +='<div><i class="fa fa-check"></i> componenti: ';
					for(var j = 0; j < $scope.stream.componenti.length; j++)
						message += $scope.stream.componenti[j] +', ';
					message += '</div>';

				}
				else
					message +='<div><i class="fa fa-times"></i> componenti: <strong>null</strong></div>';

			}
			$scope.warning = message;
		}
	});
	
	var createWarningMessage = function(key, value){
		var message = "";
		if(key && key!=null)
			message +='<div><i class="fa fa-check"></i> '+ key + ': ' + key +'</div>';
		else
			message +='<div><i class="fa fa-times"></i> '+ key + ':  <strong>null</strong></div>';
		return message;
	}
	
	$scope.createTestUrl = function(){
		$scope.testUrl = STREAM_API_INPUT_URL + "/" + $scope.user;
	}
	
	$scope.createParamsJson = function(){
		console.log("createParamsJson components", $scope.components)

		if(isValidStream() &&  $scope.components &&  $scope.components!=null){
			var componentsJson = "";
			console.log("createParamsJson componentsJson start", componentsJson);
			var now = $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ss') + 'Z';
			
			for(var j = 0; j < $scope.components.length; j++){
				console.log("createParamsJson componentsJson "+j, componentsJson);
				componentsJson += '{"components": {"'+$scope.stream.componenti.element[j].nome+'": "'+$scope.components[j]+'"}, "time": "'+now+'"}';
				if(j<$scope.components.length-1)
					componentsJson += ",";
			}
			console.log("createParamsJson componentsJson end", componentsJson);
			$scope.paramsJson = '{"sensor": "'+$scope.stream.codiceVirtualEntity+'", "values": ['+componentsJson+'], "stream":"'+$scope.stream.codiceStream+'"}';
		}
		else
			$scope.paramsJson = "";
	}
	
	var isValidStream = function(){
		if($scope.stream && $scope.stream!=null 
				&& $scope.stream.codiceTenant && $scope.stream.codiceTenant!=null
				&& $scope.stream.codiceStream && $scope.stream.codiceStream!=null
				&& $scope.stream.codiceVirtualEntity && $scope.stream.codiceVirtualEntity!=null
				&& $scope.stream.componenti && $scope.stream.componenti!=null
				&& $scope.stream.componenti.element &&  $scope.stream.componenti.element!=null &&  $scope.stream.componenti.element.length>0)
			return true;
		else 
			return false;
	}

	$scope.execTest = function(){
		console.log("user", $scope.user);
		console.log("password", $scope.password);
		console.log("components", $scope.components);

		$scope.showLoading = true;
		$scope.createParamsJson();
		$scope.createTestUrl();
		$scope.testResult = null;
		$scope.testError = null;
		if(localStorageService.isSupported) {
			localStorageService.set($scope.user + "-api-input-pwd", $scope.password);
		}

		//$http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode($scope.user + ':' + $scope.password);
		$http.defaults.headers.common['Authorization'] = 'Basic ' + btoa($scope.user + ':' + $scope.password);
		console.log("Basic " +  btoa($scope.user + ':' + $scope.password));

		$http({
			method : 'POST',
			data:$scope.paramsJson,
			 headers: {
				   'Content-Type': 'application/json'
				 },
			url : $scope.testUrl
		}).
	    success(function(data, status, headers, config) {
	        console.log('success');
			$scope.showLoading = false;
	        $scope.testResult = "ok";
	        $scope.testResultData = data;
	    }).
	    error(function(data, status, headers, config) {
	        console.log('test error',data);
			$scope.showLoading = false;
	        $scope.testResult = "ko";
	        $scope.testResultData = data;
	    });
		
		
		
		
	}
	

	$scope.close = function () {
	    $modalInstance.dismiss('cancel');
		};
	}
]);
*/

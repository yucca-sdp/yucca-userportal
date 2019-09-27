/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 Regione Piemonte
 * 
 */

appControllers.controller('DataExplorerSubscribeModalCtrl', [ '$scope', '$routeParams','storeAPIservice', '$location', '$modalInstance', 'info', 'metadata','apiType',
                                                          function($scope, $routeParams, storeAPIservice, $location, $modalInstance, info, metadata, apiType) {
 	console.log('DataExplorerSubscribeModalCtrl  metadata', metadata);
     	//$scope.metadata = {};
     	
     	$scope.updateMessage = null;
     	$scope.errorMessage = null;
		$scope.apiName = null;
		$scope.apiVersion = null;
		$scope.apiProvider = null;

     	
     	$scope.updating = false;
     	
		if($scope.metadata.dataset!=null && $scope.metadata.dataset.code!=null && apiType=='odata'){
			$scope.apiName = $scope.metadata.dataset.code+"_odata";
			$scope.apiVersion = "1.0";
			$scope.apiProvider = "admin";
			$scope.metadata.name = $scope.metadata.dataset.name;
			$scope.metadata.code = $scope.metadata.dataset.code;
			//$scope.metadata.icon = $scope.dataset.datasetIcon;
		}
		else if($scope.metadata.stream!=null && apiType=='stream') {
			//sandbox.4e2615eb-65f7-4a62-c6b3-fd44f2c8ac36_meteo_stream
			$scope.apiName = $scope.metadata.tenantCode + "." + $scope.metadata.stream.smartobject.code+ "_" + $scope.metadata.stream.code +"_stream";
			$scope.apiVersion = "1.0";
			$scope.apiProvider = "admin";
			$scope.metadata.name =$scope.metadata.stream.name;
			$scope.metadata.code = $scope.metadata.stream.smartobject.code;
			//$scope.metadata.icon = $scope.stream.streamIcon;
		}

     	
     	$scope.cancel = function() {
     		$modalInstance.dismiss();
     	};

     	$scope.goToSubscriptions = function() {
     		$modalInstance.dismiss();
    		$location.path('dataexplorer/subscriptions');
     	};

     	
    	$scope.applicationList = null;
    	var subscriptionList = [];
    	$scope.editedDescriptions =  [];
    	
    	
    	var isApplicationSubscribed  = function(appName, apiName, apiVersion, apiProvider){
    		var found = false;
    		for (var subscriptionIndex = 0; subscriptionIndex < subscriptionList.length; subscriptionIndex++) {
    			if(subscriptionList[subscriptionIndex].name == appName){
    				for (var subscriptionAPIIndex = 0;subscriptionAPIIndex< subscriptionList[subscriptionIndex].subscriptions.length;subscriptionAPIIndex++)
   					{
    					if (
    							subscriptionList[subscriptionIndex].subscriptions[subscriptionAPIIndex].name == apiName &&
    							subscriptionList[subscriptionIndex].subscriptions[subscriptionAPIIndex].version == apiVersion &&
    							subscriptionList[subscriptionIndex].subscriptions[subscriptionAPIIndex].provider == apiProvider
    						)
    					{
    						found = true;
    					}
   					}
    				
    				break;
    			}
			}
    		return found;
    	};

    	var loadApplications  = function(){
    		$scope.updating = true;
     		storeAPIservice.getApplications().success(function(response) {
	    		console.log("response",response);
	    		$scope.applicationList = response.applications;
	        	storeAPIservice.getSubscriptions().success(function(response) {
	        		console.log("getSubscriptions response",response);
	        		subscriptionList = response.subscriptions;
	        		if($scope.applicationList!=null){
	        			for (var appIndex = 0; appIndex < $scope.applicationList.length; appIndex++) {
							$scope.applicationList[appIndex].isBusy = false;
							$scope.applicationList[appIndex].isEditing = false;
							$scope.applicationList[appIndex].isSubscribed = isApplicationSubscribed($scope.applicationList[appIndex].name, $scope.apiName, $scope.apiVersion, $scope.apiProvider);
							$scope.editedDescriptions[appIndex] = $scope.applicationList[appIndex].description;
							
	        			}
	        		}
	        		$scope.updating = false;
	        	}).error(function(response){
		    		console.error("loadApplications: error", response);
		    		$scope.errorMessage = "DATA_EXPLORER_SUBSCRIBE_ERROR_LOAD_SUBSCRIPTIONS";
	        		$scope.updating = false;
		    	});
	    	}).error(function(response){
	    		console.error("loadApplications: error", response);
	    		$scope.errorMessage = "DATA_EXPLORER_SUBSCRIBE_ERROR_LOAD_APP";
        		$scope.updating = false;
	    	});
    	};
    	
    	
    	loadApplications();
    	
    	 
    	
    	$scope.clearMessages =  function(){
         	$scope.updateMessage = null;
         	$scope.errorMessage = null;
    	};
    	
    	
    	$scope.startEditApplication  = function(index){
         	$scope.updateMessage = null;
         	$scope.errorMessage = null;
    		$scope.applicationList[index].isEditing = true;
    	};

    	$scope.saveEditApplication  = function(index){
         	$scope.updateMessage = null;
         	$scope.errorMessage = null;
         	$scope.applicationList[index].description = $scope.editedDescriptions[index];
    		console.log("saveEditApplication: editedApplication",$scope.applicationList[index]);

    		$scope.updating = true;
    		
    		$scope.applicationList[index].isBusy = true;
    		storeAPIservice.updateApplication($scope.applicationList[index]).success(function(response) {
    	     	$scope.updateMessage = "DATA_EXPLORER_SUBSCRIBE_OK_UPDATE_APP";
    			$scope.applicationList[index].isBusy = false;
    			loadApplications();
    		}).error(function(response) {
    			console.log("subscribeApplication: Error", response);
    			$scope.errorMessage = "DATA_EXPLORER_SUBSCRIBE_ERROR_UPDATE_APP";
    			loadApplications();
    			$scope.applicationList[index].isBusy = false;
    		});

    		$scope.applicationList[index].isEditing = false;
    	};

    	
    	$scope.cancelEditApplication  = function(index){
         	$scope.updateMessage = null;
         	$scope.errorMessage = null;
    		$scope.editedDescriptions[index] = $scope.applicationList[index].description;
    		$scope.applicationList[index].isEditing = false;
    	};
    	
    	$scope.createApplication  = function(){
         	$scope.updateMessage = null;
         	$scope.errorMessage = null;
    		var newApplication = {"name":$scope.newApplicationName, "description": $scope.newApplicationDescription};
    		$scope.updating = true;
    		storeAPIservice.createApplication(newApplication).success(function(response) {
    	     	$scope.updateMessage = "DATA_EXPLORER_SUBSCRIBE_OK_CREATE_APP";
    			loadApplications();
	   			$scope.newApplicationName = null;
				$scope.newApplicationDescription = null;
    		}).error(function(response) {
    			console.log("subscribeApplication: Error", response);
    			$scope.errorMessage = "DATA_EXPLORER_SUBSCRIBE_ERROR_CREATE_APP";
    			loadApplications();
    		});

    	};
    	
    	$scope.unsubscribeApplication = function(index){
         	$scope.updateMessage = null;
         	$scope.errorMessage = null;
    		var app = $scope.applicationList[index];
    		
    		$scope.applicationList[index].isBusy = true;
    		$scope.updating = true;
    		storeAPIservice.removeSubscription($scope.apiName, $scope.apiVersion, $scope.apiProvider, app.id).success(function(response) {
    	     	$scope.updateMessage = "DATA_EXPLORER_SUBSCRIBE_OK_UNSUBSCRIBE";
    			$scope.applicationList[index].isBusy = false;
    			loadApplications();
    		}).error(function(response) {
    			console.log("subscribeApplication: Error", response);
    			$scope.errorMessage = "DATA_EXPLORER_SUBSCRIBE_ERROR_UNSUBSCRIBE";
    			loadApplications();
    			$scope.applicationList[index].isBusy = false;
    		});
    	};

    	$scope.subscribeApplication = function(index){
         	$scope.updateMessage = null;
         	$scope.errorMessage = null;
    		var app = $scope.applicationList[index];

    		$scope.updating = true;
    		$scope.applicationList[index].isBusy = true;
    		storeAPIservice.addSubscription($scope.apiName, $scope.apiVersion, $scope.apiProvider, app.id).success(function(response) {
    			$scope.applicationList[index].isBusy = false;
    	     	$scope.updateMessage = "DATA_EXPLORER_SUBSCRIBE_OK_SUBSCRIBE";
    			loadApplications();
    		}).error(function(response) {
    			console.log("subscribeApplication: Error", response);
    			$scope.errorMessage = "DATA_EXPLORER_SUBSCRIBE_ERROR_SUBSCRIBE";
    			loadApplications();
    			$scope.applicationList[index].isBusy = false;
    		});
    	};
    	
     }]);

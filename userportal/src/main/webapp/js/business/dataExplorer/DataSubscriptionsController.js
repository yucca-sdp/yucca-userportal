/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

appControllers.controller('DataSubscriptionsCtrl', [ '$scope', '$routeParams', 'storeAPIservice', '$filter', 'info', '$location', '$modal', 
                                                     function($scope, $routeParams, storeAPIservice, $filter, info, $location, $modal) {
	
	$scope.SUBSCRIPTIONS_TITLE = Constants.SUBSCRIPTIONS_TITLE;
	$scope.datasetCode = $routeParams.entity_code;

	var getEnvirorment  = function(){
		var host = $location.host();
		var env = host.substring(0,host.indexOf("userportal.smartdatanet.it"));
		return env;
	};
	
	$scope.currentSidebar = 'none';
	$scope.validityTime = 30758400000;
	
	$scope.nameAppView = null;
	$scope.idAppView = null;
	$scope.oldTokenView = null;
	$scope.keyclientView = null;
	$scope.keysecretView = null;
	$scope.errors = [];
	
	$scope.applicationList = [];
	$scope.allSubscriptionList = [];
	$scope.subscriptionList = [];
	$scope.editedDescriptions =  [];
	
	$scope.loadApplications = function(){
		storeAPIservice.getApplications().success(function(response) {
			$scope.applicationList = response.applications;
			$scope.loadSubscription(false);
		}).error(function(response) {
			console.log("loadApplications Error: ", response);
			$scope.showLoading = false;
			var detail = "";
			var error = {"message":"Cannot load application","detail":detail};
			$scope.errors.push(error);

		});
	};
	
	$scope.loadSubscription = function(flag){
		$scope.subscriptionList = [];
		storeAPIservice.getSubscriptions().success(function(response) {
			$scope.allSubscriptionList = response.subscriptions;
			
			if (flag)
				$scope.viewSubscription($scope.idAppView, $scope.nameAppView);
			
			if($scope.applicationList!=null){
    			for (var appIndex = 0; appIndex < $scope.applicationList.length; appIndex++) {
					$scope.applicationList[appIndex].isBusy = false;
					$scope.applicationList[appIndex].isEditing = false;
					$scope.editedDescriptions[appIndex] = $scope.applicationList[appIndex].description;
    			}
    		}

    		$scope.updating = false;

		}).error(function(response) {
			console.log("loadSubscription Error: ", response);
			$scope.showLoading = false;
			var detail = "";
			var error = {"message":"Cannot load suscription","detail":detail};
			$scope.errors.push(error);

		});
	};
	
	$scope.loadApplications();
	
	$scope.viewSubscription = function(idApp, nameApp){
		$scope.nameAppView = nameApp;
		$scope.idAppView = idApp;
		
		$scope.subscriptionList = [];
		angular.forEach($scope.allSubscriptionList, function(value, key) {
			if (value.id == idApp){
				console.log('value', value);
				angular.forEach(value.subscriptions, function(vSubs, kSubs) {
					console.log(vSubs, kSubs, value.subscriptions[kSubs]);
					value.subscriptions[kSubs]['newIcon'] = "/userportal/api/proxy/resources";
					var length = value.subscriptions[kSubs].name.length;
					if (value.subscriptions[kSubs].name.substr(-6) == "_odata"){
						//dataset
						vSubs.newIcon += "/dataset/icon/unknow/" + value.subscriptions[kSubs].name.substr(0, length-6);
					} else if (value.subscriptions[kSubs].name.indexOf(".") > -1){
						//stream
						var tmp = value.subscriptions[kSubs].name.split(".");
						var tmpCode = tmp[1].split("_");
						value.subscriptions[kSubs].newIcon += "/stream/icon/" + tmp[0] + "/" + tmpCode[0] + "/" + tmpCode[1];
					}
				});
				console.log("value", value);
				this.push(value);
				$scope.validityTime = value.prodValidityTime / 1000; //30758400000
				$scope.oldTokenView = value.prodKey;
				$scope.keyclientView = value.prodConsumerKey;
				$scope.keysecretView = value.prodConsumerSecret;
			}
		  
		}, $scope.subscriptionList);
		
		console.log("subscriptionList", $scope.subscriptionList);
		
		if ($scope.subscriptionList.length == 0){
			$scope.subscriptionList.push({id: idApp, name: nameApp, prodAuthorizedDomains: null, prodConsumerKey: null, prodConsumerSecret: null, prodKey: null, subscriptions: []});
		}
	}
	
	$scope.isShowSubscription = function(appId){
		var rtn = false;
		if ($scope.subscriptionList.length > 0){
			angular.forEach($scope.subscriptionList, function(value, key) {
				if (value.id == appId){
					rtn = true;
				}
			});
			console.log('subscriptionList', $scope.subscriptionList);
		}
		return rtn;
	};
	
	$scope.haveSubscription = function(appId){
		var rtn = false;
		angular.forEach($scope.allSubscriptionList, function(value, key) {
			if (value.id == appId){
				rtn = true;
			}
		});
		return rtn;
	}
	
	$scope.generateToken = function(validityTime){
		$scope.validityTime = validityTime;
		storeAPIservice.generateToken($scope.nameAppView, $scope.validityTime).success(function(response) {
			$scope.loadSubscription(true);
		}).error(function(response) {
			console.log("generateToken Error: ", response);
			$scope.showLoading = false;
			var detail = "";
			var error = {"message":"Cannot generateToken","detail":detail};
			$scope.errors.push(error);
		});
	};
	
	$scope.rigenerateToken = function(validityTime){
		$scope.validityTime = validityTime;
		console.log('validityTime', $scope.validityTime);
		storeAPIservice.rigenerateToken($scope.nameAppView, $scope.keyclientView, $scope.oldTokenView, $scope.keyclientView, $scope.keysecretView, $scope.validityTime).success(function(response) {
			$scope.loadSubscription(true);
		}).error(function(response) {
			console.log("generateToken Error: ", response);
			$scope.showLoading = false;
			var detail = "";
			var error = {"message":"Cannot generateToken","detail":detail};
			$scope.errors.push(error);
		});
	};
	
	$scope.startEditApplication  = function(index){
     	$scope.updateMessage = null;
     	$scope.errorMessage = null;
		$scope.applicationList[index].isEditing = true;
	};

	$scope.saveEditApplication  = function(index){
     	$scope.updateMessage = null;
     	$scope.errorMessage = null;
     	console.log('applicationList', $scope.applicationList);
     	$scope.applicationList[index].description = $scope.editedDescriptions[index];
		console.log("saveEditApplication: editedApplication",$scope.applicationList[index]);

		$scope.updating = true;
		
		$scope.applicationList[index].isBusy = true;
		storeAPIservice.updateApplication($scope.applicationList[index]).success(function(response) {
	     	$scope.updateMessage = "DATA_EXPLORER_SUBSCRIBE_OK_UPDATE_APP";
			$scope.applicationList[index].isBusy = false;
			$scope.loadApplications();
		}).error(function(response) {
			console.log("subscribeApplication: Error", response);
			$scope.errorMessage = "DATA_EXPLORER_SUBSCRIBE_ERROR_UPDATE_APP";
			$scope.loadApplications();
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
	     	$scope.loadApplications();
   			$scope.newApplicationName = null;
			$scope.newApplicationDescription = null;
		}).error(function(response) {
			console.log("subscribeApplication: Error", response);
			$scope.errorMessage = "DATA_EXPLORER_SUBSCRIBE_ERROR_CREATE_APP";
			$scope.loadApplications();
		});

	};
	
	var createQueryOdata = function(stream_code, filter, skip, top, orderby, collection){
		
		var host = $location.host();
		var env = host.substring(0,host.indexOf("userportal.smartdatanet.it"));

		var streamDataUrl = "http://"+env+"api.smartdatanet.it/api/"+stream_code+"/"+collection+"?$format=json";
		if(filter && filter!=null)
			streamDataUrl += '&$filter='+filter;
		if(skip && skip!=null)
			streamDataUrl += '&$skip='+skip;
		if(top && top!=null)
			streamDataUrl += '&$top='+top;
		if(orderby && orderby!=null)
			streamDataUrl += '&$orderby='+orderby;
		return streamDataUrl;

	};


} ]);



/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

appControllers.controller('DashboardDataStreamCtrl', [ '$scope', '$routeParams', 'upService', 'webSocketService', 'odataAPIservice',  'metadataapiAPIservice', '$filter', '$interval',
                                                   function($scope, $routeParams, upService, webSocketService, odataAPIservice, metadataapiAPIservice,  $filter,$interval) {
	$scope.stream = null;
	$scope.wsUrl = "";
	$scope.chartComponentNames = [];
	$scope.chartData = [];
	$scope.tweetData = [];
	$scope.clientConnection=Constants.WEBSOCKET_NOT_CONNECTED;
	// this var is in an object because it will used inside $interval 
	$scope.statisticTimeInterval={ interval:30};
	$scope.samplingFrequency = {value:2} ;
	$scope.samplingFrequencyMin = 1;
	$scope.samplingFrequencyMax = 30;

	$scope.statisticTimeIntervalMin = 1;
	$scope.statisticTimeIntervalMax = 600;
	
	$scope.maxDataResult={ value:120};
	$scope.maxDataResultMin=1;
	$scope.maxDataResultMax=1000;

	var maxNumTweet = 6;

	$scope.chartWidth = angular.element( document.querySelector( '#chart-container' )).width()-6;
	
	$scope.isTwitter = false;
	var tenantsTokens = "";
	upService.getInfo().success(function(info){
		if(info != null && info.user!=null && info.user.tenants !=null){
			tenantsTokens = info.user.tenantsTokens;
		}
	});

	$scope.loadStream = function(){
		metadataapiAPIservice.detailStream(null, $routeParams.tenant_code, $routeParams.virtualentity_code, $routeParams.stream_code).success(function(response) {
			console.log("loadStream", response);
			$scope.metadata = response;
			if(typeof $scope.metadata.stream.twitter!= 'undefined')
				$scope.isTwitter = true;
			
			$scope.wsUrl = Helpers.stream.wsOutputUrlFromMetadata($scope.metadata);

			if(!isNaN($scope.metadata.stream.fps)){
				var fpsNumber = parseFloat($scope.metadata.stream.fps);
				$scope.metadata.stream.fpm = 60*fpsNumber;
				if(fpsNumber!=0){
					$scope.metadata.stream.secondsBtwEvents = 1/fpsNumber;
					$scope.metadata.stream.minutesBtwEvents = 1/(fpsNumber*60);
				} else {
					$scope.metadata.stream.secondsBtwEvents = "-";
					$scope.metadata.stream.minutesBtwEvents = "-";
				}
			} else {
				$scope.metadata.stream.fpm = "-";
				$scope.metadata.stream.secondsBtwEvents = "-";
				$scope.metadata.stream.minutesBtwEvents = "-";
			}
			
			var colorCounter = 0;
			var view = false;
			var foundFirstToDisplay = false;
			if(typeof $scope.metadata.components != 'undefined' && $scope.metadata.components!=null ){
				for (var int = 0; int < $scope.metadata.components.length; int++) {
					var component = $scope.metadata.components[int];
					var dataType = component.datatype;
					var isEnabled = false;
					var color = "#ccc";
					var display = "none";
					if( "int" == dataType || "long" == dataType || "double" == dataType || "float" == dataType || "longitude" == dataType || "latitude" == dataType){
						isEnabled = true;
						display = "normal";
						if(!foundFirstToDisplay){
							view = true;
							foundFirstToDisplay = true;
						} else
							view = false;
						color = Constants.LINE_CHART_COLORS[colorCounter];
						colorCounter++;
						if(colorCounter>= Constants.LINE_CHART_COLORS.length)
							colorCounter = 0;
					}
					$scope.chartComponentNames.push({name:component.name, view: view, enabled: isEnabled, display: display, color: color, dataType: component.datatype });
				}
			}
			if(!$scope.metadata.icon || $scope.metadata.icon == null)
				$scope.metadata.icon  = "img/stream-icon-default.png";

			if(typeof $scope.metadata.stream.twitter != "undefined" && typeof $scope.metadata.stream.twitter.twtMaxStreamsOfVE!= 'undefined'){ // FIXME verificare
				$scope.twitterPollingInterval  = $scope.metadata.stream.twitter.twtMaxStreamsOfVE*5+1;
			}
			
			if(typeof $scope.metadata.dataset != 'undefined') 
				loadPastData();  
			var keepGoing = true;
			if(typeof tenantDelegateCodes != 'undefined'){
				angular.forEach($scope.metadata.tenantDelegateCodes, function(value) {
					if (keepGoing){
						angular.forEach(tenantsTokens, function(ttValue, ttKey) {
							if ((ttKey == value) && (keepGoing)){
								codiceTenant = ttKey;
								keepGoing = false;
							}
						});
					}
				});
			}
			wsClient.updateStreamTenant($scope.metadata.tenantCode);
			connectWS(); 
		}).error(function(response) {
			console.error("loadDataset", response);
		});

	};
	
	$scope.loadStream();
    $scope.xAxisTickFormatFunction = function(){
        return function(d) {
        	return  d3.time.format("%d/%m/%Y-%H:%M")(new Date(d));
          };
    };
    
    $scope.colorFunction = function() {
    	return function(d, i) {
    		var index = i- Math.floor(i/Constants.LINE_CHART_COLORS.length)*Constants.LINE_CHART_COLORS.length;
    		return Constants.LINE_CHART_COLORS[index];
    	};
    };
    
    $scope.toolTipContentFunction = function(){
    	return function(key, x, y, e, graph) {
    		var tooltipContent  ="";
    		console.log(' key',key);
    		
    		var point = allData[e.pointIndex];
    		tooltipContent += '<h3>' + d3.time.format("%d-%m %H:%M:%S")(new Date(point.datetime)) +'</h3>';
			for (var componentIndex = 0; componentIndex < $scope.chartComponentNames.length; componentIndex++) {
				var name = $scope.chartComponentNames[componentIndex].name;
				tooltipContent += '<p><strong>' + name + ': </strong> '+point.data[name]+'</p>';
			}
        	return  tooltipContent;
    	};
    };
    
	//var maxNumData = 30;
	var allData = [];
	$scope.lastMessageNotReceivedHint = 'DASHBOARD_STREAM_WS_LASTMESSAGE_NOT_RECEIVED';
	var loadPastData = function(){
		var apiCode  = $scope.metadata.dataset.code;

		// call oData service to retrieve  the last 30 data
		var collection = 'Measures';
		if($scope.isTwitter){
			collection = 'SocialFeeds';
		}
		if (!$scope.metadata.apiContexts || $scope.metadata.apiContexts == 'undefined' || $scope.metadata.apiContexts == null ) {
			$scope.metadata.apiContexts = [];
			$scope.metadata.apiContexts.push('odata');
		}

		odataAPIservice.getStreamDataMultiToken(apiCode, null, 0, $scope.maxDataResult.value, 'time%20desc',collection, $scope.metadata.tenantCode, $scope.metadata.tenantDelegateCodes, $scope.metadata.apiContexts[0]).success(function(response) {
			console.log("odataAPIservice.getStreamData",response, collection);
			var oDataResultList = response.d.results;
			if(oDataResultList.length >0){
				for (var oDataIndex = 0; oDataIndex < oDataResultList.length; oDataIndex++) {
					var oDataResult = oDataResultList[oDataIndex];

					var time = Helpers.mongo.date2millis(oDataResult.time);
					var values = {};
					for (var componentIndex = 0; componentIndex < $scope.chartComponentNames.length; componentIndex++) {
						values[$scope.chartComponentNames[componentIndex].name] = oDataResult[$scope.chartComponentNames[componentIndex].name];
					}
					allData.push({datetime: time, data: values});
				}
				$scope.wsLastMessageToShow = allData[0];
				allData.reverse();
				$scope.updateChart();
				if($scope.isTwitter){
					for (var tweetIndex = 0; tweetIndex  < maxNumTweet; tweetIndex++) {
						if(tweetIndex < allData.length){
							var tweet  = {};
							tweet.components = allData[allData.length-tweetIndex-1].data;
							tweet.components.createdAt = Helpers.mongo.date2string(tweet.components.createdAt);
							$scope.tweetData.push(tweet);
						}
					}
					console.log("$scope.tweetData", $scope.tweetData);
				}		
			}
		});
	};
	
	$scope.reloadData = function(){
		allData = [];
		if(typeof $scope.metadata.dataset!= 'undefined')
			loadPastData();
	};

	$scope.updateChart = function() {		
		$scope.chartData = [];
		var colorCounter = 0;
		for (var componentIndex = 0; componentIndex < $scope.chartComponentNames.length; componentIndex++) {
			var component = $scope.chartComponentNames[componentIndex];
			if(component.view){
				var data = [];
				for (var int = 0; int < allData.length; int++) {
					
					var singleData  = allData[int].data[component.name];
					if(component.dataType == "int" || component.dataType == "long" || 
					   component.dataType == "double" || component.dataType == "float" || 
					   component.dataType == "longitude" || component.dataType == "latitude")
						singleData = Number(singleData);
					
					data.push([allData[int].datetime, singleData]);
				}
				$scope.chartData.push({"key" : component.name , "values": data, "color": Constants.LINE_CHART_COLORS[colorCounter]});
			}
			if(component.enabled){
				colorCounter++;
				if(colorCounter>= Constants.LINE_CHART_COLORS.length)
					colorCounter = 0;
			}
		}
	};
	
	
	
	$scope.tweetDetail = null;
	$scope.updateTweet = function(lastTweet){
		if($scope.isTwitter){
			console.log("updateTweet lastTweet",lastTweet);
			//lastTweet.messagePretty = Helpers.render.prettifyTwitterMessage(lastTweet.components.getText);
			//$scope.tweetDetail = lastTweet;
			$scope.tweetData.push(lastTweet);
			if($scope.tweetData.length>maxNumTweet)
				$scope.tweetData.shift();
		}
	};
	
	$scope.showTweetDetail = function(tweet){
		$scope.tweetDetail = tweet;
	};
	
	var wsClient = webSocketService();
	

	$scope.nvWsStatisticData = [{key: "Events", color: '#2980b9', values: []}];
	$scope.nvWsStatisticData[0]["values"].push([0,0]);

	// last message
	$scope.wsLastMessage = "";
	$scope.wsLastMessageToShow = "";

	$scope.connectionCallback=function(sms){		
		$scope.clientConnection=sms;
		if(sms==Constants.WEBSOCKET_CONNECTING){
			$scope.clientConnectionClass="clientConnecting";
		}else if(sms==Constants.WEBSOCKET_NOT_CONNECTED){
			$scope.clientConnectionClass="clientNotConnected";
		}else if(sms==Constants.WEBSOCKET_CONNECTED){
			$scope.clientConnectionClass="clientConnected";
		}
	};
	
	var connectWS = function(){

		wsClient.connect(function(message) {
			console.debug("message", message);  // "/topic/ten1.flussoProva.stat"
			
			$scope.wsUrl = Helpers.stream.wsOutputUrlFromMetadata($scope.metadata);
			console.debug("subscribe wsUrl ", $scope.wsUrl);
			console.debug("subscribe stream ", $scope.metadata.stream);
			console.log("======> tenantStream", $scope.metadata.stream.name);
			wsClient.subscribe($scope.wsUrl, dataCallback, $scope.metadata.stream.name);
		

			$interval(function(){updateStatistics(); }, 2000);
					
		}, function() {
		}, '/',$scope.connectionCallback);
	};
	
	var allTime = [];
	
	var dataCounter = 0;
		
	function dataCallback(message) {
		console.debug("data message", message);
		var messageBody = JSON.parse(message.body);
		console.debug("messageBody", messageBody);
		
		
		for(var int = 0; int <messageBody.values.length; int++){
			var singleData = messageBody.values[int];
			var time = new Date(singleData.time);
			var values = singleData.components;
			if(allData.length >= $scope.maxDataResult.value)
				allData.shift();
			allData.push({datetime: time, data: values});
		}
		
		allTime.push(new Date().getTime());
		dataCounter++;
		
		$scope.updateChart();
		$scope.updateTweet(messageBody.values[0]);
		
		$scope.wsLastMessage = JSON.stringify(messageBody, null, "\t");

		$scope.lastMessageNotReceivedHint = "";
		$scope.wsLastMessageToShow = $scope.wsLastMessage;
	};
	
	$scope.nvWsStatisticForceY = 1;
		
	var updateStatistics  =function(){
		console.log("updateStatistics");
		var now = new Date().getTime();
		//var minTime = now-$scope.statisticTimeInterval.interval*1000;
		$scope.nvWsStatisticData[0]["values"] = [];
		var dataCounter = 0;
		var sampling = $scope.samplingFrequency.value;
		for(var timeCounter = 0; timeCounter>-($scope.statisticTimeInterval.interval-1)/sampling; timeCounter --){
			for (var timeIndex = 0; timeIndex < allTime.length; timeIndex++) {
				var time = allTime[timeIndex];
				var elapsed = now-time;
				if(-elapsed >(timeCounter-1)*sampling*1000 && -elapsed <(timeCounter)*sampling*1000){
					dataCounter++;
				}
			}
			$scope.nvWsStatisticData[0]["values"].push([timeCounter*sampling, dataCounter]);
			dataCounter = 0;
		}
		console.log("data",$scope.nvWsStatisticData);

	};
	
} 
]);

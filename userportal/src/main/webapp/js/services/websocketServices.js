/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

appServices.factory('webSocketService',['$rootScope','upService','WEB_SOCKET_BASE_URL','WEB_SOCKET_USER','WEB_SOCKET_SECRET', 
		function($rootScope,upService, WEB_SOCKET_BASE_URL,WEB_SOCKET_USER,WEB_SOCKET_SECRET) {
	var stompClient = {};	
//	var self = this;
	var root = $rootScope;
	var connectedFlag = false;
	var SingletonClient = null;
	var selfCallback = null;
	var SubscriptedElementsList = [];
	var infoTenant = {};

	var CancelAllSubscriptions = function(){
		for(var i =0; i< SubscriptedElementsList.length ; i++){
			var widget = SubscriptedElementsList[i];
			console.debug(':::: Unsubscribe for ::::', widget);
			widget.unsubscribe();      				  
		}
		SubscriptedElementsList = [];
	};

	function ConnectTheSocket(on_connect, on_error, vhost, count, updateStatus, tenantStream){
		console.debug(':::: Unsubscribe for ::tenantStream::', tenantStream);

		upService.getInfo().success(function(infoTenant){
			if(infoTenant != null && infoTenant.user!=null && infoTenant.user.tenants !=null){
				console.log("infoTenant = ", infoTenant);
				var tenantsTokens = "";
				angular.forEach(infoTenant.user.tenantsTokens, function(value, key) {
					if (key == tenantStream)
						tenantsTokens = value;
				});
				console.debug("tenantsTokens = ", tenantsTokens);
				var user = "";
				if (tenantsTokens == ""){
					user = "Bearer " + infoTenant.user.token;
				} else {
					user = "Bearer " + tenantsTokens;
				}
				
				var password = "";
				console.debug("user = ", user);

				selfCallback = updateStatus;
				CancelAllSubscriptions();

				/*
				 * Fai la disconnect
				 */

				if(connectedFlag){
					stompClient.disconnect(function(){
						connectedFlag=false;
					});
				}

				updateStatus(Constants.WEBSOCKET_CONNECTING);
				stompClient = Stomp.client(WEB_SOCKET_BASE_URL);

				stompClient.connect(user, password, function(frame) {
					connectedFlag=true;
					updateStatus(Constants.WEBSOCKET_CONNECTED);
					root.$apply(function() {
						on_connect.apply(stompClient, frame);
					});
				}, function(frame) {			
					if (count<5) {
						console.debug("Tentativo di riconnessione numero : ",count);
						updateStatus(Constants.WEBSOCKET_CONNECTING);
						setTimeout(function(){ new ConnectTheSocket(on_connect, on_error, vhost, ++count, updateStatus);},count*1000);
						console.debug("awake.. ");		         	       
					} else{
						updateStatus(Constants.WEBSOCKET_NOT_CONNECTED);
						root.$apply(function() {
							console.log(" on_error frame: ", frame);
							on_error.apply(frame);
						});
					}			
				}, vhost);
			}
		});
	};


	function NGStomp() {
		console.debug("Stomp = ", Stomp);
		this.count=1;
		this.streamTenant = null;
	}

	NGStomp.prototype.subscribe = function(queue, callback, tenantStream) {
	 	selfCallback(Constants.WEBSOCKET_CONNECTED);
		var subscribedClient = stompClient.subscribe(queue, function() {
			selfCallback(Constants.WEBSOCKET_CONNECTED);//if I receive a message It means I'm connected
			var args = arguments;			
			$rootScope.$apply(function() {
				//console.debug("args[0]",args[0]);
				callback(args[0]);
			});
		});

		SubscriptedElementsList.push(subscribedClient);

		return subscribedClient;
	};

	NGStomp.prototype.getStatusConnection = function() {
		return StatusConnection;
	};

	NGStomp.prototype.send = function(queue, headers, data) {
		stompClient.send(queue, headers, data);
	};


	NGStomp.prototype.connect = function(on_connect, on_error, vhost, updateStatus) {
		this.count=1;
		if(!updateStatus)
			updateStatus = function(sms){
			//console.debug(sms);
		};
		updateStatus(Constants.WEBSOCKET_CONNECTING);
		new ConnectTheSocket(on_connect, on_error, vhost, this.count, updateStatus, this.streamTenant);

	};

	NGStomp.prototype.unsubscribeAll = function(){
		CancelAllSubscriptions();
	};


	NGStomp.prototype.disconnect = function(callback) {
		stompClient.disconnect(function() {
			var args = arguments;
			$rootScope.$apply(function() {
				callback.apply(args);
			});
		});
	};
	
	NGStomp.prototype.updateStreamTenant = function(tnt){
		this.streamTenant = tnt;
	}

	return function(url,updateStatus) {
		if(!SingletonClient){
			if(!updateStatus){ 
				updateStatus=function(sms){
					//console.debug(sms);
				};
			}
			SingletonClient = new NGStomp(url,updateStatus);
		}
		return SingletonClient;
	};
}]);

var WebsocketStompSingleton= (function() {    
	var clientInstance; //private variable to hold the
	//only instance of client that will exits.


	var SubscriptionList = [];
	var SubscriptedElementsList = [];
	var connectedClient = false;


	var CancelAllSubscriptions = function(){
		for(var i =0; i< SubscriptedElementsList.length ; i++){
			var widget = SubscriptedElementsList[i];
			console.debug(':::: Unsubscribe for ::::', widget);
			widget.unsubscribe();      				  
		}
		SubscriptionList = [];
		SubscriptedElementsList = [];
	};

	var createClient = function(settings,count,updateStatus){ 
		var intSettings = settings;	                    
		var client = Stomp.client(intSettings.ws_url);
		var usr = "Bearer " + infoUser.info.user.token;
		client.connect(usr, "", function(frame) { //success Callback
			updateStatus(Constants.WEBSOCKET_CONNECTED);
			for(var i =0; i< SubscriptionList.length ; i++){
				var widget = SubscriptionList[i];
				console.debug(':::: subscribe for ::::', widget);
				SubscriptedElementsList.push( client.subscribe(widget.keyTopic,widget.keyCallback));

			}
			console.debug(':::: Finish with the subscribe:::::');
			connectedClient=true;
		},
		function(frame) //error Callback
		{

			if (count<5) {
				updateStatus(Constants.WEBSOCKET_CONNECTING);
				console.debug("createClient count ::::::::::::: ",count);    						       
				setTimeout(function(){createClient(intSettings,++count);},count*1000);
				console.debug("awake.. ");		         	       
			} else{
				updateStatus(Constants.WEBSOCKET_NOT_CONNECTED);
				console.debug(':::: Impossibile connettersi::::');
			}	
		});


		return {
			getWebClient: function(){               		 

				return client;
			},
			addSubscription : function(topic,callback){
				if(connectedClient){
					console.debug(':::: addSubscription Client connesso::::');
					SubscriptionList.push({
						keyTopic:topic,
						keyCallback:callback
					});
					client.subscribe(topic,callback);
				}else{
					console.debug(':::: addSubscription Client NON connesso Add to SubscriptionList::::');
					SubscriptionList.push({
						keyTopic:topic,
						keyCallback:callback
					});
				}
			},
			cancelAllSubscriptions:CancelAllSubscriptions
		};                         
	};

	return {
		getInstance: function(settings,updateStatus){
			if(clientInstance) return clientInstance; //se gia creato lo ritorna

			if(!settings)	  return null; // se non e' creato e non ci sono le settings ritorna null; 

			if(!clientInstance){
				console.debug("::::  New Stomp Client Created ::::");
				if(!updateStatus){ 
					updateStatus=function(sms){
						console.debug(sms);
					};
				}
				updateStatus(Constants.WEBSOCKET_CONNECTING);
				clientInstance = createClient(settings,1,updateStatus);              	  
			}
			return clientInstance;
		}
	};
})();


var ws = require("ws");

var client_counter = 0;
var clients = [];

var WebSocketServer = require('ws').Server, wss = new WebSocketServer({
	port : 8004
});

wss.on('connection', function(ws) {
	console.log('client connected', ws.upgradeReq.headers.origin + " - id: " + ws.id);
	var id = client_counter++;
	clients[id] = ws;
	ws.id = id;
}).on('close', function() {
	console.log('client disconnected', ws.upgradeReq.headers.origin + " - id: " + ws.id);
	delete clients[ws.id];
});

var clientStatistics_counter = 0;
var clientsStatistics = [];

var WebSocketServer = require('ws').Server, wssStatistic = new WebSocketServer({
	port : 8005,path: '/stats'
});

wssStatistic.on('connection', function(ws) {
	console.log('client connected', ws.upgradeReq.headers.origin + " - id: " + ws.id);
	var id = clientStatistics_counter++;
	clientsStatistics[id] = ws;
	ws.id = id;
}).on('close', function() {
	console.log('client disconnected', ws.upgradeReq.headers.origin + " - id: " + ws.id);
	delete clientsStatistics[ws.id];
});



var stop = sendMessagesTimer();

function sendMessagesTimer() {
	var timer = 0;
	var counter = 0;
	var numEventsLast30Sec = 0;
	var start = new Date();
	function run() {
		console.log("send message " + counter);
		sendMessage('something ' + counter);
		numEventsLast30Sec++;
		counter++;
		timer = setTimeout(run, 1000);
		console.log(new Date() - start);
		if ((new Date() - start) > 10000) {
			sendMessage('passati 30 sec ' + counter);
			start = new Date();
		}

	}
	timer = setTimeout(run, 1000);

	return stop;

	function stop() {
		if (timer) {
			clearTimeout(timer);
			timer = 0;
		}
	}

}

function sendMessage(message){
	for (index in clients) {
		console.log("send message to " + index);
		try {
			//clients[index].send(message);
		} catch (error) {
			console.log(error);
			if (error == 'Error: not opened') {
				clients.splice(index, 1);
			}
		}
	}
	
	var numEvents =  parseInt(Math.random() * (15 - 5) + 5);
	for (index in clientsStatistics) {
		console.log("send message to " + index);
		try {
			var statistic  = '{"event":{"payloadData":{"numEventsLast30Sec":'+numEvents+'}}}';
			clientsStatistics[index].send(statistic);
		} catch (error) {
			console.log(error);
			if (error == 'Error: not opened') {
				clientsStatistics.splice(index, 1);
			}
		}
	}
}

/*
 * 
 * var WebSocketServer = require('ws').Server, wss = new WebSocketServer({ port :
 * 8002 });
 * 
 * 
 * var WebSocketServer = require('ws').Server, wssStats = new WebSocketServer({
 * port : 8003 });
 * 
 * 
 * wss.on('connection', function(ws) { console.log('client connected',
 * ws.upgradeReq.headers.origin + " - id: " + ws.id); ws.on('message',
 * function(message) { console.log('received: %s', message); });
 * 
 * var stop = sendMessagesTimer(ws);
 * 
 * ws.on('close', function() { console.log('client disconnected',
 * ws.upgradeReq.headers.origin + " - id: " + ws.id); stop(); });
 * 
 * });
 * 
 * 
 * 
 * function sendMessagesTimer(ws, wssStats) { var timer = 0; var counter = 0;
 * var numEventsLast30Sec = 0; var start = Date.getMilliseconds(); function
 * run() { ws.send('something ' + counter); numEventsLast30Sec++; counter++;
 * timer = setTimeout(run, 1000); if(Date.getMilliseconds()-start>30000){ start =
 * Date.getMilliseconds(); wssStats.send(counter); } } timer = setTimeout(run,
 * 1000);
 * 
 * return stop;
 * 
 * function stop() { if (timer) { clearTimeout(timer); timer = 0; } } }
 */
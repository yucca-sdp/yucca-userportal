var WebSocketServer = require('ws').Server, wss = new WebSocketServer({
	port : 8002
});


var WebSocketServer = require('ws').Server, wssStats = new WebSocketServer({
	port : 8003
});


wss.on('connection', function(ws) {
	console.log('client connected', ws.upgradeReq.headers.origin + " - id: " + ws.id);
	ws.on('message', function(message) {
		console.log('received: %s', message);
	});
	
	var stop = sendMessagesTimer(ws);

	ws.on('close', function() {
		console.log('client disconnected',  ws.upgradeReq.headers.origin + " - id: " + ws.id);
		stop();
	});

});



function sendMessagesTimer(ws, wssStats) {
	var timer = 0;
	var counter = 0;
	var numEventsLast30Sec = 0;
	var start = Date.getMilliseconds();
	function run() {
		ws.send('something ' + counter);
		numEventsLast30Sec++;
		counter++;
		timer = setTimeout(run, 1000);
		if(Date.getMilliseconds()-start>30000){
			start = Date.getMilliseconds();
			wssStats.send(counter);
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
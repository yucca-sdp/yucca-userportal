var WebSocket = require('ws'), ws = new WebSocket('ws://localhost:8002/');
ws.on('open', function() {
	ws.send('something');
});
ws.on('message', function(message) {
	console.log('received: %s', message);
});
var socket = io();

socket.on('connect', function () {
	console.log('[index.html] Connected to server...');
});

socket.on('disconnect', function () {
	console.log('[index.html] Disconnected from server...')
});

socket.on('newMessage', function (msg) {
	console.log('Message', msg);
});

socket.on('welcomeMessage', function (msg) {
	console.log(msg.text + ' at ' + msg.createdAt.toString());
});

socket.on('newUserJoined', function (msg) {
	console.log(msg.text + ' at ' + msg.createdAt.toString());
});
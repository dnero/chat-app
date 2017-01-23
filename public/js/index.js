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
var socket = io();

// listen for these events to be emitted
socket.on('connect', function () {
	console.log('[index.html] Connected to server...');
});

socket.on('disconnect', function () {
	console.log('[index.html] Disconnected from server...')
});

socket.on('newMessage', function (msg) {
	console.log('Message', msg);

	var li = jQuery('<li></li>');
	li.text(`${msg.from}: ${msg.text}`);

	jQuery('#messages').append(li);
});

socket.on('welcomeMessage', function (msg) {
	console.log(msg.text + ' at ' + msg.createdAt.toString());
});

socket.on('newUserJoined', function (msg) {
	console.log(msg.text + ' at ' + msg.createdAt.toString());
});


var form = new Vue({
	el: '#message-form',
	data: {
		message: ''
	},
	methods: {
		sendMessage: function () {
			socket.emit('createMessage', {
				from: 'User',
				text: this.message
			}, function () {

			});
			console.log(this.message);
		}
	}
});
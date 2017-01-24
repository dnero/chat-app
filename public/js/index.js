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

socket.on('newLocationMessage', function (message) {
	var li = jQuery('<li></li>');
	var a = jQuery('<a target="_blank">My current location</a>')

	li.text(`${message.from}: `);
	a.attr('href', message.url);
	li.append(a);
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

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by your browser');
	}

	navigator.geolocation.getCurrentPosition(function (position) {
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
		
	}, function () {
		alert('Unable to fetch location');
	});
});
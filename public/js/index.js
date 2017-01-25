var socket = io();

socket.on('connect', function () {
	console.log('[index.html] Connected to server...');
});

socket.on('disconnect', function () {
	console.log('[index.html] Disconnected from server...')
});

socket.on('newMessage', function (msg) {
	var formattedTime = moment(msg.createdAt).format('h:mm a');
	let template = jQuery('#message-template').html();
	let html = Mustache.render(template, {
		text: msg.text,
		from: msg.from,
		createdAt: formattedTime
	});
	
	jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function (message) {
	let formattedTime = moment(message.createdAt).format('h:mm a');
	let template = jQuery('#location-message-template').html();
	let html = Mustache.render(template, {
		//text: message.text,
		from: message.from,
		url: message.url,
		createdAt: formattedTime
	});
	console.log('message from nlm = ', message);
	jQuery('#messages').append(html);
	
	// var li = jQuery('<li></li>');
	// var a = jQuery('<a target="_blank">My current location</a>');
	//
	// li.text(`${message.from} ${formattedTime}: `);
	// a.attr('href', message.url);
	// li.append(a);
	// jQuery('#messages').append(li);
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
				form.message = '';
				console.log('calling back');
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

	locationButton.attr('disabled', 'disabled').text('Sending location...');

	navigator.geolocation.getCurrentPosition(function (position) {
		locationButton.removeAttr('disabled').text('Send location');

		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
		
	}, function () {
		locationButton.removeAttr('disabled').text('Send location');
		alert('Unable to fetch location');
	});
});
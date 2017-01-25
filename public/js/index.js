var socket = io();

function scrollToBottom() {
	var messages = jQuery('#messages'),
		newMessage = messages.children('li:last-child'),
		newMessageHeight = newMessage.innerHeight(),
		lastMessageHeight = newMessage.prev().innerHeight(),
		clientHeight = messages.prop('clientHeight'),
		scrollTop = messages.prop('scrollTop'),
		scrollHeight = messages.prop('scrollHeight');

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	}
}

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
	scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
	let formattedTime = moment(message.createdAt).format('h:mm a');
	let template = jQuery('#location-message-template').html();
	let html = Mustache.render(template, {
		from: message.from,
		url: message.url,
		createdAt: formattedTime
	});
	console.log('message from nlm = ', message);
	jQuery('#messages').append(html);
	scrollToBottom();
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
				//console.log('calling back');
			});
			//console.log(this.message);
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
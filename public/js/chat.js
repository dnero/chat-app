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
	let params = jQuery.deparam(window.location.search);
	
	socket.emit('join', params, function (err) {
		if (err) {
			alert(err);
			window.location.href = '/';
		} else {
			console.log('No error');
		}
	});
});

socket.on('disconnect', function () {
	console.log('[chat.html] Disconnected from server...')
});

socket.on('updateUserList', function (users) {
	var ol = jQuery('<ol></ol>');
	users.forEach(function (user) {
		ol.append(jQuery('<li></li>').text(user));
	});

	jQuery('#users').html(ol);
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
	jQuery('#messages').append(html);
	scrollToBottom();
});

var form = new Vue({
	el: '#message-form',
	data: {
		message: ''
	},
	methods: {
		sendMessage: function () {
			socket.emit('createMessage', {
				text: this.message
			}, function () {
				form.message = '';
			});
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
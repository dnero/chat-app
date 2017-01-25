const path = require('path');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;


let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('[server.js] New user connected...');

	socket.emit('welcomeMessage', generateMessage('Admin', 'Welcome to the chat app.'));
	
	socket.broadcast.emit('newUserJoined', generateMessage('Admin', 'New user joined.'));

	socket.on('createMessage', (msg, cb) => {
		console.log('createMessage', msg);
		// socket.emit = emits an event to a single connection
		// io.emit = emits an event to all connections
		// broadcast = send message to all but one user
		io.emit('newMessage', generateMessage(msg.from, msg.text));

		cb();
	});

	socket.on('createLocationMessage', (coords) => {
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
	});
	
	socket.on('disconnect', () => {
		console.log('[server.js] User was disconnected...');
	});
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}...`);
});
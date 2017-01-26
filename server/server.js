const path = require('path');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const http = require('http');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;


let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

// socket.emit = emits an event to a single user (connection)
// io.emit = emits an event to all connections
// io.to('Room Name').emit = emits an event to all users in a specific room
// socket.broadcast.emit = send message to all but self
// socket.broadcast.to('Room Name').emit = send message to all but self
// socket.join = joins a room
// socket.leave = leaves a specific room

app.use(express.static(publicPath));

io.on('connection', (socket) => {

	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and room name are required.');
		}

		socket.join(params.room);
		users.removeUser(socket.id); // remove user from any previous rooms
		users.addUser(socket.id, params.name, params.room); // add user to specified room

		io.to(params.room).emit('updateUserList', users.getUserList(params.room)); // emit an event to everyone in the room

		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

		callback();
	});

	socket.on('createMessage', (msg, cb) => {
		let user = users.getUser(socket.id)[0];

		if (user && isRealString(msg.text)) {
			io.to(user.room).emit('newMessage', generateMessage(user.name, msg.text));
		}
console.log(msg, user);
		cb();
	});

	socket.on('createLocationMessage', (coords) => {
		let user = users.getUser(socket.id)[0];

		if (user) {
			io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
		}
	});
	
	socket.on('disconnect', () => {
		let user = users.removeUser(socket.id); // remove current user

		if (user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left...`));
		}
	});
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}...`);
});
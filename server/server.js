const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;


let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('[server.js] New user connected...');

	socket.emit('newMessage', {
		from: 'jbe@food.com',
		text: 'See ya boi',
		cratedAt: 232335
	});

	socket.emit('createMessage', (msg) => {
		console.log('Createmessage', msg);
	});

	socket.on('disconnect', () => {
		console.log('[server.js] User was disconnected...');
	});
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}...`);
});
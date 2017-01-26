[{
	id: 'ljb112lk3jb12kjb51l325',
	name: 'DIN',
	room: 'Devs'
}]

// addUser (id, name, room)
// removeUser (id)
// getUser (id)
// getUserList (room)

class Users {
	constructor () {
		this.users = [];
	}

	addUser (id, name, room) {
		let user = {id, name, room};
		this.users.push(user);
		return user;
	}

	removeUser (id) {
		let userToRemove = this.users.filter((user) => user.id === id);
		this.users = this.users.filter((user) => user.id !== id);
		
		return userToRemove;
	}

	getUser (id) {
		return this.users.filter((user) => user.id === id);
	}

	getUserList (room) {
		let users = this.users.filter((user) => user.room === room);
		let namesArray = users.map((user) => user.name);
		return namesArray;
	}
}

module.exports = {Users};


// class Person {
// 	constructor (name, age) {
// 		this.name = name;
// 		this.age = age;
// 	}
//
// 	getUserDescription () {
// 		return `${this.name} is ${this.age} years old.`;
// 	}
// }
//
// let me = new Person('DIN', 34);
//
// console.log(me.getUserDescription());


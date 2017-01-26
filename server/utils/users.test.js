const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
	
	let users;
	
	beforeEach(() => {
		users = new Users();
		users.users = [{
			id: '1',
			name: 'Mike',
			room: 'Node Course'
		}, {
			id: '2',
			name: 'Jen',
			room: 'Vue Course'
		}, {
			id: '3',
			name: 'Ben',
			room: 'Vue Course'
		}];
	});
	
	it('should add new user', () => {
		let users = new Users();
		let user = {
			id: '123',
			name: 'Deon',
			room: 'War room'
		};

		let resUser = users.addUser(user.id, user.name, user.room);
		
		expect(users.users).toEqual([user]);
	});
	
	it('should return names for Vue course', () => {
		let userList = users.getUserList('Vue Course');
		
		expect(userList).toEqual(['Jen', 'Ben']);
	});

	it('should return names for Node course', () => {
		let userList = users.getUserList('Node Course');

		expect(userList).toEqual(['Mike']);
	});
	
	it('should remove a user', () => {
		let amountOfUsers = users.users.length;
		let userToRemove = users.users[0];
		let removedUser = users.removeUser(userToRemove.id);
		
		expect(removedUser).toEqual([userToRemove]); // ensure that proper user is returned
		expect(users.users.length).toBe(amountOfUsers - 1); // expect one less user to be present
	});
	
	it('should not remove a user', () => {
		let amountOfUsers = users.users.length;
		let userToRemove = 'invalidID';
		let removedUser = users.removeUser(userToRemove);

		expect(removedUser).toEqual([]); // ensure that no user is returned
		expect(users.users.length).toBe(amountOfUsers); // expect same amount of users to be present
	});
	
	it('should find user', () => {
		let user = users.users[0];
		let foundUser = users.getUser(user.id);
		
		expect(foundUser).toEqual([user]);
	});
	
	it('should not find user', () => {
		let invalidUser = users.getUser('invalidID');

		expect(invalidUser).toEqual([]);
	});
});
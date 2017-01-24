const expect = require('expect');

let {generateMessage} = require('./message');

describe('generateMessage', () => {
	it('should generate the correct message object', () => {
		
		let from = 'DIN',
			text = 'Bazinga',
			message = generateMessage(from, text);
		
		expect(message.createdAt).toBeA('number');
		expect(message).toInclude({
			from,
			text
		});
	});
});
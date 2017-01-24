const expect = require('expect');

let {generateMessage, generateLocationMessage} = require('./message');

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

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
	    
	    let from = 'DIN',
		    lat = 7,
		    lng = 7,
		    location = generateLocationMessage(from, lat, lng),
		    url = `https://www.google.com/maps?q=${lat},${lng}`;
	    
	    expect(location.createdAt).toBeA('number');
	    expect(location).toInclude({from, url});
    });
});
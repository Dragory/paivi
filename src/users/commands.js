const Users = require('./Users');
const moment = require('moment');

let knownUsers = {};

module.exports = (bot) => {
	bot.on('message', (msg, next) => {
		const props = {
			username: msg.from.username,
			firstName: msg.from.first_name,
			lastName: msg.from.last_name
		};

		Users.findById(msg.from.id).then(user => {
			if (user) {
				Users.update(props, {where: {id: msg.from.id}});
			} else {
				Users.create(Object.assign({
					id: msg.from.id
				}, props));
			}
		});

		next();
	});
};
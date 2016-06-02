const Users = require('./Users');

let knownUsers = {};

module.exports = (Bot) => {
	Bot.on('message', msg => {
		const props = {
			username: msg.user.username,
			firstName: msg.user.first_name,
			lastName: msg.user.last_name
		};

		Users.findById(msg.user.id).then(user => {
			if (user) {
				Users.update(props, {where: {id: msg.user.id}});
			} else {
				Users.create(Object.assign({
					id: msg.user.id
				}, props));
			}
		});
	});
};
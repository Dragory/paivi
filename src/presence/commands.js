const Presence = require('./Presence');
const moment = require('moment');

module.exports = (bot) => {
	bot.on('message', (msg, next) => {
		Presence.upsert({
			chatId: msg.chat.id,
			userId: msg.from.id,
			lastSeenAt: moment.utc().format()
		});

		next();
	});
};
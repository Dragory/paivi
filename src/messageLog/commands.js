const MessageLog = require('./MessageLog');
const moment = require('moment');

module.exports = (bot) => {
	bot.on('message', (msg, next) => {
		console.log('message id:', msg.message_id);
		MessageLog.create({
			chatId: msg.chat.id,
			userId: msg.from.id,
			messageId: msg.message_id,
			message: JSON.stringify(msg),
			loggedAt: moment.utc().format()
		});

		next();
	});
};
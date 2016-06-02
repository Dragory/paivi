const DB = require('../db');

const Stats = DB.define('stats', {
	chatId: {
		type: DB.INTEGER,
		field: 'chat_id'
	},
	userId: {
		type: DB.INTEGER,
		field: 'user_id'
	},
	messages: DB.INTEGER,
	letters: DB.INTEGER,
	uppercaseLetters: {
		type: DB.INTEGER,
		field: 'uppercase_letters'
	},
	lowercaseLetters: {
		type: DB.INTEGER,
		field: 'lowercase_letters'
	},
	quote: DB.STRING(128),
	quoteQueue: {
		type: DB.TEXT,
		field: 'quote_queue'
	},
	arrivalDate: {
		type: DB.DATE
	}
}, {
	freezeTableName: true
});

module.exports = Stats;
const repo = require('./Generate');
const markov = require('./markov');

const MAX_LENGTH = 80;

const getRandomLength = () => {
	return 6 + Math.floor(Math.random() * 32);
};

module.exports = (bot) => {
	let handled = false;

	bot.on('message', (msg, next) => {
		handled = false;

		if (msg.text[0] === '/') return next();

		const table = markov.parseText(msg.text);
		markov.mergeTableIntoDatabase(table, msg.chat.id);

		next();
	});

	bot.onText(/^\/generate\s+([0-9]+)\s+(.+)$/i, (msg, match, next) => {
		if (handled) return;
		handled = true;

		let length = parseInt(match[1], 10);
		let start = match[2] + ' ';

		length = Math.min(MAX_LENGTH, Math.max(1, length));

		markov.generate(msg.chat.id, length, start).then(result => {
			if (result.length > MAX_LENGTH) result = result.slice(0, MAX_LENGTH);
			bot.sendMessage(msg.chat.id, result.join('')).then(next);
		});
	});

	bot.onText(/^\/generate\s+(.+)$/i, (msg, match, next) => {
		if (handled) return;
		handled = true;

		let start = match[1] + ' ';
		markov.generate(msg.chat.id, getRandomLength(), start).then(result => {
			if (result.length > MAX_LENGTH) result = result.slice(0, MAX_LENGTH);
			bot.sendMessage(msg.chat.id, result.join('')).then(next);
		});
	});

	bot.onText(/^\/generate$/i, (msg, match, next) => {
		if (handled) return;
		handled = true;

		markov.generate(msg.chat.id, getRandomLength()).then(result => {
			bot.sendMessage(msg.chat.id, result.join('')).then(next);
		});
	});
};
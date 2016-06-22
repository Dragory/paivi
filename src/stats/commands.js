const Stats = require('./Stats');
const StatsQuotes = require('./StatsQuotes');
const Users = require('../users/Users');
const moment = require('moment');
const names = require('../utils/names');
const utils = require('../utils/utils');

const MAX_QUOTES_IN_QUEUE = 20;
const MAX_QUOTE_LENGTH = 60;
const MIN_QUOTE_LIFETIME = 1000 * 60 * 10;
const MAX_QUOTE_LIFETIME = 1000 * 60 * 60 * 2;
const NEW_QUOTE_CHANCE = 10; // Percentage

const UPPERCASE_REGEX = /[A-ZÄÅÖ]/g;
const LOWERCASE_REGEX = /[a-zäåö]/g;
const NUMBER_REGEX = /\-?(([0-9]+([.,][0-9]+)?)|([.,][0-9]+))/g;

const formatStats = (stats, name) => {
	let quoteLine = name;

	if (stats.quotes.length) {
		const nameWords = name.split(/\s+/);

		if (nameWords.length > 1) {
			quoteLine = `${nameWords[0]} "${stats.quotes[0].body}" ${nameWords.slice(1).join(' ')}`;
		} else {
			quoteLine = `${name} "${stats.quotes[0].body}"`;
		}
	}

	const messages = utils.formatNum(stats.messages, 0);

	const arrivalDate = moment.utc(stats.arrivalDate).format('MMMM Do, YYYY');
	const lettersPerMessage = utils.formatNum((stats.letters / Math.max(1, stats.messages)), 2);
	const wordsPerMessage = utils.formatNum((stats.words / Math.max(1, stats.messages)), 2);

	const daysSinceArrivalDate = Math.max(1, moment.utc().diff(stats.arrivalDate, 'days'));
	const messagesPerDay = utils.formatNum((stats.messages / daysSinceArrivalDate), 2);

	return `
		${quoteLine}
		${messages} messages since ${arrivalDate}
		${lettersPerMessage} letters/msg, ${wordsPerMessage} words/msg, ${messagesPerDay} msg/day
	`.trim().replace(/^\s+/gm, '');
};

const getRandomExpiresAt = () => {
	const lifetime = MIN_QUOTE_LIFETIME + Math.floor(Math.random() * (MAX_QUOTE_LIFETIME - MIN_QUOTE_LIFETIME));
	return moment.utc().add(lifetime);
};

module.exports = (bot) => {
	bot.on('text', function(msg, next) {
		if (msg.text[0] === '/') return next();

		Stats.find({
			where: {chatId: msg.chat.id, userId: msg.from.id},
			include: [{model: StatsQuotes, as: 'quotes', order: [['createdAt', 'ASC']]}]
		}).then(stats => {
			if (! stats) {
				return Stats.create({
					chatId: msg.chat.id,
					userId: msg.from.id,
					arrivalDate: moment.utc().format(),
					quoteQueue: '[]'
				}).then(() => {
					return Stats.find({
						where: {chatId: msg.chat.id, userId: msg.from.id},
						include: [{model: StatsQuotes, as: 'quotes', order: [['createdAt', 'ASC']]}]
					});
				});
			}

			return stats;
		}).then(stats => {
			stats.messages += 1;
			stats.letters += msg.text.replace(/\s+/, '').length;
			stats.words += msg.text.trim().split(/\s+/).length;
			stats.uppercaseLetters += (msg.text.match(UPPERCASE_REGEX) || []).length;
			stats.lowercaseLetters += (msg.text.match(LOWERCASE_REGEX) || []).length;

			if (stats.quotes.length >= 2) {
				const now = moment.utc();
				const firstQuote = stats.quotes[0];
				const firstQuoteExpiry = moment.utc(firstQuote.expiresAt);

				if (now > firstQuoteExpiry) {
					// No need to wait for this to finish, but reflect the change in stats.quotes anyway
					StatsQuotes.destroy({where: {id: firstQuote.id}});
					stats.quotes.splice(stats.quotes.indexOf(firstQuote), 1);
				}
			}

			if (stats.quotes.length === 0) {
				// If there are no quotes, add current message regardless of NEW_QUOTE_CHANCE
				StatsQuotes.create({
					statsId: stats.id,
					body: msg.text,
					expiresAt: getRandomExpiresAt().format()
				});
			} else if (stats.quotes.length < MAX_QUOTES_IN_QUEUE) {
				// If the queue has space for more quotes, add messages by random chance
				if (Math.random() < (NEW_QUOTE_CHANCE / 100)) {
					StatsQuotes.create({
						statsId: stats.id,
						body: msg.text,
						expiresAt: getRandomExpiresAt().format()
					});
				}
			}

			Stats.update({
				messages: stats.messages,
				letters: stats.letters,
				words: stats.words,
				uppercaseLetters: stats.uppercaseLetters,
				lowercaseLetters: stats.lowercaseLetters,
			}, {where: {id: stats.id}}).then(next);
		});
	});

	bot.onText(/\/stats/i, (msg, match, next) => {
		Stats.find({
			where: {chatId: msg.chat.id, userId: msg.from.id},
			include: [{model: StatsQuotes, as: 'quotes', order: [['createdAt', 'ASC']]}]
		}).then(stats => {
			if (! stats) return next();

			const name = names.get(msg.from);
			const formatted = formatStats(stats, name);

			bot.sendMessage(msg.chat.id, formatted).then(next);
		});
	});
};
const repo = require('./Generate');

const MAX_LOOKBEHIND = 2;
const START_PART_KEY = '0';
const END_PART_KEY = '1';

const getNextWeightedPart = (chatId, prev) => {
	return repo.find({
		where: {
			chatId: chatId,
			prev: prev
		},

		order: '-LOG(RAND()) / weight'
	}).then(row => {
		if (! row) return null;
		return row.next;
	});
};

const splitIntoChunks = (str) => {
	const CHUNK_LEN = 3;
	let chunks = [];
	let strLeft = str;

	while (strLeft.length > 0) {
		let match = strLeft.match(/^(.*?)[bcdfghjklmnprstvwxz\.$]/i);
		let chunk = (match ? match[1] : null);

		if (! chunk || chunk.length === 0) chunk = strLeft.slice(0, 3);

		chunks.push(chunk);
		strLeft = strLeft.slice(chunk.length);
	}

	return chunks;
};

const cleanString = (str) => {
	let originalHasTrailingWhitespace = (str.match(/\s+$/) !== null);

	let cleaned = str
		.replace(/\b[a-z]:\/\/.*\b/ig, '') // remove protocol:// links
		.replace(/\bwww\..*\b/ig, '') // remove www. links
		.replace(/\s+/, ' '); // normalize whitespace

	// Preserve trailing whitespace if the original string had it
	if (originalHasTrailingWhitespace) cleaned = cleaned.replace(/^\s+/, '');
	else cleaned = cleaned.trim();

	return cleaned;
};

const parseText = (str, table) => {
	str = cleanString(str);
	const parts = splitIntoChunks(str);
	
	if (! table) table = {};
	
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i];

		// Start parts
		if (i === 0) {
			if (! table[START_PART_KEY]) {
				table[START_PART_KEY] = {};
			}

			if (table[START_PART_KEY][part]) {
				table[START_PART_KEY][part] = table[START_PART_KEY][part] + 1;
			} else {
				table[START_PART_KEY][part] = 1;
			}
		}

		// Chain
		for (let lookbehindCount = 1; lookbehindCount <= MAX_LOOKBEHIND; lookbehindCount++) {
			let lookbehindIndex = i - lookbehindCount;
			if (lookbehindIndex < 0) continue;

			let key = parts.slice(lookbehindIndex, lookbehindIndex + lookbehindCount).map(w => w.toLowerCase());
			key = JSON.stringify(key);

			if (! table[key]) {
				table[key] = {};
			}

			let partWeights = table[key];
			let newWeight = 0;

			if (partWeights[part]) {
				newWeight = partWeights[part] + 1;
			} else {
				newWeight = 1;
			}

			partWeights[parts[i]] = newWeight;
		}
	}

	return table;
};

function mergeTableIntoDatabase(table, chatId) {
	let promises = [];

	for (const prev in table) {
		for (const next of Object.keys(table[prev])) {
			let promise = repo.find({where: {chatId, prev, next}}).then(row => {
				if (row) {
					// If this chatId/prev/next row already exists, increase the weight
					return repo.update({weight: row.weight + table[prev][next]}, {where: {id: row.id}});
				} else {
					// Otherwise create a new record with default weight
					return repo.create({
						chatId: chatId,
						prev: prev,
						next: next,
						weight: table[prev][next]
					});
				}
			});

			promises.push(promise);
		}
	}

	return Promise.all(promises);
}

function generate(chatId, length, start, addStartLength = true) {
	if (start) start = cleanString(start);
	let hasCustomStart = false;

	let startPromise;
	if (start != null && start !== '') {
		hasCustomStart = true;
		let parts = splitIntoChunks(start);
		console.log('start parts', parts);
		startPromise = Promise.resolve(parts);
	} else {
		addStartLength = false;
		startPromise = getNextWeightedPart(chatId, START_PART_KEY).then(str => {
			if (str == null) throw new Error('No start data');
			return [str];
		});
	}

	return startPromise
		.then(parts => {
			if (addStartLength) length += start.length;

			let first = true;

			const nextPart = (parts, lookbehind = 1) => {
				if (lookbehind === 0) return null;

				let prev = parts.slice(-1 * lookbehind).map(w => w.toLowerCase());
				prev = JSON.stringify(prev);

				return getNextWeightedPart(chatId, prev).then(next => {
					if (next) return next;
					return nextPart(parts, lookbehind - 1);
				});
			};

			const build = (parts) => {
				if (parts.length >= length) return parts;

				return nextPart(parts, MAX_LOOKBEHIND).then(part => {
					const wasFirst = first;
					first = false;

					// If we found a next part, keep building the string
					if (part) {
						return build(parts.concat(part));
					}

					// Otherwise, if we had a custom start and didn't find a continuation for it,
					// get a random start part instead; this way the bot won't just be parroting
					// custom starts when it can't continue from them
					if (hasCustomStart && wasFirst) {
						return repo.find({order: 'RAND()'}).then(row => {
							if (! row) return parts;
							return build(parts.concat(row.next));
						});
					}

					// Otherwise just end here, return the parts
					return parts;
				});
			};

			return build(parts);
		});
}

module.exports = {parseText, generate, mergeTableIntoDatabase, splitIntoChunks};

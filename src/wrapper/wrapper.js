const Queue = require('./queue');

module.exports = function(bot) {
	let queue = new Queue();
	queue.setItemTimeout(4000);

	let wrapper = new Proxy(bot, {
		get: function(target, name) {
			if (name === 'on') {
				return function(ev, listener) {
					// "Shadow" bot events with our queue
					return target.on(ev, function() {
						let args = Array.from(arguments);
						queue.add(next => {
							// Call the original listener with additional next argument
							listener.apply(null, args.concat(next));
						});
					});
				}
			} else if (name === 'onText') {
				// Shadow the regex-matching onText function
				return function(regex, listener) {
					return target.onText(regex, function() {
						let args = Array.from(arguments);
						queue.add(next => {
							// Call the original listener with additional next argument
							listener.apply(null, args.concat(next));
						});
					});
				};
			}

			return target[name];
		}
	});

	return wrapper;
};
module.exports = function() {
	// Setup associations
	const modelPaths = {
		'Users':       './users/Users',
		'Stats':       './stats/Stats',
		'StatsQuotes': './stats/StatsQuotes',
		'Generate':    './generate/Generate',
	};

	let models = {};

	Object.keys(modelPaths).forEach(modelName => {
		models[modelName] = require(modelPaths[modelName]);
	});

	Object.keys(models).forEach(modelName => {
		if ('associate' in models[modelName]) {
			models[modelName].associate(models);
		}
	});
};

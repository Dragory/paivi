const rawConfig = require('../config.json');
const dbConfig = require('../db.json');

const defaults = {
	"token": null,
	"database": dbConfig.default
};

const deepExtend = (target, ...sources) => {
	for (const source of sources) {
		for (const key in source) {
			if (! target.hasOwnProperty(key) || target[key] == null) {
				// No existing key in target, set directly
				target[key] = source[key];
			} else if (Array.isArray(target[key])) {
				if (Array.isArray(source[key])) {
					// Source and target values are both arrays, concat together
					target[key] = target[key].concat(source[key]);
				} else {
					// Incompatible types, overwrite
					target[key] = source[key];
				}
			} else if (typeof target[key] === 'object') {
				if (typeof source[key] === 'object') {
					// Source and target values are both objects, extend
					target[key] = deepExtend(target[key], source[key]);
				} else {
					// Incompatible types, overwrite
					target[key] = source[key];
				}
			} else {
				// Primitives or unknown types, overwrite
				target[key] = source[key];
			}
		}
	}

	return target;
};

module.exports = deepExtend({}, defaults, rawConfig);

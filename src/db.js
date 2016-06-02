const Sequelize = require('sequelize');
const config = require('./config');

// Sequelize options that don't belong in the first three arguments
const extraOpts = Object.keys(config.database).reduce((obj, key) => {
	if (key === 'database' || key === 'username' || key === 'password') return obj;
	obj[key] = config.database[key];
	return obj;
}, {});

const DB = new Sequelize(config.database.database, config.database.username, config.database.password, extraOpts);

module.exports = DB;
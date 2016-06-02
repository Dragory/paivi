const Sequelize = require('sequelize');
const DB = require('../db');

const Stats = DB.define('stats', {
	chatId: Sequelize.INTEGER,
	userId: Sequelize.INTEGER,
	messages: Sequelize.INTEGER,
	letters: Sequelize.INTEGER,
	uppercaseLetters: Sequelize.INTEGER,
	lowercaseLetters: Sequelize.INTEGER,
	quote: Sequelize.STRING(128),
	quoteQueue: Sequelize.TEXT,
	arrivalDate: Sequelize.DATE,
}, {
	freezeTableName: true
});

Stats.belongsTo('users', {foreign_key: 'userId'});

module.exports = Stats;
const Sequelize = require('sequelize');
const DB = require('../db');

const Stats = DB.define('stats', {
	chatId: {type: Sequelize.INTEGER, defaultValue: 0},
	userId: {type: Sequelize.INTEGER, defaultValue: 0},
	messages: {type: Sequelize.INTEGER, defaultValue: 0},
	letters: {type: Sequelize.INTEGER, defaultValue: 0},
	uppercaseLetters: {type: Sequelize.INTEGER, defaultValue: 0},
	lowercaseLetters: {type: Sequelize.INTEGER, defaultValue: 0},
	words: {type: Sequelize.INTEGER, defaultValue: 0},
	arrivalDate: Sequelize.DATE
}, {
	freezeTableName: true,
	classMethods: {
		associate(models) {
			Stats.belongsTo(models.Users, {as: 'user', foreignKey: 'userId'});
			Stats.hasMany(models.StatsQuotes, {as: 'quotes', foreignKey: 'statsId'});
		}
	}
});

module.exports = Stats;
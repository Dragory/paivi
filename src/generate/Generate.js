const Sequelize = require('sequelize');
const DB = require('../db');

const Generate = DB.define('generate', {
	chatId: {type: Sequelize.INTEGER, defaultValue: 0},
	prev: Sequelize.STRING(32),
	next: Sequelize.STRING(8),
	weight: {type: Sequelize.INTEGER, defaultValue: 1},
}, {
	timestamps: false,
	freezeTableName: true,
	classMethods: {
		associate(models) {
			
		}
	}
});

module.exports = Generate;
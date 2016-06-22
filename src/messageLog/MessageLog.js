const Sequelize = require('sequelize');
const DB = require('../db');

const Users = DB.define('messageLog', {
	chatId: {type: Sequelize.INTEGER, defaultValue: 0},
	userId: {type: Sequelize.INTEGER, defaultValue: 0},
	messageId: {type: Sequelize.INTEGER, defaultValue: 0},
	message: Sequelize.TEXT,
	loggedAt: Sequelize.DATE,
}, {
	freezeTableName: true,
	timestamps: false
});

module.exports = Users;
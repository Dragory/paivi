const Sequelize = require('sequelize');
const DB = require('../db');

const Users = DB.define('presence', {
	chatId: {type: Sequelize.INTEGER, defaultValue: 0},
	userId: {type: Sequelize.INTEGER, defaultValue: 0},
	lastSeenAt: Sequelize.DATE
}, {
	freezeTableName: true,
	timestamps: false
});

module.exports = Users;
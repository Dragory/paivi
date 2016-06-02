const Sequelize = require('sequelize');
const DB = require('../db');

const Users = DB.define('users', {
	username: Sequelize.STRING(255),
	firstName: Sequelize.STRING,
	lastName: Sequelize.STRING,
}, {
	freezeTableName: true
});

module.exports = Users;
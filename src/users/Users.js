const DB = require('../db');

const Users = DB.define('users', {
	username: DB.STRING(255),
	firstName: {
		type: DB.STRING,
		field: 'first_name'
	},
	lastName: {
		type: DB.STRING,
		field: 'last_name'
	}
}, {
	freezeTableName: true
});

module.exports = Users;
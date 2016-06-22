const Sequelize = require('sequelize');
const DB = require('../db');

const StatsQuotes = DB.define('statsQuotes', {
	statsId: Sequelize.INTEGER,
	body: Sequelize.STRING(128),
	expiresAt: Sequelize.DATE,
}, {
	freezeTableName: true,
	classMethods: {
		associate(models) {
			StatsQuotes.belongsTo(models.Stats, {foreignKey: 'statsId'});
		}
	}
});

module.exports = StatsQuotes;
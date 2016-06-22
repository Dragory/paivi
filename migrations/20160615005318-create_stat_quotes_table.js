'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('statsQuotes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      statsId: Sequelize.INTEGER,
      body: Sequelize.STRING(128),
      expiresAt: Sequelize.DATE,

      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
    .then(() => {
      return queryInterface.addIndex('statsQuotes', ['statsId']);
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('statsQuotes');
  }
};

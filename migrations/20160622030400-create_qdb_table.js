'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('qdb', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      chatId: {type: Sequelize.INTEGER, defaultValue: 0},
      userId: {type: Sequelize.INTEGER, defaultValue: 0},
      originalDate: Sequelize.DATE,
      message: Sequelize.TEXT,
      lastUsedAt: Sequelize.DATE,
    })
    .then(() => {
      return queryInterface.addIndex('qdb', ['chatId', 'userId']);
    })
    .then(() => {
      return queryInterface.addIndex('qdb', ['chatId']);
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('qdb');
  }
};

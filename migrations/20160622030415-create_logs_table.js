'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('messageLog', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      chatId: {type: Sequelize.INTEGER, defaultValue: 0},
      userId: {type: Sequelize.INTEGER, defaultValue: 0},
      messageId: {type: Sequelize.INTEGER, defaultValue: 0},
      message: Sequelize.TEXT,
      loggedAt: Sequelize.DATE,
    })
    .then(() => {
      return queryInterface.addIndex('messageLog', ['messageId']);
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('messageLog');
  }
};

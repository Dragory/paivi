'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('generate', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      chatId: {type: Sequelize.INTEGER, defaultValue: 0},
      prev: Sequelize.STRING(32),
      next: Sequelize.STRING(8),
      weight: {type: Sequelize.INTEGER, defaultValue: 1},
    })
    .then(() => {
      return queryInterface.addIndex('generate', ['chatId', 'prev', 'next'], {
        indicesType: 'UNIQUE'
      });
    })
    .then(() => {
      return queryInterface.addIndex('generate', ['weight']);
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('generate');
  }
};

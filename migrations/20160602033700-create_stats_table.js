'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('stats', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      chatId: {type: Sequelize.INTEGER, defaultValue: 0},
      userId: {type: Sequelize.INTEGER, defaultValue: 0},
      messages: {type: Sequelize.INTEGER, defaultValue: 0},
      letters: {type: Sequelize.INTEGER, defaultValue: 0},
      uppercaseLetters: {type: Sequelize.INTEGER, defaultValue: 0},
      lowercaseLetters: {type: Sequelize.INTEGER, defaultValue: 0},
      words: {type: Sequelize.INTEGER, defaultValue: 0},
      arrivalDate: Sequelize.DATE,

      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
    .then(() => {
      return queryInterface.addIndex('stats', ['chatId', 'userId'], {
        indicesType: 'UNIQUE'
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('stats');
  }
};

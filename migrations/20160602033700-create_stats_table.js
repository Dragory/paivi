'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('stats', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      chatId: Sequelize.INTEGER,
      userId: Sequelize.INTEGER,
      messages: Sequelize.INTEGER,
      letters: Sequelize.INTEGER,
      uppercaseLetters: Sequelize.INTEGER,
      lowercaseLetters: Sequelize.INTEGER,
      quote: Sequelize.STRING(128),
      quoteQueue: Sequelize.TEXT,
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

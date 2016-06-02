'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false
      },

      username: Sequelize.STRING(255),
      firstName: Sequelize.STRING,
      lastName: Sequelize.STRING,

      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
    .then(() => {
      return queryInterface.addIndex('users', ['username']);
    })
    .then(() => {
      return queryInterface.addIndex('users', ['firstName']);
    })
    .then(() => {
      return queryInterface.addIndex('users', ['lastName']);
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};

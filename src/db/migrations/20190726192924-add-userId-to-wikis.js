'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Wikis", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Wikis", "userId")
  }
};

'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Collaborators', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        reference: {
          model: "Users",
          key: "id",
          as: "userId"
        }
      },
      wikiId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        reference: {
          model: "Wikis",
          key: "id",
          as: "wikiId"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Collaborators');
  }
};
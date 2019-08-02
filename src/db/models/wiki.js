'use strict';
module.exports = (sequelize, DataTypes) => {
  var Wiki = sequelize.define('Wiki', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    private: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
  }, {});
  Wiki.associate = function(models) {
    Wiki.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    Wiki.hasMany(models.Collaborator, {
      foreignKey: "wikiId",
      as: "collaborators"
    })
  };
  return Wiki;
};